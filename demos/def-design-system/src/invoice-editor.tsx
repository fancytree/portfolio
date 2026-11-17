import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Download, Eye, Plus, Printer, Save, Search, Trash2, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { SlideTabs } from './motion';
import { eur } from './order-deliveries';
import { CUSTOMERS, MP_CODE, OPERATORS, PAYMENT_METHODS, customerLabel, it2, orderTotal, r2, type InvLine, type InvOrder, type Invoice, type PreviewLine } from './invoice-data';

/**
 * 新建发票：对齐原 ERP FinanceInvoices 的开票弹窗。
 * 左：客户 / 开票至、已付款筛选、按订单分组的商品行（数量、本次开票金额）；右：发票总额、加行、付款方式、开票人、备注。
 * 输入发票总额会按订单顺序勾选商品，直到最接近总额；商品合计和付款合计都要等于发票总额才能预览。
 */

const DIALOG = 'flex flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 shadow-[0_24px_64px_-16px_rgb(16_24_40/0.3),0_0_0_1px_rgb(16_24_40/0.06)]';
const CATALOG = [
  { code: 'SHIP-EXP', name: 'Spese di spedizione express', unit: '', price: 15, shipping: true },
  { code: 'LP-VC-500', name: 'Shampoo Vitamino Color 500ml', unit: 'PZ', price: 13 },
  { code: 'OLA-N7-30', name: 'Olaplex Nº7 Bonding Oil 30ml', unit: 'PZ', price: 66.5 },
  { code: 'ADJ', name: 'Arrotondamento / Adjustment', unit: '', price: 1 },
];

type Pick = { qty: number; amount: number };
export type IssuePayload = { invoice: Omit<Invoice, 'id' | 'no' | 'date' | 'status' | 'entered'>; consumed: Record<string, Pick> };

