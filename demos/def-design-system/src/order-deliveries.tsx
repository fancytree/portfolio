import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronRight, ClipboardList, Copy, MapPin, Package, Pencil, Plus, Printer, RotateCcw, Store, Trash2, Truck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { SlideTabs } from './motion';
import { FormDialog, FormSection } from './form-dialog';

/**
 * 订单详情的发货与退货部分，对齐真实 ERP 的 SalesOrderDetail：
 * 未发货商品面板、发货单卡片（草稿：编辑 / 理货单 / DDT / 取消 / 确认发货；已发货：发起退货 / 查看 DDT）、
 * 新建发货单弹窗（选商品 → 自提时段 / 快递装箱算运费 / 送货上门校验 CAP）、退货弹窗与退货记录。
 */

export const eur = (v: number) => '€' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const num = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const r2 = (v: number) => Math.round(v * 100) / 100;

export type Line = { name: string; tags: { label: string; tone?: 'success' | 'warning' }[]; note?: string; unit: string; qty: number; weight: string; kg: number; price: number; was?: number; gift?: boolean };
export const LINES: Line[] = [
  { name: 'L’Oréal Pro Vitamino Color shampoo', tags: [{ label: 'Blonde' }], unit: 'PZ', qty: 24, weight: '0.55 kg', kg: 0.55, price: 13 },
  { name: 'Olaplex Nº7 Bonding Oil', tags: [{ label: '30 ml' }, { label: 'Discount', tone: 'warning' }], note: 'Rebate agreed', unit: 'Box', qty: 2, weight: '0.18 kg', kg: 0.18, price: 66.5, was: 70 },
  { name: 'L’Oréal Pro Absolut Repair mask', tags: [{ label: '150 ml' }], unit: 'PZ', qty: 4, weight: '1.62 kg', kg: 1.62, price: 45 },
  { name: 'DEF Anti-Dandruff Shampoo', tags: [{ label: 'Fresh mint' }], unit: 'Carton', qty: 3, weight: '6.6 kg', kg: 6.6, price: 66 },
  { name: 'OPI Nail & Cuticle Oil', tags: [{ label: 'Classic' }, { label: 'Gift', tone: 'success' }], unit: 'PZ', qty: 6, weight: '0.03 kg', kg: 0.03, price: 15, gift: true },
];

export type Method = 'pickup' | 'courier' | 'home';
export type Pkg = { weight: string; l: string; w: string; h: string; carrier: string; tracking: string };
export type Delivery = {
  id: number; no: string; status: 'draft' | 'shipped'; method: Method; items: Record<number, number>; date: string;
  pickupDate?: string; slot?: string; packages?: Pkg[]; fee?: number | null; actual?: number; address?: string; note?: string;
};
export type Return = { id: number; no: string; delivery: string; items: Record<number, number>; reason: string; refund: 'refund' | 'balance'; date: string; amount: number };

export const SEED_DELIVERIES: Delivery[] = [
  { id: 2, no: 'DDT-2026-0119', status: 'shipped', method: 'pickup', date: '05/09/2026 16:10', pickupDate: '05/09/2026', slot: '16:00–17:00', items: { 0: 4, 1: 2, 3: 3, 4: 5 } },
  { id: 1, no: 'DDT-2026-0113', status: 'shipped', method: 'courier', date: '04/09/2026 10:30', items: { 0: 20 }, fee: 8, actual: 9.4, address: 'Via Tortona 12, 20144 Milano (MI)',
    packages: [{ weight: '11.2', l: '40', w: '30', h: '25', carrier: 'BRT', tracking: 'BRT0581446203' }] },
];

const CARRIERS = ['BRT', 'GLS', 'Poste Italiane', 'DHL'];
const METHOD: Record<Method, { label: string; icon: React.ComponentType<{ className?: string }> }> = { pickup: { label: 'Pickup', icon: Store }, courier: { label: 'Courier', icon: Truck }, home: { label: 'Home delivery', icon: MapPin } };
const qtyOf = (items: Record<number, number>) => Object.values(items).reduce((s, q) => s + q, 0);
const lineAmount = (l: Line, q: number) => (l.gift ? 0 : r2(l.price * q));

