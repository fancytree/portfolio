import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, BadgeEuro, Bell, Boxes, CheckCheck, ChevronRight, CircleHelp, FileText, Globe, Keyboard, LogOut, PackageCheck, PhoneCall, Settings2, Store, Truck, UserRound, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SlideTabs } from './motion';
import type { Role } from './shell';

/** 顶栏的两个下拉：通知中心、账户菜单。结构参考常见 ERP（Odoo / NetSuite / Shopify Admin）：
 *  通知按时间分组、未读有圆点、可一键已读、底部进入完整列表；账户菜单是个人信息 + 偏好 + 退出。 */

/* ───────── 弹层：点外面或按 Esc 关闭；从右上角展开 ───────── */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  return { open, setOpen, ref };
}
const panel = 'menu-pop absolute right-0 top-12 z-50 origin-top-right rounded-2xl border border-border bg-card shadow-[0_16px_40px_-12px_rgb(16_24_40/0.18),0_4px_10px_-4px_rgb(16_24_40/0.08)]';
const circle = 'flex size-10 items-center justify-center rounded-full bg-card shadow-card transition-colors';

/* ───────── 通知 ───────── */
type Note = { id: string; icon: LucideIcon; tone: string; title: string; detail: string; time: string; today: boolean; unread: boolean };
const n = (id: string, icon: LucideIcon, tone: string, title: string, detail: string, time: string, unread = true, today = true): Note => ({ id, icon, tone, title, detail, time, unread, today });

const NOTES: Record<Role, Note[]> = {
  admin: [
    n('a1', AlertTriangle, 'var(--destructive-tint)', '3 invoices overdue', 'Finance · €2,480 past due', '12 min ago'),
    n('a2', Truck, 'var(--viz-4)', 'PO-0319 partially received', 'Procurement · 2 SKUs short', '40 min ago'),
    n('a3', Boxes, 'var(--warning)', '4 batches expiring within 30 days', 'Warehouse · Milan', '2 h ago', false),
    n('a4', FileText, 'var(--viz-1)', 'Weekly report is ready', 'Net sales, margin and orders for W46', 'Yesterday', false, false),
    n('a5', UserRound, 'var(--viz-5)', 'Giulia approved 6 payments', 'Finance · €4,820', 'Yesterday', false, false),
  ],
  sales: [
    n('s1', BadgeEuro, 'var(--viz-5)', 'Studio Aurora paid €460', 'Bank transfer · matched to INV-2026-0412', '8 min ago'),
    n('s2', PackageCheck, 'var(--viz-1)', 'SO-0842 is packed', 'Luce Beauty Lab · BRT pickup at 15:30', '25 min ago'),
    n('s3', AlertTriangle, 'var(--destructive-tint)', 'Glow Lab is 34 days late', '€780 outstanding', '1 h ago', false),
    n('s4', PhoneCall, 'var(--warning)', 'Belle Mani has gone quiet', 'No order in 19 days', 'Yesterday', false, false),
  ],
  warehouse: [
    n('w1', Zap, 'var(--destructive-tint)', 'Rush to store: OUT-2026-001261', 'Walk-in · 9 SC · send to store now', '3 min ago'),
    n('w2', Store, 'var(--warning)', 'Store restock needed', 'Young Color 7.1 · 4 left in store', '18 min ago'),
    n('w3', PackageCheck, 'var(--viz-5)', 'L’Oréal goods have been received', 'PO-2026-0842 · 128 items stocked in', '1 h ago', false),
    n('w4', Truck, 'var(--viz-1)', 'BRT pickup confirmed', 'Today 15:30 · 3 parcels', 'Yesterday', false, false),
  ],
  finance: [
    n('f1', BadgeEuro, 'var(--warning)', '9 payments waiting for approval', 'Bank transfer, check and post office', '5 min ago'),
    n('f2', FileText, 'var(--viz-1)', '9 orders shipped, not invoiced', 'Oldest shipped 3 days ago', '30 min ago'),
    n('f3', AlertTriangle, 'var(--destructive-tint)', 'Casa Cosmetica is 27 days late', '€1,860 outstanding', '2 h ago', false),
    n('f4', CheckCheck, 'var(--viz-5)', 'October ledger closed', 'Exported by Giulia', 'Yesterday', false, false),
  ],
};

