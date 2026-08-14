// ============================================================
// SelectField — 业务层下拉选择（基于 shadcn / Radix Select）
// ============================================================

import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/** Radix Select 不支持空字符串 value，内部用此哨兵表示 */
const EMPTY_SENTINEL = '__def_select_empty__';

export type SelectFieldOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectFieldProps = {
  value?: string | null;
  onValueChange: (value: string) => void;
  options: SelectFieldOption[];
  placeholder?: string;
  disabled?: boolean;
  /** 作用于 SelectTrigger，默认 w-full */
  className?: string;
  triggerClassName?: string;
  /** 下拉项字号等（如 text-xs） */
  itemClassName?: string;
  size?: 'sm' | 'default' | 'lg';
  id?: string;
  name?: string;
  onBlur?: () => void;
  required?: boolean;
  /** 选中后在 Trigger 展示（下拉项 label 可与之不同，如品类完整路径） */
  displayLabel?: ReactNode;
};

function toItemValue(v: string): string {
  return v === '' ? EMPTY_SENTINEL : v;
}

function fromItemValue(v: string): string {
  return v === EMPTY_SENTINEL ? '' : v;
}

function toRadixValue(value: string | null | undefined): string | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  return toItemValue(value);
}

export default function SelectField({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  triggerClassName,
  itemClassName,
  size = 'default',
  id,
  name,
  onBlur,
  required,
  displayLabel,
}: SelectFieldProps) {
  const radixValue = toRadixValue(value);

  return (
    <>
      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
      <Select
        value={radixValue}
        onValueChange={(v) => {
          onValueChange(fromItemValue(v));
          onBlur?.();
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          size={size}
          aria-required={required || undefined}
          className={cn('w-full', className, triggerClassName)}
        >
          <SelectValue placeholder={placeholder}>
            {radixValue && displayLabel != null && displayLabel !== '' ? displayLabel : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
          {options.map((opt) => {
            const itemValue = toItemValue(opt.value);
            return (
              <SelectItem
                key={itemValue}
                value={itemValue}
                disabled={opt.disabled}
                className={itemClassName}
              >
                {opt.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
