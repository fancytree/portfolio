import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ListFilter } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * 业务列表宽表固定列（配合 index.css `.def-data-table` + `data-sticky-leads`）
 * - lead1/lead2/lead3：横向滚动时左侧固定（单号、客户等）
 * - trail：右侧固定（操作列）
 * - order/customer/actions：与 lead1/lead2/trail 同 class，兼容旧代码
 */
export const TABLE_STICKY_COL = {
  lead1: "sticky-col-lead-1",
  lead2: "sticky-col-lead-2",
  lead3: "sticky-col-lead-3",
  trail: "sticky-col-trail",
  order: "sticky-col-lead-1",
  customer: "sticky-col-lead-2",
  actions: "sticky-col-trail",
} as const

export type TableStickyLeads = 0 | 1 | 2 | 3
export type TableGridLines = "none" | "columns" | "rows" | "all"

const tableVariants = cva("w-full text-sm", {
  variants: {
    layout: {
      default: "",
      wide: "min-w-[80rem] border-separate border-spacing-0",
    },
  },
  defaultVariants: {
    layout: "default",
  },
})

const cellDensity = cva("", {
  variants: {
    density: {
      default: "px-4 py-3.5",
      comfortable: "px-4 py-3",
    },
    align: {
      left: "text-left",
      right: "text-right",
      center: "text-center",
    },
  },
  defaultVariants: {
    density: "default",
    align: "left",
  },
})

const headDensity = cva("", {
  variants: {
    density: {
      default: "px-4 py-2.5",
      comfortable: "px-4 py-2",
    },
    align: {
      left: "text-left",
      right: "text-right",
      center: "text-center",
    },
  },
  defaultVariants: {
    density: "default",
    align: "left",
  },
})

type TableProps = React.ComponentProps<"table"> &
  VariantProps<typeof tableVariants> & {
    /** 外层横向滚动容器 class */
    containerClassName?: string
    /** 外层固定边框。边框放在滚动容器上，避免横向滚动时 table 外框被滚走。 */
    frame?: boolean
    /** 单元格网格线：列线、行线或完整网格。 */
    gridLines?: TableGridLines
    /** 宽表横向滚动（销售单/退货单等列表） */
    scroll?: boolean
    /** 纵向滚动时固定表头；宽表默认启用，仍保持表头/表体同一个横向滚动容器。 */
    stickyHeader?: boolean
    /** 启用 sticky 列布局（加 `.def-data-table`） */
    stickyLayout?: boolean
    /** 左侧固定列数量：0=仅 trail；1/2/3=单号+关联单+客户等 */
    stickyLeads?: TableStickyLeads
  }

