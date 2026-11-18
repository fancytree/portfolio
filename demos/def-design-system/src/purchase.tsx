import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, Sparkles, UserCheck, MessageSquareText, ChevronRight, CircleDashed, Ellipsis, FileDown, FileText, Gift, Info as InfoIcon, PackageCheck, Plus, RotateCcw, Trash2, Upload, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogAction, DialogCancel, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CopyButton, eur } from './order-deliveries';
import { AddProductDialog, QuickSkuDialog, RemainingDialog, UploadDocDialog, type Uploaded } from './purchase-dialogs';
import { FormDialog, FormSection } from './form-dialog';
import { AgentPanel, KeyValues, Timeline, useAgentThread, type PanelTab } from './agent-panel';
import { EvidenceView } from './agent-evidence';
import { APPROVAL_CHECKS, PLAN_STEP_DETAIL, PLAN_STEPS, SUPPLIER_RULES, rationale } from './agent-data';
import {
  BASE_LINES, CONFIRMATION_FILE, DDT_FILE, DDT_ONLY, INVOICE_FILE, OPERATOR, PO_META, PO_NO, REMAINING, SALES_WINDOWS, SKU_CREATED_NOTE, SUPPLIER,
  applyConfirmation, applyDdt, groupBySpu, hasGap, isGift, notesOf, priceDiffers, qtyDiffers, recStatus, salesFor, seedReceiving, subtotalOf, toReceiving,
  type ExtraDecision, type PoLine, type RecLine, type RemainingDecision, type SalesWindow,
} from './purchase-data';

/**
 * 采购单详情。功能对齐原 ERP 作品集页 po-detail（草稿 → 上传确认单 → 下单）与 po-inbound（上传 DDT → 逐行处理 → 确认收货 → 处理剩余），
 * 合成一张单的两个阶段；布局沿用销售订单详情（左：单头 + 明细，右：信息栏）。
 * URL：?view=po（草稿）· ?view=po&stage=inbound（待收货）· &state=ddt（DDT 已上传）· &state=received（本批已确认）
 */

