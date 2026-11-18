import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, FileText, Hourglass, Loader2, PackageX, Search, Undo2, UploadCloud } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { FormDialog, FormSection } from './form-dialog';
import { SlideTabs } from './motion';
import { LIBRARY, NEW_PRODUCT_NOTE, REMAINING, type PoLine, type RemainingDecision } from './purchase-data';

/** 采购单上的弹窗：添加商品、建 SKU、上传单据（确认单 / DDT）、处理剩余商品。功能对齐原 ERP，样式用 FormDialog pattern。 */

function Field({ id, label, required, children }: { id?: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs text-muted-foreground">{label}{required && <span className="ml-0.5 text-destructive">*</span>}</label>
      {children}
    </div>
  );
}
const INPUT = 'h-10 rounded-xl';

/* ───────── 添加商品：商品库已有 / 新商品 ───────── */
export function AddProductDialog({ open, onOpenChange, orderLines, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; orderLines: PoLine[]; onAdd: (lines: PoLine[]) => void }) {
  const [kind, setKind] = useState<'existing' | 'new'>('existing');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('MNP');
  const [link, setLink] = useState('');
  const [qty, setQty] = useState('');
  const [cost, setCost] = useState('');
  useEffect(() => { if (!open) { setKind('existing'); setQuery(''); setPicked([]); setDescription(''); setBrand('MNP'); setLink(''); setQty(''); setCost(''); } }, [open]);

  const onOrder = useMemo(() => new Set(orderLines.map((l) => l.sku)), [orderLines]);
  const kw = query.trim().toLowerCase();
  const results = useMemo(() => !kw ? [] : [...LIBRARY.filter((l) => !onOrder.has(l.sku)), ...orderLines].filter((l) =>
    [l.productName, l.productCode, l.variant, l.nameIt, l.sku].some((s) => s.toLowerCase().includes(kw))), [kw, onOrder, orderLines]);

  const addNew = () => {
    const name = description.trim();
    const amount = Math.max(0, Number(qty) || 0);
    const id = `new-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    onAdd([{ productId: `p-${id}`, productCode: 'NEW', productName: name, sku: id.toUpperCase().slice(0, 14), variant: brand.trim() || 'New', nameIt: link.trim() || 'Supplier description to be confirmed', stock: 0, sales30: 0, qty: 0, plannedQty: amount, estimatedPrice: Math.max(0, Number(cost) || 0), confirmedPrice: null, alert: NEW_PRODUCT_NOTE }]);
    onOpenChange(false);
  };

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} className="h-[min(554px,85vh)] sm:max-w-2xl" title="Add product"
      description={kind === 'existing' ? 'Pick several variants, then adjust quantities in the order table.' : 'Joins the order as a manual line; create its SKU when the supplier confirms.'}
      status={kind === 'existing' ? (picked.length ? `${picked.length} selected` : 'Search the library to start') : !description.trim() ? 'Product name is required' : undefined}
      confirmLabel={kind === 'existing' ? (picked.length ? `Add selected (${picked.length})` : 'Add selected') : 'Add new product'}
      confirmDisabled={kind === 'existing' ? picked.length === 0 : !description.trim()}
      onConfirm={() => { if (kind === 'existing') { onAdd(LIBRARY.filter((l) => picked.includes(l.sku))); onOpenChange(false); } else addNew(); }}>
      <SlideTabs label="Product type" kind="radio" value={kind} onChange={setKind}
        items={[{ id: 'existing', label: 'Existing product' }, { id: 'new', label: 'New product' }]}
        className="mb-5 grid h-10 grid-cols-2 gap-0.5 rounded-xl bg-muted p-1"
        itemClassName="h-full rounded-[8px] text-sm" activeClassName="font-semibold text-foreground" idleClassName="text-muted-foreground hover:text-foreground"
        indicatorClassName="rounded-[8px] bg-card shadow-[0_1px_2px_rgb(16_24_40/0.08)]" />
      {kind === 'new' ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          <div className="col-span-2"><Field id="new-product-description" label="Product name / description" required><Input id="new-product-description" className={INPUT} value={description} placeholder="e.g. MNP new care kit" onChange={(e) => setDescription(e.target.value)} /></Field></div>
          <Field id="new-product-brand" label="Brand"><Input id="new-product-brand" className={INPUT} value={brand} onChange={(e) => setBrand(e.target.value)} /></Field>
          <Field id="new-product-link" label="Supplier / brand link"><Input id="new-product-link" className={INPUT} value={link} placeholder="https://" onChange={(e) => setLink(e.target.value)} /></Field>
          <Field id="new-product-qty" label="Suggested quantity"><Input id="new-product-qty" className={INPUT + ' tabular-nums'} type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} /></Field>
          <Field id="new-product-cost" label="Expected cost (€)"><Input id="new-product-cost" className={INPUT + ' tabular-nums'} type="number" min="0" step="0.01" value={cost} placeholder="Optional" onChange={(e) => setCost(e.target.value)} /></Field>
        </div>
      ) : (
        <>
          <label className="flex h-10 items-center gap-2 rounded-xl border border-input bg-card px-3 text-sm focus-within:ring-2 focus-within:ring-ring/40">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input aria-label="Search product library" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product code, name or variant…" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
          <div className="mt-3 h-64 overflow-y-auto rounded-xl border border-border [scrollbar-width:thin]">
            {!kw ? <p className="grid h-full place-items-center text-sm text-muted-foreground">Type a keyword to search products</p>
              : results.length === 0 ? <p className="grid h-full place-items-center text-sm text-muted-foreground">No matching product</p>
                : <ul className="divide-y divide-border">{results.map((l) => {
                  const already = onOrder.has(l.sku);
                  const on = picked.includes(l.sku);
                  return (
                    <li key={l.sku}>
                      <label htmlFor={`library-${l.sku}`} className={'flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors ' + (already ? 'cursor-default' : 'cursor-pointer hover:bg-[var(--surface-hover)]') + (on ? ' bg-primary/5' : '')}>
                        <Checkbox id={`library-${l.sku}`} checked={on} disabled={already} aria-label={`Select ${l.productName} ${l.variant}`}
                          onCheckedChange={() => setPicked((p) => p.includes(l.sku) ? p.filter((x) => x !== l.sku) : [...p, l.sku])} />
                        <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{l.sku}</span>
                        <span className="min-w-0 flex-1 truncate font-medium">{l.productName}</span>
                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs">{l.variant}</span>
                        <span className="w-24 shrink-0 text-right text-xs">{already ? <span className="text-warning-text">Already on PO</span> : <span className="tabular-nums text-muted-foreground">Stock {l.stock}</span>}</span>
                      </label>
                    </li>
                  );
                })}</ul>}
          </div>
        </>
      )}
    </FormDialog>
  );
}

/* ───────── 建 SKU 并匹配采购行 ───────── */
export function QuickSkuDialog({ line, onOpenChange, onCreate }: { line: PoLine | null; onOpenChange: (o: boolean) => void; onCreate: (sku: string) => void }) {
  const [useExisting, setUseExisting] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  useEffect(() => { if (line) { setUseExisting(line.productCode !== 'NEW'); setName(line.productName); setPrice(''); } }, [line]);
  const cost = line ? (line.confirmedPrice ?? line.estimatedPrice) : 0;
  return (
    <FormDialog open={line != null} onOpenChange={onOpenChange} className="sm:max-w-2xl" title="Add product and match the purchase line"
      description="Saving creates the SKU and fills in the purchase line."
      status={Number(price) > 0 ? undefined : 'Selling price is required'}
      confirmLabel="Create and match" confirmDisabled={!line || Number(price) <= 0} onConfirm={() => { if (line) onCreate(line.sku); }}>
      {line && (
        <>
          <FormSection title="Purchase line">
            <div className="flex items-start justify-between gap-4 rounded-xl bg-muted px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold"><span className="font-mono font-medium text-muted-foreground">{line.sku}</span> · {line.nameIt}</p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">Purchase unit PZ · Qty {line.qty > 0 ? line.qty : line.plannedQty}</p>
              </div>
              <Badge variant="outline" className="tabular-nums">Cost €{cost.toFixed(2)}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">The cost stays on the purchase record. The price below is the selling price.</p>
          </FormSection>
          <FormSection title="Product">
            {line.productCode === 'NEW' ? <p className="text-sm text-muted-foreground">No similar product in the library. A new product will be created.</p> : (
              <button type="button" aria-pressed={useExisting} onClick={() => setUseExisting((v) => !v)}
                className={'w-full rounded-xl border p-3.5 text-left transition-colors ' + (useExisting ? 'border-primary bg-primary/5' : 'border-border hover:bg-[var(--surface-hover)]')}>
                <span className="flex items-center justify-between gap-3"><span className="text-sm font-medium">{line.productName} · {line.productCode}</span><Badge variant="info">Suggested</Badge></span>
                <span className="mt-0.5 block text-xs text-muted-foreground">Same product family; this becomes a new variant.</span>
              </button>
            )}
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
              <Field id="quick-sku-name" label="Product name"><Input id="quick-sku-name" className={INPUT} value={name} disabled={useExisting && line.productCode !== 'NEW'} onChange={(e) => setName(e.target.value)} /></Field>
              <Field id="quick-sku-name-it" label="Supplier-language name"><Input id="quick-sku-name-it" className={INPUT} defaultValue={line.nameIt} /></Field>
              <Field id="quick-sku-price" label="Standard selling price (€)" required><Input id="quick-sku-price" className={INPUT + ' tabular-nums'} type="number" min="0.01" step="0.01" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
              <Field label="SKU to create"><p className="flex h-10 items-center rounded-xl bg-muted px-3 text-sm text-muted-foreground">{useExisting && line.productCode !== 'NEW' ? `Added to “${line.productName}” as ${line.variant}` : 'First SKU of a new product'}</p></Field>
            </div>
          </FormSection>
        </>
      )}
    </FormDialog>
  );
}

/* ───────── 上传单据 → 解析 → 回填（确认单 / DDT 共用） ───────── */
export type Uploaded = { fileName: string; sizeLabel: string };
const sizeOf = (b: number) => (b <= 0 ? '—' : b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

export function UploadDocDialog({ open, onOpenChange, title, description, drop, hint, steps, results, onApply }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description: string; drop: string; hint: string; steps: string[]; results?: string[]; onApply: (u: Uploaded) => void }) {
  const [file, setFile] = useState<Uploaded | null>(null);
  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const applied = useRef(false);
  const apply = useRef(onApply); apply.current = onApply;
  // 父组件重渲染会传入新的 steps 数组；只按文件计时，避免解析动画被重置
  const stepCount = useRef(steps.length); stepCount.current = steps.length;
  useEffect(() => { if (!open) { setFile(null); setIdx(0); setDragging(false); setError(null); applied.current = false; } }, [open]);
  useEffect(() => {
    if (!file) return;
    const n = stepCount.current;
    const timers = Array.from({ length: n }, (_, i) => window.setTimeout(() => setIdx(i + 1), 450 * (i + 1)));
    const done = window.setTimeout(() => { if (!applied.current) { applied.current = true; apply.current(file); } }, 450 * n + 700);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [file]);
  const start = (f: File | null) => {
    if (!f) return;
    if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') { setError(`“${f.name}” is not a PDF.`); return; }
    setError(null); setIdx(0); setFile({ fileName: f.name, sizeLabel: sizeOf(f.size) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} onOpenAutoFocus={(e) => e.preventDefault()} className="flex flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 shadow-[0_24px_64px_-16px_rgb(16_24_40/0.3),0_0_0_1px_rgb(16_24_40/0.06)] sm:max-w-lg">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5">
          <div className="min-w-0"><DialogTitle className="text-lg font-semibold tracking-[-0.01em]">{title}</DialogTitle><DialogDescription className="mt-1 text-sm text-muted-foreground">{description}</DialogDescription></div>
          <DialogClose className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close"><X className="size-4" /></DialogClose>
        </header>
        {/* 内容区高度固定：上传前（拖放区）和解析中（步骤）一样高，弹窗不会跳 */}
        <div className="flex h-[256px] flex-col px-6 py-5">
          {!file ? (
            <>
              <div role="button" tabIndex={0} onClick={() => input.current?.click()} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') input.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); start(e.dataTransfer.files?.[0] ?? null); }}
                className={'flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 text-center transition-colors ' + (dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted hover:border-primary hover:bg-primary/5')}>
                <span className="grid size-11 place-items-center rounded-full bg-card text-primary shadow-[0_1px_2px_rgb(16_24_40/0.08)]"><UploadCloud className="size-5" /></span>
                <p className="mt-1 text-sm font-medium">{drop}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
                <input ref={input} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => { start(e.target.files?.[0] ?? null); e.target.value = ''; }} />
              </div>
              {error && <p className="mt-3 flex shrink-0 items-start gap-1.5 rounded-xl bg-status-danger-subtle px-3 py-2 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{error} Upload the PDF file.</p>}
            </>
          ) : (
            /* 解析中：文件卡片带总进度，下面是撑满剩余高度的步骤时间线 */
            <div className="flex h-full flex-col">
              <div className="shrink-0 rounded-xl border border-border px-3.5 pb-3 pt-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-status-danger-subtle text-destructive"><FileText className="size-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.fileName}</p><p className="text-xs text-muted-foreground">{file.sizeLabel} · {idx >= steps.length ? 'Done, writing to the lines' : 'Reading'}</p></div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-primary-strong">{Math.round((idx / steps.length) * 100)}%</span>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-[400ms] ease-out" style={{ width: `${(idx / steps.length) * 100}%` }} /></div>
              </div>
              <ol className="relative mt-4 flex min-h-0 flex-1 flex-col justify-between" aria-label="Parsing steps">
                {/* 连接线：底色一条，已完成部分用主色盖上 */}
                <span aria-hidden className="absolute bottom-3 left-[9px] top-3 w-0.5 rounded-full bg-border" />
                <span aria-hidden className="absolute left-[9px] top-3 w-0.5 rounded-full bg-success transition-[height] duration-[400ms] ease-out" style={{ height: `calc((100% - 1.5rem) * ${Math.min(idx, steps.length - 1) / (steps.length - 1)})` }} />
                {steps.map((step, i) => {
                  const done = idx > i; const active = idx === i;
                  return (
                    <li key={step} className="relative flex items-start gap-3">
                      <span className={'relative z-[1] grid size-5 shrink-0 place-items-center rounded-full border-2 bg-card transition-colors duration-300 ' + (done ? 'border-success bg-success text-white' : active ? 'border-primary' : 'border-border')}>
                        {done ? <Check className="size-3" strokeWidth={3} /> : active ? <Loader2 className="size-3 animate-spin text-primary" /> : null}
                      </span>
                      <div className="min-w-0 -mt-px">
                        <p className={'text-sm transition-colors ' + (active ? 'font-semibold' : done ? '' : 'text-muted-foreground')}>{done ? step.replace(/…$/, '') : step}</p>
                        <p className={'text-xs text-muted-foreground transition-opacity duration-300 ' + (done && results?.[i] ? 'opacity-100' : 'opacity-0')}>{results?.[i] ?? '\u00a0'}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ───────── 处理剩余商品：一行汇总（明细在浮层里）→ 三种处理方式 → 备注 ───────── */
const REMAINING_ICON: Record<RemainingDecision, typeof Hourglass> = { wait_next_batch: Hourglass, close_remaining: PackageX, return_no_stock: Undo2 };
export function RemainingDialog({ open, onOpenChange, openQty, lines = [], initial, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; openQty: number; lines?: { name: string; qty: number }[]; initial: { decision: RemainingDecision | null; date: string; note: string }; onSave: (v: { decision: RemainingDecision; date: string; note: string }) => void }) {
  const [draft, setDraft] = useState<RemainingDecision | null>(null);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  useEffect(() => { if (open) { setDraft(initial.decision); setDate(initial.date); setNote(initial.note); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const wait = draft === 'wait_next_batch';
  const dmy = (iso: string) => iso.split('-').reverse().join('/');
  return (
    <FormDialog open={open} onOpenChange={onOpenChange} className="h-[min(40rem,85vh)] sm:max-w-4xl" title="Handle remaining goods"
      description="Decide what happens to the goods that haven’t arrived."
      status={!draft ? 'Choose what happens to the rest' : wait && date ? <>Reminder on <span className="font-semibold tabular-nums text-foreground">{dmy(date)}</span></> : <>Applies to <span className="font-semibold tabular-nums text-foreground">{openQty} pcs</span></>}
      confirmLabel="Save" confirmDisabled={!draft} onConfirm={() => { if (draft) onSave({ decision: draft, date: wait ? date : '', note: note.trim() }); }}>
      {/* 左右结构：左边还缺哪些（自己滚动），右边怎么处理；弹窗高度固定 */}
      <div className="-mx-6 -my-5 grid h-[calc(100%+2.5rem)] grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex min-h-0 flex-col border-r border-border" aria-label="Still open">
          <div className="flex shrink-0 items-baseline justify-between gap-3 px-6 pb-3 pt-5">
            <h3 className="text-sm font-semibold">Still open</h3>
            <p className="text-xs text-muted-foreground"><span className="font-semibold tabular-nums text-foreground">{openQty} pcs</span> · {lines.length} line{lines.length === 1 ? '' : 's'}</p>
          </div>
          <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto border-t border-border px-6 [scrollbar-width:thin]" aria-label="Lines still open">
            {lines.map((l) => <li key={l.name} className="flex h-11 items-center justify-between gap-3 text-sm"><span className="truncate">{l.name}</span><span className="shrink-0 font-semibold tabular-nums">{l.qty} pcs</span></li>)}
          </ul>
        </section>

        <section className="min-h-0 space-y-5 overflow-y-auto px-6 py-5 [scrollbar-width:thin]" aria-label="Decision">
          <div>
            <h3 className="mb-3 text-sm font-semibold">What happens to the rest</h3>
            <div role="radiogroup" aria-label="Remaining goods" className="space-y-2">
              {(Object.keys(REMAINING) as RemainingDecision[]).map((k) => {
                const on = draft === k; const I = REMAINING_ICON[k];
                return (
                  <div key={k} className={'rounded-xl border transition-colors ' + (on ? 'border-primary bg-primary/5' : 'border-border hover:bg-[var(--surface-hover)]')}>
                    <button type="button" role="radio" aria-checked={on} onClick={() => setDraft(k)} className="flex w-full items-center gap-3 px-3.5 py-3 text-left">
                      <span className={'grid size-9 shrink-0 place-items-center rounded-lg transition-colors ' + (on ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}><I className="size-4" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{REMAINING[k].title}</span><span className="block text-xs text-muted-foreground">{REMAINING[k].description}</span></span>
                      <span className={'grid size-4 shrink-0 place-items-center rounded-full border-2 transition-colors ' + (on ? 'border-primary' : 'border-input')}>{on && <span className="size-2 rounded-full bg-primary" />}</span>
                    </button>
                    {k === 'wait_next_batch' && (
                      /* 预计到货日期：可选，一直可填；填了就自动选中「等下一批」 */
                      <label className="flex items-center justify-between gap-3 whitespace-nowrap border-t border-dashed border-border px-3.5 py-2.5 text-xs text-muted-foreground">
                        Expected arrival (optional)
                        <Input id="remaining-follow-up-date" type="date" value={date} onChange={(e) => { setDate(e.target.value); setDraft('wait_next_batch'); }} className="h-9 w-40 rounded-lg bg-card tabular-nums text-foreground" />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Field id="remaining-decision-note" label="Notes"><Textarea id="remaining-decision-note" rows={3} className="resize-none rounded-xl" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional, e.g. what the supplier said" /></Field>
        </section>
      </div>
    </FormDialog>
  );
}
