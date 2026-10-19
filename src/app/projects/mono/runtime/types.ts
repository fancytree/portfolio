export interface TransactionLocation { country?: string | null; city?: string | null; district?: string | null; address?: string | null; coordinates?: string | null; }
export interface AIParsedTransaction { amount: number; type?: "income" | "expense"; currency?: string | null; category: string; sub_category?: string | null; merchant?: string | null; title?: string | null; date: string; location?: TransactionLocation | null; note?: string | null; recurring?: { period: "weekly" | "monthly" | "quarterly" | "yearly"; day_of_week?: number; day_of_month?: number; month_of_year?: number; time_of_day?: string; timezone?: string; } | null; }
export type ChartType = "bar" | "line" | "sparkline" | "donut";
export interface ChartDataPoint { label: string; value: number; color?: string; }
export interface InsightCard { id: string; title: string; subtitle?: string; chartType: ChartType; data: ChartDataPoint[]; summary: string; tags: string[]; animateIn?: boolean; payload?: { type?: string }; }
