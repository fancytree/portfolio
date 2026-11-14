import type { ReactNode } from 'react';

type KpiTrendCardProps = {
  label: string;
  value: string;
  context: string | { label: string; value?: string };
  children: ReactNode;
};

/** 列表概览指标：对比说明与趋势图各占一行，窄卡也不会互相遮挡。 */
export default function KpiTrendCard({ label, value, context, children }: KpiTrendCardProps) {
  return (
    <div className="flex min-h-36 min-w-0 flex-col rounded-xl bg-muted px-4 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-foreground 2xl:text-2xl">{value}</p>
      <p className="mt-2 text-xs leading-4 text-muted-foreground">
        {typeof context === 'string' ? context : (
          <span className="flex items-baseline justify-between gap-2">
            <span className="min-w-0 truncate">{context.label}</span>
            {context.value && <span className="shrink-0 font-medium text-foreground">{context.value}</span>}
          </span>
        )}
      </p>
      <div className="mt-auto pt-2">{children}</div>
    </div>
  );
}
