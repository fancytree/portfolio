'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AudioWaveform, ArrowUpRight, ChartSpline, Copy, FileText, Mail, Plus, Search, Star, Tangent } from 'lucide-react';
import HeroFish from './components/HeroFish';
import WorkProjectRows from './components/WorkProjectRows';
import { productProjects, researchProjects, sortProjectsByTimeDesc } from '@/lib/work-projects';
import { PROCUREMENT_AGENT_DEMO_URL } from '@/lib/demoUrls';
import HomeDemoCard from './components/HomeDemoCard';

// 滚动进入视口时的淡入 + 上浮动画（沿用全站已有的交互模式）
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
        { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
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
        if (ref.current) observer.unobserve(ref.current);
      };
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  return { ref, isVisible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation(delay);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.985)',
        transition:
          'opacity 0.56s cubic-bezier(0.22, 1, 0.36, 1), transform 0.64s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

function useSectionMotion() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting || entry.intersectionRatio > 0),
      { threshold: 0.12, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(node);

    if (reduceMotion) {
      return () => observer.disconnect();
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0), 1);
      setShift((0.5 - progress) * 14);
    };
    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, isVisible, shift };
}

function MotionSection({
  children,
  className = '',
  style,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  const { ref, isVisible, shift } = useSectionMotion();
  const motionStyle = {
    ...style,
    '--mei-section-shift': `${shift.toFixed(2)}px`,
  } as React.CSSProperties;

  return (
    <section
      ref={ref}
      data-visible={isVisible ? 'true' : 'false'}
      className={`mei-motion-section ${className}`}
      style={motionStyle}
      {...props}
    >
      {children}
    </section>
  );
}

const fullBleed: React.CSSProperties = {
  marginLeft: 'calc(-50vw + 50%)',
  marginRight: 'calc(-50vw + 50%)',
};

// Hero 标题里持续向上滚动的身份词——Product 较短，左右加 "*" 作装饰以平衡视觉宽度。
// 首词复制到末尾形成循环带，滚到复制帧后瞬间（无动画）跳回真正的第一帧，实现无缝连续滚动。
const heroRoles = ['Product', 'Interaction', 'Experience'];
const heroRoleDisplay = (word: string) => (word === 'Product' ? `* ${word} *` : word);
const heroReel = [...heroRoles, heroRoles[0]];

function RotatingRole() {
  const [step, setStep] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [width, setWidth] = useState<number>();
  const measureRef = useRef<HTMLSpanElement>(null);

  // 测量所有候选词里最宽的一个，固定容器宽度，避免整行文字随词长变化而跳动/重新居中。
  useEffect(() => {
    function measure() {
      if (!measureRef.current) return;
      const widths = Array.from(measureRef.current.children).map(
        (el) => (el as HTMLElement).getBoundingClientRect().width
      );
      setWidth(Math.max(...widths));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setStep((s) => s + 1), 2200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step !== heroReel.length - 1) return;
    // 滚到复制的末帧后，等过渡动画播完，再无动画地跳回第 0 帧（内容相同，视觉无缝）。
    const timeout = window.setTimeout(() => {
      setAnimated(false);
      setStep(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [step]);

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        height: '1em',
        lineHeight: 1,
        width: width ? `${width}px` : undefined,
      }}
    >
      {/* 隐藏测量层：渲染所有候选词以取得最大宽度 */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
      >
        {heroRoles.map((word) => (
          <span key={word} style={{ display: 'block', whiteSpace: 'nowrap' }}>
            {heroRoleDisplay(word)}
          </span>
        ))}
      </span>
      <span
        style={{
          display: 'block',
          transform: `translateY(${-step}em)`,
          transition: animated ? 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
        }}
      >
        {heroReel.map((word, i) => (
          <span key={i} style={{ display: 'block', height: '1em', lineHeight: 1, whiteSpace: 'nowrap' }}>
            {heroRoleDisplay(word)}
          </span>
        ))}
      </span>
    </span>
  );
}

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-fraunces)' };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };
const fontMono: React.CSSProperties = { fontFamily: 'var(--font-dm-mono)' };

const workGroups = [
  {
    label: 'Product',
    items: ['Procurement Agent', 'JobNova', 'ConnectNova', 'Mono', 'Beikemama'].flatMap((title) =>
      productProjects.filter((project) => project.title === title)
    ),
  },
  { label: 'Research', items: sortProjectsByTimeDesc(researchProjects) },
];

type ToolItem =
  | { type: 'icon'; src: string; alt: string; wrap?: boolean }
  | { type: 'plus' }
  | { type: 'skillmd' }
  | { type: 'ship-icon'; src: string; alt: string; innerClassName?: string; imageClassName?: string }
  | { type: 'ship-storybook' };

const tool = (src: string, alt: string, wrap?: boolean): ToolItem => ({ type: 'icon', src, alt, wrap });
const plusTool: ToolItem = { type: 'plus' };
const skillmdTool: ToolItem = { type: 'skillmd' };
const shipIcon = (
  src: string,
  alt: string,
  innerClassName: string = 'inset-[12.5%]',
  imageClassName: string = 'h-full w-full'
): ToolItem => ({ type: 'ship-icon', src, alt, innerClassName, imageClassName });
const shipStorybookTool: ToolItem = { type: 'ship-storybook' };

const processSteps = [
  {
    icon: Search,
    title: 'Research & synthesis',
    body: 'Talk to users, read behavior, and turn messy signals into clear product questions. AI helps accelerate synthesis without replacing judgment.',
    tools: [
      tool('/img/strategy/notion.svg', 'Notion'),
      tool('/img/strategy/claude.svg', 'Claude'),
      tool('/img/strategy/terminal-app.svg', 'AI terminal tool'),
      plusTool,
      skillmdTool,
    ],
  },
  {
    icon: Star,
    title: 'Prioritize with stakeholders',
    body: 'Frame opportunities with stakeholders, weigh user value against business constraints, and decide what deserves to be built first.',
    tools: [tool('/img/strategy/figma.svg', 'Figma'), tool('/img/strategy/notion.svg', 'Notion')],
  },
  {
    icon: Tangent,
    title: 'Design & prototype',
    body: 'Map flows, shape interactions, and build working prototypes when static screens are not enough to validate the idea.',
    tools: [
      tool('/img/strategy/figma.svg', 'Figma'),
      tool('/img/strategy/openai.svg', 'OpenAI', true),
      tool('/img/strategy/claude.svg', 'Claude'),
      plusTool,
      skillmdTool,
    ],
  },
  {
    icon: AudioWaveform,
    title: 'Test & iterate',
    body: 'Put concepts in front of users and stakeholders, watch where they break, and iterate until the experience becomes clearer.',
    tools: [
      tool('/img/strategy/research-tool.png', 'User research tool'),
      tool('/img/strategy/trello.svg', 'Trello'),
      tool('/img/strategy/terminal-app.svg', 'AI terminal tool'),
      tool('/img/strategy/claude.svg', 'Claude'),
      plusTool,
      skillmdTool,
    ],
  },
  {
    icon: ChartSpline,
    title: 'Ship & measure',
    body: 'Partner with engineering or build directly, then track adoption, task completion, and qualitative feedback after launch.',
    toolGapClassName: 'gap-[29px]',
    tools: [
      shipIcon('/img/strategy/ship-github.svg', 'GitHub'),
      shipStorybookTool,
      shipIcon('/img/strategy/ship-tool.svg', 'Deployment tool', 'inset-y-[27.5%] inset-x-[7.5%]', 'h-full w-full -rotate-180 -scale-x-100'),
    ],
  },
];

function ToolBadge({ item }: { item: ToolItem }) {
  if (item.type === 'plus') {
    return <Plus size={16} strokeWidth={1.5} className="shrink-0 text-[#f3f1ea]/50" />;
  }
  if (item.type === 'skillmd') {
    return (
      <div className="relative flex size-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-white">
        <FileText size={16} strokeWidth={1.5} className="text-[#0a0a0a]" />
        <span className="text-[6px] leading-none text-[#0a0a0a]" style={fontMono}>
          skill.md
        </span>
      </div>
    );
  }
  if (item.type === 'ship-icon') {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-[10px] bg-white">
        <div className={`absolute ${item.innerClassName}`}>
          <img src={item.src} alt={item.alt} className={`block max-w-none ${item.imageClassName}`} />
        </div>
      </div>
    );
  }
  if (item.type === 'ship-storybook') {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-[10px] bg-white">
        <div className="absolute inset-[12.5%] overflow-hidden">
          <img
            src="/img/strategy/ship-storybook-vector.svg"
            alt="Storybook"
            className="absolute inset-[1.04%_10.7%] block h-[97.92%] w-[78.6%] max-w-none"
          />
          <img
            src="/img/strategy/ship-storybook-mark.svg"
            alt=""
            className="absolute inset-[1.04%_20.94%_19.6%_30.94%] block h-[79.36%] w-[48.12%] max-w-none"
          />
        </div>
      </div>
    );
  }
  return item.wrap ? (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white">
      <img src={item.src} alt={item.alt} className="h-[65%] w-[65%] object-contain" />
    </div>
  ) : (
    <img src={item.src} alt={item.alt} className="size-10 shrink-0 rounded-[10px] object-cover" />
  );
}

