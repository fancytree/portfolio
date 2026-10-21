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

// Tier 1 —— 原子 token。字号对齐案例内容区：正文 Geist，标题 Oswald。
export const fontFamily = {
  sans: 'var(--font-geist-sans), Geist, system-ui, sans-serif',
  system: 'var(--font-geist-sans), Geist, system-ui, sans-serif',
  display: 'var(--font-oswald), Oswald, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const fontSize = {
  /** 左侧导航眉题、返回 */
  '2xs': '10px',
  /** 块名和左侧导航章节 */
  spec: '11px',
  xs: '12px',
  sm: '14px',
  /** 卡片内文、导航标题、文末链接 */
  card: '15px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '24px',
  '2xl': '24px',
  '3xl': '36px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '60px',
  '7xl': '60px',
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
  '14': '14px',
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
  // 比例。relaxed 是 18px 正文的 1.625（29.25px），title 是 60px 标题的 1.05（63px）。
  none: 1,
  title: 1.05,
  /** 样式页章节标题 */
  chapter: 1.14,
  /** 左侧导航项目名 */
  navTitle: 1.25,
  /** 样式页块名、统计说明 */
  spec: 1.4,
  tight: 1.2,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export const letterSpacing = {
  tight: '-0.32px',
  normal: '0',
  label: '0.8px',
  /** At a glance */
  glance: '-0.025em',
  /** 按钮下的标签 */
  tag: '0.05em',
  /** Prose / Stats 块名 */
  spec: '0.14em',
  /** 统计数字 */
  stat: '-0.03em',
  /** 统计说明 */
  statLabel: '0.08em',
  navBack: '0.08em',
  navKicker: '0.12em',
  navTitle: '-0.02em',
  navItem: '0.06em',
  wide: '1px',
  wider: '2px',
} as const;

// Tier 2 —— 语义文字色别名
export const textColor = {
  /** 正文主色 */
  primary: '#000000',
  /** 纯黑，用于标题 */
  strong: '#000000',
  /** 卡片正文，约 75% 黑 */
  secondary: 'rgb(0 0 0 / 0.75)',
  /** 眉题、介绍、说明 */
  muted: 'rgb(0 0 0 / 0.58)',
  /** 引用等深灰 */
  subtle: 'oklch(0.4 0 0)',
  /** 在暗色背景上的文字 */
  inverse: '#FFFFFF',
  /** 首页强调色 */
  accentLime: '#ed5b2b',
} as const;

// Tier 3 —— 文字样式预设（纯 typography scale）
// preset 不写 color 和 margin。字体由 fontFamily.display（标题）和 fontFamily.sans（正文）决定。
export const textStyle = {
  /** 开场标题 60 / 1.05，桌面主标题 */
  displayXl: {
    fontSize: fontSize['6xl'],
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.regular,
  },
  /** 次级大标题 36 / 1.05 */
  displayLg: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.regular,
  },
  /** H1 60 / 1.05 */
  h1: {
    fontSize: fontSize['6xl'],
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.regular,
  },
  /** H2 36 / 1.05 */
  h2: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.regular,
  },
  /** 卡片标题 24 / 1 */
  h3: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.regular,
  },
  /** 卡片标题 24 / 1 */
  h3Medium: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.regular,
  },
  /** 问句标题 20 / 1.15 */
  h4: {
    fontSize: fontSize.lg,
    lineHeight: 1.15,
    fontWeight: fontWeight.regular,
  },
  /** 信息值 18 / 1 */
  h5: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.regular,
  },
  /** 标题下介绍 18 / 1.625 */
  lead: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 介绍 18 / 1.625 */
  leadSm: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 正文 18 / 1.625 */
  body: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 正文 18 / 1.625 */
  bodyLight: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 正文 18 / 1.625 */
  bodyReading: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 卡片内文 15 / 1.625 */
  bodySm: {
    fontSize: fontSize.card,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 图注 14 / 1.625 */
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  /** 眉题 16 / 1，字距 0.8px */
  overline: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.label,
    textTransform: 'uppercase' as const,
  },
  /** 样式页 At a glance，16 / 1 */
  caseGlance: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.glance,
    textTransform: 'uppercase' as const,
  },
  /** 按钮下的描边标签，14 / 1 */
  caseTag: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.tag,
    textTransform: 'uppercase' as const,
  },
  /** 样式页块名，11 / 1.4 */
  caseSpec: {
    fontSize: fontSize.spec,
    lineHeight: lineHeight.spec,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.spec,
    textTransform: 'uppercase' as const,
  },
  /** 统计数字 */
  caseStat: {
    fontSize: 'clamp(28px, 3vw, 36px)',
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.stat,
  },
  /** 统计说明，12 / 1.4 */
  caseStatLabel: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.spec,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.statLabel,
    textTransform: 'uppercase' as const,
  },
  /** 左侧导航返回，10px。眉题同字号，字距用 letterSpacing.navKicker。 */
  caseNavMeta: {
    fontSize: fontSize['2xs'],
    lineHeight: lineHeight['14'],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.navBack,
    textTransform: 'uppercase' as const,
  },
  /** 左侧导航项目名，15px */
  caseNavTitle: {
    fontSize: fontSize.card,
    lineHeight: lineHeight.navTitle,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.navTitle,
    textTransform: 'uppercase' as const,
  },
  /** 左侧导航章节，11px */
  caseNavItem: {
    fontSize: fontSize.spec,
    lineHeight: lineHeight['16'],
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.navItem,
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
