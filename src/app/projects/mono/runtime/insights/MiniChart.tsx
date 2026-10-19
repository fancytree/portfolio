"use client";

import { useId, useState } from "react";

import type { ChartType, ChartDataPoint } from "../types";
import { formatAmountShort } from "../format-currency";

interface MiniChartProps {
  type: ChartType;
  data: ChartDataPoint[];
  animate?: boolean;
  /** 点击某个数据点（饼图扇区/图例、柱状图柱子）时触发，用于下发「显示本周所有 X 账单」等指令 */
  onDataPointClick?: (point: ChartDataPoint) => void;
  /** 是否在饼图图例中展示金额（默认 false，只展示百分比） */
  showValueInLegend?: boolean;
  /** Currency for monetary values in the donut legend. */
  currency?: string;
  /** Use a smaller donut where the chart shares a narrow insight card with its legend. */
  compact?: boolean;
}

const DEFAULT_COLORS = [
  "var(--color-chart-series-1)",
  "var(--color-chart-series-2)",
  "var(--color-chart-series-3)",
  "var(--color-chart-series-4)",
  "var(--color-chart-series-5)",
  "var(--color-chart-series-6)",
  "var(--color-chart-series-7)",
];

const CHART_TOOLTIP_CLASS =
  "pointer-events-none absolute z-10 whitespace-nowrap rounded-md border border-border-default bg-surface px-2 py-1 text-xs font-semibold text-text-primary";