function Table({
  className,
  containerClassName,
  children,
  frame = true,
  gridLines = "all",
  layout,
  scroll,
  stickyHeader,
  stickyLayout,
  stickyLeads = 0,
  ...props
}: TableProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const stickyHeaderRef = React.useRef<HTMLDivElement>(null)
  const [hasStartShadow, setHasStartShadow] = React.useState(false)
  const [hasEndShadow, setHasEndShadow] = React.useState(false)
  const needsScroll = scroll ?? (layout === "wide" || Boolean(stickyLayout))
  const shouldStickHeader = stickyHeader ?? Boolean(stickyLayout || needsScroll)
  const leads: TableStickyLeads =
    stickyLayout && stickyLeads === 0 ? 2 : stickyLeads
  const childArray = React.Children.toArray(children)
  const colgroupNode = childArray.find((child) => (
    React.isValidElement(child) && child.type === "colgroup"
  ))
  const headerNode = childArray.find((child) => (
    React.isValidElement(child)
    && (child.type === TableHeader
      || child.type === "thead"
      || (typeof child.type === "function" && child.type.name === "TableHeader"))
  ))
  const tableClassName = cn(
    tableVariants({ layout }),
    "def-table border-separate border-spacing-0",
    stickyLayout && "def-data-table",
    className,
  )
  const updateScrollShadow = React.useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const canScroll = el.scrollWidth > el.clientWidth + 1
    const shouldShowStart = canScroll && el.scrollLeft > 0
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    const shouldShowEnd = canScroll && el.scrollLeft < maxScrollLeft - 1
    if (stickyHeaderRef.current) {
      stickyHeaderRef.current.scrollLeft = el.scrollLeft
    }
    setHasStartShadow((current) => (
      current === shouldShowStart ? current : shouldShowStart
    ))
    setHasEndShadow((current) => (
      current === shouldShowEnd ? current : shouldShowEnd
    ))
  }, [])

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || !needsScroll || !stickyLayout) return
    updateScrollShadow()
    el.addEventListener("scroll", updateScrollShadow, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollShadow)
    resizeObserver.observe(el)
    return () => {
      el.removeEventListener("scroll", updateScrollShadow)
      resizeObserver.disconnect()
    }
  }, [needsScroll, stickyLayout, updateScrollShadow])

  return (
    <div
      className="def-table-shell relative w-full"
      data-scroll-end-shadow={hasEndShadow ? "" : undefined}
    >
      {shouldStickHeader && headerNode ? (
        <div className="def-table-sticky-header-proxy">
          <div
            ref={stickyHeaderRef}
            className={cn(
              "def-table-sticky-header-proxy-scroll",
              frame && "border-x border-t border-border/50",
            )}
          >
            <table
              data-slot="table-sticky-header"
              data-grid-lines={gridLines}
              data-sticky-header=""
              data-sticky-leads={stickyLayout ? leads : undefined}
              className={tableClassName}
              style={props.style}
            >
              {colgroupNode}
              {headerNode}
            </table>
          </div>
        </div>
      ) : null}
      <div
        ref={containerRef}
        data-scroll-start-shadow={hasStartShadow ? "" : undefined}
        className={cn(
          "def-table-scroll-frame relative w-full",
          needsScroll && "max-w-full overflow-x-auto",
          frame && "border border-border/50",
          containerClassName,
        )}
      >
        <table
          data-slot="table"
          data-grid-lines={gridLines}
          data-sticky-header={shouldStickHeader ? "" : undefined}
          data-sticky-leads={stickyLayout ? leads : undefined}
          className={tableClassName}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-border/50 bg-background", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border/50 bg-background", className)}
      {...props}
    />
  )
}

function TableRow({
  className,
  interactive,
  ...props
}: React.ComponentProps<"tr"> & { interactive?: boolean }) {
  return (
    <tr
      data-slot="table-row"
      className={cn("hover:bg-background", interactive && "cursor-pointer", className)}
      {...props}
    />
  )
}

function TableHead({
  className,
  density,
  align,
  ...props
}: React.ComponentProps<"th"> & VariantProps<typeof headDensity>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 border-b border-border/50 text-sm font-semibold whitespace-nowrap text-foreground",
        headDensity({ density, align }),
        className,
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  density,
  align,
  ...props
}: React.ComponentProps<"td"> & VariantProps<typeof cellDensity>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(cellDensity({ density, align }), className)}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export type TableHeadFilterOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export type TableHeadFilterProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: TableHeadFilterOption[]
  className?: string
  disabled?: boolean
  /** 「全部」选项文案 */
  allLabel?: string
  /** 「全部」选项值，默认 all */
  allValue?: string
}

/** 表头列筛选：列名 + 筛选图标，下拉样式由 index.css `.def-table-head-filter-*` 统一 */
function TableHeadFilter({
  label,
  value,
  onValueChange,
  options,
  className,
  disabled,
  allLabel = "全部",
  allValue = "all",
}: TableHeadFilterProps) {
  const active = value !== allValue && value !== ""

  return (
    <TableHead
      data-slot="table-head-filter"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            data-filter-active={active ? "" : undefined}
            className="def-table-head-filter-trigger"
            aria-label={`筛选${label}`}
          >
            <span className="whitespace-nowrap">{label}</span>
            <ListFilter className="size-3 shrink-0" strokeWidth={2} aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="def-table-head-filter-menu">
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            <DropdownMenuRadioItem value={allValue}>{allLabel}</DropdownMenuRadioItem>
            {options.map((opt) => (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  )
}

/** @deprecated 使用 TableHeadFilter */
const TableColumnFilter = TableHeadFilter

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableHeadFilter,
  TableColumnFilter,
  tableVariants,
}
