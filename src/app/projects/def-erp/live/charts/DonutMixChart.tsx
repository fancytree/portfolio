'use client';

// Copied from the DEF ERP repository (web/src/components/charts/DonutMixChart.tsx). Keep in sync; do not edit the logic here.
import { useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type DonutMixSegment = {
  key: string;
  label: string;
  percent: number;
  color: string;
};

type DonutMixChartProps = {
  segments: DonutMixSegment[];
  ariaLabel: string;
  emptyLabel?: string;
  className?: string;
  chartClassName?: string;
  chartStyle?: CSSProperties;
  /** hover 时环心内容；返回 null 则不展示 */
  renderCenter?: (active: DonutMixSegment | null) => ReactNode;
  /** 上下排列：环在上、图例在下，用于窄卡片，避免图例文字被截断 */
  stacked?: boolean;
};

/** SVG 环形占比图：hover 加粗、其余变淡，右侧图例显示整数百分比 */
export function DonutMixChart({
  segments,
  ariaLabel,
  emptyLabel = '暂无数据',
  className,
  chartClassName = 'size-40',
  chartStyle,
  renderCenter,
  stacked = false,
}: DonutMixChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex == null ? null : (segments[activeIndex] ?? null);
  // 每段的起始偏移 = 前面各段占比之和（在渲染外算好，避免在 map 里改写变量）
  const offsets = segments.map((_, index) => (
    segments.slice(0, index).reduce((sum, segment) => sum + segment.percent, 0)
  ));

  if (segments.length === 0) {
    return (
      <p className="py-10 text-center text-xs text-muted-foreground">{emptyLabel}</p>
    );
  }

  function activate(index: number) {
    setActiveIndex(index);
  }

  function clear() {
    setActiveIndex(null);
  }

  return (
    <div className={cn('flex min-h-[160px] flex-1 items-center gap-5', stacked && 'flex-col gap-4', className)}>
      <div
        className={cn('relative flex shrink-0 items-center justify-center', chartClassName)}
        style={chartStyle}
      >
        <svg viewBox="0 0 100 100" className={cn(chartClassName, '-rotate-90')} aria-label={ariaLabel}>
          {segments.map((segment, index) => {
            const segmentOffset = offsets[index];
            if (segment.percent <= 0) return null;
            return (
              <circle
                key={segment.key}
                cx="50"
                cy="50"
                r="35"
                fill="none"
                pathLength="100"
                stroke={segment.color}
                strokeWidth={activeIndex === index ? 12 : 8}
                strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                strokeDashoffset={-segmentOffset}
                opacity={activeIndex == null || activeIndex === index ? 1 : 0.25}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => activate(index)}
                onMouseLeave={clear}
                onFocus={() => activate(index)}
                onBlur={clear}
                tabIndex={0}
                role="button"
                aria-label={`${segment.label}：${Math.round(segment.percent)}%`}
              />
            );
          })}
        </svg>
        {renderCenter ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
            {renderCenter(active)}
          </div>
        ) : null}
      </div>
      <div className={cn('min-w-0 flex-1 space-y-2', stacked && 'w-full flex-none')}>
        {segments.map((segment, index) => (
          <button
            key={segment.key}
            type="button"
            onMouseEnter={() => activate(index)}
            onMouseLeave={clear}
            onFocus={() => activate(index)}
            onBlur={clear}
            className={cn(
              'flex w-full items-center justify-between gap-3 rounded-md px-1 py-0.5 text-left text-[11px] transition-all',
              activeIndex === index ? 'bg-background opacity-100' : activeIndex == null ? 'opacity-100' : 'opacity-40',
            )}
          >
            <span className="flex min-w-0 items-center gap-2 truncate text-muted-foreground">
              <span className="size-2 shrink-0 rounded-full" style={{ background: segment.color }} />
              <span className="truncate">{segment.label}</span>
            </span>
            <span className="font-semibold tabular-nums text-foreground">{Math.round(segment.percent)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}
