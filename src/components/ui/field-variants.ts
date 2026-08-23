import { cva, type VariantProps } from "class-variance-authority"
import {
  fieldAppearanceDefaultClasses,
  fieldAppearanceSurfaceClasses,
  fieldAutofillShadowDefault,
  fieldAutofillShadowSurface,
  fieldAutofillTextClasses,
} from "@/components/ui/field-appearance"

/** 单行输入：圆角由 size 决定（sm=md、default=lg、lg=xl），勿在 className 重复写 rounded-* */
export const inputVariants = cva(
  [
    "peer w-full min-w-0 border outline-none",
    "transition-[color,background-color,border-color,transform] duration-150 ease-out",
    "text-foreground placeholder:text-muted-foreground",
    "selection:bg-primary selection:text-primary-foreground",
    "file:mr-3 file:inline-flex file:cursor-pointer file:items-center file:border-0 file:bg-transparent file:font-medium file:text-foreground",
    "read-only:cursor-default focus-visible:outline-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    ...fieldAutofillTextClasses,
  ],
  {
    variants: {
      appearance: {
        default: [...fieldAppearanceDefaultClasses],
        surface: [...fieldAppearanceSurfaceClasses],
      },
      size: {
        sm: "h-8 px-2.5 text-xs rounded-md file:h-6 file:text-xs",
        default: "h-9 px-3 text-sm rounded-lg file:h-7 file:text-sm",
        lg: "h-10 px-3.5 text-sm rounded-xl file:h-8 file:text-sm",
      },
    },
    defaultVariants: { appearance: "default", size: "default" },
    compoundVariants: [
      { appearance: "default", class: fieldAutofillShadowDefault },
      { appearance: "surface", class: fieldAutofillShadowSurface },
    ],
  }
)

/** 多行输入：圆角与单行 size 规则一致 */
export const textareaVariants = cva(
  [
    "peer flex w-full min-w-0 resize-y border outline-none",
    "transition-[color,background-color,border-color,transform] duration-150 ease-out",
    "text-foreground placeholder:text-muted-foreground",
    "selection:bg-primary selection:text-primary-foreground",
    "read-only:cursor-default focus-visible:outline-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    ...fieldAutofillTextClasses,
  ],
  {
    variants: {
      appearance: {
        default: [...fieldAppearanceDefaultClasses],
        surface: [...fieldAppearanceSurfaceClasses],
      },
      size: {
        sm: "min-h-[4rem] py-1.5 px-2.5 text-xs leading-snug rounded-md",
        default: "min-h-[5rem] py-2 px-3 text-sm rounded-lg",
        lg: "min-h-[6.5rem] py-2.5 px-3.5 text-base leading-relaxed rounded-xl",
      },
    },
    defaultVariants: { appearance: "default", size: "default" },
  }
)

export type FieldVariantProps = VariantProps<typeof inputVariants>

export const inputNumberNoSpinnerClasses =
  "[-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