function Field({ label, required, htmlFor, children, className = '' }: { label: string; required?: boolean; htmlFor?: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><label htmlFor={htmlFor} className="mb-1.5 block text-xs text-muted-foreground">{label}{required && <span className="ml-0.5 text-destructive">*</span>}</label>{children}</div>;
}

/* ───────── 预览：意大利电子发票格式 ───────── */
export function InvoicePreview({ open, onClose, customer, invoiceTo, lines, payments, total, number, date, onNumber, onDate, footer, title = 'Invoice preview' }: {
  open: boolean; onClose: () => void; customer: string; invoiceTo?: string; lines: PreviewLine[]; payments: { method: string; amount: number }[]; total: number;
  number: string; date: string; onNumber?: (v: string) => void; onDate?: (v: string) => void; footer: React.ReactNode; title?: string;
}) {
  const taxable = r2(total / 1.22);
  const dates = [...new Set(lines.map((l) => l.date))];
  let n = 0;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()} className={DIALOG + ' h-[min(52rem,90vh)] sm:max-w-4xl'}>
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5">
          <div><DialogTitle className="text-lg font-semibold tracking-[-0.01em]">{title}</DialogTitle><DialogDescription className="mt-1 text-sm text-muted-foreground">Line preview, as the tax office reads it</DialogDescription></div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Download />Export Excel</Button>
            <Button variant="outline"><Printer />Print / Export PDF</Button>
            <DialogClose className="-mr-2 grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close"><X className="size-4" /></DialogClose>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 [scrollbar-width:thin]">
          <div className="overflow-hidden rounded-xl border border-border text-[13px]">
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="space-y-0.5 p-4">
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Cedente/prestatore (fornitore)</p>
                <p>Identificativo fiscale ai fini IVA: <span className="font-semibold tabular-nums">IT00000000000</span></p>
                <p>Codice fiscale: <span className="tabular-nums">00000000000</span></p>
                <p>Denominazione: <span className="font-semibold">BEAUTY DEF S.R.L</span></p>
                <p>Regime fiscale: RF01</p>
              </div>
              <div className="space-y-0.5 p-4">
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Cessionario/committente (cliente)</p>
                <p className="text-muted-foreground">Identificativo fiscale ai fini IVA: —</p>
                <p>Denominazione: <span className="font-semibold">{invoiceTo && invoiceTo !== 'Customer account (HQ)' ? invoiceTo : customer}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-[10rem_minmax(0,1fr)_11rem] border-t border-border bg-muted text-xs font-medium text-muted-foreground [&>div]:px-4 [&>div]:py-2">
              <div>Tipologia documento</div><div>Numero documento</div><div>Data documento</div>
            </div>
            <div className="grid grid-cols-[10rem_minmax(0,1fr)_11rem] items-center border-t border-border [&>div]:px-4 [&>div]:py-1.5">
              <div>TD01 fattura</div>
              <div>{onNumber ? <Input aria-label="Numero documento" placeholder="Enter number" value={number} onChange={(e) => onNumber(e.target.value)} className="h-8 rounded-lg" /> : <span className="tabular-nums">{number || '—'}</span>}</div>
              <div>{onDate ? <Input type="date" aria-label="Data documento" value={date} onChange={(e) => onDate(e.target.value)} className="h-8 rounded-lg tabular-nums" /> : <span className="tabular-nums">{date || '—'}</span>}</div>
            </div>
            <div className="border-t border-border bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">Modalità di pagamento</div>
            <div className="border-t border-border px-4 py-2">{payments.map((p) => <p key={p.method}>{MP_CODE[p.method] ?? p.method}: <span className="tabular-nums">€ {it2(p.amount)}</span></p>)}</div>
            <table className="w-full border-t border-border text-[13px]">
              <thead><tr className="bg-muted text-xs font-medium text-muted-foreground [&>th]:px-3 [&>th]:py-2">
                <th className="w-10 text-left">#</th><th className="text-left">Codice</th><th className="text-left">Descrizione</th><th className="text-right">Qtà</th><th className="text-right">Unitario</th><th>UM</th><th>Sconto</th><th className="text-right">IVA</th><th className="text-right">Totale</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {dates.map((d) => (
                  <React.Fragment key={d}>
                    <tr><td colSpan={9} className="bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary-strong tabular-nums">{d}</td></tr>
                    {lines.filter((l) => l.date === d).map((l) => { n += 1; return (
                      <tr key={n} className="[&>td]:px-3 [&>td]:py-1.5 tabular-nums">
                        <td className="text-muted-foreground">{n}</td><td className="font-mono text-xs">{l.code}</td><td className={l.shipping ? 'italic' : ''}>{l.name}</td>
                        <td className="text-right">{l.qty}</td><td className="text-right">{it2(l.qty ? l.amount / l.qty : l.amount)}</td><td className="text-center text-muted-foreground">{l.unit}</td>
                        <td className="text-center text-muted-foreground">NR</td><td className="text-right">22,00</td><td className="text-right font-medium">{it2(l.amount)}</td>
                      </tr>
                    ); })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border bg-muted px-4 py-2 text-center text-xs font-semibold text-muted-foreground">RIEPILOGHI IVA E TOTALI</div>
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_7rem_9rem_9rem] border-t border-border text-xs text-muted-foreground [&>div]:px-3 [&>div]:py-2 [&>div:not(:first-child)]:text-right">
              <div>Esigibilità IVA / riferimenti normativi</div><div>%IVA</div><div>Spese accessorie</div><div>Totale imponibile</div><div>Totale imposta</div>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_7rem_9rem_9rem] border-t border-border tabular-nums [&>div]:px-3 [&>div]:py-2 [&>div:not(:first-child)]:text-right">
              <div>I (esigibilità immediata)</div><div>22,00</div><div>0,00</div><div>{it2(taxable)}</div><div>{it2(r2(total - taxable))}</div>
            </div>
            <div className="flex items-baseline justify-end gap-3 border-t border-border px-4 py-3">
              <span className="text-sm text-muted-foreground">Totale documento</span><span className="text-lg font-semibold tabular-nums text-primary-strong">€ {it2(total)}</span>
            </div>
          </div>
        </div>
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface-sunken px-6 py-3.5">{footer}</footer>
      </DialogContent>
    </Dialog>
  );
}

