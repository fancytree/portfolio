import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ChevronRight, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { eur } from '../order-deliveries';
import { BASE_LINES, DDT_ONLY, DDT_QTY, applyConfirmation, priceDiffers, type PoLine } from '../purchase-data';
import { SUPPLIER_RULES } from './agent-data';
import { KeyValues } from './agent-panel';
import { ConfidenceDots, PlanScoreDetail, SupplierScoreCard } from './accuracy';
import { planScore, useScores } from './score-store';

/**
 * Agent 面板的 Evidence：列表只说“用了什么”，点进去看到 Agent 实际读到的数据。
 * 计划用的销量、库存、规则、请求，以及上传后解析出的确认单 / DDT 行。
 */

export type EvidenceKey = 'score' | 'supplier' | 'sales' | 'stock' | 'rules' | 'request' | 'confirmation' | 'ddt';
type Key = EvidenceKey;
const LEAD = SUPPLIER_RULES.leadDays;
const PERIOD = '18/10 – 16/11/2026';

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-xl bg-muted px-3 py-2.5"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="mt-0.5 truncate font-semibold tabular-nums">{value}</p></div>;
}

/** 小表：第一列 SKU + 名称，其余右对齐；表头吸顶 */
function MiniTable({ head, rows }: { head: string[]; rows: { key: string; sku: string; name: string; cells: React.ReactNode[]; tone?: 'warn' | 'danger' }[] }) {
  return (
    <table className="w-full table-fixed text-sm">
      <colgroup><col />{head.slice(1).map((h) => <col key={h} style={{ width: 68 }} />)}</colgroup>
      <thead className="sticky -top-4 z-[1]"><tr className="text-xs text-muted-foreground [&>th]:bg-card [&>th]:py-2 [&>th]:font-medium">{head.map((h, i) => <th key={h} className={i ? 'text-right' : 'text-left'}>{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-border border-t border-border">
        {rows.map((r) => (
          <tr key={r.key} className="[&>td]:py-2 [&>td]:align-top">
            <td className="min-w-0 pr-2"><p className="truncate"><span className="font-mono text-xs text-muted-foreground">{r.sku}</span></p><p className={'truncate text-xs ' + (r.tone === 'danger' ? 'font-medium text-destructive' : r.tone === 'warn' ? 'text-warning-text' : 'text-muted-foreground')}>{r.name}</p></td>
            {r.cells.map((c, i) => <td key={i} className="text-right tabular-nums">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SalesDetail() {
  const lines = [...BASE_LINES].sort((a, b) => b.sales30 - a.sales30);
  const max = lines[0].sales30;
  const total = lines.reduce((s, l) => s + l.sales30, 0);
  return (
    <>
      <div className="grid grid-cols-3 gap-2"><Stat label="SKUs" value={lines.length} /><Stat label="Sold" value={`${total} pcs`} /><Stat label="Per day" value={(total / 30).toFixed(1)} /></div>
      <p className="mt-3 text-xs text-muted-foreground">{PERIOD} · shop and mini-program orders, returns excluded.</p>
      <div className="mt-3">
        <MiniTable head={['SKU', 'Sold', 'Per day']} rows={lines.map((l) => ({ key: l.sku, sku: l.sku, name: `${l.productName} ${l.variant}`,
          cells: [<span key="s" className="flex items-center justify-end gap-2"><span className="h-1.5 w-8 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${(l.sales30 / max) * 100}%` }} /></span>{l.sales30}</span>, (l.sales30 / 30).toFixed(1)] }))} />
      </div>
    </>
  );
}

function StockDetail() {
  const lines = BASE_LINES.map((l) => ({ l, days: l.sales30 ? Math.floor(l.stock / (l.sales30 / 30)) : 99 })).sort((a, b) => a.days - b.days);
  const short = lines.filter((x) => x.days < LEAD).length;
  return (
    <>
      <div className="grid grid-cols-3 gap-2"><Stat label="In stock" value={`${BASE_LINES.reduce((s, l) => s + l.stock, 0)} pcs`} /><Stat label="Running low" value={`${short} SKUs`} /><Stat label="Lead time" value={`${LEAD} days`} /></div>
      <p className="mt-3 text-xs text-muted-foreground">Available stock, today 08:00. Reserved order lines are already deducted.</p>
      <div className="mt-3">
        <MiniTable head={['SKU', 'Stock', 'Lasts']} rows={lines.map(({ l, days }) => ({ key: l.sku, sku: l.sku, name: `${l.productName} ${l.variant}`, tone: days < LEAD ? 'warn' : undefined,
          cells: [l.stock, <span key="d" className={days < LEAD ? 'font-semibold text-warning-text' : ''}>{days} d</span>] }))} />
      </div>
    </>
  );
}

function RulesDetail({ onOpenRules }: { onOpenRules: () => void }) {
  return (
    <>
      <p className="mb-3 text-xs text-muted-foreground">{SUPPLIER_RULES.source}</p>
      {SUPPLIER_RULES.groups.slice(1).map((g) => <KeyValues key={g.title} title={g.title} rows={g.rows} />)}
      <div className="mt-2 rounded-xl bg-muted px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">Used for this plan: the 14-day lead time sets how long stock must last, and the €2,000 threshold keeps the order above free shipping.</div>
      <Button variant="outline" size="sm" className="mt-3" onClick={onOpenRules}>Open supply rules</Button>
    </>
  );
}

function RequestDetail({ coverage }: { coverage: number }) {
  return (
    <>
      <KeyValues title="Request" rows={[['Requested by', 'Giulia Rossi · Buyer'], ['When', '17/11/2026 08:02'], ['Started from', 'Replenishment check'], ['Supplier', 'MNP · Mesauda Nail Pro']]} />
      <KeyValues title="What the plan covers" rows={[['Sales coverage', `${coverage} days after arrival`], ['Lead time', `${LEAD} days`], ['Stock must last', `${coverage + LEAD} days`]]} />
      <div className="rounded-xl bg-muted px-3.5 py-3">
        <p className="text-xs font-semibold">How each quantity is calculated</p>
        <p className="mt-1.5 font-mono text-xs leading-relaxed">per day × {coverage + LEAD} d − stock<br />→ safety stock, packs of 12</p>
      </div>
    </>
  );
}

function ConfirmationDetail({ file }: { file: string }) {
  const lines = useMemo(() => applyConfirmation(BASE_LINES), []);
  const diffs = lines.filter((l) => l.risk).length;
  const tone = (l: PoLine) => (l.risk === 'missing' ? 'danger' : l.risk ? 'warn' : undefined) as 'danger' | 'warn' | undefined;
  const note = (l: PoLine) => (l.risk === 'missing' ? 'Missing on confirmation' : l.risk === 'extra' ? (l.confirmedPrice === 0 ? 'Gift · added by supplier' : 'Added by supplier') : l.risk === 'qty' ? `Qty ${l.plannedQty} → ${l.qty}` : l.risk === 'price' ? `Price €${l.estimatedPrice.toFixed(2)} → €${l.confirmedPrice?.toFixed(2)}` : `${l.productName} ${l.variant}`);
  return (
    <>
      <div className="grid grid-cols-3 gap-2"><Stat label="Pages" value="3" /><Stat label="Lines read" value={lines.length} /><Stat label="Differences" value={diffs} /></div>
      <p className="mt-3 text-xs text-muted-foreground">{file} · Conferma d’ordine, Italian · matched by supplier code.</p>
      <div className="mt-3">
        <MiniTable head={['Line', 'Qty', 'Price']} rows={lines.map((l) => ({ key: l.sku, sku: l.sku, name: note(l), tone: tone(l),
          cells: [l.risk === 'missing' ? <span key="q" className="text-destructive">0</span> : l.qty, l.confirmedPrice == null ? null : <span key="p" className={priceDiffers(l) ? 'font-semibold text-warning-text' : ''}>{l.confirmedPrice === 0 ? 'Free' : eur(l.confirmedPrice)}</span>] }))} />
      </div>
    </>
  );
}

function DdtDetail({ file }: { file: string }) {
  const conf = useMemo(() => applyConfirmation(BASE_LINES).filter((l) => l.qty > 0), []);
  const rows = [...conf.map((l) => ({ sku: l.sku, name: `${l.productName} ${l.variant}`, ordered: l.qty, ddt: DDT_QTY[l.sku] ?? 0 })), { sku: DDT_ONLY.sku, name: 'Not on the confirmation', ordered: 0, ddt: DDT_ONLY.ddt }];
  return (
    <>
      <div className="grid grid-cols-3 gap-2"><Stat label="Pages" value="2" /><Stat label="Shipped" value={`${rows.reduce((s, r) => s + r.ddt, 0)} pcs`} /><Stat label="Lines differ" value={rows.filter((r) => r.ddt !== r.ordered).length} /></div>
      <p className="mt-3 text-xs text-muted-foreground">{file} · Documento di trasporto, batch 1 · 11 lot numbers read.</p>
      <div className="mt-3">
        <MiniTable head={['Line', 'Confirmed', 'DDT']} rows={rows.map((r) => ({ key: r.sku, sku: r.sku, name: r.name, tone: r.ordered === 0 ? 'warn' : r.ddt < r.ordered ? 'warn' : undefined,
          cells: [r.ordered || null, <span key="d" className={r.ddt !== r.ordered ? 'font-semibold text-warning-text' : ''}>{r.ddt}</span>] }))} />
      </div>
    </>
  );
}

export function EvidenceView({ coverage, confirmation, ddt, onOpenRules, onUpload, showScore = false, focus }: { coverage: number; confirmation: string | null; ddt?: string | null; onOpenRules: () => void; onUpload?: (kind: 'confirmation' | 'ddt') => void; showScore?: boolean; focus?: { key: Key; n: number } }) {
  const [open, setOpen] = useState<Key | null>(null);
  // 从页头 / 计划卡片点“为什么是这个分数”时直接打开对应详情
  useEffect(() => { if (focus) setOpen(focus.key); }, [focus?.n]); // eslint-disable-line react-hooks/exhaustive-deps
  const ps = planScore(useScores());
  const sold = BASE_LINES.reduce((s, l) => s + l.sales30, 0);
  const below = BASE_LINES.filter((l) => l.sales30 && l.stock / (l.sales30 / 30) < LEAD).length;
  const items: { key: Key; title: string; detail: string; meta: string }[] = [
    { key: 'sales', title: 'Sales history', detail: 'Last 30 days by SKU, used for daily demand.', meta: `${BASE_LINES.length} SKUs · ${sold} pcs sold` },
    { key: 'stock', title: 'Stock snapshot', detail: 'Available stock for every line on this plan.', meta: `${below} below lead time` },
    { key: 'rules', title: 'Supplier rules', detail: 'Lead time, minimum order, shipping and payment.', meta: `MNP · ${SUPPLIER_RULES.version}` },
    { key: 'request', title: 'Purchase request', detail: `Cover ${coverage} days of sales after arrival.`, meta: 'Giulia Rossi' },
  ];
  const docs: { key: Key; label: string; file: string | null; empty: string; hint: string; action: string }[] = [
    { key: 'confirmation', label: 'Supplier confirmation', file: confirmation, empty: 'No supplier confirmation yet', hint: 'Upload the PDF and the agent compares it with your plan, line by line.', action: 'Upload confirmation' },
    ...(ddt !== undefined ? [{ key: 'ddt' as Key, label: 'Delivery note (DDT)', file: ddt, empty: 'No delivery note yet', hint: 'Upload the DDT when goods arrive. Actual is filled from it.', action: 'Upload DDT' }] : []),
  ];
  const titles: Record<Key, string> = { score: 'Plan score', supplier: 'MNP track record', sales: 'Sales history', stock: 'Stock snapshot', rules: 'Supplier rules', request: 'Purchase request', confirmation: 'Supplier confirmation', ddt: 'Delivery note' };

  if (open) return (
    <div className="rise-in">
      <button type="button" onClick={() => setOpen(null)} className="-ml-1 mb-3 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Evidence</button>
      <h3 className="mb-3 text-base font-semibold">{titles[open]}</h3>
      {open === 'score' && <PlanScoreDetail onSupplier={() => setOpen('supplier')} />}
      {open === 'supplier' && <SupplierScoreCard sid="mnp" />}
      {open === 'sales' && <SalesDetail />}
      {open === 'stock' && <StockDetail />}
      {open === 'rules' && <RulesDetail onOpenRules={onOpenRules} />}
      {open === 'request' && <RequestDetail coverage={coverage} />}
      {open === 'confirmation' && confirmation && <ConfirmationDetail file={confirmation} />}
      {open === 'ddt' && ddt && <DdtDetail file={ddt} />}
    </div>
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Data the agent used for this order.</p>
      {showScore && (
        /* 计划评分卡：预计分 + 区间 + 扣分来源，一眼看到分数从哪来；整卡可点进详情 */
        <button type="button" onClick={() => setOpen('score')} className="group relative w-full overflow-hidden rounded-2xl border border-border text-left shadow-[0_1px_2px_rgb(16_24_40/0.04)] transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-[0_8px_24px_-14px_color-mix(in_srgb,var(--primary)_45%,transparent)]"
          style={{ background: 'linear-gradient(160deg, color-mix(in srgb, var(--primary) 7%, var(--surface-raised)) 0%, var(--surface-raised) 55%)' }}>
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-foreground">Plan score</span>
              <ConfidenceDots sid="mnp" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-[2rem] font-semibold leading-none tracking-tight tabular-nums">{ps.expected}<span className="text-lg text-muted-foreground">%</span></span>
              <span className="text-xs tabular-nums text-muted-foreground">expected · likely {ps.low}–{ps.high}%</span>
            </div>
            {/* 50–100% 区间条 */}
            <div className="relative mt-3 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--foreground)_7%,transparent)]" aria-hidden>
              <span className="absolute inset-y-0 rounded-full" style={{ left: `${(ps.low - 50) * 2}%`, width: `${(ps.high - ps.low) * 2}%`, background: 'color-mix(in srgb, var(--primary) 35%, transparent)' }} />
              <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card" style={{ left: `${(ps.expected - 50) * 2}%` }} />
            </div>
          </div>
        </button>
      )}
      <ul className="space-y-2">
        {items.map((e) => (
          <li key={e.key}>
            <button type="button" onClick={() => setOpen(e.key)} className="group flex w-full items-center gap-3 rounded-xl bg-muted px-3.5 py-3 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_6%,var(--surface-sunken))]">
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3 text-sm"><span className="font-semibold">{e.title}</span><span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">{e.key === 'stock' && <AlertTriangle className="size-3 text-warning-text" />}{e.meta}</span></span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{e.detail}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground">Documents</h3>
        {docs.map((d) => d.file ? (
          <button key={d.key} type="button" onClick={() => setOpen(d.key)} className="group flex w-full items-center gap-3 rounded-xl bg-muted px-3.5 py-3 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_6%,var(--surface-sunken))]">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card text-destructive"><FileText className="size-4" /></span>
            <span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">{d.label}</span><span className="block truncate text-sm font-medium">{d.file}</span></span>
            <Badge variant="secondary">Parsed</Badge>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : (
          /* 空状态：说明上传后会发生什么，主按钮直接打开采购单上的上传弹窗 */
          <div key={d.key} className="flex flex-col items-center rounded-xl border border-dashed border-border px-5 py-6 text-center">
            <span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground"><FileText className="size-5" /></span>
            <p className="mt-3 text-sm font-semibold">{d.empty}</p>
            <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-muted-foreground">{d.hint}</p>
            {onUpload && <Button size="sm" className="mt-4" onClick={() => onUpload(d.key as 'confirmation' | 'ddt')}><Upload />{d.action}</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
