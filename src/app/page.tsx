'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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

// ContactCard 组件
function ContactCard({
  iconSrc,
  iconAlt,
  title,
  content,
  onClick,
}: {
  iconSrc: string;
  iconAlt: string;
  title: string;
  content: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const fontStyle = {
    fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'rgb(255, 255, 255)',
        padding: '24px',
        borderRadius: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transitionDelay: isHovered ? '0.3s' : '0s',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 6px 10px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: isHovered ? 'rgb(0, 0, 0)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: isHovered ? '0.1s' : '0s',
        }}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={20}
          height={20}
          style={{ 
            filter: isHovered ? 'brightness(0) invert(1)' : 'brightness(0)',
            transition: 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: isHovered ? '0.1s' : '0s',
          }}
        />
      </div>
      <div className="flex flex-col">
        <h3
          style={{
            ...fontStyle,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 700,
            color: 'rgb(0, 0, 0)',
            marginBottom: '4px',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            ...fontStyle,
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 400,
            color: 'rgb(0, 0, 0)',
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  // 共享的字体样式
  const fontStyle = {
    fontFamily: 'Nunito, system-ui, -apple-system, sans-serif',
  };
  const monoStyle = {
    fontFamily: 'interstate-mono, var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace',
  };

  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const roleRoutes = [
    { label: 'Designer', href: '/works#designer-page' },
    { label: 'Researcher', href: '/about' },
    { label: 'AI Builder', href: '/works#ai-builder-page' },
    { label: 'Creative Coder', href: '/works#creative-coder-page' },
  ];
  const initialHeroText = "Hi! I'm";
  const [typedHeroText, setTypedHeroText] = useState('');
  const [heroIntroVisible, setHeroIntroVisible] = useState(false);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [isHeroScrolled, setIsHeroScrolled] = useState(false);
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [scrollDownVisible, setScrollDownVisible] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [placeholderRole, setPlaceholderRole] = useState<string | null>(null);
  const [draggingRole, setDraggingRole] = useState<string | null>(null);

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
      setTitleOpacity(0);

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
      setTitleOpacity(1);

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

    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrolled = scrollY > 300;
      setIsHeroScrolled(scrolled);
      setTypedHeroText(scrolled ? `${initialHeroText} a` : initialHeroText);

      const nextTitleOpacity = 1 - Math.min(scrollY / 200, 1);
      setTitleOpacity(nextTitleOpacity);

      setScrollDownVisible(false);
      if (scrollFadeTimeout) {
        window.clearTimeout(scrollFadeTimeout);
      }
      scrollFadeTimeout = window.setTimeout(() => {
        if (window.scrollY < 10) {
          setScrollDownVisible(true);
        }
      }, 900);

      if (!scrolled) {
        setActiveRole(null);
        setPlaceholderRole(null);
      }
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

  const jumpToRole = (href: string, label: string) => {
    setActiveRole(label);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        window.location.href = href;
      }, 260);
    }
  };

  const updateHeroArticle = (label: string | null) => {
    if (!label) {
      setTypedHeroText(`${initialHeroText} a`);
      return;
    }
    const article = /^[aeiouAEIOU]/.test(label.charAt(0)) ? ' an' : ' a';
    setTypedHeroText(`${initialHeroText}${article}`);
  };

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

  return (
    <>
    <section 
      id="hero"
      className={`mei-copy-hero w-screen ${isHeroScrolled ? 'is-scrolled' : ''}`}
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <div className="mei-job-role-container">
        <h2 className="mei-typewriter" style={monoStyle}>
          {typedHeroText}
        </h2>
        <div
          className="mei-drop-zone"
          onDragOver={(event) => {
            event.preventDefault();
            updateHeroArticle(placeholderRole);
          }}
          onDrop={(event) => {
            event.preventDefault();
            const label = event.dataTransfer.getData('text/plain');
            const role = roleRoutes.find((item) => item.label === label);
            if (role) {
              setDraggingRole(null);
              setPlaceholderRole(null);
              jumpToRole(role.href, role.label);
            }
          }}
          aria-label="Drop a role to jump into Mei's portfolio"
        >
          <span>{activeRole ?? placeholderRole ?? '[Drop Here]'}</span>
        </div>
      </div>

      <h1
        className="mei-scroll-title"
        style={{
          opacity: heroIntroVisible ? titleOpacity : 0,
          transform: heroIntroVisible ? 'translateY(0)' : 'translateY(200px)',
          transition: heroIntroVisible
            ? 'transform 0.7s cubic-bezier(.2,1.2,.6,1), opacity 0.5s'
            : undefined,
        }}
      >
        MEI
      </h1>

      <aside
        className="mei-bottom-gif"
        aria-hidden="true"
        style={{
          opacity: heroIntroVisible ? 1 : 0,
          transform: heroIntroVisible ? 'translateY(0)' : 'translateY(100px)',
          transition: heroIntroVisible
            ? 'transform 1.2s cubic-bezier(.4,1.25,.6,1), opacity 0.5s'
            : undefined,
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

      <div className="mei-category-select" role="group" aria-label="Drag or choose a portfolio role">
        {roleRoutes.map((role) => (
          <span
            key={role.label}
            id={`role-${role.label.replace(/\s+/g, '-').toLowerCase()}`}
            role="button"
            tabIndex={0}
            draggable
            className="mei-category-item"
            onClick={() => jumpToRole(role.href, role.label)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                jumpToRole(role.href, role.label);
              }
            }}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', role.label);
              setDraggingRole(role.label);
              setPlaceholderRole(role.label);
              updateHeroArticle(role.label);
            }}
            onDragEnd={() => {
              setDraggingRole(null);
              setPlaceholderRole(null);
              if (isHeroScrolled && !activeRole) {
                setTypedHeroText(`${initialHeroText} a`);
              }
            }}
            style={{
              opacity: draggingRole === role.label && !activeRole ? 0 : 1,
            }}
          >
            <span className="mei-bracket" aria-hidden="true">[</span>
            {role.label}
            <span className="mei-bracket" aria-hidden="true">]</span>
          </span>
        ))}
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
    {false && (
    <>
    {/* Works 部分 */}
    <section
      id="work"
      className="mei-works-page w-screen"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <ScrollAnimatedSection>
        <header className="mei-works-header">
          <h1>Works</h1>
          <p>Case studies, experiments, and systems grouped by the roles you can drag in the opening scene.</p>
        </header>

        <div className="mei-work-details-stack">
          {workSections.map((section, index) => (
            <details key={section.id} id={section.id} className="mei-work-details" open={index === 0}>
              <summary className="mei-work-summary">
                <span>{section.title}</span>
                <small>{section.subtitle}</small>
              </summary>
              <div className="mei-work-section-content">
                <ul className="mei-project-list">
                  {section.projects.map((project) => (
                    <li className="mei-project-card" key={project.title}>
                      <a href={project.href} className="mei-project-card-link">
                        <div className="mei-project-image">
                          <img src={project.image} alt="" />
                        </div>
                        <div className="mei-project-info">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                          <span className="mei-project-link">Read More</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </ScrollAnimatedSection>
    </section>

    {/* About 部分 */}
    <section
      id="about"
      className="w-screen"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingTop: isMobile ? '80px' : '240px',
        paddingBottom: isMobile ? '80px' : '240px',
      }}
    >
      <ScrollAnimatedSection>
        <div
        className="flex flex-col w-full"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: isMobile ? '0 24px' : '0',
        }}
      >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '28px',
            lineHeight: '36px',
            fontWeight: 500,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '80px',
          }}
        >
          About
        </h2>

        {/* 副标题和正文段落整体 */}
        <div style={{ marginBottom: '80px' }}>
          {/* 副标题 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '22px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '24px',
            }}
          >
            Human-First, Logic-Driven
          </p>

          {/* 正文段落 */}
          <div className="flex flex-col gap-6">
            <p
              style={{
                ...fontStyle,
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
              }}
            >
              I am a UX Designer focused on transforming complex logic into intuitive human experiences. My philosophy centers on user agency: I believe even the most sophisticated systems should feel like a natural extension of the user’s intent. By applying First-Principles Thinking, I deconstruct intricate environments into clear, navigable structures that prioritize cognitive ease and logical rigor.
            </p>
            <p
              style={{
                ...fontStyle,
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
              }}
            >
              To ensure impact, I anchor my process in rigorous user research and functional validation. I treat design not as a visual layer, but as a system that must be refined through real-world feedback. By integrating a human-centered focus with rapid prototyping, I translate deep user insights into high-fidelity experiences that meet the highest standards of usability.
            </p>
          </div>
        </div>

        {/* 四列内容 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Strategy & Research */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Strategy &amp; Research
            </h3>
            <div className="flex flex-col gap-1">
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
                User Research
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Data Analysis
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Usability Testing
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Information Architecture
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Content Design
              </p>
            </div>
          </div>

          {/* UX/UI Design */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              UX/UI Design
            </h3>
            <div className="flex flex-col gap-1">
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Interaction Design
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Design Systems
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Wireframing
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Prototyping
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Accessibility (WCAG)
              </p>
            </div>
          </div>

          {/* Tech & Specialized */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Tech &amp; Specialized
            </h3>
            <div className="flex flex-col gap-1">
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Agentic Design
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Conversational UX
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                AR/VR
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Rapid Prototyping (Vibe Coding, MCP)
              </p>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '24px',
                fontWeight: 700,
                color: 'rgb(0, 0, 0)',
                marginBottom: '12px',
              }}
            >
              Tools
            </h3>
            <div className="flex flex-col gap-1">
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Figma
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Protopie
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Adobe Creative Suite
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Dify &amp; Coze
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                ComfyU
              </p>
            </div>
          </div>
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Get in Touch 部分 */}
    <section
      id="contact"
      className="w-screen"
      style={{
        backgroundColor: '#FAFAFA',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingTop: isMobile ? '80px' : '240px',
        paddingBottom: isMobile ? '80px' : '240px',
      }}
    >
      <ScrollAnimatedSection>
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: isMobile ? '0 24px' : '0',
          }}
        >
        {/* 标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '28px',
            lineHeight: '36px',
            fontWeight: 500,
            color: 'oklch(0.556 0 0)', // 灰色
            marginBottom: '80px',
          }}
        >
          Get in Touch
        </h2>

        {/* 副标题和正文段落整体 */}
        <div style={{ marginBottom: '80px' }}>
          {/* 副标题 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '22px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '24px',
            }}
          >
            Let’s turn complex challenges into seamless solutions.
          </p>

          {/* 正文段落 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '20px',
              lineHeight: '28px',
              fontWeight: 400,
              color: 'rgb(0, 0, 0)',
            }}
          >
            I am always interested in collaborating on projects that demand rigorous user research and technical precision. From conducting deep usability testing to implementing responsive, code-based interfaces, I’m ready to help bring your product vision to life with a human-first approach.
          </p>
        </div>

        {/* 三个卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard
            iconSrc="/Mail.svg"
            iconAlt="Email"
            title="Email"
            content="Send a message"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = 'mailto:flyskytoo@outlook.com';
              }
            }}
          />
          <ContactCard
            iconSrc="/LinkedIN.svg"
            iconAlt="LinkedIn"
            title="LinkedIn"
            content="Contact"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open('https://www.linkedin.com/in/meichai/', '_blank', 'noopener,noreferrer');
              }
            }}
          />
          <ContactCard
            iconSrc="/Github.svg"
            iconAlt="GitHub"
            title="GitHub"
            content="Check my Profile"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open('https://github.com/fancytree', '_blank', 'noopener,noreferrer');
              }
            }}
          />
        </div>
      </div>
      </ScrollAnimatedSection>
    </section>

    {/* Let's work together + 版权信息 已移至 Layout 的 Footer 组件，全站统一显示 */}
    </>
    )}
    </>
  );
}
