import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { Input, type InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type QuantityStepperProps = Omit<InputProps, "type" | "value" | "onChange"> & {
  value: string | number
  /**
   * 输入框输入。传原始字符串而不是 number：销售开单的商品行走 react-hook-form，
   * 需要保留「空串 / 只有小数点」这类中间态，提前 Number() 会把它们吃成 0。
   */
  onInputChange: (raw: string) => void
  /** 上/下按钮，delta 为 +1 / -1 */
  onStep: (delta: 1 | -1) => void
  /** 上/下按钮各自是否可用（边界由调用方判断，因为上限来源各不相同） */
  canIncrease?: boolean
  canDecrease?: boolean
  /** 拼进 aria-label / title：「增加{label}」「减少{label}」 */
  label?: string
  /** 外框 class：宽度、对齐等（默认 w-16） */
  containerClassName?: string
}

const stepButtonCls =
  "flex h-4 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35"

/**
 * 数量步进器：数字输入 + 右侧上下箭头。
 * 销售开单商品行、取货件数、换货数量、发票本次数量共用此组件。
 */
const QuantityStepper = React.forwardRef<HTMLInputElement, QuantityStepperProps>(
  (
    {
      value,
      onInputChange,
      onStep,
      canIncrease = true,
      canDecrease = true,
      label = "数量",
      containerClassName,
      className,
      disabled,
      ...inputProps
    },
    ref,
  ) => (
    <div
      className={cn(
        "inline-flex h-8 w-16 items-stretch overflow-hidden rounded-lg border border-input bg-card",
        containerClassName,
      )}
    >
      <Input
        aria-label={label}
        {...inputProps}
        ref={ref}
        type="number"
        disabled={disabled}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        className={cn(
          // 边框与圆角交给外框，输入框透明以露出外框的白底
          "h-8 min-w-0 flex-1 rounded-none border-0 bg-transparent px-1 text-center text-sm tabular-nums shadow-none",
          "[appearance:textfield] focus-visible:ring-0",
          "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          className,
        )}
      />
      <div className="flex w-5 flex-col border-l border-input">
        <button
          type="button"
          aria-label={`增加${label}`}
          title={`增加${label}`}
          disabled={disabled || !canIncrease}
          onClick={() => onStep(1)}
          className={stepButtonCls}
        >
          <ChevronUpIcon className="h-3 w-3" />
        </button>
        <button
          type="button"
          aria-label={`减少${label}`}
          title={`减少${label}`}
          disabled={disabled || !canDecrease}
          onClick={() => onStep(-1)}
          className={cn(stepButtonCls, "border-t border-input")}
        >
          <ChevronDownIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  ),
)
QuantityStepper.displayName = "QuantityStepper"

export { QuantityStepper }
