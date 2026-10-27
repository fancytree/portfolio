import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ListStatusTabOption<T extends string> = {
  value: T;
  label: string;
  badgeClassName?: string;
  hideCountWhenZero?: boolean;
  showCount?: boolean;
};

type Props<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: ListStatusTabOption<T>[];
  counts?: Partial<Record<T, number>>;
  countsLoading?: boolean;
  ariaLabel: string;
  className?: string;
};

export default function ListStatusTabs<T extends string>({
  value,
  onValueChange,
  options,
  counts,
  countsLoading = false,
  ariaLabel,
  className,
}: Props<T>) {
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeTab = tabRefs.current[value];
    if (!nav || !activeTab) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    setIndicator({
      left: tabRect.left - navRect.left,
      width: tabRect.width,
    });
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateIndicator);
      return () => window.removeEventListener('resize', updateIndicator);
    }

    const observer = new ResizeObserver(updateIndicator);
    if (navRef.current) observer.observe(navRef.current);
    for (const option of options) {
      const tab = tabRefs.current[option.value];
      if (tab) observer.observe(tab);
    }
    return () => observer.disconnect();
  }, [options, updateIndicator]);

  return (
    <nav
      ref={navRef}
      className={cn('relative flex min-w-0 flex-wrap items-center [gap:var(--tabs-gap)]', className)}
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const active = value === option.value;
        const count = counts?.[option.value] ?? 0;
        const showCount = option.showCount !== false
          && (countsLoading || !option.hideCountWhenZero || count > 0);

        return (
          <button
            key={option.value}
            ref={(node) => {
              tabRefs.current[option.value] = node;
            }}
            type="button"
            className={cn(
              'inline-flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-3.5 text-base leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              active
                ? 'font-medium text-primary'
                : 'font-normal text-foreground hover:bg-muted/60 hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
            onClick={() => onValueChange(option.value)}
          >
            <span>{option.label}</span>
            {showCount ? (
              <Badge
                variant={active ? 'info' : 'secondary'}
                className={cn('min-w-5 tabular-nums', option.badgeClassName)}
              >
                {countsLoading ? '…' : count > 99 ? '99+' : count}
              </Badge>
            ) : null}
          </button>
        );
      })}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 [height:var(--tabs-indicator-size)] bg-[var(--tabs-active-color)] transition-[transform,width] duration-200 ease-in-out motion-reduce:transition-none"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
      />
    </nav>
  );
}
