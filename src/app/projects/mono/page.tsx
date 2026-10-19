'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Blocks, Braces, Brain, ChartNoAxesColumnIncreasing, MessageSquare, PanelsTopLeft, Pencil, ShieldCheck, Sparkles } from 'lucide-react';
import CaseStudyControls from '../../components/CaseStudyControls';
import CaseStudyBackButton from '../../components/CaseStudyBackButton';
import CaseStudyHero from '../../components/CaseStudyHero';
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
  const caseTypography = {
    eyebrow: {
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    },
    sectionHeading: {
      fontSize: 'var(--case-type-section, clamp(32px, 4.2vw, 48px))',
      lineHeight: 1.12,
      fontWeight: 500,
      letterSpacing: '-0.025em',
    },
    lead: {
      fontSize: 'var(--case-type-lead, clamp(18px, 1.45vw, 20px))',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body: {
      fontSize: '16px',
      lineHeight: '26px',
      fontWeight: 400,
    },
    bodySmall: {
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: 400,
    },
    subheading: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 600,
    },
    cardTitle: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: 600,
    },
  };

  // 展开/折叠状态
  // Design token color mode switcher
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  // Mono 站点登录提示弹窗
  const [isMonoLoginModalOpen, setIsMonoLoginModalOpen] = useState(false);

  return (
    <div className="mei-project-page mono-case-study w-full" style={{ backgroundColor: '#FAFAFA' }}>
      <CaseStudyControls accentColor="#10A37F" />
      {/* Hero Section */}
      <CaseStudyHero
        accentColor="#10A37F"
        title="Mono"
        subtitle="Build Interactive Agents with Generative UI: a full-stack agent app with a LangChain backend, a React frontend, and AG-UI as the runtime."
        tags={['AI Product', 'Generative UI', 'Finance', 'Protocol Design', 'Web UX']}
        visualSrc="/img/Mono/mono-cover-cutout.png"
        visualAlt="Mono financial agent shown on a graphite laptop with floating budget, expense, and spending overview cards"
        visualObjectFit="contain"
        visualObjectPosition="center bottom"
        visualImageScale={0.96}
        visualTransformOrigin="center bottom"
        visualTranslateY="3%"
        visualBackground="radial-gradient(circle at 18% 76%, rgb(16 163 127 / 0.24), transparent 34%), radial-gradient(circle at 82% 18%, rgb(118 197 173 / 0.18), transparent 30%), linear-gradient(135deg, #f4f8f5 0%, #dce8e1 52%, #edf3ef 100%)"
        visualHeight="clamp(300px, 38vw, 540px)"
        aboutFontSize="16px"
        aboutFontWeight={400}
        aboutLineHeight="26px"
        aboutLabel="The project"
        about="I researched emerging generative UI patterns, compared how much control each gives to a model, then chose declarative composition for a finance agent. Mono uses A2UI-style structured output to connect natural-language intent with a library of designed, interactive components."
        liveSiteHref="https://mono.riverstudio.cc/"
        liveSiteLabel="View live site"
        onLiveSiteClick={() => setIsMonoLoginModalOpen(true)}
        meta={[
          { label: 'Role', value: ['Product Designer,', 'AI Architect'] },
          { label: 'Team', value: ['Solo product designer'] },
          { label: 'Tool', value: ['LangChain,', 'React,', 'AG-UI runtime,', 'A2UI'] },
          { label: 'Company', value: ['River Studio'] },
          { label: 'Year', value: ['2026'] },
        ]}
      />

      {/* Part 1: Research into the state of generative UI */}
      <section 
        className="w-screen py-16"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
          paddingBottom: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
        }}
      >
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: 'var(--case-content-wide, 1080px)',
              margin: '0 auto',
            }}
          >
            <p style={{ ...fontStyle, ...caseTypography.eyebrow, color: '#0D9488', margin: '0 0 12px' }}>
              Part 01 · The State of Generative UI
            </p>
            <h2
              data-case-type="display"
              style={{
                ...fontStyle,
                ...caseTypography.sectionHeading,
                color: 'rgb(0, 0, 0)',
                marginBottom: '16px',
              }}
            >
              The spectrum of model participation
            </h2>

            <div
              style={{
                ...fontStyle,
                ...caseTypography.body,
                color: 'rgb(0, 0, 0)',
                maxWidth: 'var(--case-content-reading, 760px)',
                marginTop: '24px',
              }}
            >
              <p style={{ marginBottom: '16px' }}>
                My research starts with a distinction that is easy to miss: AI products may all answer with cards, charts, and forms, but the model does not always have the same role in creating them. Using CopilotKit&apos;s taxonomy as a lens, I mapped generative UI as a spectrum of model participation.
              </p>
              <p style={{ marginBottom: '0' }}>
                At one end, the product prepares complete views and the model selects one. In the middle, the model describes a composition using known components and the client renders it. At the other end, the model generates a complete interface. The farther the model moves toward creating the UI, the more flexibility it gains—and the more the product must account for consistency, validation, latency, and safety.
              </p>
            </div>

            <figure style={{ margin: '40px 0 0', maxWidth: '100%' }}>
              <Image
                src="/img/mono-generative-ui-spectrum.svg"
                alt="Comparison of controlled, declarative, and open-ended generative UI, with example platforms and the model and client responsibilities in each pattern."
                width={1200}
                height={480}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </figure>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 'var(--case-content-reading, 760px)', marginTop: '40px' }}>
              <div>
                <p style={{ ...fontStyle, ...caseTypography.eyebrow, color: '#0D9488', margin: '0 0 10px' }}>
                  A hybrid direction
                </p>
                <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.72)', margin: 0 }}>
                  <strong style={{ fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>ChatGPT&apos;s Intelligent UI points to a hybrid direction, not a fourth category.</strong> Product-built components handle common needs, the model composes their structure and data, and sandboxed generated UI extends the system when the component set cannot express an answer.
                </p>
              </div>
            </div>

            <figure style={{ margin: '40px 0 0', maxWidth: '980px' }}>
              <Image
                src="/img/mono-chatgpt-hybrid.svg"
                alt="A reverse-engineering interpretation of ChatGPT Intelligent UI: model-composed structured output is validated and rendered with native components, with an AppBlock sandbox fallback for novel content."
                width={980}
                height={400}
                loading="eager"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </figure>

            <div style={{ maxWidth: 'var(--case-content-reading, 760px)', marginTop: '28px', padding: '20px 24px', borderLeft: '3px solid #0D9488', background: 'rgba(13,148,136,0.06)' }}>
              <p style={{ ...fontStyle, ...caseTypography.eyebrow, color: '#0D7068', margin: '0 0 8px' }}>
                The designer&apos;s role
              </p>
              <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.76)', margin: 0 }}>
                <strong style={{ fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>I designed Mono to explore how designers can give AI room to compose context-specific answers while keeping financial data, visual rules, and consequential actions within a system people can understand and trust.</strong> That meant shaping the component vocabulary and constraints, then evaluating whether generated views were clear, useful, and complete in real use.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Part 2: My exploration of the research through Mono */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
          paddingBottom: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: 'var(--case-content-wide, 1080px)', margin: '0 auto' }}>

            {/* Header */}
            <p style={{ ...fontStyle, ...caseTypography.eyebrow, color: '#0D9488', margin: '0 0 12px' }}>
              Part 02 · My exploration
            </p>
            <h2 data-case-type="display" style={{ ...fontStyle, ...caseTypography.sectionHeading, color: 'rgb(0,0,0)', marginBottom: '16px' }}>
              From conversational intent to interface
            </h2>
            <p data-case-type="lead" style={{ ...fontStyle, ...caseTypography.lead, color: 'rgba(0,0,0,0.72)', maxWidth: 'var(--case-content-reading, 760px)', marginBottom: '48px' }}>
              I translated the research into response patterns for Mono. Conversation stays flexible; the agent can return a reviewable action card, a data-rich component, or a short explanation paired with a view.
            </p>

            {/* Full Mono platform view: sidebar, conversation, composer, and insights */}
            <div style={{ overflow: 'hidden', borderRadius: '20px', background: '#171717', boxShadow: '0 18px 48px rgba(0,0,0,0.12)' }}>
              <video
                src="/img/Mono/Mono%20Demo.mp4"
                aria-label="Mono finance workspace demo showing the navigation, chat input, and Insights panel"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Three interaction patterns */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '32px', marginTop: '36px' }}>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Pencil size={14} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                    </div>
                    <h4 style={{ ...fontStyle, ...caseTypography.cardTitle, color: 'rgb(0,0,0)', margin: 0 }}>Log by talking</h4>
                  </div>
                  <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.72)', margin: 0 }}>
                    “I spent $89 at Whole Foods.” Mono prepares a <strong>transaction for review</strong>; you confirm before it is saved.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ChartNoAxesColumnIncreasing size={14} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                    </div>
                    <h4 style={{ ...fontStyle, ...caseTypography.cardTitle, color: 'rgb(0,0,0)', margin: 0 }}>Query, get UI</h4>
                  </div>
                  <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.72)', margin: 0 }}>
                    “How much dining budget is left?” A budget view puts <strong>spent, limit, and remaining</strong> in one glance.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={14} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                    </div>
                    <h4 style={{ ...fontStyle, ...caseTypography.cardTitle, color: 'rgb(0,0,0)', margin: 0 }}>Summarize with both</h4>
                  </div>
                  <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.72)', margin: 0 }}>
                    A weekly recap pairs a brief explanation with a chart or records card, keeping <strong>context and figures together</strong>.
                  </p>
                </div>

            </div>

                {/* Design tension callout */}
            <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', background: '#fafafa', marginTop: '24px' }}>
              <div style={{ ...fontStyle, ...caseTypography.eyebrow, fontWeight: 700, color: '#0D766E', marginBottom: '8px' }}>The design decision</div>
                  <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.72)', margin: 0 }}>
                    When an answer depends on comparing financial figures, a structured view makes their relationships clear at a glance. Mono pairs brief explanations with UI, while <strong>product-defined components keep data clear and actions reviewable.</strong>
                  </p>
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
          paddingTop: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
          paddingBottom: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
        }}
      >
        {/* 标题和简介使用动画 */}
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: 'var(--case-content-wide, 1080px)',
              margin: '0 auto',
            }}
          >
            <h2
              data-case-type="display"
              style={{
                ...fontStyle,
                ...caseTypography.sectionHeading,
                color: 'rgb(0, 0, 0)',
                marginBottom: '20px',
              }}
            >
              Turning the research into a system: A2UI
            </h2>
            <p
              style={{
                ...fontStyle,
                ...caseTypography.lead,
                color: 'rgba(0,0,0,0.72)',
                maxWidth: 'var(--case-content-reading, 760px)',
                margin: 0,
              }}
            >
              Built with LangChain, the agent routes requests and composes an A2UI spec from supported components. <strong style={{ color: "rgba(0,0,0,0.92)", fontWeight: 600 }}>Mono validates the spec and renders it with product-owned components.</strong>
            </p>
          </div>
        </ScrollAnimatedSection>

        {/* A2UI Engine: three pillars + workflow visual */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]"
          style={{
            maxWidth: 'var(--case-content-wide, 1080px)',
            margin: '0 auto',
            marginTop: '64px',
            display: 'grid',
            gap: '56px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: three architecture pillars */}
          <div>
            {[
              {
                number: '01',
                label: 'ROUTE',
                title: 'Understand the task first',
                description: <>Identify the intent; if key details are missing, <strong>ask before choosing a view.</strong></>,
                flow: 'Request → intent → data or clarification → view',
              },
              {
                number: '02',
                label: 'GROUND',
                title: 'Keep financial data in the product',
                description: <>Mono’s services provide balances and records, so <strong>the model never invents account state.</strong></>,
                flow: 'Question → domain data → component',
              },
              {
                number: '03',
                label: 'CONFIRM',
                title: 'Make actions reviewable',
                description: <>People can review or edit a proposed change, then <strong>confirm before it is saved.</strong></>,
                flow: 'Prepare → review → confirm → save',
              },
            ].map((step, index) => (
              <div
                key={step.number}
                style={{
                  padding: '24px 0',
                  borderTop: '1px solid rgba(0,0,0,0.12)',
                  borderBottom: index === 2 ? '1px solid rgba(0,0,0,0.12)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: '#0D766E', letterSpacing: '0.08em' }}>{step.number}</span>
                  <span style={{ ...fontStyle, fontSize: '11px', fontWeight: 700, color: '#0D766E', letterSpacing: '0.12em' }}>{step.label}</span>
                </div>
                <h3
                  style={{
                    ...fontStyle,
                    ...caseTypography.subheading,
                    letterSpacing: '-0.015em',
                    color: 'rgb(0, 0, 0)',
                    margin: '0 0 8px',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ ...fontStyle, ...caseTypography.body, color: 'rgba(0,0,0,0.72)', margin: '0 0 12px' }}>
                  {step.description}
                </p>
                <p style={{ ...fontStyle, ...caseTypography.bodySmall, color: 'rgba(0,0,0,0.58)', margin: 0 }}>
                  {step.flow}
                </p>
              </div>
            ))}
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
              src="/img/mono-a2ui-system.svg"
              alt="Mono routes a request into a structured A2UI specification, validates it, and renders a product-owned budget component for review."
              width={688}
              height={1060}
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
          paddingTop: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
          paddingBottom: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: 'var(--case-content-wide, 1080px)', margin: '0 auto' }}>

            {/* Header */}
            <h2
              data-case-type="display"
              style={{
                ...fontStyle,
                ...caseTypography.sectionHeading,
                color: 'rgb(0, 0, 0)',
                marginBottom: '16px',
              }}
            >
              From declarative spec to rendered UI
            </h2>
            <p
              style={{
                ...fontStyle,
                ...caseTypography.lead,
                color: 'rgba(0,0,0,0.72)',
                maxWidth: 'var(--case-content-reading, 760px)',
                marginBottom: '56px',
              }}
            >
              Each spec names an intent, supported component, data, and feedback. Mono validates it and maps the component to a React view. The model composes the response; <strong style={{ color: "rgba(0,0,0,0.92)", fontWeight: 600 }}>the client owns rendering and interaction.</strong>
            </p>

            {/* Pipeline flow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '0',
                marginBottom: '64px',
                padding: '4px 2px 10px',
                overflowX: 'auto',
              }}
            >
              {[
                { label: 'User intent', sub: '“Show my spending this month”', icon: <MessageSquare size={17} strokeWidth={1.8} /> },
                { label: 'Intent + data', sub: 'Route the request and retrieve facts', icon: <Brain size={17} strokeWidth={1.8} /> },
                { label: 'A2UI spec', sub: 'Intent · component · data · feedback', icon: <Braces size={17} strokeWidth={1.8} /> },
                { label: 'Schema validation', sub: 'Check the supported output shape', icon: <ShieldCheck size={17} strokeWidth={1.8} /> },
                { label: 'Component registry', sub: 'Map known types to product UI', icon: <Blocks size={17} strokeWidth={1.8} /> },
                { label: 'Rendered view', sub: 'Product-owned style and behavior', icon: <PanelsTopLeft size={17} strokeWidth={1.8} /> },
              ].map((step, i, arr) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: '1 0 150px', minWidth: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      minHeight: '148px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'flex-start',
                      gap: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.025)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ ...fontStyle, fontSize: '10px', lineHeight: '14px', fontWeight: 600, letterSpacing: '0.1em', color: '#0D766E' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16,163,127,0.1)', color: '#0D766E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {step.icon}
                      </span>
                    </div>
                    <div style={{ ...fontStyle, fontSize: '13px', fontWeight: 600, color: 'rgb(0,0,0)', lineHeight: '18px' }}>{step.label}</div>
                    <div style={{ ...fontStyle, fontSize: '11px', color: 'rgba(0,0,0,0.56)', lineHeight: '16px' }}>{step.sub}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', zIndex: 1, margin: '0 6px', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 8h8M8 4l4 4-4 4" stroke="rgba(0,0,0,0.32)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>budget-status.a2ui.json</span>
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
  "intent": "QUERY_BUDGET",
  "component": "BudgetStatusCard",
  "data": {
    "category": "Dining",
    "limit": 400,
    "spent": 292,
    "remaining": 108,
    "period": "This month",
    "progress_percentage": 73,
    "status": "normal"
  },
  "ai_feedback": "You have $108 left in your dining budget."
}`}
                </pre>
              </div>

              {/* Right: Component token registry + note */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
                <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', background: '#FAFAFA' }}>
                  <div style={{ ...fontStyle, fontSize: '11px', fontWeight: 700, color: '#0D766E', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Client-owned boundary</div>
                  <p style={{ ...fontStyle, fontSize: '14px', lineHeight: '22px', color: 'rgba(0,0,0,0.72)', margin: 0 }}>
                    Mono validates the spec and maps supported types to product-owned React views. <strong style={{ color: 'rgba(0,0,0,0.92)', fontWeight: 600 }}>Rendering, styling, and actions stay in the client.</strong>
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
          paddingTop: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
          paddingBottom: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: 'var(--case-content-wide, 1080px)', margin: '0 auto' }}>
            <h2
              data-case-type="display"
              style={{
                ...fontStyle,
                ...caseTypography.sectionHeading,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Mono Design Token System
            </h2>
            <p
              style={{
                ...fontStyle,
                ...caseTypography.lead,
                color: 'rgba(0,0,0,0.72)',
                maxWidth: 'var(--case-content-reading, 760px)',
                marginBottom: '64px',
              }}
            >
              The app pairs theme-aware color aliases with Geist fonts, a compact spacing scale, and consistent radii and motion. Product components own the final presentation in both dark and light themes.
            </p>

            {/* ── Color ── */}
            <div style={{ marginBottom: '64px' }}>
              <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.55)', marginBottom: '20px' }}>Color · runtime themes</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {([
                  {
                    label: 'Dark · default', bg: '#212121', cardBorder: '1px solid rgba(255,255,255,0.1)', groupLabelColor: '#B5B5B5', rowBorder: '1px solid rgba(255,255,255,0.08)', nameColor: '#ECECEC',
                    groups: [
                      { label: 'Action', tokens: [{ key: 'brand', val: '#10A37F' }, { key: 'brand-hover', val: '#0D8C6D' }, { key: 'primary', val: '#0F766E' }, { key: 'primary-hover', val: '#0B625B' }, { key: 'focus', val: '#62C4B7' }] },
                      { label: 'Status', tokens: [{ key: 'success', val: '#4ADE80' }, { key: 'warning', val: '#F59E0B' }, { key: 'danger', val: '#FCA5A5' }, { key: 'chart-2', val: '#3B82F6' }, { key: 'chart-3', val: '#8B5CF6' }] },
                      { label: 'Surface', tokens: [{ key: 'canvas', val: '#212121' }, { key: 'sidebar', val: '#171717' }, { key: 'input', val: '#2F2F2F' }, { key: 'card-outer', val: '#202020' }, { key: 'surface-8%', val: 'rgba(255,255,255,0.08)' }] },
                      { label: 'Text + border', tokens: [{ key: 'text', val: '#ECECEC' }, { key: 'secondary', val: '#B5B5B5' }, { key: 'brand-text', val: '#62C4B7' }, { key: 'border', val: 'rgba(255,255,255,0.1)' }, { key: 'border-strong', val: 'rgba(255,255,255,0.2)' }] },
                    ],
                  },
                  {
                    label: 'Light · theme-light', bg: '#FFFFFF', cardBorder: '1px solid #E0E0E0', groupLabelColor: '#626262', rowBorder: '1px solid #ECECEC', nameColor: '#171717',
                    groups: [
                      { label: 'Action', tokens: [{ key: 'primary', val: '#0F766E' }, { key: 'primary-hover', val: '#0B625B' }, { key: 'action-border', val: '#0F766E' }, { key: 'focus', val: '#0F766E' }] },
                      { label: 'Status', tokens: [{ key: 'success', val: '#166534' }, { key: 'warning', val: '#F59E0B' }, { key: 'danger', val: '#B91C1C' }, { key: 'chart-1', val: '#10A37F' }, { key: 'chart-2', val: '#3B82F6' }] },
                      { label: 'Surface', tokens: [{ key: 'canvas', val: '#FFFFFF' }, { key: 'sidebar', val: '#FAFAFA' }, { key: 'sidebar-hover', val: '#F0F0F0' }, { key: 'user-bubble', val: '#F7F7F7' }, { key: 'surface-muted', val: '#F3F3F3' }] },
                      { label: 'Text + border', tokens: [{ key: 'text', val: '#171717' }, { key: 'secondary', val: '#626262' }, { key: 'brand-text', val: '#0F766E' }, { key: 'border', val: '#E0E0E0' }, { key: 'border-strong', val: '#B0B0B0' }] },
                    ],
                  },
                ] as {
                  label: string; bg: string; cardBorder: string; groupLabelColor: string;
                  rowBorder: string; nameColor: string;
                  groups: { label: string; tokens: { key: string; val: string }[] }[];
                }[]).map(col => (
                  <div key={col.label}>
                    <div style={{ fontFamily: 'system-ui', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.55)', marginBottom: '8px' }}>{col.label}</div>
                    <div style={{ background: col.bg, borderRadius: '12px', border: col.cardBorder, overflow: 'hidden' }}>
                      {col.groups.map((group, gi) => (
                        <div key={group.label} style={{ display: 'flex', alignItems: 'flex-start', borderBottom: gi < col.groups.length - 1 ? col.rowBorder : 'none' }}>
                          <div style={{ width: '84px', flexShrink: 0, padding: '16px 0 12px 16px', fontFamily: 'system-ui', fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: col.groupLabelColor }}>{group.label}</div>
                          <div style={{ display: 'flex', gap: '8px', padding: '12px 12px 12px 4px', flexWrap: 'wrap' as const }}>
                            {group.tokens.map(t => (
                              <div key={t.key} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '5px', width: '46px' }}>
                                <div title={t.val} style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.val, border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
                                <span style={{ fontFamily: 'monospace', fontSize: '8px', color: col.nameColor, textAlign: 'center' as const, lineHeight: '11px', wordBreak: 'break-all' as const }}>{t.key}</span>
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
              <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.55)', marginBottom: '16px' }}>Typography · runtime fonts</div>
              <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                {([
                  { name: '--font-sans', sample: 'Mono, your finance agent', usage: 'Geist Sans · interface and conversation', family: 'var(--font-geist-sans), system-ui, sans-serif', mono: false },
                  { name: '--font-mono', sample: '€1,200.00 · 42%', usage: 'Geist Mono · figures and structured data', family: 'var(--font-geist-mono), monospace', mono: true },
                ] as { name: string; sample: string; usage: string; family: string; mono: boolean }[]).map((t, i, arr) => (
                  <div key={t.name} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', gap: '16px', padding: '18px 20px', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', alignItems: 'center' }}>
                    <code style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0D766E', background: 'rgba(16,163,127,0.08)', borderRadius: '4px', padding: '4px 6px', display: 'inline-block' }}>{t.name}</code>
                    <div style={{ fontFamily: t.family, fontSize: t.mono ? '16px' : '18px', fontWeight: 500, color: '#171717' }}>{t.sample}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: '11px', color: 'rgba(0,0,0,0.55)' }}>{t.usage}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Spacing, radius + motion ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '64px' }}>
              <div>
                <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.55)', marginBottom: '16px' }}>Spacing · runtime scale</div>
                <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  {([
                    { name: 'space-2xs', value: '2px' },
                    { name: 'space-xs', value: '4px' },
                    { name: 'space-sm', value: '8px' },
                    { name: 'space-md', value: '12px' },
                    { name: 'space-lg', value: '16px' },
                    { name: 'space-xl', value: '24px' },
                    { name: 'space-2xl', value: '32px' },
                  ] as { name: string; value: string }[]).map((t, i, arr) => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                      <div style={{ width: Math.max(2, parseInt(t.value) * 2), height: '7px', background: '#10A37F', borderRadius: '999px', flexShrink: 0 }} />
                      <code style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.58)', flex: 1 }}>{t.name}</code>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.58)' }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.55)', marginBottom: '16px' }}>Radius + motion</div>
                <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  {([
                    { name: 'radius-sm', value: '6px', radius: '6px' },
                    { name: 'radius-md', value: '8px', radius: '8px' },
                    { name: 'radius-lg', value: '12px', radius: '12px' },
                    { name: 'radius-xl', value: '16px', radius: '16px' },
                  ] as { name: string; value: string; radius: string }[]).map((t, i, arr) => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                      <div style={{ width: '48px', height: '30px', background: 'rgba(16,163,127,0.12)', borderRadius: t.radius, border: '1px solid rgba(16,163,127,0.3)', flexShrink: 0 }} />
                      <code style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.58)', flex: 1 }}>{t.name}</code>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(0,0,0,0.58)' }}>{t.value}</span>
                    </div>
                  ))}
                  <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0D766E' }}>150ms fast</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0D766E' }}>250ms base</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0D766E' }}>400ms slow</span>
                  </div>
                  <div style={{ padding: '0 16px 12px', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(0,0,0,0.5)' }}>standard · cubic-bezier(0.2, 0, 0, 1) · icon stroke 1.8</div>
                </div>
              </div>
            </div>

            {/* ── Component Registry example ── */}
            <div>
              <div style={{ ...fontStyle, ...caseTypography.eyebrow, color: 'rgba(0,0,0,0.58)', marginBottom: '20px' }}>Component Registry example</div>
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
          paddingTop: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
          paddingBottom: 'var(--case-space-section-compact, clamp(52px, 7vw, 80px))',
        }}
      >
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: 'var(--case-content-wide, 1080px)',
              margin: '0 auto',
            }}
          >
            <h2
              data-case-type="display"
              style={{
                ...fontStyle,
                ...caseTypography.sectionHeading,
                color: 'rgb(0, 0, 0)',
                marginBottom: '32px',
              }}
            >
              What I learned building Mono with A2UI
            </h2>

            {/* 左侧结果图 + 右侧内容：优先保证文字栏的可读宽度 */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(320px,0.8fr)_minmax(420px,1.2fr)] lg:gap-10 xl:gap-12">
              {/* 左侧：Mockup 图片 */}
              <div
                className="w-full max-w-[520px] justify-self-center lg:justify-self-start"
                style={{
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
              <div className="min-w-0">
                <div
                  style={{
                    ...fontStyle,
                    ...caseTypography.lead,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '32px',
                  }}
                >
                  <p style={{ marginBottom: '24px' }}>
                    Building Mono taught me that consistency starts before generation. <strong>I defined visual tokens and a component vocabulary—schemas, data fields, constraints, and interaction examples—so the agent can compose within a clear design system.</strong>
                  </p>
                </div>

                {/* 两个结果卡片 */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
                  {/* Card 1: Preparing a design system for the model */}
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
                        ...caseTypography.cardTitle,
                          color: 'rgb(0, 0, 0)',
                          margin: 0,
                        }}
                      >
                        Give the model a design vocabulary
                      </h4>
                    </div>
                    <p
                      style={{
                        ...fontStyle,
                        ...caseTypography.body,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      Tokens set visual rules; component schemas define data and actions. <strong>The registry keeps generated views consistent as it grows.</strong>
                    </p>
                  </div>

                  {/* Card 2: Scope of the A2UI implementation */}
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
                        ...caseTypography.cardTitle,
                          color: 'rgb(0, 0, 0)',
                          margin: 0,
                        }}
                      >
                        A2UI covers declarative composition
                      </h4>
                    </div>
                    <p
                      style={{
                        ...fontStyle,
                        ...caseTypography.body,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      Mono validates model-selected components and renders them in React. My reading of ChatGPT&apos;s Intelligent UI also includes sandboxed generated UI; <strong>Mono does not implement that layer.</strong>
                    </p>
                  </div>
                </div>

                <p style={{ ...fontStyle, ...caseTypography.bodySmall, color: 'rgba(0,0,0,0.76)', margin: '20px 0 0' }}>
                  The next step is a hybrid renderer: keep common finance tasks on validated, product-owned components, and use sandboxed generated UI when no component can express the request. I would define and test that boundary—preserving consistency for familiar tasks while giving novel requests room to adapt.
                </p>

                <div style={{ marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={() => setIsMonoLoginModalOpen(true)}
                    className="mei-view-all-work-link mei-case-study-live-link group"
                    style={{
                      ...fontStyle,
                      alignItems: 'center',
                      background: 'transparent',
                      border: '1px solid rgb(10 10 10 / 0.72)',
                      borderRadius: 'var(--case-radius-full, 999px)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      fontSize: '14px',
                      fontWeight: 400,
                      gap: '10px',
                      lineHeight: '20px',
                      padding: '9px 16px',
                    }}
                  >
                    <ArrowUpRight aria-hidden strokeWidth={1.6} className="mei-view-all-work-icon size-5 shrink-0" />
                    <span className="relative z-10">Explore the live site</span>
                    <ArrowUpRight aria-hidden strokeWidth={1.6} className="mei-view-all-work-icon size-5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </ScrollAnimatedSection>
      
          <div style={{ marginTop: '56px' }}>
            <CaseStudyBackButton />
          </div>
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
