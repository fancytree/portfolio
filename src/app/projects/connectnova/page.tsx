'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../../components/Button';
import ConnectnovaPageDesignMockup from './ConnectnovaPageDesignMockup';
// 统一从 design-tokens 引用字体与文字样式预设，避免每页重复声明 Manrope 实例
import { fontFamily, textStyle, textColor } from '@/lib/design-tokens';

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
      className="w-full"
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

/** Figma portfolio node 558:4508 — In-depth interviews 矩阵（英文文案） */
const IN_DEPTH_INTERVIEW_PARTICIPANTS = [
  'Alex, 24 Y. O.',
  'Sarah, 35 Y. O.',
  'David, 42 Y. O',
  'Lisa, 32 Y. O',
  'Jiahui, 22 Y. O',
] as const;

const IN_DEPTH_INTERVIEW_TABLE_ROWS: { id: string; question: string; answers: readonly [string, string, string, string, string] }[] = [
  {
    id: 'Q1',
    question: 'Can you tell me about your current job search situation?',
    answers: [
      'CS grad, 3 months in, 200+ applications sent. Mostly LinkedIn Easy Apply. Rarely hear back — feels like a void.',
      '10 years in marketing, pivoting to PM. Experience is there but my resume doesn\'t say "PM" yet. Rewriting it for every role is exhausting.',
      'Senior engineer, passively looking. I check boards twice a week. I want the right role, not just any role.',
      'Returning after 14 months maternity leave. Only a few hours a day to search. I need to be fast and strategic.',
      'On OPT, need H-1B sponsorship. Most listings don\'t mention visa policy, so I waste time applying to dead ends.',
    ],
  },
  {
    id: 'Q2',
    question: 'What\'s your process when searching and applying?',
    answers: [
      'Filter by Easy Apply, blast 10–15 apps a day with a copy-pasted resume. I know quality is low but the volume pressure is real.',
      'I find a target role, spend 2–3 hours tailoring the resume and writing a cover letter. Maybe 3 solid applications a week.',
      'I go direct to company career pages. Try to get a referral first — it bypasses ATS. If not, I only apply when I\'m confident in the fit.',
      'I use the kids\' nap time — 90 minutes. I have a spreadsheet to track apps. I try to tailor but often send a generic one just to keep moving.',
      'I manually check each company\'s website for visa policy before applying. 70% of my time is filtering, not actually applying.',
    ],
  },
  {
    id: 'Q3',
    question: 'What are the biggest challenges you face?',
    answers: [
      'No feedback, ever. I got an automated rejection in 4 minutes once — no human read it. I also always miss postings that close fast.',
      'Manual tailoring is unsustainable. And I\'m second-guessing my pivot narrative — is my story landing? It\'s affecting my confidence.',
      'Too much noise. Even filtered searches serve me mid-level roles. No visibility into how my application is being evaluated.',
      'Time. I can\'t spend 2 hours on one application. I also fear ATS is filtering me out for the career gap before anyone sees my experience.',
      'Finding out a company doesn\'t sponsor — after I\'ve already applied. The process has no transparency and wastes weeks of effort.',
    ],
  },
  {
    id: 'Q4',
    question: 'What would you want in a job search platform?',
    answers: [
      'Auto-tailor my resume per listing. Real-time alerts when a matching role posts. Some kind of fit score so I know where to focus.',
      'AI that handles the keyword rewriting so I can apply more broadly. A clear explanation of what ATS wants — not just a keyword list.',
      'Precision matching, not volume. Notify me only when fit is genuinely high. Show me how competitive the applicant pool is.',
      'Push alerts to my phone or email. A fast resume tailoring tool that works in under 5 minutes. Address the gap strategically without lying.',
      'A real visa sponsorship filter — not vague language, actual H-1B/OPT labeling. Fast resume adaptation. Batch apply to pre-vetted companies.',
    ],
  },
];

const IN_DEPTH_INTERVIEW_SUMMARY_ANSWERS = [
  'High-volume, low-quality applicant. Needs automated tailoring + real-time alerts to improve hit rate without more effort.',
  'Over-invests in manual tailoring. Needs AI-assisted resume positioning to scale applications while maintaining quality.',
  'Selective and referral-first. Needs precision matching and less noise — not a mass-apply tool.',
  'Time-constrained returner. Needs passive, push-based discovery and a fast tailoring tool that fits a 90-minute window.',
  'Blocked at the filtering stage. Needs visa sponsorship data upfront and fast batch-apply for pre-vetted companies.',
] as const;