const experienceItems = [
  {
    period: 'Nov 2024 - Present',
    role: 'Lead UX Designer',
    company: 'Liba Space',
    body: 'Lead UX strategy and interaction design across the Nova AI ecosystem: ConnectNova, JobNova, and CrackInterview.',
  },
  {
    period: '2026 - Present',
    role: 'Independent Designer',
    company: 'River Studio',
    body: 'Design and ship AI products solo, end-to-end — MemQ (an iOS study app live on the App Store), Mono (a personal finance AI agent), and client work rebuilding a distributor’s ordering platform.',
  },
  {
    period: 'Jun 2020 - Jun 2022',
    role: 'User Research Specialist',
    company: 'Beijing Smart Walnut Education',
    body: 'Led personas, journey mapping, NPS analysis, and product research that improved engagement by 15% and optimized 50+ learning paths.',
  },
  {
    period: 'Oct 2017 - Jun 2020',
    role: 'UX Designer',
    company: 'Sohu Inc.',
    body: 'Defined interaction standards across product teams and independently designed a social product from zero to 3,000+ daily active users.',
  },
];

const skills = ['User Research', 'Product Strategy', 'Interaction Design', 'Information Architecture', 'AI UX', 'Design Systems', 'Data Visualization', 'Prototyping'];
const toolkit = ['Figma', 'Cursor', 'Claude Code', 'Maze', 'ProtoPie', 'n8n', 'Arduino', 'TouchDesigner'];
const contactEmail = 'mei.chai@mail.polimi.it';

