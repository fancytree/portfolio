'use client';

// Copied from the DEF ERP repository (web/src/components/charts/SalesTrendChart.tsx). Keep in sync; do not edit the logic here.
// Only change: the body-portaled tooltip gets `def-erp-live-tooltip` so it can read the scoped colour tokens.
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { chartColors } from '../lib/chartColors';
type SalesTrendPoint = { date: string; sales: number; returns: number; net: number };

export type ChartLocale = 'zh' | 'en';

const SALES_SERIES = [
  { key: 'net' as const, stroke: chartColors.netRevenue, areaOpacity: 0.24 },
  { key: 'sales' as const, stroke: chartColors.primary, areaOpacity: 0.16 },
  { key: 'returns' as const, stroke: chartColors.negative, areaOpacity: 0.1 },
];

const SALES_SERIES_LABELS: Record<ChartLocale, Record<(typeof SALES_SERIES)[number]['key'], string>> = {
  zh: { net: '净收入', sales: '销售额', returns: '退款' },
  en: { net: 'Net', sales: 'Sales', returns: 'Refunds' },
};

const CHART_MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type SalesChartPoint = {
  x: number;
  y: number;
  date: string;
  value: number;
};

/** 与 Recharts type="monotone" 相同：单调三次插值，控制点不冲出数据范围 */
function monotoneTangents(xs: number[], ys: number[]) {
  const last = xs.length - 1;
  const deltas = xs.slice(0, last).map((x, index) => {
    const dx = xs[index + 1] - x;
    return (ys[index + 1] - ys[index]) / (Math.abs(dx) < 1e-6 ? 1 : dx);
  });
  const tangents = deltas.map((delta, index) => {
    if (index === 0) return delta;
    if (deltas[index - 1] * delta <= 0) return 0;
    return (deltas[index - 1] + delta) / 2;
  });
  tangents.push(deltas[last - 1] ?? 0);

  for (let index = 0; index < last; index += 1) {
    if (Math.abs(deltas[index]) < 1e-6) {
      tangents[index] = 0;
      tangents[index + 1] = 0;
      continue;
    }
    const alpha = tangents[index] / deltas[index];
    const beta = tangents[index + 1] / deltas[index];
    const square = alpha * alpha + beta * beta;
    if (square > 9) {
      const scale = 3 / Math.sqrt(square);
      tangents[index] = scale * alpha * deltas[index];
      tangents[index + 1] = scale * beta * deltas[index];
    }
  }

  return tangents;
}

function buildSmoothPath(points: SalesChartPoint[]) {
  if (points.length < 2) return '';

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const tangents = monotoneTangents(xs, ys);
  const clampY = (value: number) => Math.min(210, Math.max(30, value));

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const width = point.x - previous.x;
    const controlOneX = previous.x + width / 3;
    const controlOneY = clampY(previous.y + (tangents[index - 1] * width) / 3);
    const controlTwoX = point.x - width / 3;
    const controlTwoY = clampY(point.y - (tangents[index] * width) / 3);

    return `${path} C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${point.x} ${point.y}`;
  }, '');
}

function formatChartAxisAmount(amount: number) {
  if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1000) return `€${Math.round(amount / 1000)}k`;
  return `€${Math.round(amount)}`;
}

function formatChartDay(date: string, locale: ChartLocale) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  if (locale === 'en') return `${CHART_MONTH_SHORT[parsed.getMonth()]} ${parsed.getDate()}`;
  return `${parsed.getMonth() + 1}/${parsed.getDate()}`;
}

function formatChartDate(date: string, locale: ChartLocale = 'zh') {
  if (/^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split('-');
    return locale === 'en'
      ? `${CHART_MONTH_SHORT[Number(month) - 1]} ${year}`
      : `${year}年${Number(month)}月`;
  }
  const weekMatch = date.match(/^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/);
  if (weekMatch) {
    return `${formatChartDay(weekMatch[1], locale)}–${formatChartDay(weekMatch[2], locale)}`;
  }
  return formatChartDay(date, locale);
}

