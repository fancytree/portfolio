'use client';

import type { CSSProperties } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
// 从统一 design-tokens 引用 Manrope 字体，避免本文件再次重复 Manrope 实例化
import { fontFamily } from '@/lib/design-tokens';

// 步一子阶段：126:12712 → …；步二 126:13245；步三 126:13058 / 126:13100；Start Exploring → 129:16518
const ASSET = {
  logo: '/img/jobnova/page-design/logo.png',
  gradient: '/img/jobnova/page-design/gradient.svg',
  arrowNext: '/img/jobnova/page-design/icon-arrow-next.svg',
  analyzingJob: '/img/jobnova/job.svg',
  analyzingHeart: '/img/jobnova/heart.svg',
} as const;

const CAREER_AREAS = ['AI', 'Data', 'CS', 'Engineering', 'Finance', 'PM', 'Design', 'Operations'] as const;

const POSITION_OPTIONS = [
  'Product Designer',
  'UI/UX Designer',
  'UX Researcher',
  'Web Design',
  'Graphic Designer',
  'Motion / Animation Designer',
  'Interior / Architectural Design',
] as const;

const EXPERIENCE_OPTIONS = [
  'Early career (0-2 years)',
  'Mid-level (3-5 years)',
  'Senior / Manager (6+ years)',
  'Executive/Leadership (10+ years)',
] as const;

// Figma 126:12768：步二进入后首屏，工时类型三选一
const STEP1_EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship'] as const;

/** 后续帧渐变文案与 13144 等稿一致 */
const STEP1_EMPLOYMENT_GRADIENT_LABEL: Record<(typeof STEP1_EMPLOYMENT_TYPES)[number], string> = {
  'Full-time': 'Full-time role',
  'Part-time': 'Part-time role',
  Internship: 'Internship',
};
// Figma 126:13198 签证期望三项
const VISA_SPONSORSHIP_OPTIONS = [
  'Offer visa sponsorship',
  'Do not require sponsorship',
  'Can be with or without sponsorship',
] as const;
const EXTRA_COUNTRIES = ['United Kingdom', 'Germany', 'Netherlands', 'Australia'] as const;

/** Figma 126:13100：已上传态示例文件名（演示用，无真实文件选择） */
const MOCK_RESUME_DISPLAY_NAME = '202411_Chel Kno_CV.pdf';

/** 步三分析页（129:16518）进度状态文案，定时逐步切换；句末三点单独动效 */
const ANALYZING_STATUS_LINES = [
  'Reading your resume...',
  'Identifying your core skills...',
  'Mapping your experience to roles...',
  'Scoring your first matches...',
] as const;

const ANALYZING_STATUS_INTERVAL_MS = 2500;

/** 与四段进度文案总时长一致，轨道整圈旋转一周 */
const ANALYZING_ORBIT_PERIOD_MS = ANALYZING_STATUS_INTERVAL_MS * ANALYZING_STATUS_LINES.length;

// Figma 126:13473：邮件频率仅两项
const EMAIL_FREQUENCY_OPTIONS = ['Once a week', 'Daily'] as const;

// 渐变字：勿用仅 color:transparent（下划线会跟 currentColor 一起消失）；用 textDecorationColor + WebkitTextFillColor
const gradientLinkStyle: CSSProperties = {
  display: 'inline-block',
  maxWidth: '100%',
  backgroundColor: 'transparent',
  backgroundImage: 'linear-gradient(97deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  textDecoration: 'underline',
  textDecorationColor: 'rgb(142, 210, 8)',
  textDecorationThickness: '2px',
  textUnderlineOffset: '4px',
  fontSize: 'clamp(16px, 2.5vw, 18px)',
  fontWeight: 500,
  lineHeight: '20px',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
};

const font = { fontFamily: fontFamily.sans } as const;

