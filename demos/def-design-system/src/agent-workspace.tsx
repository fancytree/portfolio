import React, { useMemo, useState } from 'react';
import { ArrowRight, Bell, Building2, Check, ChevronDown, ClipboardList, Clock3, Pause, Play, Plus, RefreshCw, Search, Settings2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SlideTabs } from './motion';
import { eur } from './order-deliveries';
import { FormDialog, FormSection } from './form-dialog';
import { AGENT_POS, AGENT_STATUS, NOTICES, OPPORTUNITIES, TASKS, type AgentPo, type AgentStatus, type Opportunity, type Task, type Timing } from './agent-data';
import { AgentPanel, useAgentThread } from './agent-panel';

/**
 * 采购工作台（Agent 版）。左边是采购单列表，右边是 Agent 主动发现的补货机会；
 * 任务、通知、Agent 设置从右上角的工具条打开侧板。Agent 准备计划，人决定是否下单。
 */

type Tab = 'all' | 'draft' | 'review' | 'open' | 'received';
const inTab = (s: AgentStatus, t: Tab) => t === 'all' || (t === 'draft' ? s === 'draft' || s === 'planning' : t === 'review' ? s === 'review' || s === 'owner' : t === 'open' ? s === 'approved' || s === 'ordered' || s === 'partial' : s === 'received');
const TABS: { id: Tab; label: string }[] = [{ id: 'all', label: 'All' }, { id: 'draft', label: 'Drafts' }, { id: 'review', label: 'Needs review' }, { id: 'open', label: 'In progress' }, { id: 'received', label: 'Received' }];

export function TimingChip({ t, compact = false }: { t: Timing; compact?: boolean }) {
  const urgent = t.level === 'urgent';
  return (
    <span title={`Stock covers ${t.stockDays} days; supplier lead time is ${t.leadDays} days.`}
      className={'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 text-xs ' + (urgent ? 'bg-status-danger-subtle' : 'bg-status-warning-subtle')}>
      <Clock3 className={'size-3.5 ' + (urgent ? 'text-destructive' : 'text-warning-text')} />
      <span className={'font-semibold ' + (urgent ? 'text-destructive' : 'text-warning-text')}>{t.label}</span>
      {!compact && <span className="tabular-nums text-muted-foreground">{t.stockDays}d stock · {t.leadDays}d lead</span>}
    </span>
  );
}

export function OpportunityCard({ o, onCreate }: { o: Opportunity; onCreate: () => void }) {
  const [why, setWhy] = useState(false);
  const free = o.goods >= o.freeFrom;
  return (
    <article className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-[0_6px_20px_-12px_rgb(16_24_40/0.25)]" aria-label={`${o.supplier} replenishment`}>
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"><Building2 className="size-[18px]" /></span>
        <div className="min-w-0 flex-1"><p className="truncate font-semibold leading-tight">{o.supplier}</p><p className="truncate text-xs text-muted-foreground">{o.sub}</p></div>
      </div>
      <div className="mt-3"><TimingChip t={o.timing} /></div>
      <p className="mt-3 text-xs text-muted-foreground">Estimated goods</p>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{eur(o.goods)}</p>
      <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{o.coverage}-day coverage · {o.skus} SKUs</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge variant={free ? 'success' : 'secondary'} className="tabular-nums">{free ? 'Free shipping' : `${eur(o.shipping)} shipping`}</Badge>
        {o.goods >= o.minOrder && <Badge variant="secondary">Min order met</Badge>}
      </div>
      <button type="button" aria-expanded={why} onClick={() => setWhy((v) => !v)} className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        Why this supplier?<ChevronDown className={'size-3.5 transition-transform ' + (why ? 'rotate-180' : '')} />
      </button>
      <div className="collapse-rows" data-open={why}><div><p className="mt-2 rounded-lg bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">{o.why}</p></div></div>
      <Button className="mt-3.5 w-full" onClick={onCreate}>Create purchase order<ArrowRight /></Button>
    </article>
  );
}

function SidePanel({ open, onOpenChange, title, description, children, footer }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5"><SheetTitle className="text-lg">{title}</SheetTitle><SheetDescription>{description}</SheetDescription></SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer}
      </SheetContent>
    </Sheet>
  );
}

