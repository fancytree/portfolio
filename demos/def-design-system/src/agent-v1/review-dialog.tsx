import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AtSign, Sparkles } from 'lucide-react';
import { FormDialog, FormSection } from '../form-dialog';
import { BASE_LINES } from '../purchase-data';
import { ORDER_REVIEW } from './score-store';

/**
 * 买手的 review，商品再多也能用：
 * 1. 整体三个维度用滑块打分（Agent 先按数据给出建议位置）；质量这类数据看不到的，买手用文字说；
 * 2. Agent 只挑出偏差最大的几个商品提示，不逐个列；
 * 3. 具体商品用文字说，@ 可以补全 SKU / 商品名；Agent 识别出说的是哪个商品、意味着什么，当场展示让买手核对。
 */

/* ───────── 维度 ───────── */
export type DimId = 'quantity' | 'timing' | 'mix';
type Dim = { id: DimId; title: string; hint: string; stops: [string, string, string, string, string]; agent: number | null;
  /** 理想位置：数量和到货在中间，商品组合越右越好 */
  ideal: 'center' | 'right';
  /** 每一档对下一张计划的影响，拖动时实时显示 */
  next: [string, string, string, string, string] };
export const DIMS: Dim[] = [
  { id: 'quantity', title: 'Quantity', hint: '516 planned · 534 needed', stops: ['Far too little', 'Too little', 'About right', 'Too much', 'Far too much'], agent: -1, ideal: 'center',
    next: ['Raise coverage a lot', 'Raise coverage a little', 'Keep coverage', 'Lower coverage a little', 'Lower coverage a lot'] },
  { id: 'timing', title: 'Arrival', hint: 'ETA 21/08 · arrived 24/08', stops: ['Very late', 'Late', 'On time', 'Early', 'Very early'], agent: -1, ideal: 'center',
    next: ['Lead time 14 → 19 days', 'Lead time 14 → 17 days', 'Keep 14-day lead time', 'Lead time 14 → 12 days', 'Lead time 14 → 10 days'] },
  { id: 'mix', title: 'Product mix', hint: '2 products not supplied', stops: ['Mostly wrong', 'Some wrong', 'Mostly right', 'Right', 'Spot on'], agent: 0, ideal: 'right',
    next: ['Rebuild the product list', 'Check which products to drop', 'Keep, check what was missing', 'Keep the product list', 'Keep the product list'] },
];

/** 离理想位置多远 → 颜色：0 绿，1 橙，2 红 */
const TONE = ['var(--success)', 'var(--warning)', 'var(--destructive)'];
const offBy = (d: Dim, v: number) => (d.ideal === 'center' ? Math.abs(v) : v >= 1 ? 0 : v === 0 ? 1 : 2);

