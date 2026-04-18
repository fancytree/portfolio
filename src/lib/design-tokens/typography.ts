/**
 * 全局字体设计令牌（Design Tokens — Typography）
 *
 * Tier 1: 原子 token（fontFamily / fontSize / fontWeight / lineHeight / letterSpacing）
 * Tier 2: 语义色 token（textColor）
 * Tier 3: 文字样式预设（textStyle.*），供组件/页面直接展开使用
 *
 * 使用范例：
 *   import { textStyle, textColor } from '@/lib/design-tokens';
 *   <h1 style={{ ...textStyle.h1, color: textColor.primary }}>Title</h1>
 */

import { Manrope } from 'next/font/google';

// 统一集中加载 Manrope，避免每个页面重复 new 实例
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Tier 1 —— 原子 token
export const fontFamily = {
  sans: manrope.style.fontFamily,
  system: 'system-ui, -apple-system, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '24px',
  '2xl': '28px',
  '3xl': '30px',
  '4xl': '32px',
  '5xl': '36px',
  '6xl': '40px',
  '7xl': '48px',
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  // 绝对值（与 Figma 对齐）
  '16': '16px',
  '20': '20px',
  '22': '22px',
  '24': '24px',
  '26': '26px',
  '28': '28px',
  '30': '30px',
  '32': '32px',
  '36': '36px',
  '38': '38px',
  '40': '40px',
  '44': '44px',
  '48': '48px',
  '52': '52px',
  // 比例（正文类）
  tight: 1.2,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.6,
} as const;

export const letterSpacing = {
  tight: '-0.32px',
  normal: '0',
  wide: '1px',
  wider: '2px',
} as const;

// Tier 2 —— 语义文字色别名
export const textColor = {
  /** 正文主色（非纯黑，降低对比度刺眼） */
  primary: '#171616',
  /** 纯黑，用于 H1/强调 */
  strong: 'rgb(0, 0, 0)',
  /** 次级/辅助，如副标题、说明 */
  secondary: '#6D6D7A',
  /** 更轻的静默灰 */
  muted: 'oklch(0.556 0 0)',
  /** 引用等深灰 */
  subtle: 'oklch(0.4 0 0)',
  /** 在暗色背景上的文字 */
  inverse: '#FFFFFF',
  /** 品牌强调色：JobNova 荧光绿 */
  accentLime: '#B0F809',
} as const;

// Tier 3 —— 文字样式预设（纯 typography scale）
// 重要：preset 故意不包含 fontFamily / color / margin；
//   - fontFamily：各详情页按自己的品牌调性注入（jobnova=Manrope，其余=system-ui）
//   - color / margin：由具体布局上下文决定
// 这样可以安全地在任意页面展开 `...textStyle.body`，不改变现有字体与布局
export const textStyle = {
  /** Hero 大标 40/52 light — 多数详情页顶部主标题 */
  displayXl: {
    fontSize: fontSize['6xl'],
    lineHeight: lineHeight['52'],
    fontWeight: fontWeight.light,
  },
  /** Section Display 40 + 2px 字距 — 如 Problems & solutions */
  displayLg: {
    fontSize: fontSize['6xl'],
    lineHeight: 'normal' as const,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
  },
  /** H1 36/44 medium */
  h1: {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['44'],
    fontWeight: fontWeight.medium,
  },
  /** H2 30/38 medium */
  h2: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['38'],
    fontWeight: fontWeight.medium,
  },
  /** H3 28/36 light — 章节内大标题 */
  h3: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['36'],
    fontWeight: fontWeight.light,
  },
  /** H3 24/32 medium — 子模块标题 */
  h3Medium: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight['32'],
    fontWeight: fontWeight.medium,
  },
  /** H4 20/28 medium */
  h4: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight['28'],
    fontWeight: fontWeight.medium,
  },
  /** 卡片标题 18/24 semibold */
  h5: {
    fontSize: fontSize.md,
    lineHeight: lineHeight['24'],
    fontWeight: fontWeight.semibold,
  },
  /** Hero / Section Lead 18/32 light — 长段落引语 */
  lead: {
    fontSize: fontSize.md,
    lineHeight: lineHeight['32'],
    fontWeight: fontWeight.light,
  },
  /** 次级 Lead 18/30 light */
  leadSm: {
    fontSize: fontSize.md,
    lineHeight: lineHeight['30'],
    fontWeight: fontWeight.light,
  },
  /** 正文 16/24 regular */
  body: {
    fontSize: fontSize.base,
    lineHeight: lineHeight['24'],
    fontWeight: fontWeight.regular,
  },
  /** 正文 16/24 light — hero 区下常用的 meta 段落 */
  bodyLight: {
    fontSize: fontSize.base,
    lineHeight: lineHeight['24'],
    fontWeight: fontWeight.light,
  },
  /** 正文 16/26 light — 阅读节奏偏舒缓 */
  bodyReading: {
    fontSize: fontSize.base,
    lineHeight: lineHeight['26'],
    fontWeight: fontWeight.light,
  },
  /** 小正文 14/22 regular */
  bodySm: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight['22'],
    fontWeight: fontWeight.regular,
  },
  /** Caption 14/20 light — meta 辅助文案 */
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight['20'],
    fontWeight: fontWeight.light,
  },
  /** Overline 12 semibold uppercase — 模块 eyebrow */
  overline: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight['16'],
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  /** 数字 statistic 40-64 medium — 大统计数字 */
  statisticLg: {
    fontSize: 'clamp(40px, 8vw, 64px)',
    lineHeight: 'normal' as const,
    fontWeight: fontWeight.medium,
  },
} as const;

export type TextStyleToken = keyof typeof textStyle;
export type TextColorToken = keyof typeof textColor;
