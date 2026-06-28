'use client';

import { useState, useRef, useEffect } from 'react';

// 自定义 hook：检测元素是否进入视口并触发动画
function useScrollAnimation(initialDelay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 对于初始就在视口内的元素（如 hero），添加一个延迟以确保动画可见
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              // 一旦触发，就不再观察，避免重复触发
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1, // 当元素 10% 可见时触发
          rootMargin: '0px 0px -100px 0px', // 提前 100px 触发
        }
      );

      if (ref.current) {
        // 检查元素是否已经在视口内
        const rect = ref.current.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          // 如果已经在视口内，直接触发动画
          setIsVisible(true);
        } else {
          // 否则开始观察
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
        transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
}

/* ===== Hero 滚动编排（按 scrollY 分段驱动）=====
 * 1) 0–FLY1:        "Hi! I'm Mei" 稳定
 * 2) FLY1–SWAP:     "Mei" 向上飞出 + 淡出
 * 3) SWAP:          文案切换为 "Hi! I'm a Product Designer"
 * 4) SWAP–IN_END:   "Product Designer" 由下方飞入
 * 5) IN_END–HOLD:   整句保持不动（不随滚动渐隐）
 * 6) HOLD–OUT_END:  整块（打字机+标题）像 Mei 一样向上飞出
 * 之后滚动到 "Stuff I built"
 */
const HERO_FLY1 = 120;
const HERO_SWAP = 220;
const HERO_IN_END = 360;
const HERO_HOLD = 560;
const HERO_OUT_END = 760;
const HERO_GIF_FADE = 200; // GIF 从这里开始淡出（早于文字飞出），到 ~360 完全消失

function heroChoreo(sy: number) {
  const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

  // 大标题（单元素：Mei 飞出 → 切词 → Product Designer 飞入 → 保持）
  let bigY = 0;
  let bigO = 1;
  if (sy < HERO_FLY1) {
    bigY = 0;
    bigO = 1;
  } else if (sy < HERO_SWAP) {
    const t = (sy - HERO_FLY1) / (HERO_SWAP - HERO_FLY1);
    bigY = lerp(0, -150, t);
    bigO = lerp(1, 0, t);
  } else if (sy < HERO_IN_END) {
    const t = (sy - HERO_SWAP) / (HERO_IN_END - HERO_SWAP);
    bigY = lerp(150, 0, t);
    bigO = lerp(0, 1, t);
  } else {
    bigY = 0;
    bigO = 1;
  }

  // 整块飞出（保持期之后）
  const outT = (sy - HERO_HOLD) / (HERO_OUT_END - HERO_HOLD);
  const blockY = sy < HERO_HOLD ? 0 : lerp(0, -220, outT);
  const blockO = sy < HERO_HOLD ? 1 : lerp(1, 0, outT);

  // GIF 提前淡出：它在底部、最先与上滚的 Stuff 区重叠，所以比文字更早消失
  const gifO = sy < HERO_GIF_FADE ? 1 : lerp(1, 0, (sy - HERO_GIF_FADE) / 160);

  return { bigY, bigO, blockY, blockO, gifO, scrolled: sy >= HERO_SWAP };
}

