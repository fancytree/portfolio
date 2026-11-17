import React, { useState } from 'react';
import { ArrowLeft, Check, CircleDashed, Copy, Ellipsis, PackagePlus, Pencil, Printer, ReceiptText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogAction, DialogCancel, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select } from '@/components/ui/select';
import { SlideTabs } from './motion';
import { LINES, SEED_DELIVERIES, DeliveryCard, DeliveryDialog, ReturnDialog, ReturnsPanel, UnshippedPanel, eur, num, type Delivery, type Return } from './order-deliveries';

/** 销售订单详情。布局和功能对齐真实 ERP 的 SalesOrderDetail（左：单头 + 明细 / 发货 / 退货；右：客户 + 订单信息），换成新的设计语言。 */

const PCS = LINES.reduce((s, l) => s + l.qty, 0);
const TOTAL = LINES.reduce((s, l) => s + (l.gift ? 0 : l.price * l.qty), 0);
const PRE_TAX = TOTAL / 1.22;
const nowStamp = () => { const n = new Date(); return `17/11/2026 ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; };

function Confirm({ open, onClose, title, body, action, onConfirm, destructive = false, children }: { open: boolean; onClose: () => void; title: string; body: React.ReactNode; action: string; onConfirm: () => void; destructive?: boolean; children?: React.ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{body}</DialogDescription></DialogHeader>
        {children}
        <DialogFooter><DialogCancel size="lg" className="min-w-28">Cancel</DialogCancel><DialogAction size="lg" className="min-w-28" variant={destructive ? 'destructive' : 'default'} onClick={onConfirm}>{action}</DialogAction></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={'min-w-0 ' + (wide ? 'col-span-2' : '')}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

function Steps({ shipped, cancelled }: { shipped: number; cancelled: boolean }) {
  const all = shipped >= PCS;
  const steps: [string, 'done' | 'current' | 'todo'][] = cancelled ? [['Ordered', 'done'], ['Cancelled', 'current'], ['Completed', 'todo']]
    : [['Ordered', 'done'], ['Shipped', all ? 'done' : shipped > 0 ? 'current' : 'todo'], ['Completed', all ? 'done' : 'todo']];
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Order progress">
      {steps.map(([label, state], i) => (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span className="h-px w-5 bg-border" aria-hidden />}
          <span className={'inline-flex items-center gap-1.5 ' + (state === 'todo' ? 'text-muted-foreground' : 'font-medium text-primary-strong')}>
            {state === 'done' ? <Check className="size-4" /> : state === 'current'
              ? <span className="size-3.5 rounded-full border-2 border-primary" style={{ background: 'linear-gradient(90deg, var(--primary) 50%, transparent 50%)' }} aria-hidden />
              : <CircleDashed className="size-4" />}
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function Order({ onBack, onEdit }: { onBack?: () => void; onEdit?: () => void }) {
  const [tab, setTab] = useState<'items' | 'deliveries' | 'returns'>('items');
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>(SEED_DELIVERIES);
  const [returns, setReturns] = useState<Return[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [editing, setEditing] = useState<Delivery | null>(null);
  const [toConfirm, setToConfirm] = useState<Delivery | null>(null);
  const [toCancel, setToCancel] = useState<Delivery | null>(null);
  const [returnFrom, setReturnFrom] = useState<Delivery | null>(null);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelled, setCancelled] = useState(false);

  // 已发货 = 已确认的发货单；剩余可发 = 订单数量 − 已发货 − 草稿占用
  const shippedQty = LINES.map((_, i) => deliveries.filter((d) => d.status === 'shipped').reduce((s, d) => s + (d.items[i] ?? 0), 0));
  const usedQty = LINES.map((_, i) => deliveries.reduce((s, d) => s + (d.items[i] ?? 0), 0));
  const remaining = LINES.map((l, i) => Math.max(0, l.qty - usedQty[i]));
  const SHIPPED = shippedQty.reduce((s, q) => s + q, 0);
  const allShipped = SHIPPED >= PCS;
  const status = cancelled ? { label: 'Cancelled', v: 'secondary' as const } : allShipped ? { label: 'Shipped', v: 'success' as const } : SHIPPED > 0 ? { label: 'Partially shipped', v: 'info' as const } : { label: 'Pending', v: 'warning' as const };
  const pct = (SHIPPED / PCS) * 100;
  const leftToSchedule = remaining.reduce((s, q) => s + q, 0);
  const nextNo = () => `DDT-2026-0${120 + deliveries.length}`;

  return (
    <div className="grid h-[calc(100vh-2rem)] grid-cols-[minmax(0,1fr)_20rem] gap-5">
      {/* 页面固定一屏高：左侧只有商品表格区域滚动、合计贴底；右侧信息栏单独滚动 */}
      {/* ───────── 左：单头 + 明细 ───────── */}
      <div className="flex min-h-0 min-w-0 flex-col gap-5">
        <Card className="shrink-0 gap-0 py-5">
          <CardContent className="space-y-3">
            <button type="button" onClick={onBack} className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="size-4" />Back to list
            </button>
            <div className="flex min-w-0 items-center gap-2.5">
              <h1 className="whitespace-nowrap text-2xl font-semibold leading-tight tracking-[-0.02em] tabular-nums">OUT-2026-001248</h1>
              <button type="button" aria-label="Copy order number" onClick={() => setCopied(true)} className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {copied ? <Check className="size-4 text-success-text" /> : <Copy className="size-4" />}
              </button>
              <Badge variant={status.v}>{status.label}</Badge>
              <Badge variant="success">Paid</Badge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Steps shipped={SHIPPED} cancelled={cancelled} />
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline"><ReceiptText />Print receipt</Button>
                <Button variant="outline"><Printer />Print order</Button>
                <Button disabled={cancelled} onClick={onEdit}><Pencil />Edit</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="More actions"><Ellipsis /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled={cancelled || SHIPPED > 0} onSelect={() => setCancelOrder(true)} className="text-destructive focus:text-destructive"><XCircle />Cancel order</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-0 flex-1 gap-0 overflow-hidden pb-0">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-5">
            {/* 发货进度 */}
            <div className="rounded-xl px-4 py-3.5" style={{ background: 'color-mix(in srgb, var(--attention) 14%, var(--surface-raised))' }}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <p className="font-semibold">Shipping progress{allShipped && <span className="ml-2 text-success-text">· complete</span>}</p>
                <p className="tabular-nums text-muted-foreground">Shipped <span className="font-semibold text-foreground">{SHIPPED}</span> / {PCS} pcs</p>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-card">
                <div className="bar-grow h-full rounded-full" style={{ width: pct + '%', background: allShipped ? 'var(--success)' : 'var(--attention)', transition: 'width 600ms var(--ease-out)' }} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <SlideTabs label="Order sections" value={tab} onChange={setTab}
                items={[
                  { id: 'items', label: <>Line items<span className="text-xs tabular-nums opacity-70">{LINES.length}</span></> },
                  { id: 'deliveries', label: <>Deliveries<span className="text-xs tabular-nums opacity-70">{deliveries.length}</span></> },
                  { id: 'returns', label: <>Returns{returns.length > 0 && <span className="text-xs tabular-nums opacity-70">{returns.length}</span>}</> },
                ]}
                className="flex h-10 items-center gap-0.5 rounded-xl border border-border bg-card p-1"
                itemClassName="flex h-full items-center gap-1.5 rounded-[8px] px-3.5 text-sm"
                activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
                indicatorClassName="rounded-[8px] bg-primary/10" />
              <Button size="lg" disabled={cancelled || leftToSchedule === 0} title={leftToSchedule === 0 ? 'Everything is already shipped or on a draft' : undefined} onClick={() => { setEditing(null); setNewOpen(true); }}><PackagePlus />New delivery</Button>
            </div>

            <div className="-mx-6 min-h-0 flex-1 overflow-y-auto px-6 pb-5 [scrollbar-width:thin]">

            {tab === 'items' && (
              <Table className="[&_td]:whitespace-nowrap [&_th]:whitespace-nowrap [&_td]:px-2.5 [&_th]:px-2.5">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">IVA</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LINES.map((l) => (
                    <TableRow key={l.name}>
                      <TableCell className="max-w-[12rem]">
                        <p className="truncate font-medium" title={l.name}>{l.name}</p>
                        <div className="mt-1 flex gap-1.5">{l.tags.map((t) => <Badge key={t.label} variant={t.tone ?? 'secondary'}>{t.label}</Badge>)}</div>
                      </TableCell>
                      <TableCell className="max-w-[5.5rem] truncate text-muted-foreground" title={l.note}>{l.note ?? '—'}</TableCell>
                      <TableCell><span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">{l.unit}</span></TableCell>
                      <TableCell className="text-right tabular-nums">{l.qty}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{l.weight}</TableCell>
                      <TableCell className="text-right tabular-nums">{l.was && <span className="mr-1.5 text-muted-foreground line-through">{num(l.was)}</span>}{num(l.price)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">22%</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {l.gift ? <span className="text-success-text">Gift</span> : <>{l.was && <span className="mr-1.5 font-normal text-muted-foreground line-through">{num(l.was * l.qty)}</span>}{num(l.price * l.qty)}</>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tab === 'deliveries' && (
              <div className="space-y-3">
                <UnshippedPanel remaining={remaining} onEdit={() => onEdit?.()} />
                {deliveries.length === 0 && <p className="rounded-xl bg-muted px-6 py-10 text-center text-sm text-muted-foreground">No deliveries yet. Use New delivery to schedule the first one.</p>}
                {deliveries.map((d) => (
                  <DeliveryCard key={d.id} d={d} onEdit={() => { setEditing(d); setNewOpen(true); }} onCancel={() => setToCancel(d)} onReturn={() => setReturnFrom(d)} onConfirm={() => setToConfirm(d)} />
                ))}
              </div>
            )}

            {tab === 'returns' && <ReturnsPanel returns={returns} />}
            </div>
          </CardContent>

          {/* 底部合计条：始终贴在卡片底部 */}
          <div className="flex shrink-0 items-end justify-between gap-6 border-t border-border px-6 py-4">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{LINES.length} lines · {PCS} pcs</Badge>
                <Badge variant="success">Paid</Badge>
                <Badge variant={allShipped ? 'success' : 'info'}>Shipped {SHIPPED} / {PCS} pcs</Badge>
              </div>
              <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {([['Goods total', eur(TOTAL)], ['Received', eur(TOTAL)], ['Discount', '—'], ['Balance due', eur(8)]] as const).map(([k, v]) => (
                  <div key={k} className="flex gap-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium tabular-nums">{v}</dd></div>
                ))}
              </dl>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-muted-foreground">Final price</p>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">{eur(TOTAL)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ───────── 右：客户 + 订单信息 ───────── */}
      <div className="-m-4 flex min-h-0 min-w-0 flex-col gap-5 overflow-y-auto p-4 [scrollbar-width:thin]">
        <Card className="shrink-0 gap-3 pb-5 pt-4">
          <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="mt-1 text-base font-semibold">1042 Luce Beauty Lab</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {([['Account balance', eur(0)], ['Total payable', eur(0)]] as const).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">{v}</p>
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
              <Info label="P.IVA"><span className="tabular-nums">IT04500091012</span></Info>
              <Info label="Phone"><span className="tabular-nums">+39 02 4500 091</span></Info>
              <Info label="Email" wide>
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate">orders@lucebeautylab.it</span>
                  <button type="button" aria-label="Copy email" title={emailCopied ? 'Copied' : 'Copy email'}
                    onClick={() => { void navigator.clipboard?.writeText('orders@lucebeautylab.it').catch(() => {}); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 1500); }}
                    className="-my-1 grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    {emailCopied ? <Check className="size-3.5 text-success-text" /> : <Copy className="size-3.5" />}
                  </button>
                </span>
              </Info>
              <Info label="Delivery address" wide>Via Tortona 12, 20144 Milano (MI)</Info>
            </dl>
          </CardContent>
        </Card>

        <Card className="shrink-0 gap-3 pb-5 pt-4">
          <CardHeader><CardTitle className="text-base">Order info</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <Info label="Branch">Main store</Info>
              <Info label="Salesperson">Elena Rossi</Info>
              <Info label="Fulfillment" wide>—</Info>
              <Info label="Notes" wide>Customer collects the remaining Absolut Repair on Friday</Info>
              <Info label="Created"><span className="tabular-nums">03/09/2026 11:20</span></Info>
              <Info label="Invoice to">Customer account (HQ)</Info>
              <Info label="Invoice status"><Badge variant="secondary">Not invoiced</Badge></Info>
              <Info label="Payment status"><Badge variant="success">Paid</Badge></Info>
              <Info label="Payment method">Card · {eur(TOTAL)}</Info>
              <Info label="Paid at"><span className="tabular-nums">03/09/2026 11:20</span></Info>
              <Info label="Shipping"><span className="tabular-nums">{eur(8)}</span></Info>
            </dl>
            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <p className="text-xs font-medium text-muted-foreground">Payment details</p>
              <div className="flex justify-between"><span>Card</span><span className="tabular-nums">{eur(TOTAL)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total received</span><span className="tabular-nums">{eur(TOTAL)}</span></div>
            </div>
            <div className="space-y-2 rounded-xl bg-muted px-4 py-3.5 text-sm">
              <p className="text-xs font-medium text-muted-foreground">Amount summary</p>
              <div className="flex justify-between text-muted-foreground"><span>Pre-tax</span><span className="tabular-nums">{eur(PRE_TAX)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>IVA</span><span className="tabular-nums">{eur(TOTAL - PRE_TAX)}</span></div>
              <div className="flex justify-between font-semibold"><span>Goods total (incl. VAT)</span><span className="tabular-nums">{eur(TOTAL)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>—</span></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Final price (incl. VAT)</span><span className="tabular-nums">{eur(TOTAL)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeliveryDialog open={newOpen} onClose={() => setNewOpen(false)} remaining={remaining} editing={editing}
        onSave={(data) => {
          if (editing) setDeliveries((p) => p.map((d) => (d.id === editing.id ? { ...d, ...data } : d)));
          else setDeliveries((p) => [{ ...data, id: Date.now(), no: nextNo(), status: 'draft', date: nowStamp() }, ...p]);
          setNewOpen(false); setTab('deliveries');
        }} />
      <Confirm open={!!toConfirm} onClose={() => setToConfirm(null)} title={`Confirm shipment of ${toConfirm?.no ?? ''}?`} action="Confirm shipment"
        body={toConfirm?.method === 'courier' && !(toConfirm.packages?.length) ? 'This courier delivery has no parcels yet. Edit it to add weights and sizes first.' : 'The goods leave stock and the delivery can no longer be edited.'}
        onConfirm={() => { if (toConfirm && !(toConfirm.method === 'courier' && !(toConfirm.packages?.length))) setDeliveries((p) => p.map((d) => (d.id === toConfirm.id ? { ...d, status: 'shipped', date: nowStamp() } : d))); setToConfirm(null); }} />
      <Confirm open={!!toCancel} onClose={() => setToCancel(null)} title={`Cancel ${toCancel?.no ?? ''}?`} action="Cancel delivery" destructive
        body="The draft is removed and its products go back to Not shipped yet."
        onConfirm={() => { if (toCancel) setDeliveries((p) => p.filter((d) => d.id !== toCancel.id)); setToCancel(null); }} />
      <ReturnDialog delivery={returnFrom} onClose={() => setReturnFrom(null)}
        onSave={(r) => { setReturns((p) => [{ ...r, id: Date.now(), no: `RET-2026-00${41 + p.length}`, date: nowStamp() }, ...p]); setReturnFrom(null); setTab('returns'); }} />
      <Confirm open={cancelOrder} onClose={() => setCancelOrder(false)} title="Cancel OUT-2026-001248?" action="Cancel order" destructive
        body="Nothing has shipped yet. Cancelling releases the reserved stock; the payment is handled in Finance."
        onConfirm={() => { if (cancelReason) { setCancelled(true); setCancelOrder(false); } }}>
        <Select value={cancelReason || null} onValueChange={setCancelReason} size="lg" placeholder="Reason (required)" triggerClassName="!h-10 w-full rounded-xl"
          options={['Customer cancelled', 'Duplicate order', 'Out of stock', 'Other'].map((x) => ({ value: x, label: x }))} />
      </Confirm>
    </div>
  );
}
