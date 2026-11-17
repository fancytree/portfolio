import React, { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Download, ListFilter, Printer, ReceiptText, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlideTabs } from './motion';

/**
 * 销售单列表。结构照搬真实 ERP 的 SalesOrderList，换成新的设计语言：
 * 卡片一：标题 + 新建 + 日期范围；卡片二：状态标签 / 搜索 / 筛选（吸顶）→ 表格（单号、客户两列横向固定，表头可筛选）→ 汇总与分页（吸底）。
 */

type Status = 'pending' | 'partial' | 'shipped' | 'cancelled';
type Pay = 'paid' | 'unpaid' | 'written_off';
type Inv = 'none' | 'pending' | 'issued' | 'voided';
type Row = { id: string; no: string; customer: string; branch: string; fulfil: string; payable: number; discount: number; due: number; rep: string; method: string; status: Status; pay: Pay; inv: Inv; created: Date };

const STATUS: Record<Status, { label: string; v: 'warning' | 'info' | 'success' | 'secondary' }> = {
  pending: { label: 'Pending', v: 'warning' }, partial: { label: 'Partially shipped', v: 'info' }, shipped: { label: 'Shipped', v: 'success' }, cancelled: { label: 'Cancelled', v: 'secondary' },
};
const PAY: Record<Pay, { label: string; v: 'success' | 'destructive' | 'secondary' }> = { paid: { label: 'Paid', v: 'success' }, unpaid: { label: 'Unpaid', v: 'destructive' }, written_off: { label: 'Written off', v: 'secondary' } };
const INV: Record<Inv, { label: string; v: 'secondary' | 'warning' | 'success' }> = { none: { label: 'None', v: 'secondary' }, pending: { label: 'Not invoiced', v: 'warning' }, issued: { label: 'Invoiced', v: 'success' }, voided: { label: 'Voided', v: 'secondary' } };
const BRANCHES = ['Main store', 'Milan outlet'];
const REPS = ['Elena Rossi', 'Marco Ricci', 'Chen Hui'];
const CUSTOMERS = ['1042 Luce Beauty Lab', '1018 Studio Aurora', '1031 Belle Mani', '1007 Casa Cosmetica', '1055 Glow Lab', '1023 Nail Atelier Roma', '1061 Vita Beauty', '0000 Walk-in customer', '1012 Studio Forma', '1049 Essenza Lab'];
const FULFIL = ['Pickup', 'Courier', 'Home delivery'];
const METHODS = ['Card', 'Cash', 'Bank transfer', 'Card + Cash', 'Account balance'];
const TODAY = new Date(2026, 10, 17, 18, 0);

/** 演示数据：确定性生成 36 张单；第一张与订单详情页一致（OUT-2026-001248）。 */
const ROWS: Row[] = Array.from({ length: 36 }, (_, i) => {
  const r = (n: number) => (i * 7919 + n * 104729) % 97;
  const status: Status = i === 0 ? 'partial' : (['pending', 'shipped', 'shipped', 'partial', 'shipped', 'pending', 'cancelled'] as Status[])[r(1) % 7];
  const payable = i === 0 ? 823 : Math.round((120 + r(2) * 37 + (r(3) % 10) * 9.5) * 100) / 100;
  const discount = i === 0 ? 0 : r(4) % 3 === 0 ? Math.round(payable * 0.05 * 100) / 100 : 0;
  const pay: Pay = i === 0 ? 'paid' : status === 'cancelled' ? 'written_off' : r(5) % 4 === 0 ? 'unpaid' : 'paid';
  const customer = i === 0 ? CUSTOMERS[0] : CUSTOMERS[r(6) % CUSTOMERS.length];
  const walkIn = customer.startsWith('0000');
  const created = new Date(TODAY.getTime() - (i === 0 ? 2 : i * 0.9 + (r(7) % 5) * 0.3) * 86400000 - (r(8) % 9) * 3600000);
  return {
    id: String(i), no: `OUT-2026-00${1248 - (i === 0 ? 0 : i + 13)}`, customer,
    branch: i === 0 ? 'Main store' : BRANCHES[r(9) % 2], fulfil: walkIn ? '—' : i === 0 ? 'Pickup' : FULFIL[r(10) % 3],
    payable, discount, due: pay === 'unpaid' ? payable : 0, rep: i === 0 ? 'Elena Rossi' : REPS[r(11) % 3],
    method: pay === 'unpaid' ? '—' : i === 0 ? 'Card' : METHODS[r(12) % (walkIn ? 2 : METHODS.length)], status, pay,
    inv: walkIn ? 'none' : i === 0 ? 'pending' : status === 'cancelled' ? 'voided' : (['pending', 'issued', 'issued'] as Inv[])[r(13) % 3], created,
  };
}).sort((a, b) => b.created.getTime() - a.created.getTime());

