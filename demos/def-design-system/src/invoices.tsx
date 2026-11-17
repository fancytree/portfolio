import React, { useMemo, useState } from 'react';
import { Download, Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogAction, DialogCancel, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SlideTabs } from './motion';
import { eur } from './order-deliveries';
import { FormDialog } from './form-dialog';
import { InvoiceEditor, InvoicePreview, type IssuePayload } from './invoice-editor';
import { CUSTOMERS, ORDERS, SEED_INVOICES, customerLabel, orderGoods, orderShipping, orderTotal, r2, type InvOrder, type InvStatus, type Invoice } from './invoice-data';

/**
 * 发票管理。对齐原 ERP FinanceInvoices：顶部日期范围 + 三个统计；标签页 待开票 / 未填号 / 草稿 / 已开票 / 已作废；
 * 待开票按订单列出，其余按发票列出。新建发票、预览、开具、补号、作废都能操作。
 * URL：?view=invoices · &compose=1 直接打开新建发票（客户已选 Luce Beauty Lab）。
 */

type Tab = 'todo' | InvStatus;
const TABS: { id: Tab; label: string }[] = [{ id: 'todo', label: 'To invoice' }, { id: 'no_number', label: 'No number' }, { id: 'draft', label: 'Draft' }, { id: 'invoiced', label: 'Invoiced' }, { id: 'voided', label: 'Voided' }];
const STATUS: Record<InvStatus, { label: string; v: 'warning' | 'secondary' | 'success' | 'outline' }> = { no_number: { label: 'No number', v: 'warning' }, draft: { label: 'Draft', v: 'secondary' }, invoiced: { label: 'Invoiced', v: 'success' }, voided: { label: 'Voided', v: 'outline' } };
/** 开票按月结，日期只留三个最常用的 */
const PRESETS = [{ id: 'all', label: 'All' }, { id: 'month', label: 'This month' }, { id: 'last', label: 'Last month' }] as const;
type Preset = (typeof PRESETS)[number]['id'];
const CTRL = 'h-9 rounded-xl border border-input bg-card shadow-none';
const TODAY = new Date(2026, 10, 17);
const parse = (s: string) => { const [d, m, y] = s.split(/[/ ]/).map(Number); return new Date(y, m - 1, d); };
const inRange = (s: string, p: Preset) => {
  if (p === 'all' || !s) return p === 'all';
  const d = parse(s);
  if (p === 'month') return d.getMonth() === TODAY.getMonth() && d.getFullYear() === TODAY.getFullYear();
  return d.getMonth() === TODAY.getMonth() - 1 && d.getFullYear() === TODAY.getFullYear();
};
const isoToDmy = (iso: string) => (iso ? iso.split('-').reverse().join('/') : '');
const dmyToIso = (d: string) => (d ? d.split('/').reverse().join('-') : '');
const custName = (id: string) => { const c = CUSTOMERS.find((x) => x.id === id); return c ? customerLabel(c) : id; };
const nowStamp = () => { const n = new Date(); return `17/11/2026 ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; };

export default function Invoices() {
  const params = new URLSearchParams(location.search);
  const [tab, setTab] = useState<Tab>('todo');
  const [preset, setPreset] = useState<Preset>('all');
  const [q, setQ] = useState('');
  const [orders, setOrders] = useState<InvOrder[]>(ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [editor, setEditor] = useState<{ customer: string | null; order: string | null } | null>(params.get('compose') === '1' ? { customer: 'c-1042', order: null } : null);
  const [viewing, setViewing] = useState<Invoice | null>(null);
  const [numbering, setNumbering] = useState<Invoice | null>(null);
  const [num, setNum] = useState({ no: '', date: '' });
  const [voiding, setVoiding] = useState<Invoice | null>(null);
  const [toast, setToast] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const flash = (t: string) => { setToast(t); setTimeout(() => setToast(''), 2400); };

  const kw = q.trim().toLowerCase();
  const orderRows = orders.filter((o) => orderTotal(o) > 0 && inRange(o.date, preset) && (!kw || (o.no + ' ' + custName(o.customer) + ' ' + o.invoiceTo).toLowerCase().includes(kw)));
  const stamp = (e: string) => { const [d, t = '00:00'] = e.split(' '); return parse(d).getTime() + Number(t.replace(':', '')); };
  // 最新录入的在最上面
  const invRows = (s: InvStatus) => invoices.filter((i) => i.status === s && inRange(i.entered, preset) && (!kw || (custName(i.customer) + ' ' + i.no + ' ' + i.orders.join(' ')).toLowerCase().includes(kw))).sort((a, b) => stamp(b.entered) - stamp(a.entered));
  const count = (t: Tab) => (t === 'todo' ? orderRows.length : invRows(t).length);
  const rows = tab === 'todo' ? [] : invRows(tab);
  const toInvoice = r2(orderRows.reduce((s, o) => s + orderTotal(o), 0));
  const shownTotal = tab === 'todo' ? toInvoice : r2(rows.reduce((s, i) => s + i.amount, 0));

  const consume = (consumed: IssuePayload['consumed']) => setOrders((os) => os.map((o) => ({ ...o, lines: o.lines.map((l) => {
    const c = consumed[l.key]; if (!c) return l;
    return { ...l, qty: Math.max(0, l.qty - c.qty), amount: Math.max(0, r2(l.amount - c.amount)) };
  }) })));
  const addInvoice = (p: IssuePayload, status: InvStatus, no = '', date = '') => {
    const inv: Invoice = { ...p.invoice, id: 'i-' + Date.now(), no, date, status, entered: nowStamp(), operator: p.invoice.operator || 'Elena Rossi' };
    setInvoices((x) => [inv, ...x]);
    return inv;
  };

  return (
    <div className="flex h-[calc(100vh-92px)] flex-col gap-4">
      {/* 卡片一：标题 + 日期 + 统计 */}
      <div className="shrink-0 rounded-2xl bg-card px-6 py-4 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h1 className="whitespace-nowrap text-2xl font-semibold tracking-[-0.02em]">Invoices</h1>
          <div className="flex items-center gap-3">
            <SlideTabs label="Date range" value={preset} onChange={setPreset} items={PRESETS.map((p) => ({ id: p.id, label: p.label }))}
              className={CTRL + ' flex items-center gap-0.5 p-1'} itemClassName="h-full rounded-[8px] px-2.5 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
              indicatorClassName="rounded-[8px] bg-primary/10" />
            <Button size="lg" onClick={() => setEditor({ customer: null, order: null })}><Plus />New invoice</Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {([['Orders to invoice', String(orderRows.length)], ['Total to invoice', eur(toInvoice)], ['Customers', String(new Set(orderRows.map((o) => o.customer)).size)]] as const).map(([k, v]) => (
            <div key={k} className="rounded-xl bg-muted px-4 py-3"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 text-xl font-semibold tabular-nums">{v}</p></div>
          ))}
        </div>
      </div>

      {/* 卡片二：标签 / 表格 / 合计 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card shadow-card">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-6">
          <SlideTabs label="Invoice status" value={tab} onChange={setTab}
            items={TABS.map((t) => { const n = count(t.id); return { id: t.id, label: <>{t.label}{n > 0 && (t.id === 'todo' || t.id === 'no_number'
              ? <span className="grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold leading-none tabular-nums" style={{ background: 'var(--attention)', color: 'var(--attention-foreground)' }}>{n}</span>
              : <span className="text-xs tabular-nums opacity-60">{n}</span>)}</> }; })}
            className="-mb-px flex h-14 items-stretch gap-1" itemClassName="flex h-full items-center gap-1.5 px-3 text-sm" activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
            indicatorClassName="after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" />
          <div className="flex shrink-0 items-center gap-2">
            <label className={CTRL + ' flex w-72 items-center gap-2 px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40'}>
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order, customer or invoice no." aria-label="Search invoices" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
            </label>
            <Button variant="outline" aria-label="Refresh" className={CTRL + ' w-9 px-0'} onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 700); }}><RefreshCw className={refreshing ? 'animate-spin' : ''} /></Button>
            <Button variant="outline" aria-label="Export Excel" className={CTRL + ' w-9 px-0'}><Download /></Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
          {tab === 'todo' ? (
            <table className="w-full min-w-[56rem] table-fixed text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
              <colgroup><col style={{ width: 168 }} /><col /><col style={{ width: 190 }} /><col style={{ width: 116 }} /><col style={{ width: 112 }} /><col style={{ width: 100 }} /><col style={{ width: 120 }} /><col style={{ width: 96 }} /></colgroup>
              <thead className="sticky top-0 z-[1]"><tr className="text-left text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5">
                <th className="!pl-6">Order no.</th><th>Customer</th><th>Invoice to</th><th>Order date</th><th className="text-right">Goods</th><th className="text-right">Shipping</th><th className="text-right">To invoice</th><th className="!pr-6 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {orderRows.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-[var(--surface-hover)] [&>td]:px-3 [&>td]:py-3">
                    <td className="!pl-6 font-mono text-[13px] font-medium text-primary">{o.no}</td>
                    <td className="truncate">{custName(o.customer)}</td>
                    <td className="truncate text-muted-foreground">{o.invoiceTo}</td>
                    <td className="tabular-nums text-muted-foreground">{o.date}</td>
                    <td className="text-right tabular-nums">{eur(orderGoods(o))}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{orderShipping(o) ? eur(orderShipping(o)) : ''}</td>
                    <td className="text-right font-semibold tabular-nums">{eur(orderTotal(o))}</td>
                    <td className="!pr-6 text-right"><button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => setEditor({ customer: o.customer, order: o.id })}>Invoice</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[56rem] table-fixed text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
              {/* 标签页已经说明状态，不再单独占一列；号码 / 日期、经办人 / 录入时间各自叠成两行 */}
              <colgroup><col style={{ width: 176 }} /><col /><col style={{ width: 148 }} /><col style={{ width: 128 }} /><col style={{ width: 176 }} /><col style={{ width: 168 }} /></colgroup>
              <thead className="sticky top-0 z-[1]"><tr className="text-left text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5">
                <th className="!pl-6">Invoice</th><th>Customer</th><th>Payment</th><th className="text-right">Amount</th><th>Entered by</th><th className="!pr-6 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {rows.map((i) => (
                  <tr key={i.id} onClick={() => setViewing(i)} className="cursor-pointer align-top transition-colors hover:bg-[var(--surface-hover)] [&>td]:px-3 [&>td]:py-3">
                    <td className="!pl-6">
                      {i.no ? <p className="font-mono text-[13px] font-medium">{i.no}</p> : <p className="text-muted-foreground">{i.status === 'draft' ? 'Draft' : 'No number yet'}</p>}
                      <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{i.date || ' '}</p>
                    </td>
                    <td>
                      <p className="truncate font-medium">{custName(i.customer)}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{i.orders.length} order{i.orders.length > 1 ? 's' : ''} · {i.orders.join(', ')}{i.invoiceTo && i.invoiceTo !== 'Customer account (HQ)' ? ` · to ${i.invoiceTo}` : ''}</p>
                    </td>
                    <td className="text-muted-foreground">{i.payments.map((p) => p.method).join(' + ')}</td>
                    <td className="text-right font-semibold tabular-nums">{eur(i.amount)}</td>
                    <td><p className="truncate">{i.operator}</p><p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{i.entered}</p></td>
                    <td className="!pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex gap-4 text-sm font-medium">
                        {i.status === 'no_number' && <button type="button" className="text-primary hover:underline" onClick={() => { setNum({ no: '', date: '' }); setNumbering(i); }}>Add number</button>}
                        {i.status === 'draft' && <button type="button" className="text-primary hover:underline" onClick={() => setViewing(i)}>Continue</button>}
                        {i.status === 'invoiced' && <button type="button" className="text-primary hover:underline" onClick={() => { setNum({ no: i.no, date: dmyToIso(i.date) }); setNumbering(i); }}>Edit</button>}
                        {(i.status === 'no_number' || i.status === 'invoiced') && <button type="button" className="text-destructive hover:underline" onClick={() => setVoiding(i)}>Void</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {count(tab) === 0 && <p className="px-6 py-14 text-center text-sm text-muted-foreground">Nothing here for this range. Try another date range or tab.</p>}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-6 py-3.5 text-sm">
          <p className="text-muted-foreground">Results <span className="font-semibold tabular-nums text-foreground">{count(tab)}</span><span className="ml-4">Total <span className="font-semibold tabular-nums text-primary-strong">{eur(shownTotal)}</span></span></p>
          <p className="text-muted-foreground">Page 1 of 1</p>
        </div>
      </div>

      {/* 弹窗 */}
      <InvoiceEditor open={!!editor} onClose={() => setEditor(null)} orders={orders} initialCustomer={editor?.customer ?? null} initialOrder={editor?.order ?? null}
        onSaveDraft={(p) => { addInvoice(p, 'draft'); setEditor(null); setTab('draft'); flash('Draft saved'); }}
        onIssue={(p) => { consume(p.consumed); const has = !!p.no; addInvoice(p, has ? 'invoiced' : 'no_number', p.no, isoToDmy(p.date)); setEditor(null); setTab(has ? 'invoiced' : 'no_number'); flash(has ? `Invoice ${p.no} issued` : 'Invoice issued · add the number when you have it'); }} />

      {viewing && (
        <InvoicePreview open onClose={() => setViewing(null)} title={viewing.no ? `Invoice ${viewing.no}` : 'Invoice · no number yet'} customer={custName(viewing.customer)} invoiceTo={viewing.invoiceTo}
          lines={viewing.lines} payments={viewing.payments} total={viewing.amount} number={viewing.no} date={viewing.date}
          footer={<>
            <p className="text-sm text-muted-foreground">{STATUS[viewing.status].label} · entered {viewing.entered} by {viewing.operator}</p>
            <div className="flex shrink-0 gap-2.5">
              {viewing.status === 'draft' && <Button size="lg" className="min-w-28" onClick={() => { setInvoices((x) => x.map((i) => (i.id === viewing.id ? { ...i, status: 'no_number', entered: nowStamp() } : i))); setViewing(null); setTab('no_number'); flash('Invoice issued'); }}>Issue invoice</Button>}
              {viewing.status === 'no_number' && <Button size="lg" className="min-w-28" onClick={() => { setNum({ no: '', date: '' }); setNumbering(viewing); setViewing(null); }}>Add number</Button>}
              <Button variant="outline" size="lg" className="min-w-28" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </>} />
      )}

      <FormDialog open={!!numbering} onOpenChange={(o) => !o && setNumbering(null)} className="sm:max-w-md" title={numbering?.no ? `Edit ${numbering.no}` : 'Add invoice number'}
        description={numbering ? `${custName(numbering.customer)} · ${eur(numbering.amount)}` : ''}
        status={!num.no.trim() || !num.date ? 'Number and date are both required' : undefined}
        confirmLabel="Save" confirmDisabled={!num.no.trim() || !num.date}
        onConfirm={() => { if (!numbering) return; setInvoices((x) => x.map((i) => (i.id === numbering.id ? { ...i, no: num.no.trim(), date: isoToDmy(num.date), status: 'invoiced' } : i))); setNumbering(null); setTab('invoiced'); flash(`Invoice ${num.no.trim()} saved`); }}>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-muted-foreground">Numero documento<span className="text-destructive">*</span><Input id="invoice-number" value={num.no} placeholder="FT-2026-0163" onChange={(e) => setNum((n) => ({ ...n, no: e.target.value }))} className="mt-1.5 h-10 rounded-xl text-foreground" /></label>
          <label className="text-xs text-muted-foreground">Data documento<span className="text-destructive">*</span><Input id="invoice-date" type="date" value={num.date} onChange={(e) => setNum((n) => ({ ...n, date: e.target.value }))} className="mt-1.5 h-10 rounded-xl tabular-nums text-foreground" /></label>
        </div>
      </FormDialog>

      <Dialog open={!!voiding} onOpenChange={(o) => !o && setVoiding(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader><DialogTitle>Void {voiding?.no || 'this invoice'}?</DialogTitle><DialogDescription>The invoice stays on record as voided and can no longer be edited.</DialogDescription></DialogHeader>
          <DialogFooter><DialogCancel size="lg" className="min-w-28">Cancel</DialogCancel><DialogAction size="lg" variant="destructive" className="min-w-28" onClick={() => { if (voiding) setInvoices((x) => x.map((i) => (i.id === voiding.id ? { ...i, status: 'voided' } : i))); setVoiding(null); setTab('voided'); flash('Invoice voided'); }}>Void invoice</DialogAction></DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && <div role="status" className="rise-in fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg">{toast}</div>}
    </div>
  );
}
