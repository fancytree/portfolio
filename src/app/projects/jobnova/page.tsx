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

// Jobnova 项目详情页（由 MemQ 模板复制，可替换为实际项目内容）
export default function JobnovaProjectPage() {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // 展开/折叠状态
  const [isExpanded, setIsExpanded] = useState(false);

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
                  Founding Product Designer · AI Startup · 2025 – Present (Ongoing)
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
                    Foundational discovery & interviews · Competitive benchmarking · Iterative usability testing
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
                    End-to-end Responsive Web Platform · Mobile-first conversion landing page · Live 0-to-1 product
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
                  Jobnova
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
                  An AI-native career ecosystem designed for modern job seekers to instantly discover tailored opportunities and automate the end-to-end application process with hyper-personalized resumes.
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
                Job searching is a <strong>high-stakes, emotionally taxing journey</strong>, yet the current process often feels like a repetitive numbers game. My research showed that the <strong>&quot;initial 24 hours&quot;</strong> of a job posting is the <strong>pivotal moment where a candidate&#39;s success is truly decided</strong>—yet this is exactly when they feel most overwhelmed by <strong>manual filtering, invisible ATS barriers, and the pressure to customize resumes without losing their professional identity</strong>.
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
                {/* Card 1: Search Fatigue & Information Overload */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon: 放大镜 / 搜索 */}
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
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
                    Search Fatigue &amp; Information Overload
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
                    Users are forced to manually sift through hundreds of irrelevant listings. This high cognitive load leads to &quot;application fatigue,&quot; where the quality of effort declines as the volume of searching increases.
                  </p>
                </div>

                {/* Card 2: The ATS "Black Hole" */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon: 漏斗 / 筛选 */}
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
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
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
                    The ATS &quot;Black Hole&quot;
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
                    Most resumes are instantly discarded by ATS (Applicant Tracking Systems) before a human ever sees them. Candidates lack the tools to understand why they were rejected or how to optimize their profiles for AI-driven screening.
                  </p>
                </div>

                {/* Card 3: The Timing Disadvantage */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    flex: 1,
                  }}
                >
                  {/* Icon: 时钟 */}
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
                      <polyline points="12 6 12 12 16 14"></polyline>
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
                    The Timing Disadvantage
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
                    The &quot;Golden Hour&quot; for job applications is real—applying within the first few hours of a posting significantly increases response rates. However, users cannot be online 24/7, causing them to constantly miss out on high-intent opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Design System Module */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <h3
            style={{
              ...fontStyle,
              fontSize: '28px',
              lineHeight: '36px',
              fontWeight: 300,
              color: 'rgb(0, 0, 0)',
              margin: 0,
              marginBottom: '16px',
            }}
          >
            Design System
          </h3>

          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/img/Design%20system.avif"
              alt="Design system"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
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
                I designed JobNova to support every type of modern job seeker: <strong>the watchers, the optimizers, and the sprinters</strong>. The ecosystem automates the <strong>high-friction stages of the job search—manual filtering and resume tailoring</strong>—while still giving candidates <strong>absolute control</strong> over their <strong>professional narrative and how they connect with opportunities</strong>.
              </p>
            </div>
          </div>
        </ScrollAnimatedSection>

        {/* Instant Job Notification system - 不使用 ScrollAnimatedSection 以支持 sticky */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            marginTop: '100px',
          }}
        >
          <h3
            style={{
              ...fontStyle,
              fontSize: '24px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '8px',
            }}
          >
            Instant Job Notification System
          </h3>
          <p
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              marginBottom: '24px',
            }}
          >
            The Competitive Edge of Proactive Discovery
          </p>
          
          {/* Left-Right Layout: 使用 Grid 布局支持 sticky */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Left Column: Text Content */}
            <div>
              <p style={{ marginBottom: '24px', ...fontStyle, fontSize: '18px', lineHeight: '32px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                I designed the Instant Job Notification system to reduce <strong>&quot;search fatigue&quot;</strong> and the <strong>&quot;timing disadvantage.&quot;</strong> A <strong>proactive agent</strong> now watches the market for users and surfaces new roles the moment they appear.
              </p>

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
                <li style={{ marginBottom: '16px' }}>
                  <strong>Automated Experience Analysis:</strong> AI reads each resume to highlight roles that truly match skills and experience.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Seizing the &quot;Golden Hour&quot;:</strong> Timely alerts focus attention on the freshest, most responsive postings.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Predictive Match-Scoring:</strong> Clear match percentages help users quickly prioritize high-probability roles.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Hyper-Personalized Filtering:</strong> Filters align alerts with work model, visa needs, and experience level.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Email Alerts:</strong> When new matching jobs appear, users receive email notifications based on their settings (e.g., frequency and match threshold).
                </li>
              </ul>
            </div>

            {/* Right Column: 视频滚动时固定 */}
            <div>
              <div
                style={{
                  position: 'sticky',
                  top: '96px',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#000000',
                }}
              >
                <video
                  src="/img/Instant Job Notification.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Resume Customizer - 不使用 ScrollAnimatedSection 以支持 sticky */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            marginTop: '80px',
          }}
        >
          <h3
            style={{
              ...fontStyle,
              fontSize: '24px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '8px',
            }}
          >
            AI Resume Customizer
          </h3>
          <p
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              marginBottom: '24px',
            }}
          >
            Bridging the Gap Between Candidate and ATS
          </p>
          
          {/* Left-Right Layout: 使用 Grid 布局支持 sticky */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Left Column: Text Content */}
            <div>
              <p style={{ marginBottom: '24px', ...fontStyle, fontSize: '18px', lineHeight: '32px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                I designed the AI Resume Customizer to make <strong>resume tailoring</strong> fast and confidence-building. Embedded in the job view, it helps users <strong>optimize their professional narrative</strong> for each role in seconds.
              </p>

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
                <li style={{ marginBottom: '16px' }}>
                  <strong>Context-Aware Integration:</strong> Resume actions sit next to AI &quot;Fit &amp; Insights&quot;, so users can adjust content the moment gaps appear.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Quantifiable Progress &amp; Feedback:</strong> A clear progress bar and updated Match Score show exactly how much the resume improved.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Explainable AI:</strong> A concise &quot;See what changed&quot; list calls out key edits instead of every tiny tweak.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Human-in-the-loop Editing:</strong> The Overview and Editor tabs keep AI as a co-pilot while users stay in control of final wording.
                </li>
              </ul>
            </div>

            {/* Right Column: 视频滚动时固定 */}
            <div>
              <div
                style={{
                  position: 'sticky',
                  top: '96px',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#000000',
                }}
              >
                <video
                  src="/img/Resume.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Auto Apply - 不使用 ScrollAnimatedSection 以支持 sticky */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            marginTop: '80px',
          }}
        >
          <h3
            style={{
              ...fontStyle,
              fontSize: '24px',
              lineHeight: '32px',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              marginBottom: '8px',
            }}
          >
            AI Auto Apply
          </h3>
          <p
            style={{
              ...fontStyle,
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              marginBottom: '24px',
            }}
          >
            Effortless Scale through Intelligent Autonomy
          </p>
          
          {/* Left-Right Layout: 使用 Grid 布局支持 sticky */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Left Column: Text Content */}
            <div>
              <p style={{ marginBottom: '24px', ...fontStyle, fontSize: '18px', lineHeight: '32px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                I designed the AI Auto Apply system to remove <strong>repetitive manual labor</strong> so users can apply to <strong>thousands of roles automatically</strong> while keeping <strong>strategic oversight</strong>.
              </p>

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
                <li style={{ marginBottom: '16px' }}>
                  <strong>Granular Matching Criteria:</strong> Simple risk settings balance exploring more roles with focusing on high-fit matches.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Customizable Autonomy Levels:</strong> Users choose when AI can auto-submit and when they want a final review.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>High-Volume Transparency:</strong> Clear daily and queued-application counts make scale feel understandable, not chaotic.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Integrated Communication Hub:</strong> A single inbox keeps all interview, follow-up, and rejection updates in one place.
                </li>
              </ul>
            </div>

            {/* Right Column: 视频滚动时固定 */}
            <div>
              <div
                style={{
                  position: 'sticky',
                  top: '96px',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#000000',
                }}
              >
                <video
                  src="/img/Autoapply.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Design Responses - 继续在同一个 section 内 */}
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
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
                {/* Card 1: Search Burnout */}
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
                        <polyline points="12 6 12 12 16 14"></polyline>
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
                      Search Burnout
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
                    Proactive alerts and automated parsing eliminate manual filtering and missed opportunities.
                  </p>
                </div>

                {/* Card 2: ATS Barriers */}
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
                      ATS Barriers
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
                    Visual match scores and AI tailoring provide transparency, optimizing every single application.
                  </p>
                </div>

                {/* Card 3: System Trust */}
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
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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
                      System Trust
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
                    Customizable autonomy levels and precision settings ensure users maintain absolute strategic oversight.
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
                      Jobnova AI Agent (Nova)
                    </h3>
                  </div>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '12px',
                    }}
                  >
                    AI Career Agent that automates search logistics
                  </p>
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
                    The Nova AI Agent handles platform navigation, performs deep resume analysis, and identifies high-precision job matches. It also streamlines networking by drafting referral emails and providing strategic summaries of interview questions and auto-apply performance. This removes the cognitive load of manual tracking, allowing users to focus on high-value interview preparation and long-term career strategy.
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
                    Used for: Job matching, resume optimization, referral outreach, application analysis.
                  </p>
                </div>

                {/* Right Column: 图片按实际尺寸完整显示 */}
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
                        maxWidth: '360px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: '#000000',
                    }}
                  >
                    <Image
                      src="/img/chat.avif"
                      alt="Nova AI Agent chat interface"
                      width={800}
                      height={600}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                </div>
              </div>
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
                  src="/img/Jobnova_cover.avif"
                  alt="Jobnova result mockup"
                  width={640}
                  height={480}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
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
                    The JobNova platform successfully transforms the job search from a manual, overwhelming grind into a streamlined, AI-automated journey. Users can now apply at scale with tailored precision, maintaining full control over their professional narrative while letting AI handle the logistical heavy lifting.
                  </p>
                </div>

                {/* 两个结果卡片 */}
                <div className="flex flex-row" style={{ gap: '24px' }}>
                  {/* Card 1: High-Volume Efficiency */}
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
                        High-Volume Efficiency
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
                      Manage 1,600+ scheduled applications and track real-time daily progress with ease.
                    </p>
                  </div>

                  {/* Card 2: Optimized Match Success */}
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
                        Optimized Match Success
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
                      Improve candidate visibility through dynamic ATS tailoring and transparent match scoring.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <Button
                    onClick={() => window.open('https://jobnova.ai/', '_blank', 'noopener,noreferrer')}
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
                {/* Card 1: How users prefer to discover new roles */}
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
                    How users prefer to discover new roles
                  </h4>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                          AI-matched notifications (email / in-app)
                        </span>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>68%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '68%', height: '100%', backgroundColor: 'rgb(0, 0, 0)', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                          In-app browse / manual search
                        </span>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>24%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '24%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                          Referral links / direct apply
                        </span>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>8%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '8%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                  <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                    This supported prioritizing proactive notifications and the &quot;Golden Hour&quot; alert design so users see the freshest matches first.
                  </p>
                </div>

                {/* Card 2: Resume customization before applying */}
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
                    Resume customization before applying
                  </h4>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                          Use AI Resume Customizer for most applications
                        </span>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>62%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '62%', height: '100%', backgroundColor: 'rgb(0, 0, 0)', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                          Use for high-priority roles only
                        </span>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>28%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '28%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>
                          Prefer manual resume only
                        </span>
                        <span style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)' }}>10%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '10%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                  <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                    Data showed strong adoption of AI tailoring when it was visible in the job flow, reinforcing in-context placement next to Fit &amp; Insights.
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
                  &quot;Finally something that applies for me while I sleep. The match scores help me decide what&apos;s worth a closer look.&quot;
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
                  — Jobnova beta user
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
                  {/* Card 1: Deeper AI Agent integration */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
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
                        <path d="M12 8V4H8"></path>
                        <rect x="2" y="8" width="20" height="12" rx="2"></rect>
                        <path d="M6 16v2"></path>
                        <path d="M10 16v2"></path>
                        <path d="M14 16v2"></path>
                        <path d="M18 16v2"></path>
                      </svg>
                    </div>
                    <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '24px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>
                      Deeper AI Agent integration
                    </h4>
                    <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                      Tighten integration with the Nova AI agent across the product: smarter job matching, automated referral outreach, and interview-prep summaries so users get end-to-end support from discovery to offer.
                    </p>
                  </div>

                  {/* Card 2: Automated application data visualization */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
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
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </div>
                    <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '24px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>
                      Automated application data visualization
                    </h4>
                    <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                      Improve dashboards and tracking for all automated applications: clear status by stage, response rates, and funnel views so users can see exactly where each application stands and optimize their strategy.
                    </p>
                  </div>

                  {/* Card 3: Interview & follow-up pipeline */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
                      flex: 1,
                    }}
                  >
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
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    </div>
                    <h4 style={{ ...fontStyle, fontSize: '18px', lineHeight: '24px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>
                      Interview &amp; follow-up pipeline
                    </h4>
                    <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                      A unified view of interview invites, next steps, and recruiter touchpoints so users can track each application stage and never miss a follow-up or deadline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

    </div>
  );
}