/** 五档滑块：拖动时拇指跟手、略微放大，松手按回弹曲线吸附到最近一档；颜色随偏离程度变化 */
export function StopSlider({ dim, value, onChange }: { dim: Dim; value: number; onChange: (v: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<number | null>(null); // 拖动中的连续位置 0–100
  const moved = useRef(false);
  const at = (clientX: number) => { const r = track.current!.getBoundingClientRect(); return Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)); };
  const snap = (pct: number) => Math.round(pct / 25) - 2;
  const tone = TONE[offBy(dim, value)];
  const pct = drag ?? ((value + 2) / 4) * 100;
  const from = dim.ideal === 'center' ? 50 : 0;
  const changed = dim.agent != null && value !== dim.agent;
  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{dim.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{dim.hint}</p>
        </div>
        <span key={value} className="pop-in inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold transition-colors duration-300"
          style={{ color: tone, background: `color-mix(in srgb, ${tone} 12%, transparent)` }}>{dim.stops[value + 2]}</span>
      </div>
      <div ref={track} role="slider" tabIndex={0} aria-label={dim.title} aria-valuemin={-2} aria-valuemax={2} aria-valuenow={value} aria-valuetext={dim.stops[value + 2]}
        onPointerDown={(e) => { moved.current = false; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); const p = at(e.clientX); setDrag(p); onChange(snap(p)); }}
        onPointerMove={(e) => { if (drag == null) return; moved.current = true; const p = at(e.clientX); setDrag(p); if (snap(p) !== value) onChange(snap(p)); }}
        onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') onChange(Math.max(-2, value - 1)); if (e.key === 'ArrowRight') onChange(Math.min(2, value + 1)); }}
        className="group relative mt-4 h-7 cursor-grab touch-none select-none rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring/40">
        <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted" />
        {/* 填充：数量、到货从中间往两边，商品组合从左往右 */}
        <span className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
          style={{ left: `${Math.min(from, pct)}%`, width: `${Math.abs(pct - from)}%`, background: tone, opacity: 0.55,
            transition: drag != null ? 'background-color 300ms' : 'left 420ms var(--ease-spring), width 420ms var(--ease-spring), background-color 300ms' }} />
        {dim.stops.map((s, i) => {
          const passed = dim.ideal === 'center' ? (i - 2) * value > 0 && Math.abs(i - 2) <= Math.abs(value) : i <= value + 2;
          return <button key={s} type="button" tabIndex={-1} aria-label={`${dim.title}: ${s}`} onClick={() => { if (!moved.current) onChange(i - 2); }}
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300" style={{ left: `${i * 25}%`, background: passed ? tone : 'var(--border)' }} />;
        })}
        {dim.agent != null && (
          <span className="pointer-events-none absolute -top-3 -translate-x-1/2 text-primary" style={{ left: `${(dim.agent + 2) * 25}%` }} title="The agent’s read"><Sparkles className="size-3" /></span>
        )}
        <span className="pointer-events-none absolute top-1/2 size-5 rounded-full border-[3px] bg-card"
          style={{ left: `${pct}%`, borderColor: tone, transform: `translate(-50%, -50%) scale(${drag != null ? 1.25 : 1})`,
            boxShadow: drag != null ? `0 0 0 6px color-mix(in srgb, ${tone} 18%, transparent), 0 2px 6px rgb(16 24 40 / 0.2)` : '0 1px 3px rgb(16 24 40 / 0.2)',
            transition: drag != null ? 'transform 160ms var(--ease-out), border-color 300ms, box-shadow 200ms' : 'left 420ms var(--ease-spring), transform 300ms var(--ease-spring), border-color 300ms, box-shadow 300ms' }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>{dim.stops[0]}</span><span>{dim.stops[4]}</span></div>
      {/* 实时反馈：这一档会让下一张计划怎么变 */}
      <p className="mt-2.5 flex items-center justify-between gap-3 text-xs">
        <span key={value} className="fade-in"><span className="text-muted-foreground">Next plan · </span><span className="font-medium">{dim.next[value + 2]}</span></span>
        {changed ? <button type="button" onClick={() => onChange(dim.agent!)} className="shrink-0 font-medium text-primary hover:underline">Use agent’s read</button>
          : dim.agent != null && <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground"><Sparkles className="size-3 text-primary" />Agent’s read</span>}
      </p>
    </div>
  );
}

/* ───────── 文字里提到的商品 ───────── */
export type Intent = 'more' | 'less' | 'hold' | 'oneoff' | 'note';
export const INTENT: Record<Intent, string> = { more: 'Order more', less: 'Order less', hold: 'Hold flat · quality', oneoff: 'One-off · not scored', note: 'Noted' };
export type Mention = { key: string; label: string; spu: string; intent: Intent };

const CATALOG = (() => {
  const spus = [...new Map(BASE_LINES.map((l) => [l.productId, l.productName])).entries()].map(([id, name]) => ({ key: id, label: name, spu: name, names: [name.toLowerCase()] }));
  const skus = BASE_LINES.map((l) => ({ key: l.sku, label: `${l.productName} ${l.variant}`, spu: l.productName, names: [l.sku, `${l.productName} ${l.variant}`.toLowerCase(), l.variant.toLowerCase()].filter((n) => n.length > 3) }));
  return [...skus, ...spus];
})();
const intentOf = (sentence: string): Intent => {
  const s = sentence.toLowerCase();
  if (/complain|quality|chip|defect|broken|return/.test(s)) return 'hold';
  if (/one-off|one off|promo|fair|event|once/.test(s)) return 'oneoff';
  if (/ran out|sold out|out of stock|short|more|missing/.test(s)) return 'more';
  if (/too many|over|left over|leftover|slow|less|stuck/.test(s)) return 'less';
  return 'note';
};
/** 按句子识别：句子里提到的 SKU / 商品，配上这句话的意图；SKU 比商品名优先 */
export function parseMentions(text: string): Mention[] {
  const out = new Map<string, Mention>();
  for (const sentence of text.split(/(?<=[.!?;\n])\s*/)) {
    const s = sentence.toLowerCase();
    if (!s.trim()) continue;
    const hitSku = CATALOG.filter((c) => !c.key.startsWith('p-') && c.names.some((n) => s.includes(n.toLowerCase())));
    const hits = hitSku.length ? hitSku : CATALOG.filter((c) => c.key.startsWith('p-') && c.names.some((n) => s.includes(n)));
    for (const h of hits) out.set(h.key, { key: h.key, label: h.label, spu: h.spu, intent: intentOf(sentence) });
  }
  return [...out.values()];
}

export type BuyerReview = { dims: Record<DimId, number>; note: string; mentions: Mention[] };
const initialDims = () => Object.fromEntries(DIMS.map((d) => [d.id, d.agent ?? 0])) as Record<DimId, number>;

/** Agent 挑出的偏差最大的几项（不管商品多少，最多 3 条） */
const HIGHLIGHTS = [...ORDER_REVIEW.rows].sort((a, b) => a.score - b.score).slice(0, 3);

export function ReviewDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (r: BuyerReview) => void }) {
  const [dims, setDims] = useState(initialDims);
  const [note, setNote] = useState('');
  const [caret, setCaret] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (open) { setDims(initialDims()); setNote(''); } }, [open]);
  const mentions = useMemo(() => parseMentions(note), [note]);

  // @ 补全：光标前的 @词
  const at = /@([\w\s-]{0,24})$/.exec(note.slice(0, caret));
  const suggestions = at ? CATALOG.filter((c) => !c.key.startsWith('p-') && (c.label.toLowerCase().includes(at[1].toLowerCase().trim()) || c.key.includes(at[1].trim()))).slice(0, 5) : [];
  const insert = (label: string) => {
    if (!at) return;
    const start = caret - at[0].length;
    const next = note.slice(0, start) + label + ' ' + note.slice(caret);
    pendingCaret.current = start + label.length + 1;
    setNote(next);
  };
  // 插入补全后，在同一帧把光标放到插入内容后面，接着打字不会错位
  const pendingCaret = useRef<number | null>(null);
  useLayoutEffect(() => {
    const pos = pendingCaret.current;
    if (pos == null || !area.current) return;
    pendingCaret.current = null;
    area.current.focus(); area.current.setSelectionRange(pos, pos); setCaret(pos);
  }, [note]);

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} className="h-[min(44rem,90vh)] sm:max-w-2xl" title="Review this order"
      description={`${ORDER_REVIEW.po} · MNP · plan ${ORDER_REVIEW.score}% accurate by the data`}
      status={mentions.length ? `${mentions.length} product${mentions.length > 1 ? 's' : ''} recognised` : 'Rate the order, then add specifics'} confirmLabel="Save review" onConfirm={() => onSave({ dims, note: note.trim(), mentions })}>
      <FormSection title="How did this order go?" hint="The agent set each one from the data (✦). Drag where you see it differently.">
        <div className="divide-y divide-border rounded-xl border border-border">{DIMS.map((d) => <StopSlider key={d.id} dim={d} value={dims[d.id]} onChange={(v) => setDims((p) => ({ ...p, [d.id]: v }))} />)}</div>
      </FormSection>

      <FormSection title="Worth a look" hint="The largest gaps the agent found, out of every product on the order.">
        <ul className="space-y-1.5">
          {HIGHLIGHTS.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="min-w-0 truncate"><span className="font-medium">{r.label}</span><span className="text-muted-foreground"> · {r.note}</span></span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{r.planned} → {r.needed} needed</span>
            </li>
          ))}
        </ul>
      </FormSection>

      <FormSection title="Anything specific?" hint="Quality issues, stock-outs, one-offs: name the product or SKU. Type @ to pick one.">
        <div className="relative">
          <textarea ref={area} id="review-note" value={note} rows={3} aria-label="Notes about specific products"
            onChange={(e) => { setNote(e.target.value); setCaret(e.target.selectionStart); }}
            onKeyUp={(e) => setCaret(e.currentTarget.selectionStart)} onClick={(e) => setCaret(e.currentTarget.selectionStart)}
            placeholder="e.g. Black Onyx sells, but salons report chipping. Keep it flat. The care treatment boost was a one-off fair."
            className="block w-full resize-none rounded-xl border border-input bg-card px-3 py-[9px] text-sm leading-5 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40" />
          {suggestions.length > 0 && (
            <ul className="menu-pop absolute left-2 top-full z-20 mt-1 w-72 overflow-hidden rounded-xl bg-popover p-1 shadow-md ring-1 ring-foreground/10">
              {suggestions.map((c) => (
                <li key={c.key}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(c.label)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-[var(--surface-hover)]">
                  <AtSign className="size-3.5 text-muted-foreground" /><span className="font-mono text-xs text-muted-foreground">{c.key}</span><span className="truncate">{c.label}</span>
                </button></li>
              ))}
            </ul>
          )}
        </div>
        {/* 识别结果：当场显示，买手能看出 Agent 有没有读对 */}
        <div className="mt-2.5 flex min-h-7 flex-wrap items-center gap-1.5">
          {mentions.length === 0 ? <span className="text-xs text-muted-foreground">Products you mention appear here with what the agent will do.</span>
            : mentions.map((m) => (
              <span key={m.key} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-2.5 text-xs">
                <span className="font-medium">{m.label}</span><span className="text-muted-foreground">→</span>
                <span className={m.intent === 'hold' || m.intent === 'oneoff' ? 'font-medium text-warning-text' : 'font-medium text-primary-strong'}>{INTENT[m.intent]}</span>
              </span>
            ))}
        </div>
      </FormSection>
    </FormDialog>
  );
}
