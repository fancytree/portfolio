"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "primary" | "secondary"
  }
>(({ className, children, variant = "primary", ...props }, forwardedRef) => {
  const listRef = React.useRef<React.ComponentRef<typeof TabsPrimitive.List> | null>(null)
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })

  const setRefs = React.useCallback(
    (node: React.ComponentRef<typeof TabsPrimitive.List> | null) => {
      listRef.current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef]
  )

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current
    const activeTab = list?.querySelector<HTMLElement>(
      '[data-slot="tabs-trigger"][data-state="active"]'
    )
    if (!list || !activeTab) return

    const listRect = list.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()
    const next = {
      left: tabRect.left - listRect.left + list.scrollLeft,
      width: tabRect.width,
    }
    setIndicator((current) => (
      current.left === next.left && current.width === next.width ? current : next
    ))
  }, [])

  React.useLayoutEffect(() => {
    updateIndicator()
    const list = listRef.current
    if (!list) return

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(updateIndicator)
    resizeObserver?.observe(list)
    list.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]').forEach((tab) => {
      resizeObserver?.observe(tab)
    })

    const mutationObserver = typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(updateIndicator)
    mutationObserver?.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    })

    if (!resizeObserver) window.addEventListener("resize", updateIndicator)
    return () => {
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener("resize", updateIndicator)
    }
  }, [children, updateIndicator])

  return (
    <TabsPrimitive.List
      ref={setRefs}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "group/tabs-list relative inline-flex w-full items-center [gap:var(--tabs-gap)] rounded-none border-b border-border bg-transparent p-0 text-muted-foreground group-data-vertical/tabs:flex-col",
        "data-[variant=secondary]:w-fit data-[variant=secondary]:gap-1 data-[variant=secondary]:rounded-lg data-[variant=secondary]:border-0 data-[variant=secondary]:bg-muted data-[variant=secondary]:p-1 data-[variant=secondary]:[--tabs-trigger-padding-block:0.5rem] data-[variant=secondary]:[--tabs-trigger-padding-inline:0.875rem]",
        className
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 [height:var(--tabs-indicator-size)] bg-[var(--tabs-active-color)] transition-[transform,width,opacity] duration-200 ease-in-out group-data-[variant=secondary]/tabs-list:hidden motion-reduce:transition-none"
        style={{
          opacity: indicator.width > 0 ? 1 : 0,
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
      />
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group/tabs-trigger relative inline-flex shrink-0 items-center justify-center [gap:var(--tabs-trigger-gap)] rounded-lg bg-transparent [padding-inline:var(--tabs-trigger-padding-inline)] [padding-block:var(--tabs-trigger-padding-block)] text-base leading-normal font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:bg-muted/60 hover:text-[var(--tabs-active-color)] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=secondary]/tabs-list:rounded-md group-data-[variant=secondary]/tabs-list:text-sm group-data-[variant=secondary]/tabs-list:font-medium group-data-[variant=secondary]/tabs-list:hover:bg-background/70 group-data-[variant=secondary]/tabs-list:hover:text-foreground group-data-[variant=secondary]/tabs-list:data-[state=active]:bg-card group-data-[variant=secondary]/tabs-list:data-[state=active]:text-foreground group-data-[variant=secondary]/tabs-list:data-[state=active]:shadow-xs",
        "data-[state=active]:text-[var(--tabs-active-color)]",
        className
      )}
      {...props}
    />
  )
}

/** Tab 内数字角标（配合 TabsTrigger 使用，勿用括号数字）。描边跟文字同色相。 */
function TabsBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabs-badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-md border border-[color-mix(in_oklch,currentColor_22%,transparent)] bg-foreground/10 px-1 py-0.5 text-[10px] leading-none font-medium tabular-nums text-foreground",
        "group-data-[state=active]/tabs-trigger:bg-primary/10 group-data-[state=active]/tabs-trigger:text-primary",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-sm/relaxed outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-200 motion-reduce:data-[state=active]:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsBadge, TabsContent }
