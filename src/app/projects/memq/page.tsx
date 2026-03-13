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

export default function MemQProjectPage() {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // 展开/折叠状态
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesignProblemExpanded, setIsDesignProblemExpanded] = useState(false);
  
  // Dig Deeper 卡片 hover 状态
  const [isPersonasHovered, setIsPersonasHovered] = useState(false);
  const [isAffinityMapHovered, setIsAffinityMapHovered] = useState(false);
  const [isUserFlowsHovered, setIsUserFlowsHovered] = useState(false);
  
  // Personas 弹窗状态
  const [isPersonasModalOpen, setIsPersonasModalOpen] = useState(false);
  
  // Affinity Map 弹窗状态
  const [isAffinityMapModalOpen, setIsAffinityMapModalOpen] = useState(false);
  
  // User Flows 弹窗状态
  const [isUserFlowsModalOpen, setIsUserFlowsModalOpen] = useState(false);

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
                  Solo Full-Stack Developer & Designer · 8-week end-to-end development
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
                    4 informal user interviews · 12 TestFlight feedback points · 2 major usability improvements
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
                    Smart Study Companion App · Mobile Learning · Self-funded project · Designed and built from scratch · Self-funded, Bootstrapped
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
                  MemQ: Smart Quiz & Memory APP
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
                  A streamlined mobile learning experience designed for lifelong learners to capture knowledge and master subjects through custom flashcards and quizzes.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* The Design Problem Section */}
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

            {/* 上面一行：主要信息 + 展开按钮 */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsDesignProblemExpanded(!isDesignProblemExpanded)}
              style={{
                paddingBottom: '0',
                gap: '4px',
                transition: 'padding-bottom 0.4s ease-out',
                height: 'fit-content',
                marginBottom: '16px',
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
                Reserch context at a glance
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
                  transform: isDesignProblemExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
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
                maxHeight: isDesignProblemExpanded ? '2000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                paddingTop: isDesignProblemExpanded ? '12px' : '0',
                maxWidth: '780px',
              }}
            >
              <div className="flex flex-col" style={{ gap: '24px' }}>
                {/* Participants & Rounds */}
                <div>
                  <h3
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '28px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '12px',
                    }}
                  >
                    Participants & Rounds
                  </h3>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Foundational phase:</strong> 8 in-depth interviews and 24 survey responses exploring learning habits, study pain points, and expectations for AI-powered educational tools.
                  </p>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Usability testing Round 1:</strong> 6 moderated sessions on the mobile prototype, focusing on core workflows: course creation, PDF import, AI chat interactions, and flashcard learning experience.
                  </p>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    <strong>Usability testing Round 2:</strong> 5 additional sessions, including 3 returning participants to observe how familiarity with AI features changed their learning behavior and tool adoption patterns.
                  </p>
                </div>

                {/* Recruitment & Personas */}
                <div>
                  <h3
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '28px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '12px',
                    }}
                  >
                    Recruitment & Personas
                  </h3>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    I recruited participants to match my core personas: <strong>university students</strong> preparing for exams, <strong>language learners</strong> building vocabulary, <strong>working professionals</strong> learning new skills, and <strong>lifelong learners</strong> seeking efficient study methods. Several participants had experience with traditional flashcard apps (Anki, Quizlet) and AI tools (ChatGPT, Claude), which helped identify gaps in existing solutions and opportunities for MemQ's unique value proposition.
                  </p>
                </div>

                {/* Competitive Analysis */}
                <div>
                  <h3
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '28px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '12px',
                    }}
                  >
                    Competitive Analysis
                  </h3>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    To ground the concept, I ran a competitive review of existing learning and flashcard applications, looking at content creation workflows, AI integration patterns, PDF processing capabilities, and spaced repetition implementations. This helped identify key gaps: fragmented workflows across multiple tools, significant manual content creation overhead, limited AI integration in flashcard apps, and poor PDF-to-study-material conversion experiences.
                  </p>
                </div>

                {/* Scheduling & Constraints */}
                <div>
                  <h3
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '28px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '12px',
                    }}
                  >
                    Scheduling & Constraints
                  </h3>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'oklch(0.556 0 0)',
                    }}
                  >
                    This was an independent, self-funded project with no formal budget. To respect participants' academic schedules, work commitments, and time zones, I scheduled sessions flexibly—accommodating early morning sessions for professionals, evening sessions for students, and weekend slots for those with busy weekday schedules. Several sessions were conducted remotely via video calls to maximize accessibility and participant comfort.
                  </p>
                </div>
              </div>
            </div>
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
                Most learners only have fragmented 5–10 minute windows to study, so the interaction needs to feel immediate and frictionless. My research revealed that <strong>card creation is the make-or-break moment where a habit is either formed or abandoned</strong>—especially when users are commuting, typing on a mobile keyboard, or trying to capture a thought before it fades.
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
                {/* Card 1: Irrelevant Content */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon */}
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.7)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
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
                    Irrelevant Content
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
                    Pre-made decks force users to waste time on concepts they already know, rather than their specific knowledge gaps.
                  </p>
                </div>

                {/* Card 2: Creation Friction */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon */}
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.7)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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
                    Creation Friction
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
                    The complexity of manual entry turns capturing a quick thought into a chore, often leading to abandonment.
                  </p>
                </div>

                {/* Card 3: Static Scheduling */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon */}
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.7)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
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
                    Static Scheduling
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
                    Without smart prioritization, critical and urgent concepts get lost in a sea of easy, linear tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* What I Designed Section */}
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
              What I Designed
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
                I designed MemQ to support every learner's pace: <strong>the crammers, the casual reviewers, and the creators</strong>. The app keeps users focused on <strong>retention</strong> while giving them <strong>complete control</strong> over how they <strong>capture fleeting ideas</strong> and <strong>structure their personal knowledge base</strong>.
              </p>
            </div>

            {/* AI-Capture System */}
            <div style={{ width: '100%', maxWidth: '1280px', marginTop: '48px' }}>
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
                I designed an AI-Capture System that eliminates data entry chores
              </h3>
              
              {/* Left-Right Layout: Text Content and Video */}
              <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start' }}>
                {/* Left Column: Text Content */}
                <div style={{ flex: 1 }}>
                  <p style={{ marginBottom: '24px', ...fontStyle, fontSize: '18px', lineHeight: '32px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                    My research showed that the biggest barrier to habit formation was the time spent manually creating cards. Users often spent more energy formatting text than actually learning. I solved this by building a multi-modal AI engine: users can simply upload a lecture PDF, type a topic, or chat with the assistant, and MemQ automatically extracts key concepts.
                  </p>
                  <p style={{ marginBottom: '24px', ...fontStyle, fontSize: '18px', lineHeight: '32px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                    Usability tests revealed that context matters. A vocabulary word needs a definition and example sentence, while a complex concept needs a "Why" or "How" question. So, I engineered the backend to detect the content type (Knowledge Point vs. Vocabulary) and generate the most effective question format for that specific item.
                  </p>

                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '20px',
                      lineHeight: '28px',
                      fontWeight: 500,
                      color: 'rgb(0, 0, 0)',
                      marginTop: '32px',
                      marginBottom: '16px',
                    }}
                  >
                    Key creation features:
                  </h4>
                  <ul
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '32px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                      paddingLeft: '24px',
                      marginBottom: '24px',
                      listStyleType: 'disc',
                    }}
                  >
                    <li style={{ marginBottom: '12px' }}>
                      <strong>Multi-modal Input</strong> to accommodate any source material (Manual, PDF Upload, Topic Generation).
                    </li>
                    <li style={{ marginBottom: '12px' }}>
                      <strong>Context-aware Extraction</strong> to automatically turn chat conversations into saved flashcards.
                    </li>
                    <li style={{ marginBottom: '12px' }}>
                      <strong>Adaptive Question Generator</strong> that formats quizzes differently for vocabulary (definitions) vs. concepts (conceptual understanding).
                    </li>
                  </ul>
                </div>

                {/* Right Column: Phone Video */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      aspectRatio: '9/19.5',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#000000',
                    }}
                  >
                    <video
                      src="/img/MemQ Video.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Design Responses */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '32px',
                marginTop: '64px',
                maxWidth: '1280px',
              }}
            >
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
                Design Responses
              </h3>
              <div className="flex flex-row" style={{ gap: '24px' }}>
                {/* Card 1: Creation friction */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>⚡️</span>
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
                      Creation friction
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
                    Multi-modal AI input (PDF, Chat) + auto-formatting
                  </p>
                </div>

                {/* Card 2: Irrelevant content */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🧠</span>
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
                      Irrelevant content
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
                    Context-aware generation tailored to specific knowledge gaps
                  </p>
                </div>

                {/* Card 3: Static scheduling */}
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📉</span>
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
                      Static scheduling
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
                    Dynamic Spaced Repetition algorithm + Smart priority queue
                  </p>
                </div>
              </div>
            </div>

            {/* AI assistant */}
            <div
              style={{
                marginTop: '64px',
                maxWidth: '1280px',
                backgroundColor: '#191919',
                borderRadius: '12px',
                padding: '32px',
              }}
            >
              <div className="flex flex-row" style={{ gap: '48px', alignItems: 'center' }}>
                {/* Left Column: Text Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgb(255, 255, 255)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3
                      style={{
                        ...fontStyle,
                        fontSize: '24px',
                        lineHeight: '32px',
                        fontWeight: 600,
                        color: 'rgb(255, 255, 255)',
                        margin: 0,
                      }}
                    >
                      Context-Aware Engine that structures knowledge
                    </h3>
                  </div>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '18px',
                      lineHeight: '32px',
                      fontWeight: 400,
                      color: 'rgb(255, 255, 255)',
                      marginBottom: '16px',
                    }}
                  >
                    The AI engine intelligently detects the content type—distinguishing between vocabulary and complex concepts—to generate the most effective question formats. It transforms passive reading materials into interactive quizzes without the user needing to write a single prompt.
                  </p>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                    }}
                  >
                    Used for: Concept extraction, smart formatting, instant definitions
                  </p>
                </div>

                {/* Right Column: Phone Screenshot */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      aspectRatio: '9/19.5',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: '#000000',
                    }}
                  >
                    <Image
                      src="/img/AI chat.PNG"
                      alt="AI chat interface"
                      width={320}
                      height={692}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Impact Section */}
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
              Impact
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
                Usability testing revealed that the new <strong>"One-Tap Capture"</strong> flow significantly reduced the barrier to entry. Where users previously abandoned manual entry after 30 seconds, the AI-assisted design enabled them to complete the loop in under 5 seconds.
              </p>
              <p style={{ marginBottom: '24px' }}>
                Testers praised the <strong>"invisible interface"</strong> strategy—where complex tasks like tagging and syncing happened in the background—allowing them to focus entirely on learning. This shift in UX directly contributed to higher retention rates and validated the transition to a premium subscription model.
              </p>
            </div>

            {/* What improved between rounds */}
            <div style={{ marginTop: '64px', width: '100%' }}>
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
                  What improved between rounds
                </h3>
                <div className="flex flex-row" style={{ gap: '24px', width: '100%' }}>
                  {/* Card 1: Critical issues */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    {/* Icon */}
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
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
                      Critical issues
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
                      Round 1 surfaced high abandonment rates during manual entry. The AI-assisted update resolved this friction point completely and had 0 critical drop-offs in the final validation.
                    </p>
                  </div>

                  {/* Card 2: Flow & confidence */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    {/* Icon */}
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
                      Flow & confidence
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
                      Participants described the AI capture flow as 'magic, efficient, and intuitive' and said they felt 100% confident that the app correctly understood their study materials.
                    </p>
                  </div>

                  {/* Card 3: Engagement shift */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    {/* Icon */}
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
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
                      Engagement shift
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
                      Instead of complaining about typing fatigue, round two feedback shifted to requests for more file formats, showing users had moved past the friction of starting to active daily use.
                    </p>
                  </div>
                </div>
            </div>

            {/* Data-Informed Design Decisions */}
            <div style={{ marginTop: '64px', width: '100%' }}>
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
                Data-Informed Design Decisions
              </h3>
              <div className="flex flex-row" style={{ gap: '24px', width: '100%' }}>
                {/* Card 1: Preferred method of card creation */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '48px',
                    flex: 1,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '20px',
                      lineHeight: '28px',
                      fontWeight: 600,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '24px',
                    }}
                  >
                    Preferred method of card creation
                  </h4>
                  <div style={{ marginBottom: '24px' }}>
                    {/* Data Bar 1 */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          AI / Auto-generation (From PDF or Chat)
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          78%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '78%',
                            height: '100%',
                            backgroundColor: 'rgb(0, 0, 0)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Data Bar 2 */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          Manual Typing
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          15%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '15%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Data Bar 3 */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          Copy & Pasting
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          7%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '7%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
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
                    Aligning with this, I prioritized AI generation as the primary action, relegating manual entry to a secondary option to minimize friction.
                  </p>
                </div>

                {/* Card 2: Importance of personalized study content */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '48px',
                    flex: 1,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      ...fontStyle,
                      fontSize: '20px',
                      lineHeight: '28px',
                      fontWeight: 600,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '24px',
                    }}
                  >
                    Importance of personalized study content
                  </h4>
                  <div style={{ marginBottom: '24px' }}>
                    {/* Data Bar 1 */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          Custom content (My own notes/exams)
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          85%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '85%',
                            height: '100%',
                            backgroundColor: 'rgb(0, 0, 0)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Data Bar 2 */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          Generic decks (Pre-made lists)
                        </span>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: 'rgb(0, 0, 0)',
                          }}
                        >
                          15%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '15%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
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
                    This drove the decision to build a context-aware engine instead of a marketplace, ensuring quizzes are generated directly from the user's own materials.
                  </p>
                </div>
              </div>

              {/* Comment */}
              <div
                style={{
                  backgroundColor: '#F7F7F7',
                  borderRadius: '12px',
                  padding: '32px',
                  marginTop: '48px',
                  maxWidth: '1280px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '18px',
                    lineHeight: '28px',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#333333',
                    margin: 0,
                    marginBottom: '16px',
                  }}
                >
                  "This is the most seamless study experience I've seen. I would feel 100% confident ditching my old messy notes for this."
                </p>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    color: '#333333',
                    margin: 0,
                  }}
                >
                  — Round 2 usability testing participant
                </p>
              </div>

              {/* Future Improvements */}
              <div style={{ marginTop: '64px', width: '100%' }}>
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
                  Future Improvements
                </h3>
                <div className="flex flex-row" style={{ gap: '24px', width: '100%' }}>
                  {/* Card 1: Smarter multi-modal capture */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    {/* Icon */}
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
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
                      Smarter multi-modal capture
                    </h4>
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
                      Use desktop browser extensions for PDFs and fast capture. Future integrations with major LLMs, Notion, and camera-based capture will let learners save key concepts from chats, notes, and real-world materials in a single step.
                    </p>
                  </div>

                  {/* Card 2: Deeper progress insights */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    {/* Icon */}
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M22 12h-4"></path>
                        <path d="M6 12H2"></path>
                        <path d="M12 2v4"></path>
                        <path d="M12 18v4"></path>
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
                      Richer multi-modal recall
                    </h4>
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
                      Add richer multimedia support—starting with images captured from the camera—to reinforce memory at both the term and question level, tying abstract concepts to concrete visual cues.
                    </p>
                  </div>

                  {/* Card 3: Community-sourced patterns */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
                    {/* Icon */}
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
                      Community-sourced patterns
                    </h4>
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
                      Explore class-style cohorts where learners can keep each other accountable while selectively sharing materials and deck patterns that others can remix.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Dig Deeper Section */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '80px',
          paddingBottom: '120px',
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
              Dig Deeper
            </h2>
            <div className="flex flex-row" style={{ gap: '24px', width: '100%' }}>
              {/* Card 1: Personas */}
              <div
                onClick={() => setIsPersonasModalOpen(true)}
                onMouseEnter={() => setIsPersonasHovered(true)}
                onMouseLeave={() => setIsPersonasHovered(false)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '48px',
                  flex: 1,
                  boxShadow: isPersonasHovered ? '0 6px 10px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  transition: 'box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: isPersonasHovered ? '0.3s' : '0s',
                  cursor: 'pointer',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: isPersonasHovered ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: isPersonasHovered ? '0.1s' : '0s',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isPersonasHovered ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ 
                      transition: 'stroke 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: isPersonasHovered ? '0.1s' : '0s',
                    }}
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                {/* Dropdown Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {/* Content */}
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 600,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '8px',
                  }}
                >
                  Personas
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.7)',
                    marginBottom: '12px',
                  }}
                >
                  Meet Alex and Taylor
                </p>
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
                  Used to capture different learning motivations: Urgent Exam Cramming , and Casual Learning.
                </p>
              </div>

              {/* Card 2: Affinity Map */}
              <div
                onClick={() => setIsAffinityMapModalOpen(true)}
                onMouseEnter={() => setIsAffinityMapHovered(true)}
                onMouseLeave={() => setIsAffinityMapHovered(false)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '48px',
                  flex: 1,
                  boxShadow: isAffinityMapHovered ? '0 6px 10px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  transition: 'box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: isAffinityMapHovered ? '0.3s' : '0s',
                  cursor: 'pointer',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: isAffinityMapHovered ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: isAffinityMapHovered ? '0.1s' : '0s',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isAffinityMapHovered ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ 
                      transition: 'stroke 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: isAffinityMapHovered ? '0.1s' : '0s',
                    }}
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                {/* Dropdown Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {/* Content */}
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 600,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '8px',
                  }}
                >
                  Affinity Map
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.7)',
                    marginBottom: '12px',
                  }}
                >
                  Synthesizing research insights
                </p>
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
                  How I clustered interview data into three core friction themes: Manual Entry Fatigue, Content Relevance, and Scheduling Guilt.
                </p>
              </div>

              {/* Card 3: User Flows */}
              <div
                onClick={() => setIsUserFlowsModalOpen(true)}
                onMouseEnter={() => setIsUserFlowsHovered(true)}
                onMouseLeave={() => setIsUserFlowsHovered(false)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '48px',
                  flex: 1,
                  boxShadow: isUserFlowsHovered ? '0 6px 10px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  transition: 'box-shadow 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: isUserFlowsHovered ? '0.3s' : '0s',
                  cursor: 'pointer',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: isUserFlowsHovered ? '#000000' : 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: isUserFlowsHovered ? '0.1s' : '0s',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isUserFlowsHovered ? '#FFFFFF' : 'rgba(0, 0, 0, 0.7)'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ 
                      transition: 'stroke 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDelay: isUserFlowsHovered ? '0.1s' : '0s',
                    }}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                    <polyline points="15 18 21 12 15 6"></polyline>
                  </svg>
                </div>
                {/* Dropdown Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {/* Content */}
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 600,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '8px',
                  }}
                >
                  User Flows
                </h3>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.7)',
                    marginBottom: '12px',
                  }}
                >
                  Complete user journey flows
                </p>
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
                  Visualizing the complete user journey across capture, learning, and study workflows.
                </p>
              </div>
            </div>

            {/* View live prototype button */}
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-start' }}>
              <a
                href="https://www.figma.com/make/GA35kSGfjySKnWeIVkeEO9/Create-Interactive-Prototype?fullscreen=1&t=A11iQhjNy1J7lofo-1"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button>
                  View live prototype
                </Button>
              </a>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Personas Modal */}
      {isPersonasModalOpen && (
        <div
          onClick={() => setIsPersonasModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              padding: '48px',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPersonasModalOpen(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(0, 0, 0, 0.7)',
                ...fontStyle,
                fontSize: '24px',
                lineHeight: '1',
              }}
            >
              ×
            </button>

            {/* Header Section */}
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '32px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '8px',
                }}
              >
                Personas: Two Types of Learners
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Two user personas representing distinct study motivations and behaviors.
              </p>
            </div>

            {/* Introductory Paragraph */}
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '28px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
                marginBottom: '48px',
              }}
            >
              I created two personas from interview data to represent opposite ends of the spectrum. These helped me design for high-pressure students (Alex) and habit-building casual learners.
            </p>

            {/* Persona Cards Section */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '48px',
              }}
            >
              {/* Card 1: ALEX */}
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 700,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  ALEX – THE CRAMMER
                </h3>
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
                  Needs to convert lecture slides into quizzes instantly to survive exam week.
                </p>
              </div>

              {/* Card 2: TAYLOR */}
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 700,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  TAYLOR – THE CASUAL LEARNER
                </h3>
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
                  Captures interesting facts or vocabulary to maintain a stress-free daily habit.
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div>
              <a
                href="https://drive.google.com/file/d/1XBUN7cAseyk1iJQyoZXrZUV3AOGMRhZg/view"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...fontStyle,
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                View detailed persona slides
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Affinity Map Modal */}
      {isAffinityMapModalOpen && (
        <div
          onClick={() => setIsAffinityMapModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              padding: '48px',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsAffinityMapModalOpen(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(0, 0, 0, 0.7)',
                ...fontStyle,
                fontSize: '24px',
                lineHeight: '1',
              }}
            >
              ×
            </button>

            {/* Header Section */}
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '32px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '8px',
                }}
              >
                Affinity Mapping Process
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                How interview data was synthesized into key pain point themes.
              </p>
            </div>

            {/* Introductory Paragraph */}
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '28px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
                marginBottom: '32px',
              }}
            >
              I synthesized findings from 5 in-depth interviews and survey responses into clusters that revealed three critical friction themes: manual entry fatigue, irrelevant content, and scheduling anxiety.
            </p>

            {/* Affinity Map Image */}
            <div
              style={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '32px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <Image
                src="/img/Affinity Mapping.png"
                alt="Affinity Mapping"
                width={1200}
                height={800}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>

            {/* Button & Caption Section */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '12px', display: 'inline-block' }}>
                <a
                  href="https://www.figma.com/board/Cm7Zt4jv6S7JqqTTOhMhV0/Affinity-Mapping?node-id=0-1&t=iesZYr1Kf9kG9zK9-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    View interactive research board
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </Button>
                </a>
              </div>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.7)',
                  margin: 0,
                }}
              >
                Explore the full-resolution board and zoom in to read individual research insights and sticky notes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Flows Modal */}
      {isUserFlowsModalOpen && (
        <div
          onClick={() => setIsUserFlowsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '100%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              padding: '48px',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsUserFlowsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(0, 0, 0, 0.7)',
                ...fontStyle,
                fontSize: '24px',
                lineHeight: '1',
              }}
            >
              ×
            </button>

            {/* Header Section */}
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  ...fontStyle,
                  fontSize: '32px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '8px',
                }}
              >
                User Flows
              </h2>
              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '28px',
                  fontWeight: 400,
                  color: 'rgb(0, 0, 0)',
                }}
              >
                Visualizing the complete user journey across capture, learning, and study workflows. These flows map how users interact with AI chat, create lessons, add terms, and engage with the spaced repetition system.
              </p>
            </div>

            {/* Workflow Images */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
              }}
            >
              {/* Overall Application Architecture Flow - Keep Image */}
              <div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 600,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '16px',
                  }}
                >
                  Overall Application Architecture Flow
                </h3>
                <div
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Image
                    src="/img/Overall Application Architecture Flow.png"
                    alt="Overall Application Architecture Flow"
                    width={1200}
                    height={800}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

              {/* Other Workflows - Combined Link */}
              <div>
                <h3
                  style={{
                    ...fontStyle,
                    fontSize: '20px',
                    lineHeight: '28px',
                    fontWeight: 600,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '16px',
                  }}
                >
                  Additional Workflows
                </h3>
                <div
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '16px',
                  }}
                >
                  <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '8px' }}>AI Chat Assistant Flow</li>
                    <li style={{ marginBottom: '8px' }}>Create Lesson and Add Terms Flow</li>
                    <li style={{ marginBottom: '8px' }}>Study Flow (SRS Spaced Repetition System)</li>
                  </ul>
                </div>
                <a
                  href="https://drive.google.com/file/d/1S33Sj4i9PaZNNPBYsbZN-24vQwiYqiSb/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...fontStyle,
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    color: 'rgb(0, 0, 0)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  View all workflows
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