/** 包裹计算：体积重 = 长×宽×高 / 5000；计费重取实重与体积重较大者；建议运费 = 6.90 + 0.85 €/kg */
const VOL_FACTOR = 5000;
export function pkgCalc(p: Pkg) {
  const w = Number(p.weight) || 0, vol = ((Number(p.l) || 0) * (Number(p.w) || 0) * (Number(p.h) || 0)) / VOL_FACTOR;
  return { weight: w, vol: r2(vol * 1000) / 1000, charge: Math.max(w, vol) };
}
export const suggestedFee = (pkgs: Pkg[]) => r2(6.9 + 0.85 * pkgs.reduce((s, p) => s + pkgCalc(p).charge, 0));

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" aria-label={label} title={done ? 'Copied' : label}
      onClick={() => { void navigator.clipboard?.writeText(text).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      {done ? <Check className="size-3.5 text-success-text" /> : <Copy className="size-3.5" />}
    </button>
  );
}

/* ───────── 未发货商品 ───────── */
export function UnshippedPanel({ remaining, onEdit }: { remaining: number[]; onEdit: () => void }) {
  const rows = LINES.map((l, i) => ({ l, i, left: remaining[i] })).filter((x) => x.left > 0);
  if (!rows.length) return null;
  const pcs = rows.reduce((s, x) => s + x.left, 0);
  return (
    <section className="rounded-xl border border-[color-mix(in_srgb,var(--warning)_35%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_6%,var(--surface-raised))]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-semibold">Not shipped yet <span className="font-normal text-muted-foreground">· {rows.length} lines · {pcs} pcs waiting</span></p>
        <Button variant="outline" size="sm" onClick={onEdit}><Pencil />Edit</Button>
      </div>
      <table className="w-full text-sm [&_td]:whitespace-nowrap">
        <tbody className="divide-y divide-border border-t border-border">
          {rows.map(({ l, i, left }) => (
            <tr key={i} className="[&>td]:px-4 [&>td]:py-2">
              <td className="max-w-0 truncate font-medium">{l.name}</td>
              <td className="w-28 text-right text-xs text-muted-foreground tabular-nums">ordered {l.qty} {l.unit}</td>
              <td className="w-24 text-right font-semibold tabular-nums">{left} {l.unit}</td>
              <td className="w-24 text-right tabular-nums text-muted-foreground">{l.gift ? <span className="text-success-text">Gift</span> : num(l.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* ───────── 发货单卡片 ───────── */
export function DeliveryCard({ d, onConfirm, onCancel, onEdit, onReturn }: { d: Delivery; onConfirm: () => void; onCancel: () => void; onEdit: () => void; onReturn: () => void }) {
  const M = METHOD[d.method];
  const pcs = qtyOf(d.items);
  const pkgs = d.packages ?? [];
  const totals = pkgs.reduce((a, p) => { const c = pkgCalc(p); return { w: a.w + c.weight, c: a.c + c.charge }; }, { w: 0, c: 0 });
  const draft = d.status === 'draft';
  return (
    <article className={'overflow-hidden rounded-xl border ' + (draft ? 'border-[color-mix(in_srgb,var(--primary)_35%,var(--border))]' : 'border-border')}>
      <header className="flex items-start justify-between gap-4 px-4 py-3.5">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground"><M.icon className="size-4" /></span>
            <span className="font-semibold tabular-nums">{d.no}</span><CopyButton text={d.no} label={`Copy ${d.no}`} />
            <Badge variant={draft ? 'info' : 'success'}>{draft ? 'Draft' : 'Shipped'}</Badge>
          </div>
          <p className="flex flex-wrap gap-x-3 gap-y-0.5 pl-9 text-xs text-muted-foreground">
            <span>{M.label}</span><span className="tabular-nums">{pcs} pcs</span>
            {d.method === 'pickup' && <span>{d.slot ? `Pickup ${d.pickupDate} · ${d.slot}` : 'Pickup time to be confirmed'}</span>}
            {d.method !== 'pickup' && d.address && <span className="truncate">{d.address}</span>}
            {!draft && <span className="tabular-nums">Shipped {d.date}</span>}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {draft ? (<>
            <Button variant="ghost" size="sm" onClick={onEdit}><Pencil />Edit</Button>
            <Button variant="ghost" size="sm"><ClipboardList />Pick list</Button>
            <Button variant="ghost" size="sm"><Printer />DDT</Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-destructive" onClick={onCancel}>Cancel</Button>
            <Button size="sm" onClick={onConfirm}><Check />Confirm shipment</Button>
          </>) : (<>
            <Button variant="ghost" size="sm" onClick={onReturn}><RotateCcw />Return</Button>
            <Button variant="outline" size="sm"><Printer />View DDT</Button>
          </>)}
        </div>
      </header>

      {d.method !== 'pickup' && (
        <div className="mx-4 mb-3 grid grid-cols-4 rounded-xl bg-muted text-xs">
          {([
            ['Charged to customer', d.fee == null ? 'Free shipping' : eur(d.fee)],
            ['Actual cost', d.actual != null ? eur(d.actual) : '—'],
            ['Parcels', pkgs.length ? `${pkgs.length} · ${totals.w.toFixed(2)} kg` : '—'],
            ['Chargeable · suggested', pkgs.length ? `${totals.c.toFixed(2)} kg · ${eur(suggestedFee(pkgs))}` : '—'],
          ] as const).map(([k, v]) => (
            <div key={k} className="px-3.5 py-2.5"><p className="text-muted-foreground">{k}</p><p className="mt-0.5 font-medium tabular-nums text-foreground">{v}</p></div>
          ))}
        </div>
      )}
      {pkgs.length > 0 && (
        <ul className="space-y-1 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
          {pkgs.map((p, k) => { const c = pkgCalc(p); return (
            <li key={k} className="flex flex-wrap items-center gap-x-2 tabular-nums">
              <span className="font-medium text-foreground">Parcel {k + 1}</span>
              <span>{c.weight.toFixed(2)} kg · {p.l}×{p.w}×{p.h} cm · volumetric {c.vol.toFixed(2)} kg</span>
              {p.carrier && <span>· {p.carrier}</span>}
              {p.tracking && <span className="inline-flex items-center gap-0.5">· {p.tracking}<CopyButton text={p.tracking} label="Copy tracking number" /></span>}
            </li>
          ); })}
        </ul>
      )}
      {draft && d.method === 'courier' && pkgs.length === 0 && (
        <p className="border-t border-border bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] px-4 py-2 text-xs text-warning-text">Add the parcel weights and sizes (Edit) before confirming shipment.</p>
      )}
      <table className="w-full border-t border-border text-sm [&_td]:whitespace-nowrap">
        <tbody className="divide-y divide-border">
          {Object.entries(d.items).map(([i, q]) => { const l = LINES[Number(i)]; return (
            <tr key={i} className="[&>td]:px-4 [&>td]:py-2">
              <td className="max-w-0 truncate">{l.name}</td>
              <td className="w-24 text-right tabular-nums">{q} {l.unit}</td>
              <td className="w-24 text-right tabular-nums text-muted-foreground">{l.gift ? <span className="text-success-text">Gift</span> : num(l.price)}</td>
            </tr>
          ); })}
        </tbody>
      </table>
      {d.note && <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Note: {d.note}</p>}
    </article>
  );
}

/* ───────── 新建 / 编辑发货单 ───────── */
/** 布局对齐原 ERP 的 DeliveryForm：送货方式（按钮组）→ 自提时间（日期 / 时段级联）或地址 → 快递装箱与运费 → 备注 → 本次发货商品。 */
const PICKUP_DAYS = ['18/11/2026', '19/11/2026', '20/11/2026', '21/11/2026'];
const SLOTS: { slot: string; left: number }[] = [
  { slot: '09:00–10:00', left: 2 }, { slot: '10:00–11:00', left: 3 }, { slot: '11:00–12:00', left: 1 },
  { slot: '14:00–15:00', left: 4 }, { slot: '15:00–16:00', left: 2 }, { slot: '16:00–17:00', left: 3 },
];
const METHOD_ORDER: Method[] = ['pickup', 'home', 'courier'];
const blankPkg = (): Pkg => ({ weight: '', l: '', w: '', h: '', carrier: 'BRT', tracking: '' });

function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-muted-foreground">{children}{required && <span className="ml-0.5 text-destructive">*</span>}</label>;
}

/** 自提时间：一个下拉，左列日期、右列时段（对齐原 PickupTimeCascadeSelect）；可以留空「时间待确认」 */
function PickupTimeSelect({ date, slot, onChange }: { date: string; slot: string; onChange: (date: string, slot: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(date || 'pending');
  useEffect(() => { if (open) setActive(date || 'pending'); }, [open, date]);
  const opt = (on: boolean, sel: boolean) => 'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ' + (on ? 'bg-[var(--surface-hover)] ' : 'hover:bg-[var(--surface-hover)] ') + (sel ? 'font-semibold text-primary-strong' : '');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" id="delivery-pickup-time" aria-haspopup="listbox" aria-expanded={open}
          className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 text-sm transition-colors hover:bg-[var(--surface-hover)]">
          <span className={'truncate tabular-nums ' + (date && slot ? '' : 'text-muted-foreground')}>{date && slot ? `${date} · ${slot}` : 'Time to be confirmed'}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="flex h-[268px] w-[var(--radix-popover-trigger-width)] min-w-[26rem] flex-row gap-0 overflow-hidden rounded-xl p-0 text-sm">
        <div role="listbox" aria-label="Pickup date" className="flex w-1/2 flex-col border-r border-border">
          <p className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">Date</p>
          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1">
            <button type="button" role="option" aria-selected={!date} className={opt(active === 'pending', !date)} onMouseEnter={() => setActive('pending')} onClick={() => { onChange('', ''); setOpen(false); }}>Time to be confirmed</button>
            {PICKUP_DAYS.map((d) => (
              <button key={d} type="button" role="option" aria-selected={date === d} className={opt(active === d, date === d)} onMouseEnter={() => setActive(d)} onClick={() => setActive(d)}>
                <span className="tabular-nums">{d}</span><ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
        <div role="listbox" aria-label="Pickup time slot" className="flex w-1/2 flex-col">
          <p className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">Time slot</p>
          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1">
            {active === 'pending' ? <p className="px-2.5 py-3 text-sm text-muted-foreground">Pick a date to see the slots</p>
              : SLOTS.map((x) => {
                const sel = date === active && slot === x.slot;
                return (
                  <button key={x.slot} type="button" role="option" aria-selected={sel} className={opt(false, sel)} onClick={() => { onChange(active, x.slot); setOpen(false); }}>
                    <span className="tabular-nums">{x.slot}</span><span className="text-xs font-normal tabular-nums text-muted-foreground">{x.left} left</span>
                  </button>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DeliveryDialog({ open, onClose, remaining, editing, onSave }: { open: boolean; onClose: () => void; remaining: number[]; editing: Delivery | null; onSave: (d: Omit<Delivery, 'id' | 'no' | 'status' | 'date'>) => void }) {
  // 编辑草稿时，本单已占用的数量也算可选
  const avail = useMemo(() => remaining.map((r, i) => r + (editing?.items[i] ?? 0)), [remaining, editing]);
  const rows = LINES.map((l, i) => ({ l, i, a: avail[i] })).filter((x) => x.a > 0); // 已全部发出的商品不列出
  const [pick, setPick] = useState<Record<number, number>>({});
  const [method, setMethod] = useState<Method>('pickup');
  const [pDate, setPDate] = useState('');
  const [slot, setSlot] = useState('');
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [free, setFree] = useState(false);
  const [fee, setFee] = useState('8.00');
  const [actual, setActual] = useState('');
  const [address, setAddress] = useState('Via Tortona 12, 20144 Milano (MI)');
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false);
  useEffect(() => {
    if (!open) return;
    setTried(false);
    if (editing) {
      setPick({ ...editing.items }); setMethod(editing.method); setPDate(editing.pickupDate ?? ''); setSlot(editing.slot ?? '');
      setPkgs(editing.packages?.map((p) => ({ ...p })) ?? []); setFree(editing.fee == null); setFee(editing.fee != null ? editing.fee.toFixed(2) : '8.00');
      setActual(editing.actual != null ? String(editing.actual) : ''); setAddress(editing.address ?? 'Via Tortona 12, 20144 Milano (MI)'); setNote(editing.note ?? '');
    } else {
      setPick(Object.fromEntries(rows.map((x) => [x.i, x.a])));
      setMethod('pickup'); setPDate(''); setSlot(''); setPkgs([]); setFree(false); setFee('8.00'); setActual(''); setNote('');
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = Object.entries(pick).filter(([, q]) => q > 0);
  const pcs = selected.reduce((s, [, q]) => s + q, 0);
  const allSelected = rows.length > 0 && rows.every((x) => (pick[x.i] ?? 0) > 0);
  const cap = address.match(/\b(\d{5})\b/)?.[1];
  const capOk = !!cap && cap.startsWith('201');
  const pkgDone = (p: Pkg) => Number(p.weight) > 0 && Number(p.l) > 0 && Number(p.w) > 0 && Number(p.h) > 0;
  const pkgIncomplete = pkgs.some((p) => !pkgDone(p));
  const totals = pkgs.reduce((a, p) => { const c = pkgCalc(p); return { w: a.w + c.weight, c: a.c + c.charge }; }, { w: 0, c: 0 });
  const suggestion = pkgs.length && !pkgIncomplete ? suggestedFee(pkgs) : null;
  const errors = [
    !selected.length && 'Select at least one product',
    method !== 'pickup' && !address.trim() && 'Enter the delivery address',
    method === 'home' && !capOk && 'Home delivery covers Milan postcodes (201xx) only',
    method === 'courier' && pkgIncomplete && 'Fill weight and size for every parcel',
    method === 'courier' && pkgs.length > 0 && !free && fee === '' && 'Enter the shipping fee or mark it free',
  ].filter(Boolean) as string[];

  const save = () => {
    setTried(true);
    if (errors.length) return;
    onSave({
      method, items: Object.fromEntries(selected.map(([i, q]) => [Number(i), q])),
      pickupDate: method === 'pickup' ? pDate || undefined : undefined, slot: method === 'pickup' ? slot || undefined : undefined,
      packages: method === 'courier' ? pkgs : undefined, fee: method === 'courier' ? (free ? null : Number(fee)) : method === 'home' ? null : undefined,
      actual: method === 'courier' && actual ? Number(actual) : undefined, address: method === 'pickup' ? undefined : address, note: note || undefined,
    });
  };

  return (
    <FormDialog open={open} onOpenChange={(o) => !o && onClose()} className="h-[min(85vh,46rem)] sm:max-w-2xl"
      title={editing ? `Edit delivery · ${editing.no}` : 'New delivery note'}
      description={<>OUT-2026-001248 · Luce Beauty Lab</>}
      status={tried && errors.length ? <span className="text-destructive">{errors[0]}</span>
        : selected.length ? <>Creates a delivery with {selected.length} SKUs, <span className="font-semibold text-foreground tabular-nums">{pcs} pcs</span></> : 'Select at least one product'}
      confirmLabel={editing ? 'Save changes' : 'Create delivery'} onConfirm={save}>

      <FormSection title="Delivery method"
        control={method === 'home' && !capOk ? <p className="text-xs text-destructive">Outside the home-delivery area</p> : undefined}>
        <div role="radiogroup" aria-label="Delivery method" className="flex flex-wrap gap-1.5">
          {METHOD_ORDER.map((m) => {
            const on = method === m; const I = METHOD[m].icon;
            return <Button key={m} type="button" role="radio" aria-checked={on} variant={on ? 'default' : 'secondary'} className="min-w-28" onClick={() => setMethod(m)}><I />{METHOD[m].label}</Button>;
          })}
        </div>

        {method === 'pickup' && (
          <div className="mt-4">
            <FieldLabel htmlFor="delivery-pickup-time">Pickup time (optional)</FieldLabel>
            <PickupTimeSelect date={pDate} slot={slot} onChange={(d, s) => { setPDate(d); setSlot(s); }} />
            <p className="mt-1.5 text-xs text-muted-foreground">Leave it as to be confirmed if the customer hasn’t chosen yet.</p>
          </div>
        )}

        {method !== 'pickup' && (
          <div className="mt-4">
            <FieldLabel htmlFor="delivery-address" required>Delivery address</FieldLabel>
            <Input id="delivery-address" value={address} onChange={(e) => setAddress(e.target.value)} className={'h-10 rounded-xl ' + (tried && !address.trim() ? 'border-destructive' : '')} />
            {method === 'home' && <p className={'mt-1.5 text-xs ' + (capOk ? 'text-success-text' : 'text-destructive')}>{cap ? (capOk ? `CAP ${cap} is inside the delivery area` : `CAP ${cap} is outside the delivery area`) : 'The address needs a CAP to check the delivery area'}</p>}
          </div>
        )}
      </FormSection>

      {method === 'courier' && (
        <>
          <FormSection title="Parcels" control={<Button variant="outline" onClick={() => setPkgs((p) => [...p, blankPkg()])}><Plus />Add parcel</Button>}>
            {pkgs.length === 0 ? <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">No parcels yet. You can save now and add them before confirming shipment.</p> : (
              <>
                {/* 一个包裹一行：表头只出现一次 */}
                <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.4fr)_minmax(0,1.8fr)_2rem] items-center gap-2">
                  {['Weight kg', 'L cm', 'W cm', 'H cm', 'Carrier', 'Tracking no.'].map((x) => <span key={x} className="text-xs text-muted-foreground">{x}</span>)}
                  <span />
                  {pkgs.map((p, k) => {
                    const set = (patch: Partial<Pkg>) => setPkgs((x) => x.map((y, j) => (j === k ? { ...y, ...patch } : y)));
                    return (
                      <React.Fragment key={k}>
                        {([['weight', 'weight', 'Weight (kg)'], ['l', 'length', 'Length (cm)'], ['w', 'width', 'Width (cm)'], ['h', 'height', 'Height (cm)']] as const).map(([f, id, label]) => (
                          <Input key={f} id={`package-${k}-${id}`} value={p[f]} inputMode="decimal" aria-label={`Parcel ${k + 1} ${label}`} onChange={(e) => set({ [f]: e.target.value } as Partial<Pkg>)}
                            className={'h-10 rounded-xl tabular-nums ' + (tried && !(Number(p[f]) > 0) ? 'border-destructive' : '')} />
                        ))}
                        <Select value={p.carrier} onValueChange={(v) => set({ carrier: v })} size="lg" ariaLabel={`Parcel ${k + 1} carrier`} triggerClassName="!h-10 w-full rounded-xl" options={CARRIERS.map((x) => ({ value: x, label: x }))} />
                        <Input id={`package-${k}-tracking`} value={p.tracking} placeholder="Optional" aria-label={`Parcel ${k + 1} tracking number`} onChange={(e) => set({ tracking: e.target.value })} className="h-10 rounded-xl" />
                        <button type="button" aria-label={`Remove parcel ${k + 1}`} title="Remove parcel" className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-status-danger-subtle hover:text-destructive" onClick={() => setPkgs((x) => x.filter((_, j) => j !== k))}><Trash2 className="size-4" /></button>
                      </React.Fragment>
                    );
                  })}
                </div>
                <p data-suggested className="mt-3 text-sm text-muted-foreground tabular-nums">
                  {pkgIncomplete ? 'Fill weight and size to calculate the fee.'
                    : <>Chargeable <span className="font-medium text-foreground">{totals.c.toFixed(2)} kg</span> · suggested fee <span className="font-semibold text-foreground">{suggestion != null ? eur(suggestion) : '—'}</span></>}
                </p>
              </>
            )}
          </FormSection>
          <FormSection title="Shipping fee" control={<label className="flex items-center gap-2 text-sm"><Checkbox checked={free} onCheckedChange={(c) => { setFree(c === true); if (c === true) setFee('0'); }} />Free shipping</label>}>
            <div className="grid grid-cols-2 gap-3">
              <div><FieldLabel htmlFor="delivery-fee-charged">Charged to customer (€)</FieldLabel><Input id="delivery-fee-charged" value={free ? '' : fee} disabled={free} placeholder={free ? 'Free' : suggestion != null ? num(suggestion) : '0.00'} inputMode="decimal" onChange={(e) => setFee(e.target.value)} className="h-10 rounded-xl text-right tabular-nums" /></div>
              <div><FieldLabel htmlFor="delivery-fee-actual">Actual courier cost (€) · internal</FieldLabel><Input id="delivery-fee-actual" value={actual} placeholder="Add after shipping" inputMode="decimal" onChange={(e) => setActual(e.target.value)} className="h-10 rounded-xl text-right tabular-nums" /></div>
            </div>
          </FormSection>
        </>
      )}

      <FormSection title="Notes">
        <Textarea id="delivery-notes" value={note} onChange={(e) => setNote(e.target.value)} rows={1} placeholder="For the warehouse or the courier" className="min-h-10 resize-none rounded-xl" />
      </FormSection>

      <FormSection title="Products in this delivery" hint={<>{selected.length} lines · <span className="tabular-nums">{pcs}</span> pcs selected</>}>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full table-fixed text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
            <colgroup><col style={{ width: 44 }} /><col /><col style={{ width: 92 }} /><col style={{ width: 84 }} /><col style={{ width: 116 }} /></colgroup>
            <thead><tr className="bg-muted text-xs text-muted-foreground [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
              <th><Checkbox checked={allSelected ? true : selected.length ? 'indeterminate' : false} aria-label={allSelected ? 'Clear all' : 'Select all'}
                onCheckedChange={() => setPick(allSelected ? {} : Object.fromEntries(rows.map((x) => [x.i, pick[x.i] || x.a])))} /></th>
              <th className="text-left">Product</th><th className="text-right">Ordered</th><th className="text-right">Shipped</th><th className="text-right">This delivery</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map(({ l, i, a }) => {
                const q = pick[i] ?? 0; const on = q > 0;
                return (
                  <tr key={i} className="[&>td]:px-3 [&>td]:py-2">
                    <td><Checkbox checked={on} onCheckedChange={(c) => setPick((p) => ({ ...p, [i]: c === true ? a : 0 }))} aria-label={`Include ${l.name}`} /></td>
                    <td className="truncate" title={l.name}>{l.name}{l.gift && <span className="ml-1.5 text-xs text-success-text">Gift</span>}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{l.qty} {l.unit}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{l.qty - a} {l.unit}</td>
                    <td className="text-right">{on ? <QuantityStepper value={q} label={`delivery quantity for ${l.name}`} containerClassName="ml-auto w-20" canDecrease={q > 1} canIncrease={q < a}
                      onInputChange={(v) => setPick((p) => ({ ...p, [i]: Math.min(a, Math.max(1, Number(v) || 1)) }))} onStep={(dlt) => setPick((p) => ({ ...p, [i]: Math.min(a, Math.max(1, (p[i] ?? 1) + dlt)) }))} />
                      : <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">Everything on this order is already shipped or on a draft.</td></tr>}
            </tbody>
          </table>
        </div>
      </FormSection>
    </FormDialog>
  );
}

/* ───────── 退货 ───────── */
const REASONS = ['Damaged in transit', 'Wrong item', 'Customer changed mind', 'Expired or short-dated', 'Other'];

export function ReturnDialog({ delivery, onClose, onSave }: { delivery: Delivery | null; onClose: () => void; onSave: (r: Omit<Return, 'id' | 'no' | 'date'>) => void }) {
  const [pick, setPick] = useState<Record<number, number>>({});
  const [reason, setReason] = useState('');
  const [refund, setRefund] = useState<'refund' | 'balance'>('balance');
  useEffect(() => { if (delivery) { setPick({}); setReason(''); setRefund('balance'); } }, [delivery]);
  const amount = Object.entries(pick).reduce((s, [i, q]) => s + lineAmount(LINES[Number(i)], q), 0);
  const pcs = qtyOf(pick);
  return (
    <FormDialog open={!!delivery} onOpenChange={(o) => !o && onClose()} title="Create return" description={delivery ? <>From {delivery.no} · shipped {delivery.date}</> : undefined}
      status={pcs ? <>{pcs} pcs · <span className="font-semibold text-foreground tabular-nums">{eur(amount)}</span> {refund === 'balance' ? 'to account balance' : 'to refund'}</> : 'Choose the goods coming back'}
      confirmLabel="Create return" confirmDisabled={!pcs || !reason} onConfirm={() => delivery && onSave({ delivery: delivery.no, items: Object.fromEntries(Object.entries(pick).filter(([, q]) => q > 0).map(([i, q]) => [Number(i), q])), reason, refund, amount })}>
      <FormSection title="Goods returned">
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {delivery && Object.entries(delivery.items).map(([i, max]) => { const l = LINES[Number(i)]; const q = pick[Number(i)] ?? 0; return (
            <div key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className="min-w-0 flex-1 truncate">{l.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">of {max} {l.unit}</span>
              <QuantityStepper value={q} label={`return quantity for ${l.name}`} containerClassName="w-20" canDecrease={q > 0} canIncrease={q < max}
                onInputChange={(v) => setPick((p) => ({ ...p, [i]: Math.min(max, Math.max(0, Number(v) || 0)) }))} onStep={(dlt) => setPick((p) => ({ ...p, [i]: Math.min(max, Math.max(0, (p[Number(i)] ?? 0) + dlt)) }))} />
            </div>
          ); })}
        </div>
      </FormSection>
      <FormSection title="Reason and settlement">
        <div className="grid grid-cols-2 gap-3">
          <Select value={reason || null} onValueChange={setReason} size="lg" placeholder="Reason" triggerClassName="!h-10 w-full rounded-xl" options={REASONS.map((x) => ({ value: x, label: x }))} />
          <SlideTabs label="Settlement" value={refund} onChange={setRefund}
            items={[{ id: 'balance', label: 'To balance' }, { id: 'refund', label: 'Refund' }]}
            className="flex h-10 items-center gap-0.5 rounded-xl border border-input p-1" itemClassName="h-full flex-1 rounded-[8px] px-3 text-sm"
            activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground" indicatorClassName="rounded-[8px] bg-primary/10" />
        </div>
      </FormSection>
    </FormDialog>
  );
}

export function ReturnsPanel({ returns }: { returns: Return[] }) {
  if (!returns.length) return (
    <div className="rounded-xl bg-muted px-6 py-12 text-center">
      <p className="text-sm font-medium">No returns on this order</p>
      <p className="mt-1 text-xs text-muted-foreground">Start a return from a shipped delivery in the Deliveries tab.</p>
    </div>
  );
  return (
    <div className="space-y-3">
      {returns.map((r) => (
        <article key={r.id} className="overflow-hidden rounded-xl border border-border">
          <header className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-muted text-muted-foreground"><RotateCcw className="size-4" /></span>
              <span className="font-semibold tabular-nums">{r.no}</span><Badge variant="warning">Awaiting goods</Badge></div>
            <span className="text-xs text-muted-foreground">from {r.delivery} · {r.date}</span>
          </header>
          <div className="mx-4 mb-3 grid grid-cols-3 rounded-xl bg-muted text-xs">
            {([['Reason', r.reason], ['Settlement', r.refund === 'balance' ? 'Credit to balance' : 'Refund'], ['Amount', eur(r.amount)]] as const).map(([k, v]) => (
              <div key={k} className="px-3.5 py-2.5"><p className="text-muted-foreground">{k}</p><p className="mt-0.5 font-medium tabular-nums">{v}</p></div>
            ))}
          </div>
          <table className="w-full border-t border-border text-sm"><tbody className="divide-y divide-border">
            {Object.entries(r.items).map(([i, q]) => <tr key={i} className="[&>td]:px-4 [&>td]:py-2"><td className="max-w-0 truncate">{LINES[Number(i)].name}</td><td className="w-24 text-right tabular-nums">{q} {LINES[Number(i)].unit}</td></tr>)}
          </tbody></table>
        </article>
      ))}
    </div>
  );
}