/** 设置行：标题 + 一句说明 + 右侧开关，开关和标题第一行对齐 */
function SettingRow({ title, hint, checked, onChange, compact = false }: { title: string; hint: string; checked: boolean; onChange: (v: boolean) => void; compact?: boolean }) {
  return (
    <div className={'flex items-start justify-between gap-6 ' + (compact ? 'py-3.5' : '')}>
      <div className="min-w-0"><p className="text-sm font-semibold leading-5">{title}</p><p className="mt-0.5 text-xs text-muted-foreground">{hint}</p></div>
      <Switch aria-label={title} checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}

export function TaskItem({ t, onToggle }: { t: Task; onToggle: () => void }) {
  return (
    <li className="rounded-xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><p className="font-semibold">{t.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{t.supplier} · <span className="font-mono">{t.po}</span></p></div>
        <Badge variant={t.status === 'done' ? 'success' : t.status === 'running' ? 'info' : 'secondary'}>{t.status === 'done' ? 'Completed' : t.status === 'running' ? 'In progress' : 'Paused'}</Badge>
      </div>
      {t.status === 'running' && <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 animate-pulse rounded-full bg-primary" /></div>}
      <p className="mt-2.5 text-sm text-muted-foreground">{t.detail}</p>
      {t.status === 'done' && <ul className="mt-2 space-y-1 text-sm">{t.output.map((o) => <li key={o} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-success-text" />{o}</li>)}</ul>}
      {t.status !== 'done' && <Button size="sm" variant="outline" className="mt-3" onClick={onToggle}>{t.status === 'running' ? <><Pause />Pause</> : <><Play />Resume</>}</Button>}
    </li>
  );
}

const COVERAGE = [30, 45, 60] as const;

/** 新建采购单的供应商：可搜索。聚焦就列出全部，有补货信号的排在前面并标出来 */
export const SUPPLIERS = [
  { id: 'mnp', name: 'MNP', sub: 'Mesauda Nail Pro', signal: 'Order now' },
  { id: 'moroccanoil', name: 'Moroccanoil', sub: 'Professional', signal: 'Order by 25/11' },
  { id: 'keune', name: 'Keune', sub: 'Haircare', signal: 'Order by 02/12' },
  { id: 'davines', name: 'Davines', sub: 'Essential Haircare' },
  { id: 'loreal', name: 'L’Oréal', sub: 'Professionnel' },
  { id: 'olaplex', name: 'Olaplex', sub: 'Professional' },
  { id: 'schwarzkopf', name: 'Schwarzkopf', sub: 'Professional' },
  { id: 'wella', name: 'Wella', sub: 'Professionals' },
];
export function SupplierPicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const sel = SUPPLIERS.find((x) => x.id === value);
  const hits = SUPPLIERS.filter((x) => !q || `${x.name} ${x.sub}`.toLowerCase().includes(q.toLowerCase()));
  if (sel) return (
    <div className="flex h-10 items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 text-sm">
      <span className="truncate"><span className="font-medium">{sel.name}</span><span className="text-muted-foreground"> · {sel.sub}</span></span>
      <button type="button" aria-label="Change supplier" onClick={() => { onChange(null); setQ(''); setOpen(true); }} className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button>
    </div>
  );
  return (
    <div className="relative">
      <label className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input id="po-supplier" aria-label="Supplier" autoFocus value={q} placeholder="Search supplier" onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
      </label>
      {open && (
        <ul className="menu-pop absolute inset-x-0 top-full z-20 mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-popover p-1 shadow-md ring-1 ring-foreground/10">
          {hits.length === 0 ? <li className="px-3 py-2.5 text-sm text-muted-foreground">No supplier found</li> : hits.map((x) => (
            <li key={x.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(x.id); setOpen(false); }} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)]">
              <span className="truncate"><span className="font-medium">{x.name}</span><span className="text-muted-foreground"> · {x.sub}</span></span>
              {x.signal && <span className={'shrink-0 text-xs font-medium ' + (x.signal === 'Order now' ? 'text-destructive' : 'text-warning-text')}>{x.signal}</span>}
            </button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AgentWorkspace({ onOpen }: { onOpen: (no: string, opts?: { generate?: number }) => void }) {
  const [tab, setTab] = useState<Tab>('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<null | 'ask' | 'tasks' | 'notices' | 'controls'>(null);
  const [tasks, setTasks] = useState(TASKS);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [checking, setChecking] = useState(false);
  const [create, setCreate] = useState(false);
  const [coverage, setCoverage] = useState('30');
  const [supplier, setSupplier] = useState<string | null>('mnp');
  const [check, setCheck] = useState(false);
  const [mode, setMode] = useState<'quick' | 'deep'>('deep');
  const [docs, setDocs] = useState(true);
  const [schedule, setSchedule] = useState({ on: true, repeat: 'weekdays', time: '09:00', opps: true, taskNotes: true, delivery: true, readData: true, readDocs: true });
  // 设置先改草稿，点 Save 才写入；关闭面板放弃未保存的改动
  const [draft, setDraft] = useState(schedule);
  const [savedNote, setSavedNote] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(schedule);
  const [rows, setRows] = useState<AgentPo[]>(AGENT_POS);

  const base = useMemo(() => rows.filter((r) => !q || `${r.no} ${r.supplier} ${r.sub}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const shown = base.filter((r) => inTab(r.status, tab));
  const allOn = shown.length > 0 && shown.every((r) => sel.has(r.no));
  const unread = NOTICES.filter((n) => !read.has(n.id)).length;
  const active = tasks.filter((t) => t.status !== 'done').length;

  const startPlan = (days: number) => { setCreate(false); setPanel(null); onOpen('PO-2026-0843', { generate: days }); };
  const runCheck = () => { setCheck(false); setTasks((p) => [{ id: 'chk', title: `${mode === 'deep' ? 'Deep' : 'Quick'} check · ${sel.size} orders`, supplier: [...sel].map((n) => rows.find((r) => r.no === n)?.supplier).join(', '), po: [...sel].join(' · '), status: 'running', detail: 'Reading order data and linked documents. Quantities and approvals stay unchanged.', output: [] }, ...p]); setSel(new Set()); setPanel('tasks'); };

  /* 全局 Ask Agent：只做两件事——起草补货计划，或筛出待核对的单 */
  const thread = useAgentThread([{ role: 'agent', text: 'I can plan purchases, review supplier documents and follow up on deliveries. What would you like to work on?' }]);
  const [askTab, setAskTab] = useState<'agent' | 'evidence' | 'rules' | 'activity'>('agent');
  const onAsk = (text: string) => {
    if (/review|confirm|核对/i.test(text)) { thread.reply({ text: '1 order is waiting for your review: L’Oréal PO-2026-0841, with 3 differences on the supplier confirmation.', actions: [{ label: 'Show orders to review', primary: true, onClick: () => { setTab('review'); setPanel(null); } }] }, 'Checking open orders…'); return; }
    if (/stock|low|库存/i.test(text)) { thread.reply({ text: '3 suppliers are running low. MNP is urgent: 8 days of stock against a 14-day lead time.', card: { title: 'Stock coverage', tone: 'warn', sections: [{ title: 'Suppliers to replenish', rows: OPPORTUNITIES.map((o) => ({ label: o.supplier, detail: `${o.timing.stockDays}d stock · ${o.leadDays}d lead`, after: o.timing.label })) }] }, actions: [{ label: 'Plan MNP for 30 days', primary: true, onClick: () => startPlan(30) }] }, 'Reading stock and sales…'); return; }
    const days = Number(text.match(/(\d{1,3})\s*(?:days?|d\b|天)/i)?.[1] ?? 0) || (/month|月/.test(text) ? 30 : 0);
    if (/mnp|mesauda|plan|replenish/i.test(text) && days) {
      thread.reply({ text: `Ready to prepare an MNP plan covering ${days} days of sales after arrival. I will read sales, stock and supplier rules, then draft quantities you can edit.`,
        card: { title: 'Purchase plan', sections: [{ title: 'Request', rows: [{ label: 'Supplier', detail: 'MNP · Mesauda Nail Pro' }, { label: 'Coverage', detail: `${days} days after arrival` }, { label: 'Output', detail: 'Editable draft · nothing is ordered' }] }] },
        actions: [{ label: 'Create purchase plan', primary: true, onClick: () => startPlan(days) }] }, 'Scoping the request…');
      return;
    }
    thread.reply({ text: /mnp|mesauda|plan|replenish/i.test(text) ? 'How many days of sales should the plan cover?' : 'Which supplier should the plan cover? MNP is the most urgent: 8 days of stock against a 14-day lead time.' }, 'Scoping the request…', 700);
  };

  return (
    <div className="grid h-[calc(100vh-92px)] grid-cols-[minmax(0,1fr)_21rem] gap-4">
      {/* ───────── 左：采购单 ───────── */}
      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-5">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">Purchase workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">The agent drafts and checks. You approve and place every order.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="lg" variant="outline" onClick={() => setPanel('ask')}><Sparkles />Ask agent</Button>
            <Button size="lg" onClick={() => { setCoverage('30'); setSupplier('mnp'); setCreate(true); }}><Plus />New PO</Button>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 border-y border-border px-6">
          <SlideTabs label="Purchase order status" value={tab} onChange={(t) => { setTab(t); setSel(new Set()); }}
            items={TABS.map((t) => ({ id: t.id, label: <>{t.label}<span className="text-xs tabular-nums opacity-60">{base.filter((r) => inTab(r.status, t.id)).length}</span></> }))}
            className="-mb-px -ml-3 flex h-12 items-stretch gap-1"
            itemClassName="flex h-full items-center gap-1.5 whitespace-nowrap px-3 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
            indicatorClassName="after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" />
          <label className="flex h-9 w-56 min-w-0 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="PO number or supplier" aria-label="Search purchase orders" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[52rem] table-fixed text-sm">
            <colgroup><col style={{ width: 52 }} /><col /><col style={{ width: 150 }} /><col style={{ width: 96 }} /><col style={{ width: 120 }} /><col style={{ width: 210 }} /></colgroup>
            <thead className="sticky top-0 z-[1]">
              <tr className="text-left text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5">
                <th className="!pl-6"><Checkbox aria-label="Select all orders" checked={allOn ? true : shown.some((r) => sel.has(r.no)) ? 'indeterminate' : false} onCheckedChange={(v) => setSel(v ? new Set(shown.map((r) => r.no)) : new Set())} /></th>
                <th>Purchase order</th><th>Status</th><th className="!text-right">Coverage</th><th className="!text-right">Goods</th><th className="!pr-6">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.map((r) => {
                const s = AGENT_STATUS[r.status];
                return (
                  <tr key={r.no} onClick={() => onOpen(r.no)} className="cursor-pointer align-top transition-colors hover:bg-[var(--surface-hover)] [&>td]:px-3 [&>td]:py-3.5">
                    <td className="!pl-6" onClick={(e) => e.stopPropagation()}><Checkbox aria-label={`Select ${r.no}`} checked={sel.has(r.no)} onCheckedChange={() => setSel((p) => { const n = new Set(p); if (n.has(r.no)) n.delete(r.no); else n.add(r.no); return n; })} /></td>
                    <td>
                      <p className="flex items-baseline gap-2"><span className="font-semibold">{r.supplier}</span><span className="truncate text-xs text-muted-foreground">{r.sub}</span></p>
                      <p className="mt-1 flex flex-wrap gap-x-3 text-xs tabular-nums text-muted-foreground"><span className="font-mono">{r.no}</span><span>Updated {r.updated}</span></p>
                      {r.timing && <div className="mt-2"><TimingChip t={r.timing} compact /></div>}
                    </td>
                    <td><Badge variant={s.v}>{s.label}</Badge></td>
                    <td className="text-right tabular-nums text-muted-foreground">{r.coverage} days</td>
                    <td className="text-right font-semibold tabular-nums">{eur(r.goods)}</td>
                    <td className="!pr-6">{r.agent && <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><Sparkles className="mt-px size-3.5 shrink-0 text-primary" /><span>{r.agent}</span></p>}</td>
                  </tr>
                );
              })}
              {shown.length === 0 && <tr><td colSpan={6} className="px-6 py-14 text-center text-muted-foreground">No purchase orders match. Try another status or search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex h-[3.75rem] shrink-0 items-center justify-between gap-4 border-t border-border px-6 text-sm text-muted-foreground">
          {sel.size > 0 ? (
            <>
              <span className="flex items-center gap-3"><span className="font-medium text-foreground tabular-nums">{sel.size} selected</span><button type="button" onClick={() => setSel(new Set())} className="text-primary hover:underline">Clear</button></span>
              <Button onClick={() => setCheck(true)}><Sparkles />Check with agent</Button>
            </>
          ) : (
            <>
              <span className="tabular-nums">{shown.length} purchase orders</span>
              <span className="tabular-nums">Open value <span className="font-semibold text-foreground">{eur(shown.filter((r) => r.status !== 'received').reduce((s, r) => s + r.goods, 0))}</span></span>
            </>
          )}
        </div>
      </section>

      {/* ───────── 右：补货机会 ───────── */}
      <aside className="flex min-h-0 flex-col gap-3">
        <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-card p-1.5 shadow-card" role="toolbar" aria-label="Agent tools">
          <button type="button" onClick={() => setPanel('tasks')} className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted"><ClipboardList className="size-4 text-muted-foreground" />Tasks{active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary/12 px-1.5 text-[11px] font-semibold tabular-nums text-primary-strong">{active}</span>}</button>
          <button type="button" onClick={() => setPanel('notices')} className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted"><Bell className="size-4 text-muted-foreground" />Alerts{unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums" style={{ background: 'var(--attention)', color: 'var(--attention-foreground)' }}>{unread}</span>}</button>
          <button type="button" title="Agent settings" aria-label="Agent settings" onClick={() => { setDraft(schedule); setSavedNote(false); setPanel('controls'); }} className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Settings2 className="size-4" /></button>
        </div>
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card shadow-card" aria-label="Suppliers to replenish">
          <header className="flex shrink-0 items-center justify-between gap-2 px-5 pb-3 pt-4">
            <div><h2 className="text-base font-semibold">Suppliers to replenish</h2><p className="text-xs text-muted-foreground">Checked today 09:00 · weekdays</p></div>
            <div className="flex items-center gap-1.5">
              <button type="button" aria-label="Check now" title="Check now" onClick={() => { setChecking(true); setTimeout(() => setChecking(false), 900); }} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><RefreshCw className={'size-4 ' + (checking ? 'animate-spin' : '')} /></button>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-muted px-2 text-xs font-semibold tabular-nums">{OPPORTUNITIES.length}</span>
            </div>
          </header>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4 [scrollbar-width:thin]">
            {OPPORTUNITIES.map((o) => <OpportunityCard key={o.id} o={o} onCreate={() => startPlan(o.coverage)} />)}
          </div>
        </section>
      </aside>

      {/* ───────── 侧板与弹窗 ───────── */}
      <Sheet open={panel === 'ask'} onOpenChange={(o) => !o && setPanel(null)}>
        <SheetContent side="right" showCloseButton={false} className="w-full gap-0 bg-transparent p-3 shadow-none sm:max-w-md">
          <SheetTitle className="sr-only">Ask the procurement agent</SheetTitle><SheetDescription className="sr-only">Across your purchase orders</SheetDescription>
          <AgentPanel className="h-full" thread={thread} onSend={onAsk} tab={askTab} onTab={setAskTab} tabs={{}} subtitle="Across your purchase orders" placeholder="Ask about purchasing…" onClose={() => setPanel(null)}
            suggestions={['Plan MNP for the next 30 days', 'Which orders need review?', 'What is low on stock?']} />
        </SheetContent>
      </Sheet>

      <SidePanel open={panel === 'tasks'} onOpenChange={(o) => !o && setPanel(null)} title="Tasks" description="Agent work across your purchase orders">
        <ul className="space-y-3">{tasks.map((t) => <TaskItem key={t.id} t={t} onToggle={() => setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, status: x.status === 'running' ? 'paused' : 'running' } : x)))} />)}</ul>
      </SidePanel>

      <SidePanel open={panel === 'notices'} onOpenChange={(o) => !o && setPanel(null)} title="Alerts" description="Changes that need your attention">
        <ul className="space-y-3">
          {NOTICES.map((n) => {
            const isRead = read.has(n.id);
            return (
              <li key={n.id} className={'rounded-xl border p-4 ' + (isRead ? 'border-border' : 'border-primary/30 bg-[color-mix(in_srgb,var(--primary)_4%,var(--surface-raised))]')}>
                <p className="flex items-center justify-between gap-3 text-xs text-muted-foreground"><span className="font-semibold text-primary-strong">{n.supplier}</span><span className="tabular-nums">{n.po ? <span className="font-mono">{n.po} · </span> : null}{n.at}</span></p>
                <p className={'mt-1.5 ' + (isRead ? 'font-medium text-muted-foreground' : 'font-semibold')}>{n.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.detail}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">Source · {n.source}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" onClick={() => { setRead((p) => new Set(p).add(n.id)); if (n.po === 'PO-2026-0841') { setTab('review'); setPanel(null); } else if (!n.po) startPlan(30); else { setPanel(null); onOpen(n.po); } }}>{n.action}<ArrowRight /></Button>
                  {!isRead && <Button size="sm" variant="ghost" className="ml-auto text-muted-foreground" onClick={() => setRead((p) => new Set(p).add(n.id))}>Mark as read</Button>}
                </div>
              </li>
            );
          })}
        </ul>
      </SidePanel>

      <SidePanel open={panel === 'controls'} onOpenChange={(o) => !o && setPanel(null)} title="Agent settings" description="Applies to all purchase orders"
        footer={<footer className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface-sunken px-6 py-3.5">
          <span className="min-w-0 truncate text-sm text-muted-foreground">{dirty ? 'Unsaved changes' : savedNote ? 'Saved' : ''}</span>
          <div className="flex shrink-0 gap-2.5">
            <Button variant="outline" size="lg" className="min-w-24" onClick={() => setPanel(null)}>{dirty ? 'Cancel' : 'Close'}</Button>
            <Button size="lg" className="min-w-24" disabled={!dirty} onClick={() => { setSchedule(draft); setSavedNote(true); }}>Save</Button>
          </div>
        </footer>}>
        {/* 补货检查：开关在标题行，计划和状态收进一张卡，关掉时整卡变淡 */}
        <section className="pb-6">
          <SettingRow title="Replenishment checks" hint="Find suppliers to restock from sales, stock and supply rules." checked={draft.on} onChange={(on) => setDraft((p) => ({ ...p, on }))} />
          <div className={'mt-4 rounded-xl border border-border transition-opacity ' + (draft.on ? '' : 'opacity-50')}>
            <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-3 p-4">
              <label className="min-w-0 space-y-1.5"><span className="text-xs text-muted-foreground">Repeat</span>
                <Select value={draft.repeat} disabled={!draft.on} onValueChange={(repeat) => setDraft((p) => ({ ...p, repeat }))} ariaLabel="Repeat" size="lg" triggerClassName="!h-10 w-full rounded-xl" options={[{ value: 'daily', label: 'Every day' }, { value: 'weekdays', label: 'Weekdays' }, { value: 'weekly', label: 'Every Monday' }]} /></label>
              <label className="space-y-1.5"><span className="text-xs text-muted-foreground">Run at</span>
                <Input type="time" value={draft.time} disabled={!draft.on} onChange={(e) => setDraft((p) => ({ ...p, time: e.target.value }))} className="h-10 rounded-xl tabular-nums" /></label>
              <p className="col-span-2 -mt-1 text-xs text-muted-foreground">Europe/Rome time</p>
            </div>
            <dl className="divide-y divide-border border-t border-border text-sm">
              {([['Next check', draft.on ? `${draft.repeat === 'weekly' ? '23/11' : '18/11'} ${draft.time}` : 'Paused'], ['Last check', '17/11 09:00'], ['Found', '3 suppliers']] as const).map(([k, v]) => (
                <div key={k} className="flex h-11 items-center justify-between gap-4 px-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="whitespace-nowrap font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-border py-6">
          <h3 className="text-sm font-semibold">Notify me</h3>
          <div className="mt-1 divide-y divide-border">
            {([['opps', 'New suppliers to replenish', 'When a check finds stock running low.'], ['taskNotes', 'Task results', 'When a task finishes or needs attention.'], ['delivery', 'Late deliveries', 'When goods pass their expected arrival.']] as const).map(([k, t, d]) => (
              <SettingRow key={k} compact title={t} hint={d} checked={draft[k]} onChange={(v) => setDraft((p) => ({ ...p, [k]: v }))} />
            ))}
          </div>
        </section>

        <section className="border-t border-border py-6">
          <h3 className="text-sm font-semibold">What the agent can read</h3>
          <div className="mt-1 divide-y divide-border">
            <SettingRow compact title="Sales and stock" hint="Needed to plan quantities." checked={draft.readData} onChange={(v) => setDraft((p) => ({ ...p, readData: v }))} />
            <SettingRow compact title="Attached documents" hint={draft.readDocs ? 'Confirmations and delivery notes are compared.' : 'Documents are stored but not compared.'} checked={draft.readDocs} onChange={(v) => setDraft((p) => ({ ...p, readDocs: v }))} />
          </div>
        </section>

        <div className="flex gap-3 rounded-xl bg-muted px-4 py-3.5">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">Always yours to do.</span> The agent never places supplier orders, sends emails or changes approvals.</p>
        </div>
      </SidePanel>

      <FormDialog open={create} onOpenChange={setCreate} className="sm:max-w-lg" title="New purchase order" description="The agent prepares an editable plan. Nothing is ordered."
        status={!supplier ? 'Choose a supplier' : Number(coverage) >= 1 && Number(coverage) <= 180 ? undefined : 'Choose 1 to 180 days'} confirmLabel="Create plan" confirmDisabled={!supplier || !(Number(coverage) >= 1 && Number(coverage) <= 180)} onConfirm={() => startPlan(Number(coverage))}>
        <FormSection title="Supplier">
          <SupplierPicker value={supplier} onChange={setSupplier} />
        </FormSection>
        <FormSection title="Sales coverage" hint="Days of sales the stock should cover after the goods arrive.">
          <div className="flex items-center gap-2">
            {COVERAGE.map((d) => <button key={d} type="button" aria-pressed={coverage === String(d)} onClick={() => setCoverage(String(d))} className={'h-10 flex-1 rounded-xl border text-sm font-medium tabular-nums transition-colors ' + (coverage === String(d) ? 'border-primary bg-primary/8 text-primary-strong' : 'border-input hover:bg-[var(--surface-hover)]')}>{d} days</button>)}
            <label className="flex h-10 w-28 items-center gap-1.5 rounded-xl border border-input px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40"><input aria-label="Custom days" inputMode="numeric" value={COVERAGE.includes(Number(coverage) as 30) ? '' : coverage} placeholder="Other" onChange={(e) => setCoverage(e.target.value.replace(/\D/g, '').slice(0, 3))} className="min-w-0 flex-1 bg-transparent tabular-nums outline-none placeholder:text-muted-foreground" /><span className="text-muted-foreground">d</span></label>
          </div>
        </FormSection>
        <FormSection title="What happens next">
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            {['Reads 30-day sales, stock and MNP supply rules', 'Drafts quantities with the reason on each line', 'You edit, export the request and place the order'].map((t, i) => <li key={t} className="flex gap-2.5"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-foreground">{i + 1}</span>{t}</li>)}
          </ol>
        </FormSection>
      </FormDialog>

      <FormDialog open={check} onOpenChange={setCheck} className="sm:max-w-lg" title="Check orders" description={`${sel.size} selected · quantities and approvals stay unchanged`} confirmLabel="Start check" onConfirm={runCheck}>
        <FormSection title="Check mode">
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Check mode">
            {([['quick', 'Quick', 'Order data only · about 10 s'], ['deep', 'Deep', 'Order data and evidence · about 1 min']] as const).map(([v, t, d]) => (
              <button key={v} type="button" role="radio" aria-checked={mode === v} onClick={() => { setMode(v); if (v === 'quick') setDocs(false); }}
                className={'rounded-xl border p-3.5 text-left transition-colors ' + (mode === v ? 'border-primary bg-primary/6 ring-1 ring-primary' : 'border-input hover:bg-[var(--surface-hover)]')}>
                <span className="flex items-center justify-between"><span className="text-sm font-semibold">{t}</span><span className={'grid size-4 place-items-center rounded-full border ' + (mode === v ? 'border-primary bg-primary' : 'border-input')}>{mode === v && <span className="size-1.5 rounded-full bg-white" />}</span></span>
                <span className="mt-1 block text-xs text-muted-foreground">{d}</span>
              </button>
            ))}
          </div>
        </FormSection>
        <FormSection title="Include documents" hint="Read attached supplier confirmations and delivery notes." control={<Switch aria-label="Include documents" checked={docs} onCheckedChange={(v) => { setDocs(v); if (v) setMode('deep'); }} />} />
      </FormDialog>
    </div>
  );
}
