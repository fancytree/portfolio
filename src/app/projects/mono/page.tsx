'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../../components/Button';

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
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // 展开/折叠状态
  const [isExpanded, setIsExpanded] = useState(false);
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
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 400,
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
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    Intent-driven UX Research · Generative UI Patterns · Financial Domain Discovery
                  </div>
                  <div
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
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
                  Mono: Autonomous Interface Generation via LLM-to-JSON Orchestration
                </h1>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '32px',
                    fontWeight: 300,
                    color: 'rgba(0, 0, 0, 1)',
                    marginBottom: '32px',
                    maxWidth: '645px',
                    height: '100%',
                  }}
                >
                  A technical pilot exploring A2UI and JSON-driven rendering, using structured protocols to bridge stochastic AI reasoning with deterministic, intent-driven interface execution.
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
              Core Research Pillars
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
              <p style={{ marginBottom: '24px' }}>
                This research investigates the transition from static coding to <strong>Autonomous Orchestration</strong>, focusing on how <strong>structured protocols</strong> can transform <strong>unpredictable LLM outputs</strong> into a <strong>reliable, high-fidelity</strong> user experience.
              </p>
            </div>

            {/* Key Pain Points */}
            <div style={{ marginTop: '48px', maxWidth: '1280px' }}>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '24px',
                }}
              >
                Key Pain Points
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
                      fontSize: '18px',
                      lineHeight: '24px',
                      fontWeight: 600,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    A2UI Protocol &amp; Structural Determinism
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Replaced <strong>brittle code generation</strong> with a strict <strong>Zod-based JSON contract</strong>, achieving a <strong>100% rendering success rate</strong> by enforcing a <strong>validation layer</strong> between AI reasoning and the frontend factory.
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
                      fontSize: '18px',
                      lineHeight: '24px',
                      fontWeight: 600,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    Decoupled JSON-Render Factory
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Engineered a <strong>dynamic rendering engine</strong> that <strong>decouples logic from presentation</strong>, enabling the AI to mount <strong>complex, atomic financial components</strong>—from transaction guards to interactive charts—via a <strong>unified JSON payload</strong>.
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
                      fontSize: '18px',
                      lineHeight: '24px',
                      fontWeight: 600,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    Semantic Disambiguation via CoT
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Implemented <strong>Chain of Thought (CoT)</strong> reasoning and &quot;Internal Monologue&quot; to analyze <strong>linguistic nuances</strong>, reducing <strong>interface friction by 40%</strong> through <strong>autonomous intent-routing</strong> and <strong>context-aware navigation</strong>.
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
                Mono operates on a <strong>decoupled, protocol-first architecture</strong> where the LLM acts as the <strong>Intent Orchestrator</strong>, translating natural language into a structured <strong>A2UI JSON Spec</strong> that is executed by a <strong>deterministic frontend factory</strong>.
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
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 500,
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
                This logic gate prevents &quot;Confirmation Bias&quot; by forcing the AI to self-correct through an <strong>internal reasoning loop</strong> before any UI is rendered.
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
                Input → CoT Reasoning (Internal Monologue) → Intent Classification → Schema Selection.
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
                UX Strategy:
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
                The &quot;Internal Monologue&quot; is streamed to the client in real-time, providing immediate feedback while the final JSON payload is being computed.
              </p>
            </div>

            {/* 2. Predictive Lifecycle Scheduling */}
            <div style={{ marginBottom: '40px' }}>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 500,
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
                This architecture transforms the AI from a reactive tool into a <strong>proactive agent</strong> by utilizing a system-level <strong>cron-style scheduler</strong>.
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
                Intent Detection (Recurring) → Tool Call (scheduler:schedule) → Supabase Cron Job → Automated Transaction Injection.
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
                Logic:
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
                The scheduler doesn&apos;t just remind the user; it autonomously invokes the <strong>TransactionChain</strong> when the temporal trigger is met.
              </p>
            </div>

            {/* 3. Adaptive Memory Loop (Feedback-Driven Evolution) */}
            <div>
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 500,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '16px',
                }}
              >
                3. Adaptive Memory Loop (Feedback-Driven Evolution)
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
                This creates a &quot;Learning System&quot; where the interface adapts to <strong>individual user behavior</strong> over time.
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
                User Correction → Supabase Preference Store → Context Injection (Few-shot) → Personalized Parsing.
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
                Evolution:
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
                Each manual override strengthens the vector of the user&apos;s financial &quot;Dialect,&quot; ensuring future intent-parsing aligns with <strong>personal categorization habits</strong>.
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
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: 600,
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
                        fontSize: '16px',
                        lineHeight: '24px',
                        fontWeight: 400,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      A strict <strong>A2UI JSON contract</strong> turns LLM outputs into a <strong>reliable, render-safe UI layer</strong>.
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
                          fontSize: '18px',
                          lineHeight: '24px',
                          fontWeight: 600,
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
                        fontSize: '16px',
                        lineHeight: '24px',
                        fontWeight: 400,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      Mono combines these signals into <strong>personalized, explainable financial views</strong>.
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
                fontSize: '14px',
                lineHeight: '22px',
                fontWeight: 400,
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
