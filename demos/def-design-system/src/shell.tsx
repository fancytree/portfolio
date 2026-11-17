import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Boxes, ChevronDown, CircleHelp, FileImage, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Package, Search, Settings, ShoppingCart, Smartphone, Truck, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Kbd } from '@/components/ui/kbd';
import { AccountMenu, NotificationsMenu } from './topbar-menus';

export type Role = 'admin' | 'sales' | 'warehouse' | 'finance';
export const roles: { id: Role; label: string; name: string; initials: string; hint: string }[] = [
  { id: 'admin', label: 'Admin', name: 'Chen', initials: 'CH', hint: 'Whole business' },
  { id: 'sales', label: 'Sales', name: 'Marco', initials: 'MR', hint: 'Orders & customers' },
  { id: 'warehouse', label: 'Warehouse', name: 'Luca', initials: 'LB', hint: 'Fulfilment & stock' },
  { id: 'finance', label: 'Finance', name: 'Giulia', initials: 'GV', hint: 'Cash & receivables' },
];

/** 导航结构取自真实 ERP（Sidebar.tsx / en.ts）。 */
/** counts 记在具体子页面上：收起时父级显示合计，展开后数字回到对应的子页面。 */
type Section = { id: string; label: string; icon: LucideIcon; children?: string[]; counts?: Record<string, number> };
const total = (s: Section) => s.counts ? Object.values(s.counts).reduce((a, b) => a + b, 0) : undefined;
const allGroups: { label: string; sections: Section[] }[] = [
  {
    label: 'Operations',
    sections: [
      { id: 'sales', label: 'Sales', icon: ShoppingCart, children: ['Product sales', 'Sales orders', 'Deliveries', 'Returns', 'Product sales stats'] },
      { id: 'inventory', label: 'Inventory', icon: Boxes, children: ['Stock overview', 'Stock movements', 'Stocktake', 'Write-offs'] },
      { id: 'products', label: 'Products', icon: Package, children: ['Product list', 'Categories', 'Brands'] },
      { id: 'procurement', label: 'Procurement', icon: Truck, children: ['Workspace', 'Replenishment', 'Inbound records', 'Purchase returns', 'Suppliers'] },
    ],
  },
  {
    label: 'Customers & finance',
    sections: [
      { id: 'finance', label: 'Finance', icon: Wallet, children: ['Invoices', 'Sales ledger', 'Customer accounts', 'Receipt review', 'Finance ledger'] },
      { id: 'customers', label: 'Customers', icon: Users, children: ['Customer list', 'Top customers', 'Tier settings'] },
    ],
  },
  {
    label: 'Channels & system',
    sections: [
      { id: 'visual-agent', label: 'Visual agent', icon: FileImage, children: ['Visual workflow'] },
      { id: 'miniprogram', label: 'Mini-program', icon: Smartphone, children: ['Storefront builder', 'Marketing', 'Store accounts'] },
    ],
  },
];
/** Overview 汇总所有模块，不属于任何一个分组，单独放在分组上面。 */
const overviewSection: Section = { id: 'dashboard', label: 'Overview', icon: LayoutDashboard };
const settingsSection: Section = { id: 'settings', label: 'Settings', icon: Settings, children: ['Users', 'Employees', 'Roles & permissions', 'Remarks', 'Audit log', 'Design system'] };

/** 每个角色能看到的模块（权限）和待办数字。数字和该角色 Dashboard 上的待办一致。
 *  pages 省略 = 整个模块可见；只有管理员能进 Settings。 */
