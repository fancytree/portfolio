import React, { useMemo, useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlideTabs } from './motion';
import { eur } from './order-deliveries';

/**
 * 采购工作台（非 Agent 版）。对齐原 ERP 的 PoList：标题 + 搜索 + 新建，状态标签，
 * 采购单信息 / 采购概况 / 收货进度 / 供应商规则 / 操作。点采购单进入采购单详情。
 */

export type PoStatus = 'draft' | 'ordered' | 'partial' | 'received' | 'cancelled';
export type PoRow = {
  no: string; supplier: string; created: string; updated: string; status: PoStatus;
  skus: number; pcs: number; amount: number | null; unpriced?: number;
  expected: string; received?: number; ordered?: number;
  minOrder?: number;
};

export const PO_ROWS: PoRow[] = [
  { no: 'PO-2026-0842', supplier: 'MNP (MESAUDA NAIL PRO)', created: '05/08/2026', updated: '17/11/2026', status: 'draft', skus: 13, pcs: 558, amount: 3116.4, expected: '21/08/2026', minOrder: 1500 },
  { no: 'PO-2026-0839', supplier: 'L’Oréal Professionnel', created: '12/11/2026', updated: '16/11/2026', status: 'draft', skus: 9, pcs: 186, amount: 2140.8, unpriced: 2, expected: '28/11/2026', minOrder: 2500 },
  { no: 'PO-2026-0836', supplier: 'Olaplex Italia', created: '10/11/2026', updated: '14/11/2026', status: 'ordered', skus: 6, pcs: 120, amount: 3890, expected: '20/11/2026', received: 0, ordered: 120, minOrder: 1000 },
  { no: 'PO-2026-0827', supplier: 'MNP (MESAUDA NAIL PRO)', created: '28/10/2026', updated: '14/11/2026', status: 'partial', skus: 14, pcs: 540, amount: 2937.6, expected: '04/09/2026', received: 486, ordered: 540, minOrder: 1500 },
  { no: 'PO-2026-0819', supplier: 'Davines', created: '21/10/2026', updated: '07/11/2026', status: 'partial', skus: 11, pcs: 264, amount: 4312.5, expected: '18/11/2026', received: 132, ordered: 264, minOrder: 2000 },
  { no: 'PO-2026-0811', supplier: 'OPI Europe', created: '14/10/2026', updated: '30/10/2026', status: 'received', skus: 18, pcs: 432, amount: 2786.4, expected: '29/10/2026', received: 432, ordered: 432, minOrder: 1200 },
  { no: 'PO-2026-0804', supplier: 'Kérastase', created: '06/10/2026', updated: '22/10/2026', status: 'received', skus: 7, pcs: 96, amount: 1968, expected: '20/10/2026', received: 96, ordered: 96, minOrder: 1500 },
  { no: 'PO-2026-0798', supplier: 'Wella Professionals', created: '30/09/2026', updated: '02/10/2026', status: 'cancelled', skus: 5, pcs: 60, amount: 744, expected: '—', minOrder: 1000 },
];

const STATUS: Record<PoStatus, { label: string; v: 'secondary' | 'info' | 'warning' | 'success' | 'outline' }> = {
  draft: { label: 'Draft', v: 'secondary' },
  ordered: { label: 'Ordered', v: 'info' },
  partial: { label: 'Partially received', v: 'warning' },
  received: { label: 'Received', v: 'success' },
  cancelled: { label: 'Cancelled', v: 'outline' },
};
type Tab = 'all' | 'draft' | 'ordered' | 'received' | 'cancelled';
const inTab = (r: PoRow, t: Tab) => t === 'all' || (t === 'ordered' ? r.status === 'ordered' || r.status === 'partial' : r.status === t);

