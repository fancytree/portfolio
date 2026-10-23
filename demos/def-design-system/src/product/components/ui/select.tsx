"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { FilterBarContext } from "@/lib/filterBarContext"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function SelectRoot({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

const EMPTY_SENTINEL = "__def_select_empty__"

export type SelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export type SelectProps = {
  value?: string | null
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  itemClassName?: string
  contentClassName?: string
  contentAlign?: "start" | "center" | "end"
  size?: "sm" | "default" | "lg"
  id?: string
  name?: string
  onBlur?: () => void
  required?: boolean
  portalContainer?: React.ComponentProps<typeof SelectPrimitive.Portal>["container"]
  displayLabel?: React.ReactNode
  ariaLabel?: string
}

function toItemValue(value: string) {
  return value === "" ? EMPTY_SENTINEL : value
}

function fromItemValue(value: string) {
  return value === EMPTY_SENTINEL ? "" : value
}

function splitTrailingCount(label: React.ReactNode): { label: string; count: string } | null {
  if (typeof label !== "string") return null
  const match = label.match(/^(.+?)\s*[（(]\s*([\d,.]+)\s*[）)]$/)
  if (!match) return null
  return { label: match[1].trimEnd(), count: match[2] }
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "lg"
}) {
  const inFilterBar = React.useContext(FilterBarContext)
  const resolvedSize =
    size === "default" && inFilterBar ? "lg" : size

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={resolvedSize}
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-card pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=default]:py-2 data-[size=lg]:h-9 data-[size=lg]:px-3 data-[size=lg]:py-0 data-[size=sm]:h-7 data-[size=sm]:rounded-lg *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  side = "bottom",
  sideOffset = 4,
  portalContainer,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  portalContainer?: React.ComponentProps<typeof SelectPrimitive.Portal>["container"]
}) {
  return (
    <SelectPrimitive.Portal container={portalContainer}>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "relative z-floating max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          position === "popper" &&
            "data-[side=bottom]:translate-y-0 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-2 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

/**
 * DEF 唯一下拉选择组件。封装 Radix 的键盘操作、浮层、空值适配和列表计数布局；
 * 业务页面只传 value / options，不再自行拼装 Select primitive。
 */
function Select({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  className,
  triggerClassName,
  itemClassName,
  contentClassName,
  contentAlign = "start",
  size = "default",
  id,
  name,
  onBlur,
  required,
  portalContainer,
  displayLabel,
  ariaLabel,
}: SelectProps) {
  const radixValue = value === "" || value === null || value === undefined
    ? undefined
    : toItemValue(value)
  const selectedLabel = options.find((option) => option.value === (value ?? ""))?.label
  const resolvedDisplayLabel = radixValue && displayLabel != null && displayLabel !== ""
    ? displayLabel
    : selectedLabel
  const selectedCount = splitTrailingCount(resolvedDisplayLabel)
  const accessibleName = ariaLabel
    ?? (typeof selectedLabel === "string" && selectedLabel ? selectedLabel : placeholder)

  return (
    <>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <SelectRoot
        value={radixValue}
        onValueChange={(nextValue) => {
          onValueChange(fromItemValue(nextValue))
          onBlur?.()
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          size={size}
          aria-required={required || undefined}
          aria-label={accessibleName || undefined}
          className={cn("w-full", className, triggerClassName)}
        >
          <SelectValue
            placeholder={placeholder}
            className={cn(selectedCount && "min-w-0 flex-1")}
          >
            {selectedCount ? (
              <span className="flex min-w-0 w-full items-center gap-2">
                <span className="min-w-0 truncate">{selectedCount.label}</span>
                <span className="ml-auto shrink-0 tabular-nums">{selectedCount.count}</span>
              </span>
            ) : radixValue && displayLabel != null && displayLabel !== "" ? (
              displayLabel
            ) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          portalContainer={portalContainer}
          align={contentAlign}
          className={contentClassName}
        >
          {options.map((option) => {
            const itemValue = toItemValue(option.value)
            return (
              <SelectItem
                key={itemValue}
                value={itemValue}
                disabled={option.disabled}
                className={itemClassName}
              >
                {option.label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </SelectRoot>
    </>
  )
}

export {
  Select,
}
