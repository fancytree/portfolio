import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Button — ConnectNova Design System
 *
 * Variants (style):
 *   default     — primary filled，主操作
 *   outline     — 描边，次要操作
 *   ghost       — 无边框无背景，辅助操作
 *   secondary   — 灰色填充，中性操作
 *   destructive — 红色填充，危险操作
 *   soft        — primary/10 背景，温和 CTA
 *   link        — 纯文字下划线
 *
 * Sizes (text + height):
 *   sm      — h-8  text-xs   px-3   rounded-lg
 *   default — h-9  text-sm   px-4   rounded-xl
 *   lg      — h-10 text-sm   px-5   rounded-xl
 *   xl      — h-12 text-base px-6   rounded-xl
 *
 * Icon-only sizes:
 *   iconSm  — h-7  w-7   rounded-lg
 *   icon    — h-9  w-9   rounded-xl
 *   iconLg  — h-10 w-10  rounded-xl
 *
 * Props:
 *   loading  — 显示 spinner 并禁用交互（不影响 asChild）
 *   asChild  — 将根元素替换为唯一子节点（Radix Slot）
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium",
    "transition-[color,background-color,border-color,opacity] duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // 主操作：filled primary
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        // 危险操作：filled destructive
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // 次要操作：描边
        outline:     "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        // 中性操作：灰色填充
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // 辅助操作：无视觉噪音
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        // 温和 CTA：primary 色调但不抢眼
        soft:        "bg-primary/10 text-primary hover:bg-primary/15",
        // 纯文字链接
        link:        "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm:     "h-8  px-3   text-xs  rounded-lg  [&_svg]:h-3.5 [&_svg]:w-3.5",
        default:"h-9  px-4   text-sm  rounded-xl  [&_svg]:h-4   [&_svg]:w-4",
        lg:     "h-10 px-5   text-sm  rounded-xl  [&_svg]:h-4   [&_svg]:w-4",
        xl:     "h-12 px-6   text-base rounded-xl [&_svg]:h-5   [&_svg]:w-5",
        // Icon-only：正方形，无水平 padding
        iconSm: "h-7  w-7   rounded-lg  [&_svg]:h-3.5 [&_svg]:w-3.5",
        icon:   "h-9  w-9   rounded-xl  [&_svg]:h-4   [&_svg]:w-4",
        iconLg: "h-10 w-10  rounded-xl  [&_svg]:h-5   [&_svg]:w-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 将根节点替换为唯一子元素（用于 Link as Button 等场景） */
  asChild?: boolean
  /** 显示加载动画并自动 disabled */
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