export default function ProcurementWorkspace({ onOpen }: { onOpen: (no: string) => void }) {
  const [tab, setTab] = useState<Tab>('all');
  const [q, setQ] = useState('');
  const base = useMemo(() => PO_ROWS.filter((r) => !q || (r.no + ' ' + r.supplier).toLowerCase().includes(q.toLowerCase())), [q]);
  const rows = base.filter((r) => inTab(r, tab));
  const count = (t: Tab) => base.filter((r) => inTab(r, t)).length;
  const tabs: { id: Tab; label: string }[] = [{ id: 'all', label: 'All' }, { id: 'draft', label: 'Draft' }, { id: 'ordered', label: 'Ordered' }, { id: 'received', label: 'Received' }, { id: 'cancelled', label: 'Cancelled' }];

  return (
    <div className="flex h-[calc(100vh-92px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-5">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">Purchase workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">Draft, order and receive purchase orders by supplier.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <label className="flex h-9 w-72 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="PO number or supplier" aria-label="Search purchase orders" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
            </label>
            <Button size="lg"><Plus />New PO</Button>
          </div>
        </div>
        <div className="shrink-0 border-y border-border px-6">
          <SlideTabs label="Purchase order status" value={tab} onChange={setTab}
            items={tabs.map((t) => ({ id: t.id, label: <>{t.label}<span className="text-xs tabular-nums opacity-60">{count(t.id)}</span></> }))}
            className="-mb-px -ml-3 flex h-12 items-stretch gap-1"
            itemClassName="flex h-full items-center gap-1.5 px-3 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
            indicatorClassName="after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[46rem] table-fixed text-sm">
            <colgroup><col /><col style={{ width: 200 }} /><col style={{ width: 220 }} /><col style={{ width: 170 }} /><col style={{ width: 150 }} /></colgroup>
            <thead className="sticky top-0 z-[1]">
              <tr className="text-left text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5">
                <th className="!pl-6">Purchase order</th><th>Overview</th><th>Receipt</th><th>Supplier rules</th><th className="!pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => {
                const s = STATUS[r.status];
                const showReceipt = (r.status === 'ordered' || r.status === 'partial' || r.status === 'received') && r.ordered;
                const pct = showReceipt ? Math.round(((r.received ?? 0) / (r.ordered ?? 1)) * 100) : 0;
                const minOk = r.amount != null && r.minOrder != null ? r.amount >= r.minOrder : null;
                return (
                  <tr key={r.no} onClick={() => onOpen(r.no)} className="cursor-pointer align-top transition-colors hover:bg-[var(--surface-hover)] [&>td]:px-3 [&>td]:py-3.5">
                    <td className="!pl-6">
                      <p className="font-mono text-xs font-medium text-primary">{r.no}</p>
                      <p className="mt-1 truncate font-semibold">{r.supplier}</p>
                      <p className="mt-1 flex flex-wrap gap-x-3 text-xs tabular-nums text-muted-foreground"><span>Created {r.created}</span><span>Updated {r.updated}</span></p>
                      <Badge variant={s.v} className="mt-2">{s.label}</Badge>
                    </td>
                    <td>
                      <p className="text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{r.skus}</span> SKUs · <span className="font-semibold tabular-nums text-foreground">{r.pcs}</span> pcs</p>
                      <p className="mt-1.5 text-base font-semibold tabular-nums">{r.amount != null ? eur(r.amount) : '—'}</p>
                      {r.unpriced ? <p className="mt-1 text-xs text-warning-text">{r.unpriced} lines without a price</p> : null}
                    </td>
                    <td>
                      <p className="text-xs text-muted-foreground">Expected <span className="tabular-nums text-foreground">{r.expected}</span></p>
                      {showReceipt ? (
                        <>
                          <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground"><span>{r.received} / {r.ordered} pcs</span><span>{pct}%</span></div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: pct + '%', background: pct >= 100 ? 'var(--success)' : 'var(--primary)' }} /></div>
                        </>
                      ) : <p className="mt-2 text-xs text-muted-foreground">Not receiving yet</p>}
                    </td>
                    <td>
                      {minOk == null ? <span className="text-xs text-muted-foreground">No minimum</span>
                        : minOk ? <p className="flex items-center gap-1 text-xs font-medium text-success-text"><Check className="size-3.5" />Min order met</p>
                          : <p className="text-xs font-medium text-warning-text">Need {eur((r.minOrder ?? 0) - (r.amount ?? 0))} more</p>}
                      <p className="mt-1 text-xs tabular-nums text-muted-foreground">Min {eur(r.minOrder ?? 0)}</p>
                    </td>
                    <td className="!pr-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-start gap-1.5 whitespace-nowrap text-sm font-medium">
                        <button type="button" className="text-primary hover:underline" onClick={() => onOpen(r.no)}>{r.status === 'draft' ? 'Continue editing' : 'View details'}</button>
                        {r.status === 'draft' && <button type="button" className="text-destructive hover:underline">Cancel</button>}
                        {(r.status === 'ordered' || r.status === 'partial') && <button type="button" className="text-primary hover:underline" onClick={() => onOpen(r.no)}>Record arrival</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={5} className="px-6 py-14 text-center text-muted-foreground">No purchase orders match. Try another status or search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3.5 text-sm text-muted-foreground">
          <span className="tabular-nums">{rows.length} purchase orders</span>
          <span className="tabular-nums">Open value <span className="font-semibold text-foreground">{eur(rows.filter((r) => r.status !== 'cancelled' && r.status !== 'received').reduce((s, r) => s + (r.amount ?? 0), 0))}</span></span>
        </div>
    </div>
  );
}
