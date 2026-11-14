import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DatePresetToggle } from '@/components/shared/DatePresetToggle';
import KpiTrendCard from '@/components/shared/KpiTrendCard';
import KpiSparkline from '@/components/shared/KpiSparkline';
import { DonutMixChart } from '@/components/charts/DonutMixChart';
import { RankedShareChart } from '@/components/charts/RankedShareChart';

/** True while the element is on screen, so the charts can draw in each time they appear. */
function useInView<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

/* Series colours: the same tokens the ERP's chartColors reads. */
const C = {
  grid: 'var(--border)',
  axis: 'var(--muted-foreground)',
  net: 'var(--primary)',
  netArea: 'color-mix(in oklch, var(--primary) 14%, transparent)',
  sales: 'var(--data-purple)',
  refunds: 'color-mix(in oklch, var(--data-purple) 45%, var(--destructive))',
};

type Period = '7d' | '30d' | '90d';
const DAYS: Record<Period, number> = { '7d': 7, '30d': 30, '90d': 90 };

/* Deterministic demo data so every visit draws the same chart. */
function series(days: number) {
  const end = new Date(2026, 9, 7);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (days - 1 - i));
    const wave = Math.sin(i / 2.3) * 260 + Math.sin(i / 7) * 180;
    const weekend = d.getDay() === 0 ? -520 : d.getDay() === 6 ? -240 : 0;
    const sales = Math.max(380, Math.round(1450 + wave + weekend + (i % 5) * 37));
    const refunds = Math.round((i % 6 === 2 ? 210 : 40) + (i % 4) * 12);
    return { date: d, sales, refunds, net: sales - refunds, orders: Math.round(sales / 96) };
  });
}

const dd = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
const full = (d: Date) => `${dd(d)}/${d.getFullYear()}`;
const eur = (v: number) => '€ ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur0 = (v: number) => '€ ' + Math.round(v).toLocaleString('en-US');

/** Second half vs first half of the chosen range, as the ERP's KPI cards compute it. */
function change(values: number[]) {
  const half = Math.floor(values.length / 2);
  const a = values.slice(0, half).reduce((s, v) => s + v, 0) / half;
  const b = values.slice(half).reduce((s, v) => s + v, 0) / (values.length - half);
  return ((b - a) / a) * 100;
}

function TrendTooltip({ active, payload }: { active?: boolean; payload?: { payload: ReturnType<typeof series>[number] }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="min-w-44 rounded-lg border bg-popover p-3 text-xs shadow-md" data-chart-tooltip>
      <p className="mb-2 font-semibold tabular-nums">{full(p.date)}</p>
      {([['Net sales', p.net, C.net], ['Sales', p.sales, C.sales], ['Refunds', p.refunds, C.refunds]] as const).map(([l, v, c]) => (
        <p key={l} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full" style={{ background: c }} />{l}</span>
          <span className="tabular-nums">{eur(v)}</span>
        </p>
      ))}
    </div>
  );
}

