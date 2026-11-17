import React, { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Table2, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** 数据可视化组件：遵循 dataviz 规范
 *  细线 2px、柱最粗 24px 且数据端 4px 圆角、段间 2px 表面色间隙、发丝实线网格、
 *  ≥2 个系列必须有图例、悬停提示、可切换表格视图；文字用文本 token，不用系列色。 */
export const viz = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)'];
export const vizOther = 'var(--viz-other)';
const axis = { fontSize: 11, fill: 'var(--muted-foreground)' };
const grid = 'var(--viz-grid)';

export const eur = (v: number) => '€' + Math.round(v).toLocaleString('en-US');
export const compact = (v: number) => (v >= 1000 ? '€' + v / 1000 + 'k' : '€' + v);

/** recharts 动画：进场画出来，切换时间范围时从旧数据过渡到新数据。减少动态时关闭。 */
const calm = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const anim = { isAnimationActive: !calm, animationDuration: 900, animationEasing: 'ease-out' as const };

export function Tip({ title, rows }: { title?: React.ReactNode; rows: { color?: string; label: string; value: React.ReactNode }[] }) {
  return (
    <div className="min-w-36 rounded-xl bg-card px-3 py-2.5 text-xs shadow-lg">
      {title && <p className="mb-1.5 font-medium">{title}</p>}
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-4 py-0.5">
          <span className="inline-flex items-center gap-2 text-muted-foreground">{r.color && <span className="size-2 rounded-full" style={{ background: r.color }} />}{r.label}</span>
          <span className="font-medium tabular-nums">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
      {items.map((i) => <li key={i.label} className="inline-flex items-center gap-2"><span className="h-0.5 w-3 rounded-full" style={{ background: i.color, height: 3 }} />{i.label}</li>)}
    </ul>
  );
}

