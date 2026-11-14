import { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export type KpiSparklinePoint = {
  date: string;
  periodEnd: string;
  value: number;
};

type KpiSparklineProps = {
  points: KpiSparklinePoint[];
  label: string;
  color: string;
};

/** 销售和财务概览共用同一线型、面积填充及空态。 */
export default function KpiSparkline({ points, label, color }: KpiSparklineProps) {
  const gradientId = `kpi-spark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (!points.length) {
    return <div className="flex h-8 items-center text-xs text-muted-foreground">No trend yet</div>;
  }

  return (
    <div className="pointer-events-none h-8 w-full" role="img" aria-label={`${label} trend`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 5, right: 3, bottom: 3, left: 3 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            baseValue={0}
            dot={points.length === 1}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