const eur = (v: number) => '€' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const day = (offset: number) => { const d = new Date(TODAY); d.setDate(d.getDate() + offset); return iso(d); };
/** 常用的四个快捷范围 + 全部；其他范围用右侧的起止日期 */
const PRESETS: { id: string; label: string; range: () => [string, string] }[] = [
  { id: 'today', label: 'Today', range: () => [day(0), day(0)] },
  { id: 'thisMonth', label: 'This month', range: () => ['2026-11-01', day(0)] },
  { id: 'all', label: 'All', range: () => ['', ''] },
];

/** 工具栏控件统一外观：40px 高、12px 圆角、同一种边框、白底、无阴影 */
const CTRL = 'h-9 rounded-xl border border-input bg-card shadow-none';

/** 表头筛选：点表头打开选项，选中后表头出现蓝点。 */
function HeadFilter({ label, value, onChange, options, align = 'start' }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; align?: 'start' | 'end' }) {
  const [open, setOpen] = useState(false);
  const on = value !== 'all';
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={'-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:bg-card hover:text-foreground ' + (on ? 'text-primary-strong' : '')}>
          {label}<ListFilter className="size-3" />{on && <span className="size-1.5 rounded-full bg-primary" />}
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-44 rounded-xl p-1">
        {[{ value: 'all', label: 'All' }, ...options].map((o) => (
          <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
            className="flex h-8 w-full items-center justify-between rounded-lg px-2.5 text-left text-sm transition-colors hover:bg-muted">
            {o.label}{value === o.value && <Check className="size-3.5 text-primary" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export default function Orders({ onOpen }: { onOpen: (id: string) => void }) {
  const [preset, setPreset] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tab, setTab] = useState<'all' | 'pending' | 'shipped' | 'cancelled'>('all');
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');
  const [rep, setRep] = useState('all');
  const [status, setStatus] = useState('all');
  const [pay, setPay] = useState('all');
  const [inv, setInv] = useState('all');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const reset = () => setPage(1);

  const pickPreset = (id: string) => { const p = PRESETS.find((x) => x.id === id)!; const [a, b] = p.range(); setPreset(id); setFrom(a); setTo(b); reset(); };
  const inRange = (r: Row) => (!from || iso(r.created) >= from) && (!to || iso(r.created) <= to);
  // 状态标签：Pending 同时包含部分发货
  const tabMatch = (r: Row, t: string) => t === 'all' || (t === 'pending' ? r.status === 'pending' || r.status === 'partial' : r.status === t);
  const base = useMemo(() => ROWS.filter((r) => inRange(r)
    && (!q || [r.no, r.customer, r.rep].join(' ').toLowerCase().includes(q.toLowerCase()))
    && (branch === 'all' || r.branch === branch) && (rep === 'all' || r.rep === rep)
    && (status === 'all' || r.status === status) && (pay === 'all' || r.pay === pay) && (inv === 'all' || r.inv === inv)), // eslint-disable-line react-hooks/exhaustive-deps
  [from, to, q, branch, rep, status, pay, inv]);
  const rows = base.filter((r) => tabMatch(r, tab));
  const pendingCount = base.filter((r) => tabMatch(r, 'pending')).length;
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const cur = Math.min(page, pages);
  const shown = rows.slice((cur - 1) * size, cur * size);
  const totalPayable = rows.reduce((s, r) => s + r.payable, 0);
  const totalDue = rows.reduce((s, r) => s + r.due, 0);
  const filtered = [branch, rep, status, pay, inv].some((v) => v !== 'all') || !!q;

  // 横向滚动时，单号固定在左侧、打印固定在右侧
  const lead = 'sticky z-[1] bg-card group-hover:bg-[var(--surface-hover)]';
  // 横向滚动时：左侧固定列右边、右侧固定列左边各出现一条竖线和一点投影，提示还有内容在下面
  const [edge, setEdge] = useState({ left: false, right: true });
  const onScrollX = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const next = { left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 };
    if (next.left !== edge.left || next.right !== edge.right) setEdge(next);
  };
  const leftEdge = 'after:pointer-events-none after:absolute after:inset-y-0 after:-right-px after:w-px after:bg-border after:transition-opacity ' + (edge.left ? 'after:opacity-100 shadow-[6px_0_10px_-8px_rgb(16_24_40/0.25)]' : 'after:opacity-0');
  const rightEdge = 'before:pointer-events-none before:absolute before:inset-y-0 before:-left-px before:w-px before:bg-border before:transition-opacity ' + (edge.right ? 'before:opacity-100 shadow-[-6px_0_10px_-8px_rgb(16_24_40/0.25)]' : 'before:opacity-0');
  return (
    <div className="flex h-[calc(100vh-92px)] flex-col gap-4">
      {/* 卡片一：标题 + 新建 + 日期范围 */}
      <div className="flex shrink-0 items-center justify-between gap-4 rounded-2xl bg-card px-6 py-4 shadow-card">
        <h1 className="whitespace-nowrap text-2xl font-semibold tracking-[-0.02em]">Sales orders</h1>
        <div className="flex items-center gap-3">
          <SlideTabs label="Date range" value={preset} onChange={pickPreset}
            items={PRESETS.map((p) => ({ id: p.id, label: p.label }))}
            className={CTRL + ' flex items-center gap-0.5 p-1'}
            itemClassName="h-full rounded-[8px] px-2.5 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
            indicatorClassName="rounded-[8px] bg-primary/10" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPreset('custom'); reset(); }} className={CTRL + ' w-40 tabular-nums'} aria-label="From date" />
            <span>to</span>
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPreset('custom'); reset(); }} className={CTRL + ' w-40 tabular-nums'} aria-label="To date" />
          </div>
        </div>
      </div>

      {/* 卡片二：工具栏 / 表格 / 汇总与分页 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
        {/* 工具栏：① 下划线状态标签 + 操作；② 搜索 + 筛选 */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-6">
          <SlideTabs label="Order status" value={tab} onChange={(v) => { setTab(v); reset(); }}
            items={[{ id: 'all', label: 'All' }, { id: 'pending', label: <>Pending{pendingCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold leading-none tabular-nums" style={{ background: 'var(--attention)', color: 'var(--attention-foreground)' }}>{pendingCount}</span>}</> }, { id: 'shipped', label: 'Shipped' }, { id: 'cancelled', label: 'Cancelled' }]}
            className="-mb-px flex h-14 items-stretch gap-1"
            itemClassName="flex h-full items-center gap-1.5 px-3 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
            indicatorClassName="after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" />
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" aria-label="Refresh" className={CTRL + ' w-9 px-0'} onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 700); }}><RefreshCw className={refreshing ? 'animate-spin' : ''} /></Button>
            <Button variant="outline" className={CTRL + ' px-3.5 text-sm'} disabled={rows.length === 0}><Download />Export Excel</Button>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 px-6 py-3">
          <label className={CTRL + ' flex w-80 items-center gap-2 px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40'}>
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input value={q} onChange={(e) => { setQ(e.target.value); reset(); }} placeholder="Order, customer, phone or note" aria-label="Search orders" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
          <Select value={inv} onValueChange={(v) => { setInv(v); reset(); }} size="lg" triggerClassName={CTRL + ' !h-9 w-40'} options={[{ value: 'all', label: 'All invoices' }, ...Object.entries(INV).map(([v, o]) => ({ value: v, label: o.label }))]} />
          <Select value={rep} onValueChange={(v) => { setRep(v); reset(); }} size="lg" triggerClassName={CTRL + ' !h-9 w-44'} options={[{ value: 'all', label: 'All salespeople' }, ...REPS.map((x) => ({ value: x, label: x }))]} />
          {filtered && <button type="button" className="shrink-0 whitespace-nowrap text-sm font-medium text-primary hover:underline" onClick={() => { setQ(''); setBranch('all'); setRep('all'); setStatus('all'); setPay('all'); setInv('all'); reset(); }}>Clear filters</button>}
        </div>

        <div className="min-h-0 flex-1 overflow-auto" onScroll={onScrollX}>
          <table className="w-max min-w-full table-fixed text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
            <colgroup>
              {[148, 200, 112, 116, 104, 96, 104, 120, 128, 140, 104, 116, 136, 88].map((w, i) => <col key={i} style={{ width: w }} />)}
            </colgroup>
            <thead className="sticky top-0 z-[2]">
              <tr className="text-left text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5">
                <th className={'sticky left-0 z-[3] !pl-6 ' + leftEdge}>Order</th>
                <th>Customer</th>
                <th><HeadFilter label="Branch" value={branch} onChange={(v) => { setBranch(v); reset(); }} options={BRANCHES.map((b) => ({ value: b, label: b }))} /></th>
                <th>Fulfilment</th>
                <th className="text-right">Payable</th>
                <th className="text-right">Discount</th>
                <th className="text-right">Balance due</th>
                <th><HeadFilter label="Salesperson" value={rep} onChange={(v) => { setRep(v); reset(); }} options={REPS.map((x) => ({ value: x, label: x }))} /></th>
                <th>Payment method</th>
                <th><HeadFilter label="Status" value={status} onChange={(v) => { setStatus(v); reset(); }} options={Object.entries(STATUS).map(([v, o]) => ({ value: v, label: o.label }))} /></th>
                <th><HeadFilter label="Payment" value={pay} onChange={(v) => { setPay(v); reset(); }} options={Object.entries(PAY).map(([v, o]) => ({ value: v, label: o.label }))} /></th>
                <th><HeadFilter label="Invoice" value={inv} onChange={(v) => { setInv(v); reset(); }} options={Object.entries(INV).map(([v, o]) => ({ value: v, label: o.label }))} align="end" /></th>
                <th>Created</th>
                <th className={'sticky right-0 z-[3] !pr-6 text-center ' + rightEdge}>Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.length === 0 && <tr><td colSpan={14} className="py-14 text-center text-sm text-muted-foreground">No orders match. Try another date range or clear the filters.</td></tr>}
              {shown.map((r) => (
                <tr key={r.id} onClick={() => onOpen(r.no)} className="group cursor-pointer transition-colors hover:bg-surface-hover [&>td]:px-3 [&>td]:py-2.5">
                  <td className={lead + ' left-0 !pl-6 ' + leftEdge}><span className="font-medium tabular-nums text-primary-strong">{r.no}</span></td>
                  <td className="truncate" title={r.customer}>{r.customer}</td>
                  <td className="truncate text-xs text-muted-foreground">{r.branch}</td>
                  <td className="truncate text-xs text-muted-foreground">{r.fulfil}</td>
                  <td className="text-right tabular-nums">{eur(r.payable)}</td>
                  <td className={'text-right tabular-nums ' + (r.discount > 0 ? 'font-medium text-primary-strong' : 'text-muted-foreground')}>{eur(r.discount)}</td>
                  <td className={'text-right tabular-nums ' + (r.due > 0 ? 'font-semibold' : 'text-muted-foreground')}>{eur(r.due)}</td>
                  <td className="truncate text-xs text-muted-foreground">{r.rep}</td>
                  <td className="truncate text-xs text-muted-foreground">{r.method}</td>
                  <td><Badge variant={STATUS[r.status].v}>{STATUS[r.status].label}</Badge></td>
                  <td><Badge variant={PAY[r.pay].v}>{PAY[r.pay].label}</Badge></td>
                  <td><Badge variant={INV[r.inv].v}>{INV[r.inv].label}</Badge></td>
                  <td className="text-xs tabular-nums text-muted-foreground">{fmtDate(r.created)}</td>
                  <td className={lead + ' right-0 !pr-6 ' + rightEdge}>
                    <div className="flex justify-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button type="button" title="Print receipt" aria-label={`Print receipt ${r.no}`} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"><ReceiptText className="size-4" /></button>
                      <button type="button" title="Print sales order" aria-label={`Print sales order ${r.no}`} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"><Printer className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 汇总与分页 */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-6 py-3 text-sm">
          <div className="flex items-center gap-5 text-muted-foreground">
            <span>Results <span className="font-semibold text-foreground tabular-nums">{rows.length}</span></span>
            <span>Total payable <span className="font-semibold text-foreground tabular-nums">{eur(totalPayable)}</span></span>
            <span>Total due <span className={'font-semibold tabular-nums ' + (totalDue > 0 ? 'text-destructive' : 'text-foreground')}>{eur(totalDue)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={String(size)} onValueChange={(v) => { setSize(Number(v)); reset(); }} triggerClassName="w-28" options={[10, 20, 50].map((n) => ({ value: String(n), label: `${n} / page` }))} />
            <Button variant="outline" size="icon" aria-label="Previous page" disabled={cur <= 1} onClick={() => setPage(cur - 1)}><ChevronLeft /></Button>
            <span className="w-16 text-center tabular-nums text-muted-foreground"><span className="font-medium text-foreground">{cur}</span> / {pages}</span>
            <Button variant="outline" size="icon" aria-label="Next page" disabled={cur >= pages} onClick={() => setPage(cur + 1)}><ChevronRight /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
