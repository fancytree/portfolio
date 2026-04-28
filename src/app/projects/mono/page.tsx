'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../../components/Button';
import { fontFamily, textStyle } from '@/lib/design-tokens';
import MonoComponentShowcase from './MonoComponentShowcase';

// 自定义 hook：检测元素是否进入视口并触发动画
function useScrollAnimation(initialDelay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px',
        }
      );

      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          setIsVisible(true);
        } else {
          observer.observe(ref.current);
        }
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, initialDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [initialDelay]);

  return { ref, isVisible };
}

// ScrollAnimatedSection 组件：包装内容并应用滚动动画
function ScrollAnimatedSection({ children, initialDelay = 0 }: { children: React.ReactNode; initialDelay?: number }) {
  const { ref, isVisible } = useScrollAnimation(initialDelay);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(48px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
}

// Mono 项目详情页：The Intent-Driven Generative UI Financial Agent
export default function MonoProjectPage() {
  const fontStyle = {
    fontFamily: fontFamily.system,
  };

  // 展开/折叠状态
  const [isExpanded, setIsExpanded] = useState(false);
  // Design token color mode switcher
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  // Mono 站点登录提示弹窗
  const [isMonoLoginModalOpen, setIsMonoLoginModalOpen] = useState(false);

  return (
    <div className="w-full" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Hero Section */}
      <section 
        className="w-screen"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        <ScrollAnimatedSection initialDelay={200}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
            {/* 返回按钮 */}
            <Link 
              href="/"
              style={{
                ...fontStyle,
                ...textStyle.body,
                color: 'oklch(0.556 0 0)',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '48px',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(0, 0, 0)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.556 0 0)'}
            >
              ← Back to Work
            </Link>

            {/* Project Overview 可展开信息卡片 */}
            <div
              style={{
                paddingTop: '0px',
              }}
            >
              {/* 上面一行：主要信息 + 展开按钮 */}
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
                  Product Designer &amp; AI Architect · Financial AI · 2026
                </div>
                <button
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
                >
                  <Image
                    src="/expand.svg"
                    alt="Expand"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              {/* 展开内容 */}
              <div
                style={{
                  maxHeight: isExpanded ? '500px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  paddingTop: isExpanded ? '12px' : '0',
                }}
              >
                <div className="flex flex-col" style={{ gap: '6px' }}>
                  <div
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    Intent-driven UX Research · Generative UI Patterns · Financial Domain Discovery
                  </div>
                  <div
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    Generative UI Financial Agent · Conversational Flows · Real-time Financial Insights
                  </div>
                </div>
              </div>

              {/* 项目标题和描述 */}
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
                  Mono: A Personal Finance Agent Built on the A2UI Protocol
                </h1>
                <p
                  style={{
                    ...fontStyle,
                    ...textStyle.lead,
                    color: 'rgba(0, 0, 0, 1)',
                    marginBottom: '32px',
                    maxWidth: '645px',
                    height: '100%',
                  }}
                >
                  Mono turns natural language into real-time, contextual financial views — rendered cards, charts, and forms that match exactly what you asked for. The A2UI protocol bridges LLM intent and deterministic UI output, eliminating the gap between what a user asks and what they see.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Core Research Pillars Section */}
      <section 
        className="w-screen py-16"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 500,
                color: 'rgb(0, 0, 0)',
                marginBottom: '16px',
              }}
            >
              The Design Problem
            </h2>

            <div
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '32px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
                maxWidth: '780px',
                marginTop: '24px',
              }}
            >
              <p style={{ marginBottom: '16px' }}>
                Most personal finance tools put the interface first — you learn the dashboard, then find your answer. Mono inverts this: you say what you need, the system decides what to render.
              </p>
              <p style={{ marginBottom: '0' }}>
                That shift — from <strong>navigating UI</strong> to <strong>expressing intent</strong> — creates a hard design constraint. The LLM output is probabilistic; the rendered UI must not be. Three decisions resolved this tension.
              </p>
            </div>

            {/* Three Design Decisions */}
            <div style={{ marginTop: '48px', maxWidth: '1280px' }}>
              <h3
                style={{
                  ...fontStyle,
                  ...textStyle.h3Medium,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '24px',
                }}
              >
                Three Design Decisions
              </h3>
              <div className="flex flex-row" style={{ gap: '24px' }}>
                {/* Card 1: A2UI Protocol & Structural Determinism */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon: shield / validation */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '40px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                  </div>
                  {/* Content */}
                  <h4
                    style={{
                      ...fontStyle,
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    Every render must be predictable
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Instead of generating code, the LLM emits a <strong>structured JSON spec</strong>. A Zod validation layer catches schema violations before they reach the UI — every render is <strong>predictable by contract</strong>, not by luck.
                  </p>
                </div>

                {/* Card 2: Decoupled JSON-Render Factory */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon: layers / components */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '40px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                    </svg>
                  </div>
                  {/* Content */}
                  <h4
                    style={{
                      ...fontStyle,
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    Components are the answer, not generated layouts
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Financial data needs structure, not improvisation. A fixed component registry — budget gauge, spending chart, transaction list — ensures every response is a <strong>purposefully designed view</strong>, not a layout invented on the fly. Each JSON <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', borderRadius: '3px', padding: '1px 5px' }}>type</code> maps to exactly one component.
                  </p>
                </div>

                {/* Card 3: Semantic Disambiguation via CoT */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon: thought / reasoning (CoT) */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '40px',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      <path d="M8 10h.01"></path>
                      <path d="M12 10h.01"></path>
                      <path d="M16 10h.01"></path>
                    </svg>
                  </div>
                  {/* Content */}
                  <h4
                    style={{
                      ...fontStyle,
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    Intent must be resolved before UI is chosen
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Ambiguous queries pass through a <strong>CoT reasoning step</strong> that classifies intent before any component is selected. The &quot;internal monologue&quot; streams to the client in real-time — giving users immediate feedback while the final JSON spec is computed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Interaction Design Section */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            {/* Header */}
            <h2 style={{ ...fontStyle, fontSize: '28px', lineHeight: '36px', fontWeight: 500, color: 'rgb(0,0,0)', marginBottom: '16px' }}>
              Designing the Conversation–UI Balance
            </h2>
            <p style={{ ...fontStyle, fontSize: '18px', lineHeight: '32px', fontWeight: 400, color: 'rgba(0,0,0,0.72)', maxWidth: '720px', marginBottom: '64px' }}>
              The hardest UX question in Mono wasn&apos;t technical — it was compositional: <em>when should the AI respond with a message, and when should it render a component?</em> Text is flexible but forgettable. UI is scannable but can feel over-engineered for a simple answer. Mono explores the boundary between the two.
            </p>

            {/* Two-column: chat demo + principles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'start' }}>

              {/* Left: annotated chat mockup */}
              <div style={{ background: '#111111', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Thread 1: logging */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                  <div style={{ background: '#10a37f', borderRadius: '12px 12px 2px 12px', padding: '9px 14px', maxWidth: '80%' }}>
                    <span style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>I just spent $89 at Whole Foods</span>
                  </div>
                </div>

                {/* AI thought bubble */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <span style={{ fontSize: '10px' }}>✦</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '2px 12px 12px 12px', padding: '9px 14px', maxWidth: '80%' }}>
                    <span style={{ fontFamily: 'system-ui', fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.5 }}>Parsing… Whole Foods → Groceries · $89.00 · today</span>
                  </div>
                </div>

                {/* Inline ConfirmExpense mini-card */}
                <div style={{ marginLeft: '30px', marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#10a37f' }}>ConfirmExpense</span>
                      <span style={{ fontSize: '9px', background: 'rgba(16,163,127,0.15)', color: '#10a37f', borderRadius: '4px', padding: '1px 6px', fontFamily: 'system-ui' }}>AI-prefilled</span>
                    </div>
                    {[['Amount', '$89.00  USD'], ['Merchant', 'Whole Foods'], ['Category', 'Food & Dining  ›  Groceries'], ['Date', 'Today']].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'system-ui' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                        <span style={{ color: '#ececec' }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button style={{ flex: 1, padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontFamily: 'system-ui', cursor: 'pointer' }}>Edit</button>
                      <button style={{ flex: 1, padding: '6px', borderRadius: '8px', border: 'none', background: '#10a37f', color: '#fff', fontSize: '11px', fontFamily: 'system-ui', cursor: 'pointer', fontWeight: 500 }}>✓ Confirm</button>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0 12px' }} />

                {/* Thread 2: query → UI answer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                  <div style={{ background: '#10a37f', borderRadius: '12px 12px 2px 12px', padding: '9px 14px', maxWidth: '80%' }}>
                    <span style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>How&apos;s my dining budget?</span>
                  </div>
                </div>

                {/* AI renders component, no text */}
                <div style={{ marginLeft: '30px', marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'system-ui', fontSize: '13px', fontWeight: 600, color: '#ececec' }}>Dining Out</span>
                      <span style={{ fontFamily: 'system-ui', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>April</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'system-ui', marginBottom: '8px' }}>Spent $292.00 · Limit $400.00 · <span style={{ color: '#ececec', fontWeight: 500 }}>$108.00 left</span></div>
                    <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '73%', background: '#10a37f', borderRadius: '999px' }} />
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui', marginTop: '5px' }}>73% used</div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0 12px' }} />

                {/* Thread 3: summary */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                  <div style={{ background: '#10a37f', borderRadius: '12px 12px 2px 12px', padding: '9px 14px', maxWidth: '80%' }}>
                    <span style={{ fontFamily: 'system-ui', fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>Summarize my week</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <span style={{ fontSize: '10px' }}>✦</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '2px 12px 12px 12px', padding: '9px 14px', maxWidth: '85%' }}>
                    <p style={{ fontFamily: 'system-ui', fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 8px' }}>
                      You spent <strong style={{ color: '#ececec' }}>$568.70</strong> this week — up 18% from last week. Dining accounted for 43% of total spend.
                    </p>
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#10a37f' }}>↓ SpendingRecords</span>
                  </div>
                </div>
              </div>

              {/* Right: three interaction patterns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '13px' }}>✏</span>
                    </div>
                    <h4 style={{ ...fontStyle, fontSize: '16px', fontWeight: 600, color: 'rgb(0,0,0)', margin: 0 }}>Log by talking</h4>
                  </div>
                  <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '26px', color: 'rgba(0,0,0,0.65)', margin: 0 }}>
                    A single natural language message — &quot;spent $89 at Whole Foods&quot; — triggers an AI-prefilled confirmation form. The conversation handles the <em>input</em>; the UI handles the <em>review and commit</em>. Neither has to do the other&apos;s job.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '13px' }}>📊</span>
                    </div>
                    <h4 style={{ ...fontStyle, fontSize: '16px', fontWeight: 600, color: 'rgb(0,0,0)', margin: 0 }}>Query, get UI</h4>
                  </div>
                  <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '26px', color: 'rgba(0,0,0,0.65)', margin: 0 }}>
                    Financial data is inherently visual. When a user asks &quot;how&apos;s my budget?&quot;, a rendered gauge answers more precisely than a sentence ever could. Mono never replies with text when a component communicates better.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '13px' }}>✦</span>
                    </div>
                    <h4 style={{ ...fontStyle, fontSize: '16px', fontWeight: 600, color: 'rgb(0,0,0)', margin: 0 }}>Summarize with both</h4>
                  </div>
                  <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '26px', color: 'rgba(0,0,0,0.65)', margin: 0 }}>
                    For recaps and insights, text and UI coexist — each playing a different role. The AI writes the narrative; the component holds the data. Together they answer &quot;what happened&quot; and &quot;show me the numbers&quot; in a single response.
                  </p>
                </div>

                {/* Design tension callout */}
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', background: '#fafafa', marginTop: '8px' }}>
                  <div style={{ ...fontStyle, fontSize: '11px', fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Design tension</div>
                  <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '26px', color: 'rgba(0,0,0,0.7)', margin: 0 }}>
                    A pure chat UI feels lightweight but loses structure. A pure dashboard is powerful but imposes cognitive overhead. Mono&apos;s hypothesis: <strong>conversation is the input layer; components are the output layer</strong> — and the boundary between them should be invisible to the user.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* System Architecture: The A2UI Engine Section */}
      <section 
        className="w-screen py-16"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        {/* 标题和简介使用动画 */}
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 500,
                color: 'rgb(0, 0, 0)',
                marginBottom: '32px',
              }}
            >
              System Architecture: The A2UI Engine
            </h2>
            <div
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '32px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
                maxWidth: '780px',
              }}
            >
              <p style={{ marginBottom: '24px' }}>
                Every user input passes through a <strong>CoT reasoning engine</strong> before anything is rendered. The LLM doesn't guess — it scores its own confidence, asks a follow-up if needed, and only routes to a component once intent is unambiguous. Three mechanisms make this reliable.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>

        {/* A2UI Engine: three pillars + workflow visual */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            marginTop: '100px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.4fr)',
            gap: '56px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: three architecture pillars */}
          <div>
            {/* 1. Thought Trace & Intent Routing */}
            <div style={{ marginBottom: '40px' }}>
              <h3
                style={{
                  ...fontStyle,
                  ...textStyle.h3Medium,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '16px',
                }}
              >
                1. Thought Trace &amp; Intent Routing
              </h3>
              <p
                style={{
                  marginBottom: '16px',
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                The CoT reasoning step produces a confidence score. If confidence is <strong>low</strong> — the query is ambiguous or underspecified — Mono asks a targeted follow-up before proceeding. Only at <strong>high confidence</strong> does it assemble a Formatted New Prompt (original input + LLM analysis + any follow-up reply) and route to one of four intent handlers.
              </p>
              <p
                style={{
                  marginBottom: '8px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Flow:
              </p>
              <p
                style={{
                  marginBottom: '16px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Input → CoT Reasoning → Confidence Gate → [Low: FollowUp → repeat | High: Formatted New Prompt] → Route: <strong>CREATE</strong> / <strong>QUERY</strong> / <strong>DELETE·UPDATE</strong> / <strong>CHAT</strong>
              </p>
              <p
                style={{
                  marginBottom: '8px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                UX rationale:
              </p>
              <p
                style={{
                  margin: 0,
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                The FollowUp loop is a UX decision, not just a technical safeguard. A wrong component rendered confidently is worse than a clarifying question. The reasoning trace also streams to the client — users see the thinking in progress while the final spec is computed.
              </p>
            </div>

            {/* 2. Predictive Lifecycle Scheduling */}
            <div style={{ marginBottom: '40px' }}>
              <h3
                style={{
                  ...fontStyle,
                  ...textStyle.h3Medium,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '16px',
                }}
              >
                2. Predictive Lifecycle Scheduling
              </h3>
              <p
                style={{
                  marginBottom: '16px',
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Scheduling intent is detected <em>during</em> CoT reasoning — before the confidence gate. When the LLM recognises a recurring pattern (&quot;every month,&quot; &quot;each payday&quot;), it immediately fires the <strong>Scheduler Tool</strong> as a parallel path, independent of the main intent routing. The cron job then autonomously injects the transaction when the trigger date is met.
              </p>
              <p
                style={{
                  marginBottom: '8px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Flow:
              </p>
              <p
                style={{
                  marginBottom: '16px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                CoT detects recurring pattern → Scheduler Tool (parallel path) → Cron Job → Auto-inject transaction on trigger date.
              </p>
              <p
                style={{
                  marginBottom: '8px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Design note:
              </p>
              <p
                style={{
                  margin: 0,
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Bypassing the confidence gate here is intentional — recurring intent is structurally unambiguous. The user said &quot;every month&quot;; no follow-up needed.
              </p>
            </div>

            {/* 3. Adaptive Memory Loop (Feedback-Driven Evolution) */}
            <div>
              <h3
                style={{
                  ...fontStyle,
                  ...textStyle.h3Medium,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '16px',
                }}
              >
                3. Adaptive Memory Loop
              </h3>
              <p
                style={{
                  marginBottom: '16px',
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '32px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                The feedback loop shown at the base of the diagram closes the system. User edits — correcting a category, adjusting an amount, dismissing a suggestion — are stored as preference signals and injected back into the <strong>Formatted New Prompt</strong> on every subsequent query. The context gets richer with every interaction.
              </p>
              <p
                style={{
                  marginBottom: '8px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Flow:
              </p>
              <p
                style={{
                  marginBottom: '16px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                User correction → Preference store → Injected into Formatted New Prompt → Personalized CoT reasoning.
              </p>
              <p
                style={{
                  marginBottom: '8px',
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Design note:
              </p>
              <p
                style={{
                  margin: 0,
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                This is the layer that turns a generic agent into a personal one. &quot;Trader Joe&apos;s&quot; → Groceries, not Food &amp; Dining. The system learns each user&apos;s financial vocabulary — so future renders align with <strong>their habits, not default assumptions</strong>.
              </p>
            </div>
          </div>

          {/* Right: Mono workflow visual */}
          <div
            style={{
              position: 'sticky',
              top: '96px',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/img/mono_work flow.svg"
              alt="Mono A2UI engine workflow"
              width={800}
              height={600}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>


      {/* Token & Component Render Pipeline Section */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            {/* Header */}
            <h2
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 500,
                color: 'rgb(0, 0, 0)',
                marginBottom: '16px',
              }}
            >
              From JSON Token to Rendered UI
            </h2>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '32px',
                fontWeight: 400,
                color: 'rgba(0,0,0,0.72)',
                maxWidth: '720px',
                marginBottom: '56px',
              }}
            >
              The render engine is a <strong>deterministic factory</strong> — it never guesses. The LLM emits a validated JSON spec; each <code style={{ fontFamily: 'monospace', fontSize: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', padding: '1px 6px' }}>type</code> token maps 1-to-1 to a React component. No code generation, no eval, no surprises.
            </p>

            {/* Pipeline flow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '0',
                marginBottom: '64px',
                overflowX: 'auto',
              }}
            >
              {[
                { label: 'User Intent', sub: '"Show my spending this month"', icon: '💬', color: '#f0f4ff' },
                { label: 'LLM Orchestrator', sub: 'Semantic CoT → intent routing', icon: '🧠', color: '#faf0ff' },
                { label: 'A2UI JSON Spec', sub: 'Structured output with component tokens', icon: '{}', color: '#fff8e6', mono: true },
                { label: 'Zod Validator', sub: '100% schema enforcement — fails fast', icon: '✓', color: '#f0fff4' },
                { label: 'Component Factory', sub: 'Token → React component lookup', icon: '⚙', color: '#fff0f0' },
                { label: 'Rendered UI', sub: 'Deterministic, pixel-consistent output', icon: '▣', color: '#f5f5f5' },
              ].map((step, i, arr) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      background: step.color,
                      border: '1px solid rgba(0,0,0,0.07)',
                      borderRadius: i === 0 ? '12px 0 0 12px' : i === arr.length - 1 ? '0 12px 12px 0' : '0',
                      borderLeft: i > 0 ? 'none' : undefined,
                      padding: '20px 16px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontFamily: step.mono ? 'monospace' : 'system-ui', fontSize: '20px' }}>{step.icon}</div>
                    <div style={{ ...fontStyle, fontSize: '13px', fontWeight: 600, color: 'rgb(0,0,0)', lineHeight: '18px' }}>{step.label}</div>
                    <div style={{ ...fontStyle, fontSize: '11px', color: 'rgba(0,0,0,0.5)', lineHeight: '16px' }}>{step.sub}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', zIndex: 1, margin: '0 -1px', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7 4l6 6-6 6" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main: JSON example + component registry */}
            <div
              className="grid grid-cols-1 lg:grid-cols-2"
              style={{ gap: '32px', alignItems: 'start' }}
            >
              {/* Left: A2UI JSON spec example */}
              <div
                style={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {/* Code block header */}
                <div
                  style={{
                    background: '#1e1e2e',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['#f56e6e', '#f5ba3a', '#6bd19f'].map(c => (
                      <span key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, display: 'inline-block' }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>a2ui-spec.json</span>
                </div>
                {/* Code body */}
                <pre
                  style={{
                    margin: 0,
                    padding: '24px',
                    background: '#1e1e2e',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: '20px',
                    overflowX: 'auto',
                    color: '#cdd6f4',
                  }}
                >
{`{
  `}<span style={{ color: '#89b4fa' }}>&quot;intent&quot;</span>{`: `}<span style={{ color: '#a6e3a1' }}>&quot;show spending this month&quot;</span>{`,
  `}<span style={{ color: '#89b4fa' }}>&quot;confidence&quot;</span>{`: `}<span style={{ color: '#fab387' }}>0.94</span>{`,
  `}<span style={{ color: '#89b4fa' }}>&quot;components&quot;</span>{`: [
    {
      `}<span style={{ color: '#89b4fa' }}>&quot;type&quot;</span>{`: `}<span style={{ color: '#f38ba8' }}>&quot;account-summary&quot;</span>{`,
      `}<span style={{ color: '#89b4fa' }}>&quot;props&quot;</span>{`: {
        `}<span style={{ color: '#89b4fa' }}>&quot;balance&quot;</span>{`: `}<span style={{ color: '#fab387' }}>12540.80</span>{`,
        `}<span style={{ color: '#89b4fa' }}>&quot;change&quot;</span>{`: `}<span style={{ color: '#fab387' }}>-3.2</span>{`,
        `}<span style={{ color: '#89b4fa' }}>&quot;period&quot;</span>{`: `}<span style={{ color: '#a6e3a1' }}>&quot;this month&quot;</span>{`
      }
    },
    {
      `}<span style={{ color: '#89b4fa' }}>&quot;type&quot;</span>{`: `}<span style={{ color: '#f38ba8' }}>&quot;chart-sparkline&quot;</span>{`,
      `}<span style={{ color: '#89b4fa' }}>&quot;props&quot;</span>{`: {
        `}<span style={{ color: '#89b4fa' }}>&quot;data&quot;</span>{`: `}<span style={{ color: '#fab387' }}>[1200, 980, 1450, 890, 1100]</span>{`,
        `}<span style={{ color: '#89b4fa' }}>&quot;color&quot;</span>{`: `}<span style={{ color: '#a6e3a1' }}>&quot;warning&quot;</span>{`
      }
    },
    {
      `}<span style={{ color: '#89b4fa' }}>&quot;type&quot;</span>{`: `}<span style={{ color: '#f38ba8' }}>&quot;insight-card&quot;</span>{`,
      `}<span style={{ color: '#89b4fa' }}>&quot;props&quot;</span>{`: {
        `}<span style={{ color: '#89b4fa' }}>&quot;message&quot;</span>{`: `}<span style={{ color: '#a6e3a1' }}>&quot;Dining up 28% vs last month&quot;</span>{`,
        `}<span style={{ color: '#89b4fa' }}>&quot;severity&quot;</span>{`: `}<span style={{ color: '#a6e3a1' }}>&quot;warning&quot;</span>{`
      }
    }
  ]
}`}
                </pre>
              </div>

              {/* Right: Component token registry + note */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
                {/* Registry table */}
                <div
                  style={{
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      background: 'rgba(0,0,0,0.015)',
                    }}
                  >
                    <span style={{ ...fontStyle, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, fontWeight: 500, color: 'rgba(0,0,0,0.4)' }}>
                      Component Token Registry
                    </span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.01)' }}>
                        {['Token type', 'Component', 'Renders'].map(h => (
                          <th key={h} style={{ ...fontStyle, fontSize: '10px', fontWeight: 600, color: 'rgba(0,0,0,0.4)', textAlign: 'left' as const, padding: '10px 16px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { token: 'account-summary', component: '<AccountSummary>', desc: 'Balance + period change' },
                        { token: 'transaction-list', component: '<TransactionList>', desc: 'Filterable recent items' },
                        { token: 'chart-sparkline', component: '<ChartSparkline>', desc: 'Inline trend line' },
                        { token: 'budget-gauge', component: '<BudgetGauge>', desc: 'Circular budget usage' },
                        { token: 'insight-card', component: '<InsightCard>', desc: 'AI-generated observation' },
                        { token: 'action-button', component: '<ActionButton>', desc: 'Intent-driven CTA' },
                      ].map((row, i) => (
                        <tr
                          key={row.token}
                          style={{ borderBottom: i < 5 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                        >
                          <td style={{ padding: '11px 16px' }}>
                            <code style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c0392b', background: 'rgba(192,57,43,0.06)', borderRadius: '4px', padding: '2px 6px' }}>{row.token}</code>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <code style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2563eb', background: 'rgba(37,99,235,0.06)', borderRadius: '4px', padding: '2px 6px' }}>{row.component}</code>
                          </td>
                          <td style={{ ...fontStyle, padding: '11px 16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Design principle callout */}
                <div
                  style={{
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    background: '#fafafa',
                  }}
                >
                  <div style={{ ...fontStyle, fontSize: '12px', fontWeight: 600, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>Design principle</div>
                  <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '24px', color: 'rgba(0,0,0,0.75)', margin: 0 }}>
                    Components are sealed contracts — the factory only accepts <strong>known token types</strong>. Adding a new component means extending the registry and the Zod schema simultaneously, which keeps the LLM&apos;s output space and the UI surface permanently in sync.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Design Token System Section */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 500,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Mono Design Token System
            </h2>
            <p
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '18px',
                lineHeight: '32px',
                fontWeight: 400,
                color: 'rgba(0,0,0,0.6)',
                maxWidth: '680px',
                marginBottom: '64px',
              }}
            >
              Every visual decision maps to a named token. Token names appear verbatim in both the design spec JSON and the React component library — the spec <em>is</em> the contract.
            </p>

            {/* ── Color ── */}
            <div style={{ marginBottom: '64px' }}>
              <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '20px' }}>Color</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {([
                  {
                    label: 'Light Mode',
                    bg: '#FAFAFA',
                    cardBorder: '1px solid rgba(0,0,0,0.07)',
                    groupLabelColor: 'rgba(0,0,0,0.28)',
                    rowBorder: '1px solid rgba(0,0,0,0.05)',
                    nameColor: 'rgba(0,0,0,0.5)',
                    swatchBorder: 'rgba(0,0,0,0.1)',
                    groups: [
                      { label: 'Action',   tokens: [{ key: 'brand', val: '#0D9488' }, { key: 'brand-hover', val: '#0F766E' }] },
                      { label: 'Semantic', tokens: [{ key: 'positive', val: '#10A37F' }, { key: 'pos-subtle', val: 'rgba(16,163,127,.12)' }, { key: 'negative', val: '#E03E3E' }, { key: 'neg-subtle', val: 'rgba(224,62,62,.10)' }, { key: 'warning', val: '#D97706' }] },
                      { label: 'Surface',  tokens: [{ key: 'bg', val: '#FFFFFF' }, { key: 'surface', val: '#FFFFFF' }, { key: 'elevated', val: '#FAFAFA' }, { key: 'surface-2', val: '#F3F3F3' }] },
                      { label: 'Text',     tokens: [{ key: 'text-primary', val: '#171717' }, { key: 'text-secondary', val: '#737373' }, { key: 'text-muted', val: '#5A6178' }, { key: 'text-inverse', val: '#FFFFFF' }] },
                      { label: 'Border',   tokens: [{ key: 'border', val: '#E0E0E0' }, { key: 'border-strong', val: '#B0B0B0' }] },
                    ],
                  },
                  {
                    label: 'Dark Mode',
                    bg: '#1A1A1A',
                    cardBorder: '1px solid rgba(255,255,255,0.07)',
                    groupLabelColor: 'rgba(255,255,255,0.28)',
                    rowBorder: '1px solid rgba(255,255,255,0.05)',
                    nameColor: 'rgba(255,255,255,0.5)',
                    swatchBorder: 'rgba(255,255,255,0.12)',
                    groups: [
                      { label: 'Action',   tokens: [{ key: 'brand', val: '#10A37F' }, { key: 'brand-hover', val: '#0D8C6D' }] },
                      { label: 'Semantic', tokens: [{ key: 'positive', val: '#10A37F' }, { key: 'pos-subtle', val: 'rgba(16,163,127,.14)' }, { key: 'negative', val: '#E03E3E' }, { key: 'neg-subtle', val: 'rgba(224,62,62,.12)' }, { key: 'warning', val: '#D97706' }] },
                      { label: 'Surface',  tokens: [{ key: 'bg', val: '#212121' }, { key: 'surface', val: 'rgba(255,255,255,.08)' }, { key: 'elevated', val: 'rgba(255,255,255,.12)' }, { key: 'surface-2', val: 'rgba(255,255,255,.06)' }] },
                      { label: 'Text',     tokens: [{ key: 'text-primary', val: '#ECECEC' }, { key: 'text-secondary', val: '#9B9B9B' }, { key: 'text-muted', val: '#737373' }, { key: 'text-inverse', val: '#171717' }] },
                      { label: 'Border',   tokens: [{ key: 'border', val: 'rgba(255,255,255,.10)' }, { key: 'border-strong', val: 'rgba(255,255,255,.20)' }] },
                    ],
                  },
                ] as {
                  label: string; bg: string; cardBorder: string; groupLabelColor: string;
                  rowBorder: string; nameColor: string; swatchBorder: string;
                  groups: { label: string; tokens: { key: string; val: string }[] }[];
                }[]).map(col => (
                  <div key={col.label}>
                    <div style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '8px' }}>{col.label}</div>
                    <div style={{ background: col.bg, borderRadius: '12px', border: col.cardBorder, overflow: 'hidden' }}>
                      {col.groups.map((group, gi) => (
                        <div key={group.label} style={{ display: 'flex', alignItems: 'flex-start', borderBottom: gi < col.groups.length - 1 ? col.rowBorder : 'none' }}>
                          <div style={{ width: '68px', flexShrink: 0, padding: '14px 0 14px 16px', fontFamily: 'system-ui', fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: col.groupLabelColor, paddingTop: '18px' }}>{group.label}</div>
                          <div style={{ display: 'flex', gap: '10px', padding: '14px 16px', flexWrap: 'wrap' as const }}>
                            {group.tokens.map(t => (
                              <div key={t.key} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '5px', width: '44px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '7px', background: t.val, border: `1px solid ${col.swatchBorder}`, flexShrink: 0 }} />
                                <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: col.nameColor, textAlign: 'center' as const, lineHeight: '12px', wordBreak: 'break-all' as const }}>{t.key}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Typography ── */}
            <div style={{ marginBottom: '64px' }}>
              <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '16px' }}>Typography</div>
              <div style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                {([
                  { name: 'heading', size: '24px', weight: 700, lineHeight: '32px', usage: 'Account names, dashboard panel titles, modal headers', sample: 'Spending Overview', mono: false },
                  { name: 'subheading', size: '17px', weight: 600, lineHeight: '24px', usage: 'Sub-section labels, card titles, transaction group headers', sample: 'Chase Checking', mono: false },
                  { name: 'body', size: '14px', weight: 400, lineHeight: '22px', usage: 'Descriptions, insight narrative, form helper text', sample: 'Your dining spend increased 28% vs last month.', mono: false },
                  { name: 'label', size: '12px', weight: 500, lineHeight: '16px', usage: 'Badges, category chips, input labels, column headers', sample: 'Groceries · Apr 24', mono: false },
                  { name: 'caption', size: '11px', weight: 400, lineHeight: '16px', usage: 'Timestamps, footnotes, secondary metadata', sample: 'Updated 2 min ago', mono: false },
                  { name: 'mono-figure', size: '16px', weight: 500, lineHeight: '24px', usage: 'Currency amounts, percentages, numeric data', sample: '-$340.50', mono: true },
                  { name: 'mono-figure-lg', size: '28px', weight: 600, lineHeight: '36px', usage: 'Primary balance — the focal number', sample: '$12,540.80', mono: true },
                  { name: 'mono-figure-sm', size: '13px', weight: 500, lineHeight: '20px', usage: 'Table row figures, sparkline labels, compact gauges', sample: '+2.4%', mono: true },
                ] as { name: string; size: string; weight: number; lineHeight: string; usage: string; sample: string; mono: boolean }[]).map((t, i, arr) => (
                  <div
                    key={t.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr 1fr',
                      padding: '14px 20px',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <code style={{ fontFamily: 'monospace', fontSize: '10px', color: '#c0392b', background: 'rgba(192,57,43,0.06)', borderRadius: '4px', padding: '2px 6px', display: 'inline-block' }}>{t.name}</code>
                    <div style={{ fontFamily: t.mono ? 'monospace' : 'system-ui, -apple-system, sans-serif', fontSize: t.size, fontWeight: t.weight, lineHeight: t.lineHeight, color: 'rgb(0,0,0)', paddingLeft: '20px' }}>{t.sample}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: '11px', color: 'rgba(0,0,0,0.4)', paddingLeft: '20px' }}>{t.size}/{t.weight} — {t.usage}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Spacing + Radius ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '64px' }}>
              <div>
                <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '16px' }}>Spacing</div>
                <div style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  {([
                    { name: 'space-1', value: '4px' },
                    { name: 'space-2', value: '8px' },
                    { name: 'space-3', value: '12px' },
                    { name: 'space-4', value: '16px' },
                    { name: 'space-5', value: '20px' },
                    { name: 'space-6', value: '24px' },
                    { name: 'space-8', value: '32px' },
                    { name: 'space-10', value: '40px' },
                    { name: 'space-12', value: '48px' },
                    { name: 'space-16', value: '64px' },
                  ] as { name: string; value: string }[]).map((t, i, arr) => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      <div style={{ width: Math.min(parseInt(t.value), 64), height: '8px', background: 'rgba(91,95,239,0.2)', borderRadius: '2px', flexShrink: 0 }} />
                      <code style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.5)', flex: 1 }}>{t.name}</code>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.35)' }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '16px' }}>Radius</div>
                <div style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  {([
                    { name: 'radius-xs', value: '4px' },
                    { name: 'radius-sm', value: '8px' },
                    { name: 'radius-md', value: '12px' },
                    { name: 'radius-lg', value: '16px' },
                    { name: 'radius-full', value: '9999px' },
                  ] as { name: string; value: string }[]).map((t, i, arr) => {
                    const r = parseInt(t.value) || 999;
                    return (
                      <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                        <div style={{ width: '64px', height: '44px', background: 'rgba(91,95,239,0.15)', borderRadius: `${r}px`, border: '1px solid rgba(91,95,239,0.25)', flexShrink: 0 }} />
                        <code style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.5)', flex: 1 }}>{t.name}</code>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.35)' }}>{t.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Component Registry ── */}
            <div>
              <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.35)', marginBottom: '20px' }}>Component Registry</div>
              <MonoComponentShowcase />
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* The Result Section */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                ...fontStyle,
                fontSize: '28px',
                lineHeight: '36px',
                fontWeight: 500,
                color: 'rgb(0, 0, 0)',
                marginBottom: '32px',
              }}
            >
              The Result
            </h2>

            {/* 左侧占位图 + 右侧内容整体 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start' }}>
              {/* 左侧：Mockup 图片 */}
              <div
                style={{
                  flex: '0 0 640px',
                  width: '640px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <Image
                  src="/img/mono_cover.avif"
                  alt="Mono result mockup"
                  width={640}
                  height={480}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>

              {/* 右侧：The Result 内容整体（段落 + 两张卡片） */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '32px',
                    fontWeight: 400,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '32px',
                  }}
                >
                  <p style={{ marginBottom: '24px' }}>
                    The Mono financial agent brings intent-driven, generative UI to everyday money management. Users get real-time insights and actionable views through natural language, reducing friction and putting financial clarity one question away.
                  </p>
                </div>

                {/* 两个结果卡片 */}
                <div className="flex flex-row" style={{ gap: '24px' }}>
                  {/* Card 1: Stable A2UI Execution */}
                  <div
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10"></line>
                          <line x1="12" y1="20" x2="12" y2="4"></line>
                          <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                      </span>
                      <h4
                        style={{
                          ...fontStyle,
                          ...textStyle.h5,
                          color: 'rgb(0, 0, 0)',
                          margin: 0,
                        }}
                      >
                        Stable A2UI Execution
                      </h4>
                    </div>
                    <p
                      style={{
                        ...fontStyle,
                        ...textStyle.body,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      A strict <strong>A2UI JSON contract</strong> turns LLM outputs into a <strong>reliable, render-safe UI layer</strong> — no code generation, no eval, no hallucinated components.
                    </p>
                  </div>

                  {/* Card 2: Intent-Aligned Financial Clarity */}
                  <div
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="6"></circle>
                          <circle cx="12" cy="12" r="2"></circle>
                        </svg>
                      </span>
                      <h4
                        style={{
                          ...fontStyle,
                          ...textStyle.h5,
                          color: 'rgb(0, 0, 0)',
                          margin: 0,
                        }}
                      >
                        Intent-Aligned Financial Clarity
                      </h4>
                    </div>
                    <p
                      style={{
                        ...fontStyle,
                        ...textStyle.body,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      Thought trace, memory, and scheduling combine into views that feel <strong>built for you</strong> — not generated for anyone.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <Button
                    onClick={() => setIsMonoLoginModalOpen(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Explore the live site
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Mono 站点登录信息弹窗 */}
      {isMonoLoginModalOpen && (
        <div
          onClick={() => setIsMonoLoginModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
              padding: '24px',
            }}
          >
            {/* 标题 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '20px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                  margin: 0,
                }}
              >
                Mono live demo access
              </h3>
              <button
                onClick={() => setIsMonoLoginModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '20px',
                  lineHeight: '20px',
                }}
              >
                ×
              </button>
            </div>

            {/* 说明文案（英文，解释账号用途） */}
            <p
              style={{
                ...fontStyle,
                ...textStyle.bodySm,
                color: 'rgb(0, 0, 0)',
                marginBottom: '16px',
              }}
            >
              You can explore the live Mono prototype using the shared demo account below. Feel free to log in and click around the full A2UI flow.
            </p>

            {/* 账号信息，可复制 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '12px',
                    lineHeight: '18px',
                    fontWeight: 500,
                    color: 'rgba(0, 0, 0, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      ...fontStyle,
                      fontSize: '13px',
                      lineHeight: '20px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                      wordBreak: 'break-all',
                    }}
                  >
                    flyskytoo@outlook.com
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText('flyskytoo@outlook.com')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 0, 0, 0.15)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      ...fontStyle,
                      fontSize: '12px',
                      lineHeight: '18px',
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '12px',
                    lineHeight: '18px',
                    fontWeight: 500,
                    color: 'rgba(0, 0, 0, 0.6)',
                    marginBottom: '4px',
                  }}
                >
                  Password
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      ...fontStyle,
                      fontSize: '13px',
                      lineHeight: '20px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                      wordBreak: 'break-all',
                    }}
                  >
                    k@9Y9n.YLtKHAd@
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText('k@9Y9n.YLtKHAd@')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 0, 0, 0.15)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      ...fontStyle,
                      fontSize: '12px',
                      lineHeight: '18px',
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setIsMonoLoginModalOpen(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.open('https://mono.riverstudio.cc/', '_blank', 'noopener,noreferrer');
                  setIsMonoLoginModalOpen(false);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: 'rgb(0, 0, 0)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  ...fontStyle,
                  fontSize: '13px',
                  lineHeight: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Continue to live site
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
