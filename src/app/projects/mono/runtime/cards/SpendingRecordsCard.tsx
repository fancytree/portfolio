"use client";

import { useState } from "react";
import { List, PieChart } from "lucide-react";
import MiniChart from "../insights/MiniChart";
import RegistryButton from "./RegistryButton";
import { formatAmountShort } from "../format-currency";

/** 单条交易用于列表展示（id 用于编辑/删除时定位） */
export interface RecordItem {
  id?: string;
  category: string;
  description: string;
  amount: string;
  date: string;
  type: "income" | "expense";
}

/** 图表数据点 */
export interface ChartPoint {
  label: string;
  value: number;
  color?: string;
}

/** all = Records summary（收入+支出）；expense = 仅支出；income = 仅收入 */
export type RecordTypeMode = "all" | "expense" | "income";

interface SpendingRecordsCardProps {
  title: string;
  subtitle: string;
  transactionItems: RecordItem[];
  chartData: ChartPoint[];
  /** 收入/支出分开展示时传入 */
  incomeItems?: RecordItem[];
  expenseItems?: RecordItem[];
  incomeChartData?: ChartPoint[];
  expenseChartData?: ChartPoint[];
  incomeTotalStr?: string;
  expenseTotalStr?: string;
  /** all=Records summary，expense=仅支出，income=仅收入 */
  recordType?: RecordTypeMode;
  /** 为 true 时只显示列表，不显示 Breakdown/List 切换（如按某 category/merchant 查询时） */
  listOnly?: boolean;
  /** 主内容下方数据总结：今日合计、今日较昨日绝对变化、本周合计、本周较上周百分比变化 */
  summaryTodayTotal?: number;
  summaryTodayTrendAbs?: number;
  summaryWeekTotal?: number;
  summaryWeekTrendPct?: number;
  summaryCurrency?: string;
  /** 后端计算的周期净额（与文案一致），List 视图下优先使用以与气泡文案统一 */
  summaryPeriodNetTotal?: number;
  summaryPeriodNetCurrency?: string;
  /** 后端精确计算的收入/支出数值总额（显示币种），避免前端从格式化字符串反向解析导致多币种误差 */
  incomeTotalNum?: number;
  expenseTotalNum?: number;
  /** 可选：列表行悬停时显示编辑/删除（需 item 带 id） */
  onEditRecord?: (id: string) => void;
  onDeleteRecord?: (id: string) => void;
}

function normalizeChart(d: ChartPoint[]): ChartPoint[] {
  return (d || [])
    .map((x) => ({ label: String(x.label), value: Number(x.value) || 0, color: x.color }))
    .filter((x) => x.value > 0);
}

/** 从 RecordItem 列表解析并求和金额（取绝对值后相加），用于单类列表的 Total */
function sumItemsAmount(items: RecordItem[]): number {
  return items.reduce((sum, item) => {
    const raw = String(item.amount).replace(/[^0-9.-]/g, "");
    const num = parseFloat(raw) || 0;
    return sum + Math.abs(num);
  }, 0);
}

/** 带正负的合计：收入为正、支出为负，用于 List 视图下收入+支出合并时的 Net Total */
function sumItemsAmountSigned(items: RecordItem[]): number {
  return items.reduce((sum, item) => {
    const raw = String(item.amount).replace(/[^0-9.-]/g, "");
    const num = parseFloat(raw) || 0;
    const abs = Math.abs(num);
    return sum + (item.type === "income" ? abs : -abs);
  }, 0);
}

