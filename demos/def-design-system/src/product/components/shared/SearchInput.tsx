import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export type SearchInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  'type' | 'inputSize'
> & {
  className?: string;
  inputClassName?: string;
};

/**
 * 标准搜索框（列表页 / 筛选栏通用）
 * - 左侧放大镜、浅占位符、聚焦仅加深边框
 * - 清空按钮样式见 index.css `.list-search-input`
 */
export function SearchInput({
  className,
  inputClassName,
  disabled,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('list-search-input w-[20rem] max-w-full shrink-0', className)}>
      <InputGroup
        className={cn(
          'h-9 border-input bg-card shadow-none',
          disabled && '!bg-background dark:!bg-background',
          'has-[[data-slot=input-group-control]:focus-visible]:border-foreground/35',
          'has-[[data-slot=input-group-control]:focus-visible]:ring-0',
          'has-[[data-slot=input-group-control]:focus-visible]:shadow-none',
        )}
      >
        <InputGroupAddon className="pl-[13px] pr-0">
          <Search
            className={cn(
              'size-4',
              disabled ? 'text-muted-foreground/80' : 'text-muted-foreground/55',
            )}
            aria-hidden
          />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          inputSize="lg"
          className={cn(
            'pr-3 text-sm placeholder:text-muted-foreground/45 disabled:opacity-100 disabled:text-muted-foreground disabled:placeholder:text-muted-foreground/80',
            inputClassName,
          )}
          disabled={disabled}
          {...props}
        />
      </InputGroup>
    </div>
  );
}