/** Figma portfolio node 561:4751 — Persona 模块（与访谈矩阵 Alex 列一致） */
const PERSONA_FIRST_TIME_SEEKER = {
  // 本地头像：public/img/jobnova/persona-alex.jpg（源自 Unsplash，可替换文件）
  portraitSrc: '/img/jobnova/persona-alex.jpg',
  index: '01',
  archetype: 'First-Time Job Seeker',
  name: 'Alex Chen',
  age: '24',
  occupation: 'Entry-Level Software Engineer (Job Seeking)',
  background:
    'CS graduate, 3 months into his first job search. No full-time experience — only internships and side projects. Applies to 10–15 roles per day using LinkedIn Easy Apply with a copy-pasted resume. Has sent 120+ applications with almost no response.',
  motivation:
    'To land his first full-time role as quickly as possible and stop feeling invisible in the market.',
  goals: [
    'To get more callbacks without spending more time applying.',
    'To understand why his applications aren\'t getting through ATS.',
    'To identify which roles are actually worth applying to.',
  ],
  tasks: [
    'Filtering by "Easy Apply" and applying in bulk every day.',
    'Copy-pasting his base resume with minimal edits per role.',
    'Refreshing his inbox waiting for any recruiter response.',
  ],
  pains: [
    'Gets automated rejections in minutes — knows no human read his application.',
    'Has no idea why he\'s being filtered out or what to change.',
    'Constantly misses freshly posted roles that close within 24 hours.',
  ],
  joys: [
    'Knows exactly which roles match him and why, without guessing.',
    'Gets notified the moment a relevant role posts — before the rush.',
  ],
} as const;

/** Persona 02 — 与访谈矩阵 Sarah 列一致；界面标签 PAINS（稿中 PAINTS 为笔误） */
const PERSONA_EXPERIENCED_PROFESSIONAL = {
  // 本地头像：public/img/jobnova/persona-sarah.jpg（源自 Unsplash，可替换文件）
  portraitSrc: '/img/jobnova/persona-sarah.jpg',
  index: '02',
  archetype: 'Experienced Professional',
  name: 'Sarah Müller',
  age: '35',
  occupation: 'Senior Marketing Manager → Transitioning to Product Management',
  background:
    '10 years across two companies. Has been pursuing PM roles for 4 months alongside her current job. Her experience is relevant but her resume doesn\'t speak PM language yet. Can only dedicate evenings and weekends to job searching — maybe 3 tailored applications per week.',
  motivation:
    'To make a strategic career move without sacrificing the quality of each application or burning out in the process.',
  goals: [
    'To reframe her existing experience in language that clears ATS and convinces hiring managers.',
    'To apply to more roles without the 2–3 hour tailoring process per application.',
    'To search and apply during limited windows of time, without missing opportunities.',
  ],
  tasks: [
    'Researching target companies and PM role requirements after work hours.',
    'Manually rewriting resume bullets to match each job description.',
    'Balancing active job searching with performing well in her current role.',
  ],
  pains: [
    'Manual tailoring is unsustainable — 3 applications a week feels too slow.',
    'Fears ATS is filtering her out for lacking a direct PM title.',
    'Misses job alerts she can\'t act on immediately during work hours.',
  ],
  joys: [
    'AI instantly reframes her experience into the right language for each role.',
    'Can review and approve tailored applications in minutes, not hours.',
  ],
} as const;

const CONNECTNOVA_PERSONAS = [PERSONA_FIRST_TIME_SEEKER, PERSONA_EXPERIENCED_PROFESSIONAL] as const;

/** Persona 标题下方的导语（英文） */
const PERSONA_SECTION_INTRO =
  'We have described 2 types of people according to their experience in the job market. The least experienced are recent graduates entering hiring for the first time — applying broadly with little strategy. And experienced professionals already in work, who know what they want but lack the time and tools to pursue it effectively.';

/** UX research → Persona 下方的 Solution 四卡（英文）；icon 与 Key Pain Points 同风格圆底 stroke */
const CONNECTNOVA_SOLUTION_CARDS = [
  {
    id: '01',
    icon: 'bell' as const,
    title: 'Instant Job Notification',
    description:
      'Get alerted the moment a matching role posts — before the first 24 hours close.',
  },
  {
    id: '02',
    icon: 'fileText' as const,
    title: 'AI Resume Customizer',
    description:
      'Rewrites your resume for each role in seconds. Review, adjust, and apply — no more starting from scratch.',
  },
  {
    id: '03',
    icon: 'send' as const,
    title: 'AI Auto Apply',
    description:
      'Set your match threshold and let the system apply automatically. Track every application in one dashboard.',
  },
  {
    id: '04',
    icon: 'bot' as const,
    title: 'Nova AI Agent',
    description:
      'Your AI career co-pilot. Explains fit gaps, drafts outreach, and preps you for interviews — all in one place.',
  },
] as const;

type SolutionCardIconKind = (typeof CONNECTNOVA_SOLUTION_CARDS)[number]['icon'];