type Access = { pages?: string[]; counts?: Record<string, number> };
const ACCESS: Record<Role, Record<string, Access>> = {
  admin: {
    sales: { counts: { 'Sales orders': 17 } },           // 14 pending orders (= Pending tab)
    inventory: { counts: { 'Stock overview': 4 } },      // 4 batches expiring
    products: {},
    procurement: { counts: { 'Inbound records': 1 } },   // PO-0319 partially received
    finance: { counts: { 'Customer accounts': 3 } },     // 3 invoices overdue
    customers: {}, 'visual-agent': {}, miniprogram: {}, settings: {},
  },
  sales: {
    sales: { pages: ['Product sales', 'Sales orders', 'Returns', 'Product sales stats'], counts: { 'Sales orders': 17 } }, // Pending orders (= Pending tab)
    products: { pages: ['Product list'] },
    customers: { pages: ['Customer list', 'Top customers'], counts: { 'Customer list': 6 } },  // Follow-ups
    finance: { pages: ['Customer accounts', 'Sales ledger'], counts: { 'Customer accounts': 8 } }, // Overdue
  },
  warehouse: {
    sales: { pages: ['Deliveries', 'Returns'], counts: { Deliveries: 14 } },                // Pick & pack: to pack + pickups + to ship
    inventory: { counts: { 'Stock movements': 13 } },                                       // Rush to store
    products: { pages: ['Product list'] },
    procurement: { pages: ['Inbound records', 'Purchase returns'], counts: { 'Inbound records': 6 } }, // Incoming
  },
  finance: {
    sales: { pages: ['Sales orders', 'Returns', 'Product sales stats'] },
    procurement: { pages: ['Suppliers'] },
    finance: { counts: { Invoices: 9, 'Receipt review': 9, 'Customer accounts': 8 } },    // To issue, approvals, overdue
    customers: { pages: ['Customer list'] },
  },
};
const scoped = (s: Section, a: Access): Section => ({ ...s, children: a.pages ?? s.children, counts: a.counts });
function navFor(role: Role) {
  const acc = ACCESS[role];
  const groups = allGroups
    .map((g) => ({ label: g.label, sections: g.sections.filter((s) => acc[s.id]).map((s) => scoped(s, acc[s.id])) }))
    .filter((g) => g.sections.length);
  return { groups, settings: acc.settings ? scoped(settingsSection, acc.settings) : null };
}

/** 侧栏的滑动底色。选中块随页面切换在条目间滑动（实心蓝 ↔ 浅蓝也平滑过渡）；悬停块跟随鼠标。
 *  子菜单展开/收起改变布局时直接对齐，不做追赶动画。 */
