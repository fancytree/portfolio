"use client";

type BudgetStatusData = { category: string; limit: number; spent: number; remaining: number; period: string; progress_percentage: number; status: "normal" | "warning" | "critical"; purchase_amount?: number; before_spent?: number; before_progress?: number; };
import { useDisplayCurrency } from "../contexts/DisplayCurrencyContext";
import { formatAmountShort } from "../format-currency";

export interface BudgetStatusCardProps {
  props: BudgetStatusData;
}

export default function BudgetStatusCard({ props }: BudgetStatusCardProps) {
  const {
    category, limit, spent, remaining, period, progress_percentage, status,
    purchase_amount, before_spent, before_progress,
  } = props;
  const { displayCurrency } = useDisplayCurrency();
  const currency = (displayCurrency ?? "USD").toUpperCase();

  const isAfford = typeof purchase_amount === "number" && purchase_amount > 0 && typeof before_progress === "number";
  const beforePct = isAfford ? Math.min(100, Math.max(0, Math.round(before_progress! * 100) / 100)) : 0;
  const afterPct = Math.min(100, Math.max(0, Math.round(progress_percentage * 100) / 100));

  const statusColors = {
    normal: "bg-chart-series-1",
    warning: "bg-[var(--color-chart-series-4)]",
    critical: "bg-status-danger",
  };
  const barColor = statusColors[status] ?? statusColors.normal;

  if (isAfford) {
    const deltaColor = status === "critical"
      ? "bg-status-danger"
      : status === "warning"
        ? "bg-[var(--color-chart-series-4)]"
        : "bg-[var(--color-budget-growth)]";
    const beforeSpentVal = typeof before_spent === "number" ? before_spent : spent - purchase_amount!;

    return (
      <div className="w-full max-w-[420px] rounded-xl border border-border-default bg-chat-card-inner px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-semibold text-text-primary">{category}</span>
          <span className="text-xs text-text-secondary">{period}</span>
        </div>

        {/* 核心数值：购买后 spent / limit / remaining */}
        <div className="mb-2 flex flex-wrap items-baseline gap-2 text-sm text-text-secondary">
          <span>{formatAmountShort(spent, currency)}</span>
          <span className="text-text-secondary">/</span>
          <span>{formatAmountShort(limit, currency)}</span>
          <span className={`font-medium ${remaining < 0 ? "text-status-danger" : "text-text-primary"}`}>
            · {remaining < 0 ? `${formatAmountShort(Math.abs(remaining), currency)} over` : `${formatAmountShort(remaining, currency)} left`}
          </span>
        </div>

        {/* 单条进度条：已有部分(实色) + 购买增量(半透明) */}
        <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-label={`${category} budget used after purchase`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={afterPct}>
          <div
            className="absolute left-0 top-0 h-full rounded-l-full bg-text-brand"
            style={{ width: `${beforePct}%` }}
          />
          {afterPct > beforePct && (
            <div
              className={`absolute top-0 h-full rounded-r-full ${deltaColor}`}
              style={{
                left: `${beforePct}%`,
                width: `${Math.min(afterPct - beforePct, 100 - beforePct)}%`,
              }}
            />
          )}
        </div>

        {/* 底部：legend + 百分比变化 */}
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-text-brand" />
              {formatAmountShort(beforeSpentVal, currency)} spent
            </span>
            <span className="flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${deltaColor}`} />
              +{formatAmountShort(purchase_amount!, currency)}
            </span>
          </div>
          <span>{beforePct}% → {afterPct}%</span>
        </div>
      </div>
    );
  }

  // 普通模式
  const pct = afterPct;
  return (
    <div className="w-full max-w-[420px] rounded-xl border border-border-default bg-chat-card-inner px-4 py-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-text-primary">{category}</span>
        <span className="text-xs text-text-secondary">{period}</span>
      </div>
      <div className="mb-2 flex flex-wrap items-baseline gap-2 text-sm text-text-secondary">
        <span>Spent {formatAmountShort(spent, currency)}</span>
        <span className="text-text-secondary">/</span>
        <span>Limit {formatAmountShort(limit, currency)}</span>
        <span className="text-text-primary font-medium">· {formatAmountShort(remaining, currency)} left</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-label={`${category} budget used`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-text-secondary mt-1.5">{pct}% used</p>
    </div>
  );
}