export function NotificationsMenu({ role }: { role: Role }) {
  const { open, setOpen, ref } = usePopover();
  const [notes, setNotes] = useState(NOTES[role]);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  useEffect(() => { setNotes(NOTES[role]); setTab('all'); }, [role]);
  const unread = notes.filter((x) => x.unread).length;
  const shown = tab === 'unread' ? notes.filter((x) => x.unread) : notes;
  const read = (id: string) => setNotes((p) => p.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  const groups = [['Today', shown.filter((x) => x.today)], ['Earlier', shown.filter((x) => !x.today)]] as const;

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label={`Notifications, ${unread} unread`} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((v) => !v)} className={circle + ' relative hover:bg-surface-hover ' + (open ? 'bg-surface-hover' : '')}>
        <Bell className="size-4" />
        {unread > 0 && <span className="pop-in absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive ring-2 ring-card" />}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className={panel + ' flex w-[24rem] flex-col'}>
          <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4">
            <p className="text-base font-semibold">Notifications</p>
            <button type="button" disabled={!unread} onClick={() => setNotes((p) => p.map((x) => ({ ...x, unread: false })))} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted disabled:text-muted-foreground disabled:hover:bg-transparent">
              <CheckCheck className="size-3.5" />Mark all as read
            </button>
          </div>
          <div className="px-4 pb-2">
            <SlideTabs label="Filter notifications" value={tab} onChange={setTab}
              items={[{ id: 'all', label: 'All' }, { id: 'unread', label: <>Unread{unread > 0 && <span className="ml-1.5 tabular-nums opacity-70">{unread}</span>}</> }]}
              className="flex h-8 w-fit items-center gap-0.5 rounded-[10px] border border-border p-0.5"
              itemClassName="h-full rounded-[7px] px-3 text-xs" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
              indicatorClassName="rounded-[7px] bg-primary/10" />
          </div>
          <div className="max-h-[22rem] overflow-y-auto px-2 pb-2 [scrollbar-width:thin]">
            {shown.length === 0 && <p className="px-3 py-10 text-center text-sm text-muted-foreground">You’re all caught up.</p>}
            {groups.map(([label, list]) => list.length > 0 && (
              <div key={label}>
                <p className="px-2.5 pb-1 pt-2 text-xs font-medium text-muted-foreground">{label}</p>
                {list.map((x) => {
                  const Ic = x.icon;
                  return (
                    <button key={x.id} type="button" onClick={() => read(x.id)} className="group flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-muted">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: `color-mix(in srgb, ${x.tone} 12%, var(--surface-raised))`, color: `color-mix(in srgb, ${x.tone} 80%, var(--foreground))` }}><Ic className="size-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className={'block truncate text-sm ' + (x.unread ? 'font-semibold' : 'font-medium text-foreground/80')}>{x.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{x.detail}</span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground/80">{x.time}</span>
                      </span>
                      <span className={'mt-1.5 size-2 shrink-0 rounded-full transition-opacity ' + (x.unread ? 'bg-primary' : 'opacity-0')} aria-label={x.unread ? 'Unread' : undefined} />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-2">
            <button type="button" className="group flex h-9 w-full items-center justify-center gap-1 rounded-lg text-sm font-medium text-primary transition-colors hover:bg-muted">
              View all notifications<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── 账户 ───────── */
const EMAIL: Record<Role, string> = { admin: 'chen@defbeauty.it', sales: 'marco@defbeauty.it', warehouse: 'luca@defbeauty.it', finance: 'giulia@defbeauty.it' };

export function AccountMenu({ me }: { me: { id: Role; name: string; label: string; initials: string } }) {
  const { open, setOpen, ref } = usePopover();
  const item = 'flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-foreground';
  const Row = ({ icon: Ic, label, hint }: { icon: LucideIcon; label: string; hint?: React.ReactNode }) => (
    <button type="button" role="menuitem" onClick={() => setOpen(false)} className={item}>
      <Ic className="size-4 shrink-0 text-muted-foreground" /><span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {hint && <span className="shrink-0 text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Account menu" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={circle + ' text-xs font-medium hover:bg-surface-hover ' + (open ? 'bg-surface-hover' : '')}>{me.initials}</button>
      {open && (
        <div role="menu" className={panel + ' w-64 p-1.5'}>
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary-strong">{me.initials}</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">{me.name}</p>
              <p className="truncate text-xs text-muted-foreground">{EMAIL[me.id]}</p>
              <span className="mt-1 inline-flex h-5 items-center rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">{me.label}</span>
            </div>
          </div>
          <div className="my-1 border-t border-border" />
          <Row icon={UserRound} label="My profile" />
          <Row icon={Settings2} label="Preferences" />
          <Row icon={Globe} label="Language" hint="English" />
          <Row icon={Keyboard} label="Keyboard shortcuts" hint={<kbd className="font-sans">⌘ /</kbd>} />
          <Row icon={CircleHelp} label="Help & support" />
          <div className="my-1 border-t border-border" />
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={item + ' hover:!text-destructive'}>
            <LogOut className="size-4 shrink-0 text-muted-foreground" /><span className="flex-1 text-left">Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