function useNavGlide(key: string) {
  const glideRef = useRef<HTMLElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const selRef = useRef<HTMLSpanElement>(null);
  const place = (ind: HTMLElement | null, el: Element | null, animate: boolean) => {
    const nav = glideRef.current;
    if (!ind || !nav) return;
    if (!el || el.closest('.collapse-rows[data-open="false"]')) { ind.style.opacity = '0'; return; }
    const nr = nav.getBoundingClientRect(), r = el.getBoundingClientRect();
    const hidden = ind.style.opacity !== '1';
    ind.style.transition = !animate || hidden ? 'none' : '';
    ind.style.transform = `translate(${r.left - nr.left + nav.scrollLeft}px, ${r.top - nr.top + nav.scrollTop}px)`;
    ind.style.width = r.width + 'px';
    ind.style.height = r.height + 'px';
    ind.style.borderRadius = getComputedStyle(el).borderRadius;
    const tone = el.getAttribute('data-nav-active');
    if (tone) ind.dataset.tone = tone;
    if (hidden) { void ind.offsetWidth; ind.style.transition = ''; }
    ind.style.opacity = '1';
  };
  const active = () => glideRef.current?.querySelector('[data-nav-active]') ?? null;
  // 选中项变化：滑过去
  useLayoutEffect(() => { place(selRef.current, active(), true); });
  // 布局变化（子菜单展开动画、窗口尺寸）：直接对齐
  useEffect(() => {
    const nav = glideRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => { place(selRef.current, active(), false); if (hoverRef.current) hoverRef.current.style.opacity = '0'; });
    [...nav.children].forEach((c) => ro.observe(c));
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const onNavHover = (e: React.MouseEvent) => {
    const el = (e.target as Element).closest('[data-nav-item]');
    if (!el || el.hasAttribute('data-nav-active')) { if (hoverRef.current) hoverRef.current.style.opacity = '0'; return; }
    place(hoverRef.current, el, true);
  };
  const onNavLeave = () => { if (hoverRef.current) hoverRef.current.style.opacity = '0'; };
  return { glideRef, hoverRef, selRef, onNavHover, onNavLeave };
}

const pill = 'flex h-10 items-center rounded-xl bg-card shadow-card transition-colors';
const circle = 'flex size-10 items-center justify-center rounded-full bg-card shadow-card transition-colors';

export default function Shell({ children, initial = 'Overview', initialRole = 'admin' }: { children: (page: string, open: (label: string) => void, role: Role) => React.ReactNode; initial?: string; initialRole?: Role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(initial);
  // 角色由 URL（?role=）决定；预览里不再显示 View as 切换
  const [role] = useState<Role>(initialRole);
  const me = roles.find((r) => r.id === role)!;
  const { groups, settings } = navFor(role);
  const focus = page === 'Product sales' || page === 'Storefront builder';
  // 撑满一屏的列表页：底部不再额外留白，卡片底边和侧栏底边对齐
  const fill = page === 'Sales orders' || page === 'Workspace' || page === 'Invoices' || page === 'Store accounts';
  // 单据详情页：去掉顶栏，单据本身就是页面的主角（和开单页一致）
  const detail = page.startsWith('OUT-') || page.startsWith('SO-') || page.startsWith('PO-');

  const { glideRef, hoverRef, selRef, onNavHover, onNavLeave } = useNavGlide([page, open, collapsed, role].join('|'));

  const sectionOf = (label: string) => label.startsWith('SO-') || label.startsWith('OUT-') ? 'sales' : label.startsWith('PO-') ? 'procurement' : [overviewSection, ...groups.flatMap((g) => g.sections), ...(settings ? [settings] : [])].find((s) => s.label === label || s.children?.includes(label))?.id;
  const activeSection = sectionOf(page);

  const renderSection = (s: Section, glide = true) => {
    const Ic = s.icon;
    const isActive = activeSection === s.id;
    const solid = isActive && !s.children; // 当前页就是这一项：实心蓝
    const expanded = !collapsed && open === s.id;
    const sum = total(s);
    const badge = (n: number, onSolid = false) => (
      <span className={'pop-in grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[11px] font-semibold leading-none tabular-nums ' + (onSolid ? 'bg-white/20 text-white' : '')} style={onSolid ? undefined : { background: 'var(--attention)', color: 'var(--attention-foreground)' }}>{n}</span>
    );
    return (
      <div key={s.id}>
        <button
          type="button"
          title={collapsed ? s.label : undefined}
          aria-expanded={s.children ? expanded : undefined}
          onClick={() => {
            if (!s.children) { setPage(s.label); return; }
            if (collapsed) { setCollapsed(false); setOpen(s.id); return; }
            setOpen(expanded ? null : s.id);
          }}
          data-nav-item=""
          data-nav-active={glide && solid ? 'solid' : undefined}
          className={'relative flex h-10 w-full items-center gap-3 rounded-xl pl-2.5 pr-2 text-[0.9375rem] transition-colors duration-300 ' + (collapsed ? 'justify-center !px-0 ' : '') + (solid ? (glide ? '' : 'bg-primary ') + 'font-medium text-primary-foreground' : isActive ? 'font-semibold text-foreground ' + (glide ? '' : 'hover:bg-muted') : 'text-foreground/85 hover:text-foreground ' + (glide ? '' : 'hover:bg-muted'))}
        >
          <Ic className={'size-[18px] shrink-0 ' + (solid ? '' : isActive ? 'text-primary' : 'text-muted-foreground')} />
          {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{s.label}</span>}
          {!collapsed && (sum !== undefined || s.children) && (
            <span className="flex shrink-0 items-center gap-1.5">
              {sum !== undefined && !expanded && badge(sum, solid)}
              {s.children && <ChevronDown className={'size-4 text-muted-foreground transition-transform ' + (expanded ? 'rotate-180' : '')} />}
            </span>
          )}
          {collapsed && sum !== undefined && <span className="absolute right-2 top-2 size-2 rounded-full ring-2 ring-card" style={{ background: 'var(--attention)' }} />}
        </button>
        {s.children && !collapsed && (
          <div className="collapse-rows" data-open={expanded} {...(!expanded && ({ inert: '' } as object))}>
          <div>
          <ul className="mb-1.5 ml-3 mt-1 space-y-0.5 border-l border-border pl-[15px]">
            {s.children.map((c) => {
              const n = s.counts?.[c];
              return (
                <li key={c}>
                  <button type="button" data-nav-item="" data-nav-active={glide && page === c ? 'soft' : undefined} aria-current={page === c ? 'page' : undefined} onClick={() => setPage(c)} className={'relative flex h-9 w-full items-center gap-2 rounded-lg pl-3 pr-2 text-left text-sm transition-colors duration-300 ' + (page === c ? (glide ? '' : 'bg-primary/10 ') + 'font-semibold text-primary-strong' : 'text-foreground/75 hover:text-foreground ' + (glide ? '' : 'hover:bg-muted'))}>
                    <span className="min-w-0 flex-1 truncate whitespace-nowrap">{c}</span>
                    {n !== undefined && badge(n)}
                  </button>
                </li>
              );
            })}
          </ul>
          </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex min-h-screen gap-4 bg-background p-4 font-sans text-foreground"
      style={{ backgroundImage: 'radial-gradient(48rem 24rem at 100% -6%, color-mix(in srgb, var(--warning) 12%, transparent), transparent 70%)' }}
    >
      <aside className={'sticky top-4 flex h-[calc(100vh-2rem)] shrink-0 flex-col rounded-2xl bg-card shadow-card transition-[width] duration-200 ' + (collapsed ? 'w-[4.75rem]' : 'w-60')} aria-label="Sidebar">
        <div className={'flex items-center px-3 pt-4 ' + (collapsed ? 'justify-center' : 'justify-between gap-2')}>
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl text-base font-bold text-white shadow-[0_8px_18px_-8px_color-mix(in_srgb,var(--primary)_80%,transparent)]" style={{ background: 'linear-gradient(140deg, color-mix(in srgb, var(--primary) 70%, white), var(--primary) 70%)' }}>D</span>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="truncate text-lg font-bold leading-tight tracking-tight">DEF ERP</p>
                <p className="truncate text-xs text-muted-foreground">ERP System</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button type="button" title="Collapse sidebar" onClick={() => setCollapsed(true)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <PanelLeftClose className="size-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button type="button" title="Expand sidebar" onClick={() => setCollapsed(false)} className="mx-auto mt-2 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <PanelLeftOpen className="size-4" />
          </button>
        )}

        <nav ref={glideRef} onMouseOver={onNavHover} onMouseLeave={onNavLeave} className="relative mt-5 flex-1 space-y-7 overflow-y-auto px-3 pb-4" aria-label="Main">
          {/* 两块滑动底色：悬停跟随鼠标，选中跟随当前页；都用和分段切换一样的曲线 */}
          <span ref={hoverRef} aria-hidden className="nav-glide pointer-events-none absolute left-0 top-0 bg-muted opacity-0" />
          <span ref={selRef} aria-hidden className="nav-glide pointer-events-none absolute left-0 top-0 opacity-0" />
          <div className="!mb-5">{renderSection(overviewSection)}</div>
          {groups.map((g) => (
            <div key={g.label} className="space-y-0.5">
              {!collapsed && <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">{g.label}</p>}
              {g.sections.map((s) => renderSection(s))}
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-border px-3 pb-3 pt-3">
          {settings && renderSection(settings, false)}
          <button type="button" title={collapsed ? 'Help' : undefined} className={'flex h-10 w-full items-center gap-3 rounded-xl px-2.5 text-[0.9375rem] text-foreground/85 transition-colors hover:bg-muted hover:text-foreground ' + (collapsed ? 'justify-center' : '')}>
            <CircleHelp className="size-[18px] shrink-0 text-muted-foreground" />
            {!collapsed && <span className="min-w-0 flex-1 truncate text-left">Help</span>}
          </button>
        </div>
      </aside>

      {/* 专注模式（开单）：去掉顶栏，内容占满一屏高度，上下仍留和侧栏一样的边距 */}
      <div className={'flex min-w-0 flex-1 flex-col ' + (focus ? 'sticky top-4 h-[calc(100vh-2rem)]' : '')}>
        {!focus && !detail && <header className="flex h-12 items-center gap-2.5">
          <label className={pill + ' w-80 gap-2 px-3.5 text-sm text-muted-foreground'}>
            <Search className="size-4" />
            <input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search orders, customers, SKUs" aria-label="Search" />
            <Kbd>⌘K</Kbd>
          </label>
          <span className={pill + ' ml-auto gap-2 px-3.5 text-sm'}>
            <span className="size-2 rounded-full bg-success" />
            Tue, 17 Nov
          </span>
          <NotificationsMenu role={role} />
          <AccountMenu me={me} />
        </header>}
        <div key={role + page} className={'rise-in flex-1 ' + (focus ? 'min-h-0' : fill ? 'pt-3' : detail ? '' : 'pb-6 pt-3')}>{children(page, setPage, role)}</div>
      </div>
    </div>
  );
}