export default function Home() {
  const monoStyle = {
    fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
  };

  const initialHeroText = "Hi! I'm";
  const [typedHeroText, setTypedHeroText] = useState('');
  const [heroIntroVisible, setHeroIntroVisible] = useState(false);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [heroScroll, setHeroScroll] = useState(0);
  const [scrollDownVisible, setScrollDownVisible] = useState(false);

  useEffect(() => {
    const timeouts: number[] = [];
    const wordDelay = Math.random() * 50 + 150;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timeouts.push(id);
      });

    let cancelled = false;

    async function runHeroIntro() {
      window.scrollTo(0, 0);
      document.body.classList.add('no-scroll');
      setTypedHeroText('');
      setHeroIntroVisible(false);
      setHeroAnimationComplete(false);
      setScrollDownVisible(false);
      setHeroScroll(0);

      await sleep(250);
      if (cancelled) return;
      window.scrollTo(0, 0);

      for (const char of initialHeroText) {
        if (cancelled) return;
        setTypedHeroText((prev) => prev + char);
        await sleep(100 + (char === ' ' ? wordDelay : 0));
      }

      await sleep(250);
      if (cancelled) return;
      setHeroIntroVisible(true);

      await sleep(700);
      if (cancelled) return;
      document.body.classList.remove('no-scroll');
      setScrollDownVisible(true);
      setHeroAnimationComplete(true);
    }

    runHeroIntro();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
      document.body.classList.remove('no-scroll');
    };
  }, []);

  useEffect(() => {
    if (!heroAnimationComplete) return;

    let scrollFadeTimeout: number | undefined;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setHeroScroll(scrollY);
          // 顶部 "Hi! I'm Mei"；标题切换点（Mei 飞出后）改为 "Hi! I'm a Product Designer"
          setTypedHeroText(scrollY >= HERO_SWAP ? "Hi! I'm a" : initialHeroText);
          ticking = false;
        });
      }

      setScrollDownVisible(false);
      if (scrollFadeTimeout) {
        window.clearTimeout(scrollFadeTimeout);
      }
      scrollFadeTimeout = window.setTimeout(() => {
        if (window.scrollY < 10) {
          setScrollDownVisible(true);
        }
      }, 900);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollFadeTimeout) {
        window.clearTimeout(scrollFadeTimeout);
      }
    };
  }, [heroAnimationComplete]);

  const workSections = [
    {
      id: 'designer-page',
      title: 'Designer',
      subtitle: 'Product strategy, UX systems, and interface craft.',
      projects: [
        {
          title: 'ConnectNova',
          description: 'AI-powered recruiting workflow for ranking LinkedIn candidates quickly, with a Chrome extension and web dashboard.',
          image: '/img/Connectnova.avif',
          href: '/projects/connectnova',
        },
        {
          title: 'Jobnova',
          description: 'AI-native career ecosystem for tailored job discovery and personalized application workflows.',
          image: '/img/Jobnova.avif',
          href: '/projects/jobnova',
        },
        {
          title: 'MemQ',
          description: 'Mobile learning app for capturing knowledge, generating quizzes, and building durable memory.',
          image: '/img/MemQ.avif',
          href: '/projects/memq',
        },
        {
          title: 'Beikemama',
          description: 'Live parenting community for pregnant women and young families, combining expert Q&A and social support.',
          image: '/img/Beikemama.avif',
          href: '/projects/beikemama',
        },
      ],
    },
    {
      id: 'researcher-page',
      title: 'Researcher',
      subtitle: 'Discovery, validation, service mapping, and civic systems.',
      projects: [
        {
          title: 'Walnut Coding',
          description: 'Post-trial parent decision-making in children’s coding education — why parents hesitate after a trial class and the evidence they need before they pay. A sanitized, chart-driven UX research case study.',
          image: '/img/walnut-coding-cover.svg',
          href: '/projects/walnut-coding',
        },
        {
          title: 'Parent Sharing Behavior',
          description: 'Why the highest-value parents share the least in public — an NPS, social-sharing & referral study of 7–12-year-olds, and how to redesign sharing around social comfort. Sanitized & chart-driven.',
          image: '/img/walnut-sharing-cover.svg',
          href: '/projects/walnut-sharing',
        },
        {
          title: 'Milano Partecipa',
          description: 'Civic participation service research for improving daily access, awareness, and community engagement.',
          image: '/img/Milano%20Partecipa.avif',
          href: '/projects/milano-partecipa',
        },
        {
          title: 'Clarity',
          description: 'Digital health product work for menopause symptom tracking, insights, and healthcare communication.',
          image: '/img/Clarity.avif',
          href: '/projects/clarity',
        },
      ],
    },
    {
      id: 'ai-builder-page',
      title: 'AI Builder',
      subtitle: 'Agentic UX, generative UI, and LLM-connected product systems.',
      projects: [
        {
          title: 'Mono',
          description: 'Intent-driven generative UI financial agent that turns natural language into structured interface states.',
          image: '/img/mono_cover.avif',
          href: '/projects/mono',
        },
        {
          title: 'CrackInterview.AI',
          description: 'AI mock interview platform with structured feedback loops for technical candidates.',
          image: '/img/CrackInterview_cover.avif',
          href: '/projects/crackinterview',
        },
      ],
    },
    {
      id: 'creative-coder-page',
      title: 'Creative Coder',
      subtitle: 'Code-based prototypes, systems thinking, and interaction experiments.',
      projects: [
        {
          title: 'Customer Service System',
          description: 'Multi-role chat and support workflows for users, promoters, support teams, and admins.',
          image: '/img/customer-service-system_cover.avif',
          href: '/projects/customer-service-system',
        },
        {
          title: 'This Portfolio',
          description: 'A living interface experiment blending reference-driven motion, interaction, and portfolio storytelling.',
          image: '/meiwave.gif',
          href: '/',
        },
      ],
    },
  ];

  const { bigY, bigO, blockY, blockO, gifO, scrolled } = heroChoreo(heroScroll);

  return (
    <>
    <section
      id="hero"
      className={`mei-copy-hero w-screen ${scrolled ? 'is-scrolled' : ''}`}
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <div
        className="mei-job-role-container"
        style={{
          opacity: blockO,
          pointerEvents: blockO < 0.05 ? 'none' : 'auto',
          transform: `translate(-50%, calc(-50% + ${blockY}px))`,
        }}
      >
        <h2 className="mei-typewriter" style={monoStyle}>
          {typedHeroText}
        </h2>
        <h1
          className="mei-scroll-title"
          style={{
            opacity: heroIntroVisible ? bigO : 0,
            transform: heroIntroVisible ? `translateY(${bigY}px)` : 'translateY(120px)',
            transition: heroAnimationComplete
              ? 'none'
              : 'transform 0.7s cubic-bezier(.2,1.2,.6,1), opacity 0.5s',
          }}
        >
          {scrolled ? 'Product Designer' : 'Mei'}
        </h1>
      </div>

      <aside
        className="mei-bottom-gif"
        aria-hidden="true"
        style={{
          opacity: heroIntroVisible ? gifO : 0,
          pointerEvents: 'none',
          transform: heroIntroVisible ? 'translateY(0)' : 'translateY(100px)',
          transition: heroAnimationComplete
            ? 'opacity 0.15s linear'
            : 'transform 1.2s cubic-bezier(.4,1.25,.6,1), opacity 0.3s',
        }}
      >
        <img src="/meiwave.gif" alt="" />
      </aside>

      <div
        className="mei-scroll-down"
        aria-hidden="true"
        style={{
          opacity: scrollDownVisible ? 1 : 0,
          transition: 'opacity 0.7s',
        }}
      >
        <span className="mei-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14m0 0l-6-6m6 6l6-6"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>S</span><span>c</span><span>r</span><span>o</span><span>l</span><span>l</span>
        <span style={{ marginLeft: '0.5ch' }} />
        <span>D</span><span>o</span><span>w</span><span>n</span>
      </div>

    </section>

    <section
      className="mei-after-hero-spacer w-screen"
      aria-hidden="true"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    />

    {/* Stuff I built —— 横向作品展示，按角色分组 */}
    <section
      id="work"
      className="mei-stuff-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <header className="mei-works-header">
          <h1>Stuff I built</h1>
          <p>Case studies, experiments, and systems — grouped by the roles I play.</p>
        </header>

        <div className="mei-stuff-stack">
          {workSections.map((section) => (
            <div key={section.id} id={section.id} className="mei-stuff-section">
              <div className="mei-stuff-section-head">
                <h2>{section.title}</h2>
                <p>{section.subtitle}</p>
              </div>
              <div className="mei-stuff-row">
                {section.projects.map((project) => (
                  <article className="mei-project-card mei-stuff-card" key={project.title}>
                    <a href={project.href} className="mei-project-card-link">
                      <div className="mei-project-image">
                        <img src={project.image} alt="" />
                      </div>
                      <div className="mei-project-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <span className="mei-project-link">Read case study</span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimatedSection>
    </section>
    </>
  );
}