export default function Home() {
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('mei-snap-page');
    return () => document.documentElement.classList.remove('mei-snap-page');
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(contactEmail);
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 1200);
  };

  return (
    <>
      {/* Hero — 整屏高度（100vh）；左右内边距与导航栏一致（px-6 sm:px-8）。
          负 marginTop 抵消 Layout 的 pt-12（导航栏高度），让 hero 顶到视口顶部，
          导航栏悬浮在 hero 上方（半透明 + 模糊），而不是与 hero 之间留白 */}
      <section
        className="mei-section-screen relative flex w-screen flex-col overflow-hidden bg-[#f3f1ea] px-6 pt-14 pb-6 sm:px-8 md:pt-16 md:pb-8"
        style={{ ...fullBleed, marginTop: '-48px', height: '100vh' }}
      >
        {/* 背景：一条粒子构成的鱼在画面里巡游（纯 canvas，无 3D 依赖） */}
        <HeroFish className="pointer-events-none absolute inset-0 z-0 block" />

        <div className="relative z-10 text-[13px] leading-relaxed text-[#0a0a0a]/70 sm:text-[15px]" style={fontMono}>
          <p>const experience = &quot;7+ years&quot;;</p>
          <p>const passion = Infinity;</p>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 text-center text-[#0a0a0a]">
          <div className="flex flex-wrap items-baseline justify-center gap-3 sm:gap-4">
            <span className="text-[16px] tracking-wide sm:text-[20px]" style={fontBody}>
              I AM A(AN)
            </span>
            <h1
              className="text-[44px] leading-[1.05] sm:text-[64px] md:text-[80px]"
              style={{ ...fontDisplay, fontWeight: 500 }}
            >
              <RotatingRole /> Designer
            </h1>
          </div>
          <p className="max-w-[860px] text-[16px] font-light sm:text-[20px]" style={fontBody}>
            I design AI-powered product experiences from research to working prototypes, turning complex systems
            into interfaces people can understand, trust, and use.
          </p>
          <div
            className="mt-4 flex max-w-[380px] flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[13px] leading-tight text-[#0a0a0a] sm:text-[15px] md:text-[18px]"
            style={fontBody}
          >
            <span>Open to thoughtful chats</span>
            <button
              type="button"
              onClick={copyEmail}
              className="mei-email-pill inline-flex min-h-[22px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] leading-none sm:min-h-[24px] sm:px-3 sm:text-[11px] md:min-h-[27px] md:px-3.5 md:text-[12px]"
              aria-label="Copy email address"
            >
              <span className="relative size-3 sm:size-3.5" aria-hidden="true">
                <Mail strokeWidth={1.8} className="mei-email-icon mei-email-icon-mail absolute inset-0 size-full" />
                <Copy strokeWidth={1.8} className="mei-email-icon mei-email-icon-copy absolute inset-0 size-full" />
              </span>
              <span>{emailCopied ? 'copied' : 'email'}</span>
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-4 text-[13px] text-[#0a0a0a] sm:text-[15px]">
          <p style={fontBody}>Based in Milan, IT</p>
          <div className="flex items-center gap-1.5" style={fontBody}>
            <span>Scroll Down</span>
            <span className="mei-hero-scroll-down-line" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Work */}
      <MotionSection
        id="work"
        className="mei-section-screen flex w-screen flex-col items-center bg-white px-6 pb-16 sm:px-10 md:px-16 md:pb-24"
        style={fullBleed}
      >
        <div className="w-full max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#cccccc] py-12 md:flex-row md:items-center md:justify-between md:py-16">
              <h2 className="text-[56px] leading-none md:text-[80px]" style={fontDisplay}>
                Work
              </h2>
              <p className="max-w-[560px] text-[16px] font-light text-[#0a0a0a] md:text-[20px]" style={fontBody}>
                Selected projects across AI recruiting, career tools, learning products, and parenting communities,
                plus research on education decisions and sharing behavior. Each case connects user insight to clearer
                flows, product systems, and testable interfaces.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-16 pt-16 md:gap-24">
            {workGroups.map((group, groupIndex) => (
              <Reveal key={group.label} delay={groupIndex * 70}>
                <div className="flex flex-col gap-6 md:flex-row md:gap-16">
                  <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontBody}>
                    {group.label}
                  </p>
                  <div className="flex-1 divide-y divide-[#cccccc]">
                    <WorkProjectRows items={group.items} />
                    {group.label === 'Product' ? (
                      <div className="pt-6">
                        <Link
                          href="/works"
                          className="mei-view-all-work-link group inline-flex items-center gap-2.5 rounded-full border border-[#0a0a0a]/72 px-4 py-2.5 text-[14px]"
                          style={fontBody}
                        >
                          <span className="relative z-10">View all works</span>
                          <ArrowUpRight
                            aria-hidden
                            strokeWidth={1.6}
                            className="mei-view-all-work-icon relative z-10 size-4 shrink-0"
                          />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={workGroups.length * 70}>
            <div className="flex flex-col gap-6 pt-16 md:flex-row md:gap-16 md:pt-24">
              <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontBody}>
                Demos
              </p>
              <div className="flex-1">
                <p className="max-w-[560px] text-[16px] font-light text-[#0a0a0a]/58 md:text-[18px]" style={fontBody}>
                  Two interfaces you can actually drive. Open either one fullscreen.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
                  <HomeDemoCard
                    title="Procurement Agent"
                    blurb="An agent workspace for purchase planning — review a proposal, check documents, and approve."
                    src={PROCUREMENT_AGENT_DEMO_URL}
                  />
                  <HomeDemoCard
                    title="ConnectNova Sequence Builder"
                    blurb="Build an outreach sequence on the canvas, walk a complete flow, or inspect execution results."
                    src="/demos/connectnova-sequence"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </MotionSection>

      {/* Strategy */}
      <section
        id="strategy"
        className="mei-section-screen flex w-screen flex-col items-center gap-16 bg-[#0a0a0a] px-6 py-16 sm:px-8 md:gap-24 md:py-28"
        style={fullBleed}
      >
        <Reveal>
          <h2
            className="text-center text-[64px] leading-none text-white sm:text-[96px] md:text-[140px]"
            style={{ ...fontDisplay, fontStyle: 'italic', fontWeight: 400 }}
          >
            strategy
          </h2>
        </Reveal>

        <div className="flex w-full max-w-[1200px] flex-col gap-12 md:flex-row md:items-start md:gap-16">
          <div className="w-full md:sticky md:top-24 md:w-[40%] md:self-start">
            <Reveal>
              <div className="flex flex-col gap-5 text-[#ed5b2b]">
                <h3 className="max-w-[480px] text-[22px] md:text-[24px]" style={fontBody}>
                  Research to reality — no hand-off gap
                </h3>
                <p className="max-w-[380px] text-[15px] font-light md:text-[16px]" style={fontBody}>
                  My process connects discovery, product decisions, prototype, and measurement so design does not
                  stop at handoff. I use research to reduce ambiguity, then make ideas tangible enough to test.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative flex flex-1 flex-col gap-10 md:gap-28 md:pb-24">
            {/* 贯穿全部步骤的单根竖线（不再按行分段，行与行之间不再断开） */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#f3f1ea]/20" />

            {processSteps.map((step, i) => {
              const Icon = step.icon;
              const reversed = i % 2 === 1;
              const iconBadge = (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white">
                  <Icon size={22} strokeWidth={1.5} className="text-[#0a0a0a]" />
                </div>
              );
              const contentBlock = (
                <div
                  className={`flex flex-col gap-3 py-2 ${reversed ? 'items-end text-right' : 'items-start text-left'}`}
                >
                  <h4 className="text-[20px] text-[#f3f1ea] md:text-[24px]" style={fontBody}>
                    {step.title}
                  </h4>
                  <p className="max-w-[380px] text-[15px] font-light text-[#f3f1ea]/85 md:text-[16px]" style={fontBody}>
                    {step.body}
                  </p>
                  <div
                    className={`flex flex-wrap items-center ${step.toolGapClassName ?? 'gap-3'} ${
                      reversed ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {step.tools.map((t, ti) => (
                      <ToolBadge key={ti} item={t} />
                    ))}
                  </div>
                </div>
              );
              return (
                <Reveal key={step.title} delay={i * 60}>
                  {/* 三栏等宽网格：左右两栏永远各占 1fr，圆点始终落在正中间那根竖线上 */}
                  <div className="mei-process-step grid grid-cols-[1fr_auto_1fr] items-center">
                    <div className="flex justify-end pr-6 md:pr-10">{reversed ? contentBlock : iconBadge}</div>
                    <div className="flex w-4 shrink-0 items-center justify-center">
                      <div className="size-2.5 shrink-0 rounded-full border border-[#f3f1ea]/50 bg-[#0a0a0a]" />
                    </div>
                    <div className="flex justify-start pl-6 md:pl-10">{reversed ? iconBadge : contentBlock}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* About + How Can I Help */}
      <MotionSection
        id="about"
        className="mei-section-screen flex w-screen flex-col items-center bg-[#f3f1ea] px-6 py-16 sm:px-10 md:px-16 md:py-28"
        style={fullBleed}
      >
        <div className="w-full max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#cccccc] pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
              <h2 className="text-[56px] leading-none md:text-[80px]" style={fontDisplay}>
                About
              </h2>
              <p className="max-w-[620px] text-[16px] font-light leading-[1.6] text-[#0a0a0a] md:text-[20px]" style={fontBody}>
                I am a Product Designer with 7+ years of experience across AI products, research, design systems, and
                code-based delivery. I turn complex product logic into clear, usable experiences people can trust.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-16 pt-16 md:gap-20">
            <Reveal>
              <div className="flex flex-col gap-6 md:flex-row md:gap-16">
                <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontBody}>
                  Experience
                </p>
                <div className="flex-1 divide-y divide-[#cccccc]">
                  {experienceItems.map((item) => (
                    <div key={`${item.company}-${item.role}`} className="grid gap-3 py-5 first:pt-0 md:grid-cols-[150px_1fr] md:gap-8">
                      <p className="text-[13px] text-[#ed5b2b] md:text-[14px]" style={fontBody}>
                        {item.period}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
                          <h3 className="text-[17px] text-[#0a0a0a] md:text-[19px]" style={fontBody}>
                            {item.role}
                          </h3>
                          <span className="text-[14px] font-light text-[#0a0a0a]/60 md:text-[15px]" style={fontBody}>
                            {item.company}
                          </span>
                        </div>
                        <p className="max-w-[720px] text-[14px] font-light leading-[1.65] text-[#0a0a0a]/75 md:text-[15px]" style={fontBody}>
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-col gap-6 pt-10 md:flex-row md:gap-16 md:pt-12">
                <h2 className="w-full shrink-0 text-[32px] leading-tight md:w-[300px] md:text-[48px]" style={fontDisplay}>
                  How Can I Help?
                </h2>
                <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="border-b border-[#cccccc] pb-2 text-[17px] font-medium md:text-[18px]" style={fontBody}>
                      Skills
                    </h3>
                    <ul className="flex flex-col text-[15px] font-light text-[#0a0a0a] md:text-[16px]" style={fontBody}>
                      {skills.map((s) => (
                        <li key={s} className="py-1.5">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="border-b border-[#cccccc] pb-2 text-[17px] font-medium md:text-[18px]" style={fontBody}>
                      Toolkit
                    </h3>
                    <ul className="flex flex-col text-[15px] font-light text-[#0a0a0a] md:text-[16px]" style={fontBody}>
                      {toolkit.map((t) => (
                        <li key={t} className="py-1.5">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
