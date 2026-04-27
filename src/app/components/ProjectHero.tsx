'use client';

// 项目详情页通用 Hero 组件 —— 封装 MemQ 风格的"返回按钮 + 可展开项目概览 + H1 + 描述"。
// 该组件只负责渲染 Hero 的内层结构，外层 <section>（背景/全宽突破/上下 padding）
// 和 <ScrollAnimatedSection>（入场动画）仍保留在各详情页中，避免本次抽组件对页面布局产生连锁影响。

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fontFamily, textStyle } from '@/lib/design-tokens';

export type ProjectHeroProps = {
  /** "← Back to Work" 链接的目标路径，默认回到首页 */
  backHref?: string;
  /** 折叠状态下显示的角色 / 时间线一行（例："Founding Product Designer · AI Startup · 2025 – Present"） */
  roleSummary: string;
  /** 展开后显示的细节信息行；通常 1-3 行，每行用 " · " 分隔多个标签 */
  roleDetails?: string[];
  /** 项目标题（H1） */
  title: string;
  /** Hero 区描述段落 */
  description: string;
  /** 描述段落的最大宽度，默认与 MemQ 顶部一致的 645px */
  descriptionMaxWidth?: number | string;
  /** 内容容器最大宽度，默认 1280px */
  containerMaxWidth?: number | string;
  /** 折叠状态下默认是否展开（用于初始 SSR 或调试），默认 false */
  defaultExpanded?: boolean;
};

/**
 * Hero 区通用组件。
 * 字号节奏沿用 MemQ 详情页：
 * - 角色行 14/24 light
 * - H1 28/60 light（与 design-tokens 中的 textStyle.h1 不一致是有意为之，保留 MemQ 顶部的视觉感）
 * - 描述使用 textStyle.lead
 */
export default function ProjectHero({
  backHref = '/',
  roleSummary,
  roleDetails = [],
  title,
  description,
  descriptionMaxWidth = '645px',
  containerMaxWidth = '1280px',
  defaultExpanded = false,
}: ProjectHeroProps) {
  // 项目概览折叠状态
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // 仅作为 Manrope 字体家族的简写，便于与现有页面其它区块的 ...fontStyle 保持一致
  const fontStyle = { fontFamily: fontFamily.sans } as const;

  return (
    <div
      style={{
        maxWidth: containerMaxWidth,
        margin: '0 auto',
      }}
    >
      {/* 返回按钮 */}
      <Link
        href={backHref}
        style={{
          ...fontStyle,
          ...textStyle.body,
          color: 'oklch(0.556 0 0)',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '48px',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgb(0, 0, 0)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'oklch(0.556 0 0)')}
      >
        ← Back to Work
      </Link>

      {/* Project Overview 可展开信息卡片 */}
      <div style={{ paddingTop: '0px' }}>
        {/* 上面一行：角色 / 时间线 + 展开按钮 */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            paddingBottom: '0',
            gap: '4px',
            transition: 'padding-bottom 0.4s ease-out',
            height: 'fit-content',
          }}
        >
          <div
            style={{
              ...fontStyle,
              fontSize: '14px',
              lineHeight: '24px',
              fontWeight: 300,
              color: 'rgba(102, 102, 102, 1)',
            }}
          >
            {roleSummary}
          </div>
          {/* 仅在有展开内容时显示箭头按钮，避免出现一个永远展不出东西的按钮 */}
          {roleDetails.length > 0 && (
            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}
              aria-label={isExpanded ? 'Collapse project overview' : 'Expand project overview'}
              aria-expanded={isExpanded}
            >
              <Image src="/expand.svg" alt="Expand" width={24} height={24} />
            </button>
          )}
        </div>

        {/* 展开内容 */}
        {roleDetails.length > 0 && (
          <div
            style={{
              maxHeight: isExpanded ? '500px' : '0',
              overflow: 'hidden',
              transition:
                'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              paddingTop: isExpanded ? '12px' : '0',
            }}
          >
            <div className="flex flex-col" style={{ gap: '6px' }}>
              {roleDetails.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    ...fontStyle,
                    ...textStyle.body,
                    color: 'oklch(0.556 0 0)',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 项目标题与描述 */}
        <div style={{ marginTop: '16px' }}>
          <h1
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '60px',
              fontWeight: 300,
              color: 'rgb(0, 0, 0)',
              marginBottom: '12px',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              ...fontStyle,
              ...textStyle.lead,
              color: 'rgba(0, 0, 0, 1)',
              marginBottom: '32px',
              maxWidth: descriptionMaxWidth,
              height: '100%',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
