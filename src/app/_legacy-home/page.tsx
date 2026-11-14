'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { InteractivePond } from '../components/InteractivePond';
import WorkProjectRows from '../components/WorkProjectRows';
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

// 每个区块只入场一次：淡入 + 上浮，滚回去不再重播，也不跟着滚动做视差位移。
function useSectionMotion() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function MotionSection({
  children,
  className = '',
  style,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  const { ref, isVisible } = useSectionMotion();

  return (
    <section
      ref={ref}
      data-visible={isVisible ? 'true' : 'false'}
      className={`mei-motion-section ${className}`}
      style={style}
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

// 字体规则：Oswald 写「名字」（章节名、作品名、步骤名、职位名），
// Inter 写「句子」（首屏那句话和所有正文），DM Mono 只写批注。
const fontName: React.CSSProperties = {
  fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
  fontWeight: 400,
};
const fontSentence: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontWeight: 400 };
const fontBody: React.CSSProperties = { fontFamily: 'var(--font-inter)' };
const fontMono: React.CSSProperties = { fontFamily: 'var(--font-dm-mono)' };

const heroGreeting = "Hey, I'm Mei Chai (River).";
const heroIntroText = 'Beyond screens, I design products people can understand and trust, from AI tools to business software, and build the systems behind them';
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
        style={fontSentence}
      >
        <span aria-hidden="true">{typedTokens}</span>
      </h1>

      <div
        className={`mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.02em] text-[#0a0a0a]/60 transition-[opacity,transform] duration-500 sm:mt-6 sm:text-[12px] ${
          isComplete ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
        style={fontMono}
        aria-label="UX, product strategy, and systems thinking"
      >
        <span>UX</span>
        <span className="text-[#0a0a0a]" aria-hidden="true">/</span>
        <span>Product strategy</span>
        <span className="text-[#0a0a0a]" aria-hidden="true">/</span>
        <span>Systems thinking</span>
      </div>
    </div>
  );
}

const homeWorkItems = [
  ...['Procurement Agent', 'DEF Beauty ERP', 'JobNova', 'ConnectNova'].flatMap((title) =>
    productProjects.filter((project) => project.title === title)
  ),
];

const homeExperimentItems = ['Mono', 'MemQ', 'SenseFlow', 'Team HQ', 'Milan Site Selection'].flatMap((title) =>
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

// Strategy 按方法组织，不是按流程：每块是「方法 + 它定下什么决定 + 具名项目」。
// settles 一行用等宽写，和首屏的批注层同一个签名。
const methods = [
  {
    title: 'Workflow observation and interviews',
    settles: 'Which problem is worth solving',
    artifacts: [
      {
        src: '/img/strategy/method/interviews.webp',
        alt: 'Printed interview scripts spread across a desk, with handwritten notes in blue ink.',
        caption: 'Interview scripts with handwritten notes \u00b7 DEF ERP',
      },
      {
        src: '/img/strategy/method/affinity-map.webp',
        alt: 'Affinity board with five participant rows of notes clustered into themed columns.',
        caption: 'Affinity map across five participant interviews',
      },
    ],
    body: 'Interviews, workflow observation, and product behavior show where people get stuck. It is how fragmented procurement data turned into explainable recommendations, and how DEF ERP\u2019s role-based workflows got drawn.',
    tools: [
      tool('/img/strategy/notion.svg', 'Notion'),
      tool('/img/strategy/claude.svg', 'Claude'),
      tool('/img/strategy/terminal-app.svg', 'AI terminal tool'),
      plusTool,
      skillmdTool,
    ],
  },
  {
    title: 'Journey and service mapping',
    settles: 'Where the service breaks between people and systems',
    body: 'A journey or a service map puts the whole chain in one picture: what a person does at each step, what each system returns, and who picks up the next move. It is where the gaps between roles and channels become visible before anything is designed.',
    artifacts: [
      {
        src: '/img/strategy/method/journey-map.webp',
        alt: 'User journey map with steps, actions, touchpoints, an emotion curve, and opportunities.',
        caption: 'User journey with emotion and opportunities \u00b7 Customer Service System',
      },
      {
        src: '/img/Clarity/User flow.svg',
        alt: 'Service map connecting a user, a tracking device, the app, a doctor, and the national health service.',
        caption: 'Service map across device, app, doctor, and health service \u00b7 Clarity',
      },
      {
        src: '/img/Milano Partecipa/Service Map.svg',
        alt: 'Service blueprint connecting citizens, an AI chatbot, city projects, the municipality, and partners.',
        caption: 'Service blueprint across citizens, city, and partners \u00b7 Milano Partecipa',
      },
    ],
    tools: [tool('/img/strategy/figma.svg', 'Figma'), tool('/img/strategy/notion.svg', 'Notion')],
  },
  {
    title: 'Human and AI responsibility mapping',
    settles: 'What the agent does, where a person decides',
    artifacts: [
      {
        src: '/img/strategy/method/human-handoff.webp',
        alt: 'Diagram: agent output, then a person reviews or dismisses, then product code saves the change.',
        caption: 'Where the agent stops and a person confirms \u00b7 Mono',
      },
      {
        src: '/img/strategy/method/swimlane.webp',
        alt: 'Three-lane swimlane flow across end user, chat system, and support agent.',
        caption: 'Cross-role swimlane: user, system, support agent \u00b7 Customer Service System',
      },
    ],
    body: 'Decision points, states, and exceptions mapped with product and engineering. JobNova\u2019s review and authorization controls and the Procurement Agent\u2019s human check before a purchase come out of that map.',
    tools: [tool('/img/strategy/figma.svg', 'Figma'), tool('/img/strategy/notion.svg', 'Notion')],
  },
  {
    title: 'Design systems',
    settles: 'What gets reused instead of rebuilt',
    artifacts: [
      {
        src: '/img/strategy/method/design-system-jobnova.webp',
        alt: 'Design system board with colours, typography, spacing tokens, buttons, icons, and cards.',
        caption: 'Visual foundations and component vocabulary \u00b7 JobNova',
      },
      {
        src: '/img/strategy/method/design-system-def.webp',
        alt: 'Typography, semantic colours, spacing, and shape tokens taken from the ERP source.',
        caption: 'Typography, colour, spacing, and shape tokens \u00b7 DEF ERP',
      },
    ],
    body: 'Tokens, components, states, and usage rules, kept aligned between design and code so engineers and AI coding tools work from the same foundations. DEF ERP runs on them; at Liba, Design Lab holds the documentation and release reviews.',
    tools: [
      tool('/img/strategy/figma.svg', 'Figma'),
      tool('/img/strategy/openai.svg', 'OpenAI', true),
      tool('/img/strategy/claude.svg', 'Claude'),
      plusTool,
      skillmdTool,
    ],
  },
  {
    title: 'Prototyping in Figma and code',
    settles: 'Whether people understand it before it ships',
    body: 'The workflow gets made tangible early, to test how people read a recommendation, change it, and recover when something goes wrong. At Clarity the app went in front of people in person, with a board on the table to capture how the experience felt.',
    artifacts: [
      {
        src: '/img/strategy/method/wireframes.webp',
        alt: 'Wireframe board connecting landing, sign-up, matching, and interview screens with flow arrows.',
        caption: 'Wireframe flow from sign-up to matching \u00b7 CrackInterview',
      },
      {
        src: '/img/strategy/method/user-test.webp',
        alt: 'A participant at a test table with the app on two phones, a feedback board, and a researcher taking notes.',
        caption: 'Testing the app in person, with a board for how it felt \u00b7 Clarity',
      },
    ],
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
    title: 'Behavioral evidence',
    settles: 'What to change next',
    artifacts: [],
    body: 'PostHog funnels, heatmaps, and session recordings show where people drop out. At JobNova, a one-week onboarding A/B test with 100+ users chose the flow we shipped.',
    tools: [
      shipIcon('/img/strategy/ship-github.svg', 'GitHub'),
      shipIcon('/img/strategy/figma.svg', 'Figma'),
      shipIcon('/img/strategy/ship-tool.svg', 'Deployment tool', 'inset-y-[27.5%] inset-x-[7.5%]', 'h-full w-full -rotate-180 -scale-x-100'),
    ],
  },
];

function ToolBadge({ item }: { item: ToolItem }) {
  if (item.type === 'plus') {
    return <Plus size={16} strokeWidth={1.5} className="shrink-0 text-white/45" />;
  }
  if (item.type === 'skillmd') {
    return (
      <div className="relative flex size-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-[#ebe8e0]">
        <FileText size={16} strokeWidth={1.5} className="text-[#0a0a0a]" />
        <span className="text-[6px] leading-none text-[#0a0a0a]" style={fontMono}>
          skill.md
        </span>
      </div>
    );
  }
  if (item.type === 'ship-icon') {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-[10px] bg-[#ebe8e0]">
        <div className={`absolute ${item.innerClassName}`}>
          <img src={item.src} alt={item.alt} className={`block max-w-none ${item.imageClassName}`} />
        </div>
      </div>
    );
  }
  return item.wrap ? (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#ebe8e0]">
      <img src={item.src} alt={item.alt} className="h-[65%] w-[65%] object-contain" />
    </div>
  ) : (
    <img src={item.src} alt={item.alt} className="size-10 shrink-0 rounded-[10px] object-cover" />
  );
}

const experienceItems = [
  {
    period: 'Jun 2026 - Present',
    role: 'Freelance Product Designer',
    company: 'DEF Beauty (client project)',
    body: "Rebuilt a wholesale distributor's operations on one source of truth and designed an AI procurement agent now in use: a purchase plan that took 30 minutes to 2 hours now takes 5 to 10 minutes. About a month after launch, 86% of orders were placed by customers themselves through the WeChat mini-program.",
  },
  {
    period: 'Nov 2024 - Jun 2026',
    role: 'Founding Designer',
    company: 'Liba Space',
    body: 'Led UX across ConnectNova, JobNova, and CrackInterview, from AI workflows to design systems and front-end delivery. An onboarding A/B test raised JobNova completion from 73% to 96%. Built Design Lab for documentation, release reviews, and iteration; mentored two interns for six months each as they progressed to independent design and delivery.',
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
    document.documentElement.classList.add('mei-snap-page', 'mei-home');
    return () => document.documentElement.classList.remove('mei-snap-page', 'mei-home');
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
            <span>Scroll</span>
            <span className="mei-hero-scroll-down-line" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Work */}
      <MotionSection
        id="work"
        className="mei-section-screen flex w-screen flex-col items-center bg-[#f3f1ea] px-6 pb-16 sm:px-10 md:px-16 md:pb-24"
        style={fullBleed}
      >
        <div className="w-full max-w-[1000px]">
          <Reveal>
            <div className="flex flex-col gap-6 pt-12 md:pt-16">
              <h2 className="text-[40px] leading-none md:text-[56px]" style={fontName}>
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
              <WorkProjectRows items={homeWorkItems} animatedCovers />
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="flex flex-col gap-6 pt-16 md:pt-24">
              <div className="flex flex-col gap-3">
                <h3 className="text-[26px] leading-none md:text-[32px]" style={fontName}>
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
        className="mei-section-screen flex w-screen flex-col items-center bg-[#0a0a0a] px-6 py-16 sm:px-10 md:px-16 md:py-28"
        style={fullBleed}
      >
        <div className="flex w-full max-w-[1200px] flex-col gap-12 md:flex-row md:items-start md:gap-24">
          {/* 左栏固定：章节名 + 一句话定位 + 说明，正文全部左对齐 */}
          <div className="w-full md:sticky md:top-24 md:w-[36%] md:self-start">
            <Reveal>
              <div className="flex flex-col gap-6">
                <h2 className="text-[40px] leading-none text-white md:text-[56px]" style={fontName}>
                  Strategy
                </h2>
                <div className="flex flex-col gap-4">
                  <h3 className="max-w-[420px] text-[20px] leading-[1.3] text-white md:text-[24px]" style={fontSentence}>
                    From evidence to working products
                  </h3>
                  <p className="max-w-[420px] text-[15px] font-light leading-[1.6] text-white/70 md:text-[16px]" style={fontBody}>
                    My work connects research, AI interaction design, reusable systems, and implementation.
                    I make the human decisions explicit, work with engineering on the constraints, and use what happens
                    after launch to decide what needs to change.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 右栏：五种方法并列，每块一条分隔细线，不编号也不连竖线——它们不是顺序 */}
          <div className="flex-1">
            <ul className="flex flex-col">
              {methods.map((method, i) => (
                <li key={method.title}>
                  <Reveal delay={i * 60}>
                    <div className="flex flex-col gap-3 border-t border-white/15 pt-6 pb-10 md:pt-8 md:pb-12">
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-[20px] leading-tight text-white md:text-[24px]" style={fontName}>
                          {method.title}
                        </h4>
                        <p className="text-[12px] leading-normal text-white/55 md:text-[13px]" style={fontMono}>
                          {method.settles}
                        </p>
                      </div>
                      <p className="max-w-[560px] text-[15px] font-light leading-[1.6] text-white/70 md:text-[16px]" style={fontBody}>
                        {method.body}
                      </p>
                      {method.artifacts.length > 0 && (
                        <div className="grid gap-4 pt-2 sm:grid-cols-2">
                          {method.artifacts.map((artifact) => (
                            <figure key={artifact.src} className="flex flex-col gap-2">
                              <div className="overflow-hidden rounded-[10px] bg-white ring-1 ring-white/10">
                                <img
                                  src={artifact.src}
                                  alt={artifact.alt}
                                  loading="lazy"
                                  decoding="async"
                                  className="aspect-[16/10] w-full object-contain"
                                />
                              </div>
                              <figcaption className="text-[11px] leading-normal text-white/50" style={fontMono}>
                                {artifact.caption}
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {method.tools.map((t, ti) => (
                          <ToolBadge key={ti} item={t} />
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
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
            <div className="flex flex-col gap-6 border-b border-[#0a0a0a]/12 pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
              <h2 className="text-[40px] leading-none md:text-[56px]" style={fontName}>
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
                <p className="w-full shrink-0 text-[22px] text-[#0a0a0a] md:w-[140px] md:text-[32px]" style={fontName}>
                  Experience
                </p>
                <div className="flex-1 divide-y divide-[#0a0a0a]/12">
                  {experienceItems.map((item) => (
                    <div key={`${item.company}-${item.role}`} className="grid gap-3 py-5 first:pt-0 md:grid-cols-[150px_1fr] md:gap-8">
                      <p className="text-[13px] text-[#0a0a0a]/58 md:text-[14px]" style={fontBody}>
                        {item.period}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
                          <h3 className="text-[17px] text-[#0a0a0a] md:text-[19px]" style={fontName}>
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
                <h2 className="w-full shrink-0 text-[24px] leading-tight md:w-[300px] md:text-[34px]" style={fontName}>
                  What I bring
                </h2>
                <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="border-b border-[#0a0a0a]/12 pb-2 text-[17px] font-medium md:text-[18px]" style={fontName}>
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
                    <h3 className="border-b border-[#0a0a0a]/12 pb-2 text-[17px] font-medium md:text-[18px]" style={fontName}>
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
