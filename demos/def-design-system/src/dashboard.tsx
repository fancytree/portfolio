import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ComposedChart, Line, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, AlertTriangle, BadgeEuro, BookCheck, CreditCard, Landmark, Mail, ScrollText, Split, ArrowDownRight, ArrowUpRight, Boxes, Check, ClipboardCheck, Clock, PackageOpen, Store, Zap, Filter, PhoneCall, ReceiptText, Tags, Target, ChevronRight, CircleDollarSign, Download, FileText, ListChecks, Package, Plus, Printer, ScanLine, ShoppingCart, TrendingUp, Truck, UserPlus, Users, Wallet, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePresetToggle } from '@/components/shared/DatePresetToggle';
import { Page } from './page';
import { roles, type Role } from './shell';
import { Num, SlideTabs } from './motion';
import { INCOMING_RECEIPTS, INVOICES_TO_ISSUE, INVOICE_STATUS, OVERDUE, PAYMENT_APPROVALS, PAYMENT_METHOD_RANGES, PAY_COLOR, PRODUCT_RANKING, RECEIPT_STATUS, RUSH_ITEMS, TYPE_COLOR, type RushLine } from './showcase-data';
import { anim, ChartFrame, IconTile, Legend, Tip, Columns, Funnel, Heatmap, HBars, Segmented, TimeChart, compact, eur, viz, vizOther, weeks } from './charts';

/** 每个角色一套首页：同一骨架（左主区 + 右上操作栏，需要处理的事第一屏可见），
 *  主区按角色的工作方式各不相同。图表按 dataviz 规范绘制。 */

/* ───────── shared ───────── */
const spark = (seed: number, n = 14, drift = 0.4) => Array.from({ length: n }, (_, i) => 10 + Math.sin(i / 2 + seed) * 2.2 + Math.cos(i / 3.3 + seed * 2) * 1.2 + i * drift);

/** 趋势线的悬停数值：把示意曲线按比例换算到卡片的真实数值（最后一点 = 当前值），格式跟随卡片数值。 */
function sparkRows(points: number[], value: string, note?: string) {
  const m = value.match(/-?\d[\d,]*(\.\d+)?/);
  const num = m ? Number(m[0].replace(/,/g, '')) : 0;
  const dec = m?.[1] ? m[1].length - 1 : 0;
  const pre = m ? value.slice(0, m.index) : '', post = m ? value.slice((m.index ?? 0) + m[0].length) : '';
  const last = points[points.length - 1];
  // 示意曲线起伏较大，换算时压缩到 ±几个百分点，和卡片上的涨跌幅量级一致
  const at = (v: number) => num * (1 + ((v - last) / last) * 0.25);
  const days = Number(note?.match(/\d+/)?.[0] ?? points.length);
  const step = days / points.length;
  return points.map((v, k) => {
    const back = Math.round((points.length - 1 - k) * step);
    const d = new Date(2026, 10, 17 - back);
    return { k, v, day: k === points.length - 1 ? 'Today' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), shown: pre + at(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post };
  });
}

/** 指标卡：白底，文字用中性色；趋势线统一一个颜色，涨跌才用红绿。 */
function Tile({ label, value, delta, up = true, good = up, points, icon: TileIcon, note, compare = 'vs previous', footnote, action }: { label: string; value: string; delta?: string; up?: boolean; good?: boolean; points?: number[]; icon?: LucideIcon; note?: string; compare?: string; footnote?: string; action?: string }) {
  const c = 'var(--viz-1)';
  const gid = 'tile-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-card px-5 pb-5 pt-5 shadow-card">
      <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
        {TileIcon && <TileIcon className="size-4 shrink-0" />}
        <span className="truncate">{label}{note && <span className="opacity-70"> · {note}</span>}</span>
      </p>
      <p className="mt-1.5 text-[1.625rem] font-semibold leading-tight tracking-tight tabular-nums">{value}</p>
      {points && delta ? (<>
      {/* 趋势线占满中间：渐隐填充，无硬边 */}
      <div className="-mx-1 mt-2 min-h-10 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkRows(points!, value, note)} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
            <Tooltip cursor={false} isAnimationActive={false} offset={12} allowEscapeViewBox={{ x: true, y: true }} wrapperStyle={{ zIndex: 20 }}
              content={({ active, payload }) => active && payload?.length ? <Tip rows={[{ color: c, label: (payload[0].payload as { day: string }).day, value: (payload[0].payload as { shown: string }).shown }]} /> : null} />
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity={0.22} /><stop offset="100%" stopColor={c} stopOpacity={0} /></linearGradient></defs>
            <Area type="monotone" dataKey="v" stroke={`color-mix(in srgb, ${c} 80%, var(--foreground))`} strokeWidth={1.75} fill={`url(#${gid})`} dot={false} {...anim} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={'inline-flex h-6 shrink-0 items-center gap-0.5 rounded-md bg-muted px-2 font-semibold tabular-nums ' + (good ? 'text-success-text' : 'text-destructive')}><Icon className="size-3.5" />{delta!.replace(/^[+-]/, '')}</span>
        <span className="truncate">{compare}</span>
      </p>
      </>) : (
        <>
          <p className="mt-1 text-xs text-muted-foreground">{footnote}</p>
          {action && <button type="button" className="group mt-auto inline-flex w-fit items-center gap-1 pt-4 text-sm font-semibold text-primary-strong">{action}<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></button>}
        </>
      )}
    </div>
  );
}

/** 图表下方的总结小卡片：灰底、小标签、数值、涨跌。 */
function Kpi({ label, value, unit, delta, good = true }: { label: string; value: string; unit?: string; delta: string; good?: boolean }) {
  const Icon = delta.startsWith('-') ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="px-5 first:pl-0 last:pr-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold tracking-tight tabular-nums">{value}</span>
        <span className={'inline-flex items-center gap-0.5 text-xs font-medium ' + (good ? 'text-success-text' : 'text-destructive')}><Icon className="size-3" />{delta.replace(/^[+-]/, '')}</span>
      </p>
      {unit && <p className="text-xs text-muted-foreground">{unit.replace(/^ · /, '')}</p>}
    </div>
  );
}

function QuickTiles({ items, className = '' }: { items: [string, LucideIcon][]; className?: string }) {
  return (
    <div className={'grid auto-rows-fr grid-cols-2 gap-4 ' + className}>
      {items.map(([l, I]) => <button key={l} type="button" className="flex min-h-20 flex-col items-start justify-between gap-2 rounded-xl bg-card p-3.5 text-left text-sm font-medium shadow-card transition-colors hover:bg-surface-hover"><span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary"><I className="size-4" /></span>{l}</button>)}
    </div>
  );
}

function Initials({ text }: { text: string }) {
  return <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground">{text}</span>;
}

/** 统一骨架：左主区；右侧操作栏贴顶，所有角色同一位置。 */
function RoleLayout({ main, rail }: { main: React.ReactNode; rail: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_19rem] items-start gap-5">
      <div className="min-w-0 space-y-5">{main}</div>
      <aside aria-label="Needs your action" className="space-y-5">{rail}</aside>
    </div>
  );
}

/* ───────── ADMIN · whole-business command view ───────── */
type Period = '7d' | '30d' | '90d';
const DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };
const PERIOD_LABEL: Record<Period, string> = { '7d': 'last 7 days', '30d': 'last 30 days', '90d': 'last 90 days' };
const PERIOD_OPTIONS = [{ id: '7d' as Period, label: '7 days' }, { id: '30d' as Period, label: '30 days' }, { id: '90d' as Period, label: '90 days' }];
const fmtDay = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
/** 柱状图分桶：7 天按天，30 / 90 天按周（标签为该周第一天）。 */
function buckets(p: Period) {
  const daily = p === '7d';
  const n = daily ? 7 : p === '30d' ? 5 : 13;
  const labels = Array.from({ length: n }, (_, i) => fmtDay(new Date(2026, 10, 17 - (n - 1 - i) * (daily ? 1 : 7))));
  return { labels, daily, scale: daily ? 1 / 7 : 1, unit: daily ? 'Daily' : 'Weekly' };
}
/** 指标卡：随时间范围变化的数值（演示数据） */
const ADMIN_METRICS: Record<Period, { orders: string; ordersD: string; aov: string; aovD: string; margin: string; marginD: string; marginUp: boolean }> = {
  '7d': { orders: '97', ordersD: '+6.1%', aov: '€188.10', aovD: '+1.4%', margin: '38.6%', marginD: '+0.2 pt', marginUp: true },
  '30d': { orders: '412', ordersD: '+8.4%', aov: '€186.40', aovD: '+2.1%', margin: '38.2%', marginD: '-0.6 pt', marginUp: false },
  '90d': { orders: '1,186', ordersD: '+11.2%', aov: '€183.90', aovD: '+3.0%', margin: '37.9%', marginD: '-0.9 pt', marginUp: false },
};
function series(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const base = 9200 + i * (n > 30 ? 55 : 120) + Math.sin(i / 2.4) * 1500 + Math.cos(i / 5.1) * 800;
    const d = new Date(2026, 10, 17 - (n - 1 - i));
    return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), net: Math.round(base), prev: Math.round(base * (0.82 + Math.sin(i / 3.3) * 0.05)) };
  });
}
function channelData(p: Period) {
  const { labels, scale } = buckets(p);
  return labels.map((label, i) => ({ label, wechat: Math.round((3200 + i * 160 + Math.sin(i) * 300) * scale), walkin: Math.round((2100 + Math.cos(i / 2) * 260 + i * 70) * scale), referral: Math.round((1300 + i * 90 + Math.sin(i * 1.7) * 160) * scale), other: Math.round((620 + Math.cos(i) * 110) * scale) }));
}
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
const orderHeat30 = days.map((_, r) => hours.map((_, c) => Math.max(1, Math.round(5 + Math.sin(c / 1.6 + r) * 4 + (c > 1 && c < 5 ? 6 : 0) + (r === 5 ? -4 : 0) + (c === 9 ? -3 : 0)))));
const img = (i: number) => PRODUCT_RANKING[i % PRODUCT_RANKING.length].image;
const rankings30: { title: string; fmt: (v: number) => string; rows: [string, number][]; images: string[] }[] = [
  { title: 'Top sellers', fmt: (v) => v.toLocaleString('en-US') + ' units', rows: [['Rose Quartz 15ml', 412], ['No-wipe top coat', 366], ['Midnight Plum 15ml', 281], ['Cuticle oil 10ml', 204]], images: [img(0), img(4), img(6), img(5)] },
  { title: 'Top profit', fmt: eur, rows: [['LED lamp 48W', 5120], ['Rose Quartz 15ml', 3290], ['No-wipe top coat', 2760], ['Builder gel 50ml', 1980]], images: [img(1), img(0), img(4), img(3)] },
  { title: 'Most returned', fmt: (v) => v.toLocaleString('en-US') + ' units', rows: [['Peel-off base', 21], ['Glitter set 12', 14], ['Nail file 100/180', 9], ['Cuticle pusher', 6]], images: [img(2), img(7), img(8), img(9)] },
];
const attention = [
  { team: 'Sales', text: '17 orders waiting to ship', tag: 'Today', tone: 'info' as const },
  { team: 'Finance', text: '3 invoices overdue · €2,480', tag: 'Overdue', tone: 'destructive' as const },
  { team: 'Warehouse', text: '4 batches expiring within 30 days', tag: 'Expiry', tone: 'warning' as const },
  { team: 'Procurement', text: 'PO-0319 partially received', tag: 'Partial', tone: 'secondary' as const },
];