/** Breakdown 视图下 Expense / Income 切换标签：Expense · -$61.30 / Income · +$4,200 */
function BreakdownTab({
  active,
  type,
  label,
  totalStr,
  onClick,
}: {
  active: boolean;
  type: "expense" | "income";
  label: string;
  totalStr?: string | null;
  onClick: () => void;
}) {
  const amountTone = type === "expense" ? "text-status-danger" : "text-status-success";
  const activeShell =
    type === "expense"
      ? "border-status-danger/40"
      : "border-status-success/40";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition-colors ${
        active
          ? `${activeShell} bg-transparent text-text-primary`
          : "border-border-subtle bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary"
      }`}
    >
      <span className="font-medium">{label}</span>
      {totalStr != null && totalStr !== "" && (
        <>
          <span className="text-text-secondary" aria-hidden>
            ·
          </span>
          <span
            className={`font-mono text-[11px] font-medium tabular-nums leading-none ${amountTone}`}
          >
            {totalStr}
          </span>
        </>
      )}
    </button>
  );
}

function renderItemList(
  items: RecordItem[],
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void
) {
  const showActions = Boolean((onEdit || onDelete) && items.some((i) => i.id));
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          className="group/record relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-hover focus-within:bg-surface-hover"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-primary font-medium truncate">
                {item.description}
              </span>
              <span className="shrink-0 rounded bg-surface-muted px-1.5 py-0.5 text-xs text-text-secondary">
                {item.category}
              </span>
            </div>
            {item.date && (
              <span className="text-xs text-text-secondary">{item.date}</span>
            )}
          </div>
          <div className="relative flex items-center shrink-0 justify-end">
            {(() => {
              const raw = String(item.amount ?? "");
              const approxIdx = raw.indexOf("≈");
              const hasConverted = approxIdx !== -1;
              const convertedRaw = hasConverted ? raw.slice(approxIdx).trim() : raw;
              const originalRaw = hasConverted ? raw.slice(0, approxIdx).trim() : "";
              // 去掉可能存在的括号，保证上下两行都无括号
              const converted = convertedRaw.replace(/^[()]+|[()]+$/g, "").trim();
              const original = originalRaw.replace(/^[()]+|[()]+$/g, "").trim();
              const colorClass =
                item.type === "income"
                  ? "text-status-success"
                  : "text-text-primary";
              return (
                <div
                  className={`flex flex-col items-end text-right font-mono transition-opacity group-hover/record:opacity-0 group-focus-within/record:opacity-0 ${colorClass}`}
                >
                  {/* 上：用户设置币种的金额（含 ≈），更大更粗 */}
                  <span className="text-sm font-semibold leading-tight">{converted}</span>
                  {/* 下：原始币种金额，更小更淡 */}
                  {hasConverted && original && (
                    <span className="text-xs font-normal leading-tight text-text-secondary">
                      {original}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
          {showActions && item.id && (onEdit || onDelete) && (
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-end gap-0.5 opacity-0 transition-opacity duration-150 group-hover/record:pointer-events-auto group-hover/record:opacity-100 group-focus-within/record:pointer-events-auto group-focus-within/record:opacity-100">
              {onEdit && (
                <RegistryButton
                  props={{
                    variant: "icon",
                    icon: "pencil",
                    size: "sm",
                    title: "Edit",
                    ariaLabel: "Edit record",
                    onClick: (event) => { event.stopPropagation(); onEdit(item.id!); },
                  }}
                />
              )}
              {onDelete && (
                <RegistryButton
                  props={{
                    variant: "icon",
                    tone: "danger",
                    icon: "trash",
                    size: "sm",
                    title: "Delete",
                    ariaLabel: "Delete record",
                    onClick: (event) => { event.stopPropagation(); onDelete(item.id!); },
                  }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SpendingRecordsCard({
  title,
  subtitle,
  transactionItems,
  chartData,
  incomeItems = [],
  expenseItems = [],
  incomeChartData = [],
  expenseChartData = [],
  incomeTotalStr,
  expenseTotalStr,
  recordType = "all",
  listOnly = false,
  summaryTodayTotal,
  summaryTodayTrendAbs,
  summaryWeekTotal,
  summaryWeekTrendPct,
  summaryCurrency = "USD",
  summaryPeriodNetTotal,
  summaryPeriodNetCurrency,
  incomeTotalNum,
  expenseTotalNum,
  onEditRecord,
  onDeleteRecord,
}: SpendingRecordsCardProps) {
  const [view, setView] = useState<"list" | "breakdown">("breakdown");
  /** Breakdown 下 Income / Expense tab，默认 Expense */
  const [breakdownTab, setBreakdownTab] = useState<"income" | "expense">("expense");

  /** recordType 为 expense/income 时只展示单类；all 时收入+支出分开展示 */
  const useSplit =
    recordType === "all" &&
    Array.isArray(incomeItems) &&
    Array.isArray(expenseItems) &&
    (incomeItems.length > 0 || expenseItems.length > 0);

  const fromSpec = normalizeChart(chartData);
  const fromList = (() => {
    if (fromSpec.length > 0 || !transactionItems.length) return [];
    const by: Record<string, number> = {};
    for (const item of transactionItems) {
      const num = parseFloat(String(item.amount).replace(/[^0-9.-]/g, "")) || 0;
      const cat = item.category || "Other";
      by[cat] = (by[cat] ?? 0) + Math.abs(num);
    }
    return Object.entries(by)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  })();
  const normalizedChartData = fromSpec.length > 0 ? fromSpec : fromList;
  const incomeNorm = normalizeChart(incomeChartData);
  const expenseNorm = normalizeChart(expenseChartData);
  const hasChart = normalizedChartData.length > 0;
  const hasList = transactionItems.length > 0;
  const hasAnySplit = useSplit && (incomeItems.length > 0 || expenseItems.length > 0);
  const showSplit = hasAnySplit && !listOnly;

  /** 仅列表模式（如按某 category/merchant 查询）：不显示 Breakdown/List 切换，只显示列表 */
  const showViewTabs = !listOnly && (hasList || hasChart || hasAnySplit);

  /** List 视图：收入与支出按时间混排（新→旧）；recordType 为 expense/income 时 transactionItems 已是单类 */
  const mergedListItems =
    showSplit
      ? [...incomeItems, ...expenseItems].sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        })
      : transactionItems;

  /** Breakdown、列表与 Total 均铺满父容器，避免图表卡片被固定宽度限制 */
  const contentWidthClass = "w-full min-w-0";

  /** 当前卡片展示的数据对应的 Total（优先使用后端精确数值，避免从格式化字符串反向解析导致多币种误差） */
  const displayTotal = (() => {
    if (listOnly) return Math.round((summaryTodayTotal ?? 0) * 100) / 100;
    if (useSplit) {
      if (view === "list") {
        if (typeof summaryPeriodNetTotal === "number") return summaryPeriodNetTotal;
        return Math.round(sumItemsAmountSigned(mergedListItems) * 100) / 100;
      }
      return breakdownTab === "expense"
        ? (typeof expenseTotalNum === "number" ? Math.abs(expenseTotalNum) : sumItemsAmount(expenseItems ?? []))
        : (typeof incomeTotalNum === "number" ? Math.abs(incomeTotalNum) : sumItemsAmount(incomeItems ?? []));
    }
    if (recordType === "expense") return typeof expenseTotalNum === "number" ? Math.abs(expenseTotalNum) : sumItemsAmount(expenseItems ?? []);
    if (recordType === "income") return typeof incomeTotalNum === "number" ? Math.abs(incomeTotalNum) : sumItemsAmount(incomeItems ?? []);
    if (view === "list" && recordType === "all") {
      if (typeof summaryPeriodNetTotal === "number") return summaryPeriodNetTotal;
      return Math.round(sumItemsAmountSigned(transactionItems) * 100) / 100;
    }
    return sumItemsAmount(transactionItems);
  })();
  /** Total 展示用的币种：有后端周期净额时与其一致 */
  const displayCurrencyForTotal =
    (view === "list" && (useSplit || recordType === "all") && summaryPeriodNetCurrency) || summaryCurrency;

  return (
    <div className="w-full min-w-0 flex flex-col">
      <div className={`flex items-center justify-between gap-3 ${contentWidthClass}`}>
        <div className="min-w-0 flex-1">
          {title && (
            <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
          )}
          {subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        {showViewTabs && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setView("breakdown")}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium ${
                view === "breakdown"
                  ? "bg-surface-muted text-text-primary border-border-default"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
              aria-pressed={view === "breakdown"}
            >
              <PieChart size={12} />
              Breakdown
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium ${
                view === "list"
                  ? "bg-surface-muted text-text-primary border-border-default"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              }`}
              aria-pressed={view === "list"}
            >
              <List size={12} />
              List
            </button>
          </div>
        )}
      </div>

      <div className={`mt-3 rounded-xl border border-border-default bg-chat-card-inner overflow-hidden px-3 py-4 ${contentWidthClass}`}>
        {listOnly ? (
          (() => {
            const list =
              recordType === "expense"
                ? expenseItems
                : recordType === "income"
                  ? incomeItems
                  : mergedListItems;
            return list.length > 0 ? (
              renderItemList(list, onEditRecord, onDeleteRecord)
            ) : (
              <p className="text-sm text-text-secondary py-4">No transactions in this period.</p>
            );
          })()
        ) : showSplit ? (
          view === "list" ? (
            mergedListItems.length > 0 ? (
              renderItemList(mergedListItems, onEditRecord, onDeleteRecord)
            ) : (
              <p className="text-sm text-text-secondary py-4">No transactions in this period.</p>
            )
          ) : (
            <>
              {/* Breakdown：Expense 左侧，Income 右侧，默认 Expense */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <BreakdownTab
                  active={breakdownTab === "expense"}
                  type="expense"
                  label="Expense"
                  totalStr={expenseTotalStr}
                  onClick={() => setBreakdownTab("expense")}
                />
                <BreakdownTab
                  active={breakdownTab === "income"}
                  type="income"
                  label="Income"
                  totalStr={incomeTotalStr}
                  onClick={() => setBreakdownTab("income")}
                />
              </div>
              {breakdownTab === "income" ? (
                <div
                  key="breakdown-income"
                  className="min-h-[180px] w-full flex items-center insight-fade-in"
                  style={{ minWidth: 260 }}
                >
                  {incomeNorm.length > 0 ? (
                    <MiniChart type="donut" data={incomeNorm} animate showValueInLegend currency={summaryCurrency ?? "USD"} />
                  ) : (
                    <p className="text-sm text-text-secondary">No income by category.</p>
                  )}
                </div>
              ) : (
                <div
                  key="breakdown-expense"
                  className="min-h-[180px] w-full flex items-center insight-fade-in"
                  style={{ minWidth: 260 }}
                >
                  {expenseNorm.length > 0 ? (
                    <MiniChart type="donut" data={expenseNorm} animate showValueInLegend currency={summaryCurrency ?? "USD"} />
                  ) : (
                    <p className="text-sm text-text-secondary">No expense by category.</p>
                  )}
                </div>
              )}
            </>
          )
        ) : recordType === "expense" ? (
          <>
            {view === "list" ? (
              expenseItems.length > 0 ? (
                renderItemList(expenseItems, onEditRecord, onDeleteRecord)
              ) : (
                <p className="text-sm text-text-secondary py-4">No expense in this period.</p>
              )
            ) : expenseNorm.length > 0 ? (
              <div className="min-h-[180px] w-full flex" style={{ minWidth: 260 }}>
                <MiniChart type="donut" data={expenseNorm} animate showValueInLegend currency={summaryCurrency ?? "USD"} />
              </div>
            ) : (
              <p className="text-sm text-text-secondary py-4">No expense by category.</p>
            )}
          </>
        ) : recordType === "income" ? (
          <>
            {view === "list" ? (
              incomeItems.length > 0 ? (
                renderItemList(incomeItems, onEditRecord, onDeleteRecord)
              ) : (
                <p className="text-sm text-text-secondary py-4">No income in this period.</p>
              )
            ) : incomeNorm.length > 0 ? (
              <div className="min-h-[180px] w-full flex" style={{ minWidth: 260 }}>
                <MiniChart type="donut" data={incomeNorm} animate showValueInLegend currency={summaryCurrency ?? "USD"} />
              </div>
            ) : (
              <p className="text-sm text-text-secondary py-4">No income by category.</p>
            )}
          </>
        ) : (
          <>
            {view === "list" && (
              hasList ? (
                renderItemList(transactionItems, onEditRecord, onDeleteRecord)
              ) : (
                <p className="text-sm text-text-secondary py-4">No transactions in this period.</p>
              )
            )}
            {view === "breakdown" && (
              hasChart ? (
                <div className="min-h-[180px] w-full flex" style={{ minWidth: 260 }}>
                  <MiniChart type="donut" data={normalizedChartData} animate showValueInLegend currency={summaryCurrency ?? "USD"} />
                </div>
              ) : (
                <p className="text-sm text-text-secondary py-4">
                  No spending by category in this period.
                </p>
              )
            )}
          </>
        )}
      </div>

      {/* 主内容下方：只保留 Total（当前卡片上数据的 total）；切换 Expense/Income 时随之变化 */}
      <div
        className={`mt-3 rounded-xl border border-border-default bg-chat-card-inner px-4 py-3 ${contentWidthClass}`}
      >
        <div className="text-xs uppercase tracking-wider text-text-secondary mb-1">
          Total
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-base font-semibold font-mono text-text-primary"
          >
            {formatAmountShort(displayTotal, displayCurrencyForTotal ?? "USD")}
          </span>
        </div>
      </div>
    </div>
  );
}