/** 图表容器：标题 + 说明 + 图例 + 图/表切换。表格视图是对比度 < 3:1 色板的补救手段。 */
/** 卡片标题前的彩色图标块（参考 Kinby）：12% 色底 + 同色图标。 */
export function IconTile({ icon: Icon, tone = 'var(--primary)' }: { icon: LucideIcon; tone?: string }) {
  return <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${tone} 12%, var(--surface-raised))`, color: tone }}><Icon className="size-[18px]" /></span>;
}

export function ChartFrame({ title, subtitle, legend, table, action, children, className, summary, icon, tone }: {
  title: string; subtitle?: string; legend?: { label: string; color: string }[]; summary?: React.ReactNode; icon?: LucideIcon; tone?: string;
  table?: { cols: string[]; rows: (string | number)[][] }; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card className={className}>
      <CardHeader>
        {icon ? (
          <div className="flex min-w-0 items-center gap-3"><IconTile icon={icon} tone={tone} /><div className="min-w-0"><CardTitle className="text-lg">{title}</CardTitle>{subtitle && <CardDescription>{subtitle}</CardDescription>}</div></div>
        ) : (<><CardTitle>{title}</CardTitle>{subtitle && <CardDescription>{subtitle}</CardDescription>}</>)}
        <CardAction className="flex items-center gap-2">
          {action}
          {table && (
            <button type="button" aria-pressed={asTable} aria-label={asTable ? 'Show chart' : 'Show table'} title={asTable ? 'Show chart' : 'Show table'} onClick={() => setAsTable((v) => !v)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {asTable ? <BarChart3 className="size-4" /> : <Table2 className="size-4" />}
            </button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary}
        {legend && legend.length > 1 && !asTable && <Legend items={legend} />}
        {asTable && table ? (
          <div className="max-h-64 overflow-auto rounded-lg bg-muted">
            <table className="w-full text-sm"><thead><tr>{table.cols.map((c, i) => <th key={c} className={'px-3 py-2 text-xs font-medium text-muted-foreground ' + (i ? 'text-right' : 'text-left')}>{c}</th>)}</tr></thead>
              <tbody>{table.rows.map((r, i) => <tr key={i} className="border-t border-border/60">{r.map((c, j) => <td key={j} className={'px-3 py-1.5 tabular-nums ' + (j ? 'text-right' : '')}>{c}</td>)}</tr>)}</tbody></table>
          </div>
        ) : children}
      </CardContent>
    </Card>
  );
}

/* ───────── stat tile with sparkline ───────── */
export function StatTile({ label, value, delta, up = true, points, color = viz[0] }: { label: string; value: string; delta: string; up?: boolean; points: number[]; color?: string }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const data = points.map((v, i) => ({ i, v }));
  return (
    <Card>
      <CardContent className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
            <p className={'mt-1 inline-flex items-center gap-0.5 text-xs font-medium ' + (up ? 'text-success-text' : 'text-destructive')}><Icon className="size-3.5" />{delta}</p>
          </div>
          <div className="h-10 w-24" aria-hidden>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 2, left: 4 }}>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.1} dot={false} {...anim} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────── time series: line/area, crosshair tooltip, end dot with surface ring ───────── */
export type Series = { key: string; label: string; color: string; area?: boolean; dashed?: boolean };
export function TimeChart({ data, series, xKey = 'label', height = 240, fmt = eur, tipFmt, yMax, ticks = 5 }: { data: Record<string, any>[]; series: Series[]; xKey?: string; height?: number; fmt?: (v: number) => string; tipFmt?: (v: number) => string; yMax?: number; ticks?: number }) {
  const tf = tipFmt ?? fmt;
  const last = data.length - 1;
  const dot = (s: Series) => (p: any) => p.index === last ? <circle key={p.index} cx={p.cx} cy={p.cy} r={4.5} fill={s.color} stroke="var(--surface-raised)" strokeWidth={2} /> : <g key={p.index} />;
  return (
    <div style={{ height }} role="img" aria-label={series.map((s) => s.label).join(', ')}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
          <defs>{series.filter((s) => s.area).map((s) => <linearGradient key={s.key} id={'g-' + s.key} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.color} stopOpacity={0.14} /><stop offset="100%" stopColor={s.color} stopOpacity={0} /></linearGradient>)}</defs>
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={36} tick={axis} />
          <YAxis domain={[0, yMax ?? 'auto']} tickCount={ticks} tickLine={false} axisLine={false} width={44} tickFormatter={(v) => fmt(v)} tick={axis} />
          <Tooltip cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} content={({ active, payload, label }) => active && payload?.length ? <Tip title={label} rows={payload.map((p) => ({ color: p.color as string, label: String(p.name), value: tf(Number(p.value)) }))} /> : null} />
          {series.map((s) => s.area
            ? <Area key={s.key} type="monotone" name={s.label} dataKey={s.key} stroke={s.color} strokeWidth={2} fill={`url(#g-${s.key})`} dot={dot(s)} activeDot={{ r: 4.5, stroke: 'var(--surface-raised)', strokeWidth: 2 }} {...anim} />
            : <Line key={s.key} type="monotone" name={s.label} dataKey={s.key} stroke={s.color} strokeWidth={2} strokeDasharray={s.dashed ? '5 4' : undefined} dot={dot(s)} activeDot={{ r: 4.5, stroke: 'var(--surface-raised)', strokeWidth: 2 }} {...anim} />)}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────── columns: clustered or stacked, ≤24px thick, 4px data-end radius, 2px surface gap ───────── */
