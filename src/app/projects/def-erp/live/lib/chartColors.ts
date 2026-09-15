// Copied from the DEF ERP repository (web/src/lib/chartColors.ts). Keep in sync; do not edit the logic here.
export const chartColors = {
  grid: 'var(--border)',
  axis: 'var(--muted-foreground)',
  /** 净收入面积（销售概览等） */
  netRevenue: 'var(--success)',
  netRevenueArea: 'color-mix(in oklch, var(--success) 14%, transparent)',
  /** 品牌主色序列（非净收入） */
  primary: 'var(--primary)',
  primaryArea: 'color-mix(in oklch, var(--primary) 14%, transparent)',
  /** 次要折线（销售额等） */
  secondary: 'var(--chart-3)',
  /** 负面序列：退款、扣减 */
  negative: 'var(--destructive)',
  /** 入库 / 正向库存 */
  inbound: 'var(--success)',
  /** 出库 */
  outbound: 'var(--chart-4)',
} as const;
