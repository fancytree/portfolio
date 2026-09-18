'use client';

// Extracted verbatim from the DEF ERP repository:
//   web/src/pages/portfolio/dashboard/showcaseShared.tsx  (cards, toggles, demo data)
//   web/src/pages/portfolio/dashboard/DashboardShowcasePage.tsx  (customer type data)
// Same components and demo data as the ERP admin dashboard.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DonutMixChart } from './charts/DonutMixChart';
import { SalesTrendChart } from './charts/SalesTrendChart';

export function ShowcaseCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
}: {
  title: ReactNode;
  description?: string;
  action?: React.ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  return (
    <section className={cn('overflow-hidden rounded-2xl bg-card', className)}>
      <header className={cn('flex min-h-16 flex-wrap items-center justify-between gap-3 px-6 py-4', headerClassName)}>
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p> : null}
        </div>
        {action ? (
          typeof action === 'string' ? (
            <button type="button" className="h-auto rounded-md px-0 py-0 text-xs font-medium text-primary transition-colors hover:bg-transparent hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {action}
            </button>
          ) : (
            <div>{action}</div>
          )
        ) : null}
      </header>
      {children}
    </section>
  );
}


type SalesRange = '1D' | '7D' | '1M' | '3M' | '1Y';

export type MixSegment = { label: string; value: number; count: number; amount?: number; color: string };

type MixMetric = 'amount' | 'count';

function shareSegments(items: MixSegment[], metric: MixMetric): MixSegment[] {
  const weights = items.map((item) => (metric === 'amount' ? (item.amount ?? item.value) : item.count));
  const sum = weights.reduce((total, weight) => total + weight, 0) || 1;
  const raw = weights.map((weight) => (weight / sum) * 100);
  const floors = raw.map((value) => Math.floor(value));
  const remain = 100 - floors.reduce((total, value) => total + value, 0);
  const ranked = raw
    .map((value, index) => ({ index, frac: value - floors[index] }))
    .sort((a, b) => b.frac - a.frac);
  const shares = floors.slice();
  for (let i = 0; i < remain; i += 1) shares[ranked[i].index] += 1;
  return items.map((item, index) => ({ ...item, value: shares[index] }));
}

function formatMixAmount(amount: number) {
  if (amount >= 1000) return `€${(amount / 1000).toFixed(1)}k`;
  return `€${amount}`;
}

