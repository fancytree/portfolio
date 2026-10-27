'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AudioWaveform, ChartSpline, FileText, Plus, Search, Star, Tangent } from 'lucide-react';
import { InteractivePond } from './components/InteractivePond';
import WorkProjectRows from './components/WorkProjectRows';
import { productProjects } from '@/lib/work-projects';

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

function useSectionMotion(options?: { pinned?: boolean }) {
  const pinned = options?.pinned ?? false;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting || entry.intersectionRatio > 0;
        // pinned：只淡入一次，永不再淡出/位移——这是页面最后一屏，紧贴着 fixed footer，
        // 若在滚出视口时被重新判定为不可见，视差位移和透明度衰减会露出下方正文容器的白色背景。
        setIsVisible((prev) => (pinned ? prev || nowVisible : nowVisible));
      },
      { threshold: 0.12, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(node);

    if (reduceMotion || pinned) {
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
  }, [pinned]);

  return { ref, isVisible, shift };
}

function MotionSection({
  children,
  className = '',
  style,
  pinned,
  ...props
}: React.ComponentPropsWithoutRef<'section'> & { pinned?: boolean }) {
  const { ref, isVisible, shift } = useSectionMotion({ pinned });
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

const fontDisplay: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontWeight: 400 };
const fontTitle: React.CSSProperties = {
  fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
  fontWeight: 400,
};
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };
const fontMono: React.CSSProperties = { fontFamily: 'var(--font-dm-mono)' };

const heroGreeting = "Hey, I'm Mei Chai (River).";
const heroIntroText = 'I design AI-native products that put people in control.';
const heroIntroTokens = heroIntroText.match(/\S+\s*/g) ?? [heroIntroText];