/** 左栏小统计（参考 Kinby 的 In / Out / Into goals）：细边框、小标签、数值。 */
function MiniStat({ label, value, delta, good = true, note }: { label: string; value: string; delta?: string; good?: boolean; note?: string }) {
  const Icon = delta?.startsWith('-') ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="rounded-xl border border-border px-3 py-2.5">
      <p className="truncate text-xs text-muted-foreground">{label}{note && <span> · {note}</span>}</p>
      <p className="mt-1 text-base font-semibold tracking-tight tabular-nums">{value}</p>
      {delta && <p className={'inline-flex items-center gap-0.5 text-[11px] font-medium ' + (good ? 'text-success-text' : 'text-destructive')}><Icon className="size-3" />{delta.replace(/^[+-]/, '')}</p>}
    </div>
  );
}
const TEAM_ICON: Record<string, [LucideIcon, string]> = { Sales: [ShoppingCart, 'var(--viz-1)'], Finance: [Wallet, 'var(--viz-2)'], Warehouse: [Boxes, 'var(--viz-5)'], Procurement: [Truck, 'var(--viz-4)'] };

function AdminDashboard({ period }: { period: Period }) {
  const data = useMemo(() => series(DAYS[period]), [period]);
  const m = ADMIN_METRICS[period];
  const f = DAYS[period] / 30;
  const channels = useMemo(() => channelData(period), [period]);
  const ch = buckets(period);
  const orderHeat = orderHeat30.map((r) => r.map((v) => Math.max(0, Math.round(v * f))));
  const rankings = rankings30.map((r) => ({ ...r, rows: r.rows.map(([n, v]) => [n, Math.max(1, Math.round(v * f))] as [string, number]) }));
  const total = data.reduce((s, d) => s + d.net, 0);
  const prev = data.reduce((s, d) => s + d.prev, 0);
  const change = ((total - prev) / prev) * 100;
  const refundRate = (i: number) => 0.035 + Math.abs(Math.sin(i * 1.73)) * 0.02;
  const refunds = data.reduce((s, d, i) => s + d.net * refundRate(i), 0);
  const prevRefunds = data.reduce((s, d, i) => s + d.prev * refundRate(i + 3), 0);
  const gross = total + refunds, prevGross = prev + prevRefunds;
  const best = data.reduce((mx, d) => (d.net > mx.net ? d : mx), data[0]);
  const pct = (a: number, b: number) => `${a >= b ? '+' : '-'}${Math.abs(((a - b) / b) * 100).toFixed(1)}%`;
  const refundsUp = refunds > prevRefunds;
  const topReturn = rankings[2].rows[0];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_19rem] gap-5">
        <div className="grid min-w-0 grid-cols-4 gap-5">
          <Tile icon={Wallet} label="Avg. order value" value={m.aov} delta={m.aovD} points={spark(3, 14, 0.2)} />
          <Tile icon={CircleDollarSign} label="Gross margin" value={m.margin} delta={m.marginD} up={m.marginUp} points={spark(4, 14, m.marginUp ? 0.15 : -0.15)} />
          <Tile icon={ShoppingCart} label="Orders" note={DAYS[period] + ' days'} value={m.orders} delta={m.ordersD} points={spark(2)} />
          <Tile icon={TrendingUp} label="Net sales" note={DAYS[period] + ' days'} value={eur(total)} delta={`+${change.toFixed(1)}%`} points={spark(1)} />
        </div>
        <QuickTiles items={[['Customer', Users], ['Order', ShoppingCart], ['Product', Package], ['Payment', CircleDollarSign]]} />
        <ChartFrame
          className="min-w-0"
          icon={TrendingUp}
          title="Net sales" subtitle="All channels, excluding refunds"
          table={{ cols: ['Day', 'This period', 'Previous'], rows: data.map((d) => [d.label, eur(d.net), eur(d.prev)]) }}
        >
          <div className="grid grid-cols-[17rem_minmax(0,1fr)] gap-8">
            <div className="flex flex-col">
              <p className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums"><Num value={eur(total)} /></p>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold text-success-text" style={{ background: 'color-mix(in srgb, var(--success) 12%, var(--surface-raised))' }}><TrendingUp className="size-3.5" />+{change.toFixed(1)}%</span>
                vs previous {DAYS[period]} days
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <MiniStat label="Gross sales" value={eur(gross)} delta={pct(gross, prevGross)} />
                <MiniStat label="Refunds" value={eur(refunds)} delta={pct(refunds, prevRefunds)} good={!refundsUp} />
                <MiniStat label="Daily average" value={eur(total / data.length)} delta={pct(total, prev)} />
                <MiniStat label="Best day" note={best.label} value={eur(best.net)} delta={pct(best.net, best.prev)} />
              </div>
              <div className="mt-2.5 flex gap-3 rounded-xl p-3" style={{ background: `color-mix(in srgb, var(--${refundsUp ? 'warning' : 'success'}) 10%, var(--surface-raised))` }}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card" style={{ color: `var(--${refundsUp ? 'warning-text' : 'success-text'})` }}>{refundsUp ? <AlertTriangle className="size-4" /> : <Check className="size-4" />}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Refunds {refundsUp ? 'up' : 'down'} {pct(refunds, prevRefunds).replace(/^[+-]/, '')}</p>
                  <p className="text-xs text-muted-foreground">{topReturn[0]} leads with {topReturn[1]} returns</p>
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="mb-2 flex justify-end"><Legend items={[{ label: 'This period', color: viz[0] }, { label: 'Previous period', color: 'var(--data-neutral)' }]} /></div>
              <div className="flex-1"><TimeChart data={data} series={[{ key: 'prev', label: 'Previous period', color: 'var(--data-neutral)', dashed: true }, { key: 'net', label: 'This period', color: viz[0], area: true }]} fmt={(v) => '€' + Math.round(v / 1000) + 'k'} tipFmt={eur} yMax={16000} height={330} /></div>
            </div>
          </div>
        </ChartFrame>
        <Card className="flex flex-col" aria-label="Needs your action">
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3"><IconTile icon={ListChecks} tone="var(--warning)" /><div className="min-w-0"><CardTitle className="text-lg">Across teams</CardTitle><CardDescription>Waiting on someone</CardDescription></div></div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2.5">
            {attention.map((a) => {
              const [TI, tone] = TEAM_ICON[a.team];
              return (
                <button key={a.text} type="button" className="group flex w-full flex-1 items-center gap-3 rounded-xl bg-muted px-3 py-3 text-left transition-colors hover:bg-surface-hover">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card" style={{ color: tone }}><TI className="size-4" /></span>
                  <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">{a.team}</p><p className="text-sm font-medium leading-snug">{a.text}</p></div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <ChartFrame
          icon={Users} tone="var(--viz-1)"
          title="Sales by channel" subtitle={`${ch.unit} net sales, ${PERIOD_LABEL[period]}`}
          legend={[{ label: 'WeChat', color: viz[0] }, { label: 'Walk-in', color: viz[1] }, { label: 'Referral', color: viz[2] }, { label: 'Other', color: vizOther }]}
          table={{ cols: [ch.daily ? 'Day' : 'Week of', 'WeChat', 'Walk-in', 'Referral', 'Other'], rows: channels.map((w) => [w.label, eur(w.wechat), eur(w.walkin), eur(w.referral), eur(w.other)]) }}
        >
          <Columns data={channels} stacked fmt={(v) => (v >= 1000 ? '€' + Math.round(v / 1000) + 'k' : '€' + v)} tipFmt={eur} series={[{ key: 'wechat', label: 'WeChat', color: viz[0] }, { key: 'walkin', label: 'Walk-in', color: viz[1] }, { key: 'referral', label: 'Referral', color: viz[2] }, { key: 'other', label: 'Other', color: vizOther }]} />
        </ChartFrame>
        <ChartFrame icon={TrendingUp} tone="var(--viz-4)" title="When orders come in" subtitle={`Orders by weekday and hour, ${PERIOD_LABEL[period]}`}>
          <Heatmap rows={days} cols={hours} values={orderHeat} />
        </ChartFrame>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {rankings.map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <CardTitle>{r.title}</CardTitle><CardDescription className="first-letter:uppercase">{PERIOD_LABEL[period]}</CardDescription>
              <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
            </CardHeader>
            <CardContent><HBars rows={r.rows} fmt={r.fmt} interactive images={r.images} /></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Customer mix</CardTitle><CardDescription>Share of 760 active customers by type</CardDescription></CardHeader>
        <CardContent>
          <Segmented tall parts={[{ label: 'Nails', value: 46, color: viz[0] }, { label: 'Beauty', value: 22, color: viz[1] }, { label: 'Hair', value: 14, color: viz[2] }, { label: 'Massage', value: 9, color: viz[3] }, { label: 'Wholesale', value: 6, color: viz[4] }, { label: 'Other', value: 3, color: vizOther }]} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── SALES · my target & follow-ups ───────── */
const mtd = Array.from({ length: 17 }, (_, i) => ({ label: `${i + 1} Nov`, actual: Math.round(550 + i * 1560 + Math.sin(i / 1.8) * 700 * (i / 17)), target: Math.round((40000 / 30) * (i + 1)) }));
const followUps = [
  { n: 'Studio Aurora', i: 'SA', note: 'Reorders every 12 days', silent: '19 days' },
  { n: 'Belle Mani', i: 'BM', note: 'Asked about LED lamps', silent: '11 days' },
  { n: 'Nail Atelier Roma', i: 'NR', note: 'Invoice overdue €1,128', silent: '8 days' },
  { n: 'Glow Lab', i: 'GL', note: 'New · first order pending', silent: '5 days' },
];
const toCollect: { n: string; i: string; ref: string; late: number; amount: number }[] = [
  { n: 'Studio Aurora', i: 'SA', ref: 'SO-0794', late: 63, amount: 460 },
  { n: 'Glow Lab', i: 'GL', ref: 'SO-0811', late: 34, amount: 780 },
  { n: 'Casa Cosmetica', i: 'CC', ref: 'SO-0817', late: 27, amount: 1860 },
  { n: 'Studio Forma', i: 'SF', ref: 'SO-0826', late: 18, amount: 940 },
  { n: 'Nail Atelier Roma', i: 'NR', ref: 'SO-0839', late: 12, amount: 1128 },
  { n: 'Bella Roma', i: 'BR', ref: 'SO-0833', late: 6, amount: 520 },
  { n: 'Belle Mani', i: 'BM', ref: 'SO-0840', late: 3, amount: 684 },
  { n: 'Luce Beauty Lab', i: 'LB', ref: 'SO-0842', late: 2, amount: 1036.51 },
];
const myOrders: [string, string, string, 'info' | 'warning' | 'success', string][] = [
  ['SO-0842', 'Luce Beauty Lab', 'Ready to dispatch', 'info', '€1,036.51'],
  ['SO-0841', 'Studio Aurora', 'In review', 'warning', '€216.50'],
  ['SO-0840', 'Belle Mani', 'Dispatched', 'success', '€684.00'],
  ['SO-0838', 'Studio Aurora', 'Ready to dispatch', 'info', '€342.50'],
];
/** 本月目标：进度环、提示框、页头说明都从同一份累计数据算出来，数字前后一致。 */
const SALES_TARGET = 40000, DAY_OF_MONTH = 17, DAYS_IN_MONTH = 30;
const salesAchieved = mtd[mtd.length - 1].actual;
const SALES = {
  achieved: salesAchieved,
  pct: Math.round((salesAchieved / SALES_TARGET) * 100),
  perDay: (SALES_TARGET - salesAchieved) / (DAYS_IN_MONTH - DAY_OF_MONTH),
  projected: (salesAchieved / DAY_OF_MONTH) * DAYS_IN_MONTH,
  daysLeft: DAYS_IN_MONTH - DAY_OF_MONTH,
  pace: (SALES_TARGET / DAYS_IN_MONTH) * DAY_OF_MONTH,
  ahead: 0,
};
SALES.ahead = SALES.achieved - SALES.pace;

/** 目标进度条：实际（实色）+ 预测延伸（浅色，到目标为止）+ 今天应到的位置（刻度）。和右侧图表同一套颜色。 */
function TargetBar() {
  const w = (v: number) => Math.min(100, (v / SALES_TARGET) * 100) + '%';
  return (
    <div>
      <div className="relative h-2.5">
        <div className="absolute inset-0 overflow-hidden rounded-full bg-muted">
          <div className="bar-grow absolute inset-y-0 left-0 rounded-full" style={{ width: w(SALES.projected), background: 'color-mix(in srgb, var(--viz-1) 22%, var(--surface-raised))', animationDelay: '150ms' }} />
          <div className="bar-grow absolute inset-y-0 left-0 rounded-full" style={{ width: w(SALES.achieved), background: 'var(--viz-1)' }} />
        </div>
        <span className="absolute -top-1 bottom-[-4px] w-0.5 -translate-x-1/2 rounded-full bg-foreground/45" style={{ left: w(SALES.pace) }} title={`Target pace today: ${eur(SALES.pace)}`} />
      </div>
      <div className="relative mt-2 h-4 text-xs text-muted-foreground">
        <span className="absolute left-0">€0</span>
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: w(SALES.pace) }}>Pace today</span>
        <span className="absolute right-0">€{SALES_TARGET / 1000}k</span>
      </div>
    </div>
  );
}

function CollectCard() {
  const [sent, setSent] = useState<string[]>([]);
  const total = toCollect.reduce((a, c) => a + c.amount, 0);
  return (
    <div className="h-0 min-h-full">
    <Card className="flex h-full flex-col" aria-label="Needs your action">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3"><IconTile icon={Wallet} tone="var(--destructive-tint)" /><div className="min-w-0"><CardTitle className="text-lg">To collect</CardTitle><CardDescription>Oldest first</CardDescription></div></div>
        <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className="-mr-2 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-2 [scrollbar-width:thin]">
        {toCollect.map((c) => {
          const done = sent.includes(c.n);
          return (
            <div key={c.n} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-xs font-semibold text-muted-foreground">{c.i}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.n}</p>
                <p className={'mt-0.5 truncate text-xs ' + (c.late > 30 ? 'font-medium text-destructive' : 'text-muted-foreground')}>{c.late} days late</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold tabular-nums">{eur(c.amount)}</span>
                <button type="button" disabled={done} onClick={() => setSent((s) => [...s, c.n])} className={'rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ' + (done ? 'text-success-text' : 'bg-card text-primary hover:bg-primary/10')}>{done ? 'Sent' : 'Remind'}</button>
              </div>
            </div>
          );
        })}
        </div>
        <p className="mt-3 flex shrink-0 items-baseline justify-between border-t border-border pt-3 text-sm"><span className="text-muted-foreground">{toCollect.length} customers · overdue total</span><span className="font-semibold tabular-nums text-destructive">{eur(total)}</span></p>
      </CardContent>
    </Card>
    </div>
  );
}

/** 本月完整 30 天：今天以前是实际累计；今天以后按当前日均速度预测，区间带随天数放宽。 */
const DAILY_RATE = SALES.achieved / DAY_OF_MONTH;
const HIT_DAY = Math.ceil(SALES_TARGET / DAILY_RATE);
const monthSeries = Array.from({ length: DAYS_IN_MONTH }, (_, k) => {
  const d = k + 1;
  const past = d <= DAY_OF_MONTH;
  const fc = d >= DAY_OF_MONTH ? SALES.achieved + DAILY_RATE * (d - DAY_OF_MONTH) : undefined;
  const spread = fc !== undefined ? ((d - DAY_OF_MONTH) / (DAYS_IN_MONTH - DAY_OF_MONTH)) * 0.12 * fc : 0;
  return {
    label: `${d} Nov`,
    actual: past ? mtd[k].actual : undefined,
    forecast: fc !== undefined ? Math.round(fc) : undefined,
    band: fc !== undefined ? [Math.round(fc - spread), Math.round(fc + spread)] : undefined,
    pace: Math.round((SALES_TARGET / DAYS_IN_MONTH) * d),
  };
});

function TargetChart() {
  const kfmt = (v: number) => '€' + v / 1000 + 'k';
  return (
    <div className="h-[19rem]" role="img" aria-label={`My sales ${eur(SALES.achieved)} so far, forecast ${eur(SALES.projected)} by 30 Nov against a ${eur(SALES_TARGET)} target`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={monthSeries} margin={{ top: 22, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} ticks={['1 Nov', '8 Nov', '15 Nov', '22 Nov', '30 Nov']} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
          <YAxis domain={[0, 50000]} ticks={[0, 10000, 20000, 30000, 40000, 50000]} tickLine={false} axisLine={false} width={44} tickFormatter={kfmt} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
          <Tooltip cursor={{ stroke: 'var(--border)' }} content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const row = payload[0].payload as (typeof monthSeries)[number];
            const rows = [
              row.actual !== undefined && { color: 'var(--viz-1)', label: 'My sales', value: eur(row.actual) },
              row.forecast !== undefined && row.actual === undefined && { color: 'var(--viz-1)', label: 'Forecast', value: eur(row.forecast) },
              { color: 'var(--data-neutral)', label: 'Target pace', value: eur(row.pace) },
            ].filter(Boolean) as { color: string; label: string; value: string }[];
            return <Tip title={label} rows={rows} />;
          }} />
          {/* forecast band */}
          <Area dataKey="band" stroke="none" fill="var(--viz-1)" fillOpacity={0.08} {...anim} connectNulls={false} />
          {/* target pace + target line */}
          <Line dataKey="pace" stroke="var(--data-neutral)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} {...anim} />
          <ReferenceLine y={SALES_TARGET} stroke="var(--foreground)" strokeOpacity={0.35} strokeDasharray="2 3" label={{ value: `Target ${kfmt(SALES_TARGET)}`, position: 'insideTopLeft', fontSize: 11, fill: 'var(--muted-foreground)', dy: -14 }} />
          {/* today */}
          <ReferenceLine x={`${DAY_OF_MONTH} Nov`} stroke="var(--foreground)" strokeOpacity={0.25} label={{ value: 'Today', position: 'top', fontSize: 11, fill: 'var(--foreground)', fontWeight: 600 }} />
          {/* actual + forecast */}
          <Area dataKey="actual" type="monotone" stroke="var(--viz-1)" strokeWidth={2.25} fill="var(--viz-1)" fillOpacity={0.1} dot={false} {...anim} connectNulls={false} />
          <Line dataKey="forecast" type="linear" stroke="var(--viz-1)" strokeWidth={2} strokeDasharray="6 5" dot={false} {...anim} connectNulls={false} />
          <ReferenceDot x={`${DAY_OF_MONTH} Nov`} y={SALES.achieved} r={5} fill="var(--viz-1)" stroke="var(--surface-raised)" strokeWidth={2} />
          <ReferenceDot x={`${DAYS_IN_MONTH} Nov`} y={Math.round(SALES.projected)} r={5} fill="var(--surface-raised)" stroke="var(--viz-1)" strokeWidth={2}
            label={{ value: kfmt(Math.round(SALES.projected / 100) * 100), position: 'left', offset: 10, fontSize: 12, fontWeight: 600, fill: 'var(--foreground)' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function SalesDashboard() {
  const onPace = SALES.projected >= SALES_TARGET;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_19rem] gap-5">
        <div className="grid min-w-0 grid-cols-4 gap-5">
          <Tile icon={Truck} label="Orders to ship" value="17" footnote="Waiting to be dispatched" action="Ship now" />
          <Tile icon={Wallet} label="Receivables" value="€84,312.50" footnote="18 open accounts" action="Chase payments" />
          <Tile icon={AlertTriangle} label="Overdue" value="8" footnote="Customers past due" action="See who" />
          <Tile icon={PhoneCall} label="Follow-ups" value="6" footnote="Due today" action="Start calling" />
        </div>
        <QuickTiles items={[['Orders', ListChecks], ['Customer', Users], ['Ledger', ReceiptText], ['New quote', FileText]]} />
        <ChartFrame
          className="min-w-0"
          icon={Target}
          title="November target" subtitle={`${SALES.daysLeft} days left`}
          table={{ cols: ['Day', 'My sales', 'Forecast', 'Target pace'], rows: monthSeries.map((d) => [d.label, d.actual !== undefined ? eur(d.actual) : '—', d.forecast !== undefined && d.actual === undefined ? eur(d.forecast) : '—', eur(d.pace)]) }}
        >
          <div className="grid grid-cols-[17rem_minmax(0,1fr)] gap-8">
            <div className="flex flex-col justify-between gap-5">
              <div>
                <p className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums"><Num value={eur(SALES.achieved)} /></p>
                <p className="mt-2 text-sm text-muted-foreground">of {eur(SALES_TARGET)} target · <span className="font-medium text-foreground">{SALES.pct}%</span></p>
              </div>
              <TargetBar />
              <div className="grid grid-cols-2 gap-2.5">
                <MiniStat label="Ahead of pace" value={(SALES.ahead >= 0 ? '+' : '−') + eur(Math.abs(SALES.ahead))} />
                <MiniStat label="Needed per day" value={eur(SALES.perDay)} />
              </div>
              <div className="flex gap-3 rounded-xl p-3" style={{ background: `color-mix(in srgb, var(--${onPace ? 'success' : 'warning'}) 10%, var(--surface-raised))` }}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card" style={{ color: `var(--${onPace ? 'success-text' : 'warning-text'})` }}>{onPace ? <Check className="size-4" /> : <AlertTriangle className="size-4" />}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{onPace ? `On track · hits target ~${HIT_DAY} Nov` : 'Behind pace'}</p>
                  <p className="text-xs text-muted-foreground">Forecast {eur(SALES.projected)}, {eur(Math.abs(SALES.projected - SALES_TARGET))} {onPace ? 'above' : 'below'} target</p>
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="mb-1 flex justify-end"><Legend items={[{ label: 'My sales', color: viz[0] }, { label: 'Forecast', color: 'color-mix(in srgb, var(--viz-1) 45%, var(--surface-raised))' }, { label: 'Target pace', color: 'var(--data-neutral)' }]} /></div>
              <div className="flex-1"><TargetChart /></div>
            </div>
          </div>
        </ChartFrame>
        <CollectCard />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3"><IconTile icon={PhoneCall} tone="var(--warning)" /><div className="min-w-0"><CardTitle className="text-lg">Follow up</CardTitle><CardDescription>Gone quiet</CardDescription></div></div>
            <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2.5">
            {followUps.map((f) => (
              <button key={f.n} type="button" className="group flex w-full flex-1 items-center gap-3 rounded-xl bg-muted px-3 py-3 text-left transition-colors hover:bg-surface-hover">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-xs font-semibold text-muted-foreground">{f.i}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{f.n}</p><p className="truncate text-xs text-muted-foreground">{f.note}</p></div>
                <span className="shrink-0 text-right text-xs text-muted-foreground"><span className="block text-sm font-semibold text-foreground">{f.silent.replace(' days', 'd')}</span>silent</span>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3"><IconTile icon={Filter} tone="var(--viz-4)" /><div className="min-w-0"><CardTitle className="text-lg">Pipeline</CardTitle><CardDescription>Lead to payment</CardDescription></div></div>
            <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
          </CardHeader>
          <CardContent><Funnel steps={[{ label: 'Leads', value: 64 }, { label: 'Quotes', value: 41 }, { label: 'Orders', value: 29 }, { label: 'Paid', value: 24 }]} /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3"><IconTile icon={Tags} tone="var(--viz-1)" /><div className="min-w-0"><CardTitle className="text-lg">By category</CardTitle><CardDescription>November</CardDescription></div></div>
            <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
          </CardHeader>
          <CardContent><HBars fmt={eur} interactive rows={[['Gel polish', 11200], ['Tools & lamps', 7450], ['Care & oils', 4890], ['Bases & tops', 3800]]} images={[img(0), img(1), img(5), img(4)]} /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex min-w-0 items-center gap-3"><IconTile icon={ShoppingCart} tone="var(--viz-5)" /><div className="min-w-0"><CardTitle className="text-lg">My recent orders</CardTitle><CardDescription>Latest four this week</CardDescription></div></div>
          <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
            <TableBody>{myOrders.map(([id, c, st, t, a]) => <TableRow key={id} interactive><TableCell className="font-medium">{id}</TableCell><TableCell>{c}</TableCell><TableCell><Badge variant={t}>{st}</Badge></TableCell><TableCell className="text-right font-semibold tabular-nums">{a}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────── WAREHOUSE · fulfilment board ───────── */
type Job = { id: string; c: string; units: number; due: string; tone: 'destructive' | 'warning' | 'secondary'; to?: 'pickup' | 'ship'; slot?: string; carrier?: string };
const lanes: { title: string; hint: string; jobs: Job[] }[] = [
  { title: 'To pick', hint: 'Waiting for a picker', jobs: [
    { id: 'SO-0842', c: 'Luce Beauty Lab', units: 87, due: 'Today 14:00', tone: 'destructive' },
    { id: 'SO-0838', c: 'Studio Aurora', units: 42, due: 'Today 17:00', tone: 'warning' },
    { id: 'SO-0836', c: 'Luce Beauty Lab', units: 30, due: 'Tomorrow', tone: 'secondary' },
    { id: 'SO-0834', c: 'Bella Roma', units: 22, due: 'Tomorrow', tone: 'secondary' },
    { id: 'SO-0833', c: 'Casa Cosmetica', units: 64, due: 'Thu 19 Nov', tone: 'secondary' },
    { id: 'SO-0831', c: 'Studio Forma', units: 18, due: 'Thu 19 Nov', tone: 'secondary' } ] },
  { title: 'Packing', hint: 'On the bench now', jobs: [
    { id: 'SO-0841', c: 'Studio Aurora', units: 18, due: 'Today 16:00', tone: 'warning' },
    { id: 'SO-0837', c: 'Belle Mani', units: 24, due: 'Tomorrow', tone: 'secondary' } ] },
  { title: 'Ready to ship', hint: 'Waiting for the courier', jobs: [
    { id: 'SO-0840', c: 'Belle Mani', units: 56, due: 'Courier 15:30', tone: 'secondary' },
    { id: 'SO-0835', c: 'Studio Aurora', units: 36, due: 'Courier 15:30', tone: 'secondary' },
    { id: 'SO-0832', c: 'Glow Lab', units: 40, due: 'Courier 15:30', tone: 'secondary' },
    { id: 'SO-0830', c: 'Nail Atelier Roma', units: 28, due: 'Courier 15:30', tone: 'secondary' } ] },
];
type Stage = 'pack' | 'pickup' | 'ship';
const STAGES: { id: Stage; title: string; hint: string; icon: LucideIcon; status?: string }[] = [
  { id: 'pack', title: 'Packing', hint: 'On the bench now', icon: Package },
  { id: 'pickup', title: 'To pick up', hint: 'Customer collects', icon: Store, status: 'Awaiting pickup' },
  { id: 'ship', title: 'Ready to ship', hint: 'Waiting for the courier', icon: Truck, status: 'Courier 15:30' },
];
const INITIAL_BOARD: Record<Stage, Job[]> = {
  pack: [
    { id: 'SO-0842', c: 'Luce Beauty Lab', units: 87, due: 'Today 14:00', tone: 'destructive', to: 'ship', carrier: 'BRT' },
    { id: 'SO-0841', c: 'Studio Aurora', units: 18, due: 'Today 16:00', tone: 'warning', to: 'pickup', slot: 'Today 16:30' },
    { id: 'SO-0838', c: 'Studio Aurora', units: 42, due: 'Today 17:00', tone: 'warning', to: 'ship', carrier: 'GLS' },
    { id: 'SO-0837', c: 'Belle Mani', units: 24, due: 'Tomorrow', tone: 'secondary', to: 'pickup', slot: 'Tomorrow 10:00' },
    { id: 'SO-0836', c: 'Luce Beauty Lab', units: 30, due: 'Tomorrow', tone: 'secondary', to: 'ship', carrier: 'BRT' },
    { id: 'SO-0834', c: 'Bella Roma', units: 22, due: 'Tomorrow', tone: 'secondary', to: 'ship', carrier: 'Poste Italiane' },
  ],
  pickup: [
    { id: 'SO-0833', c: 'Casa Cosmetica', units: 64, due: '', tone: 'secondary', slot: 'Today 15:00' },
    { id: 'SO-0831', c: 'Studio Forma', units: 18, due: '', tone: 'secondary', slot: 'Today 17:30' },
  ],
  ship: [
    { id: 'SO-0840', c: 'Belle Mani', units: 56, due: '', tone: 'secondary', carrier: 'BRT' },
    { id: 'SO-0835', c: 'Studio Aurora', units: 36, due: '', tone: 'secondary', carrier: 'BRT' },
    { id: 'SO-0828', c: 'Casa Cosmetica', units: 48, due: '', tone: 'secondary', carrier: 'BRT' },
    { id: 'SO-0832', c: 'Glow Lab', units: 40, due: '', tone: 'secondary', carrier: 'GLS' },
    { id: 'SO-0830', c: 'Nail Atelier Roma', units: 28, due: '', tone: 'secondary', carrier: 'GLS' },
    { id: 'SO-0826', c: 'Vita Beauty', units: 16, due: '', tone: 'secondary', carrier: 'Poste Italiane' },
  ],
};
const throughput = ['8', '9', '10', '11', '12', '13', '14', '15', '16'].map((h, i) => ({ label: h + ':00', picked: Math.round(24 + Math.sin(i / 1.4) * 10 + (i > 1 && i < 5 ? 14 : 0)), shipped: Math.round(16 + Math.cos(i / 1.6) * 7 + (i > 3 ? 10 : 0)) }));
const expiring: [string, string, number, number][] = [['Builder gel 50ml', 'B-2209', 9, 140], ['Cuticle oil 10ml', 'B-2231', 17, 64], ['Peel-off base', 'B-2254', 24, 88], ['Rose Quartz 15ml', 'B-2260', 29, 210]];
const incoming: [string, string, number, string][] = [['PO-0319', 'Nailpro Srl', 40, 'Partial · 18 in'], ['PO-0322', 'Gelline Italia', 120, 'Arrives today'], ['PO-0324', 'Studio Supply', 60, 'Tomorrow']];
function qtyLabel(items: RushLine[]) {
  const t = { SC: 0, CF: 0 };
  items.forEach((i) => { t[i.unit] += i.qty; });
  return (['SC', 'CF'] as const).filter((u) => t[u]).map((u) => `${t[u]} ${u}`).join(' · ');
}
/** 门店急单：要从仓库拿到店面的货。多选后点 Done 移出列表。 */
function StoreRun({ rows, setRows }: { rows: RushLine[]; setRows: (f: (r: RushLine[]) => RushLine[]) => void }) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const picked = rows.filter((r) => sel.has(r.id));
  const all = rows.length > 0 && sel.size === rows.length;
  const toggle = (id: string) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div className="flex h-[26rem] flex-col gap-3">
      <div className="flex shrink-0 items-center gap-3 rounded-xl bg-muted px-3.5 py-2.5">
        <Checkbox checked={all ? true : sel.size ? 'indeterminate' : false} onCheckedChange={(c) => setSel(c === true ? new Set(rows.map((r) => r.id)) : new Set())} disabled={!rows.length} aria-label={all ? 'Deselect all' : 'Select all'} />
        <p className="min-w-0 flex-1 truncate text-sm font-medium tabular-nums">{picked.length ? `${picked.length} selected · ${qtyLabel(picked)}` : `${rows.length} items · ${qtyLabel(rows)}`}</p>
        <Button disabled={!picked.length} onClick={() => { setRows((p) => p.filter((r) => !sel.has(r.id))); setSel(new Set()); }}>Done</Button>
      </div>
      <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-width:thin]">
        {rows.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">Nothing left to take to the store.</p> : (
          <div className="grid grid-cols-3 gap-3">
            {rows.map((r) => {
              const on = sel.has(r.id);
              return (
                <div key={r.id} role="checkbox" aria-checked={on} tabIndex={0} onClick={() => toggle(r.id)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(r.id); } }}
                  className={'flex cursor-pointer gap-3 rounded-xl p-2.5 transition-colors ' + (on ? 'bg-primary/10 ring-2 ring-inset ring-primary' : 'bg-muted hover:bg-surface-hover')}>
                  <img src={r.image} alt="" loading="lazy" className="size-16 shrink-0 rounded-lg object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.name}</p><p className="truncate text-xs text-muted-foreground">{r.spec}</p></div>
                      <Checkbox checked={on} onCheckedChange={() => toggle(r.id)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${r.name}`} />
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-1.5 text-sm font-semibold tabular-nums"><span className="rounded-md bg-card px-1.5 text-xs leading-5">{r.location}</span><span>{r.qty} {r.unit}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button type="button" className="group -mb-2 -mt-1 inline-flex h-7 w-full shrink-0 items-center justify-center gap-1 rounded-md text-sm font-medium text-primary transition-colors hover:bg-muted">
        All {rows.length} store items<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/** 库存健康：主数字是有问题的 SKU；每类一行，只展示状态。补货、清货由采购决定，仓库这里不放操作。 */
const STOCK = { total: 1284, rows: [
  { key: 'low', label: 'Low stock', n: 154, color: 'var(--viz-2)', issue: true },
  { key: 'exp', label: 'Expiring', n: 77, color: 'var(--viz-4)', issue: true },
  { key: 'out', label: 'Out of stock', n: 51, color: 'var(--destructive-tint)', issue: true },
  { key: 'ok', label: 'Healthy', n: 1002, color: 'var(--viz-5)', issue: false },
] };
function StockHealthCard() {
  const issues = STOCK.rows.filter((r) => r.issue);
  const attention = issues.reduce((a, r) => a + r.n, 0);
  const pct = (n: number) => Math.round((n / STOCK.total) * 100);
  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3"><IconTile icon={Package} tone="var(--viz-5)" /><div className="min-w-0"><CardTitle className="text-lg">Stock health</CardTitle><CardDescription>{STOCK.total.toLocaleString('en-US')} SKUs</CardDescription></div></div>
        <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="flex items-baseline gap-2"><span className="text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">{attention}</span><span className="text-sm text-muted-foreground">SKUs flagged · {pct(attention)}%</span></p>
          <div className="bar-grow mt-3 flex h-2.5 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={STOCK.rows.map((r) => `${r.label} ${pct(r.n)}%`).join(', ')}>
            {STOCK.rows.map((r) => <div key={r.key} title={`${r.label}: ${r.n}`} style={{ width: (r.n / STOCK.total) * 100 + '%', background: r.color }} />)}
          </div>
        </div>
        <ul className="divide-y divide-border/70">
          {STOCK.rows.map((r) => (
            <li key={r.key} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
              <span className={'min-w-0 flex-1 truncate ' + (r.issue ? 'font-medium' : 'text-muted-foreground')}>{r.label}</span>
              <span className={'shrink-0 tabular-nums ' + (r.issue ? 'font-semibold' : 'text-muted-foreground')}>{r.n.toLocaleString('en-US')}</span>
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{pct(r.n)}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function IncomingCard() {
  const [done, setDone] = useState<string[]>([]);
  const waiting = INCOMING_RECEIPTS.length - done.length;
  return (
    <div className="min-h-0 flex-1">
      <Card className="flex h-full flex-col" aria-label="Needs your action">
        <CardHeader>
          <div className="flex min-w-0 items-center gap-3"><IconTile icon={PackageOpen} tone="var(--viz-1)" /><div className="min-w-0"><CardTitle className="text-lg">Incoming</CardTitle><CardDescription>{waiting} to confirm</CardDescription></div></div>
          <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col">
          <div className="-mr-2 min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-2 [scrollbar-width:thin]">
            {INCOMING_RECEIPTS.map((r) => {
              const ok = done.includes(r.no);
              const st = RECEIPT_STATUS[r.status];
              return (
                <div key={r.no} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.supplier}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.no} · {r.qty}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {ok ? <Badge variant="success"><Check />Confirmed</Badge> : <Badge variant={st.tone}>{st.label}</Badge>}
                    {!ok && <button type="button" onClick={() => setDone((d) => [...d, r.no])} className="rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">Confirm</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WarehouseDashboard() {

  const [view, setView] = useState<'store' | 'pack'>('store');
  const [rush, setRush] = useState(RUSH_ITEMS);
  const [board, setBoard] = useState<Record<Stage, Job[]>>(INITIAL_BOARD);
  const inFlight = board.pack.length + board.pickup.length + board.ship.length;
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const toggleJob = (id: string) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  /** 打包完成：按订单自带的配送方式自动进入「自提」或「待发快递」。 */
  const boardRef = useRef<HTMLDivElement>(null);
  type Box = { left: number; top: number; width: number; height: number };
  const flip = useRef<{ rects: Map<string, Box>; moving: string[] } | null>(null);
  /** 位置一律相对看板本身记录，页面滚动不会让起点和终点错位。 */
  const boxesInBoard = () => {
    const rects = new Map<string, Box>();
    const root = boardRef.current;
    if (!root) return rects;
    const base = root.getBoundingClientRect();
    root.querySelectorAll<HTMLElement>('[data-job]').forEach((el) => {
      const r = el.getBoundingClientRect();
      rects.set(el.dataset.job!, { left: r.left - base.left, top: r.top - base.top, width: r.width, height: r.height });
    });
    return rects;
  };
  const markPacked = (ids: string[]) => {
    flip.current = { rects: boxesInBoard(), moving: ids };
    setBoard((b) => {
      const moving = b.pack.filter((j) => ids.includes(j.id));
      return {
        pack: b.pack.filter((j) => !ids.includes(j.id)),
        pickup: [...moving.filter((j) => j.to === 'pickup'), ...b.pickup],
        ship: [...moving.filter((j) => j.to !== 'pickup'), ...b.ship],
      };
    });
    setPicked((p) => { const n = new Set(p); ids.forEach((i) => n.delete(i)); return n; });
  };
  const [doneToday, setDoneToday] = useState<Record<'pickup' | 'ship', number>>({ pickup: 0, ship: 0 });
  /** 取货 / 发货完成：卡片向右滑出淡出，再从看板移除，其余卡片平滑上移。 */
  const complete = (lane: 'pickup' | 'ship', ids: string[]) => {
    const els = ids.map((id) => boardRef.current?.querySelector<HTMLElement>(`[data-job="${id}"]`)).filter(Boolean) as HTMLElement[];
    const finish = () => {
      flip.current = { rects: boxesInBoard(), moving: [] };
      setBoard((b) => ({ ...b, [lane]: b[lane].filter((j) => !ids.includes(j.id)) }));
      setPicked((p) => { const n = new Set(p); ids.forEach((i) => n.delete(i)); return n; });
      setDoneToday((d) => ({ ...d, [lane]: d[lane] + ids.length }));
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !els.length) { finish(); return; }
    let done = false;
    const once = () => { if (!done) { done = true; finish(); } };
    els.forEach((el, i) => {
      const a = el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(28px)' }], { duration: 280, delay: i * 40, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
      if (i === els.length - 1) a.onfinish = once;
    });
    window.setTimeout(once, 280 + els.length * 40 + 150);
  };
  /** 打包完成的卡片从 Packing 飞到目标列（用浮层副本，避免被各列的滚动区裁切）；其余卡片平滑补位。 */
  useLayoutEffect(() => {
    const f = flip.current;
    flip.current = null;
    if (!f || !boardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const root = boardRef.current;
    const now = boxesInBoard();
    let order = 0;
    root.querySelectorAll<HTMLElement>('[data-job]').forEach((el) => {
      const id = el.dataset.job!;
      const from = f.rects.get(id);
      const to = now.get(id);
      if (!from || !to) return;
      if (f.moving.includes(id)) {
        const delay = order++ * 60;
        const ghost = el.cloneNode(true) as HTMLElement;
        ghost.removeAttribute('data-job');
        Object.assign(ghost.style, { position: 'absolute', margin: '0', left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, zIndex: '20', pointerEvents: 'none', boxShadow: 'var(--elevation-lg)' });
        root.appendChild(ghost);
        el.style.opacity = '0';
        const anim = ghost.animate(
          [{ left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, transform: 'scale(1)' },
           { offset: 0.5, transform: 'scale(1.03)' },
           { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, transform: 'scale(1)' }],
          { duration: 560, delay, easing: ease, fill: 'forwards' });
        let landed = false;
        const land = () => {
          if (landed) return;
          landed = true;
          ghost.remove();
          el.style.opacity = '';
          el.animate([{ boxShadow: '0 0 0 2px var(--success) inset' }, { boxShadow: '0 0 0 2px transparent inset' }], { duration: 800, easing: 'ease-out' });
        };
        anim.onfinish = land;
        // 兜底：标签页在后台时动画不推进，到点也要把卡片落位
        window.setTimeout(land, delay + 560 + 200);
      } else {
        const dx = from.left - to.left, dy = from.top - to.top;
        if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 420, easing: ease });
      }
    });
  }, [board]);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_19rem] gap-5">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3"><IconTile icon={view === 'store' ? Zap : Boxes} tone={view === 'store' ? 'var(--destructive-tint)' : 'var(--viz-5)'} /><div className="min-w-0"><CardTitle className="text-lg">{view === 'store' ? 'Rush to store' : 'Pick & pack'}</CardTitle><CardDescription>{view === 'store' ? 'Take these from the warehouse to the store' : `${inFlight} orders · ${board.ship.length} to ship today`}</CardDescription></div></div>
            <CardAction>
              <SlideTabs label="Board" value={view} onChange={setView}
                items={([['store', 'To store', rush.length], ['pack', 'Pick & pack', inFlight]] as const).map(([id, label, n]) => ({ id, label: <>{label}<span className="text-xs tabular-nums opacity-70">{n}</span></> }))}
                className="flex h-9 items-center gap-0.5 rounded-[10px] border border-border bg-card p-0.5"
                itemClassName="flex h-full items-center gap-1.5 rounded-[7px] px-3 text-sm"
                activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
                indicatorClassName="rounded-[7px] bg-primary/10" />
            </CardAction>
          </CardHeader>
          <CardContent>
            {view === 'store' ? <StoreRun rows={rush} setRows={setRush} /> : (
              <div ref={boardRef} className="relative grid h-[26rem] grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-3">
                {STAGES.map((st, si) => {
                  const jobs = board[st.id];
                  const sel = jobs.filter((j) => picked.has(j.id)).map((j) => j.id);
                  const SI = st.icon;
                  const lane = (
                    <section key={st.id} className="flex min-h-0 flex-col rounded-xl bg-muted p-3">
                      <header className="flex shrink-0 items-center justify-between gap-2 px-1 pb-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-card text-muted-foreground"><SI className="size-3.5" /></span>
                          <div className="min-w-0"><h3 className="truncate text-sm font-semibold">{st.title}</h3>
                            <p className={'truncate text-xs ' + (st.id !== 'pack' && doneToday[st.id] ? 'font-medium text-success-text' : 'text-muted-foreground')}>{st.id !== 'pack' && doneToday[st.id] ? `${doneToday[st.id]} ${st.id === 'pickup' ? 'collected' : 'shipped'} today` : st.hint}</p></div>
                        </div>
                        <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-lg bg-card px-2 text-sm font-semibold tabular-nums">{jobs.length}</span>
                      </header>
                      <div className="-mr-1.5 min-h-0 flex-1 space-y-2 overflow-y-auto pb-0.5 pr-1.5 [scrollbar-width:thin]">
                        {(() => {
                        const renderJob = (j: Job) => {
                          const on = picked.has(j.id);
                          const next = st.id === 'ship' ? null
                            : (st.id === 'pickup' || j.to === 'pickup')
                              ? <Badge variant="success"><Store />{j.slot}</Badge>
                              : <Badge variant="info"><Truck />{j.carrier}</Badge>;
                          return (
                            <article key={j.id} data-job={j.id} onClick={() => toggleJob(j.id)}
                              className={'cursor-pointer rounded-lg bg-card shadow-xs transition-shadow hover:shadow-card ' + (st.id === 'ship' ? 'px-3 py-2.5 ' : 'p-3 ') + (on ? 'ring-2 ring-inset ring-primary' : '')}>
                              <div className="flex items-center gap-2.5">
                                <Checkbox checked={on} onCheckedChange={() => toggleJob(j.id)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${j.id}`} />
                                <p className="min-w-0 flex-1 truncate text-sm font-semibold tabular-nums">{j.id}</p>
                                {st.id === 'ship' && <p className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"><span className="text-sm font-semibold tabular-nums text-foreground">{j.units}</span> units</p>}
                              </div>
                              <p className="mt-1 truncate pl-[1.625rem] text-sm text-muted-foreground">{j.c}</p>
                              {next && (
                                <div className="mt-2 flex items-center justify-between gap-2 pl-[1.625rem]">
                                  <p className="whitespace-nowrap text-xs text-muted-foreground"><span className="text-sm font-semibold tabular-nums text-foreground">{j.units}</span> units</p>
                                  {next}
                                </div>
                              )}
                            </article>
                          );
                        };
                        if (st.id !== 'ship') return jobs.map(renderJob);
                        // 待发快递按快递公司分组：组标题吸顶，可整组勾选
                        const groups = [...new Set(jobs.map((j) => j.carrier ?? 'Other'))].sort();
                        return groups.map((g) => {
                          const gj = jobs.filter((j) => (j.carrier ?? 'Other') === g);
                          const n = gj.filter((j) => picked.has(j.id)).length;
                          return (
                            <div key={g} className="space-y-2">
                              <div className="sticky top-0 z-10 -mx-0.5 flex items-center gap-2 bg-muted px-1 pb-1 pt-1.5">
                                <Checkbox checked={n === gj.length ? true : n ? 'indeterminate' : false} aria-label={`Select all ${g}`}
                                  onCheckedChange={(c) => setPicked((p) => { const s2 = new Set(p); gj.forEach((j) => (c === true ? s2.add(j.id) : s2.delete(j.id))); return s2; })} />
                                <Truck className="size-3.5 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate text-xs font-semibold">{g}</span>
                                <span className="text-xs tabular-nums text-muted-foreground">{gj.length}</span>
                              </div>
                              {gj.map(renderJob)}
                            </div>
                          );
                        });
                        })()}
                        {jobs.length === 0 && <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground">{st.id === 'pack' ? 'Bench is clear' : 'Nothing here yet'}</p>}
                      </div>
                      {sel.length > 0 ? (
                        <Button className="-mb-1 mt-2 w-full shrink-0" onClick={() => (st.id === 'pack' ? markPacked(sel) : complete(st.id, sel))}>
                          <Check />Mark {sel.length} {st.id === 'pack' ? 'packed' : st.id === 'pickup' ? 'picked up' : 'shipped'}
                        </Button>
                      ) : (
                        <button type="button" className="group -mb-1 mt-1 inline-flex h-7 w-full shrink-0 items-center justify-center gap-1 rounded-md text-sm font-medium text-primary transition-colors hover:bg-card">
                          All {jobs.length} {st.id === 'pack' ? 'packing' : st.id === 'pickup' ? 'pickups' : 'shipments'}<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      )}
                    </section>
                  );
                  return si === 0 ? [lane, <div key="arrow" className="flex items-center justify-center" aria-hidden><span className="grid size-8 place-items-center rounded-full bg-card text-muted-foreground shadow-xs" title="Routed by delivery method"><Split className="size-4 rotate-90" /></span></div>] : lane;
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <aside className="flex h-0 min-h-full flex-col gap-5">
          <QuickTiles items={[['Receive', PackageOpen], ['Count', ClipboardCheck], ['Ship', ShoppingCart], ['Stock', Package]]} />
          <IncomingCard />
        </aside>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <ChartFrame
          icon={Activity} tone="var(--viz-1)"
          title="Throughput" subtitle="Units per hour, today"
          legend={[{ label: 'Picked', color: viz[0] }, { label: 'Shipped', color: viz[1] }]}
          table={{ cols: ['Hour', 'Picked', 'Shipped'], rows: throughput.map((t) => [t.label, t.picked, t.shipped]) }}
        >
          <Columns data={throughput} series={[{ key: 'picked', label: 'Picked', color: viz[0] }, { key: 'shipped', label: 'Shipped', color: viz[1] }]} />
        </ChartFrame>
        <StockHealthCard />
        <Card>
          <CardHeader>
            <div className="flex min-w-0 items-center gap-3"><IconTile icon={Clock} tone="var(--warning)" /><div className="min-w-0"><CardTitle className="text-lg">Expiring soon</CardTitle><CardDescription>Move these first</CardDescription></div></div>
            <CardAction><Button variant="ghost" size="sm" className="-mr-3 text-primary">View all<ChevronRight /></Button></CardAction>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {expiring.map(([n, b, d, q]) => (
              <div key={b} className="space-y-1.5" title={`${n} · ${d} days left`}>
                <div className="flex items-baseline justify-between gap-3 text-sm"><span className="truncate font-medium">{n}</span><span className={'shrink-0 tabular-nums ' + (d < 14 ? 'font-semibold text-destructive' : '')}>{d} days</span></div>
                <div className="h-1.5 rounded-full bg-muted"><div className="bar-grow h-full rounded-full" style={{ width: 100 - (d / 30) * 100 + '%', background: d < 14 ? 'var(--destructive)' : 'var(--warning)' }} /></div>
                <p className="text-xs text-muted-foreground">{b} · {q} units</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ───────── FINANCE · cash & receivables ───────── */
const METHOD_SHARES: Record<Period, number[]> = { '7d': [48, 19, 12, 11, 10], '30d': [52, 21, 15, 8, 4], '90d': [50, 15, 12, 10, 13] };
const methodsFor = (p: Period) => ['Bank transfer', 'Cash', 'Card', 'WeChat Pay', 'Other'].map((label, i) => ({ label, value: METHOD_SHARES[p][i], color: i < 4 ? viz[i] : vizOther }));
const RECEIVED: Record<Period, [string, string]> = { '7d': ['€14,920', '+6.8%'], '30d': ['€61,880', '+12.4%'], '90d': ['€176,300', '+9.1%'] };
const review: [string, string, string][] = [['Luce Beauty Lab', 'Bank transfer · ref 8841', '€1,036.51'], ['Belle Mani', 'Cash · counter', '€684.00'], ['Studio Aurora', 'Bank transfer · ref 8838', '€216.50']];
const overdue: [string, string, string][] = [['Nail Atelier Roma', 'SO-0839 · 12 days late', '€1,128.00'], ['Glow Lab', 'SO-0811 · 34 days late', '€780.00'], ['Studio Aurora', 'SO-0794 · 63 days late', '€460.00']];
const kpisFor = (p: Period): [string, string, string, boolean][] => [['Received', RECEIVED[p][0], RECEIVED[p][1], true], ['Outstanding receivables', '€18,420', '-3.1%', true], ['Overdue', '€2,480', '+€640', false]];
function cashFor(p: Period) {
  const { labels, scale } = buckets(p);
  return labels.map((label, i) => ({ label, invoiced: Math.round((12500 + i * 380 + Math.sin(i * 1.3) * 1800) * scale), received: Math.round((11200 + i * 420 + Math.cos(i * 1.1) * 1900) * scale) }));
}
function dsoFor(p: Period) {
  return buckets(p).labels.map((label, i) => ({ label, dso: Math.round((41 - i * 0.7 + Math.sin(i * 1.2) * 2.2) * 10) / 10 }));
}
const EXPENSES: Record<Period, string> = { '7d': '€740', '30d': '€3,120', '90d': '€9,480' };
const PERIOD_RANGE: Record<Period, '7D' | '1M' | '3M'> = { '7d': '7D', '30d': '1M', '90d': '3M' };
const METHOD_ICON: Record<string, LucideIcon> = { 'Bank transfer': Landmark, Check: BookCheck, 'Post office': Mail };
const euro = (v: string) => Number(v.replace(/[^0-9.]/g, ''));

/** 列表底部：有选中时是批量操作，没有时是去完整列表的入口。 */
function ListFooter({ selected, action, onAction, link }: { selected: number; action: string; onAction: () => void; link: string }) {
  return selected > 0
    ? <Button className="mt-3 w-full shrink-0" onClick={onAction}><Check />{action}</Button>
    : <button type="button" className="group mt-2 inline-flex h-8 w-full shrink-0 items-center justify-center gap-1 rounded-lg text-sm font-medium text-primary transition-colors hover:bg-muted">{link}<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></button>;
}
function useSelection() {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return { sel, toggle, clear: () => setSel(new Set()) };
}

function ApprovalsCard() {
  const [rows, setRows] = useState(PAYMENT_APPROVALS);
  const { sel, toggle, clear } = useSelection();
  const ids = rows.filter((r) => sel.has(r.name + r.time)).map((r) => r.name + r.time);
  const total = rows.reduce((a, r) => a + euro(r.amount), 0);
  return (
    <div className="h-0 min-h-full">
      <Card className="flex h-full flex-col" aria-label="Needs your action">
        <CardHeader>
          <div className="flex min-w-0 items-center gap-3"><IconTile icon={BadgeEuro} tone="var(--warning)" /><div className="min-w-0"><CardTitle className="text-lg">Payment approvals</CardTitle><CardDescription>{rows.length} waiting · {eur(total)}</CardDescription></div></div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col">
          <div className="-mr-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-2 [scrollbar-width:thin]">
            {rows.map((r) => {
              const id = r.name + r.time;
              const on = sel.has(id);
              const Icon = METHOD_ICON[r.method];
              return (
                <div key={id} role="checkbox" aria-checked={on} tabIndex={0} onClick={() => toggle(id)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(id); } }}
                  className={'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ' + (on ? 'bg-primary/10 ring-2 ring-inset ring-primary' : 'bg-muted hover:bg-surface-hover')}>
                  <Checkbox checked={on} onCheckedChange={() => toggle(id)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${r.name}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground"><Icon className="size-3.5 shrink-0" />{r.method}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{r.amount}</span>
                </div>
              );
            })}
            {rows.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">All approved.</p>}
          </div>
          <ListFooter selected={ids.length} action={`Approve ${ids.length}`} onAction={() => { setRows((p) => p.filter((r) => !ids.includes(r.name + r.time))); clear(); }} link={`All ${rows.length} approvals`} />
        </CardContent>
      </Card>
    </div>
  );
}

function InvoicesCard() {
  const [rows, setRows] = useState(INVOICES_TO_ISSUE);
  const { sel, toggle, clear } = useSelection();
  const ids = rows.filter((r) => sel.has(r.no)).map((r) => r.no);
  return (
    <Card className="flex h-[28rem] flex-col">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3"><IconTile icon={FileText} tone="var(--viz-1)" /><div className="min-w-0"><CardTitle className="text-lg">Invoices to issue</CardTitle><CardDescription>Shipped, not yet invoiced</CardDescription></div></div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <div className="-mr-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-2 [scrollbar-width:thin]">
          {rows.map((r) => {
            const on = sel.has(r.no);
            const st = INVOICE_STATUS[r.status];
            return (
              <div key={r.no} role="checkbox" aria-checked={on} tabIndex={0} onClick={() => toggle(r.no)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(r.no); } }}
                className={'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ' + (on ? 'bg-primary/10 ring-2 ring-inset ring-primary' : 'bg-muted hover:bg-surface-hover')}>
                <Checkbox checked={on} onCheckedChange={() => toggle(r.no)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${r.no}`} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.customer}</p><p className="truncate text-xs tabular-nums text-muted-foreground">{r.no}</p></div>
                <div className="flex shrink-0 flex-col items-end gap-1"><span className="text-sm font-semibold tabular-nums">{r.amount}</span><Badge variant={st.tone}>{st.label}</Badge></div>
              </div>
            );
          })}
          {rows.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Everything is invoiced.</p>}
        </div>
        <ListFooter selected={ids.length} action={`Issue ${ids.length} invoice${ids.length > 1 ? 's' : ''}`} onAction={() => { setRows((p) => p.filter((r) => !ids.includes(r.no))); clear(); }} link={`All ${rows.length} invoices`} />
      </CardContent>
    </Card>
  );
}

function OverdueCard() {
  const [sent, setSent] = useState<string[]>([]);
  const total = OVERDUE.reduce((a, r) => a + euro(r.amount), 0);
  return (
    <Card className="flex h-[28rem] flex-col">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3"><IconTile icon={AlertTriangle} tone="var(--destructive-tint)" /><div className="min-w-0"><CardTitle className="text-lg">Overdue receivables</CardTitle><CardDescription>{eur(total)} · largest first</CardDescription></div></div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <Segmented legend={false} parts={OVERDUE.map((r, i) => ({ label: r.name, value: euro(r.amount), color: `color-mix(in srgb, var(--destructive-tint) ${100 - i * 17}%, var(--surface-raised))` }))} fmt={(v) => eur(v)} />
        <ul className="-mr-2 min-h-0 flex-1 divide-y divide-border overflow-y-auto pr-2">
          {OVERDUE.map((r) => (
            <li key={r.name} className="flex items-center gap-3 py-2.5 first:pt-0">
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.name}</p><p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-1.5 rounded-full" style={{ background: TYPE_COLOR[r.tag] }} />{r.tag}</p></div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">{r.amount}</span>
              <button type="button" disabled={sent.includes(r.name)} onClick={() => setSent((x) => [...x, r.name])} className={'shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ' + (sent.includes(r.name) ? 'text-success-text' : 'bg-muted text-primary hover:bg-primary/10')}>{sent.includes(r.name) ? 'Sent' : 'Remind'}</button>
            </li>
          ))}
        </ul>
        <ListFooter selected={0} action="" onAction={() => {}} link="All 8 overdue customers" />
      </CardContent>
    </Card>
  );
}

function PaymentMethodsCard({ period }: { period: Period }) {
  const [metric, setMetric] = useState<'amount' | 'count'>('amount');
  const rows = PAYMENT_METHOD_RANGES[PERIOD_RANGE[period]];
  const w = rows.map((r) => (metric === 'amount' ? r.amount ?? 0 : r.count));
  const sum = w.reduce((a, b) => a + b, 0) || 1;
  const pct = w.map((x) => Math.round((x / sum) * 100));
  return (
    <Card className="flex h-[28rem] flex-col">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3"><IconTile icon={CreditCard} tone="var(--viz-4)" /><div className="min-w-0"><CardTitle className="text-lg">Payment methods</CardTitle><CardDescription className="first-letter:uppercase">{PERIOD_LABEL[period]}</CardDescription></div></div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <SlideTabs label="Measure" value={metric} onChange={setMetric}
          items={[{ id: 'amount', label: 'Amount' }, { id: 'count', label: 'Count' }]}
          className="flex h-8 w-fit items-center gap-0.5 rounded-[10px] border border-border p-0.5"
          itemClassName="h-full rounded-[7px] px-2.5 text-xs"
          activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
          indicatorClassName="rounded-[7px] bg-primary/10" />
        <Segmented tall legend={false} parts={rows.map((r, i) => ({ label: r.label, value: pct[i], color: PAY_COLOR[r.label] }))} />
        <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto text-sm">
          {rows.map((r, i) => (
            <li key={r.label} className="flex items-center gap-2.5 py-2">
              <span className="size-2 shrink-0 rounded-full" style={{ background: PAY_COLOR[r.label] }} />
              <span className="min-w-0 flex-1 truncate">{r.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{metric === 'amount' ? eur(r.amount ?? 0) : `${r.count} payments`}</span>
              <span className="w-10 shrink-0 text-right font-medium tabular-nums">{pct[i]}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function FinanceDashboard({ period }: { period: Period }) {
  const ch = buckets(period);
  const cash = useMemo(() => cashFor(period), [period]);
  const dso = useMemo(() => dsoFor(period), [period]);
  const invoiced = cash.reduce((a, c) => a + c.invoiced, 0);
  const received = cash.reduce((a, c) => a + c.received, 0);
  const rate = Math.round((received / invoiced) * 100);
  const gap = invoiced - received;
  const dsoNow = dso[dso.length - 1].dso;
  const fmtK = (v: number) => (v >= 1000 ? '€' + Math.round(v / 1000) + 'k' : '€' + v);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_19rem] gap-5">
        <div className="grid min-w-0 grid-cols-4 gap-5">
          <Tile icon={Wallet} label="Receivables" value="€84,312.50" footnote="18 open accounts" action="View accounts" />
          <Tile icon={AlertTriangle} label="Overdue" value="€26,952.50" footnote="8 customers past due" action="Chase" />
          <Tile icon={BadgeEuro} label="Collected" note={DAYS[period] + 'd'} value={eur(received)} delta={RECEIVED[period][1]} points={spark(13, 14, 0.3)} />
          <Tile icon={ScrollText} label="Expenses" note={DAYS[period] + 'd'} value={EXPENSES[period]} delta="-3.6%" up={false} good points={spark(14, 14, -0.15)} />
        </div>
        <QuickTiles items={[['Payment', BadgeEuro], ['Invoices', FileText], ['Ledger', ScrollText], ['Accounts', Users]]} />
        <ChartFrame
          className="min-w-0"
          icon={Landmark} tone="var(--viz-5)"
          title="Cash in" subtitle={`Invoiced vs collected, ${PERIOD_LABEL[period]}`}
          table={{ cols: [ch.daily ? 'Day' : 'Week of', 'Invoiced', 'Collected'], rows: cash.map((c) => [c.label, eur(c.invoiced), eur(c.received)]) }}
        >
          <div className="grid grid-cols-[17rem_minmax(0,1fr)] gap-8">
            <div className="flex flex-col">
              <p className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums"><Num value={eur(received)} /></p>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold text-success-text" style={{ background: 'color-mix(in srgb, var(--success) 12%, var(--surface-raised))' }}><TrendingUp className="size-3.5" />{RECEIVED[period][1]}</span>
                collected
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <MiniStat label="Invoiced" value={eur(invoiced)} />
                <MiniStat label="Collection rate" value={`${rate}%`} />
                <MiniStat label="Days to get paid" value={`${dsoNow} days`} delta="-2.1d" good />
                <MiniStat label="Not yet collected" value={eur(gap)} />
              </div>
              <div className="mt-2.5 flex gap-3 rounded-xl p-3" style={{ background: `color-mix(in srgb, var(--${rate >= 90 ? 'success' : 'warning'}) 10%, var(--surface-raised))` }}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card" style={{ color: `var(--${rate >= 90 ? 'success-text' : 'warning-text'})` }}>{rate >= 90 ? <Check className="size-4" /> : <AlertTriangle className="size-4" />}</span>
                <div className="min-w-0"><p className="text-sm font-semibold">{rate >= 90 ? 'Collections on track' : 'Collections lagging'}</p><p className="text-xs text-muted-foreground">{rate}% of invoiced cash is in</p></div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="mb-2 flex justify-end"><Legend items={[{ label: 'Invoiced', color: viz[0] }, { label: 'Collected', color: viz[1] }]} /></div>
              <div className="flex-1"><Columns data={cash} fmt={fmtK} tipFmt={eur} height={300} series={[{ key: 'invoiced', label: 'Invoiced', color: viz[0] }, { key: 'received', label: 'Collected', color: viz[1] }]} /></div>
            </div>
          </div>
        </ChartFrame>
        <ApprovalsCard />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <InvoicesCard />
        <OverdueCard />
        <PaymentMethodsCard period={period} />
      </div>
    </div>
  );
}

/* ───────── router ───────── */
const b = 'font-medium text-foreground';
const views = (role: Role, period: Period) => ({ admin: <AdminDashboard period={period} />, sales: <SalesDashboard />, warehouse: <WarehouseDashboard />, finance: <FinanceDashboard period={period} /> })[role];

export default function Dashboard({ role = 'admin' }: { role?: Role }) {
  const me = roles.find((r) => r.id === role)!;
  const [period, setPeriod] = useState<Period>('30d');
  const filter = (
    <SlideTabs label="Time range" value={period} onChange={setPeriod}
      items={PERIOD_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
      className="flex h-11 items-center gap-0.5 rounded-xl border border-border bg-card p-1"
      itemClassName="h-full rounded-[8px] px-4 text-sm"
      activeClassName="font-semibold text-primary-strong" idleClassName="text-muted-foreground hover:text-foreground"
      indicatorClassName="rounded-[8px] bg-primary/10" />
  );
  const net = series(DAYS[period]).reduce((s, d) => s + d.net, 0);
  const copy: Record<Role, { desc: React.ReactNode; actions: React.ReactNode }> = {
    admin: { desc: <>Tuesday, 17 Nov · <b className={b}>{eur(net)}</b> in the {PERIOD_LABEL[period]}, <b className={b}>4 things</b> need a look</>, actions: <>{filter}<Button size="xl"><Download />Weekly report</Button></> },
    sales: { desc: <>Tuesday, 17 Nov · <b className={b}>{eur(SALES.perDay)} a day</b> keeps you on target, <b className={b}>{toCollect.length} payments</b> to chase</>, actions: <><Button size="xl" variant="outline"><CircleDollarSign />Record payment</Button><Button size="xl"><Plus />New order</Button></> },
    warehouse: { desc: <>Tuesday, 17 Nov · <b className={b}>5 rush orders</b> for the store, courier at <b className={b}>15:30</b></>, actions: <><Button size="xl" variant="outline"><Printer />Print pick lists</Button><Button size="xl"><ScanLine />Scan receipt</Button></> },
    finance: { desc: <>Tuesday, 17 Nov · <b className={b}>{PAYMENT_APPROVALS.length} payments</b> to approve, <b className={b}>{INVOICES_TO_ISSUE.length} invoices</b> to issue</>, actions: <>{filter}<Button size="xl" variant="outline"><Download />Export ledger</Button><Button size="xl"><BadgeEuro />Record payment</Button></> },
  };
  return (
    <Page title={`Good morning, ${me.name}`} description={copy[role].desc} actions={copy[role].actions}>
      {views(role, period)}
    </Page>
  );
}