/** Solution 卡图标（对齐 Key Pain Points：48px 圆 + 24px stroke 图标） */
function SolutionCardIcon({ kind }: { kind: SolutionCardIconKind }) {
  const stroke = 'rgba(0, 0, 0, 0.7)';
  const svgProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24' as const,
    fill: 'none' as const,
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (kind) {
    case 'bell':
      return (
        <svg {...svgProps}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case 'fileText':
      return (
        <svg {...svgProps}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    case 'send':
      return (
        <svg {...svgProps}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case 'bot':
      return (
        <svg {...svgProps}>
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      );
    default:
      return null;
  }
}

// Connectnova 项目详情页（由 MemQ 模板复制，可替换为实际项目内容）
export default function ConnectnovaProjectPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  // fontStyle 仅作为 Manrope 字体家族的简写，仍保留以避免破坏下方大量 `...fontStyle` 的展开
  const fontStyle = {
    fontFamily: fontFamily.sans,
  };
  // H1 / H2 改为从语义预设继承；先叠 Manrope，再叠排版 scale，再叠布局相关属性
  const headingLevel1Style = {
    ...fontStyle,
    ...textStyle.h1,
    color: textColor.strong,
    marginBottom: '16px',
  };
  const headingLevel2Style = {
    ...fontStyle,
    ...textStyle.h2,
    color: textColor.strong,
    marginBottom: '24px',
  };

  return (
    <div className="w-full min-w-0" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section 
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: '40px',
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

            {/* 角色与时间线（无交互，直接展示） */}
            <div
              style={{
                ...fontStyle,
                fontSize: '14px',
                lineHeight: '24px',
                fontWeight: 300,
                color: 'rgba(102, 102, 102, 1)',
                marginBottom: '8px',
              }}
            >
              Founding Product Designer · AI Startup · 2025 – Present (Ongoing)
            </div>
            <div
              className="flex flex-col gap-1"
              style={{
                ...fontStyle,
                ...textStyle.body,
                color: 'oklch(0.556 0 0)',
                marginBottom: '20px',
              }}
            >
              <div>Foundational discovery & interviews · Competitive benchmarking · Iterative usability testing</div>
              <div>End-to-end responsive web platform · Mobile-first landing · Live 0-to-1 product</div>
            </div>

            <h1 style={headingLevel1Style}>Connectnova</h1>
            <p
              style={{
                ...fontStyle,
                ...textStyle.lead,
                color: 'rgba(0, 0, 0, 1)',
                marginBottom: '28px',
                maxWidth: '720px',
              }}
            >
              An AI-native career ecosystem designed for modern job seekers to instantly discover tailored opportunities and automate the end-to-end application process with hyper-personalized resumes.
            </p>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Problems & Solutions — 与 Hero / Context 相同全宽突破；内层仅 maxWidth 1280 + 居中，不再叠加 px（否则比其它区块窄一整圈） */}
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '24px',
          paddingBottom: '64px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            {/* Problems & solutions 标题按需求移除，保留下方卡片内容 */}
            <div
              style={{
                width: '100%',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <div
                className="grid grid-cols-1 lg:grid-cols-2"
                style={{ alignItems: 'stretch', gap: 0 }}
              >
                {/* 左栏：浅灰底（仅统计） */}
                <div
                  style={{
                    backgroundColor: '#F9FAFB',
                    padding: '48px 40px',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {[
                      { stat: '75%', label: 'Resumes Rejected Before a Human Reads Them' },
                      { stat: '200+', label: 'Applications Submitted Before a Single Offer' },
                      { stat: '24 hrs', label: 'The Critical Window — Early Applicants Get 3× More Callbacks' },
                    ].map(({ stat, label }, i) => (
                      <div key={i}>
                        <div
                          style={{
                            ...fontStyle,
                            fontSize: 'clamp(40px, 8vw, 64px)',
                            fontWeight: 500,
                            lineHeight: 'normal',
                            color: 'rgb(0,0,0)',
                            marginBottom: '8px',
                          }}
                        >
                          {stat}
                        </div>
                        <div
                          style={{
                            ...fontStyle,
                            fontSize: '18px',
                            fontWeight: 400,
                            lineHeight: 'normal',
                            color: '#6D6D7A',
                            maxWidth: '100%',
                          }}
                        >
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右栏 */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '48px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '56px',
                    textAlign: 'center',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                    <Image
                      src="/img/connectnova-problems-icon.png"
                      alt="Connectnova"
                      width={106}
                      height={106}
                      style={{ borderRadius: '24px', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '36px',
                        fontWeight: 500,
                        lineHeight: 'normal',
                        color: '#09090B',
                      }}
                    >
                      <span>Job</span>
                      <span>Nova</span>
                    </div>
                    <div
                      style={{
                        ...fontStyle,
                        fontSize: '18px',
                        fontWeight: 500,
                        lineHeight: 'normal',
                        color: '#474646',
                        maxWidth: '420px',
                        textAlign: 'center',
                      }}
                    >
                      <p style={{ margin: 0, marginBottom: 0 }}>Connectnova automates the hardest parts of job searching — finding the right roles, tailoring your resume, and submitting applications at scale.</p>
                      <p style={{ margin: '1em 0 0 0' }}>You stay in control of your story. AI handles the rest.</p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '26px 27px',
                      justifyContent: 'center',
                      width: '291px',
                      maxWidth: '100%',
                    }}
                  >
                    {[
                      { label: 'Job Alerts', bg: 'rgba(173,245,0,0.12)', border: 'none' },
                      { label: 'Resume AI', bg: '#FFFFFF', border: '1px solid #F2F2F3' },
                      { label: 'Auto Apply', bg: '#B0F809', border: '1px solid #F2F2F3' },
                      { label: 'Nova Agent', bg: 'rgba(99,102,241,0.12)', border: 'none' },
                    ].map(({ label, bg, border }) => (
                      <div
                        key={label}
                        style={{
                          ...fontStyle,
                          fontSize: '20px',
                          fontWeight: 500,
                          lineHeight: 'normal',
                          color: 'rgb(0,0,0)',
                          backgroundColor: bg,
                          border,
                          borderRadius: '41px',
                          padding: '10px',
                          width: '132px',
                          textAlign: 'center',
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* UX research：导语 + In-depth interviews + Key Pain Points + Persona + Solution */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* UX research 是本章的一级标题，统领下面三个二级模块：In-depth interviews / Persona / Solution */}
            <h1 style={headingLevel1Style}>UX research</h1>
            <p
              style={{
                ...fontStyle,
                fontSize: '18px',
                lineHeight: '30px',
                color: 'rgba(0,0,0,0.88)',
                maxWidth: '780px',
                marginBottom: '32px',
              }}
            >
              Before defining user archetypes and detailed insights, we ran structured UX research to ground the product in real search behavior, trust boundaries, and ATS friction—not assumptions about &quot;faster applications.&quot;
            </p>

            {/* 二级模块 In-depth interviews — Figma portfolio 558:4508 */}
            <div style={{ marginTop: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {/* 二级标题，层级位于 UX research 之下 */}
                <h2
                  style={{
                    ...headingLevel2Style,
                    margin: 0,
                  }}
                >
                  In-depth interviews
                </h2>
                <div style={{ ...fontStyle, textAlign: 'right' }}>
                  <div style={{ fontSize: '48px', lineHeight: 1, fontWeight: 500, color: 'rgb(0,0,0)' }}>20+</div>
                  <div style={{ fontSize: '20px', lineHeight: 'normal', fontWeight: 500, color: 'rgb(0,0,0)' }}>
                    interviews
                  </div>
                </div>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  borderTop: '1px solid #D0D0DA',
                }}
              >
                <table
                  style={{
                    ...fontStyle,
                    width: '100%',
                    minWidth: '960px',
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                  }}
                >
                  <colgroup>
                    <col style={{ width: '36px' }} />
                    <col style={{ width: '168px' }} />
                    {IN_DEPTH_INTERVIEW_PARTICIPANTS.map((_, i) => (
                      <col key={i} style={{ width: 'calc((100% - 204px) / 5)' }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: '10px 8px 12px 0',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#6D6D7A',
                          borderBottom: '1px solid #D0D0DA',
                          verticalAlign: 'bottom',
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          padding: '10px 12px 12px 0',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#6D6D7A',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          borderBottom: '1px solid #D0D0DA',
                          verticalAlign: 'bottom',
                        }}
                      >
                        Questions
                      </th>
                      {IN_DEPTH_INTERVIEW_PARTICIPANTS.map((name) => (
                        <th
                          key={name}
                          style={{
                            padding: '10px 8px 12px 8px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#6D6D7A',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            borderBottom: '1px solid #D0D0DA',
                            verticalAlign: 'bottom',
                          }}
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {IN_DEPTH_INTERVIEW_TABLE_ROWS.map((row) => (
                      <tr key={row.id}>
                        <td
                          style={{
                            padding: '16px 8px 16px 0',
                            verticalAlign: 'top',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#6D6D7A',
                            borderBottom: '1px solid #D0D0DA',
                          }}
                        >
                          {row.id}
                        </td>
                        <td
                          style={{
                            padding: '16px 12px 16px 0',
                            verticalAlign: 'top',
                            fontSize: '12px',
                            lineHeight: '16px',
                            fontWeight: 500,
                            color: 'rgb(0,0,0)',
                            borderBottom: '1px solid #D0D0DA',
                          }}
                        >
                          {row.question}
                        </td>
                        {row.answers.map((cell, i) => (
                          <td
                            key={i}
                            style={{
                              padding: '16px 8px',
                              verticalAlign: 'top',
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 500,
                              color: '#6D6D7A',
                              borderBottom: '1px solid #D0D0DA',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td
                        style={{
                          padding: '16px 8px 16px 0',
                          verticalAlign: 'top',
                          borderTop: '2px solid #D0D0DA',
                        }}
                      />
                      <td
                        style={{
                          padding: '16px 12px 16px 0',
                          verticalAlign: 'top',
                          fontSize: '12px',
                          lineHeight: '16px',
                          fontWeight: 500,
                          color: 'rgb(0,0,0)',
                          borderTop: '2px solid #D0D0DA',
                        }}
                      >
                        Summary
                      </td>
                      {IN_DEPTH_INTERVIEW_SUMMARY_ANSWERS.map((cell, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '16px 8px',
                            verticalAlign: 'top',
                            fontSize: '12px',
                            lineHeight: '16px',
                            fontWeight: 500,
                            color: '#6D6D7A',
                            borderTop: '2px solid #D0D0DA',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Pain Points — 自 Research 移至 In-depth interviews 下 */}
            <div style={{ marginTop: '56px', maxWidth: '1280px' }}>
              <h3
                style={{
                  ...fontStyle,
                  ...textStyle.h3Medium,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '24px',
                }}
              >
                Key Pain Points
              </h3>
              <div className="flex flex-col md:flex-row" style={{ gap: '24px' }}>
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
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    Search Fatigue &amp; Information Overload
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Manually sifting through hundreds of irrelevant listings leads to application fatigue — effort drops as volume grows.
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
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    The ATS &quot;Black Hole&quot;
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    75% of resumes never reach a human. Candidates have no visibility into why they were rejected or how to improve.
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
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      marginBottom: '8px',
                    }}
                  >
                    The Timing Disadvantage
                  </h4>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: 'rgb(0, 0, 0)',
                    }}
                  >
                    Applying in the first 24 hours increases callbacks by 3×. Most candidates miss the window because they can&apos;t monitor listings around the clock.
                  </p>
                </div>
              </div>
            </div>

            {/* 二级模块 Persona — 副标题 / 横线 / 序号 三者垂直居中对齐；整带与头像下对齐 */}
            <div style={{ marginTop: '56px' }}>
              {/* 二级标题，层级位于 UX research 之下 */}
              <h2
                style={{
                  ...headingLevel2Style,
                  margin: '0 0 12px 0',
                }}
              >
                Persona
              </h2>

              <p
                style={{
                  ...fontStyle,
                  fontSize: '18px',
                  lineHeight: '30px',
                  color: 'rgba(0,0,0,0.88)',
                  maxWidth: '780px',
                  margin: '0 0 28px 0',
                }}
              >
                {PERSONA_SECTION_INTRO}
              </p>

              {CONNECTNOVA_PERSONAS.map((persona, personaIdx) => (
                <div
                  key={persona.index}
                  style={{
                    marginBottom: personaIdx < CONNECTNOVA_PERSONAS.length - 1 ? '48px' : 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-end',
                      columnGap: '20px',
                      rowGap: '12px',
                      marginBottom: '40px',
                    }}
                  >
                    {/* 横线固定宽度、整组不 flex 撑满，序号与头像靠左 */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        columnGap: '16px',
                        rowGap: '8px',
                        flex: '0 1 auto',
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'nowrap',
                          alignItems: 'center',
                          columnGap: '20px',
                          flexShrink: 0,
                        }}
                      >
                        <p
                          style={{
                            ...fontStyle,
                            fontSize: '20px',
                            lineHeight: 'normal',
                            fontWeight: 500,
                            color: 'rgb(0,0,0)',
                            margin: 0,
                            flexShrink: 0,
                          }}
                        >
                          {persona.archetype}
                        </p>
                        <div
                          style={{
                            width: '416px',
                            flexShrink: 0,
                            alignSelf: 'stretch',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          aria-hidden
                        >
                          <div style={{ width: '100%', borderTop: '1px solid #D0D0DA' }} />
                        </div>
                        <span
                          style={{
                            ...fontStyle,
                            fontSize: '24px',
                            lineHeight: '1',
                            fontWeight: 500,
                            color: 'rgb(0,0,0)',
                            flexShrink: 0,
                          }}
                        >
                          {persona.index}
                        </span>
                      </div>
                      <Image
                        className="shrink-0 object-cover"
                        src={persona.portraitSrc}
                        alt={`${persona.name}, ${persona.archetype}`}
                        width={136}
                        height={136}
                        sizes="136px"
                      />
                    </div>
                  </div>

                  {/* 大屏右侧详情区 */}
                  <div className="grid w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,720px)] gap-x-10 gap-y-4 items-start">
                    <div className="hidden min-h-px lg:block" aria-hidden />
                    <div className="min-w-0 w-full lg:justify-self-end">
                      {(
                        [
                          { label: 'NAME', value: persona.name },
                          { label: 'AGE', value: persona.age },
                          { label: 'OCCUPATION', value: persona.occupation },
                          { label: 'BACKGROUND', value: persona.background },
                          { label: 'MOTIVATION', value: persona.motivation },
                        ] as const
                      ).map((row) => (
                        <div
                          key={`${persona.index}-${row.label}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(72px, 120px) minmax(0, 1fr)',
                            columnGap: '16px',
                            alignItems: 'start',
                            marginBottom: '18px',
                          }}
                        >
                          <div
                            style={{
                              ...fontStyle,
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 500,
                              color: '#6D6D7A',
                              textTransform: 'uppercase',
                              textAlign: 'right',
                            }}
                          >
                            {row.label}
                          </div>
                          <div
                            style={{
                              ...fontStyle,
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 500,
                              color: '#171616',
                              minWidth: 0,
                            }}
                          >
                            {row.value}
                          </div>
                        </div>
                      ))}

                      {(
                        [
                          { label: 'GOALS', lines: persona.goals },
                          { label: 'TASKS', lines: persona.tasks },
                          { label: 'PAINS', lines: persona.pains },
                          { label: 'JOYS', lines: persona.joys },
                        ] as const
                      ).map((block) => (
                        <div
                          key={`${persona.index}-${block.label}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(72px, 120px) minmax(0, 1fr)',
                            columnGap: '16px',
                            alignItems: 'start',
                            marginBottom: '18px',
                          }}
                        >
                          <div
                            style={{
                              ...fontStyle,
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 500,
                              color: '#6D6D7A',
                              textTransform: 'uppercase',
                              textAlign: 'right',
                            }}
                          >
                            {block.label}
                          </div>
                          <div
                            style={{
                              ...fontStyle,
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 500,
                              color: '#171616',
                              minWidth: 0,
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {block.lines.map((line, idx) => (
                                <div key={`${persona.index}-${block.label}-${idx}`}>— {line}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Solution — 四卡产品能力（接 Persona 后） */}
            <div style={{ marginTop: '56px' }}>
              {/* 二级标题，层级位于 UX research 之下 */}
              <h2
                style={{
                  ...headingLevel2Style,
                  margin: '0 0 24px 0',
                }}
              >
                Solution
              </h2>
              <div
                className="flex w-full flex-row gap-4 overflow-x-auto"
                style={{ marginBottom: 0, WebkitOverflowScrolling: 'touch' }}
              >
                {CONNECTNOVA_SOLUTION_CARDS.map((card) => (
                  <div
                    key={`solution-${card.id}`}
                    style={{
                      flex: '1 1 0',
                      minWidth: '200px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      padding: '24px',
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
                      <SolutionCardIcon kind={card.icon} />
                    </div>
                    <h4
                      style={{
                        ...fontStyle,
                        ...textStyle.h5,
                        color: 'rgb(0, 0, 0)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {card.title}
                    </h4>
                    <p
                      style={{
                        ...fontStyle,
                        ...textStyle.body,
                        color: 'rgb(0, 0, 0)',
                        margin: 0,
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* What I Designed Section */}
      <section 
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        {/* UX design 二级标题单独一行，不进 ScrollAnimatedSection，避免进视口前 opacity:0 */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ ...headingLevel2Style, margin: 0 }}>UX design</h2>
        </div>

        {/* 导语与 User flow / Wire Frame 仍用进场动画 */}
        <ScrollAnimatedSection>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
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
                I designed Connectnova to support every type of modern job seeker: <strong>the watchers, the optimizers, and the sprinters</strong>. The ecosystem automates the <strong>high-friction stages of the job search—manual filtering and resume tailoring</strong>—while still giving candidates <strong>absolute control</strong> over their <strong>professional narrative and how they connect with opportunities</strong>.
              </p>
            </div>

            {/* 二级标题：User flow + 流程图（public/img/Work flow.avif） */}
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: 'normal',
                fontWeight: 600,
                color: 'rgb(0,0,0)',
                marginTop: '48px',
                marginBottom: '20px',
              }}
            >
              User flow
            </h3>
            <Image
              src="/img/Work%20flow.avif"
              alt="Connectnova user flow diagram"
              width={2560}
              height={1440}
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
              }}
            />

            {/* Wire Frame：标题行右侧 50+ / screens，与 In-depth interviews 统计样式一致 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                marginTop: '56px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  ...fontStyle,
                  fontSize: '22px',
                  lineHeight: 'normal',
                  fontWeight: 600,
                  color: 'rgb(0,0,0)',
                  margin: 0,
                }}
              >
                Wire Frame
              </h3>
              <div style={{ ...fontStyle, textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '48px', lineHeight: 1, fontWeight: 500, color: 'rgb(0,0,0)' }}>50+</div>
                <div style={{ fontSize: '20px', lineHeight: 'normal', fontWeight: 500, color: 'rgb(0,0,0)' }}>
                  screens
                </div>
              </div>
            </div>
            <Image
              src="/img/Mid%20Fidelity.png"
              alt="Connectnova mid-fidelity wireframes"
              width={2560}
              height={1440}
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
              }}
            />

            {/* 页面设计：Figma Connectnova-Redesign 126:13489（入职引导第一步） */}
            <h3
              style={{
                ...fontStyle,
                fontSize: '22px',
                lineHeight: 'normal',
                fontWeight: 600,
                color: 'rgb(0,0,0)',
                marginTop: '56px',
                marginBottom: '20px',
              }}
            >
              Page design
            </h3>
            {/* Page design 主屏：Screen 1–6 纵向堆叠，无间距 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                marginBottom: '32px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Image
                  key={i}
                  src={`/img/jobnova/Screen%20${i}.avif`}
                  alt={`Connectnova page design — Screen ${i}`}
                  width={2560}
                  height={1440}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Design System Module */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
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
          <h2
            style={{
              ...headingLevel2Style,
              marginTop: 0,
              marginRight: 0,
              marginLeft: 0,
              marginBottom: '32px',
            }}
          >
            Design System
          </h2>

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
          {/* 设计系统交付说明 */}
          <p
            style={{
              ...fontStyle,
              fontSize: '17px',
              lineHeight: '28px',
              fontWeight: 400,
              color: 'oklch(0.35 0 0)',
              marginTop: '28px',
              marginBottom: '12px',
              maxWidth: '920px',
            }}
          >
            Built a Connectnova UI kit spanning core patterns (navigation, job cards, forms, and AI surfaces) with a token hierarchy for color, typography, spacing, and elevation so marketing and product could stay visually aligned.
          </p>
          <p
            style={{
              ...fontStyle,
              fontSize: '17px',
              lineHeight: '28px',
              fontWeight: 400,
              color: 'oklch(0.35 0 0)',
              marginTop: 0,
              marginBottom: 0,
              maxWidth: '920px',
            }}
          >
            The system exists because the experience spans high-volume workflows, AI-assisted actions, and multiple breakpoints—without tokens and reusable components, every experiment would have fractured the interface. Shared Figma libraries and named components tightened handoff and reduced back-and-forth on specs during the beta cycle.
          </p>
        </div>
      </section>

      {/* Validation：测试方法与数据图表 */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '72px',
          paddingBottom: '72px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <h2
            style={{
              ...headingLevel2Style,
              marginTop: 0,
              marginBottom: '16px',
            }}
          >
            Validation
          </h2>
          <p
            style={{
              ...fontStyle,
              fontSize: '17px',
              lineHeight: '28px',
              fontWeight: 400,
              color: 'oklch(0.4 0 0)',
              marginBottom: '32px',
              maxWidth: '900px',
            }}
          >
            Before locking core flows we ran multiple rounds of moderated usability sessions on discovery and apply paths, paired with an in-product survey (n=47) on how people find roles and when they tailor resumes. Findings below directly informed notification priority, in-context resume tools, and transparency in auto-apply.
          </p>
          <div className="flex flex-row" style={{ gap: '24px', width: '100%', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '40px',
                flex: '1 1 320px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '20px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '20px',
                }}
              >
                How users prefer to discover new roles
              </h4>
              <div style={{ marginBottom: '20px' }}>
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
              <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '22px', fontWeight: 600, color: 'rgb(0, 0, 0)', margin: '0 0 8px 0' }}>
                How this shaped the design
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                This supported prioritizing proactive notifications and the &quot;Golden Hour&quot; alert design so users see the freshest matches first.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '40px',
                flex: '1 1 320px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h4
                style={{
                  ...fontStyle,
                  fontSize: '20px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: 'rgb(0, 0, 0)',
                  marginBottom: '20px',
                }}
              >
                Resume customization before applying
              </h4>
              <div style={{ marginBottom: '20px' }}>
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
              <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '22px', fontWeight: 600, color: 'rgb(0, 0, 0)', margin: '0 0 8px 0' }}>
                How this shaped the design
              </p>
              <p style={{ ...fontStyle, fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: 'rgb(0, 0, 0)', margin: 0 }}>
                Data showed strong adoption of AI tailoring when it was visible in the job flow, reinforcing in-context placement next to Fit &amp; Insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results：业务与用户成果 */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
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
              style={{ ...headingLevel2Style, marginBottom: '32px' }}
            >
              Results
            </h2>

            {/* 左侧封面 + 右侧成果数字与引用 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div
                style={{
                  flex: '1 1 320px',
                  maxWidth: '640px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <Image
                  src="/img/Jobnova_cover.avif"
                  alt="Connectnova result mockup"
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

              <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                <p
                  style={{
                    ...fontStyle,
                    fontSize: '17px',
                    lineHeight: '28px',
                    fontWeight: 400,
                    color: 'rgb(0, 0, 0)',
                    marginBottom: '24px',
                  }}
                >
                  Beta usage showed measurable shifts in how often people applied and how quickly they trusted AI-assisted tailoring—without giving up oversight of what went out.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                  }}
                >
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ ...fontStyle, fontSize: '36px', lineHeight: '42px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>3×</div>
                    <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '22px', fontWeight: 400, color: 'oklch(0.35 0 0)', margin: 0 }}>
                      Beta users submitted ~3× more applications per week vs. their prior manual process.
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ ...fontStyle, fontSize: '36px', lineHeight: '42px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>62%</div>
                    <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '22px', fontWeight: 400, color: 'oklch(0.35 0 0)', margin: 0 }}>
                      Adopted AI resume tailoring within the first session when surfaced next to Fit &amp; Insights.
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ ...fontStyle, fontSize: '36px', lineHeight: '42px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>68%</div>
                    <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '22px', fontWeight: 400, color: 'oklch(0.35 0 0)', margin: 0 }}>
                      Reported AI-matched notifications as their primary way to discover new roles (survey).
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ ...fontStyle, fontSize: '36px', lineHeight: '42px', fontWeight: 600, color: 'rgb(0, 0, 0)', marginBottom: '8px' }}>Live</div>
                    <p style={{ ...fontStyle, fontSize: '15px', lineHeight: '22px', fontWeight: 400, color: 'oklch(0.35 0 0)', margin: 0 }}>
                      Shipped at connectnova.ai with an active beta cohort and ongoing instrumentation.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#F7F7F7',
                    borderRadius: '12px',
                    padding: '28px',
                    marginBottom: '20px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
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
                      marginBottom: '12px',
                    }}
                  >
                    &quot;Finally something that applies for me while I sleep. The match scores help me decide what&apos;s worth a closer look.&quot;
                  </p>
                  <p
                    style={{
                      ...fontStyle,
                      ...textStyle.body,
                      color: '#333333',
                      margin: 0,
                    }}
                  >
                    — Connectnova beta user
                  </p>
                </div>

                <p
                  style={{
                    ...fontStyle,
                    fontSize: '15px',
                    lineHeight: '24px',
                    fontWeight: 500,
                    color: 'oklch(0.4 0 0)',
                    marginBottom: '20px',
                  }}
                >
                  Live at connectnova.ai · Beta program · Metrics from moderated sessions, in-product survey (n=47), and usage analytics
                </p>

                <Button
                  onClick={() => window.open('https://connectnova.ai/', '_blank', 'noopener,noreferrer')}
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
        </ScrollAnimatedSection>
      </section>

      {/* Reflection：项目复盘 */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '72px',
          paddingBottom: '72px',
        }}
      >
        <ScrollAnimatedSection>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ ...headingLevel2Style, marginBottom: '28px' }}>Reflection</h2>
            {/* 三卡复盘，与 Next Steps / Key Pain Points 视觉一致 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(
                [
                  {
                    title: 'What worked well',
                    body:
                      'Pairing visible match scores with user-controlled auto-apply thresholds created a believable mental model: people felt the system was working for them, not instead of them. Anchoring research quotes to specific UI decisions in the case study made the narrative easier to defend in critique.',
                  },
                  {
                    title: "What I'd do differently",
                    body:
                      'I would run earlier unmoderated tests on notification density and copy variants; we optimized the "Golden Hour" pattern late, and earlier signal on fatigue would have reduced iteration churn on alert styling.',
                  },
                  {
                    title: 'What I learned',
                    body:
                      'High-volume automation products need design languages for trust and reversibility as much as for efficiency—small transparency affordances (queues, scores, pause controls) disproportionately affect adoption when stakes are professional reputation.',
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    height: '100%',
                  }}
                >
                  <h3
                    style={{
                      ...fontStyle,
                      ...textStyle.h5,
                      color: 'rgb(0, 0, 0)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      ...fontStyle,
                      fontSize: '16px',
                      lineHeight: '26px',
                      fontWeight: 400,
                      color: 'rgb(0, 0, 0)',
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimatedSection>
      </section>

      {/* Next Steps（原 Future Improvements 三张卡片） */}
      <section
        className="w-screen py-16"
        style={{
          backgroundColor: '#FFFFFF',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '64px',
          paddingBottom: '64px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              ...headingLevel2Style,
              marginTop: 0,
              marginBottom: '24px',
            }}
          >
            Next Steps
          </h2>
          <div className="flex flex-row" style={{ gap: '24px', width: '100%', flexWrap: 'wrap' }}>

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
      </section>

      {/* 页尾返回作品集 */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px 80px',
          textAlign: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            ...fontStyle,
            fontSize: '16px',
            fontWeight: 500,
            color: 'rgb(0, 0, 0)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.25)',
          }}
        >
          ← Back to Work
        </Link>
      </div>


    </div>
  );
}
