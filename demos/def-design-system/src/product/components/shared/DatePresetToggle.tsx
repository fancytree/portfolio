import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DatePresetToggleOption<T extends string> = {
  id: T;
  label: string;
};

export type DatePresetToggleProps<T extends string> = {
  options: Array<DatePresetToggleOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** compact 保持概览图表尺寸；default 保持列表筛选栏原有尺寸。 */
  size?: 'compact' | 'default';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

/**
 * 日期快捷范围单选组。
 * 所有页面共享概览页销售表现的视觉状态，仅通过 size 区分既有点击区域。
 */
export function DatePresetToggle<T extends string>({
  options,
  value,
  onChange,
  size = 'default',
  className,
  ariaLabel = 'Choose a period',
  disabled = false,
}: DatePresetToggleProps<T>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = value === option.id;
        return (
          <Button
            key={option.id}
            type="button"
            size={size === 'compact' ? 'xs' : 'sm'}
            variant="ghost"
            disabled={disabled}
            aria-pressed={active}
            className={cn(
              'shrink-0 border-transparent font-medium transition-colors',
              size === 'compact'
                ? 'h-6 rounded-md px-2.5 text-[10px]'
                : 'h-7 rounded-lg px-2.5 text-xs',
              active
                ? 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