function HeroTypedHeading() {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => setVisibleCharacters(heroIntroText.length));
      return () => window.cancelAnimationFrame(frame);
    }

    let animationFrame = 0;
    const startTimer = window.setTimeout(() => {
      const startedAt = performance.now();
      const charactersPerSecond = 42;

      const typeNextCharacters = (now: number) => {
        const nextCount = Math.min(
          heroIntroText.length,
          Math.floor(((now - startedAt) / 1000) * charactersPerSecond),
        );
        setVisibleCharacters(nextCount);

        if (nextCount < heroIntroText.length) {
          animationFrame = window.requestAnimationFrame(typeNextCharacters);
        }
      };

      animationFrame = window.requestAnimationFrame(typeNextCharacters);
    }, 420);

    return () => {
      window.clearTimeout(startTimer);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const isComplete = visibleCharacters === heroIntroText.length;
  const typedTokens = heroIntroTokens.map((token, tokenIndex) => {
    const tokenStart = heroIntroTokens.slice(0, tokenIndex).join('').length;

    return (
      <span key={`${token}-${tokenIndex}`} className="inline-block whitespace-pre">
        {Array.from(token).map((character, characterIndex) => {
          const absoluteIndex = tokenStart + characterIndex;
          const isVisible = absoluteIndex < visibleCharacters;
          const carriesCursor = visibleCharacters > 0 && absoluteIndex === visibleCharacters - 1;

          return (
            <span
              key={absoluteIndex}
              className="relative inline-block"
              style={{ visibility: isVisible ? 'visible' : 'hidden' }}
            >
              {character}
              {carriesCursor && (
                <span className="mei-type-cursor mei-type-cursor-follow text-[#0a0a0a]" />
              )}
            </span>
          );
        })}
      </span>
    );
  });

  return (
    <div className="max-w-[760px]">
      <p
        className="mb-4 flex items-center gap-2 text-[12px] leading-none text-[#0a0a0a]/65 sm:mb-5 sm:text-[13px]"
        style={fontMono}
      >
        <span className="text-[#0a0a0a]" aria-hidden="true">
          &gt;
        </span>
        {heroGreeting}
      </p>

      <h1
        aria-label={heroIntroText}
        className="relative text-[34px] leading-[1.08] tracking-[-0.035em] text-[#0a0a0a] sm:text-[44px] md:text-[54px]"
        style={fontDisplay}
      >
        <span aria-hidden="true">{typedTokens}</span>
      </h1>

      <p
        className="mt-5 max-w-[620px] text-[16px] font-light leading-[1.6] text-[#0a0a0a]/75 md:text-[20px]"
        style={fontBody}
      >
        Product designer with 6+ years in UX and user research. I turn complex workflows into usable products,
        build the systems behind them, and iterate with real usage data.
      </p>

      <div
        className={`mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] tracking-[0.08em] text-[#0a0a0a]/55 transition-all duration-500 sm:mt-6 sm:text-[11px] ${
          isComplete ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
        style={fontMono}
        aria-label="AI-native products, design systems, and data-informed design"
      >
        <span>AI-NATIVE PRODUCTS</span>
        <span className="text-[#0a0a0a]" aria-hidden="true">/</span>
        <span>DESIGN SYSTEMS</span>
        <span className="text-[#0a0a0a]" aria-hidden="true">/</span>
        <span>DATA-INFORMED DESIGN</span>
      </div>
    </div>
  );
}

const homeWorkItems = [
  ...['Procurement Agent', 'DEF Beauty ERP', 'JobNova', 'ConnectNova'].flatMap((title) =>
    productProjects.filter((project) => project.title === title)
  ),
];

const homeExperimentItems = ['Mono', 'MemQ', 'SenseFlow'].flatMap((title) =>
  productProjects.filter((project) => project.title === title)
);

type ToolItem =
  | { type: 'icon'; src: string; alt: string; wrap?: boolean }
  | { type: 'plus' }
  | { type: 'skillmd' }
  | { type: 'ship-icon'; src: string; alt: string; innerClassName?: string; imageClassName?: string };

const tool = (src: string, alt: string, wrap?: boolean): ToolItem => ({ type: 'icon', src, alt, wrap });
const plusTool: ToolItem = { type: 'plus' };
const skillmdTool: ToolItem = { type: 'skillmd' };
const shipIcon = (
  src: string,
  alt: string,
  innerClassName: string = 'inset-[12.5%]',
  imageClassName: string = 'h-full w-full'
): ToolItem => ({ type: 'ship-icon', src, alt, innerClassName, imageClassName });

const processSteps = [
  {
    icon: Search,
    title: 'Find the decision',
    body: 'Use interviews, workflow observation, and product behavior to understand where people get stuck. Connect those findings to a problem the team can act on.',
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
    title: 'Frame the product',
    body: 'Map the workflow, decision points, states, and exceptions with product and engineering. Define what an agent can do and where people need to review, edit, or approve.',
    tools: [tool('/img/strategy/figma.svg', 'Figma'), tool('/img/strategy/notion.svg', 'Notion')],
  },
  {
    icon: Tangent,
    title: 'Make the system reusable',
    body: 'Build tokens, components, states, and usage rules for each product. Keep design and code aligned so engineers and AI coding tools can reuse the same foundations.',
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
    title: 'Prototype the behavior',
    body: 'Make the workflow tangible in Figma or code. Test how people understand recommendations, make changes, and recover when something goes wrong.',
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
    title: 'Let evidence guide the next step',
    body: 'Use PostHog funnels, heatmaps, and session recordings to inform iteration. At JobNova, a one-week onboarding A/B test with 100+ users helped choose the flow we shipped.',
    toolGapClassName: 'gap-[29px]',
    tools: [
      shipIcon('/img/strategy/ship-github.svg', 'GitHub'),
      shipIcon('/img/strategy/figma.svg', 'Figma'),
      shipIcon('/img/strategy/ship-tool.svg', 'Deployment tool', 'inset-y-[27.5%] inset-x-[7.5%]', 'h-full w-full -rotate-180 -scale-x-100'),
    ],
  },
];

function ToolBadge({ item }: { item: ToolItem }) {
  if (item.type === 'plus') {
    return <Plus size={16} strokeWidth={1.5} className="shrink-0 text-white/50" />;
  }
  if (item.type === 'skillmd') {
    return (
      <div className="relative flex size-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-[#f4f4f1]">
        <FileText size={16} strokeWidth={1.5} className="text-[#0a0a0a]" />
        <span className="text-[6px] leading-none text-[#0a0a0a]" style={fontMono}>
          skill.md
        </span>
      </div>
    );
  }
  if (item.type === 'ship-icon') {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-[10px] bg-[#f4f4f1]">
        <div className={`absolute ${item.innerClassName}`}>
          <img src={item.src} alt={item.alt} className={`block max-w-none ${item.imageClassName}`} />
        </div>
      </div>
    );
  }
  return item.wrap ? (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f4f4f1]">
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
    body: 'Lead UX across ConnectNova, JobNova, and CrackInterview, from AI workflows to design systems and front-end delivery. Built Design Lab for documentation, release reviews, and iteration; mentored two interns for six months each as they progressed to independent design and delivery.',
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

const skills = ['AI Product Design', 'Design Systems', 'User Research', 'Interaction Design', 'Information Architecture', 'Product Analytics & A/B Testing', 'Design-to-Code', 'Design Mentoring'];
const toolkit = ['Figma', 'Figma MCP', 'Cursor', 'Claude Code', 'PostHog', 'GitHub'];

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('mei-snap-page');
    return () => document.documentElement.classList.remove('mei-snap-page');
  }, []);

  return (
    <>
      {/* Hero — 保留整屏最小高度，文字较长时允许内容撑高。
          负 marginTop 抵消 Layout 的 pt-12（导航栏高度），让 hero 顶到视口顶部，
          导航栏悬浮在 hero 上方（半透明 + 模糊），而不是与 hero 之间留白 */}
      <section
        className="mei-section-screen relative flex w-screen flex-col justify-between overflow-hidden bg-[#f3f1ea] px-6 pt-14 pb-6 sm:px-8 md:pt-16 md:pb-8"
        style={{ ...fullBleed, marginTop: '-48px' }}
      >
        {/* 背景：可交互的池塘（点击水面放鱼、点击鱼弹俏皮话），纯 canvas 无 3D 依赖 */}
        <InteractivePond className="absolute inset-0 z-0 block" />

        {/* 前景内容层 pointer-events-none，让点击穿透到下方的池塘 canvas */}
        <div
          className="pointer-events-none relative z-10 text-[13px] leading-relaxed text-[#0a0a0a]/70 sm:text-[15px]"
          style={fontMono}
        >
          <p>const role = &quot;Product Designer&quot;;</p>
          <p>const experience = &quot;6+ years&quot;;</p>
        </div>

        {/* 左边距对齐 Work 区域：先用负 margin 抵消 Hero 自身的 px-6 sm:px-8，
            再套用 Work 完全相同的 px-6 sm:px-10 md:px-16 + max-w-[1000px]，
            这样两个区域的正文左边缘在任何视口宽度下都精确对齐 */}
        <div className="pointer-events-none relative z-10 -mx-6 px-6 sm:-mx-8 sm:px-10 md:px-16">
          <div className="mx-auto w-full max-w-[1000px]">
            <HeroTypedHeading />
          </div>
        </div>

        <div className="pointer-events-none relative z-10 flex items-end justify-between gap-4 text-[13px] text-[#0a0a0a] sm:text-[15px]">
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
        <div className="w-full max-w-[1000px]">
          <Reveal>
            <div className="flex flex-col gap-6 pt-12 md:pt-16">
              <h2 className="text-[40px] leading-none md:text-[56px]" style={fontDisplay}>
                Selected work
              </h2>
              <p className="max-w-[620px] text-[16px] font-light leading-[1.6] text-[#0a0a0a]/75 md:text-[20px]" style={fontBody}>
                Shipped work across AI recruiting, job search, and business operations. Each case connects the problem,
                my design decisions, and the evidence behind the outcome.
              </p>
            </div>
          </Reveal>

          <div className="pt-8 md:pt-10">
            <Reveal>
              <WorkProjectRows items={homeWorkItems} />
              <div className="pt-6">
                <Link
                  href="/works"
                  className="inline-flex w-fit items-center gap-2 bg-black px-4 py-2 text-[16px] leading-6 text-white uppercase no-underline opacity-100 transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:opacity-85 focus-visible:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#ed5b2b]"
                  style={{ fontFamily: 'var(--mei-font-display), Oswald, sans-serif', fontWeight: 400, letterSpacing: 0 }}
                >
                  <span>View all works</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="flex flex-col gap-6 pt-16 md:pt-24">
              <div className="flex flex-col gap-3">
                <h3 className="text-[22px] leading-none md:text-[28px]" style={fontDisplay}>
                  Experiments
                </h3>
                <p className="max-w-[620px] text-[15px] font-light leading-[1.6] text-[#0a0a0a]/75 md:text-[17px]" style={fontBody}>
                  Self-initiated products I designed and built end to end, where I try out new AI interaction
                  patterns on my own.
                </p>
              </div>
              <WorkProjectRows items={homeExperimentItems} />
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
            className="text-center text-[40px] leading-none text-white md:text-[56px]"
            style={fontDisplay}
          >
            Strategy
          </h2>
        </Reveal>

        <div className="flex w-full max-w-[1200px] flex-col gap-12 md:flex-row md:items-start md:gap-16">
          <div className="w-full md:sticky md:top-24 md:w-[40%] md:self-start">
            <Reveal>
              <div className="flex flex-col gap-5">
                <h3 className="max-w-[480px] text-[22px] text-white md:text-[24px]" style={fontTitle}>
                  From evidence to working products
                </h3>
                <p className="max-w-[380px] text-[15px] font-light text-white/70 md:text-[16px]" style={fontBody}>
                  My work connects research, AI interaction design, reusable systems, and implementation.
                  I make the human decisions explicit, work with engineering on the constraints, and use what happens
                  after launch to decide what needs to change.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative flex flex-1 flex-col gap-10 md:gap-28 md:pb-24">
            {/* 贯穿全部步骤的单根竖线（不再按行分段，行与行之间不再断开） */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20" />

            {processSteps.map((step, i) => {
              const Icon = step.icon;
              const reversed = i % 2 === 1;
              const iconBadge = (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f1]">
                  <Icon size={22} strokeWidth={1.5} className="text-[#0a0a0a]" />
                </div>
              );
              const contentBlock = (
                <div
                  className={`flex flex-col gap-3 py-2 ${reversed ? 'items-end text-right' : 'items-start text-left'}`}
                >
                  <h4 className="text-[20px] text-white md:text-[24px]" style={fontTitle}>
                    {step.title}
                  </h4>
                  <p className="max-w-[380px] text-[15px] font-light text-white/70 md:text-[16px]" style={fontBody}>
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
                      <div className="size-2.5 shrink-0 rounded-full border border-white/50 bg-[#0a0a0a]" />
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
        className="mei-section-screen flex w-screen flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-16 md:py-28"
        style={fullBleed}
        pinned
      >
        <div className="w-full max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#cccccc] pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
              <h2 className="text-[40px] leading-none md:text-[56px]" style={fontDisplay}>
                About
              </h2>
              <p className="max-w-[620px] text-[16px] font-light leading-[1.6] text-[#0a0a0a] md:text-[20px]" style={fontBody}>
                I’m a product designer based in Milan, with a background in interaction design at Sohu and user
                research at Smart Walnut. Today, I design AI-native SaaS products and complex business workflows,
                build reusable design systems, and carry decisions through to working code.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-16 pt-16 md:gap-20">
            <Reveal>
              <div className="flex flex-col gap-6 md:flex-row md:gap-16">
                <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontTitle}>
                  Experience
                </p>
                <div className="flex-1 divide-y divide-[#cccccc]">
                  {experienceItems.map((item) => (
                    <div key={`${item.company}-${item.role}`} className="grid gap-3 py-5 first:pt-0 md:grid-cols-[150px_1fr] md:gap-8">
                      <p className="text-[13px] text-[#0a0a0a]/58 md:text-[14px]" style={fontBody}>
                        {item.period}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
                          <h3 className="text-[17px] text-[#0a0a0a] md:text-[19px]" style={fontTitle}>
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
                <h2 className="w-full shrink-0 text-[24px] leading-tight md:w-[300px] md:text-[34px]" style={fontTitle}>
                  What I bring
                </h2>
                <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="border-b border-[#cccccc] pb-2 text-[17px] font-medium md:text-[18px]" style={fontTitle}>
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
                    <h3 className="border-b border-[#cccccc] pb-2 text-[17px] font-medium md:text-[18px]" style={fontTitle}>
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
