"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Tag, Award } from "lucide-react";
import MiniChart from "../insights/MiniChart";
import type { InsightCard, ChartDataPoint } from "../types";

/** 点击图表分类时触发，用于让 Chat 自动发送「显示本周所有 X 账单」并由 AI 过滤记录 */
export type OnCategoryClick = (categoryLabel: string) => void;

/** 点击主动洞察卡片上的操作按钮时触发（如一键退订、调整预算），prompt 可发给对话 */
export type OnActionButtonClick = (label: string, prompt?: string) => void;

interface InsightCardComponentProps {
  insight: InsightCard;
  index: number;
  /** 可选：点击饼图/柱状图某分类时调用，由父级发送隐藏指令 */
  onCategoryClick?: OnCategoryClick;
  /** 可选：点击 action_buttons 时调用，用于将 prompt 发送到对话 */
  onActionButtonClick?: OnActionButtonClick;
  /** 右侧栏宽度较窄时缩小环形图，为分类图例留出空间 */
  compactChart?: boolean;
  /** 用于紧凑圆环图例中的金额格式化 */
  currency?: string;
}

// 排行单项：带序号、名称、数值与浮现动画
function RankingList({
  data,
  animate,
  indexOffset = 0,
}: {
  data: ChartDataPoint[];
  animate?: boolean;
  indexOffset?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-1.5">
      {data.map((point, i) => (
        <li
          key={`${point.label}-${i}`}
          className="flex items-center gap-3 rounded-lg bg-chat-card-outer px-3 py-2.5 border border-border-default"
          style={
            animate
              ? {
                  animation: "insightCardEnter 0.4s ease-out both",
                  animationDelay: `${(indexOffset + i) * 0.06}s`,
                }
              : undefined
          }
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-text-primary tabular-nums"
            aria-hidden
          >
            {i + 1}
          </span>
          <span className="flex-1 min-w-0 truncate text-sm text-text-primary">
            {point.label}
          </span>
          <span className="text-xs font-medium text-text-secondary tabular-nums">
            {point.value}×
          </span>
          {/* 迷你进度条 */}
          <div className="hidden sm:block w-14 h-1.5 rounded-full bg-border-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-chart-series-1 transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, (point.value / maxValue) * 100)}%`,
                animation: animate ? "insightFadeIn 0.5s ease-out both" : undefined,
                animationDelay: animate ? `${(indexOffset + i) * 0.06 + 0.2}s` : undefined,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function InsightCardComponent({
  insight,
  index,
  onCategoryClick,
  onActionButtonClick,
  compactChart = false,
  currency,
}: InsightCardComponentProps) {
  const [expanded, setExpanded] = useState(true);
  const mode = insight.payload?.type;
  const isPie = mode === "pie";
  const isRanking = mode === "ranking";
  const hasChartData = insight.data.some((point) => Number.isFinite(point.value) && point.value > 0);

  /** 点击数据点时下发「显示本周所有 X 账单」指令 */
  const handleDataPointClick = onCategoryClick
    ? (point: ChartDataPoint) => onCategoryClick(point.label)
    : undefined;

  return (
    <div
      className="insight-card-enter rounded-xl border border-border-default bg-chat-card-inner overflow-hidden"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* 卡片头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
      >
        <div className="text-left min-w-0">
          <h4 className="text-sm font-medium text-text-primary truncate">
            {insight.title}
          </h4>
          {insight.subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">
              {insight.subtitle}
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-text-secondary shrink-0 ml-2" />
        ) : (
          <ChevronDown size={14} className="text-text-secondary shrink-0 ml-2" />
        )}
      </button>

      {/* 可折叠内容 */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* 按 payload.type 切换：pie → MiniChart 饼图，ranking → 排行列表 */}
        {hasChartData && <div className="px-3 pb-3">
          {isPie && (
            <MiniChart
              type="donut"
              data={insight.data}
              animate={insight.animateIn}
              onDataPointClick={handleDataPointClick}
              compact={compactChart}
              showValueInLegend={compactChart}
              currency={currency}
            />
          )}
          {isRanking && (
            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-2 px-1 text-text-secondary">
                <Award size={12} aria-hidden />
                <span className="text-xs uppercase tracking-wider">Ranking</span>
              </div>
              <RankingList
                data={insight.data}
                animate={insight.animateIn}
                indexOffset={index * 3}
              />
            </div>
          )}
          {!isPie && !isRanking && (
            <MiniChart
              type={insight.chartType}
              data={insight.data}
              animate={insight.animateIn}
              onDataPointClick={handleDataPointClick}
              compact={compactChart}
            />
          )}
        </div>}

        {/* 分析摘要 */}
        {insight.summary && (
          <div className="px-4 pb-3">
            <p className="text-xs text-text-secondary leading-relaxed">
              {insight.summary}
            </p>
          </div>
        )}

        {/* 标签 */}
        {insight.tags.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 pb-3 flex-wrap">
            {insight.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-white/5"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