/** 黑底胶囊：白色 X */
function ChipRemoveIcon() {
  const s = 12;
  return (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M2.5 2.5l7 7M9.5 2.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 浅色底胶囊：深色 X（Figma 导出多为 +，不用文件） */
function ChipRemoveIconMuted() {
  const s = 11;
  return (
    <svg width={s} height={s} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M2.5 2.5l7 7M9.5 2.5l-7 7"
        stroke="#41414F"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="#717171"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowBackIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="#010214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Figma 126:13105：外层 130×130 圆角底 + 内嵌图形绝对定位（与 126:13106 尺寸/位置一致）
 * 叠纸、折角、头像灰块、正文线、右下角荧光绿角标 + 黑色上箭头
 */
function ResumeUploadIllustration() {
  return (
    <div
      style={{
        position: 'relative',
        width: 130,
        height: 130,
        borderRadius: 68.211,
        backgroundColor: '#f8f8f8',
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 65 70"
        width={64.265}
        height={69.757}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{
          position: 'absolute',
          left: 36.08,
          top: 33.33,
          display: 'block',
        }}
      >
        {/* 后层纸张 */}
        <rect x="17" y="11" width="34" height="42" rx="3" fill="#FFFFFF" stroke="#1F2937" strokeWidth="1.2" />
        {/* 前层纸张 + 右上折角 */}
        <path
          d="M9 15v38a3 3 0 003 3h28a3 3 0 003-3V22l-7-7H12a3 3 0 00-3 3z"
          fill="#FFFFFF"
          stroke="#1F2937"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* 简历头像占位块 */}
        <rect x="15" y="23" width="10" height="10" rx="1.2" fill="#D1D5DB" />
        {/* 正文横线 */}
        <line x1="15" y1="37.5" x2="41" y2="37.5" stroke="#1F2937" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="15" y1="43.5" x2="36" y2="43.5" stroke="#1F2937" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="15" y1="49.5" x2="30" y2="49.5" stroke="#1F2937" strokeWidth="1.4" strokeLinecap="round" />
        {/* 右下角上传角标 */}
        <rect x="32" y="45" width="22" height="22" rx="5" fill="#B0F809" />
        <path
          d="M43 58.5V52M39.2 55.3L43 51.5l3.8 3.8"
          stroke="#010214"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** 129:16569：158×158 虚线轨道（矢量自绘，对齐 Figma 视觉） */
function AnalyzingOrbitRing() {
  const size = 158;
  const c = size / 2;
  const r = c - 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle
        cx={c}
        cy={c}
        r={r}
        stroke="#9CA3AF"
        strokeWidth={2}
        strokeDasharray="5.5 8.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Figma 129:16568：虚线静止；job/heart 绕轨道中心旋转，周期与 ANALYZING_ORBIT_PERIOD_MS 一致；角标自身反向旋转保持正向
 */
function ResumeAnalyzingHero() {
  const badge: CSSProperties = {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: '50%',
    padding: 4,
    boxSizing: 'border-box',
    backgroundColor: '#151614',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 175,
        height: 158,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {/* 129:16569 虚线不转 */}
      <div
        style={{
          position: 'absolute',
          left: 7,
          top: 0,
          width: 158,
          height: 158,
        }}
      >
        <AnalyzingOrbitRing />
      </div>
      {/* 轴心为轨道圆心 (79,79)；整圈时长 = 四段文案总时长 */}
      <div
        style={{
          position: 'absolute',
          left: 7,
          top: 0,
          width: 158,
          height: 158,
          pointerEvents: 'none',
        }}
      >
        <div className="connectnova-orbit-rotator" style={{ position: 'absolute', left: 79, top: 79, width: 0, height: 0 }}>
          <div
            className="connectnova-orbit-counter"
            style={{
              ...badge,
              left: -66,
              top: 36,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              alt=""
              src={ASSET.analyzingJob}
              width={25}
              height={25}
              style={{ display: 'block', width: 25, height: 25, objectFit: 'contain' }}
            />
          </div>
          <div
            className="connectnova-orbit-counter"
            style={{
              ...badge,
              left: 69,
              top: -42,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
              <img
                alt=""
                src={ASSET.analyzingHeart}
                width={24}
                height={24}
                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* 129:16574 中心绿圆不转，盖住轨道中部 */}
      <div
        style={{
          position: 'absolute',
          left: 37,
          top: 29,
          width: 98,
          height: 98,
          borderRadius: '50%',
          backgroundColor: '#b0f809',
          zIndex: 1,
        }}
      />
    </div>
  );
}

/** 句末「...」拆成三颗点 + CSS 错相动效 */
function AnalyzingStatusLineWithDots({ line }: { line: string }) {
  const base = line.endsWith('...') ? line.slice(0, -3) : line;
  return (
    <>
      {base}
      <span className="connectnova-dot-wave" aria-hidden>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </>
  );
}

/** 上传主按钮左侧 +（此处设计即为加号，非删除） */
function UploadPlusIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9 3.5v11M3.5 9h11" stroke="#010214" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightDarkIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="#010214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma 下划线占位（未选领域 / 未选职级时） */
function InlineUnderline() {
  return (
    <div
      style={{
        width: 'min(191px, 40vw)',
        height: 2,
        backgroundColor: '#ccccd0',
        borderRadius: 1,
        flexShrink: 0,
        alignSelf: 'flex-end',
        marginBottom: 2,
      }}
    />
  );
}

/** Figma 126:12712 / 126:12768 / 126:13365 描边胶囊 + 圆形 radio */
function RadioOutlinePill({
  label,
  selected,
  onClick,
  lineHeight = '22px',
  labelColor,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  lineHeight?: string;
  /** 未传则始终 #010214（兼容旧屏）；12768 未选时用 #4d4d4d */
  labelColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...font,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '33px',
        border: '1px solid #ccccd0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: selected ? '2px solid #010214' : '2px solid #A9A9A9',
          backgroundColor: selected ? '#010214' : '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected ? (
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffffff' }} />
        ) : null}
      </span>
      <span
        style={{
          fontSize: 14,
          lineHeight,
          letterSpacing: lineHeight === '22px' ? '-0.28px' : 0,
          color: labelColor ?? '#010214',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function ProgressBars({ count, active }: { count: number; active: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: 48,
            height: 8,
            borderRadius: 12,
            backgroundColor: i < active ? '#b0f809' : '#f7f8f9',
          }}
        />
      ))}
    </div>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function PositionChip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...font,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '9999px',
        backgroundColor: selected ? '#010214' : '#f7f8f9',
        color: selected ? '#ffffff' : '#010214',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
        whiteSpace: 'nowrap',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <span>{label}</span>
      {/* 预留关闭图标宽度，避免选中后胶囊变宽导致其他胶囊位移 */}
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 12,
          height: 12,
          flexShrink: 0,
          color: '#ffffff',
          opacity: selected ? 0.9 : 0,
          pointerEvents: 'none',
        }}
      >
        <ChipRemoveIcon />
      </span>
    </button>
  );
}

export default function ConnectnovaPageDesignMockup() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  /** 步一内渐进：0→12712，1→13312，2→13365，3→13473 邮件，4→13505 摘要 */
  const [step0Phase, setStep0Phase] = useState(0);
  const [emailFrequency, setEmailFrequency] = useState<(typeof EMAIL_FREQUENCY_OPTIONS)[number] | null>(null);
  const [areaOfInterest, setAreaOfInterest] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(() => new Set());
  /** 从领域渐变返回 phase0 再选领域后，勿因已有职位自动进 phase2，须用户再动职位胶囊 */
  const blockAutoPhase2 = useRef(false);

  const [countries, setCountries] = useState<string[]>([]);
  const [workMode, setWorkMode] = useState<'Onsite' | 'Remote'>('Onsite');
  /** 步二渐进：0→12768 工时类型，1→13144，2→13198，3→13260 */
  const [step1Phase, setStep1Phase] = useState(0);
  const [step1EmploymentType, setStep1EmploymentType] = useState<(typeof STEP1_EMPLOYMENT_TYPES)[number] | null>(null);
  const [visaPreference, setVisaPreference] = useState<(typeof VISA_SPONSORSHIP_OPTIONS)[number] | null>(null);

  /** null → 126:13058；有值 → 126:13100 */
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  /** 分析页进度文案当前句索引（逐步切换，末句保持） */
  const [analyzingStatusIdx, setAnalyzingStatusIdx] = useState(0);
  /**
   * 步一选领域后的入场序列：文字落位下划线 → 块上移 → 职位区滑入 → 再 setStep0Phase(1)
   */
  const [step0AreaIntro, setStep0AreaIntro] = useState<'idle' | 'toLine' | 'showPositions'>('idle');
  /** 步一职位后的入场序列：当前块上移 → 职级区滑入 → 再 setStep0Phase(2) */
  const [step0PositionIntro, setStep0PositionIntro] = useState<'idle' | 'showExperience'>('idle');
  /** 步一职级后：toLine 下划线落位 → 直接进入 phase 3 */
  const [step0ExperienceIntro, setStep0ExperienceIntro] = useState<'idle' | 'toLine'>('idle');
  /** 步一邮件后：toLine 下划线落位 → 直接进入 phase 4 */
  const [step0EmailIntro, setStep0EmailIntro] = useState<'idle' | 'toLine'>('idle');
  /** 步二工时后的入场序列：文字落位下划线 → 国家区滑入 → 再 setStep1Phase(1) */
  const [step1EmploymentIntro, setStep1EmploymentIntro] = useState<'idle' | 'toLine' | 'showLocation'>('idle');
  /** 步二签证后：toLine 下划线落位 → 直接进入 phase 3 */
  const [step1VisaIntro, setStep1VisaIntro] = useState<'idle' | 'toLine'>('idle');

  const togglePosition = useCallback((label: string) => {
    blockAutoPhase2.current = false;
    setSelectedPositions((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const selectCareerArea = useCallback((area: string) => {
    if (step0AreaIntro !== 'idle') return;
    if (areaOfInterest === area) return;
    blockAutoPhase2.current = false;
    setAreaOfInterest(area);
    setStep0AreaIntro('toLine');
  }, [step0AreaIntro, areaOfInterest]);

  // 步二：点击角色渐变回到 12768 重选工时
  const goEditStep1Employment = useCallback(() => {
    setStep1EmploymentIntro('idle');
    setStep1Phase(0);
  }, []);

  // 步二：13260 点签证渐变回到 13198 三选一
  const goEditStep1Visa = useCallback(() => {
    setStep1VisaIntro('idle');
    setStep1Phase(2);
  }, []);

  useEffect(() => {
    if (step !== 0) return;
    if (blockAutoPhase2.current) return;
    if (step0Phase === 1 && selectedPositions.size > 0 && step0PositionIntro === 'idle') {
      setStep0PositionIntro('showExperience');
    }
  }, [step, step0Phase, selectedPositions.size, step0PositionIntro]);

  useEffect(() => {
    if (step !== 0 || step0Phase < 2) return;
    if (selectedPositions.size === 0) {
      setStep0PositionIntro('idle');
      setStep0ExperienceIntro('idle');
      setStep0EmailIntro('idle');
      setStep0Phase(1);
      setExperienceLevel(null);
      setEmailFrequency(null);
    }
  }, [step, step0Phase, selectedPositions.size]);

  // 步一：选职位后分段动画，再进入 phase 2
  useEffect(() => {
    if (step !== 0) return;
    if (step0PositionIntro === 'showExperience') {
      const id = window.setTimeout(() => {
        setStep0Phase(2);
        setStep0PositionIntro('idle');
      }, 360);
      return () => window.clearTimeout(id);
    }
  }, [step, step0PositionIntro]);

  // 步一：选职级后 toLine 动效完成，直接进入 phase 3（不再 slab-in 邮件区）
  useEffect(() => {
    if (step !== 0) return;
    if (step0ExperienceIntro === 'toLine') {
      const id = window.setTimeout(() => {
        setStep0Phase(3);
        setStep0ExperienceIntro('idle');
      }, 480);
      return () => window.clearTimeout(id);
    }
  }, [step, step0ExperienceIntro]);

  // 步一：选邮件 toLine 动效完成后直接进入 phase 4（只保留下划线落位动效）
  useEffect(() => {
    if (step !== 0) return;
    if (step0EmailIntro === 'toLine') {
      const id = window.setTimeout(() => {
        setStep0Phase(4);
        setStep0EmailIntro('idle');
      }, 480);
      return () => window.clearTimeout(id);
    }
  }, [step, step0EmailIntro]);

  // 步二：选工时后分段动画，再进入 phase 1
  useEffect(() => {
    if (step !== 1) return;
    if (step1EmploymentIntro === 'toLine') {
      const id = window.setTimeout(() => setStep1EmploymentIntro('showLocation'), 480);
      return () => window.clearTimeout(id);
    }
    if (step1EmploymentIntro === 'showLocation') {
      const id = window.setTimeout(() => {
        setStep1Phase(1);
        setStep1EmploymentIntro('idle');
      }, 360);
      return () => window.clearTimeout(id);
    }
  }, [step, step1EmploymentIntro]);

  // 步二：选签证 toLine 动效完成后直接进入 phase 3（只保留下划线落位动效）
  useEffect(() => {
    if (step !== 1) return;
    if (step1VisaIntro === 'toLine') {
      const id = window.setTimeout(() => {
        setStep1Phase(3);
        setStep1VisaIntro('idle');
      }, 480);
      return () => window.clearTimeout(id);
    }
  }, [step, step1VisaIntro]);

  // 步一：选领域后分段动画，再进入 phase 1
  useEffect(() => {
    if (step !== 0) return;
    if (step0AreaIntro === 'toLine') {
      const id = window.setTimeout(() => setStep0AreaIntro('showPositions'), 480);
      return () => window.clearTimeout(id);
    }
    if (step0AreaIntro === 'showPositions') {
      const id = window.setTimeout(() => {
        setStep0Phase(1);
        setStep0AreaIntro('idle');
      }, 360);
      return () => window.clearTimeout(id);
    }
  }, [step, step0AreaIntro]);

  // 分析页：进度文案按间隔逐步切换，无滚动
  useEffect(() => {
    if (step !== 3) {
      setAnalyzingStatusIdx(0);
      return;
    }
    setAnalyzingStatusIdx(0);
    const id = window.setInterval(() => {
      setAnalyzingStatusIdx((i) => Math.min(i + 1, ANALYZING_STATUS_LINES.length - 1));
    }, ANALYZING_STATUS_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [step]);

  // 点击已填领域渐变：回到领域单选题（不显示欢迎语）；须再点一次职位才会进入职级题
  const goEditStep0Area = useCallback(() => {
    blockAutoPhase2.current = true;
    setEmailFrequency(null);
    setStep0AreaIntro('idle');
    setStep0PositionIntro('idle');
    setStep0ExperienceIntro('idle');
    setStep0EmailIntro('idle');
    setStep0Phase(0);
  }, []);

  const goEditStep0Experience = useCallback(() => {
    setStep0ExperienceIntro('idle');
    setStep0EmailIntro('idle');
    setEmailFrequency(null);
    setStep0Phase(2);
  }, []);

  // 最终摘要页点邮件渐变：回到 Figma 126:13473 单选
  const goEditStep0Email = useCallback(() => {
    setStep0EmailIntro('idle');
    setStep0Phase(3);
  }, []);

  // 最终页点击职位标题：回到职位多选（清空职级与邮件）
  const goEditStep0Positions = useCallback(() => {
    blockAutoPhase2.current = true;
    setExperienceLevel(null);
    setEmailFrequency(null);
    setStep0PositionIntro('idle');
    setStep0ExperienceIntro('idle');
    setStep0EmailIntro('idle');
    setStep0Phase(1);
  }, []);

  const resetWizard = useCallback(() => {
    blockAutoPhase2.current = false;
    setStep(0);
    setStep0Phase(0);
    setStep0AreaIntro('idle');
    setStep0PositionIntro('idle');
    setStep0ExperienceIntro('idle');
    setStep0EmailIntro('idle');
    setEmailFrequency(null);
    setAreaOfInterest(null);
    setExperienceLevel(null);
    setSelectedPositions(new Set());
    setCountries([]);
    setWorkMode('Onsite');
    setStep1Phase(0);
    setStep1EmploymentIntro('idle');
    setStep1VisaIntro('idle');
    setStep1EmploymentType(null);
    setVisaPreference(null);
    setResumeFileName(null);
  }, []);

  const removeCountry = useCallback((c: string) => {
    setCountries((prev) => prev.filter((x) => x !== c));
  }, []);

  const addCountry = useCallback(() => {
    const next = EXTRA_COUNTRIES.find((c) => !countries.includes(c));
    if (next) setCountries((prev) => [...prev, next]);
  }, [countries]);

  // 13144→13198：至少选一国后进入标签行与 Onsite/Remote 高亮态
  useEffect(() => {
    if (step !== 1 || step1Phase !== 1) return;
    if (countries.length >= 1) setStep1Phase(2);
  }, [step, step1Phase, countries.length]);

  // 清空国家则退回 13144，并撤销签证摘要
  useEffect(() => {
    if (step !== 1 || step1Phase < 2) return;
    if (countries.length === 0) {
      setStep1Phase(1);
      setVisaPreference(null);
    }
  }, [step, step1Phase, countries.length]);

  const canNextStep0 =
    step0Phase >= 4 &&
    emailFrequency &&
    areaOfInterest &&
    experienceLevel &&
    selectedPositions.size > 0;

  const canNextStep1 = step1Phase >= 3 && visaPreference !== null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f3f4f5',
        minHeight: 'min(90vh, 820px)',
      }}
    >
      {/* 分析页：轨道旋转 + 进度文案逐步切换 + 句末三点动效 */}
      <style>
        {`
@keyframes connectnova-orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes connectnova-orbit-counter {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}
.connectnova-orbit-rotator {
  transform-origin: 0 0;
  animation: connectnova-orbit-spin ${ANALYZING_ORBIT_PERIOD_MS}ms linear infinite;
}
.connectnova-orbit-counter {
  animation: connectnova-orbit-counter ${ANALYZING_ORBIT_PERIOD_MS}ms linear infinite;
}
@keyframes connectnova-analyzing-status-step {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.connectnova-analyzing-status-step {
  animation: connectnova-analyzing-status-step 0.38s ease-out both;
}
@keyframes connectnova-dot-wave {
  0%,
  100% {
    opacity: 0.2;
    transform: translateY(0);
  }
  35% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
.connectnova-dot-wave span {
  display: inline-block;
  min-width: 0.22em;
  animation: connectnova-dot-wave 0.9s ease-in-out infinite;
}
.connectnova-dot-wave span:nth-child(2) {
  animation-delay: 0.15s;
}
.connectnova-dot-wave span:nth-child(3) {
  animation-delay: 0.3s;
}
/* 步骤切换淡入 */
@keyframes connectnova-step-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.connectnova-step-fade-in {
  animation: connectnova-step-fade-in 0.28s cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .connectnova-orbit-rotator,
  .connectnova-orbit-counter {
    animation: none !important;
  }
  .connectnova-analyzing-status-step {
    animation: none !important;
  }
  .connectnova-dot-wave span {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .connectnova-step0-gradient-slot-in,
  .connectnova-step0-pills-fade,
  .connectnova-step0-cluster-shift,
  .connectnova-step0-positions-slab-in,
  .connectnova-step-fade-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
/* 步一：选领域后文字落位 → 内容上移 → 职位区上滑入 */
@keyframes connectnova-step0-gradient-to-line {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.connectnova-step0-gradient-slot-in {
  display: inline-block;
  animation: connectnova-step0-gradient-to-line 0.48s ease-out both;
}
@keyframes connectnova-step0-pills-hide {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.connectnova-step0-pills-fade {
  animation: connectnova-step0-pills-hide 0.25s ease-out forwards;
  pointer-events: none;
}
/* cluster-shift：上方块已处于最终位置，无需动效 */
.connectnova-step0-cluster-shift {
  /* intentionally empty — elements snap directly to final position */
}
/* slab-in：新区块以全高度立刻进入布局，只做视觉淡入+上移 */
@keyframes connectnova-step0-slab-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.connectnova-step0-positions-slab-in {
  animation: connectnova-step0-slab-up 0.36s cubic-bezier(0.2, 0.8, 0.3, 1) both;
}
        `}
      </style>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <img
          src={ASSET.gradient}
          alt=""
          style={{
            position: 'absolute',
            width: '135%',
            height: '135%',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%, -50%) rotate(-9deg) scaleX(-1)',
            objectFit: 'cover',
            opacity: 0.95,
          }}
        />
      </div>

      <header
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(14px, 3vw, 18px) clamp(20px, 4vw, 32px)',
          minHeight: '64px',
        }}
      >
        <div style={{ position: 'relative', width: 185, height: 40, maxWidth: '45vw' }}>
          <Image src={ASSET.logo} alt="Connectnova" fill sizes="185px" style={{ objectFit: 'contain', objectPosition: 'left' }} />
        </div>
        <button
          type="button"
          onClick={resetWizard}
          style={{
            ...font,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 500,
            color: '#000000',
            letterSpacing: '-0.15px',
            padding: '4px 0',
          }}
        >
          Exit
        </button>
      </header>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(1080px, calc(100% - clamp(24px, 5vw, 48px)))',
          margin: 'clamp(24px, 5vw, 48px) auto clamp(32px, 6vw, 64px)',
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          boxShadow: '0 24px 80px rgba(1, 2, 20, 0.08)',
          padding: 'clamp(28px, 4vw, 36px) clamp(24px, 3vw, 35px)',
          display: 'flex',
          flexDirection: 'column',
          height: 'min(644px, 70vh)',
          minHeight: 'min(644px, 70vh)',
        }}
      >
        <div
          key={step}
          className="connectnova-step-fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '28px',
            flex: 1,
            minHeight: 0,
          }}
        >
        {step === 0 ? (
          <>
            <ProgressBars count={3} active={1} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {step0Phase === 0 ? (
                <>
                  {/* 选领域：渐变字落位下划线 → 整块上移 → 职位区上滑入，再进入 phase1 */}
                  <div
                    className={
                      step0AreaIntro === 'showPositions'
                        ? 'connectnova-step0-cluster-shift'
                        : undefined
                    }
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 0', width: '100%' }}>
                      <p
                        style={{
                          ...font,
                          margin: 0,
                          fontSize: '24px',
                          fontWeight: 500,
                          lineHeight: '28px',
                          color: '#1f2937',
                        }}
                      >
                        Welcome !
                        <br />
                        Please share your career goal to begin
                      </p>
                      <p
                        style={{
                          ...font,
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          color: 'rgba(14, 16, 17, 0.6)',
                        }}
                      >
                        You can always change this later
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                      <div
                        style={{
                          ...font,
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'flex-end',
                          gap: '8px',
                          lineHeight: '20px',
                          width: '100%',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#000',
                            letterSpacing: '-0.32px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          I am interested in the area of{' '}
                        </span>
                        {!areaOfInterest ? (
                          <InlineUnderline />
                        ) : step0AreaIntro !== 'idle' ? (
                          <span
                            className={step0AreaIntro === 'toLine' ? 'connectnova-step0-gradient-slot-in' : undefined}
                            style={{
                              ...gradientLinkStyle,
                              cursor: 'default',
                            }}
                          >
                            {areaOfInterest}
                          </span>
                        ) : (
                          <InlineUnderline />
                        )}
                      </div>
                      {!areaOfInterest ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                          {CAREER_AREAS.map((a) => (
                            <RadioOutlinePill
                              key={a}
                              label={a}
                              selected={areaOfInterest === a}
                              onClick={() => selectCareerArea(a)}
                            />
                          ))}
                        </div>
                      ) : step0AreaIntro === 'toLine' ? (
                        <div
                          className="connectnova-step0-pills-fade"
                          style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}
                        >
                          {CAREER_AREAS.map((a) => (
                            <RadioOutlinePill
                              key={a}
                              label={a}
                              selected={areaOfInterest === a}
                              onClick={() => selectCareerArea(a)}
                            />
                          ))}
                        </div>
                      ) : step0AreaIntro === 'idle' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                          {CAREER_AREAS.map((a) => (
                            <RadioOutlinePill
                              key={a}
                              label={a}
                              selected={areaOfInterest === a}
                              onClick={() => selectCareerArea(a)}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {step0AreaIntro === 'showPositions' ? (
                    <div
                      className="connectnova-step0-positions-slab-in"
                      style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
                    >
                      <p
                        style={{
                          ...font,
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#000',
                          letterSpacing: '-0.32px',
                          lineHeight: '20px',
                        }}
                      >
                        I am looking for the position of
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center' }}>
                        {POSITION_OPTIONS.map((label) => (
                          <PositionChip
                            key={label}
                            label={label}
                            selected={selectedPositions.has(label)}
                            onClick={() => togglePosition(label)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              {step0Phase >= 1 && areaOfInterest ? (
                <div
                  className={
                    step0PositionIntro === 'showExperience'
                      ? 'connectnova-step0-cluster-shift'
                      : undefined
                  }
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
                >
                  <div
                    style={{
                      ...font,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-end',
                      gap: '8px',
                      lineHeight: '20px',
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px', whiteSpace: 'nowrap' }}>
                      I am interested in the area of{' '}
                    </span>
                    <button
                      type="button"
                      onClick={goEditStep0Area}
                      aria-label="Change career area"
                      style={{
                        ...gradientLinkStyle,
                        cursor: 'pointer',
                      }}
                    >
                      {areaOfInterest}
                    </button>
                  </div>
                </div>
              ) : null}

              {step0Phase >= 1 ? (
                <div
                  className={
                    step0PositionIntro === 'showExperience'
                      ? 'connectnova-step0-cluster-shift'
                      : undefined
                  }
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
                >
                  {step0Phase >= 4 ? (
                    <button
                      type="button"
                      onClick={goEditStep0Positions}
                      aria-label="Change positions"
                      style={{
                        ...font,
                        margin: 0,
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#000',
                        letterSpacing: '-0.32px',
                        lineHeight: '20px',
                        textAlign: 'left',
                      }}
                    >
                      I am looking for the position of
                    </button>
                  ) : (
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#000',
                        letterSpacing: '-0.32px',
                        lineHeight: '20px',
                      }}
                    >
                      I am looking for the position of
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center' }}>
                    {POSITION_OPTIONS.map((label) => (
                      <PositionChip
                        key={label}
                        label={label}
                        selected={selectedPositions.has(label)}
                        onClick={() => togglePosition(label)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {step0Phase >= 2 || step0PositionIntro === 'showExperience' ? (
                <div
                  className={
                    step0PositionIntro === 'showExperience'
                      ? 'connectnova-step0-positions-slab-in'
                      : undefined
                  }
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
                >
                  {step0Phase === 2 || step0PositionIntro === 'showExperience' ? (
                    <>
                      <div
                        style={{
                          ...font,
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'flex-end',
                          gap: '8px',
                          lineHeight: '20px',
                          width: '100%',
                        }}
                      >
                        <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px', whiteSpace: 'nowrap' }}>
                          I am targeting to the{' '}
                        </span>
                        {!experienceLevel ? (
                          <InlineUnderline />
                        ) : step0ExperienceIntro !== 'idle' ? (
                          <span
                            className={step0ExperienceIntro === 'toLine' ? 'connectnova-step0-gradient-slot-in' : undefined}
                            style={{
                              ...gradientLinkStyle,
                              backgroundImage: 'linear-gradient(110deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                              cursor: 'default',
                            }}
                          >
                            {experienceLevel}
                          </span>
                        ) : (
                          <InlineUnderline />
                        )}
                      </div>
                      {!experienceLevel ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <RadioOutlinePill
                              key={opt}
                              label={opt}
                              selected={experienceLevel === opt}
                              lineHeight="20px"
                              onClick={() => {
                                setExperienceLevel(opt);
                                setEmailFrequency(null);
                                setStep0ExperienceIntro('toLine');
                              }}
                            />
                          ))}
                        </div>
                      ) : step0ExperienceIntro === 'toLine' ? (
                        <div
                          className="connectnova-step0-pills-fade"
                          style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}
                        >
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <RadioOutlinePill
                              key={opt}
                              label={opt}
                              selected={experienceLevel === opt}
                              lineHeight="20px"
                              onClick={() => {
                                setExperienceLevel(opt);
                                setEmailFrequency(null);
                                setStep0ExperienceIntro('toLine');
                              }}
                            />
                          ))}
                        </div>
                      ) : step0ExperienceIntro === 'idle' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <RadioOutlinePill
                              key={opt}
                              label={opt}
                              selected={experienceLevel === opt}
                              lineHeight="20px"
                              onClick={() => {
                                setExperienceLevel(opt);
                                setEmailFrequency(null);
                                setStep0ExperienceIntro('toLine');
                              }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div
                      style={{
                        ...font,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        gap: '8px',
                        lineHeight: '20px',
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px', whiteSpace: 'nowrap' }}>
                        I am targeting to the{' '}
                      </span>
                      <button
                        type="button"
                        onClick={goEditStep0Experience}
                        aria-label="Change experience level"
                        style={{
                          ...gradientLinkStyle,
                          backgroundImage: 'linear-gradient(110deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                          cursor: 'pointer',
                        }}
                      >
                        {experienceLevel}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {step0Phase >= 3 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  {step0Phase === 3 ? (
                    <>
                      <div
                        style={{
                          ...font,
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'flex-end',
                          gap: '8px',
                          lineHeight: '20px',
                          width: '100%',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#000',
                            letterSpacing: '-0.32px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          I would like to receive emails from Connectnova.ai
                        </span>
                        {!emailFrequency ? (
                          <InlineUnderline />
                        ) : step0EmailIntro !== 'idle' ? (
                          <span
                            className={step0EmailIntro === 'toLine' ? 'connectnova-step0-gradient-slot-in' : undefined}
                            style={{
                              ...gradientLinkStyle,
                              backgroundImage: 'linear-gradient(103deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                              cursor: 'default',
                            }}
                          >
                            {emailFrequency}
                          </span>
                        ) : (
                          <InlineUnderline />
                        )}
                      </div>
                      {!emailFrequency ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                          {EMAIL_FREQUENCY_OPTIONS.map((opt) => (
                            <RadioOutlinePill
                              key={opt}
                              label={opt}
                              selected={emailFrequency === opt}
                              lineHeight="20px"
                              onClick={() => {
                                setEmailFrequency(opt);
                                setStep0EmailIntro('toLine');
                              }}
                            />
                          ))}
                        </div>
                      ) : step0EmailIntro === 'toLine' ? (
                        <div
                          className="connectnova-step0-pills-fade"
                          style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}
                        >
                          {EMAIL_FREQUENCY_OPTIONS.map((opt) => (
                            <RadioOutlinePill
                              key={opt}
                              label={opt}
                              selected={emailFrequency === opt}
                              lineHeight="20px"
                              onClick={() => {
                                setEmailFrequency(opt);
                                setStep0EmailIntro('toLine');
                              }}
                            />
                          ))}
                        </div>
                      ) : step0EmailIntro === 'idle' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                          {EMAIL_FREQUENCY_OPTIONS.map((opt) => (
                            <RadioOutlinePill
                              key={opt}
                              label={opt}
                              selected={emailFrequency === opt}
                              lineHeight="20px"
                              onClick={() => {
                                setEmailFrequency(opt);
                                setStep0EmailIntro('toLine');
                              }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div
                      style={{
                        ...font,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        gap: '8px',
                        lineHeight: '20px',
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px' }}>
                        I would like to receive emails from Connectnova.ai{' '}
                      </span>
                      {emailFrequency ? (
                        <button
                          type="button"
                          onClick={goEditStep0Email}
                          aria-label="Change email frequency"
                          style={{
                            ...gradientLinkStyle,
                            backgroundImage: 'linear-gradient(103deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                            cursor: 'pointer',
                          }}
                        >
                          {emailFrequency}
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <button
                type="button"
                disabled={!canNextStep0}
                onClick={() => {
                  setStep1Phase(0);
                  setStep1EmploymentIntro('idle');
                  setStep1VisaIntro('idle');
                  setStep1EmploymentType(null);
                  setVisaPreference(null);
                  setCountries([]);
                  setWorkMode('Onsite');
                  setStep(1);
                }}
                style={{
                  ...font,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  borderRadius: '9999px',
                  backgroundColor: canNextStep0 ? '#010214' : '#ccccd0',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  letterSpacing: '0.3px',
                  border: 'none',
                  cursor: canNextStep0 ? 'pointer' : 'not-allowed',
                }}
              >
                Next
                <span style={{ display: 'inline-flex', width: 24, height: 24, flexShrink: 0 }}>
                  <img
                    src={ASSET.arrowNext}
                    alt=""
                    width={24}
                    height={24}
                    style={{ display: 'block', transform: 'scaleX(-1)' }}
                  />
                </span>
              </button>
            </div>
          </>
        ) : step === 1 ? (
          <>
            <ProgressBars count={3} active={2} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {step1Phase === 0 ? (
                <div
                  className={
                    step1EmploymentIntro === 'showLocation'
                      ? 'connectnova-step0-cluster-shift'
                      : undefined
                  }
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
                >
                  {/* Figma 126:12768 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 0', width: '100%' }}>
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 500,
                        lineHeight: '28px',
                        color: '#1f2937',
                      }}
                    >
                      What are you looking for in your next role?
                    </p>
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: 'rgba(14, 16, 17, 0.6)',
                      }}
                    >
                      You can always change this later
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <div
                      style={{
                        ...font,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        gap: '8px',
                        lineHeight: '20px',
                        width: '100%',
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px', whiteSpace: 'nowrap' }}>
                        I am looking for a role that is{' '}
                      </span>
                      {!step1EmploymentType ? (
                        <InlineUnderline />
                      ) : step1EmploymentIntro !== 'idle' ? (
                        <span
                          className={step1EmploymentIntro === 'toLine' ? 'connectnova-step0-gradient-slot-in' : undefined}
                          style={{
                            ...gradientLinkStyle,
                            backgroundImage: 'linear-gradient(103deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                            cursor: 'default',
                          }}
                        >
                          {STEP1_EMPLOYMENT_GRADIENT_LABEL[step1EmploymentType]}
                        </span>
                      ) : (
                        <InlineUnderline />
                      )}
                    </div>
                    {!step1EmploymentType ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                        {STEP1_EMPLOYMENT_TYPES.map((t) => (
                          <RadioOutlinePill
                            key={t}
                            label={t}
                            selected={step1EmploymentType === t}
                            lineHeight="22px"
                            labelColor={step1EmploymentType === t ? '#010214' : '#4d4d4d'}
                            onClick={() => {
                              setStep1EmploymentType(t);
                              setStep1EmploymentIntro('toLine');
                            }}
                          />
                        ))}
                      </div>
                    ) : step1EmploymentIntro === 'toLine' ? (
                      <div
                        className="connectnova-step0-pills-fade"
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}
                      >
                        {STEP1_EMPLOYMENT_TYPES.map((t) => (
                          <RadioOutlinePill
                            key={t}
                            label={t}
                            selected={step1EmploymentType === t}
                            lineHeight="22px"
                            labelColor={step1EmploymentType === t ? '#010214' : '#4d4d4d'}
                            onClick={() => {
                              setStep1EmploymentType(t);
                              setStep1EmploymentIntro('toLine');
                            }}
                          />
                        ))}
                      </div>
                    ) : step1EmploymentIntro === 'idle' ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                        {STEP1_EMPLOYMENT_TYPES.map((t) => (
                          <RadioOutlinePill
                            key={t}
                            label={t}
                            selected={step1EmploymentType === t}
                            lineHeight="22px"
                            labelColor={step1EmploymentType === t ? '#010214' : '#4d4d4d'}
                            onClick={() => {
                              setStep1EmploymentType(t);
                              setStep1EmploymentIntro('toLine');
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {(step1Phase >= 1 || step1EmploymentIntro === 'showLocation') && step1EmploymentType ? (
                <div
                  className={step1EmploymentIntro === 'showLocation' ? 'connectnova-step0-positions-slab-in' : undefined}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
                >
                  <div style={{ ...font, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '8px', lineHeight: '20px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px' }}>
                      I am looking for a role that is{' '}
                    </span>
                    <button
                      type="button"
                      onClick={goEditStep1Employment}
                      aria-label="Change employment type"
                      style={{
                        ...gradientLinkStyle,
                        backgroundImage: 'linear-gradient(103deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                        cursor: 'pointer',
                      }}
                    >
                      {STEP1_EMPLOYMENT_GRADIENT_LABEL[step1EmploymentType]}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#000',
                        letterSpacing: '-0.32px',
                        lineHeight: '20px',
                      }}
                    >
                      I would like to work in
                    </p>
                    {step1Phase === 1 || step1EmploymentIntro === 'showLocation' ? (
                      <div style={{ maxWidth: '100%' }}>
                        <button
                          type="button"
                          onClick={addCountry}
                          style={{
                            ...font,
                            width: 'min(360px, 100%)',
                            minHeight: 40,
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            padding: '0 16px',
                            border: '1px solid #ccccd0',
                            borderRadius: 33,
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: '14px', color: '#b1aeae', letterSpacing: '-0.28px' }}>
                            Select one or more countries/regions
                          </span>
                          <span style={{ display: 'inline-flex', flexShrink: 0 }}>
                            <ChevronDownIcon />
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '8px',
                          border: '1px solid #ccccd0',
                          borderRadius: '33px',
                          padding: '8px',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {countries.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => removeCountry(c)}
                            style={{
                              ...font,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '8px',
                              borderRadius: '9999px',
                              border: '1px solid #ccccd0',
                              backgroundColor: '#ffffff',
                              color: '#010214',
                              fontSize: '12px',
                              fontWeight: 400,
                              lineHeight: 1.3,
                              letterSpacing: '-0.24px',
                              cursor: 'pointer',
                            }}
                          >
                            {c}
                            <span style={{ display: 'inline-flex', pointerEvents: 'none' }}>
                              <ChipRemoveIconMuted />
                            </span>
                          </button>
                        ))}
                        <span style={{ ...font, fontSize: '14px', color: '#b1aeae', flex: '1 1 auto', minWidth: '120px' }}>
                          Select one or more countries
                        </span>
                        <button
                          type="button"
                          onClick={addCountry}
                          aria-label="Add country"
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: 4,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            flexShrink: 0,
                          }}
                        >
                          <ChevronDownIcon />
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          ...font,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '9999px',
                          backgroundColor:
                            step1Phase === 1 || step1EmploymentIntro === 'showLocation'
                              ? '#f7f8f9'
                              : workMode === 'Onsite'
                                ? '#010214'
                                : '#f7f8f9',
                          color:
                            step1Phase === 1 || step1EmploymentIntro === 'showLocation'
                              ? '#4d4d4d'
                              : workMode === 'Onsite'
                                ? '#ffffff'
                                : '#4d4d4d',
                          fontSize: '14px',
                          lineHeight: '22px',
                          letterSpacing: '-0.28px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setWorkMode('Onsite')}
                          style={{
                            ...font,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: 'inherit',
                            fontSize: '14px',
                            lineHeight: '22px',
                            letterSpacing: '-0.28px',
                          }}
                        >
                          Onsite
                        </button>
                        {step1Phase >= 2 && workMode === 'Onsite' ? (
                          <button
                            type="button"
                            aria-label="Switch to remote"
                            onClick={() => setWorkMode('Remote')}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'inline-flex',
                              color: '#ffffff',
                            }}
                          >
                            <ChipRemoveIcon />
                          </button>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setWorkMode('Remote')}
                        style={{
                          ...font,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 12px',
                          borderRadius: '9999px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor:
                            step1Phase === 1 || step1EmploymentIntro === 'showLocation'
                              ? '#f7f8f9'
                              : workMode === 'Remote'
                                ? '#010214'
                                : '#f7f8f9',
                          color:
                            step1Phase === 1 || step1EmploymentIntro === 'showLocation'
                              ? '#4d4d4d'
                              : workMode === 'Remote'
                                ? '#ffffff'
                                : '#4d4d4d',
                          fontSize: '14px',
                          lineHeight: '22px',
                          letterSpacing: '-0.28px',
                        }}
                      >
                        Remote
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {step1Phase === 2 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                  <div
                    style={{
                      ...font,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-end',
                      gap: '8px',
                      lineHeight: '20px',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#000',
                        letterSpacing: '-0.32px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      I am looking for opportunities that{' '}
                    </span>
                    {!visaPreference ? (
                      <InlineUnderline />
                    ) : step1VisaIntro !== 'idle' ? (
                      <span
                        className={step1VisaIntro === 'toLine' ? 'connectnova-step0-gradient-slot-in' : undefined}
                        style={{
                          ...gradientLinkStyle,
                          backgroundImage: 'linear-gradient(112deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                          cursor: 'default',
                        }}
                      >
                        {visaPreference}
                      </span>
                    ) : (
                      <InlineUnderline />
                    )}
                  </div>
                  {!visaPreference ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                      {VISA_SPONSORSHIP_OPTIONS.map((opt) => (
                        <RadioOutlinePill
                          key={opt}
                          label={opt}
                          selected={visaPreference === opt}
                          lineHeight="22px"
                          onClick={() => {
                            setVisaPreference(opt);
                            setStep1VisaIntro('toLine');
                          }}
                        />
                      ))}
                    </div>
                  ) : step1VisaIntro === 'toLine' ? (
                    <div
                      className="connectnova-step0-pills-fade"
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}
                    >
                      {VISA_SPONSORSHIP_OPTIONS.map((opt) => (
                        <RadioOutlinePill
                          key={opt}
                          label={opt}
                          selected={visaPreference === opt}
                          lineHeight="22px"
                          onClick={() => {
                            setVisaPreference(opt);
                            setStep1VisaIntro('toLine');
                          }}
                        />
                      ))}
                    </div>
                  ) : step1VisaIntro === 'idle' ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center', minHeight: 40 }}>
                      {VISA_SPONSORSHIP_OPTIONS.map((opt) => (
                        <RadioOutlinePill
                          key={opt}
                          label={opt}
                          selected={visaPreference === opt}
                          lineHeight="22px"
                          onClick={() => {
                            setVisaPreference(opt);
                            setStep1VisaIntro('toLine');
                          }}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step1Phase >= 3 && visaPreference ? (
                <div
                  style={{
                    ...font,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                    gap: '8px',
                    lineHeight: '20px',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#000', letterSpacing: '-0.32px' }}>
                    I am looking for opportunities that{' '}
                  </span>
                  <button
                    type="button"
                    onClick={goEditStep1Visa}
                    aria-label="Change visa preference"
                    style={{
                      ...gradientLinkStyle,
                      backgroundImage: 'linear-gradient(112deg, rgb(167, 237, 3) 7.76%, rgb(208, 235, 5) 98.83%)',
                      cursor: 'pointer',
                    }}
                  >
                    {visaPreference}
                  </button>
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setStep1Phase(0);
                  setStep1EmploymentIntro('idle');
                  setStep1VisaIntro('idle');
                  setStep1EmploymentType(null);
                  setVisaPreference(null);
                  setCountries([]);
                }}
                aria-label="Back"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 24px',
                  borderRadius: '9999px',
                  border: '1px solid #010214',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <ArrowBackIcon />
              </button>
              <button
                type="button"
                disabled={!canNextStep1}
                onClick={() => setStep(2)}
                style={{
                  ...font,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  borderRadius: '9999px',
                  backgroundColor: canNextStep1 ? '#010214' : '#ccccd0',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  letterSpacing: '0.3px',
                  border: 'none',
                  cursor: canNextStep1 ? 'pointer' : 'not-allowed',
                }}
              >
                Next
                <span style={{ display: 'inline-flex', width: 24, height: 24, flexShrink: 0 }}>
                  <img
                    src={ASSET.arrowNext}
                    alt=""
                    width={24}
                    height={24}
                    style={{ display: 'block', transform: 'scaleX(-1)' }}
                  />
                </span>
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <ProgressBars count={3} active={3} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                alignItems: 'center',
                width: '100%',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              {/* 两屏共用标题区：Figma 126:13059 / 126:13101 */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '4px 0',
                  alignItems: 'flex-start',
                }}
              >
                <p
                  style={{
                    ...font,
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 500,
                    lineHeight: '28px',
                    color: '#1f2937',
                  }}
                >
                  Upload your resume to start your journey.
                </p>
                <p
                  style={{
                    ...font,
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: 'rgba(14, 16, 17, 0.6)',
                  }}
                >
                  You can always change this later
                </p>
              </div>

              {!resumeFileName ? (
                <>
                  {/* Figma 126:13058：插图 + 说明与主按钮 */}
                  <ResumeUploadIllustration />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#41414f',
                        textAlign: 'center',
                      }}
                    >
                      Supported Format: PDF, Word, Maximum Size: 25MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setResumeFileName(MOCK_RESUME_DISPLAY_NAME)}
                      style={{
                        ...font,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px 24px',
                        borderRadius: '9999px',
                        backgroundColor: '#b0f809',
                        color: '#010214',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <UploadPlusIcon />
                      Click to Upload
                      <ArrowRightDarkIcon />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Figma 126:13100：插图 + 文件名 + 说明 + Upload new resume */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
                    <ResumeUploadIllustration />
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        color: '#282828',
                        textAlign: 'center',
                        wordBreak: 'break-all',
                        maxWidth: '100%',
                      }}
                    >
                      {resumeFileName}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
                    <p
                      style={{
                        ...font,
                        margin: 0,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#41414f',
                        textAlign: 'center',
                      }}
                    >
                      Supported Format: PDF, Word, Maximum Size: 25MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setResumeFileName(MOCK_RESUME_DISPLAY_NAME)}
                      style={{
                        ...font,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px 24px',
                        borderRadius: '9999px',
                        backgroundColor: '#b0f809',
                        color: '#010214',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <UploadPlusIcon />
                      Upload new resume
                      <ArrowRightDarkIcon />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button
                type="button"
                onClick={() => {
                  setResumeFileName(null);
                  setStep(1);
                }}
                aria-label="Back"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 24px',
                  borderRadius: '9999px',
                  border: '1px solid #010214',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <ArrowBackIcon />
              </button>
              {resumeFileName ? (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    ...font,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    borderRadius: '9999px',
                    backgroundColor: '#010214',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    letterSpacing: '0.3px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Start Exploring
                  <span style={{ display: 'inline-flex', width: 24, height: 24, flexShrink: 0 }}>
                    <img
                      src={ASSET.arrowNext}
                      alt=""
                      width={24}
                      height={24}
                      style={{ display: 'block', transform: 'scaleX(-1)' }}
                    />
                  </span>
                </button>
              ) : (
                /* Figma：未上传时 Next 隐藏，占位与步二底栏对齐 */
                <div
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 24px',
                    borderRadius: '9999px',
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ ...font, fontSize: '16px', fontWeight: 500 }}>Next</span>
                  <span style={{ width: 24, height: 24 }} />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Figma 129:16518：简历分析中（三步进度全满） */}
            <ProgressBars count={3} active={3} />
            <div
              style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 'clamp(32px, 12vh, 149px)',
                paddingBottom: 24,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 24,
                  width: '100%',
                }}
              >
                <ResumeAnalyzingHero />
                <div
                  style={{
                    maxWidth: 706,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    padding: '4px 0',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      ...font,
                      margin: 0,
                      fontSize: 32,
                      fontWeight: 500,
                      lineHeight: '40px',
                      color: '#1f2937',
                      width: '100%',
                    }}
                  >
                    Nova is getting to know you
                  </p>
                  <p
                    style={{
                      ...font,
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: 'rgba(14, 16, 17, 0.6)',
                      width: '100%',
                    }}
                  >
                    Analysing your resume, mapping your skills, and finding your first matches. This takes about 30 seconds.
                  </p>
                  <p
                    key={analyzingStatusIdx}
                    className="connectnova-analyzing-status-step"
                    aria-live="polite"
                    style={{
                      ...font,
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: '#010214',
                      width: '100%',
                    }}
                  >
                    <AnalyzingStatusLineWithDots line={ANALYZING_STATUS_LINES[analyzingStatusIdx]} />
                  </p>
                </div>
              </div>
            </div>
            {/* 与前几步底栏高度对齐 */}
            <div style={{ minHeight: 52, width: '100%' }} aria-hidden />
          </>
        )}
        </div>
      </div>
    </div>
  );
}