function formatChartEuro(amount: number, locale: ChartLocale = 'zh') {
  return `€${amount.toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** 销售表现图：对齐 portfolio 图表 UI，保留净收入 / 销售额 / 退款三条线 */
export function SalesTrendChart({
  data,
  isLoading,
  animationKey,
  locale = 'zh',
}: {
  data: SalesTrendPoint[];
  isLoading: boolean;
  /** 周期切换时只重播曲线画出动效 */
  animationKey?: string;
  locale?: ChartLocale;
}) {
  const seriesLabels = SALES_SERIES_LABELS[locale];
  const labeledSeries = SALES_SERIES.map((series) => ({ ...series, label: seriesLabels[series.key] }));
  const gradientId = useId().replace(/:/g, '');
  const curveKey = animationKey ?? `${data[0]?.date ?? 'empty'}-${data.length}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });

  const amounts = data.flatMap((point) => [point.net, point.sales, point.returns]);
  const maximum = Math.max(0, ...amounts);
  const spread = Math.max(maximum, 1) * 0.08;
  const chartMinimum = 0;
  const chartMaximum = Math.max(maximum + spread, 1);
  const valueToY = (value: number) => (
    chartMaximum === chartMinimum
      ? 120
      : 30 + ((chartMaximum - Math.max(0, value)) / (chartMaximum - chartMinimum)) * 180
  );

  const seriesPoints = labeledSeries.map((series) => ({
    ...series,
    points: data.map((point, index) => ({
      x: data.length === 1 ? 0 : (index / (data.length - 1)) * 720,
      y: valueToY(point[series.key]),
      date: point.date,
      value: point[series.key],
    })),
  }));

  const safeSelectedIndex = data.length === 0 ? 0 : Math.min(selectedIndex, data.length - 1);
  const selectedNet = seriesPoints[0]?.points[safeSelectedIndex] ?? { x: 0, y: 0 };
  const tooltipTop = seriesPoints[0]?.points.length
    ? Math.min(...seriesPoints.map((series) => series.points[safeSelectedIndex].y))
    : 0;

  useLayoutEffect(() => {
    if (!isHovering || isLoading || data.length === 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    setTooltipPos({
      left: bounds.left + (selectedNet.x / 720) * bounds.width,
      top: Math.max(8, bounds.top + (tooltipTop / 220) * bounds.height - 72),
    });
  }, [isHovering, isLoading, data.length, selectedNet.x, tooltipTop]);

  if (isLoading) return <div className="h-[340px] animate-pulse rounded-xl bg-muted" />;
  if (data.length === 0) {
    return (
      <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
        {locale === 'en' ? 'No sales trend data' : '暂无销售趋势数据'}
      </div>
    );
  }

  const axis = Array.from({ length: 5 }, (_, index) => formatChartAxisAmount(
    chartMaximum - ((chartMaximum - chartMinimum) * index) / 4,
  ));
  const xLabels = Array.from({ length: Math.min(5, data.length) }, (_, index) => {
    const pointIndex = data.length === 1
      ? 0
      : Math.round((index / Math.max(1, Math.min(4, data.length - 1))) * (data.length - 1));
    return { key: `${data[pointIndex].date}-${index}`, label: formatChartDate(data[pointIndex].date, locale) };
  });

  function selectNearest(cursorX: number) {
    const points = seriesPoints[0].points;
    const nearestIndex = points.reduce((closest, point, index) => (
      Math.abs(point.x - cursorX) < Math.abs(points[closest].x - cursorX) ? index : closest
    ), 0);
    setSelectedIndex(nearestIndex);
  }

  return (
    <div className="-mx-6 -mb-5 -mt-4 px-6 pb-4 pt-0">
      <div className="relative h-[340px] pl-9">
        <div className="pointer-events-none absolute right-0 top-1 flex items-center gap-3 text-[10px] text-muted-foreground">
          {labeledSeries.map((series) => (
            <span key={series.key} className="inline-flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: series.stroke }}
              />
              {series.label}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-8 left-0 top-5 text-[10px] text-muted-foreground">
          {axis.map((label, index) => (
            <span key={`${label}-${index}`} className="absolute -translate-y-1/2" style={{ top: `${13.64 + index * 20.45}%` }}>
              {label}
            </span>
          ))}
        </div>
        <svg
          ref={svgRef}
          viewBox="0 0 720 220"
          preserveAspectRatio="none"
          className="absolute top-5 overflow-visible"
          style={{ height: 'calc(100% - 3.25rem)', left: '40px', width: 'calc(100% - 40px)' }}
          role="group"
          aria-label={locale === 'en' ? 'Sales performance trend' : '销售表现趋势'}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            selectNearest(((event.clientX - bounds.left) / bounds.width) * 720);
          }}
        >
          <defs>
            {labeledSeries.map((series) => (
              <linearGradient
                key={series.key}
                id={`${gradientId}-${series.key}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={series.stroke} stopOpacity={series.areaOpacity} />
                <stop offset="72%" stopColor={series.stroke} stopOpacity={series.areaOpacity * 0.28} />
                <stop offset="100%" stopColor={series.stroke} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[30, 75, 120, 165, 210].map((y) => (
            <line key={y} x1="0" x2="720" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
          ))}
          <g key={curveKey}>
            {seriesPoints.map((series) => {
              const linePath = buildSmoothPath(series.points);
              return (
                <g key={series.key}>
                  {linePath ? (
                    <path
                      className="sales-chart-area"
                      d={`${linePath} L 720 210 L 0 210 Z`}
                      fill={`url(#${gradientId}-${series.key})`}
                    />
                  ) : null}
                  {linePath ? (
                    <path
                      className="sales-chart-line"
                      d={linePath}
                      pathLength={1}
                      fill="none"
                      stroke={series.stroke}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.35"
                    />
                  ) : (
                    <circle cx={series.points[0].x} cy={series.points[0].y} r="2" fill={series.stroke} />
                  )}
                </g>
              );
            })}
          </g>
          {isHovering ? (
            <line
              x1={selectedNet.x}
              x2={selectedNet.x}
              y1={tooltipTop}
              y2="210"
              stroke="color-mix(in oklch, var(--primary) 45%, transparent)"
              strokeDasharray="4 4"
            />
          ) : null}
          {data.map((point, index) => (
            <circle
              key={point.date}
              cx={data.length === 1 ? 0 : (index / (data.length - 1)) * 720}
              cy={120}
              r="14"
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${formatChartDate(point.date, locale)}: ${seriesLabels.net} ${formatChartEuro(point.net, locale)}`}
              onMouseEnter={() => setSelectedIndex(index)}
              onFocus={() => {
                setSelectedIndex(index);
                setIsHovering(true);
              }}
              onBlur={() => setIsHovering(false)}
              className="cursor-pointer outline-none"
            />
          ))}
        </svg>
        {isHovering ? seriesPoints.map((series) => {
          const point = series.points[safeSelectedIndex];
          return (
            <span
              key={series.key}
              className="pointer-events-none absolute size-2.5 rounded-full"
              style={{
                background: series.stroke,
                boxShadow: `0 0 0 4px color-mix(in oklch, ${series.stroke} 18%, transparent)`,
                left: `calc(40px + ${(point.x / 720) * 100}% - ${(point.x / 720) * 40}px - 5px)`,
                top: `${20 + (point.y / 220) * 288 - 5}px`,
              }}
            />
          );
        }) : null}
        {/* 挂到 body，始终居中对准 hover 点，避免被图表容器裁剪或挤窄 */}
        {isHovering && typeof document !== 'undefined' ? createPortal(
          <div
            className="def-erp-live-tooltip pointer-events-none fixed z-50 w-max min-w-max -translate-x-1/2 rounded-xl bg-card px-3 py-2 text-left shadow-none ring-1 ring-border"
            style={{ left: tooltipPos.left, top: tooltipPos.top }}
          >
            <p className="text-[10px] text-muted-foreground">{formatChartDate(data[safeSelectedIndex].date, locale)}</p>
            <div className="mt-1 space-y-0.5">
              {labeledSeries.map((series) => (
                <p key={series.key} className="flex items-center justify-between gap-6 whitespace-nowrap text-[11px]">
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-muted-foreground">
                    <span className="size-1.5 rounded-full" style={{ background: series.stroke }} />
                    {series.label}
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatChartEuro(data[safeSelectedIndex][series.key], locale)}
                  </span>
                </p>
              ))}
            </div>
          </div>,
          document.body,
        ) : null}
        <div className="absolute bottom-0 right-0 flex justify-between pl-2 text-[10px] text-muted-foreground" style={{ left: '40px' }}>
          {xLabels.map((item) => <span key={item.key}>{item.label}</span>)}
        </div>
      </div>
    </div>
  );
}