function MetricToggle({ metric, onChange }: { metric: MixMetric; onChange: (metric: MixMetric) => void }) {
  return (
    <div className="inline-flex shrink-0 items-center rounded-lg bg-muted p-0.5">
      {([
        ['amount', 'Amount'],
        ['count', 'Count'],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'rounded-md px-2 py-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            metric === value ? 'bg-card text-primary' : 'text-muted-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function RangeToggle({ range, onChange, compact = false }: { range: SalesRange; onChange: (range: SalesRange) => void; compact?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {(['1D', '7D', '1M', '3M', '1Y'] as SalesRange[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[10px]',
            range === option ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/** 切换时从空环重新展开，比相邻时段微调更明显 */
function useTweenedMix(target: MixSegment[], replayKey: string) {
  const [shown, setShown] = useState(target);
  const [progress, setProgress] = useState(1);
  const targetRef = useRef(target);
  const firstRef = useRef(true);

  // 先于下面的回放 effect 执行（同一次提交内按声明顺序），效果等同于渲染时赋值
  useEffect(() => {
    targetRef.current = target;
  });

  useEffect(() => {
    const next = targetRef.current;
    if (firstRef.current) {
      firstRef.current = false;
      setShown(next);
      setProgress(1);
      return;
    }
    if (prefersReducedMotion()) {
      setShown(next);
      setProgress(1);
      return;
    }

    const emptied = next.map((seg) => ({ ...seg, value: 0, count: 0, amount: 0 }));
    setShown(emptied);
    setProgress(0);

    const start = performance.now();
    const duration = 720;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutCubic(t);
      setProgress(e);
      setShown(next.map((seg) => ({
        ...seg,
        value: seg.value * e,
        count: Math.round(seg.count * e),
        amount: (seg.amount ?? 0) * e,
      })));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [replayKey]);

  return { shown, progress };
}

export function CustomerMixCard({
  title,
  segments,
  ranges,
  className,
  metricToggle = false,
}: {
  title: string;
  segments?: MixSegment[];
  ranges?: Record<SalesRange, MixSegment[]>;
  className?: string;
  /** 金额 / 笔数切换，仅收款方式等需要双口径的图使用 */
  metricToggle?: boolean;
}) {
  const [range, setRange] = useState<SalesRange>('1M');
  const [metric, setMetric] = useState<MixMetric>('amount');
  const source = ranges ? ranges[range] : (segments ?? []);
  const visible = metricToggle ? shareSegments(source, metric) : source;
  const { shown: tweened, progress } = useTweenedMix(visible, `${range}-${metric}`);

  return (
    <section className={cn('flex flex-col rounded-2xl bg-card px-6 py-5', className)}>
      <div>
        {/* 上下排列：窄卡片里标题不再被时段切换挤成省略号 */}
        <div className="flex flex-col items-start gap-2">
          <h2 className="max-w-full truncate text-base font-semibold tracking-tight text-foreground">{title}</h2>
          {ranges ? (
            <RangeToggle
              range={range}
              compact
              onChange={setRange}
            />
          ) : null}
        </div>
        {metricToggle ? (
          <div className="mt-2">
            <MetricToggle
              metric={metric}
              onChange={setMetric}
            />
          </div>
        ) : null}
      </div>
      <DonutMixChart
        className="mt-4"
        stacked
        ariaLabel={`${title} chart`}
        chartStyle={{
          transform: `scale(${0.82 + 0.18 * progress}) rotate(${-22 * (1 - progress)}deg)`,
        }}
        segments={tweened.map((segment) => ({
          key: segment.label,
          label: segment.label,
          percent: segment.value,
          color: segment.color,
        }))}
        renderCenter={(active) => {
          if (!active) return null;
          const segment = tweened.find((item) => item.label === active.key);
          if (!segment) return null;
          const centerValue = metricToggle && metric === 'amount'
            ? formatMixAmount(segment.amount ?? 0)
            : String(segment.count);
          return (
            <>
              <p className="text-[20px] font-semibold tabular-nums leading-none text-foreground">{centerValue}</p>
              <p className="mt-1 max-w-[4.5rem] truncate text-[10px] leading-tight text-muted-foreground">{segment.label}</p>
            </>
          );
        }}
      />
    </section>
  );
}


type SalesPoint = { x: number; y: number; date: string; value: string };

const SALES_RANGE_LABELS: Record<SalesRange, string> = {
  '1D': 'Today',
  '7D': 'Last 7 days',
  '1M': 'Last 30 days',
  '3M': '3 months (weekly)',
  '1Y': '1 year (monthly)',
};

function toTrendDate(date: string) {
  if (/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(date) || /^\d{2}:\d{2}$/.test(date)) return date;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${parsed.getFullYear()}-${month}-${day}`;
}

function attachSalesSeries(points: SalesPoint[]) {
  return points.map((point, index) => {
    const sales = Number(point.value.replace(/[€,]/g, ''));
    const returns = sales * (0.032 + Math.abs(Math.sin(index * 1.73)) * 0.038);
    return {
      date: toTrendDate(point.date),
      sales,
      returns,
      net: Math.max(0, sales - returns),
    };
  });
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDemoDate(date: Date) {
  return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function formatDemoAmount(amount: number) {
  return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function scaleToPoints(rawValues: number[], dates: Date[], targetTotal: number): SalesPoint[] {
  const scale = targetTotal / rawValues.reduce((sum, value) => sum + value, 0);
  return rawValues.map((rawValue, index) => ({
    x: rawValues.length === 1 ? 0 : (index / (rawValues.length - 1)) * 720,
    y: 0,
    date: formatDemoDate(dates[index]),
    value: formatDemoAmount(rawValue * scale),
  }));
}

function formatIsoDay(date: Date) {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${date.getUTCFullYear()}-${month}-${day}`;
}

function buildWeeklyPoints(count: number, startDate: string, targetTotal: number): SalesPoint[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const dates = Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index * 7);
    return date;
  });
  const rawValues = dates.map((date, index) => {
    const augustDip = date.getUTCMonth() === 7 ? 0.78 : 1;
    const trend = 0.94 + (index / Math.max(1, count - 1)) * 0.14;
    const noise = 1 + Math.sin(index * 1.7) * 0.06 + Math.cos(index * 0.9) * 0.04;
    return augustDip * trend * noise;
  });
  const scale = targetTotal / rawValues.reduce((sum, value) => sum + value, 0);
  return rawValues.map((rawValue, index) => {
    const weekStart = dates[index];
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
    return {
      x: rawValues.length === 1 ? 0 : (index / (rawValues.length - 1)) * 720,
      y: 0,
      date: `${formatIsoDay(weekStart)}/${formatIsoDay(weekEnd)}`,
      value: formatDemoAmount(rawValue * scale),
    };
  });
}

function buildYearlyMonthlyPoints(count: number, startDate: string, targetTotal: number): SalesPoint[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const season = [0.88, 0.92, 1.02, 1.06, 1.08, 1.04, 0.90, 0.72, 1.05, 1.08, 1.12, 0.95];
  const dates = Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setUTCMonth(start.getUTCMonth() + index, 1);
    return date;
  });
  const rawValues = dates.map((date, index) => {
    const growth = 0.96 + (index / Math.max(1, count - 1)) * 0.12;
    const noise = 1 + Math.sin(index * 2.1) * 0.03;
    return season[date.getUTCMonth()] * growth * noise;
  });
  const scale = targetTotal / rawValues.reduce((sum, value) => sum + value, 0);
  return rawValues.map((rawValue, index) => {
    const date = dates[index];
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return {
      x: rawValues.length === 1 ? 0 : (index / (rawValues.length - 1)) * 720,
      y: 0,
      date: `${date.getUTCFullYear()}-${month}`,
      value: formatDemoAmount(rawValue * scale),
    };
  });
}

function buildRealisticIntradayPoints(count: number, targetTotal: number): SalesPoint[] {
  const rawValues = Array.from({ length: count }, (_, hour) => {
    const morningRamp = Math.max(0, Math.sin((hour - 7) * 0.28));
    const afternoonPeak = Math.max(0, Math.sin((hour - 12) * 0.22));
    const noise = 1 + Math.sin(hour * 5.7) * 0.08 + Math.cos(hour * 1.9) * 0.04;
    return (0.18 + morningRamp * 0.42 + afternoonPeak * 0.5) * noise;
  });
  const scale = targetTotal / rawValues.reduce((sum, value) => sum + value, 0);
  const values = rawValues.map((value) => value * scale);

  return values.map((value, index) => ({
    x: (index / (count - 1)) * 720,
    y: 0,
    date: `${String(index).padStart(2, '0')}:00`,
    value: `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  }));
}

function buildRealisticMonthlyPoints(count: number, startDate: string, targetTotal: number): SalesPoint[] {
  const start = new Date(`${startDate}T00:00:00Z`);
  const dates = Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date;
  });
  const rawValues = dates.map((date, index) => {
    const weekday = date.getUTCDay();
    const weekdayFactor = weekday === 0 ? 0.86 : weekday === 6 ? 0.92 : 1.04;
    const noise = 1 + Math.sin(index * 7.31) * 0.035 + Math.cos(index * 2.17) * 0.02;
    const trend = 0.92 + (index / Math.max(1, count - 1)) * 0.16;
    return weekdayFactor * noise * trend;
  });
  return scaleToPoints(rawValues, dates, targetTotal);
}

const SALES_RANGES: Record<SalesRange, { points: SalesPoint[] }> = {
  '1D': { points: buildRealisticIntradayPoints(24, 14420) },
  '7D': { points: buildRealisticMonthlyPoints(7, '2026-08-30', 331040) },
  '1M': { points: buildRealisticMonthlyPoints(30, '2026-08-07', 291040) },
  '3M': { points: buildWeeklyPoints(13, '2026-06-08', 816840) },
  '1Y': { points: buildYearlyMonthlyPoints(12, '2025-10-01', 3425000) },
};

function SalesRangeToggle({ range, onChange }: { range: SalesRange; onChange: (range: SalesRange) => void }) {
  return <RangeToggle range={range} onChange={onChange} />;
}

/** 销售表现图：与线上同一套曲线，作品集用英文 */
export function SalesPerformanceCard() {
  const [range, setRange] = useState<SalesRange>('1M');
  const data = attachSalesSeries(SALES_RANGES[range].points);
  // 当前时段合计：与曲线同一份数据，切换时段即更新
  const totals = data.reduce(
    (sum, point) => ({ net: sum.net + point.net, sales: sum.sales + point.sales, returns: sum.returns + point.returns }),
    { net: 0, sales: 0, returns: 0 },
  );

  return (
    <ShowcaseCard
      className="!overflow-visible xl:col-span-3 xl:min-h-[420px]"
      title="Sales performance"
      description={`${SALES_RANGE_LABELS[range]} net sales, refunds deducted`}
      action={<SalesRangeToggle range={range} onChange={setRange} />}
    >
      <div className="px-6 pb-5">
        <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">{formatDemoAmount(totals.net)}</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            Sales {formatDemoAmount(totals.sales)}
            <span aria-hidden className="mx-1.5">·</span>
            Refunds −{formatDemoAmount(totals.returns)}
          </p>
        </div>
        <SalesTrendChart
          animationKey={range}
          data={data}
          isLoading={false}
          locale="en"
        />
      </div>
    </ShowcaseCard>
  );
}


// web/src/lib/categoryColors.ts resolves labels to these tokens; the demo labels map 1:1.
const CUSTOMER_TYPE_TONE: Record<string, string> = {
  'Nail salon': 'nail',
  'Beauty salon': 'beauty',
  'Massage studio': 'massage',
  'Hair salon': 'hair',
  Other: 'other',
};

function customerTypeColor(tag: string) {
  return `var(--customer-type-${CUSTOMER_TYPE_TONE[tag] ?? 'other'})`;
}

function mixRanges(rows: Record<string, Array<[number, number]>>, colorOf: (label: string) => string) {
  const toSegments = (pairs: Array<[number, number]>, labels: string[]): MixSegment[] => (
    labels.map((label, index) => ({ label, value: pairs[index][0], count: pairs[index][1], color: colorOf(label) }))
  );
  const labels = Object.keys(rows);
  const pick = (range: '1D' | '7D' | '1M' | '3M' | '1Y') => toSegments(labels.map((label) => rows[label][range === '1D' ? 0 : range === '7D' ? 1 : range === '1M' ? 2 : range === '3M' ? 3 : 4]), labels);
  return { '1D': pick('1D'), '7D': pick('7D'), '1M': pick('1M'), '3M': pick('3M'), '1Y': pick('1Y') };
}

const CUSTOMER_TYPE_RANGES = mixRanges({
  'Nail salon': [[36, 4], [35, 18], [35, 70], [33, 176], [32, 656]],
  'Beauty salon': [[27, 3], [27, 14], [27, 54], [28, 149], [26, 533]],
  'Massage studio': [[18, 2], [18, 9], [18, 36], [19, 101], [20, 410]],
  'Hair salon': [[9, 1], [12, 6], [12, 24], [13, 69], [14, 287]],
  Other: [[10, 1], [8, 4], [8, 16], [7, 37], [8, 164]],
}, customerTypeColor);

/** Admin dashboard row: sales performance (3 cols) + customer type (1 col), as in the ERP. */
export function DashboardLiveWidgets() {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
      <SalesPerformanceCard />
      <CustomerMixCard title="Customer type" ranges={CUSTOMER_TYPE_RANGES} className="xl:min-h-[420px]" />
    </div>
  );
}