/* ───────── 客户搜索 ───────── */
function CustomerPicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const c = CUSTOMERS.find((x) => x.id === value);
  const hits = CUSTOMERS.filter((x) => !q || customerLabel(x).toLowerCase().includes(q.toLowerCase()));
  if (c) return (
    <div className="flex h-10 items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 text-sm">
      <span className="truncate font-medium">{customerLabel(c)}</span>
      <button type="button" aria-label="Clear customer" onClick={() => { onChange(null); setQ(''); }} className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-4" /></button>
    </div>
  );
  return (
    <div className="relative">
      <label className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input id="invoice-customer" aria-label="Customer" value={q} placeholder="Search customer code or name" onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
      </label>
      {open && q && (
        <ul className="menu-pop absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl bg-popover p-1 shadow-md ring-1 ring-foreground/10">
          {hits.length === 0 ? <li className="px-3 py-2.5 text-sm text-muted-foreground">No customer found</li> : hits.map((x) => (
            <li key={x.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(x.id); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)]">
              <span><span className="tabular-nums text-muted-foreground">{x.code}</span> <span className="font-medium">{x.name}</span></span><span className="text-xs text-muted-foreground">{x.branches[0]}</span>
            </button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────── 开票弹窗 ───────── */
export function InvoiceEditor({ open, onClose, orders, initialCustomer = null, initialOrder = null, onSaveDraft, onIssue }: {
  open: boolean; onClose: () => void; orders: InvOrder[]; initialCustomer?: string | null; initialOrder?: string | null;
  onSaveDraft: (p: IssuePayload) => void; onIssue: (p: IssuePayload & { no: string; date: string }) => void;
}) {
  const [customer, setCustomer] = useState<string | null>(null);
  const [invoiceTo, setInvoiceTo] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [picks, setPicks] = useState<Record<string, Pick>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [totalStr, setTotalStr] = useState('');
  const [payments, setPayments] = useState<{ method: string; amount: number }[]>([{ method: 'Card', amount: 0 }]);
  const [paymentsEdited, setPaymentsEdited] = useState(false);
  const [operator, setOperator] = useState('');
  const [notes, setNotes] = useState('');
  const [manual, setManual] = useState<InvLine[]>([]);
  const [sku, setSku] = useState('');
  const [preview, setPreview] = useState(false);
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [tried, setTried] = useState(false);
  const opened = useRef(false);

  const customerOrders = useMemo(() => orders.filter((o) => o.customer === customer), [orders, customer]);
  const groups = useMemo(() => {
    const g = customerOrders.filter((o) => filter === 'all' || (filter === 'paid' ? o.paid : !o.paid)).map((o) => ({ order: o as InvOrder | null, lines: o.lines }));
    return manual.length ? [...g, { order: null, lines: manual }] : g;
  }, [customerOrders, filter, manual]);
  const eligible = (l: InvLine) => !l.gift && l.amount > 0;
  const shownLines = groups.flatMap((g) => g.lines);
  const selectable = shownLines.filter(eligible);
  const pickOf = (l: InvLine) => picks[l.key] ?? { qty: l.qty, amount: l.amount };
  const selectedLines = selectable.filter((l) => selected.has(l.key));
  const lineTotal = r2(selectedLines.reduce((s, l) => s + pickOf(l).amount, 0));
  const payTotal = r2(payments.reduce((s, p) => s + (p.amount || 0), 0));
  const diff = r2(lineTotal - total);
  const payDiff = r2(payTotal - total);
  const ready = !!customer && selectedLines.length > 0 && Math.abs(diff) < 0.005 && Math.abs(payDiff) < 0.005;
  const sumAll = (lines: InvLine[]) => r2(lines.filter(eligible).reduce((s, l) => s + l.amount, 0));

  const startCustomer = (id: string | null, onlyOrder: string | null = null) => {
    setCustomer(id); setFilter('all'); setPicks({}); setManual([]); setPaymentsEdited(false);
    const c = CUSTOMERS.find((x) => x.id === id);
    setInvoiceTo(c?.branches[0] ?? '');
    const ls = orders.filter((o) => o.customer === id && (!onlyOrder || o.id === onlyOrder)).flatMap((o) => o.lines).filter(eligible);
    setSelected(new Set(ls.map((l) => l.key)));
    const t = r2(ls.reduce((s, l) => s + l.amount, 0));
    setTotal(t); setTotalStr(t ? String(t) : '');
    const first = orders.find((o) => o.customer === id);
    setPayments([{ method: first?.payment.split(' ')[0] === 'Bank' ? 'Bank transfer' : first?.payment.startsWith('Cash') ? 'Cash' : 'Card', amount: t }]);
  };

  useEffect(() => {
    if (!open) { opened.current = false; return; }
    if (opened.current) return;
    opened.current = true;
    setOperator(''); setNotes(''); setNumber(''); setDate(''); setTried(false); setPreview(false); setSku('');
    startCustomer(initialCustomer, initialOrder);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // 付款金额没人改过时，跟着发票总额走
  useEffect(() => { if (!paymentsEdited) setPayments((p) => p.map((x, i) => (i === 0 ? { ...x, amount: total } : x))); }, [total, paymentsEdited]);

  const selectNear = (target: number) => {
    const next = new Set<string>(); let running = 0;
    for (const l of selectable) {
      const a = pickOf(l).amount; if (a <= 0.005) continue;
      const withLine = r2(running + a);
      if (Math.abs(target - withLine) > Math.abs(target - running)) break;
      next.add(l.key); running = withLine;
      if (running >= target) break;
    }
    setSelected(next);
  };
  const changeTotal = (raw: string) => { setTotalStr(raw); const t = r2(Number(raw) || 0); setTotal(t); selectNear(t); };
  const changeFilter = (f: typeof filter) => {
    setFilter(f);
    const ls = customerOrders.filter((o) => f === 'all' || (f === 'paid' ? o.paid : !o.paid)).flatMap((o) => o.lines).filter(eligible);
    setSelected(new Set([...ls.map((l) => l.key), ...manual.map((l) => l.key)]));
    const t = r2(ls.reduce((s, l) => s + pickOf(l).amount, 0) + manual.reduce((s, l) => s + pickOf(l).amount, 0));
    setTotal(t); setTotalStr(String(t));
  };
  const toggle = (keys: string[], on: boolean) => setSelected((p) => { const n = new Set(p); keys.forEach((k) => (on ? n.add(k) : n.delete(k))); return n; });
  const setQty = (l: InvLine, q: number) => { const qty = Math.max(0, Math.min(l.qty, q)); setPicks((p) => ({ ...p, [l.key]: { qty, amount: l.qty ? r2((l.amount * qty) / l.qty) : 0 } })); };
  const setAmount = (l: InvLine, raw: string) => setPicks((p) => ({ ...p, [l.key]: { qty: pickOf(l).qty, amount: raw === '' ? 0 : r2(Number(raw) || 0) } }));

  const custName = CUSTOMERS.find((c) => c.id === customer);
  const previewLines: PreviewLine[] = groups.flatMap((g) => g.lines.filter((l) => selected.has(l.key) && eligible(l)).map((l) => ({ date: g.order?.date ?? 'Manual lines', code: l.code, name: l.name, unit: l.unit, qty: pickOf(l).qty, amount: pickOf(l).amount, shipping: l.shipping })));
  const payload = (): IssuePayload => ({
    invoice: { customer: customer!, invoiceTo, payments: payments.filter((p) => p.amount > 0), orders: [...new Set(groups.filter((g) => g.order && g.lines.some((l) => selected.has(l.key))).map((g) => g.order!.no))], amount: total, operator, lines: previewLines },
    consumed: Object.fromEntries(selectedLines.map((l) => [l.key, pickOf(l)])),
  });
  const status = !customer ? 'Select a customer first'
    : !selectedLines.length ? 'Select at least one line'
      : Math.abs(diff) >= 0.005 ? `Item total differs by ${eur(Math.abs(diff))}`
        : Math.abs(payDiff) >= 0.005 ? `Payments differ by ${eur(Math.abs(payDiff))}`
          : !operator ? 'Select the operator' : null;
  const catalogHits = sku.trim() ? CATALOG.filter((c) => (c.code + ' ' + c.name).toLowerCase().includes(sku.toLowerCase())) : [];

  return (
    <>
      <Dialog open={open && !preview} onOpenChange={(o) => !o && onClose()}>
        <DialogContent showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()} className={DIALOG + ' h-[min(54rem,92vh)] sm:max-w-[min(78rem,calc(100vw-4rem))]'}>
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5">
            <div><DialogTitle className="text-lg font-semibold tracking-[-0.01em]">New invoice</DialogTitle><DialogDescription className="mt-1 text-sm text-muted-foreground">Pick the lines to invoice, check amounts and payment methods, then preview.</DialogDescription></div>
            <DialogClose className="-mr-2 -mt-1 grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close"><X className="size-4" /></DialogClose>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_21rem]">
            {/* ───── 左：开给谁 → 开哪些 ───── */}
            <div className="flex min-h-0 min-w-0 flex-col border-r border-border">
              <section className="shrink-0 px-6 py-5">
                <div className="grid grid-cols-[minmax(0,1fr)_15rem] gap-3">
                  <Field label="Customer" required htmlFor="invoice-customer"><CustomerPicker value={customer} onChange={(id) => startCustomer(id)} /></Field>
                  <Field label="Invoice to">
                    <Select value={invoiceTo || null} onValueChange={setInvoiceTo} disabled={!custName} size="lg" placeholder="Select a customer first" triggerClassName="!h-10 w-full rounded-xl" options={(custName?.branches ?? []).map((b) => ({ value: b, label: b }))} />
                  </Field>
                </div>
                {custName && <p className="mt-2.5 text-sm text-muted-foreground">Open to invoice <span className="font-semibold tabular-nums text-foreground">{eur(sumAll(customerOrders.flatMap((o) => o.lines)))}</span> across {customerOrders.length} orders</p>}
              </section>

              {!custName ? (
                <div className="mx-6 mb-6 grid flex-1 place-items-center rounded-xl border border-dashed border-border text-center">
                  <div><p className="font-medium">Select a customer first</p><p className="mt-1 text-sm text-muted-foreground">Their uninvoiced order lines appear here, grouped by order.</p></div>
                </div>
              ) : (
                <>
                  <div className="flex shrink-0 items-center justify-between gap-3 border-y border-border px-6">
                    <SlideTabs label="Payment status" value={filter} onChange={changeFilter}
                      items={([['all', 'All'], ['paid', 'Paid'], ['unpaid', 'Unpaid']] as const).map(([id, l]) => ({ id, label: <>{l}<span className="text-xs tabular-nums opacity-60">{customerOrders.filter((o) => id === 'all' || (id === 'paid' ? o.paid : !o.paid)).length}</span></> }))}
                      className="-mb-px -ml-3 flex h-11 items-stretch gap-1" itemClassName="flex h-full items-center gap-1.5 px-3 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
                      indicatorClassName="after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" />
                    <p className="text-sm text-muted-foreground">Selected <span className="font-semibold tabular-nums text-primary-strong">{eur(lineTotal)}</span></p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
                    <table className="w-full table-fixed text-sm">
                      <colgroup><col style={{ width: 52 }} /><col /><col style={{ width: 116 }} /><col style={{ width: 120 }} /><col style={{ width: 100 }} /><col style={{ width: 128 }} /></colgroup>
                      <thead className="sticky top-0 z-[1]"><tr className="text-xs font-medium text-muted-foreground [&>th]:whitespace-nowrap [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5">
                        <th className="!pl-6"><Checkbox aria-label="Select all lines" checked={selectable.length > 0 && selectedLines.length === selectable.length ? true : selectedLines.length ? 'indeterminate' : false} onCheckedChange={(c) => toggle(selectable.map((l) => l.key), c === true)} /></th>
                        <th className="text-left">Product</th><th className="text-right">Remaining qty</th><th className="text-center">This invoice</th><th className="text-right">Remaining</th><th className="!pr-6 text-right">Invoice amount</th>
                      </tr></thead>
                      <tbody>
                        {groups.map((g) => {
                          const el = g.lines.filter(eligible); const on = el.filter((l) => selected.has(l.key));
                          const sel = r2(on.reduce((s, l) => s + pickOf(l).amount, 0));
                          return (
                            <React.Fragment key={g.order?.id ?? 'manual'}>
                              {/* 订单（父）行：白底、加粗；商品（子）行浅灰，跟灰色表头分开 */}
                              <tr className="border-b border-border [&>td]:bg-card [&>td]:px-3 [&>td]:pb-2.5 [&>td]:pt-4">
                                <td className="!pl-6"><Checkbox aria-label={`Select ${g.order?.no ?? 'manual lines'}`} checked={on.length && on.length === el.length ? true : on.length ? 'indeterminate' : false} onCheckedChange={(c) => toggle(el.map((l) => l.key), c === true)} /></td>
                                <td colSpan={2}>
                                  {g.order ? (
                                    <p className="flex min-w-0 items-baseline gap-2.5">
                                      <span className="font-mono text-[13px] font-semibold">{g.order.no}</span>
                                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{g.order.date}</span>
                                      {g.order.note && <span className="truncate text-xs text-muted-foreground">{g.order.note}</span>}
                                    </p>
                                  ) : <span className="text-sm font-semibold">Manual lines</span>}
                                </td>
                                <td colSpan={3} className="!pr-6">
                                  {g.order && (
                                    <div className="flex items-center justify-end gap-2.5 whitespace-nowrap text-xs">
                                      {g.order.payment && <span className="text-muted-foreground">{g.order.payment}</span>}
                                      <Badge variant={g.order.paid ? 'success' : 'warning'}>{g.order.paid ? 'Paid' : 'Unpaid'}</Badge>
                                      <span className="tabular-nums"><span className="text-sm font-semibold">{eur(sel)}</span><span className="text-muted-foreground"> / {eur(orderTotal(g.order))}</span></span>
                                    </div>
                                  )}
                                </td>
                              </tr>
                              {g.lines.map((l) => {
                                const p = pickOf(l); const isOn = selected.has(l.key);
                                return (
                                  <tr key={l.key} className={'border-b border-border [&>td]:bg-[color-mix(in_srgb,var(--surface-sunken)_40%,var(--surface-raised))] [&>td]:px-3 [&>td]:py-2 ' + (l.gift ? 'text-muted-foreground' : '')}>
                                    <td className="!pl-6"><Checkbox aria-label={`Select ${l.name}`} disabled={!eligible(l)} checked={isOn && eligible(l)} onCheckedChange={(c) => toggle([l.key], c === true)} /></td>
                                    <td className="truncate" title={l.name}>{l.name}{l.gift && <Badge variant="success" className="ml-2">Gift</Badge>}{l.shipping && <Badge variant="info" className="ml-2">Courier fee</Badge>}</td>
                                    <td className="text-right tabular-nums">{l.qty}</td>
                                    <td>{l.gift || l.shipping ? <p className="text-center tabular-nums text-muted-foreground">{l.gift ? 0 : 1}</p>
                                      : <QuantityStepper value={p.qty} label={`invoice quantity for ${l.name}`} containerClassName="mx-auto w-20" canDecrease={p.qty > 0} canIncrease={p.qty < l.qty}
                                        onInputChange={(v) => setQty(l, Number(v) || 0)} onStep={(d) => setQty(l, p.qty + d)} />}</td>
                                    <td className="text-right tabular-nums text-muted-foreground">{l.gift ? 'Gift' : l.amount.toFixed(2)}</td>
                                    <td className="!pr-6 text-right">{l.gift ? <span className="text-muted-foreground">Not invoiced</span>
                                      : <Input aria-label="Invoice amount" inputMode="decimal" value={String(p.amount)} onChange={(e) => setAmount(l, e.target.value)} className="ml-auto h-9 w-24 rounded-lg bg-card text-right tabular-nums" />}</td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                        {groups.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No orders in this view.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* ───── 右：金额 → 付款 → 经办 → 加行 ───── */}
            <aside className="min-h-0 overflow-y-auto [scrollbar-width:thin] [&>section]:border-b [&>section]:border-border [&>section]:px-5 [&>section]:py-5 [&>section:last-child]:border-0">
              <section>
                <h3 className="text-sm font-semibold"><label htmlFor="invoice-total">Invoice total</label></h3>
                <Input id="invoice-total" inputMode="decimal" disabled={!custName} value={totalStr} onChange={(e) => changeTotal(e.target.value)} className="mt-3 h-12 rounded-xl text-right text-xl font-semibold tabular-nums" />
                {custName && (Math.abs(diff) >= 0.005 || Math.abs(payDiff) >= 0.005) ? (
                  <div className="mt-3 flex gap-2 rounded-xl bg-status-danger-subtle px-3 py-2.5 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <div><p className="font-semibold">Check the amounts</p>
                      {Math.abs(diff) >= 0.005 && <p>Item total differs by {eur(Math.abs(diff))}</p>}
                      {Math.abs(payDiff) >= 0.005 && <p>Payments differ by {eur(Math.abs(payDiff))}</p>}</div>
                  </div>
                ) : custName ? <p className="mt-2 text-xs text-muted-foreground">Typing a total picks lines in order until it's reached.</p> : null}
              </section>
              <section>
                <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Payment</h3>
                  <Button variant="ghost" size="sm" className="-mr-2 text-primary" disabled={!custName} onClick={() => { setPaymentsEdited(true); setPayments((p) => [...p, { method: PAYMENT_METHODS.find((m) => !p.some((x) => x.method === m)) ?? 'Cash', amount: Math.max(0, r2(total - payTotal)) }]); }}><Plus />Add</Button></div>
                <div className="mt-3 space-y-2">
                  {payments.map((p, i) => (
                    <div key={i} className="grid grid-cols-[minmax(0,1fr)_6.5rem_2rem] items-center gap-2">
                      <Select value={p.method} onValueChange={(v) => { setPaymentsEdited(true); setPayments((x) => x.map((y, j) => (j === i ? { ...y, method: v } : y))); }} size="lg" ariaLabel="Payment method" triggerClassName="!h-10 w-full rounded-xl" options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))} />
                      <Input aria-label="Payment amount" inputMode="decimal" value={String(p.amount)} onChange={(e) => { setPaymentsEdited(true); setPayments((x) => x.map((y, j) => (j === i ? { ...y, amount: r2(Number(e.target.value) || 0) } : y))); }} className="h-10 rounded-xl text-right tabular-nums" />
                      <button type="button" aria-label="Remove payment" disabled={payments.length === 1} onClick={() => { setPaymentsEdited(true); setPayments((x) => x.filter((_, j) => j !== i)); }} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-status-danger-subtle hover:text-destructive disabled:opacity-40"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                </div>
              </section>
              <section className="space-y-4">
                <Field label="Operator" required><Select value={operator || null} onValueChange={setOperator} size="lg" placeholder="Select operator" ariaLabel="Operator" triggerClassName="!h-10 w-full rounded-xl" options={OPERATORS.map((o) => ({ value: o, label: o }))} /></Field>
                <Field label="Notes" htmlFor="invoice-notes"><Textarea id="invoice-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="resize-none rounded-xl" /></Field>
              </section>
              <section>
                <h3 className="text-sm font-semibold">Add line</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">An extra courier fee or an amount adjustment.</p>
                <div className="relative mt-3">
                  <label className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <input aria-label="Search SKU or product" disabled={!custName} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Search SKU / product…" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
                  </label>
                  {catalogHits.length > 0 && (
                    <ul className="menu-pop absolute inset-x-0 bottom-full z-20 mb-1.5 rounded-xl bg-popover p-1 shadow-md ring-1 ring-foreground/10">
                      {catalogHits.map((c) => (
                        <li key={c.code}><button type="button" className="flex w-full justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)]" onClick={() => {
                          const line: InvLine = { key: `manual:${c.code}:${manual.length}`, code: c.code, name: c.name, unit: c.unit, qty: 1, amount: c.price, shipping: c.shipping };
                          setManual((m) => [...m, line]); setSelected((s) => new Set([...s, line.key])); setSku('');
                        }}><span className="truncate">{c.name}</span><span className="shrink-0 tabular-nums text-muted-foreground">{eur(c.price)}</span></button></li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </aside>
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface-sunken px-6 py-3.5">
            <p className={'min-w-0 truncate text-sm ' + (tried && status ? 'text-destructive' : 'text-muted-foreground')}>{status ?? <>Ready · <span className="font-semibold tabular-nums text-foreground">{eur(total)}</span> across {selectedLines.length} lines</>}</p>
            <div className="flex shrink-0 gap-2.5">
              <DialogClose asChild><Button variant="outline" size="lg" className="min-w-28">Cancel</Button></DialogClose>
              <Button variant="outline" size="lg" className="min-w-28" disabled={!customer || !selectedLines.length} onClick={() => onSaveDraft(payload())}><Save />Save draft</Button>
              <Button size="lg" className="min-w-28" disabled={!ready} onClick={() => { setTried(true); if (!status) setPreview(true); }}><Eye />Preview invoice</Button>
            </div>
          </footer>
        </DialogContent>
      </Dialog>

      <InvoicePreview open={open && preview} onClose={() => setPreview(false)} customer={custName ? customerLabel(custName) : ''} invoiceTo={invoiceTo} lines={previewLines}
        payments={payments.filter((p) => p.amount > 0)} total={total} number={number} date={date} onNumber={setNumber} onDate={setDate}
        footer={<>
          <p className="min-w-0 text-sm text-muted-foreground">Check the lines, then issue. Enter the number and date now, or add them later.</p>
          <div className="flex shrink-0 gap-2.5">
            <Button variant="outline" size="lg" className="min-w-28" onClick={() => setPreview(false)}>Back to edit</Button>
            <Button size="lg" className="min-w-28" onClick={() => onIssue({ ...payload(), no: number.trim(), date })}>Issue invoice</Button>
          </div>
        </>} />
    </>
  );
}
