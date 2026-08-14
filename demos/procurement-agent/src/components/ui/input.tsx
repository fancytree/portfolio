import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { blurAmountInputOnWheel } from "@/lib/disableAmountInputWheel"
import { FilterBarContext } from "@/lib/filterBarContext"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-none border border-input bg-card text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-muted-foreground disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground",
  {
    variants: {
      inputSize: {
        default: "h-8 px-2.5 py-1 text-sm file:h-6 file:text-sm",
        lg: "h-9 px-3 py-0 text-sm font-medium file:h-6 file:text-sm",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
)

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, onWheel, ...props }, ref) => {
    const inFilterBar = React.useContext(FilterBarContext)
    const autoLgInFilterBar =
      inFilterBar && type !== "checkbox" && type !== "radio"
    const resolvedSize = inputSize ?? (autoLgInFilterBar ? "lg" : "default")

    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        data-size={resolvedSize}
        className={cn(
          inputVariants({ inputSize: resolvedSize }),
          type === "number" &&
            "[appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        onWheel={(event) => {
          blurAmountInputOnWheel(event)
          onWheel?.(event)
        }}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input, inputVariants }
