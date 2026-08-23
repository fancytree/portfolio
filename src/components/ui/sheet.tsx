"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = "SheetOverlay"

const sheetVariants = cva(
  "fixed z-50 flex flex-col bg-background transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out duration-300",
  {
    variants: {
      side: {
        right:
          "top-3 bottom-3 right-3 w-full max-w-[560px] rounded-2xl border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        floatingRight:
          "right-6 top-1/2 h-auto max-h-[calc(100vh-48px)] w-full max-w-[640px] -translate-y-1/2 rounded-2xl border",
        left: "inset-y-0 left-0 h-full w-full max-w-[580px] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
    },
    defaultVariants: { side: "right" },
  }
)

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & VariantProps<typeof sheetVariants> & {
    hideOverlay?: boolean
    hideCloseButton?: boolean
    /** Render the portal into this element instead of document.body. Lets an
     *  embedded sheet stay inside its host box rather than the viewport. */
    portalContainer?: HTMLElement | null
  }
>(({ side = "right", className, children, hideOverlay = false, hideCloseButton = false, portalContainer, ...props }, ref) => (
  <SheetPortal container={portalContainer ?? undefined}>
    {!hideOverlay ? <SheetOverlay /> : null}
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), "overflow-hidden", className)}
      {...props}
    >
      {/* 关闭按钮：z-30 始终浮于 sticky header 之上，bg-background/80 保证任何背景下可见 */}
      {!hideCloseButton ? (
        <DialogPrimitive.Close className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border/50 text-foreground/60 transition-colors duration-150 hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      ) : null}
      <div className="overflow-y-auto flex-1">{children}</div>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />
)
const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end", className)}
    {...props}
  />
)
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
