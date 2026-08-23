/**
 * ConnectNova Input — 单行与多行统一组件
 *
 * 单行（默认）：  <Input appearance="surface" placeholder="..." />
 * 多行：         <Input multiline rows={4} placeholder="..." />
 * 搜索框：       <SearchInput value={q} onChange={...} onClear={...} />
 */
"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  inputVariants,
  textareaVariants,
  inputNumberNoSpinnerClasses,
  type FieldVariantProps,
} from "@/components/ui/field-variants"

export { inputVariants, textareaVariants, inputNumberNoSpinnerClasses }
export type { FieldVariantProps }

type CommonField = FieldVariantProps & { className?: string }

type InputSingleProps = CommonField &
  Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
    multiline?: false | undefined
  }

type InputMultiProps = CommonField &
  Omit<React.ComponentPropsWithoutRef<"textarea">, "size"> & {
    multiline: true
  }

export type InputProps = InputSingleProps | InputMultiProps

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  { multiline, appearance, size, className, ...rest },
  ref
) {
  if (multiline) {
    const textareaProps = rest as Omit<InputMultiProps, "multiline" | keyof FieldVariantProps | "className">
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        data-slot="input"
        className={cn(textareaVariants({ appearance, size }), className)}
        {...textareaProps}
      />
    )
  }

  const inputProps = rest as Omit<InputSingleProps, "multiline" | keyof FieldVariantProps | "className">
  const { type, ...inputRest } = inputProps
  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ appearance, size }),
        type === "number" && inputNumberNoSpinnerClasses,
        className
      )}
      {...inputRest}
    />
  )
})

Input.displayName = "Input"

const searchAffix = {
  sm: {
    iconLeft: "left-2.5",
    icon: "h-3.5 w-3.5",
    pad: "pl-8",
    padEndClear: "pr-9",
    clearRight: "right-1.5",
    clearPad: "p-0.5",
  },
  default: {
    iconLeft: "left-3",
    icon: "h-4 w-4",
    pad: "pl-9",
    padEndClear: "pr-10",
    clearRight: "right-2",
    clearPad: "p-1",
  },
  lg: {
    iconLeft: "left-3.5",
    icon: "h-[1.125rem] w-[1.125rem]",
    pad: "pl-10",
    padEndClear: "pr-11",
    clearRight: "right-2.5",
    clearPad: "p-1",
  },
} as const

type SearchSize = keyof typeof searchAffix

const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputSingleProps, "type" | "appearance" | "multiline"> & {
    containerClassName?: string
    iconClassName?: string
    onClear?: () => void
    clearAriaLabel?: string
    showClearButton?: boolean
  }
>(function SearchInput(
  {
    className,
    containerClassName,
    iconClassName,
    value,
    onClear,
    onChange,
    clearAriaLabel = "Clear search",
    showClearButton = true,
    size = "default",
    ...props
  },
  ref
) {
  const hasValue = typeof value === "string" ? value.trim().length > 0 : false
  const affix = searchAffix[(size ?? "default") as SearchSize] ?? searchAffix.default
  const showClear = showClearButton && hasValue && !props.disabled

  const handleClear = () => {
    if (onClear) {
      onClear()
      return
    }
    if (onChange) {
      onChange({
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className={cn("group relative w-full", containerClassName)}>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-foreground/60",
          "transition-colors duration-150 group-hover:text-foreground/75",
          affix.iconLeft,
          affix.icon,
          iconClassName
        )}
        aria-hidden
      />
      <Input
        ref={ref}
        type="search"
        appearance="surface"
        size={size}
        value={value}
        onChange={onChange}
        className={cn(
          affix.pad,
          showClear ? affix.padEndClear : undefined,
          // 隐藏浏览器原生搜索框的清除按钮（WebKit/Chromium + Edge）
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          // 白底（覆盖 appearance=surface 的 muted 灰底）；hover 用浅色 surface-subtle
          "bg-[var(--cn-white)] border-border/80 shadow-none",
          "hover:bg-[var(--cn-surface-subtle)] hover:border-border",
          "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--cn-white)]",
          "disabled:bg-[var(--cn-gray-200)]/50 disabled:border-border/60",
          "read-only:bg-[var(--cn-gray-200)]/35 read-only:border-border/70",
          // 覆盖 surface：主色边框、无 ring、无点击缩放
          "focus-visible:ring-0 focus-visible:border-primary active:scale-100",
          className
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-md text-muted-foreground",
            "transition-[color,background-color,transform] duration-150 ease-out",
            "hover:bg-muted hover:text-foreground active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            affix.clearRight,
            affix.clearPad
          )}
          aria-label={clearAriaLabel}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
})

SearchInput.displayName = "SearchInput"

export { Input, SearchInput }