export function DataViz() {
  const [period, setPeriod] = useState<Period>('30d');
  const [kpiRef, kpiInView] = useInView<HTMLDivElement>();
  const [trendRef, trendInView] = useInView<HTMLDivElement>();
  const [donutRef, donutInView] = useInView<HTMLDivElement>();
  const [rankRef, rankInView] = useInView<HTMLDivElement>();
  const data = useMemo(() => series(DAYS[period]), [period]);
  const net = data.reduce((s, d) => s + d.net, 0);
  const orders = data.reduce((s, d) => s + d.orders, 0);
  const refunds = data.reduce((s, d) => s + d.refunds, 0);
  const pts = (k: 'net' | 'orders' | 'refunds') => data.map((d) => ({ date: full(d.date), periodEnd: full(d.date), value: d[k] }));
  const pct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

  const customerTypes = [
    { key: 'nail', count: 350, label: 'Nails', percent: 46, color: 'var(--customer-type-nail)' },
    { key: 'beauty', count: 167, label: 'Beauty', percent: 22, color: 'var(--customer-type-beauty)' },
    { key: 'hair', count: 106, label: 'Hair', percent: 14, color: 'var(--customer-type-hair)' },
    { key: 'massage', count: 68, label: 'Massage', percent: 9, color: 'var(--customer-type-massage)' },
    { key: 'wholesale', count: 46, label: 'Wholesale', percent: 6, color: 'var(--customer-type-wholesale)' },
    { key: 'other', count: 23, label: 'Other', percent: 3, color: 'var(--customer-type-other)' },
  ];
  const counts: Record<string, number> = Object.fromEntries(customerTypes.map((t) => [t.key, t.count]));
  const sources = [
    { key: 'wechat', label: 'WeChat', percent: 41, count: 312, color: 'var(--source-wechat)' },
    { key: 'walk-in', label: 'Walk-in', percent: 27, count: 205, color: 'var(--source-walk-in)' },
    { key: 'referral', label: 'Referral', percent: 18, count: 137, color: 'var(--source-referral)' },
    { key: 'rednote', label: 'Rednote', percent: 9, count: 68, color: 'var(--source-rednote)' },
    { key: 'other', label: 'Other', percent: 5, count: 38, color: 'var(--source-other)' },
  ];
  const payments = [
    ['Bank transfer', 'var(--payment-bank-transfer)'], ['Cash', 'var(--payment-cash)'], ['Card', 'var(--payment-card)'],
    ['WeChat Pay', 'var(--payment-wechat-pay)'], ['Cheque', 'var(--payment-check)'], ['Balance', 'var(--payment-balance)'],
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="rounded-lg bg-card p-5" data-viz="kpi">
        <div className="mb-4 flex items-center justify-between">
          <Sub>KPI cards: value, comparison, trend</Sub>
          <DatePresetToggle ariaLabel="Period" size="compact" value={period} onChange={setPeriod} options={[{ id: '7d', label: '7 days' }, { id: '30d', label: '30 days' }, { id: '90d', label: '90 days' }]} />
        </div>
        <div ref={kpiRef}><div key={`kpi-${period}-${kpiInView}`} data-draw={kpiInView ? 'on' : 'off'} className="grid grid-cols-3 gap-3">
          <KpiTrendCard label="Net sales" value={eur0(net)} context={{ label: "vs first half", value: pct(change(data.map((d) => d.net))) }}>
            <KpiSparkline points={pts('net')} label="Net sales" color={C.net} />
          </KpiTrendCard>
          <KpiTrendCard label="Orders" value={orders.toLocaleString('en-US')} context={{ label: "vs first half", value: pct(change(data.map((d) => d.orders))) }}>
            <KpiSparkline points={pts('orders')} label="Orders" color={C.sales} />
          </KpiTrendCard>
          <KpiTrendCard label="Refunds" value={eur0(refunds)} context={{ label: "vs first half", value: pct(change(data.map((d) => d.refunds))) }}>
            <KpiSparkline points={pts('refunds')} label="Refunds" color={C.refunds} />
          </KpiTrendCard>
        </div></div>
        <p className="mt-3 text-xs text-muted-foreground">Same height, numbers aligned. The comparison follows the chosen period, and an empty period shows 0, never a missing card.</p>
      </div>

      {/* Trend */}
      <div className="rounded-lg bg-card p-5" data-viz="trend">
        <div className="mb-2 flex items-center justify-between">
          <Sub>Trend: three series, one colour family</Sub>
          <div className="flex gap-4 text-xs text-muted-foreground">
            {([['Net sales', C.net], ['Sales', C.sales], ['Refunds', C.refunds]] as const).map(([l, c]) => (
              <span key={l} className="flex items-center gap-2"><span className="h-0.5 w-4 rounded-full" style={{ background: c }} />{l}</span>
            ))}
          </div>
        </div>
        <div ref={trendRef}><div key={`trend-${period}-${trendInView}`} data-draw={trendInView ? 'on' : 'off'} className="h-64" data-trend-chart>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey={(d) => dd(d.date)} tick={{ fontSize: 11, fill: C.axis }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
              <YAxis tickFormatter={(v: number) => `€${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} tick={{ fontSize: 11, fill: C.axis }} tickLine={false} axisLine={false} width={48} />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: C.axis, strokeDasharray: '3 3' }} />
              <Area type="monotone" dataKey="net" stroke={C.net} strokeWidth={2} fill={C.netArea} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="sales" stroke={C.sales} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="refunds" stroke={C.refunds} strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div></div>
        <p className="mt-2 text-xs text-muted-foreground">Hover for exact values. The tooltip uses the table’s formats: DD/MM/YYYY and € with two decimals. Longer ranges group by week or month (MM/YYYY).</p>
      </div>

      {/* Composition */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col rounded-lg bg-card p-5" data-viz="donut">
          <Sub>Share of a whole: a donut, six slices at most</Sub>
          <div ref={donutRef} className="flex flex-1 flex-col"><div key={`donut-${donutInView}`} data-draw-donut={donutInView ? 'on' : 'off'} className="flex flex-1 flex-col">
          <DonutMixChart panel segments={customerTypes} ariaLabel="Customers by type" chartClassName="size-36"
            renderLegendValue={(seg) => <>{counts[seg.key]}<span className="ml-2 inline-block w-9 text-right font-normal text-muted-foreground">{seg.percent}%</span></>}
            renderCenter={(a) => (a ? <><span className="text-lg font-semibold tabular-nums">{counts[a.key]}</span><span className="text-[10px] text-muted-foreground">{a.label}</span></> : <><span className="text-lg font-semibold tabular-nums">760</span><span className="text-[10px] text-muted-foreground">customers</span></>)} />
          </div></div>
        </div>
        <div className="flex flex-col rounded-lg bg-card p-5" data-viz="ranked">
          <Sub>Ranking: bars on one 0–100% scale</Sub>
          <div ref={rankRef} className="flex flex-1 flex-col"><div key={`rank-${rankInView}`} data-draw-bars={rankInView ? 'on' : 'off'} className="flex flex-1 flex-col">
            <RankedShareChart segments={sources} ariaLabel="Customers by source" />
          </div></div>
        </div>
      </div>

      {/* Colour by meaning */}
      <div className="grid grid-cols-[1fr_1fr] gap-6">
        <div className="rounded-lg bg-card p-5" data-viz="same-colour">
          <Sub>Same value, same colour, everywhere</Sub>
          <div className="space-y-3 text-xs">
            {sources.slice(0, 3).map((s) => (
              <div key={s.key} className="grid grid-cols-[90px_1fr_1fr_1fr] items-center gap-3">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="justify-self-start rounded-sm px-2 py-0.5 text-foreground" style={{ background: `color-mix(in srgb, ${s.color} 18%, var(--surface-raised))` }}>{s.label}</span>
                <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: s.color }} />Legend</span>
                <span className="h-2 rounded-sm" style={{ background: s.color, width: `${s.percent * 2}%` }} />
              </div>
            ))}
            <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-3 pt-1 text-[10px] text-muted-foreground"><span /><span>Tag</span><span>Legend</span><span>Chart</span></div>
          </div>
        </div>
        <div className="rounded-lg bg-card p-5" data-viz="payments">
          <Sub>Payment methods: one blue-purple family</Sub>
          <div className="grid grid-cols-3 gap-2">
            {payments.map(([l, c]) => (
              <div key={l} className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs"><span className="size-3 rounded-sm" style={{ background: c }} />{l}</div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Categories never use grey to tell values apart. Status colours (green, orange, red) are kept for status, not categories.</p>
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-4 gap-3">
        {[
          ['Trend over time', 'Line, with an area for the main series.'],
          ['Share of a whole', 'Donut, up to six slices, values in the legend.'],
          ['Ranking', 'Horizontal bars on a shared 0–100% scale.'],
          ['Never', '3D, dual axes, gradients that carry meaning, colour without a label.'],
        ].map(([a, b]) => (
          <div key={a} className="rounded-lg bg-card p-4" data-viz-rule><p className="text-sm font-semibold">{a}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{b}</p></div>
        ))}
      </div>
    </div>
  );
}
