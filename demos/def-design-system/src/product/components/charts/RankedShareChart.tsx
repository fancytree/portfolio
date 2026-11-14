import type { DonutMixSegment } from './DonutMixChart';
import { cn } from '@/lib/utils';

/** A shared zero-to-100 scale makes channel shares directly comparable. */
export function RankedShareChart({ segments, ariaLabel, className, countLabel = 'customers' }: {
  segments: (DonutMixSegment & { count?: number })[];
  countLabel?: string;
  ariaLabel: string;
  className?: string;
}) {
  const ranked = [...segments].sort((a, b) => b.percent - a.percent);
  return <div className={cn('flex min-h-0 flex-1 flex-col rounded-xl bg-muted p-4', className)} role="group" aria-label={ariaLabel}>
    <ul className="flex flex-1 flex-col justify-between gap-5">
      {ranked.map(segment => <li key={segment.key} data-share-row>
        <div className="mb-2 flex items-baseline justify-between gap-3 text-[11px]">
          <span className="min-w-0 text-muted-foreground">{segment.label}</span>
          <span className="inline-flex shrink-0 items-baseline gap-2 tabular-nums">
            {segment.count !== undefined && <span className="text-muted-foreground">{segment.count.toLocaleString()} {countLabel}</span>}
            <span className="font-semibold text-foreground">{Math.round(segment.percent)}%</span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-sm bg-card" role="meter" aria-label={segment.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={segment.percent}>
          <div className="h-full rounded-sm" style={{ width: `${Math.min(100, Math.max(0, segment.percent))}%`, background: segment.color }} />
        </div>
      </li>)}
    </ul>
  </div>;
}