function getColor(point: ChartDataPoint, index: number) {
  return point.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/** 折线图/火花线显示的金额格式（无币种，紧凑） */
function formatChartValue(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Math.round(value).toString();
}

function formatChartDateLabel(label: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(label);
  return match ? `${Number(match[2])}/${Number(match[3])}` : label;
}

// 柱状图
function BarChart({
  data,
  animate,
  onDataPointClick,
}: {
  data: ChartDataPoint[];
  animate?: boolean;
  onDataPointClick?: (point: ChartDataPoint) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(28, (200 - (data.length - 1) * 4) / data.length);

  return (
    <div className="flex h-24 gap-2 px-1">
      <div className="flex h-20 w-7 shrink-0 flex-col justify-between text-right text-[10px] leading-none text-text-secondary" aria-hidden="true">
        <span>{formatChartValue(maxValue)}</span>
        <span>0</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative flex h-20 items-end border-b border-l border-border-subtle px-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-border-subtle" aria-hidden="true" />
          {data.map((point, i) => {
            const heightPercent = Math.max(0, (point.value / maxValue) * 100);
            const handleClick = onDataPointClick ? () => onDataPointClick(point) : undefined;
            return (
              <div
                key={i}
                className={`relative flex h-full min-w-0 flex-1 items-end justify-center rounded-t-sm transition-opacity duration-200 ${hoveredIndex != null && hoveredIndex !== i ? "opacity-40" : "opacity-100"} ${handleClick ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" : ""}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(i)}
                onBlur={() => setHoveredIndex(null)}
                onClick={handleClick}
                onKeyDown={handleClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } } : undefined}
                role={handleClick ? "button" : undefined}
                tabIndex={handleClick ? 0 : undefined}
                aria-label={handleClick ? `View ${point.label}: ${formatChartValue(point.value)}` : undefined}
              >
                {hoveredIndex === i && (
                  <span
                    className={CHART_TOOLTIP_CLASS}
                    style={{
                      left: "50%",
                      bottom: `calc(${heightPercent}% + 4px)`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {formatChartValue(point.value)}
                  </span>
                )}
                <div
                  className="rounded-t-sm transition-transform duration-200 ease-out"
                  style={{
                    width: `${barWidth}px`,
                    height: animate ? `${heightPercent}%` : "0%",
                    backgroundColor: getColor(point, i),
                    opacity: 0.85,
                    transform: hoveredIndex === i ? "translateY(-2px) scaleX(1.06)" : "translateY(0) scaleX(1)",
                    animation: animate
                      ? `barGrow 0.6s ease-out ${i * 0.08}s both`
                      : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex px-1 pt-1">
          {data.map((point, i) => (
            <span key={i} className={`min-w-0 flex-1 truncate text-center text-[11px] transition-colors ${hoveredIndex === i ? "text-text-primary font-medium" : "text-text-secondary"}`}>
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 折线图
function LineChart({ data, animate }: { data: ChartDataPoint[]; animate?: boolean }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const width = 260;
  const padX = 24;
  const topSpace = 20;
  const chartHeight = 88;
  const padding = 8;
  const bottomSpace = 18;

  const points = data.map((point, i) => ({
    x: padX + padding + (i / Math.max(data.length - 1, 1)) * (width - padX * 2 - padding * 2),
    y: topSpace + padding + (1 - (point.value - minValue) / range) * (chartHeight - padding * 2),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const chartBottom = topSpace + chartHeight;
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartBottom} L ${points[0].x} ${chartBottom} Z`;

  return (
    <div className="px-1">
      <svg
        viewBox={`0 0 ${width} ${chartBottom + bottomSpace}`}
        className="w-full"
        style={{ height: "126px" }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-series-1)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-chart-series-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 填充区域 */}
        <path
          d={areaD}
          fill="url(#lineGradient)"
          className={animate ? "insight-fade-in" : ""}
        />

        {/* 折线 */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-chart-series-1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? "line-draw" : ""}
          style={
            animate
              ? {
                  strokeDasharray: 500,
                  strokeDashoffset: 500,
                  animation: "lineDraw 1s ease-out forwards",
                }
              : undefined
          }
        />

        {/* 数据点 */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="var(--color-bg-chat-card-inner)"
            stroke="var(--color-chart-series-1)"
            strokeWidth="1.5"
            className={animate ? "insight-fade-in" : ""}
            style={animate ? { animationDelay: `${0.8 + i * 0.05}s` } : undefined}
          />
        ))}

        {/* 数据点上方金额（留出 topSpace 避免与折线重叠） */}
        {data.map((point, i) => (
          <text
            key={`val-${i}`}
            x={points[i].x}
            y={Math.max(12, points[i].y - 8)}
            textAnchor="middle"
            className="fill-text-secondary"
            fontSize="10"
            fontWeight="500"
          >
            {formatChartValue(point.value)}
          </text>
        ))}

        {/* X 轴标签 */}
        {data.map((point, i) => (
          <text
            key={i}
            x={points[i].x}
            y={chartBottom + 12}
            textAnchor="middle"
            className="fill-text-secondary"
            fontSize="10"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// 环形图
function DonutChart({
  data,
  onDataPointClick,
  showValueInLegend,
  currency,
  compact,
}: {
  data: ChartDataPoint[];
  onDataPointClick?: (point: ChartDataPoint) => void;
  showValueInLegend?: boolean;
  currency?: string;
  compact?: boolean;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const cx = 50;
  const cy = 50;
  const outerRadius = 48;
  const innerRadius = 36;
  const hoverOuterRadius = 51.5;

  const createSegmentPath = (startAngle: number, endAngle: number, outer: number, inner: number) => {
    const angle = endAngle - startAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;
    return [
      `M ${cx + outer * Math.cos(startRad)} ${cy + outer * Math.sin(startRad)}`,
      `A ${outer} ${outer} 0 ${largeArc} 1 ${cx + outer * Math.cos(endRad)} ${cy + outer * Math.sin(endRad)}`,
      `L ${cx + inner * Math.cos(endRad)} ${cy + inner * Math.sin(endRad)}`,
      `A ${inner} ${inner} 0 ${largeArc} 0 ${cx + inner * Math.cos(startRad)} ${cy + inner * Math.sin(startRad)}`,
      "Z",
    ].join(" ");
  };

  const segments = data.map((point, i) => {
    let angle = (point.value / total) * 360;
    // SVG does not render an arc whose start and end are identical.
    if (angle >= 360) angle = 359.99;
    const startAngle = -90 + data.slice(0, i).reduce((sum, previous) => sum + (previous.value / total) * 360, 0);
    const endAngle = startAngle + angle;

    return {
      d: createSegmentPath(startAngle, endAngle, outerRadius, innerRadius),
      hoverD: createSegmentPath(startAngle, endAngle, hoverOuterRadius, innerRadius),
      color: getColor(point, i),
      label: point.label,
      percent: Math.round((point.value / total) * 100),
      point,
    };
  });

  return (
    <div className={`flex w-full items-center ${compact ? "gap-2 pl-0.5 pr-1" : "gap-3 pl-1 pr-4"}`}>
      <svg viewBox={compact ? "-2 -2 104 104" : "0 0 100 100"} className={`${compact ? "h-16 w-16" : "h-28 w-28"} shrink-0`} style={{ overflow: "visible" }}>
        <g>
          {segments.map((seg, i) => (
            <path
              key={i}
              d={hoveredIndex === i ? seg.hoverD : seg.d}
              fill={seg.color}
              opacity={hoveredIndex == null ? 0.85 : hoveredIndex === i ? 1 : 0.38}
              className={onDataPointClick ? "cursor-pointer" : ""}
              style={{ d: `path("${hoveredIndex === i ? seg.hoverD : seg.d}")`, transition: "d 180ms ease-out, opacity 180ms ease" } as React.CSSProperties}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              onClick={onDataPointClick ? () => onDataPointClick(seg.point) : undefined}
              role={onDataPointClick ? "button" : undefined}
              tabIndex={onDataPointClick ? 0 : undefined}
              aria-label={onDataPointClick ? `View ${seg.label} bills` : undefined}
            />
          ))}
        </g>
      </svg>

      {/* 图例：点击分类触发「显示本周所有 X 账单」 */}
      <div className={`flex flex-1 min-w-0 flex-col ${compact ? "gap-0" : "gap-1.5"}`}>
        {data.map((point, i) => {
          const handleClick = onDataPointClick ? () => onDataPointClick(point) : undefined;
          const pct = Math.round((point.value / total) * 100);
          return (
            <div
              key={i}
              className={`flex items-center ${compact ? "min-h-5 gap-1 text-[11px]" : "gap-2 text-xs"} transition-opacity ${hoveredIndex != null && hoveredIndex !== i ? "opacity-45" : "opacity-100"} ${handleClick ? compact ? "-mx-1 cursor-pointer rounded px-1 py-0 hover:bg-surface-hover" : "-mx-1.5 min-h-8 cursor-pointer rounded px-1.5 py-1 hover:bg-surface-hover" : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              onClick={handleClick}
              onKeyDown={handleClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } } : undefined}
              role={handleClick ? "button" : undefined}
              tabIndex={handleClick ? 0 : undefined}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getColor(point, i) }}
              />
              <span className="min-w-0 flex-1 truncate text-text-secondary">{point.label}</span>
              <span className="ml-auto shrink-0 whitespace-nowrap font-medium text-text-primary">
                {showValueInLegend
                  ? `${pct}% · ${currency ? formatAmountShort(point.value, currency) : formatChartValue(point.value)}`
                  : `${pct}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 迷你折线（火花线）
function SparklineChart({
  data,
  onDataPointClick,
}: {
  data: ChartDataPoint[];
  onDataPointClick?: (point: ChartDataPoint) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientId = `spark-grad-${useId().replace(/:/g, "")}`;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const width = 400;
  const axisX = 8;
  const rightPad = 8;
  const topSpace = 8;
  const chartHeight = 112;
  const bottomSpace = 24;
  const totalHeight = topSpace + chartHeight + bottomSpace;
  const chartW = width - axisX - rightPad;
  const chartTop = topSpace + 10;
  const chartBase = topSpace + chartHeight - 8;
  const points = data.map((point, i) => ({
    x: axisX + (i / Math.max(data.length - 1, 1)) * chartW,
    y: chartTop + (1 - (point.value - minValue) / range) * (chartBase - chartTop),
  }));
  const pathD = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const previous = points[i - 1];
    const beforePrevious = points[i - 2] ?? previous;
    const next = points[i + 1] ?? point;
    const control1X = previous.x + (point.x - beforePrevious.x) / 6;
    const control1Y = previous.y + (point.y - beforePrevious.y) / 6;
    const control2X = point.x - (next.x - previous.x) / 6;
    const control2Y = point.y - (next.y - previous.y) / 6;
    return `${path} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${point.x} ${point.y}`;
  }, "");

  return (
    <div>
      <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${totalHeight}`}
        className="w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10a37f" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10a37f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M ${axisX} ${chartBase} H ${width - rightPad}`}
          fill="none"
          stroke="var(--color-border-default)"
          strokeWidth="1"
          aria-hidden="true"
        />
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${chartBase} L ${points[0].x} ${chartBase} Z`}
          fill={`url(#${gradientId})`}
        />
        <path
          d={pathD}
          fill="none"
          stroke="#10a37f"
          strokeWidth={activeIndex == null ? 3 : 3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke-width 180ms ease" }}
        />
        {activeIndex != null && (
          <line
            x1={points[activeIndex].x}
            x2={points[activeIndex].x}
            y1={points[activeIndex].y + 5}
            y2={chartBase}
            stroke="var(--color-border-default)"
            strokeWidth="1"
            strokeDasharray="2 2"
            pointerEvents="none"
          />
        )}
        {/* 日期轴 */}
        {data.map((point, i) => (
          <text
            key={`date-${i}`}
            x={points[i].x}
            y={chartBase + 14}
            textAnchor="middle"
            className="fill-text-secondary"
            fontSize="11"
          >
            {formatChartDateLabel(point.label)}
          </text>
        ))}
        {points.map((point, i) => {
          const handleClick = onDataPointClick ? () => onDataPointClick(data[i]) : undefined;
          const isActive = activeIndex === i;
          return (
            <g key={`hit-${i}`}>
              {isActive && (
                <circle cx={point.x} cy={point.y} r="8" fill="#10a37f" opacity="0.16" />
              )}
              {isActive && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="var(--color-bg-chat-card-inner)"
                  stroke="#10a37f"
                  strokeWidth="3"
                  className="insight-fade-in"
                />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r="9"
                fill="transparent"
                className={handleClick ? "cursor-pointer" : ""}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                onClick={handleClick}
                onKeyDown={handleClick ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleClick();
                  }
                } : undefined}
                role={handleClick ? "button" : undefined}
                tabIndex={handleClick ? 0 : undefined}
                aria-label={handleClick ? `${data[i].label}: ${formatChartValue(data[i].value)}` : undefined}
              />
            </g>
          );
        })}
      </svg>
      {activeIndex != null && (
        <span
          className={CHART_TOOLTIP_CLASS}
          style={{
            left: `${(points[activeIndex].x / width) * 100}%`,
            top: `${(points[activeIndex].y / totalHeight) * 100}%`,
            transform: "translate(-50%, calc(-100% - 8px))",
          }}
        >
          {formatChartValue(data[activeIndex].value)}
        </span>
      )}
      </div>
    </div>
  );
}

export default function MiniChart({ type, data, animate, onDataPointClick, showValueInLegend, currency, compact }: MiniChartProps) {
  switch (type) {
    case "bar":
      return <BarChart data={data} animate={animate} onDataPointClick={onDataPointClick} />;
    case "line":
      return <LineChart data={data} animate={animate} />;
    case "donut":
      return (
        <DonutChart
          data={data}
          onDataPointClick={onDataPointClick}
          showValueInLegend={showValueInLegend}
          currency={currency}
          compact={compact}
        />
      );
    case "sparkline":
      return <SparklineChart data={data} onDataPointClick={onDataPointClick} />;
    default:
      return null;
  }
}