export function Columns({ data, series, xKey = 'label', height = 220, stacked = false, fmt = (v: number) => String(v), tipFmt, yMax }: { data: Record<string, any>[]; series: Series[]; xKey?: string; height?: number; stacked?: boolean; fmt?: (v: number) => string; tipFmt?: (v: number) => string; yMax?: number }) {
  const tf = tipFmt ?? fmt;
  return (
    <div style={{ height }} role="img" aria-label={series.map((s) => s.label).join(', ')}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%" barGap={2}>
          <CartesianGrid vertical={false} stroke={grid} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={axis} />
          <YAxis domain={yMax ? [0, yMax] : undefined} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => fmt(v)} tick={axis} />
          <Tooltip cursor={{ fill: 'var(--surface-sunken)' }} content={({ active, payload, label }) => active && payload?.length ? <Tip title={label} rows={payload.map((p) => ({ color: p.color as string || (p.fill as string), label: String(p.name), value: tf(Number(p.value)) }))} /> : null} />
          {series.map((s, i) => (
            <Bar key={s.key} name={s.label} dataKey={s.key} fill={s.color} stackId={stacked ? 'a' : undefined} maxBarSize={24} stroke="var(--surface-raised)" strokeWidth={stacked ? 1 : 0}
              radius={stacked ? (i === series.length - 1 ? [4, 4, 0, 0] : 0) : [4, 4, 0, 0]} {...anim} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────── ranked horizontal bars: name, bar (≤10px), value at the tip ───────── */
export function HBars({ rows, fmt = (v: number) => String(v), color = viz[0], highlight = 0, notes, interactive = false, images }: { rows: [string, number][]; fmt?: (v: number) => string; color?: string; highlight?: number; notes?: string[]; interactive?: boolean; images?: string[] }) {
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <ul className={interactive ? 'space-y-1' : 'space-y-3.5'}>
      {rows.map(([n, v], i) => (
        <li key={n} title={`${n}: ${fmt(v)}`} className={(images ? 'flex items-center gap-3 ' : 'space-y-1.5 ') + (interactive ? '-mx-2 cursor-pointer rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-sunken' : '')}>
          {images && <img src={images[i]} alt="" loading="lazy" className="size-10 shrink-0 rounded-lg object-cover" />}
          <div className={images ? 'min-w-0 flex-1 space-y-1.5' : 'contents'}>
          <div className="flex items-baseline justify-between gap-3 text-sm"><span className="truncate">{n}</span><span className="inline-flex shrink-0 items-baseline gap-2">{notes && <span className="text-xs text-muted-foreground tabular-nums">{notes[i]}</span>}<span className="font-medium tabular-nums">{fmt(v)}</span></span></div>
          <div className="h-2 rounded-full bg-muted"><div className="bar-grow h-full rounded-full" style={{ animationDelay: i * 70 + 'ms', width: (v / max) * 100 + '%', background: i === highlight ? color : 'color-mix(in srgb, ' + color + ' 38%, var(--surface-raised))' }} /></div>
        </div>
        </li>
      ))}
    </ul>
  );
}

/* ───────── segmented bar: one whole split into ≤6 parts; 2px surface gaps; legend lists names ───────── */
export function Segmented({ parts, tall = false, legend = true, fmt = (v: number) => v + '%' }: { parts: { label: string; value: number; color: string; note?: string }[]; tall?: boolean; legend?: boolean; fmt?: (v: number) => string }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  return (
    <div className="space-y-3">
      <div className={'bar-grow flex gap-0.5 overflow-hidden rounded-xl ' + (tall ? 'h-14' : 'h-3 rounded-full')} role="img" aria-label={parts.map((p) => `${p.label} ${fmt(p.value)}`).join(', ')}>
        {parts.map((p) => (
          <div key={p.label} title={`${p.label}: ${fmt(p.value)}`} className="flex items-center justify-center overflow-hidden whitespace-nowrap text-xs font-medium text-white transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: (p.value / total) * 100 + '%', background: p.color }}>
            {tall && (p.value / total) > 0.14 ? fmt(p.value) : null}
          </div>
        ))}
      </div>
      {legend && <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {parts.map((p) => <li key={p.label} className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: p.color }} />{p.label}{p.note && <span className="tabular-nums text-muted-foreground">{p.note}</span>}<span className="font-medium tabular-nums">{fmt(p.value)}</span></li>)}
      </ul>}
    </div>
  );
}

/* ───────── heatmap: one hue, light → dark; every cell has a tooltip ───────── */
export function Heatmap({ rows, cols, values, unit = 'orders' }: { rows: string[]; cols: string[]; values: number[][]; unit?: string }) {
  const max = Math.max(...values.flat());
  return (
    <div className="space-y-3">
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `2.5rem repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span />
        {cols.map((c) => <span key={c} className="pb-1 text-center text-xs text-muted-foreground">{c}</span>)}
        {rows.map((r, i) => (
          <React.Fragment key={r}>
            <span className="pr-2 text-right text-xs leading-7 text-muted-foreground">{r}</span>
            {values[i].map((v, j) => (
              <div key={j} title={`${r} ${cols[j]}: ${v} ${unit}`} className="fade-in h-7 rounded-[5px] transition-opacity hover:opacity-80" style={{ animationDelay: (i + j) * 35 + 'ms', background: `color-mix(in srgb, var(--viz-1) ${Math.round(6 + (v / max) * 88)}%, var(--surface-raised))` }} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">Fewer
        {[8, 28, 50, 72, 94].map((p) => <span key={p} className="size-3.5 rounded-[4px]" style={{ background: `color-mix(in srgb, var(--viz-1) ${p}%, var(--surface-raised))` }} />)}
        More</div>
    </div>
  );
}

/* ───────── pipeline: stages as bars, flow bands between them, conversion on each band ───────── */
export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const W = 400, H = 140, n = steps.length, bw = 46;
  const gap = (W - bw * n) / (n - 1);
  const max = steps[0].value;
  const geo = steps.map((st, i) => { const h = Math.max(10, (st.value / max) * H); return { x: i * (bw + gap), y: (H - h) / 2, h }; });
  const pct = (x: number) => (x / W) * 100 + '%';
  const shade = (i: number) => `color-mix(in srgb, var(--viz-1) ${100 - i * 20}%, var(--surface-raised))`;
  const overall = Math.round((steps[n - 1].value / max) * 100);
  return (
    <div className="space-y-4">
      <div className="relative" role="img" aria-label={steps.map((st) => `${st.label} ${st.value}`).join(', ')}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-36 w-full">
          {geo.slice(0, -1).map((g, i) => {
            const nx = geo[i + 1];
            return <polygon key={i} points={`${g.x + bw},${g.y} ${nx.x},${nx.y} ${nx.x},${nx.y + nx.h} ${g.x + bw},${g.y + g.h}`} fill="var(--viz-1)" opacity={0.1} className="fade-in" style={{ animationDelay: 300 + i * 90 + 'ms' }} />;
          })}
          {geo.map((g, i) => <rect key={i} x={g.x} y={g.y} width={bw} height={g.h} rx={8} fill={shade(i)} className="funnel-bar" style={{ animationDelay: i * 90 + 'ms' }}><title>{`${steps[i].label}: ${steps[i].value}`}</title></rect>)}
        </svg>
        {geo.slice(0, -1).map((g, i) => (
          <span key={i} className="pop-in absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-card px-1.5 py-0.5 text-xs font-semibold tabular-nums shadow-xs" style={{ left: pct((g.x + bw + geo[i + 1].x) / 2), animationDelay: 500 + i * 90 + 'ms' }}>
            {Math.round((steps[i + 1].value / steps[i].value) * 100)}%
          </span>
        ))}
      </div>
      <div className="relative h-11">
        {geo.map((g, i) => (
          <div key={i} className="absolute top-0 -translate-x-1/2 text-center" style={{ left: pct(g.x + bw / 2) }}>
            <p className="text-lg font-semibold leading-tight tabular-nums">{steps[i].value}</p>
            <p className="whitespace-nowrap text-xs text-muted-foreground">{steps[i].label}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-border pt-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{steps[n - 1].value} of {max}</span> leads paid · {overall}%</p>
    </div>
  );
}

/* ───────── helpers for demo data ───────── */
export function weeks<T extends Record<string, number>>(n: number, f: (i: number) => T): (T & { label: string })[] {
  return Array.from({ length: n }, (_, i) => ({ label: `W${i + 1}`, ...f(i) }));
}