const params = new URLSearchParams(location.search);
const URL_STAGE: 'draft' | 'inbound' = params.get('stage') === 'inbound' ? 'inbound' : 'draft';
const URL_STATE = params.get('state');
const stamp = () => { const n = new Date(); return `17 Nov, ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; };
/** 日期输入给的是 2026-09-04，页面统一显示 04/09/2026 */
const dmy = (iso: string) => iso.split('-').reverse().join('/');
const CTRL = 'h-9 rounded-xl border border-input bg-card shadow-none';

/* 行底色：固定列要跟着一起换，所以写在 td 上 */
const ROW = {
  /* 商品（父）行用白底，跟灰色表头分开；展开后的 SKU（子）行用很浅的灰，表示归属 */
  plain: '[&>td]:bg-[color-mix(in_srgb,var(--surface-sunken)_40%,var(--surface-raised))]',
  group: '[&>td]:bg-card hover:[&>td]:bg-[var(--surface-hover)]',
  warn: '[&>td]:bg-[color-mix(in_srgb,var(--warning)_7%,var(--surface-raised))]',
  danger: '[&>td]:bg-[color-mix(in_srgb,var(--destructive)_6%,var(--surface-raised))]',
};
const NUM_IN = 'ml-auto h-8 rounded-lg px-2 text-right text-sm tabular-nums shadow-none';
const WARN_IN = ' border-[color-mix(in_srgb,var(--warning)_55%,var(--input))] bg-[color-mix(in_srgb,var(--warning)_6%,var(--surface-raised))]';
const DANGER_IN = ' border-[color-mix(in_srgb,var(--destructive)_40%,var(--input))]';

function Confirm({ open, onClose, title, body, action, onConfirm, destructive = false }: { open: boolean; onClose: () => void; title: string; body: React.ReactNode; action: string; onConfirm: () => void; destructive?: boolean }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{body}</DialogDescription></DialogHeader>
        <DialogFooter><DialogCancel size="lg" className="min-w-28">Cancel</DialogCancel><DialogAction size="lg" className="min-w-28" variant={destructive ? 'destructive' : 'default'} onClick={onConfirm}>{action}</DialogAction></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={'min-w-0 ' + (wide ? 'col-span-2' : '')}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm">{children}</dd></div>;
}

function Steps({ state }: { state: 'draft' | 'ordered' | 'partial' | 'cancelled' }) {
  const steps: [string, 'done' | 'current' | 'todo'][] = state === 'cancelled' ? [['Edit', 'done'], ['Cancelled', 'current'], ['Received', 'todo']]
    : [['Edit', state === 'draft' ? 'current' : 'done'], ['Ordered', state === 'draft' ? 'todo' : 'done'], ['Received', state === 'partial' ? 'current' : 'todo']];
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Purchase order progress">
      {steps.map(([label, s], i) => (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span className="h-px w-5 bg-border" aria-hidden />}
          <span className={'inline-flex items-center gap-1.5 ' + (s === 'todo' ? 'text-muted-foreground' : 'font-medium text-primary-strong')}>
            {s === 'done' ? <Check className="size-4" /> : s === 'current'
              ? <span className="size-3.5 rounded-full border-2 border-primary" style={{ background: 'linear-gradient(90deg, var(--primary) 50%, transparent 50%)' }} aria-hidden />
              : <CircleDashed className="size-4" />}
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** 横向滚动时左 / 右固定列出现竖线和投影 */
function useEdges() {
  const [edge, setEdge] = useState({ left: false, right: true });
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const next = { left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 };
    if (next.left !== edge.left || next.right !== edge.right) setEdge(next);
  };
  const left = 'sticky left-0 z-[1] after:pointer-events-none after:absolute after:inset-y-0 after:-right-px after:w-px after:bg-border after:transition-opacity ' + (edge.left ? 'after:opacity-100 shadow-[6px_0_10px_-8px_rgb(16_24_40/0.25)]' : 'after:opacity-0');
  const right = 'sticky right-0 z-[1] before:pointer-events-none before:absolute before:inset-y-0 before:-left-px before:w-px before:bg-border before:transition-opacity ' + (edge.right ? 'before:opacity-100 shadow-[-6px_0_10px_-8px_rgb(16_24_40/0.25)]' : 'before:opacity-0');
  return { onScroll, left, right };
}

function useExpand(keys: string[]) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const all = keys.length > 0 && keys.every((k) => open.has(k));
  return {
    open, all,
    toggle: (k: string) => setOpen((p) => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; }),
    toggleAll: () => setOpen(all ? new Set() : new Set(keys)),
    add: (ks: string[]) => setOpen((p) => new Set([...p, ...ks])),
  };
}

function GroupLabel({ open, label, count, onToggle }: { open: boolean; label: string; count: number; onToggle: () => void }) {
  return (
    <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full min-w-0 items-center gap-1.5 text-left">
      <ChevronRight className={'size-4 shrink-0 text-muted-foreground transition-transform duration-200 ' + (open ? 'rotate-90' : '')} />
      <span className="truncate font-medium">{label}</span>
      <span className="shrink-0 rounded-md bg-muted px-1.5 text-[11px] font-medium tabular-nums text-muted-foreground" title={`${count} SKU${count > 1 ? 's' : ''}`}>{count}</span>
    </button>
  );
}

function SkuCell({ sku, variant, nameIt }: { sku: string; variant: string; nameIt: string }) {
  return (
    <div className="min-w-0 pl-5.5">
      <p className="truncate text-sm"><span className="font-mono text-xs text-muted-foreground">{sku}</span><span className="mx-1.5 text-border">·</span><span className="font-medium">{variant}</span></p>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{nameIt}</p>
    </div>
  );
}

/* ───────── 草稿明细表 ───────── */
/** 列宽合计 = 收起侧栏时 1440 宽下的可用宽度，Notes 不用横向滚动就能看到 */
const DRAFT_COLS = [200, 76, 80, 56, 72, 90, 92, 92, 168, 50];
function DraftTable({ lines, salesWindow, confirmed, expand, onUpdate, onDeleteSku, onDeleteSpu, onCreateSku, onWhy, planning }: {
  lines: PoLine[]; salesWindow: SalesWindow; confirmed: boolean; expand: ReturnType<typeof useExpand>;
  /** Agent 版：未确认前 Notes 列显示每行的计划依据，点 Why 在 Agent 面板里展开算式 */
  onWhy?: (l: PoLine) => void; planning?: boolean;
  onUpdate: (sku: string, patch: Partial<PoLine>) => void; onDeleteSku: (l: PoLine) => void; onDeleteSpu: (key: string, label: string) => void; onCreateSku: (l: PoLine) => void;
}) {
  const groups = useMemo(() => groupBySpu(lines), [lines]);
  const { onScroll, left, right } = useEdges();
  const salesHead = `Sales · ${SALES_WINDOWS.find((o) => o.value === salesWindow)?.short}`;
  const gap = (l: PoLine) => confirmed && hasGap(l);
  return (
    <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]" onScroll={onScroll}>
      <table className="min-w-full table-fixed text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap" style={{ width: DRAFT_COLS.reduce((a, b) => a + b, 0) }}>
        <colgroup>{DRAFT_COLS.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
        <thead className="sticky top-0 z-[2]">
          <tr className="text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-2.5 [&>th]:py-2.5 [&>th]:text-right">
            <th className={left + ' z-[3] !pl-6 !text-left'}>Product / SKU</th>
            <th>Est. qty</th><th>Conf. qty</th><th>Stock</th><th>{salesHead}</th><th>Est. price</th><th>Conf. price</th><th>Subtotal</th>
            <th className="!text-left">Notes</th>
            <th className={right + ' z-[3] !pr-6 !text-center'}><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="[&>tr>td]:border-b [&>tr>td]:border-border">
          {groups.map((g) => {
            const open = expand.open.has(g.key);
            const missing = confirmed && g.items.some((l) => l.risk === 'missing');
            const allMissing = confirmed && g.items.every((l) => l.risk === 'missing');
            const anyGap = confirmed && g.items.some(hasGap);
            const gift = confirmed && g.items.every(isGift);
            const agg = g.items.reduce((a, l) => ({ planned: a.planned + l.plannedQty, qty: a.qty + l.qty, filled: a.filled || l.qty > 0, stock: a.stock + l.stock, sales: a.sales + salesFor(l.sales30, salesWindow), sub: a.sub + (l.risk === 'missing' ? 0 : subtotalOf(l)) }), { planned: 0, qty: 0, filled: false, stock: 0, sales: 0, sub: 0 });
            return (
              <Fragment key={g.key}>
                <tr className={'group cursor-pointer [&>td]:px-2.5 [&>td]:py-2.5 [&>td]:text-right [&>td]:tabular-nums [&>td]:transition-colors ' + (missing ? ROW.danger : anyGap ? ROW.warn : ROW.group)} onClick={() => expand.toggle(g.key)}>
                  <td className={left + ' !pl-6 !text-left'} onClick={(e) => e.stopPropagation()}><GroupLabel open={open} label={g.label} count={g.items.length} onToggle={() => expand.toggle(g.key)} /></td>
                  <td className="font-semibold">{agg.planned}</td>
                  <td className="font-semibold">{agg.filled ? agg.qty : null}</td>
                  <td className="text-muted-foreground">{agg.stock}</td>
                  <td className="text-muted-foreground">{agg.sales}</td>
                  <td /><td />
                  <td className="font-semibold">{eur(agg.sub)}</td>
                  <td className="!text-left text-xs">
                    {missing ? <span className="font-semibold text-destructive">{allMissing ? 'Out of stock · whole product' : 'Missing on confirmation'}</span>
                      : gift ? <span className="font-medium text-success-text">Gift (omaggio)</span>
                        : anyGap ? <span className="font-medium text-warning-text">Gaps in SKUs</span> : null}
                  </td>
                  <td className={right + ' !pr-6 !text-center'} onClick={(e) => e.stopPropagation()}>
                    <button type="button" aria-label={`Delete all SKUs in ${g.label}`} onClick={() => onDeleteSpu(g.key, g.label)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-status-danger-subtle hover:text-destructive"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
                {open && g.items.map((l) => {
                  const isMissing = confirmed && l.risk === 'missing';
                  const giftLine = confirmed && isGift(l);
                  const extra = confirmed && l.risk === 'extra';
                  const notes = notesOf(l, confirmed);
                  const tone = isMissing ? ROW.danger : gap(l) ? ROW.warn : ROW.plain;
                  return (
                    <tr key={l.sku} className={'[&>td]:px-2.5 [&>td]:py-2.5 [&>td]:text-right [&>td]:align-top [&>td]:tabular-nums ' + tone}>
                      <td className={left + ' !pl-6 !text-left'}><SkuCell sku={l.sku} variant={l.variant} nameIt={l.nameIt} /></td>
                      <td>{extra ? null
                        : <Input type="number" min={0} aria-label={`Est. qty ${l.sku}`} value={l.plannedQty} className={NUM_IN + ' w-16' + (qtyDiffers(l) ? WARN_IN : '')} onChange={(e) => onUpdate(l.sku, { plannedQty: Number(e.target.value) || 0 })} />}</td>
                      <td><Input type="number" min={0} aria-label={`Conf. qty ${l.sku}`} value={l.qty > 0 ? l.qty : ''} className={NUM_IN + ' w-16' + (qtyDiffers(l) ? WARN_IN : isMissing ? DANGER_IN : '')}
                        onChange={(e) => onUpdate(l.sku, { qty: e.target.value.trim() === '' ? 0 : Number(e.target.value) || 0 })} /></td>
                      <td className="text-muted-foreground"><span className="inline-block pt-1.5">{l.stock}</span></td>
                      <td className="text-muted-foreground"><span className="inline-block pt-1.5">{salesFor(l.sales30, salesWindow)}</span></td>
                      <td>{extra ? null
                        : <Input type="number" min={0} step="0.01" aria-label={`Est. price ${l.sku}`} value={l.estimatedPrice} className={NUM_IN + ' w-[4.75rem]' + (priceDiffers(l) ? ' text-muted-foreground' : '')} onChange={(e) => onUpdate(l.sku, { estimatedPrice: Number(e.target.value) || 0 })} />}</td>
                      <td><Input type="number" min={0} step="0.01" aria-label={`Conf. price ${l.sku}`} value={l.confirmedPrice ?? ''} className={NUM_IN + ' w-[4.75rem]' + (priceDiffers(l) ? WARN_IN + ' font-semibold text-warning-text' : isMissing ? DANGER_IN : '')}
                        onChange={(e) => onUpdate(l.sku, { confirmedPrice: e.target.value.trim() === '' ? null : Number(e.target.value) })} /></td>
                      <td className="font-semibold"><span className="inline-block pt-1.5">{isMissing ? null : giftLine ? <span className="text-success-text">Gift</span> : eur(subtotalOf(l))}</span></td>
                      <td className="!whitespace-normal !text-left">
                        <div className={'flex items-start gap-1.5 pt-1 text-xs leading-snug ' + ({ muted: 'text-muted-foreground', warn: 'text-warning-text', danger: 'font-semibold text-destructive', ok: 'text-success-text' } as const)[notes.tone]}>
                          {notes.tone !== 'muted' && (giftLine ? <Gift className="mt-px size-3.5 shrink-0" /> : notes.tone === 'ok' ? <Check className="mt-px size-3.5 shrink-0" /> : <AlertTriangle className="mt-px size-3.5 shrink-0" />)}
                          <span className="min-w-0">
                            {onWhy && !confirmed && notes.tone === 'muted' && <span className="block text-muted-foreground"><span className="block truncate tabular-nums">{l.sales30} sold · {l.stock} stock</span><button type="button" onClick={() => onWhy(l)} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"><Sparkles className="size-3" />Why {l.plannedQty}</button></span>}
                            {notes.lines.map((n) => <span key={n} className="block">{n}</span>)}
                            {notes.needsSku && <button type="button" onClick={() => onCreateSku(l)} className="mt-1 font-semibold text-primary hover:underline">Create SKU</button>}
                          </span>
                        </div>
                      </td>
                      <td className={right + ' !pr-6 !text-center'}>
                        <button type="button" aria-label={`Delete SKU ${l.sku}`} onClick={() => onDeleteSku(l)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-status-danger-subtle hover:text-destructive"><Trash2 className="size-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
          {planning && Array.from({ length: 9 }, (_, i) => (
            <tr key={'sk' + i} className="[&>td]:px-2.5 [&>td]:py-3.5">
              <td className={left + ' !pl-6'}><span className="block h-3.5 animate-pulse rounded bg-muted" style={{ width: `${55 + ((i * 37) % 35)}%`, animationDelay: `${i * 80}ms` }} /></td>
              {Array.from({ length: 8 }, (_, j) => <td key={j}><span className="ml-auto block h-3.5 w-9 animate-pulse rounded bg-muted" style={{ animationDelay: `${(i + j) * 60}ms` }} /></td>)}
              <td className={right} />
            </tr>
          ))}
          {!planning && lines.length === 0 && <tr><td colSpan={10} className="!border-0 px-6 py-14 text-center text-muted-foreground">No products on this order. Use Add product to start.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/* ───────── 收货明细表 ───────── */
const TONE_TEXT = { ok: 'text-success-text', warn: 'text-warning-text', info: 'text-primary-strong', hold: 'text-destructive' } as const;

function ReceivingTable({ lines, confirmed, ddtUploaded, decision, extras, expand, onCount, onExtra }: {
  lines: RecLine[]; confirmed: boolean; ddtUploaded: boolean; decision: RemainingDecision | null; extras: Record<string, ExtraDecision>; expand: ReturnType<typeof useExpand>;
  onCount: (sku: string, n: number) => void; onExtra: (sku: string, d: ExtraDecision) => void;
}) {
  const groups = useMemo(() => groupBySpu(lines), [lines]);
  const { onScroll, left } = useEdges();
  return (
    <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]" onScroll={onScroll}>
      <table className="w-full min-w-[56rem] table-fixed text-sm [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
        <colgroup><col /><col style={{ width: 96 }} /><col style={{ width: 92 }} /><col style={{ width: 76 }} /><col style={{ width: 96 }} /><col style={{ width: 60 }} /><col style={{ width: 272 }} /></colgroup>
        <thead className="sticky top-0 z-[2]">
          <tr className="text-xs font-medium text-muted-foreground [&>th]:bg-muted [&>th]:px-3 [&>th]:py-2.5 [&>th]:text-right">
            <th className={left + ' z-[3] !pl-6 !text-left'}>Product / SKU</th>
            <th>Confirmed</th><th>Received</th><th>DDT</th><th>Actual</th><th className="!text-left">Unit</th><th className="!pr-6 !text-left">Status</th>
          </tr>
        </thead>
        <tbody className="[&>tr>td]:border-b [&>tr>td]:border-border">
          {groups.map((g) => {
            const open = expand.open.has(g.key);
            // 确认收货后，本批实点计入 Received
            const agg = g.items.reduce((a, l) => ({ o: a.o + l.ordered, s: a.s + l.stocked + (confirmed ? l.counted : 0), d: a.d + l.ddt, c: a.c + l.counted }), { o: 0, s: 0, d: 0, c: 0 });
            const warn = g.items.some((l) => recStatus(l, ddtUploaded, decision, extras[l.sku] ?? null).tone === 'warn');
            return (
              <Fragment key={g.key}>
                <tr className={'cursor-pointer [&>td]:px-3 [&>td]:py-2.5 [&>td]:text-right [&>td]:font-semibold [&>td]:tabular-nums [&>td]:transition-colors ' + (warn ? ROW.warn : ROW.group)} onClick={() => expand.toggle(g.key)}>
                  <td className={left + ' !pl-6 !text-left !font-normal'} onClick={(e) => e.stopPropagation()}><GroupLabel open={open} label={g.label} count={g.items.length} onToggle={() => expand.toggle(g.key)} /></td>
                  <td>{agg.o}</td><td>{agg.s}</td><td>{agg.d || null}</td><td>{agg.c || null}</td>
                  <td /><td className="!pr-6 !text-left !font-medium text-xs">{warn ? <span className="text-warning-text">Check SKUs</span> : null}</td>
                </tr>
                {open && g.items.map((l) => {
                  const extra = extras[l.sku] ?? null;
                  const st = recStatus(l, ddtUploaded, decision, extra);
                  const needs = ddtUploaded && l.ordered === 0;
                  return (
                    <tr key={l.sku} className={'[&>td]:px-3 [&>td]:py-2.5 [&>td]:text-right [&>td]:align-top [&>td]:tabular-nums ' + (st.tone === 'warn' ? ROW.warn : ROW.plain)}>
                      <td className={left + ' !pl-6 !text-left'}><SkuCell sku={l.sku} variant={l.variant} nameIt={l.nameIt} /></td>
                      <td><span className="inline-block pt-1.5">{l.ordered}</span></td>
                      <td className={confirmed ? "font-medium" : "text-muted-foreground"}><span className="inline-block pt-1.5">{l.stocked + (confirmed ? l.counted : 0)}</span></td>
                      <td className="text-muted-foreground"><span className="inline-block pt-1.5">{l.ddt || null}</span></td>
                      <td><Input type="number" min={0} aria-label={`Actual ${l.sku}`} value={l.counted} disabled={confirmed} className={NUM_IN + ' w-[4.25rem]' + (ddtUploaded && l.counted !== l.ddt ? WARN_IN : '')} onChange={(e) => onCount(l.sku, Number(e.target.value) || 0)} /></td>
                      <td className="!text-left text-muted-foreground"><span className="inline-block pt-1.5">{l.unit}</span></td>
                      <td className="!pr-6 !text-left">
                        <p className={'pt-1.5 text-xs font-medium ' + TONE_TEXT[st.tone]}>{st.label}</p>
                        {needs && (
                          <div className="mt-2 inline-flex rounded-lg border border-input bg-card p-0.5" role="group" aria-label={`What to do with ${l.sku}`}>
                            {([['return', 'Return', RotateCcw], ['gift', 'Gift', Gift], ['receive', 'Stock in', PackageCheck]] as const).map(([v, label, Icon]) => (
                              <button key={v} type="button" aria-pressed={extra === v} disabled={confirmed} onClick={() => onExtra(l.sku, v)}
                                className={'inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition-colors disabled:opacity-60 ' + (extra === v ? 'bg-primary/10 text-primary-strong' : 'text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground')}>
                                <Icon className="size-3.5" />{label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DocSlot({ label, file, meta, done, action }: { label: string; file: string | null; meta?: string; done?: boolean; action?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted px-3.5 py-3">
      <span className={'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ' + (file ? 'bg-card text-destructive' : 'bg-card text-muted-foreground')}><FileText className="size-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">{label}{done && <Check className="size-3.5 text-success-text" />}</p>
        <p className={'mt-0.5 truncate text-sm ' + (file ? 'font-medium' : 'text-muted-foreground')}>{file ?? 'Not uploaded'}</p>
        {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
        {action && <div className="mt-1.5">{action}</div>}
      </div>
    </div>
  );
}
const linkBtn = 'text-xs font-semibold text-primary hover:underline';

/** 从采购工作台打开时：按列表里的状态决定进入哪个阶段；直接用 URL 打开时读 ?stage / ?state */
export type PoOpen = { no: string; supplier: string; stage: 'draft' | 'inbound'; state?: string | null; cancelled?: boolean };
/** Agent 版：generate = 新建计划（覆盖天数），approval = 打开时的审批状态 */
export type AgentOpen = { generate?: number; approval?: 'owner' | 'approved' | null; confirmed?: boolean };

export default function PurchaseOrder({ onBack, po, agent }: { onBack?: () => void; po?: PoOpen; agent?: AgentOpen }) {
  const PO = po?.no ?? PO_NO;
  const SUPPLIER_NAME = po?.supplier ?? SUPPLIER.name;
  const START_STAGE = po?.stage ?? URL_STAGE;
  const START_STATE = po ? po.state ?? null : URL_STATE;
  const [stage, setStage] = useState<'draft' | 'inbound'>(START_STAGE);
  const [cancelled, setCancelled] = useState(!!po?.cancelled);
  const [cancelAsk, setCancelAsk] = useState(false);

  /* 草稿 */
  const [lines, setLines] = useState<PoLine[]>(() => (agent?.confirmed ? applyConfirmation(BASE_LINES) : BASE_LINES.map((l) => ({ ...l }))));
  const [salesWindow, setSalesWindow] = useState<SalesWindow>('3m');
  const [discount, setDiscount] = useState(PO_META.discountPct);
  const [shippingFee, setShippingFee] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [createFor, setCreateFor] = useState<PoLine | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<(Uploaded & { at: string }) | null>(agent?.confirmed ? { fileName: CONFIRMATION_FILE, sizeLabel: '228 KB', at: '16 Nov, 16:40' } : null);
  const [toDelete, setToDelete] = useState<{ title: string; run: () => void } | null>(null);
  const confirmed = confirmation != null;
  const groupKeys = useMemo(() => groupBySpu(lines).map((g) => g.key), [lines]);
  const draftExpand = useExpand(groupKeys);

  /* 收货 */
  const closed = START_STATE === 'closed';
  const withDdt = START_STATE === 'ddt' || START_STATE === 'received' || closed;
  const [rec, setRec] = useState<RecLine[]>(() => {
    const seeded = seedReceiving();
    if (START_STATE === 'closed') return seeded.map((l) => ({ ...l, ddt: l.ordered, counted: l.ordered }));
    if (!withDdt) return seeded;
    const d = applyDdt(seeded);
    return START_STATE === 'received' ? d.map((l) => (l.sku === DDT_ONLY.sku ? { ...l, counted: 0 } : l)) : d;
  });
  const [ddt, setDdt] = useState<(Uploaded & { at: string }) | null>(withDdt ? { fileName: DDT_FILE, sizeLabel: '1 KB', at: '14 Nov, 14:20' } : null);
  const [received, setReceived] = useState(START_STATE === 'received' || closed);
  // 确认收货要记录收货人：从中间状态打开时沿用演示数据里的经办人
  const [receiver, setReceiver] = useState(START_STATE === 'received' || closed ? OPERATOR.split(' · ')[0] : '');
  const [receiveAsk, setReceiveAsk] = useState(false);
  const [receiverDraft, setReceiverDraft] = useState('');
  const [extras, setExtras] = useState<Record<string, ExtraDecision>>(START_STATE === 'received' ? { [DDT_ONLY.sku]: 'gift' } : {});
  const [invoice, setInvoice] = useState(false);
  const [ddtOpen, setDdtOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [remainingOpen, setRemainingOpen] = useState(false);
  const [remaining, setRemaining] = useState<{ decision: RemainingDecision | null; date: string; note: string }>({ decision: null, date: '', note: '' });
  const recKeys = useMemo(() => groupBySpu(rec).map((g) => g.key), [rec]);
  const recExpand = useExpand(recKeys);
  const ddtUploaded = ddt != null;

  // 上传 DDT 后自动展开有问题的商品（从中间状态打开时也一样）
  useEffect(() => {
    if (!ddtUploaded) return;
    recExpand.add(rec.filter((l) => recStatus(l, true, null, null).tone !== 'ok').map((l) => l.productId));
  }, [ddtUploaded]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 草稿合计 */
  const estGoods = lines.reduce((s, l) => s + l.plannedQty * l.estimatedPrice, 0);
  const confGoods = lines.reduce((s, l) => s + l.qty * (l.confirmedPrice ?? l.estimatedPrice), 0);
  const goods = confirmed ? confGoods : estGoods;
  const pcs = lines.reduce((s, l) => s + (confirmed ? l.qty : l.plannedQty), 0);
  const freeShip = goods >= SUPPLIER.freeShippingThreshold;
  const minOk = goods >= SUPPLIER.minOrderValue;
  const shipping = freeShip ? 0 : SUPPLIER.defaultShippingFee;
  const delta = confGoods - estGoods;

  /* 收货合计 */
  const thisBatch = rec.reduce((s, l) => s + l.counted, 0);
  const orderedTotal = rec.reduce((s, l) => s + l.ordered, 0);
  const stockedTotal = rec.reduce((s, l) => s + l.stocked, 0);
  const receivedPcs = stockedTotal + (received ? thisBatch : 0);
  const openQty = Math.max(0, orderedTotal - receivedPcs);
  const pct = orderedTotal ? Math.round((receivedPcs / orderedTotal) * 100) : 0;
  const pendingExtras = ddtUploaded && rec.some((l) => l.ordered === 0 && !extras[l.sku]);
  const canConfirm = !received && thisBatch > 0 && !pendingExtras;

  const markOrdered = () => {
    setRec(toReceiving(lines));
    setStage('inbound');
    if (isAgent) { setOrdered(true); log('Marked as ordered'); thread.post({ role: 'agent', text: 'Order recorded. When the goods arrive, upload the DDT and I will compare it with the confirmation.' }); }
  };

  /* ───────── Agent 版 ───────── */
  const isAgent = !!agent;
  const coverage = agent?.generate ?? 30;
  const [planning, setPlanning] = useState(!!agent?.generate);
  const [approval, setApproval] = useState<'owner' | 'approved' | null>(agent?.approval ?? null);
  const [approveAsk, setApproveAsk] = useState(false);
  const [approvePath, setApprovePath] = useState<'direct' | 'owner'>('direct');
  const [ordered, setOrdered] = useState(START_STAGE === 'inbound');
  const [reviewed, setReviewed] = useState<'idle' | 'running' | 'done'>('idle');
  const [panelTab, setPanelTab] = useState<PanelTab>('agent');
  const [activity, setActivity] = useState<{ at: string; title: string; who: string; detail?: string }[]>(() => [
    ...(START_STAGE === 'inbound' ? [{ at: '12 Oct, 09:30', title: 'Marked as ordered', who: 'Giulia Rossi', detail: 'Bank transfer' }, { at: '11 Oct, 17:05', title: 'Approved', who: 'Giulia Rossi' }] : []),
    ...(agent?.confirmed || START_STAGE === 'inbound' ? [{ at: '16 Nov, 16:40', title: 'Confirmation compared', who: 'Agent', detail: '6 differences' }] : []),
    ...(agent?.generate ? [] : [{ at: '17 Nov, 08:05', title: 'Plan prepared', who: 'Agent', detail: '13 SKUs · 30-day coverage' }, { at: '17 Nov, 08:00', title: 'Replenishment check', who: 'Agent', detail: 'MNP below lead time' }]),
  ]);
  const log = (title: string, who = 'You', detail?: string) => setActivity((p) => [{ at: stamp(), title, who, detail }, ...p]);
  const thread = useAgentThread(!isAgent || agent?.generate ? [] : START_STAGE === 'inbound'
    ? closed ? [{ role: 'agent', text: 'All 540 pcs are in stock and receiving is closed. Review this order to compare the plan with what happened before the next MNP purchase.' }]
      : [{ role: 'agent', text: 'The order is recorded. Upload the delivery note when the truck arrives, or enter what you counted in Actual.' }]
    : agent?.confirmed ? [] : [{ role: 'agent', text: `Your purchase plan is ready: 13 SKUs covering ${coverage} days of sales after arrival. Edit any quantity, then export the request for the supplier.` }]);

  const planCard = (days: number) => ({
    title: 'Purchase plan ready', tone: 'ok' as const, badges: ['Min order met', 'Free shipping'],
    summary: `${days}-day coverage after a ${SUPPLIER_RULES.leadDays}-day lead time.`,
    sections: [{ title: 'Plan', rows: [{ label: 'Lines', detail: '5 products · 13 SKUs' }, { label: 'Quantity', detail: `${BASE_LINES.reduce((s, l) => s + l.plannedQty, 0)} pcs` }, { label: 'Goods', detail: eur(BASE_LINES.reduce((s, l) => s + l.plannedQty * l.estimatedPrice, 0)) }] },
      { title: 'Watch', rows: [{ label: '400213', detail: 'Slow mover vs lead time' }, { label: '370102', detail: '8 days of stock left' }] }],
    next: 'Edit quantities in the table, then Export request.',
  });
  const confirmationCard = () => ({
    title: 'Confirmation needs review', tone: 'warn' as const, source: CONFIRMATION_FILE, badges: ['2 missing', '1 qty change', '1 price change', '2 added'],
    sections: [
      { title: 'Missing items', rows: [{ label: '400213', detail: 'Functional treatment 50 ml' }, { label: '400214', detail: 'Functional treatment 100 ml' }] },
      { title: 'Quantity changes', rows: [{ label: '370102', before: '96', after: '90' }] },
      { title: 'Price changes', rows: [{ label: '420106', before: '€7.10', after: '€7.90' }] },
      { title: 'Added by supplier', rows: [{ label: '880104', detail: 'Ivory Nude · 24 pcs' }, { label: 'NEW-024', detail: 'Promo kit · gift' }] },
      { title: `Approval checks (${APPROVAL_CHECKS.filter((c) => c.fired).length})`, collapsed: true, rows: APPROVAL_CHECKS.filter((c) => c.fired).map((c) => ({ label: c.label, detail: c.evidence })) },
    ],
    next: 'Check the marked lines, then Approve on the order.',
  });

  // 新建计划：步骤逐个点亮，表格先显示骨架
  const booted = React.useRef(false);
  useEffect(() => {
    if (!agent?.generate || booted.current) return;
    booted.current = true;
    thread.post({ role: 'user', text: `Plan MNP for the next ${coverage} days` });
    (async () => {
      await thread.run('Preparing your purchase plan', PLAN_STEPS.map((label, i) => ({ label, detail: PLAN_STEP_DETAIL[i] })), 800);
      setPlanning(false);
      draftExpand.add(['p-bn-370', 'p-bn-431']);
      log('Plan prepared', 'Agent', `13 SKUs · ${coverage}-day coverage`);
      thread.post({ role: 'agent', text: 'Here is the draft. Each line shows the sales and stock it is based on.', card: planCard(coverage) });
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // 打开时确认单已上传：直接给出比对结果
  useEffect(() => { if (agent?.confirmed && !ordered && !booted.current) { booted.current = true; thread.post({ role: 'agent', text: 'I compared the supplier confirmation with your plan. The differences are marked on the lines.', card: confirmationCard() }); } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const why = (l: PoLine) => {
    setPanelTab('agent');
    thread.post({ role: 'user', text: `Why ${l.plannedQty} for ${l.sku}?` });
    const r = rationale(l, coverage);
    thread.reply({ text: `${l.productName} ${l.variant} sells about ${r.daily.toFixed(1)} a day. The order has to last the ${SUPPLIER_RULES.leadDays}-day lead time plus ${coverage} days of coverage, minus what is in stock.`,
      card: { title: `${l.sku} · ${l.variant}`, sections: [{ title: 'Calculation', rows: [{ label: 'Sold, 30 days', detail: `${l.sales30} pcs` }, { label: 'In stock', detail: `${l.stock} pcs` }, { label: 'Needed', detail: `${r.need} pcs` }, { label: 'With safety stock, packs of 12', after: String(l.plannedQty) }] }] },
      note: 'You can change the quantity in the table. I will not place the order.' }, 'Explaining the recommendation…');
  };

  const onAgentSend = (t: string) => {
    if (/rule|term|shipping|lead/i.test(t)) { thread.reply({ text: `MNP terms (rules ${SUPPLIER_RULES.version}): minimum order €1,500, free shipping from €2,000, 14-day typical lead time, 2% early-payment discount within 10 days.`, actions: [{ label: 'Open supply rules', onClick: () => setPanelTab('rules') }] }, 'Checking supplier rules…'); return; }
    if (/approve|owner/i.test(t)) { thread.reply({ text: confirmed ? 'Approve lets you choose: approve directly as the buyer, or push to the owner. Neither places the order; Mark as ordered stays a separate step.' : 'Approval is tied to a supplier confirmation. Upload the confirmation first.' }, 'Checking the approval gate…'); return; }
    if (/ddt|deliver|arriv|count/i.test(t)) { thread.reply({ text: stage === 'draft' ? 'Receiving opens after the order is marked as ordered.' : ddtUploaded ? 'Actual starts from the DDT. Change Actual where the warehouse counted something different; stock-in always uses Actual.' : 'Upload the DDT and I will fill in Actual and compare it with the confirmation.' }, 'Checking receiving…'); return; }
    if (/^why\b|why /i.test(t)) { const l = lines.find((x) => t.includes(x.sku)) ?? lines[0]; if (l) why(l); return; }
    thread.reply({ text: 'I stay with this purchase order. Ask about quantities, supplier terms, the confirmation, approval or receiving.' }, 'Thinking…', 700);
  };

  const suggestions = !isAgent ? [] : stage === 'draft'
    ? (planning ? [] : confirmed ? ['What needs my attention?', 'Who approves this?', 'Show supplier terms'] : ['Why 96 for 370102?', 'Show supplier terms', 'Is the minimum order met?'])
    : closed ? ['How accurate was the forecast?', 'Was delivery on time?'] : ['How do I record a short delivery?', 'What happens to extra lines?'];

  const startReview = async () => {
    setReviewed('running'); setPanelTab('agent');
    thread.post({ role: 'user', text: 'Review this order' });
    await thread.run('Comparing plan with outcome', [{ label: 'Planned vs received', detail: '558 planned · 540 received' }, { label: 'Sales after arrival', detail: '21 days of sales' }, { label: 'Delivery timing', detail: 'ETA 21/08 · arrived 24/08' }], 650);
    thread.post({ role: 'agent', text: 'Two things I would change next time. Nothing is saved until you choose.',
      card: { title: 'Order review', tone: 'info', sections: [
        { title: 'Quantity', rows: [{ label: 'Reinforced bonder', detail: 'sold out 6 days early', after: '+12%' }, { label: 'Functional treatment', detail: 'not supplied · reorder', after: 'skip' }, { label: 'Top coat', detail: 'on plan' }] },
        { title: 'Timing', rows: [{ label: 'MNP lead time', before: '14 d', after: '17 d' }] },
      ], next: 'Keep as a learning candidate for the next MNP plan.' },
      actions: [{ label: 'Save as candidate', primary: true, onClick: () => { setReviewed('done'); log('Learning candidate saved', 'You', 'MNP lead time 17 d'); thread.post({ role: 'agent', text: 'Saved as a candidate for MNP. It becomes a supplier rule only after someone publishes it in Supply rules.' }); } },
        { label: 'Dismiss', onClick: () => { setReviewed('done'); thread.post({ role: 'agent', text: 'Dismissed. Nothing was written to supplier memory.' }); } }] });
  };


  const status = isAgent && !cancelled && stage === 'draft' ? (planning ? { label: 'Planning', v: 'info' as const } : approval === 'approved' ? { label: 'Approved', v: 'info' as const } : approval === 'owner' ? { label: 'Waiting for owner', v: 'warning' as const } : confirmed ? { label: 'Needs review', v: 'warning' as const } : { label: 'Draft', v: 'secondary' as const })
    : closed ? { label: 'Received', v: 'success' as const }
    : cancelled ? { label: 'Cancelled', v: 'secondary' as const }
    : stage === 'draft' ? (confirmed ? { label: 'Draft · confirmation parsed', v: 'info' as const } : { label: 'Draft', v: 'secondary' as const })
      : received ? { label: 'Partially received', v: 'warning' as const } : { label: 'Ordered', v: 'info' as const };

  return (
    <div className={'grid h-[calc(100vh-2rem)] gap-5 ' + (isAgent ? 'grid-cols-[minmax(0,1fr)_23rem]' : 'grid-cols-[minmax(0,1fr)_20rem]')}>
      {/* ───────── 左：单头 + 明细 ───────── */}
      <div className="flex min-h-0 min-w-0 flex-col gap-5">
        <Card className="shrink-0 gap-0 py-5">
          <CardContent className="space-y-3">
            <button type="button" onClick={onBack} className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" />Back to purchase orders</button>
            <div className="flex min-w-0 items-center gap-2.5">
              <h1 className="whitespace-nowrap text-2xl font-semibold leading-tight tracking-[-0.02em] tabular-nums">{PO}</h1>
              <CopyButton text={PO} label="Copy PO number" />
              <Badge variant={status.v}>{status.label}</Badge>
              <span className="min-w-0 truncate text-sm text-muted-foreground">· {SUPPLIER_NAME}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Steps state={cancelled ? 'cancelled' : stage === 'draft' ? 'draft' : received ? 'partial' : 'ordered'} />
              <div className="flex shrink-0 items-center gap-2">
                {stage === 'draft' ? (
                  <>
                    <Button variant="outline" disabled={cancelled || planning} onClick={() => { if (isAgent) { log('Request exported', 'You', 'Codes and quantities, no prices'); thread.post({ role: 'agent', text: 'Request exported: supplier codes, names and quantities only, no prices. It was downloaded, not sent. Upload the supplier confirmation when it comes back.' }); } }}><FileDown />Export request</Button>
                    {!confirmed && <Button disabled={cancelled || lines.length === 0 || planning} onClick={() => setUploadOpen(true)}><Upload />Upload confirmation</Button>}
                    {confirmed && isAgent && !approval && <Button disabled={cancelled} onClick={() => { setApprovePath('direct'); setApproveAsk(true); }}><UserCheck />Approve</Button>}
                    {confirmed && isAgent && approval === 'owner' && <Button onClick={() => { setApproval('approved'); log('Approved', 'Marco Bianchi', 'Owner'); thread.post({ role: 'agent', text: 'The owner approved this confirmation. The order is not placed yet: place it with MNP, then Mark as ordered.' }); }}><UserCheck />Approve as owner</Button>}
                    {confirmed && (!isAgent || approval === 'approved') && <Button disabled={cancelled} onClick={markOrdered}><Check />Mark as ordered</Button>}
                  </>
                ) : (
                  <>
                    {closed ? (isAgent && <Button disabled={reviewed !== 'idle'} onClick={startReview}><MessageSquareText />{reviewed === 'done' ? 'Reviewed' : 'Review this order'}</Button>) : <>
                    {!ddtUploaded && <Button onClick={() => setDdtOpen(true)}><Upload />Upload DDT</Button>}
                    <Button variant="outline" disabled={!(openQty > 0 || received)} onClick={() => setRemainingOpen(true)}>Handle remaining goods</Button>
                    <Button disabled={!canConfirm} title={pendingExtras ? 'Decide the lines that are not on the confirmation first' : undefined} onClick={() => { setReceiverDraft(receiver); setReceiveAsk(true); }}><PackageCheck />Confirm receipt</Button></>}
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="More actions"><Ellipsis /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    {(stage === 'inbound' || isAgent) && <DropdownMenuItem onSelect={() => setInfoOpen(true)}><InfoIcon />Order details</DropdownMenuItem>}
                    {stage === 'inbound' && ddtUploaded && <DropdownMenuItem onSelect={() => setDdtOpen(true)}><Upload />Re-upload DDT</DropdownMenuItem>}
                    {stage === 'inbound' && <DropdownMenuItem onSelect={() => setInvoice(true)}><Upload />{invoice ? 'Re-upload invoice' : 'Upload invoice'}</DropdownMenuItem>}
                    {stage === 'draft' && confirmed && <DropdownMenuItem disabled={cancelled} onSelect={() => setUploadOpen(true)}><Upload />Re-upload confirmation</DropdownMenuItem>}
                    {stage === 'draft' && <DropdownMenuItem disabled={cancelled} onSelect={() => setCancelAsk(true)} className="text-destructive focus:text-destructive"><XCircle />Cancel PO</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-0 flex-1 gap-0 overflow-hidden py-0">
          {stage === 'draft' ? (
            <>
              <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Select value={salesWindow} onValueChange={(v) => setSalesWindow(v as SalesWindow)} size="lg" ariaLabel="Sales window" triggerClassName={CTRL + ' !h-9 w-44'}
                    options={SALES_WINDOWS.map((o) => ({ value: o.value, label: `Sales · ${o.label}` }))} />
                  <Button variant="outline" className={CTRL + ' px-3.5'} disabled={cancelled} onClick={() => setAddOpen(true)}><Plus />Add product</Button>
                </div>
                <p className="text-sm text-muted-foreground"><span className="tabular-nums">{groupKeys.length} products · {lines.length} SKUs</span>
                  <button type="button" onClick={draftExpand.toggleAll} className="ml-3 font-medium text-primary hover:underline">{draftExpand.all ? 'Collapse all' : 'Expand all'}</button></p>
              </div>
              <DraftTable lines={planning ? [] : lines} planning={planning} onWhy={isAgent ? why : undefined} salesWindow={salesWindow} confirmed={confirmed} expand={draftExpand}
                onUpdate={(sku, patch) => setLines((p) => p.map((l) => (l.sku === sku ? { ...l, ...patch } : l)))}
                onDeleteSku={(l) => setToDelete({ title: `Delete SKU ${l.sku}?`, run: () => setLines((p) => p.filter((x) => x.sku !== l.sku)) })}
                onDeleteSpu={(key, label) => setToDelete({ title: `Delete all SKUs under “${label}”?`, run: () => setLines((p) => p.filter((x) => x.productId !== key)) })}
                onCreateSku={setCreateFor} />

              {/* 底部合计条 */}
              <div className="flex shrink-0 items-end justify-between gap-6 border-t border-border px-6 py-4">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="tabular-nums">{lines.length} SKUs · {pcs} pcs</Badge>
                    <Badge variant={minOk ? 'success' : 'warning'} className="tabular-nums">{minOk ? 'Min order met' : `Min order · need ${eur(SUPPLIER.minOrderValue - goods)}`}</Badge>
                    <Badge variant={freeShip ? 'success' : 'warning'} className="tabular-nums">{freeShip ? 'Free shipping' : `Shipping ${eur(shipping)} · ${eur(SUPPLIER.freeShippingThreshold - goods)} to free`}</Badge>
                    <Badge variant="secondary">Early-pay {SUPPLIER.earlyPaymentRate}% / {SUPPLIER.earlyPaymentDays}d</Badge>
                  </div>
                  <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                    {confirmed ? (
                      <>
                        <div className="flex gap-1.5"><dt className="text-muted-foreground">Est.</dt><dd className="font-medium tabular-nums">{eur(estGoods)}</dd></div>
                        <div className="flex gap-1.5"><dt className="text-muted-foreground">Conf.</dt><dd className="font-medium tabular-nums">{eur(confGoods)}</dd></div>
                        <Badge variant={delta > 0.009 ? 'destructive' : delta < -0.009 ? 'success' : 'secondary'} className="tabular-nums">{delta > 0.009 ? `${eur(delta)} higher` : delta < -0.009 ? `${eur(-delta)} lower` : 'same as Est.'}</Badge>
                      </>
                    ) : <div className="flex gap-1.5"><dt className="text-muted-foreground">Goods</dt><dd className="font-medium tabular-nums">{eur(goods)}</dd></div>}
                    <div className="flex gap-1.5"><dt className="text-muted-foreground">Shipping</dt><dd className="font-medium tabular-nums">{shipping === 0 ? 'Free' : eur(shipping)}</dd></div>
                  </dl>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold tracking-tight tabular-nums">{eur(goods + shipping)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="shrink-0 space-y-3 px-6 pt-5">
                {remaining.decision && (
                  <div data-remaining-decision className="rounded-xl bg-status-info-subtle px-4 py-3 text-sm">
                    <p className="font-semibold">Remaining {openQty} pcs · {REMAINING[remaining.decision].title}</p>
                    <p className="mt-0.5 text-muted-foreground">{remaining.decision === 'wait_next_batch' && remaining.date ? `Expected ${dmy(remaining.date)}, reminder set. ` : ''}{remaining.note || REMAINING[remaining.decision].description}</p>
                  </div>
                )}
                <div className="rounded-xl px-4 py-3.5" style={{ background: 'color-mix(in srgb, var(--attention) 14%, var(--surface-raised))' }}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <p className="font-semibold">PO receipt progress</p>
                    <p className="tabular-nums text-muted-foreground">Received <span className="font-semibold text-foreground">{receivedPcs}</span> / {orderedTotal} pcs</p>
                  </div>
                  <div role="progressbar" aria-label="PO receipt progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="mt-2.5 h-2 overflow-hidden rounded-full bg-card">
                    <div className="h-full rounded-full" style={{ width: pct + '%', background: 'var(--attention)', transition: 'width 600ms var(--ease-out)' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pb-1 text-sm">
                  <p className="text-muted-foreground">{ddtUploaded ? <>Batch 1 · <span className="font-medium text-foreground">{ddt?.fileName.replace(/\.pdf$/i, '')}</span> checked against the confirmation</> : 'Enter what arrived in Actual, or upload the DDT to fill it in.'}</p>
                  <p className="shrink-0 text-muted-foreground"><span className="tabular-nums">{recKeys.length} products · {rec.length} SKUs</span>
                    <button type="button" onClick={recExpand.toggleAll} className="ml-3 font-medium text-primary hover:underline">{recExpand.all ? 'Collapse all' : 'Expand all'}</button></p>
                </div>
              </div>
              <div className="mt-3 flex min-h-0 flex-1 flex-col">
                <ReceivingTable lines={rec} confirmed={received} ddtUploaded={ddtUploaded} decision={remaining.decision} extras={extras} expand={recExpand}
                  onCount={(sku, n) => setRec((p) => p.map((l) => (l.sku === sku ? { ...l, counted: n } : l)))}
                  onExtra={(sku, d) => {
                    setExtras((p) => ({ ...p, [sku]: d }));
                    // 只有「入库」才计入本批数量；退回和赠品签收都不进库存
                    setRec((p) => p.map((l) => (l.sku === sku ? { ...l, counted: d === 'receive' ? l.ddt : 0 } : l)));
                  }} />
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="tabular-nums">{rec.length} SKUs · {thisBatch} pcs this batch</Badge>
                  {pendingExtras && <Badge variant="warning">Decide lines not on the confirmation</Badge>}
                </div>
                <p className={'text-sm font-semibold ' + (received ? 'text-success-text' : '')}>{received ? 'Batch recorded' : pendingExtras ? 'Decide the flagged lines first' : thisBatch > 0 ? (ddtUploaded ? 'Ready to confirm' : 'Ready to confirm · no DDT') : 'Enter the counted quantities'}</p>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ───────── 右：信息栏 ───────── */}
      {isAgent ? (
        <AgentPanel thread={thread} onSend={onAgentSend} suggestions={suggestions} tab={panelTab} onTab={setPanelTab} subtitle={`${SUPPLIER_NAME.replace(/\s*\(.*\)$/, '')} · ${coverage}-day coverage`}
          tabs={{
            evidence: <EvidenceView coverage={coverage} confirmation={confirmation?.fileName ?? (stage === 'inbound' ? CONFIRMATION_FILE : null)} ddt={stage === 'inbound' ? ddt?.fileName ?? null : undefined} onOpenRules={() => setPanelTab('rules')} onUpload={planning || cancelled ? undefined : (k) => (k === 'ddt' ? setDdtOpen(true) : setUploadOpen(true))} />,
            rules: <div>
              {SUPPLIER_RULES.groups.map((g) => <KeyValues key={g.title} title={g.title} rows={g.rows} />)}
              <p className="mt-1 text-xs text-muted-foreground">{SUPPLIER_RULES.source} · {SUPPLIER_RULES.version} · valid until {SUPPLIER_RULES.validUntil}</p>
              <div className="mt-4 flex gap-2"><Button variant="outline" size="sm">Edit supplier details</Button><Button size="sm" onClick={() => { setPanelTab('agent'); thread.post({ role: 'user', text: 'Update MNP terms' }); thread.reply({ text: 'Tell me what changed, for example “free shipping now from €2,500”. I will show the change before saving it.' }); }}><Sparkles />Edit in chat</Button></div>
            </div>,
            activity: activity.length ? <Timeline items={activity} /> : <p className="text-sm text-muted-foreground">No activity yet.</p>,
          }} />
      ) : (
      <div className="-m-4 flex min-h-0 min-w-0 flex-col gap-5 overflow-y-auto p-4 [scrollbar-width:thin]">
        {stage === 'draft' ? (
          <>
            <Card className="shrink-0 gap-3 pb-5 pt-4">
              <CardHeader><CardTitle className="text-base">Pricing & shipping</CardTitle></CardHeader>
              <CardContent className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="space-y-1.5"><span className="text-xs text-muted-foreground">Document discount %</span><Input type="number" min={0} step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} className="h-10 rounded-xl tabular-nums" /></label>
                  <label className="space-y-1.5"><span className="text-xs text-muted-foreground">Shipping (€)</span><Input type="number" min={0} step="0.01" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value) || 0)} className="h-10 rounded-xl tabular-nums" /></label>
                </div>
                <p className={'rounded-xl px-3 py-2.5 text-sm ' + (estGoods >= SUPPLIER.freeShippingThreshold ? 'bg-status-success-subtle text-success-text' : 'bg-status-warning-subtle text-warning-text')}>
                  {estGoods >= SUPPLIER.freeShippingThreshold ? `Free-shipping threshold reached (${eur(SUPPLIER.freeShippingThreshold)})` : `Need ${eur(SUPPLIER.freeShippingThreshold - estGoods)} more for free shipping`}
                </p>
              </CardContent>
            </Card>
            <Card className="shrink-0 gap-3 pb-5 pt-4">
              <CardHeader><CardTitle className="text-base">Purchase order info</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                  <Info label="Supplier" wide>{SUPPLIER_NAME}</Info>
                  <Info label="Contact" wide>{SUPPLIER.contact}</Info>
                  <Info label="Created"><span className="tabular-nums">{PO_META.createdAt}</span></Info>
                  <Info label="Order date">—</Info>
                  <Info label="Expected delivery"><span className="tabular-nums">{PO_META.expectedDelivery}</span></Info>
                  <Info label="Status">{confirmed ? 'Confirmation parsed' : 'Awaiting confirmation'}</Info>
                  <Info label="Notes" wide>{PO_META.notes}</Info>
                </dl>
              </CardContent>
            </Card>
            <Card className="shrink-0 gap-3 pb-5 pt-4">
              <CardHeader><CardTitle className="text-base">Documents</CardTitle></CardHeader>
              <CardContent>
                <DocSlot label="Supplier confirmation" file={confirmation?.fileName ?? null} done={confirmed} meta={confirmation ? `V1 · ${confirmation.sizeLabel} · uploaded ${confirmation.at}` : undefined}
                  action={<button type="button" className={linkBtn} disabled={cancelled} onClick={() => setUploadOpen(true)}>{confirmed ? 'Replace file' : 'Upload PDF'}</button>} />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="shrink-0 gap-3 pb-5 pt-4">
              <CardHeader><CardTitle className="text-base">Receipt info</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                  <Info label="Receipt" wide>{ddtUploaded || received ? `Batch 1 · first delivery${ddtUploaded ? '' : ' · no DDT'}` : 'No goods received yet'}</Info>
                  <Info label="Delivery note">{ddt ? ddt.fileName.replace(/\.pdf$/i, '') : '—'}</Info>
                  <Info label="Uploaded at"><span className="tabular-nums">{ddt?.at ?? '—'}</span></Info>
                  <Info label="Received by" wide>{receiver ? `${receiver} · warehouse` : '—'}</Info>
                  <Info label="Stocked in"><span className="tabular-nums">{receivedPcs} pcs</span></Info>
                  <Info label="Expected arrival"><span className="tabular-nums">{remaining.decision === 'wait_next_batch' && remaining.date ? dmy(remaining.date) : PO_META.expectedDelivery}</span></Info>
                  <Info label="Notes" wide>{remaining.decision ? `Remaining goods: ${REMAINING[remaining.decision].title}` : ddtUploaded ? 'First truck · quantities checked against the supplier confirmation' : 'Ordered and confirmed · waiting for the first truck'}</Info>
                </dl>
              </CardContent>
            </Card>
            <Card className="shrink-0 gap-3 pb-5 pt-4">
              <CardHeader><CardTitle className="text-base">Documents</CardTitle></CardHeader>
              <CardContent className="space-y-2.5">
                <DocSlot label="Supplier confirmation" file={CONFIRMATION_FILE} done />
                <DocSlot label="Delivery note (DDT)" file={ddt?.fileName ?? null} done={ddtUploaded} meta={ddt ? `uploaded ${ddt.at}` : undefined}
                  action={!ddtUploaded ? <button type="button" className={linkBtn} onClick={() => setDdtOpen(true)}>Upload DDT</button> : undefined} />
                <DocSlot label="Invoice" file={invoice ? INVOICE_FILE : null} done={invoice}
                  action={<button type="button" className={linkBtn} onClick={() => setInvoice(true)}>{invoice ? 'Replace file' : 'Upload invoice'}</button>} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
      )}

      {/* ───────── 弹窗 ───────── */}
      <AddProductDialog open={addOpen} onOpenChange={setAddOpen} orderLines={lines}
        onAdd={(added) => { setLines((p) => [...p, ...added]); draftExpand.add(added.map((l) => l.productId)); }} />
      <QuickSkuDialog line={createFor} onOpenChange={(o) => { if (!o) setCreateFor(null); }}
        onCreate={(sku) => { setLines((p) => p.map((l) => (l.sku === sku ? { ...l, alert: SKU_CREATED_NOTE } : l))); setCreateFor(null); }} />
      <UploadDocDialog open={uploadOpen} onOpenChange={setUploadOpen} title="Upload supplier confirmation" sample={{ fileName: CONFIRMATION_FILE, sizeLabel: '228 KB' }}
        description="The PDF is read and written back to the order lines; differences against your draft are marked there."
        drop="Drop the supplier PDF here, or click to browse" hint="Conferma d’ordine · PDF up to 10 MB"
        steps={['Reading PDF layout…', 'Matching supplier codes to SKUs…', 'Comparing against the draft PO…']}
        results={['3 pages · 15 lines', '13 matched · 2 not on the draft', '6 differences marked']}
        onApply={(u) => {
          const next = applyConfirmation(lines);
          setLines(next);
          setConfirmation({ ...u, at: stamp() });
          draftExpand.add(next.filter(hasGap).map((l) => l.productId));
          setUploadOpen(false);
          if (isAgent) {
            setApproval(null); log('Confirmation uploaded', 'You', u.fileName); setPanelTab('agent');
            (async () => { await thread.run('Checking the confirmation', [{ label: 'Match supplier codes', detail: '13 of 15 lines matched' }, { label: 'Compare with your plan', detail: '6 differences' }, { label: 'Run approval checks', detail: '4 of 5 apply' }], 600);
              log('Confirmation compared', 'Agent', '6 differences'); thread.post({ role: 'agent', text: 'The differences are marked on the lines.', card: confirmationCard() }); })();
          }
        }} />
      <UploadDocDialog open={ddtOpen} onOpenChange={setDdtOpen} title="Upload delivery note" sample={{ fileName: DDT_FILE, sizeLabel: '96 KB' }}
        description="The DDT is read and checked against the supplier confirmation, line by line."
        drop="Drop the DDT here, or click to browse" hint="Documento di trasporto · PDF up to 10 MB"
        steps={['Reading the delivery note…', 'Matching supplier codes and lot numbers to SKUs…', 'Comparing shipped quantities against the confirmation…']}
        results={['2 pages · 14 lines', '13 matched · 11 lot numbers', '4 lines differ']}
        onApply={(u) => {
          const next = applyDdt(rec);
          setRec(next);
          setDdt({ ...u, at: stamp() });
          recExpand.add(next.filter((l) => recStatus(l, true, null, null).tone !== 'ok').map((l) => l.productId));
          setDdtOpen(false);
          if (isAgent) {
            log('DDT uploaded', 'You', u.fileName); setPanelTab('agent');
            thread.reply({ text: 'Actual is filled from the DDT. Change it where the warehouse counted something different; stock-in always uses Actual.',
              card: { title: 'Delivery note checked', tone: 'warn', source: u.fileName, badges: ['4 lines differ', '1 not on confirmation'],
                sections: [{ title: 'Short vs confirmation', rows: [{ label: '370102', before: '90', after: '60' }, { label: '431001', before: '72', after: '60' }] },
                  { title: 'Not on this truck', rows: [{ label: '510002', detail: 'Top coat Matte · 24 pcs open' }] },
                  { title: 'Not on the confirmation', rows: [{ label: '510003', detail: 'Top coat Satin · 12 pcs' }] }],
                next: 'Decide 510003 (return, gift or stock in), then Confirm receipt.' } }, 'Matching the DDT to the order…', 1100);
          }
        }} />
      {/* 确认收货：先看本批汇总，再选收货人 */}
      <FormDialog open={receiveAsk} onOpenChange={setReceiveAsk} className="sm:max-w-md" title="Confirm receipt"
        description={<>{ddt ? `Batch 1 · ${ddt.fileName.replace(/\.pdf$/i, '')}` : 'Batch 1 · no DDT'}</>}
        status={receiverDraft ? undefined : 'Choose who received the goods'} confirmLabel="Confirm receipt" confirmDisabled={!receiverDraft}
        onConfirm={() => { setReceiver(receiverDraft); setReceived(true); setReceiveAsk(false);
          if (isAgent) { log('Receipt confirmed', receiverDraft, `${thisBatch} pcs`); thread.post({ role: 'agent', text: `${thisBatch} pcs are in stock from Actual. ${Math.max(0, orderedTotal - stockedTotal - thisBatch)} pcs are still open: choose whether to wait for the next batch or close them.`, actions: [{ label: 'Handle remaining goods', primary: true, onClick: () => setRemainingOpen(true) }] }); } }}>
        <FormSection title="This batch">
          <dl className="grid grid-cols-3 gap-2 text-sm">
            {([['Into stock', `${thisBatch} pcs`], ['Lines', `${rec.filter((l) => l.counted > 0).length} SKUs`], ['Still open', `${Math.max(0, orderedTotal - stockedTotal - thisBatch)} pcs`]] as const).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-muted px-3 py-2.5"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-semibold tabular-nums">{v}</dd></div>
            ))}
          </dl>
          {Object.values(extras).some((x) => x !== 'receive') && <p className="mt-2.5 text-xs text-muted-foreground">Lines marked as gift or return are recorded but not stocked.</p>}
        </FormSection>
        <FormSection title="Received by" hint="Recorded on the receipt and in the stock movement.">
          <Select value={receiverDraft || null} onValueChange={setReceiverDraft} size="lg" placeholder="Select who received it" ariaLabel="Received by" triggerClassName="!h-10 w-full rounded-xl"
            options={['Elena Rossi', 'Luca Bianchi', 'Marco Ferri'].map((n) => ({ value: n, label: n }))} />
        </FormSection>
      </FormDialog>
      <RemainingDialog open={remainingOpen} onOpenChange={setRemainingOpen} openQty={openQty} initial={remaining}
        lines={rec.map((l) => ({ name: `${l.productName} ${l.variant}`, qty: Math.max(0, l.ordered - l.stocked - (received ? l.counted : 0)) })).filter((l) => l.qty > 0)}
        onSave={(v) => { setRemaining(v); setRemainingOpen(false);
          if (isAgent && v.decision) { log(REMAINING[v.decision].title, 'You', `${openQty} pcs`); thread.post({ role: 'agent', text: v.decision === 'wait_next_batch' ? `The order stays open for ${openQty} pcs${v.date ? `, expected ${dmy(v.date)}. I will remind you that morning` : ''}. Upload the next DDT when it arrives.` : `${openQty} pcs are closed and will not be received. Receiving for this order is complete.` }); } }} />
      <FormDialog open={approveAsk} onOpenChange={setApproveAsk} className="sm:max-w-lg" title="Choose approval path" description={`${CONFIRMATION_FILE} · ${eur(confGoods)}`}
        status="Neither option places the order" confirmLabel={approvePath === 'direct' ? 'Approve' : 'Send to owner'}
        onConfirm={() => {
          setApproveAsk(false);
          if (approvePath === 'direct') { setApproval('approved'); log('Approved', 'Giulia Rossi', 'Buyer'); thread.post({ role: 'agent', text: 'Approved as buyer. This is not an order: place it with MNP, then Mark as ordered.' }); }
          else { setApproval('owner'); log('Sent for owner approval', 'Giulia Rossi'); thread.post({ role: 'agent', text: 'Sent to Marco Bianchi (owner) with the confirmation and the 4 approval checks. Mark as ordered unlocks after the owner approves.' }); }
        }}>
        <FormSection title="Approval checks" hint="From the current supplier confirmation">
          <ul className="space-y-1.5">{APPROVAL_CHECKS.map((c) => (c.label.startsWith('Order value') ? { ...c, evidence: `Goods ${eur(confGoods)}` } : c)).map((c) => <li key={c.label} className="flex items-start gap-2.5 text-sm"><span className={'mt-1.5 size-1.5 shrink-0 rounded-full ' + (c.fired ? 'bg-warning' : 'bg-border')} /><span className="min-w-0"><span className={c.fired ? 'font-medium' : 'text-muted-foreground'}>{c.label}</span><span className="block truncate text-xs text-muted-foreground">{c.evidence}</span></span></li>)}</ul>
        </FormSection>
        <FormSection title="Who approves">
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Approval path">
            {([['direct', 'Approve directly', 'As the buyer, now'], ['owner', 'Push to owner', 'Marco Bianchi approves']] as const).map(([v, t, d]) => (
              <button key={v} type="button" role="radio" aria-checked={approvePath === v} onClick={() => setApprovePath(v)}
                className={'rounded-xl border p-3.5 text-left transition-colors ' + (approvePath === v ? 'border-primary bg-primary/6 ring-1 ring-primary' : 'border-input hover:bg-[var(--surface-hover)]')}>
                <span className="flex items-center justify-between"><span className="text-sm font-semibold">{t}</span><span className={'grid size-4 place-items-center rounded-full border ' + (approvePath === v ? 'border-primary bg-primary' : 'border-input')}>{approvePath === v && <span className="size-1.5 rounded-full bg-white" />}</span></span>
                <span className="mt-1 block text-xs text-muted-foreground">{d}</span>
              </button>
            ))}
          </div>
        </FormSection>
      </FormDialog>
      <Confirm open={!!toDelete} onClose={() => setToDelete(null)} title={toDelete?.title ?? ''} body="The lines are removed from this purchase order." action="Delete" destructive
        onConfirm={() => { toDelete?.run(); setToDelete(null); }} />
      <Confirm open={cancelAsk} onClose={() => setCancelAsk(false)} title={`Cancel ${PO}?`} body="The draft is closed and nothing is sent to the supplier." action="Cancel PO" destructive
        onConfirm={() => { setCancelled(true); setCancelAsk(false); }} />

      <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-6 py-5"><SheetTitle className="text-lg">Order details</SheetTitle><SheetDescription>Document, supplier, order and receipt summary</SheetDescription></SheetHeader>
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {([
              ['Document', [['PO number', PO], ['Status', ddtUploaded ? 'Ordered · DDT received' : 'Ordered · awaiting delivery']]],
              ['Supplier', [['Supplier', SUPPLIER_NAME], ['Contact', SUPPLIER.contact], ['Website', SUPPLIER.website]]],
              ['Order', [['Order date', PO_META.orderDate], ['Expected arrival', PO_META.expectedDelivery], ['Received by', receiver ? `${receiver} · warehouse` : '—']]],
              ['Receipt', [['Lines', `${recKeys.length} products · ${rec.length} SKUs`], ['Quantity', `${receivedPcs} / ${orderedTotal} pcs received`], ['Confirmed batches', received ? `1 receipt · ${thisBatch} pcs total` : '—'], ['Invoice', invoice ? INVOICE_FILE : '—']]],
            ] as const).map(([title, rows]) => (
              <section key={title}>
                <h3 className="mb-2.5 text-sm font-semibold">{title}</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">{rows.map(([k, v]) => <Info key={k} label={k} wide={k === 'Supplier' || k === 'Contact' || k === 'Received by'}>{v}</Info>)}</dl>
              </section>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
