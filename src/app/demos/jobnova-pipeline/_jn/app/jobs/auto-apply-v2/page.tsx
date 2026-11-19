'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import { CalendarDays, Columns3, ChevronLeft, ChevronRight, Clock3, UserCheck, Zap, Sparkles, AlarmClock, Calendar, ChessQueen, CircleDollarSign, Check, Heart, HouseWifi, Link2, MapPin, Search, ArrowUp, ArrowDown } from 'lucide-react'
import JnSidebarV2, { readCollapsed, saveCollapsed } from '../../../components/jobs/v2/JnSidebarV2'
import InboxView from '../auto-apply/InboxView'
import AppDetailDrawer, { type DetailItem } from './AppDetailDrawer'
import ProcessDrawer from './ProcessDrawer'
import AutoApplyPanel from '../../../components/jobs/AutoApplyPanel'
import CalendarView, { EVENTS } from './CalendarView'
import { STEPS, startStep, FAILURES, type Failure } from './process'
import { BRAND_LOGOS } from '../../../components/jobs/brandLogos'
import '../jobs-shell.css'
import '../../../components/jobs/jobcard.css'
import '../auto-apply/auto-apply.css'
import './auto-apply-v2.css'

// The whole journey, not only Auto Apply's part: after submission, replies move an application on
type Status = 'queued' | 'process' | 'failed' | 'submitted' | 'interview' | 'offer' | 'closed'

type Item = {
  id: number; status: Status; match: number; posted: string; applicants: number; title: string; company: string
  industry: string; location: string; type: string; mode: string; level: string; exp?: string; salary: string
  date: string; saved?: boolean; perks: string[]; logo?: string
  /** For employer stages: what happened last, and when */
  event?: string
  /** Just moved into its column */
  fresh?: boolean
}

const ITEMS: Item[] = [
  { id: 1, status: 'offer', match: 93, posted: '1 hours ago', applicants: 25, title: 'Founding Product Designer', company: 'Accenture', industry: 'Artificial Intelligence (AI) • Enterprise Software • Public Company', location: 'Farmington Hills, MI', type: 'Full time', mode: 'Hybrid', level: 'Mid, Senior Level', exp: '5+ years exp', salary: '$65/yr - $70/yr', date: 'Nov 26, 2025', perks: ['No H1B', 'Work & Life Balance'], logo: undefined, event: 'Offer received · reply by Dec 3' },
  { id: 2, status: 'interview', match: 84, posted: '4 hours ago', applicants: 112, title: 'User Experience Designer', company: 'Cursor AI', industry: 'Automotive • Big Data • Growth Stage', location: 'Nashville, TN', type: 'Full time', mode: 'Remote', level: 'Mid Level', salary: '$112K/yr - $152K/yr', date: 'Nov 26, 2025', saved: true, perks: ['H1B Sponsor Likely'], event: 'Interview invite · reply needed' },
  { id: 3, status: 'submitted', match: 64, posted: '4 hours ago', applicants: 112, title: 'User Experience Designer', company: 'Backd Business Funding', industry: 'Automotive • Big Data • Growth Stage', location: 'Nashville, TN', type: 'Full time', mode: 'Remote', level: 'Mid Level', salary: '$65/yr - $70/yr', date: 'Nov 26, 2025', saved: true, perks: ['H1B Sponsor Likely'] },
  { id: 4, status: 'process', match: 88, posted: '2 hours ago', applicants: 41, title: 'Senior Frontend Engineer', company: 'Vercel', industry: 'Developer Tools • Cloud • Growth Stage', location: 'Remote, US', type: 'Full time', mode: 'Remote', level: 'Senior Level', exp: '5+ years exp', salary: '$140K/yr - $180K/yr', date: 'Today', perks: ['H1B Sponsor Likely'] },
  { id: 5, status: 'process', match: 72, posted: '3 hours ago', applicants: 64, title: 'Product Designer', company: 'Figma', industry: 'Design Tools • SaaS • Public Company', location: 'New York, NY', type: 'Full time', mode: 'Hybrid', level: 'Mid Level', salary: '$120K/yr - $150K/yr', date: 'Today', perks: ['No H1B'] },
  { id: 6, status: 'queued', match: 91, posted: '30 minutes ago', applicants: 12, title: 'AI Product Designer', company: 'Anthropic', industry: 'AI Research • Safety • Late Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'Remote', level: 'Senior Level', exp: '4+ years exp', salary: '$160K/yr - $200K/yr', date: '#3 in queue', saved: true, perks: ['H1B Sponsor Likely', 'Work & Life Balance'] },
  { id: 7, status: 'queued', match: 58, posted: '5 hours ago', applicants: 98, title: 'Design Systems Lead', company: 'Stripe', industry: 'Fintech • Payments • Late Stage', location: 'Seattle, WA', type: 'Full time', mode: 'Remote', level: 'Lead', salary: '$170K/yr - $210K/yr', date: '#7 in queue', perks: ['H1B Sponsor Likely'] },
  { id: 8, status: 'failed', match: 47, posted: '6 hours ago', applicants: 204, title: 'UX Researcher', company: 'Railway', industry: 'Infrastructure • Cloud • Seed', location: 'Austin, TX', type: 'Contract', mode: 'Hybrid', level: 'Mid Level', salary: '$55/hr - $70/hr', date: 'Nov 26, 2025', perks: ['No H1B'] },
  { id: 9, status: 'closed', match: 76, posted: '8 hours ago', applicants: 31, title: 'Brand Designer', company: 'Notion', industry: 'Productivity • SaaS • Growth Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'Hybrid', level: 'Senior Level', salary: '$150K/yr - $190K/yr', date: 'Nov 25, 2025', perks: ['H1B Sponsor Likely'], event: 'Rejected · Nov 23' },
  { id: 10, status: 'interview', match: 95, posted: '2 hours ago', applicants: 18, title: 'Design Engineer', company: 'Cursor AI', industry: 'AI Tools • Developer Tools • Growth Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'Hybrid', level: 'Senior Level', exp: '4+ years exp', salary: '$165K/yr - $205K/yr', date: 'Nov 25, 2025', saved: true, perks: ['H1B Sponsor Likely', 'Work & Life Balance'], event: 'Interview · Tue 10:00 AM PT' },
  { id: 11, status: 'interview', match: 81, posted: '5 hours ago', applicants: 57, title: 'Staff Product Designer', company: 'Linear', industry: 'Project Management • SaaS • Growth Stage', location: 'Remote, Global', type: 'Full time', mode: 'Remote', level: 'Staff Level', exp: '8+ years exp', salary: '$190K/yr - $240K/yr', date: 'Nov 25, 2025', perks: ['No H1B'], event: 'Portfolio review · Thu 2:00 PM' },
  { id: 12, status: 'closed', match: 69, posted: '9 hours ago', applicants: 143, title: 'Interaction Designer', company: 'Google', industry: 'Search • Cloud • Public Company', location: 'Mountain View, CA', type: 'Full time', mode: 'On-site', level: 'Mid Level', exp: '4+ years exp', salary: '$135K/yr - $175K/yr', date: 'Nov 24, 2025', perks: ['H1B Sponsor Likely'], event: 'Rejected · Nov 25' },
  { id: 13, status: 'closed', match: 52, posted: '1 day ago', applicants: 221, title: 'Graphic Designer', company: 'Backd Business Funding', industry: 'Fintech • Lending • Seed', location: 'Milan, Lombardy, Italy', type: 'Part time', mode: 'On-site', level: 'Entry Level', exp: '1+ years exp', salary: '$28K/yr - $36K/yr', date: 'Nov 24, 2025', perks: ['No H1B'], event: 'Archived by you · Nov 26' },
  { id: 14, status: 'submitted', match: 87, posted: '1 day ago', applicants: 36, title: 'Platform Designer', company: 'Vercel', industry: 'Developer Tools • Cloud • Growth Stage', location: 'Remote, EU', type: 'Full time', mode: 'Remote', level: 'Senior Level', exp: '5+ years exp', salary: '$140K/yr - $175K/yr', date: 'Nov 23, 2025', saved: true, perks: ['H1B Sponsor Likely'] },
  { id: 15, status: 'process', match: 79, posted: '1 hour ago', applicants: 29, title: 'Growth Designer', company: 'Stripe', industry: 'Fintech • Payments • Late Stage', location: 'Remote, US', type: 'Full time', mode: 'Remote', level: 'Senior Level', exp: '5+ years exp', salary: '$145K/yr - $185K/yr', date: 'Today', perks: ['H1B Sponsor Likely'] },
  { id: 16, status: 'process', match: 61, posted: '2 hours ago', applicants: 102, title: 'Visual Designer', company: 'Notion', industry: 'Productivity • SaaS • Growth Stage', location: 'New York, NY', type: 'Full time', mode: 'On-site', level: 'Entry–Mid Level', exp: '2+ years exp', salary: '$95K/yr - $120K/yr', date: 'Today', perks: ['No H1B'] },
  { id: 17, status: 'process', match: 90, posted: '3 hours ago', applicants: 15, title: 'Staff Frontend Engineer', company: 'Linear', industry: 'Project Management • SaaS • Growth Stage', location: 'Remote, US', type: 'Full time', mode: 'Remote', level: 'Staff Level', exp: '8+ years exp', salary: '$200K/yr - $250K/yr', date: 'Today', saved: true, perks: ['H1B Sponsor Likely', 'Work & Life Balance'] },
  { id: 18, status: 'process', match: 44, posted: '4 hours ago', applicants: 187, title: 'UX Writer', company: 'Figma', industry: 'Design Tools • SaaS • Public Company', location: 'San Francisco, CA', type: 'Contract', mode: 'Hybrid', level: 'Mid Level', exp: '3+ years exp', salary: '$60/hr - $80/hr', date: 'Today', perks: ['No H1B'] },
  { id: 19, status: 'queued', match: 86, posted: '1 hour ago', applicants: 33, title: 'Senior Product Designer', company: 'Notion', industry: 'Productivity • SaaS • Growth Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'Hybrid', level: 'Senior Level', exp: '5+ years exp', salary: '$150K/yr - $190K/yr', date: '#2 in queue', saved: true, perks: ['H1B Sponsor Likely'] },
  { id: 20, status: 'queued', match: 73, posted: '2 hours ago', applicants: 71, title: 'Frontend Engineer', company: 'Vercel', industry: 'Developer Tools • Cloud • Growth Stage', location: 'Remote, US', type: 'Full time', mode: 'Remote', level: 'Mid Level', exp: '3+ years exp', salary: '$130K/yr - $165K/yr', date: '#4 in queue', perks: ['H1B Sponsor Likely'] },
  { id: 21, status: 'queued', match: 66, posted: '3 hours ago', applicants: 94, title: 'Brand Designer', company: 'Anthropic', industry: 'AI Research • Safety • Late Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'Hybrid', level: 'Senior Level', exp: '5+ years exp', salary: '$155K/yr - $195K/yr', date: '#5 in queue', perks: ['H1B Sponsor Likely', 'Work & Life Balance'] },
  { id: 22, status: 'queued', match: 49, posted: '6 hours ago', applicants: 162, title: 'Motion Designer', company: 'Figma', industry: 'Design Tools • SaaS • Public Company', location: 'New York, NY', type: 'Full time', mode: 'Hybrid', level: 'Mid Level', exp: '3+ years exp', salary: '$125K/yr - $155K/yr', date: '#9 in queue', perks: ['No H1B'] },
  { id: 23, status: 'queued', match: 93, posted: '30 minutes ago', applicants: 11, title: 'Principal Designer', company: 'Cursor AI', industry: 'AI Tools • Developer Tools • Growth Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'Hybrid', level: 'Principal Level', exp: '10+ years exp', salary: '$220K/yr - $280K/yr', date: '#1 in queue', saved: true, perks: ['H1B Sponsor Likely'] },
  { id: 24, status: 'failed', match: 72, posted: '7 hours ago', applicants: 48, title: 'Product Designer', company: 'Linear', industry: 'Project Management • SaaS • Growth Stage', location: 'Remote, Global', type: 'Full time', mode: 'Remote', level: 'Mid Level', exp: '3+ years exp', salary: '$130K/yr - $160K/yr', date: 'Nov 26, 2025', perks: ['H1B Sponsor Likely'] },
  { id: 25, status: 'failed', match: 38, posted: '1 day ago', applicants: 310, title: 'Marketing Designer', company: 'Stripe', industry: 'Fintech • Payments • Late Stage', location: 'Seattle, WA', type: 'Full time', mode: 'On-site', level: 'Entry Level', exp: '1+ years exp', salary: '$85K/yr - $105K/yr', date: 'Nov 25, 2025', perks: ['No H1B'] },
  { id: 26, status: 'failed', match: 55, posted: '1 day ago', applicants: 128, title: 'Design Lead', company: 'Anthropic', industry: 'AI Research • Safety • Late Stage', location: 'San Francisco, CA', type: 'Full time', mode: 'On-site', level: 'Lead', exp: '7+ years exp', salary: '$180K/yr - $230K/yr', date: 'Nov 25, 2025', perks: ['H1B Sponsor Likely'] },
]

const RANGES = ['3d', '7d', '30d', '90d'] as const
type Range = (typeof RANGES)[number]
const RANGE_DATA: Record<Range, { submitted: number; delta: number; vs: string; success: number }> = {
  '3d': { submitted: 142, delta: 8, vs: 'from previous 3 days', success: 91 },
  '7d': { submitted: 316, delta: 12, vs: 'from last week', success: 89 },
  '30d': { submitted: 1547, delta: -3, vs: 'from last month', success: 87 },
  '90d': { submitted: 4210, delta: 21, vs: 'from last quarter', success: 85 },
}
const FUNNEL_DATA: Record<Range, [number, number, number]> = {
  '3d': [142, 17, 2], '7d': [316, 41, 5], '30d': [1547, 186, 23], '90d': [4210, 497, 71],
}
const FUNNEL = [{ label: 'Applied' }, { label: 'Interview' }, { label: 'Offer' }]

const COUNTS: Record<Status, number> = { queued: 246, process: 12, failed: 23, submitted: 1240, interview: 31, offer: 4, closed: 186 }
const TABS: { key: Status; label: string }[] = [
  { key: 'queued', label: 'Queued' },
  { key: 'process', label: 'In process' },
  { key: 'failed', label: 'Failed' },
  { key: 'submitted', label: 'Applied' },
  { key: 'interview', label: 'Interviewing' },
  { key: 'offer', label: 'Offer' },
  { key: 'closed', label: 'Closed' },
]
function tier(p: number) { return p >= 80 ? 'elite' : p >= 65 ? 'high' : p >= 50 ? 'mid' : 'low' }
function label(p: number) { return p >= 90 ? 'Strong Match' : p >= 75 ? 'Good Match' : 'Match' }

function Ring({ pct }: { pct: number }) {
  const size = 92, stroke = 5, r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`ap-ring ap-tier-${tier(pct)}`} aria-hidden="true">
      <circle className="ap-ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
      <circle className="ap-ring-arc" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  )
}

function subScores(match: number) {
  const f = (d: number) => Math.max(30, Math.min(98, match + d))
  return [
    { label: 'Education', v: f(4) },
    { label: 'Experience Level', v: f(-3) },
    { label: 'Skills', v: f(1) },
    { label: 'Industry Experience', v: f(-9) },
  ]
}

function MiniRing({ pct }: { pct: number }) {
  const size = 52, stroke = 4, r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <svg className={`jc-ring jc-tier-${tier(pct)}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className="jc-ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
      <circle className="jc-ring-arc" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ '--from': `${c}`, '--to': `${c * (1 - pct / 100)}` } as React.CSSProperties} />
    </svg>
  )
}

/** A number that counts to its value, fast first and slowing into place (ease-out quart) */
function CountUp({ value, decimals = 0, ms = 1100, delay = 0 }: { value: number; decimals?: number; ms?: number; delay?: number }) {
  const [v, setV] = useState(0)
  const from = useRef(0)
  const first = useRef(true) // the stagger delay is for the first count only; later changes react at once
  useEffect(() => {
    const a = from.current, b = value
    const wait = first.current ? delay : 0
    first.current = false
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { from.current = b; setV(b); return }
    let raf = 0
    const t0 = performance.now() + wait
    const step = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - t0) / ms))
      const x = a + (b - a) * (1 - Math.pow(1 - k, 4))
      from.current = x
      setV(x)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, ms, delay])
  return <span className="ap2-num">{decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()}</span>
}

/** Submitted over the range, as 24 points so one shape can morph into the next (demo, stable) */
const SPARK_N = 24
const SPARK_UNIT: Record<string, string> = { '3d': '3 hours', '7d': '7 hours', '30d': 'day', '90d': '4 days' }
function series(total: number, delta: number, seed: number) {
  const startRatio = 1 / (1 + delta / 100)
  const raw = Array.from({ length: SPARK_N }, (_, i) => {
    const t = i / (SPARK_N - 1)
    const trend = startRatio + (1 - startRatio) * t
    const wave = 0.07 * Math.sin(i * 0.9 + seed) + 0.035 * Math.sin(i * 2.3 + seed * 2)
    return Math.max(0.15, trend + wave)
  })
  const sum = raw.reduce((a, b) => a + b, 0)
  return raw.map(v => (v / sum) * total)
}

/** A small trend line: area + line, morphs between ranges, shows the value under the pointer */
function Sparkline({ values, unit }: { values: number[]; unit: string }) {
  const W = 240, H = 46, P = 3
  const [hover, setHover] = useState<number | null>(null)
  // A steady scale around the average, so small wiggles stay small and the trend shows
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const min = avg * 0.55, max = avg * 1.35
  const pts = values.map((v, i) => [P + (i / (values.length - 1)) * (W - 2 * P), P + (1 - (v - min) / (max - min || 1)) * (H - 2 * P)] as const)
  // Smooth curve through the points (Catmull-Rom as cubic Béziers), same command count every time
  const curve = pts.map(([x, y], i) => {
    if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`
    const [x0, y0] = pts[Math.max(0, i - 2)], [x1, y1] = pts[i - 1], [x3, y3] = pts[Math.min(pts.length - 1, i + 1)]
    const c1 = [x1 + (x - x0) / 6, y1 + (y - y0) / 6], c2 = [x - (x3 - x1) / 6, y - (y3 - y1) / 6]
    return `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const area = `${curve} L${(W - P).toFixed(1)},${H} L${P},${H} Z`
  const last = pts[pts.length - 1]
  const h = hover !== null ? pts[hover] : null
  return (
    <div className="ap2-spark" onMouseLeave={() => setHover(null)}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setHover(Math.round(((e.clientX - r.left) / r.width) * (values.length - 1))) }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ap2-spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b0f809" stopOpacity=".45" />
            <stop offset="1" stopColor="#b0f809" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="ap2-spark-area" d={area} style={{ d: `path('${area}')` } as React.CSSProperties} fill="url(#ap2-spark-fill)" />
        <path className="ap2-spark-line" d={curve} style={{ d: `path('${curve}')` } as React.CSSProperties} fill="none" stroke="#8fd400" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} />
        {h && <line x1={h[0]} x2={h[0]} y1={0} y2={H} stroke="#010214" strokeOpacity=".15" vectorEffect="non-scaling-stroke" />}
      </svg>
      <span className="ap2-spark-dot" style={{ left: `${((h ?? last)[0] / W) * 100}%`, top: `${((h ?? last)[1] / H) * 100}%` }} />
      {hover !== null && <span className="ap2-spark-tip" style={{ left: `${(pts[hover][0] / W) * 100}%` }}>{Math.round(values[hover])} per {unit}</span>}
    </div>
  )
}

/** The funnel's height at each stage follows volume (square root, so small stages stay visible) */
const FUNNEL_MAX = 4210
const funnelHeights = (fd: readonly number[]) => fd.map(n => 18 + 82 * Math.sqrt(n / FUNNEL_MAX))

function Mark({ name, logo }: { name: string; logo?: string }) {
  const src = logo ?? BRAND_LOGOS[name]
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img className="ap-mark" src={src} alt="" /> : <span className="ap-mark ap-mark--init">{name[0]}</span>
}

function RangeSwitch({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div className="ap-range" role="tablist" aria-label="Time range">
      {RANGES.map(r => (
        <button key={r} role="tab" aria-selected={value === r} className={value === r ? 'is-active' : ''} onClick={() => onChange(r)}>{r}</button>
      ))}
    </div>
  )
}

type Mode = 'instant' | 'after24' | 'approval'
/** The three submission modes of Auto Apply's settings, as a quick switch */
const MODES: { key: Mode; title: string; text: string }[] = [
  { key: 'instant', title: 'Applies instantly', text: 'No approval needed' },
  { key: 'after24', title: 'Applies after 24 hours', text: 'You can stop any of them first' },
  { key: 'approval', title: 'Applies with your approval', text: 'Each one waits for you' },
]
const MODE_ICON: Record<Mode, React.ReactNode> = {
  instant: <Zap size={16} strokeWidth={2} />,
  after24: <Clock3 size={16} strokeWidth={2} />,
  approval: <UserCheck size={16} strokeWidth={2} />,
}
const CREDIT_LEFT = 23
/** Height of the pinned title row, including the space under it */
const TOP_H = 58
/** Interviews and deadlines from today on, for the Calendar tab's badge */
const UPCOMING = EVENTS.filter(e => e.date >= '2025-11-28').length

const COL_NOTE: Record<Status, string> = {
  queued: 'Waiting to be submitted',
  process: 'Being submitted now',
  failed: 'Needs you to finish',
  submitted: 'Waiting on the employer',
  interview: 'Talking with the team',
  offer: 'Decide and reply',
  closed: 'Rejected or archived',
}
/** Auto Apply's part of the journey, then the employer's */
const PHASE: Record<Status, 'auto' | 'employer'> = { queued: 'auto', process: 'auto', failed: 'auto', submitted: 'employer', interview: 'employer', offer: 'employer', closed: 'employer' }
/** New matches found while the page is open (demo) */
const NEW_MATCHES = [
  { title: 'Product Designer, Growth', company: 'Linear', location: 'Remote, EU', mode: 'Remote', salary: '$140K/yr - $170K/yr', match: 84 },
  { title: 'UX Designer', company: 'Notion', location: 'New York, NY', mode: 'Hybrid', salary: '$130K/yr - $160K/yr', match: 78 },
  { title: 'Design Engineer', company: 'Vercel', location: 'Remote, US', mode: 'Remote', salary: '$150K/yr - $190K/yr', match: 89 },
  { title: 'Senior UX Researcher', company: 'Figma', location: 'San Francisco, CA', mode: 'Hybrid', salary: '$160K/yr - $200K/yr', match: 71 },
  { title: 'Interaction Designer', company: 'Stripe', location: 'Remote, US', mode: 'Remote', salary: '$145K/yr - $185K/yr', match: 81 },
]
/** Things that can stop an application part-way (demo) */
const LIVE_FAILS: Failure[] = [
  { step: 2, reason: 'The form needs a US phone number, and your profile has an Italian one.', fix: { label: 'Answer and retry', done: '', field: { label: 'US phone number', placeholder: '+1 555 010 0000' } } },
  { step: 3, reason: 'One required question isn’t in your profile: “Earliest start date”.', fix: { label: 'Answer and retry', done: '', field: { label: 'Earliest start date', placeholder: 'e.g. 1 March 2026' } } },
  { step: 1, reason: 'The site asked for a human check (CAPTCHA). Auto Apply won’t answer it for you.', fix: { label: 'Do the check, then continue', done: '' } },
  { step: 5, reason: 'The site asked for a human check (CAPTCHA) before submitting.', fix: { label: 'Do the check, then submit', done: '' } },
]
let nextFail = 0
const shuffleIn = <T,>(arr: T[], add: T[], at: (i: number) => boolean) => {
  // Put each new item at a random place among the existing items `at` selects, so columns don't look scripted
  const out = [...arr]
  add.forEach(x => {
    const spots = out.map((y, i) => (at(i) ? i : -1)).filter(i => i >= 0)
    const pos = spots.length ? spots[Math.floor(Math.random() * (spots.length + 1))] ?? out.length : out.length
    out.splice(pos, 0, x)
  })
  return out
}
let nextId = 1000
let nextPick = 0
function newMatch(): Item {
  const m = NEW_MATCHES[nextPick++ % NEW_MATCHES.length]
  return { id: nextId++, status: 'queued', match: m.match, posted: 'just now', applicants: 3, title: m.title, company: m.company, industry: '', location: m.location, type: 'Full time', mode: m.mode, level: 'Mid Level', salary: m.salary, date: '#99 in queue', perks: [], fresh: true }
}
const queuePos = (i: Item) => Number(i.date.match(/#(\d+)/)?.[1] ?? 99)

/** A compact card for the pipeline: who, what, how well it fits, and where it stands */
function PipeCard({ it, saved, onSave, onOpen, step = 0, paused = false, failure }: { it: Item; saved: boolean; onSave: () => void; onOpen: () => void; step?: number; paused?: boolean; failure?: Failure }) {
  return (
    <article className={`ap2-card${it.status === 'closed' ? ' is-closed' : ''}${it.fresh ? ' is-fresh' : ''}`} tabIndex={0} onClick={e => { if (!(e.target as HTMLElement).closest('button, a')) onOpen() }} onKeyDown={e => { if (e.key === 'Enter') onOpen() }}>
      <div className="ap2-card-top">
        <Mark name={it.company} logo={it.logo} />
        <div className="ap2-card-id">
          <h3>{it.title}</h3>
          <p>{it.company}</p>
        </div>
        <span className={`ap2-match ap2-tier-${tier(it.match)}`} title={label(it.match)}>{it.match}%</span>
      </div>
      <p className="ap2-card-meta"><span><MapPin size={13} strokeWidth={1.6} />{it.location}</span><span><HouseWifi size={13} strokeWidth={1.6} />{it.mode}</span></p>
      <p className="ap2-card-meta"><span><CircleDollarSign size={13} strokeWidth={1.6} />{it.salary}</span></p>
      <div className="ap2-card-foot">
        {it.status === 'queued' && <><span className="ap2-note">{it.date}</span><button className="ap2-btn">Move to front</button></>}
        {it.status === 'process' && (
          <span className="ap2-proc">
            <span className="ap2-seg pd-seg" aria-hidden="true">{STEPS.map((x, i) => <i key={x.key} className={i < step ? 'is-done' : i === step ? (paused ? 'is-paused' : 'is-now') : ''} />)}</span>
            <span className="ap2-proc-t" aria-live="polite"><b>{paused ? 'Paused' : `Step ${step + 1}/${STEPS.length}`}</b>{STEPS[step].short}</span>
          </span>
        )}
        {it.status === 'submitted' && <><span className="ap2-note"><Check size={13} strokeWidth={2.2} />Applied {it.date}</span><button className="ap2-icon" aria-label="Save job" aria-pressed={saved} onClick={onSave}><Heart size={15} strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} /></button></>}
        {it.status === 'failed' && failure && (
          <span className="ap2-proc">
            <span className="ap2-seg pd-seg" aria-hidden="true">{STEPS.map((x, i) => <i key={x.key} className={i < failure.step ? 'is-done' : i === failure.step ? 'is-fail' : ''} />)}</span>
            <span className="ap2-proc-t ap2-proc-t--fail"><b>Stopped {failure.step + 1}/{STEPS.length}</b>{STEPS[failure.step].short}</span>
            <span className="ap2-fail-row"><span className="ap2-fail-why">{failure.reason}</span><button className="ap2-btn ap2-btn--dark" onClick={onOpen}>Fix</button></span>
          </span>
        )}
        {it.status === 'interview' && <><span className="ap2-note ap2-note--amber"><Calendar size={13} strokeWidth={1.8} />{it.event}</span><button className="ap2-btn ap2-btn--dark">Reply</button></>}
        {it.status === 'offer' && <><span className="ap2-note ap2-note--lime"><Sparkles size={13} strokeWidth={1.8} />{it.event}</span><button className="ap2-btn ap2-btn--dark">Review</button></>}
        {it.status === 'closed' && <span className="ap2-note">{it.event}</span>}
      </div>
    </article>
  )
}

function Footer({ it }: { it: Item }) {
  if (it.status === 'queued') return (<><span className="ap-foot-note">Queued · {it.date}</span><div className="ap-foot-btns"><button className="ap-btn">Referral</button><button className="ap-btn ap-btn--dark">Move to Front</button></div></>)
  if (it.status === 'process') return (<><span className="ap-foot-note">Submitting your application now…</span><div className="ap-foot-btns"><button className="ap-btn">Referral</button><button className="ap-btn ap-btn--off" disabled>Applying…</button></div></>)
  if (it.status === 'failed') return (<><span className="ap-foot-note ap-foot-note--err">Something went wrong. Please apply manually.</span><div className="ap-foot-btns"><button className="ap-btn">Referral</button><button className="ap-btn ap-btn--dark">Apply Now</button></div></>)
  return (<><span className="ap-foot-note">Applied on {it.date}</span><div className="ap-foot-btns"><button className="ap-btn">Referral</button><button className="ap-btn ap-btn--off" disabled>Auto Applied</button></div></>)
}

// v2 of /jobs/auto-apply (left untouched). Step 1: the left navigation collapses, and the
// panel drops Live Workspace, which only repeats this page.
export default function AutoApplyV2Page() {
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => { setCollapsed(readCollapsed()) }, [])
  const toggle = useCallback(() => setCollapsed(c => { saveCollapsed(!c); return !c }), [])
  const [range, setRange] = useState<Range>('30d')
  const rd = RANGE_DATA[range]
  const [frange, setFrange] = useState<Range>('30d')
  const fd = FUNNEL_DATA[frange]
  const [view, setView] = useState<'applications' | 'inbox'>('applications')
  const [saved, setSaved] = useState<Record<number, boolean>>(() => Object.fromEntries(ITEMS.map(i => [i.id, !!i.saved])))
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState<Item | null>(null)
  const [layout, setLayout] = useState<'pipeline' | 'calendar'>('pipeline')
  const [mode] = useState<Mode>('instant') // set in the settings drawer, shown here
  // Each in-process application moves through the steps on its own; it can be paused
  // The board is live: applications move through the steps, finish into Applied, and the next queued one starts
  // Start with the failed ones in a mixed order, as a real list would be (newest first, not by step)
  const [items, setItems] = useState<Item[]>(() => {
    const failOrder = [25, 8, 26, 24].map(id => ITEMS.find(i => i.id === id)!)
    let k = 0
    const list = ITEMS.map(i => (i.status === 'failed' ? failOrder[k++] : i))
    const order = list.filter(i => i.status === 'queued').sort((a, b) => queuePos(a) - queuePos(b)).map(i => i.id)
    return list.map(i => (i.status === 'queued' ? { ...i, date: `#${order.indexOf(i.id) + 1} in queue` } : i))
  })
  const [steps, setSteps] = useState<Record<number, number>>(() => Object.fromEntries(ITEMS.filter(i => i.status === 'process').map(i => [i.id, startStep(i.id)])))
  const [paused, setPaused] = useState<Record<number, boolean>>({})
  const [fails, setFails] = useState<Record<number, Failure>>(FAILURES)
  const live = useRef({ items, steps, paused })
  live.current = { items, steps, paused }
  useEffect(() => {
    const t = window.setInterval(() => {
      const { items: list0, steps: st0, paused: pz } = live.current
      const st = { ...st0 }
      const finished: number[] = []
      const failed: { id: number; f: Failure }[] = []
      list0.filter(i => i.status === 'process' && !pz[i.id]).forEach(i => {
        if (Math.random() > 0.35) return // each one moves at its own pace
        const at = st[i.id] ?? 0
        // Now and then one stops part-way, like a real form would
        const f = LIVE_FAILS[nextFail % LIVE_FAILS.length]
        if (at === f.step && Math.random() < 0.18) { failed.push({ id: i.id, f }); nextFail++; return }
        if (at >= STEPS.length - 1) finished.push(i.id)
        else st[i.id] = at + 1
      })
      const leaving = [...finished, ...failed.map(x => x.id)]
      if (leaving.length) {
        const queue = list0.filter(i => i.status === 'queued').sort((a, b) => queuePos(a) - queuePos(b))
        const starting = queue.slice(0, leaving.length).map(i => i.id)
        starting.forEach(id => { st[id] = 0 })
        if (failed.length) setFails(fz => ({ ...fz, ...Object.fromEntries(failed.map(x => [x.id, x.f])) }))
        const byId = new Map(list0.map(i => [i.id, i]))
        const rest = list0.filter(i => !leaving.includes(i.id) && !starting.includes(i.id)).map(i => (i.fresh ? { ...i, fresh: false } : i))
        // Applied and Failed show the newest first; In process takes newcomers at random places
        const done = finished.map(id => ({ ...byId.get(id)!, status: 'submitted' as Status, date: 'just now', fresh: true }))
        const stopped = failed.map(x => ({ ...byId.get(x.id)!, status: 'failed' as Status, fresh: true }))
        const started = starting.map(id => ({ ...byId.get(id)!, status: 'process' as Status, fresh: true }))
        let next = [...done, ...stopped, ...rest]
        next = shuffleIn(next, started, i => next[i]?.status === 'process')
        // Scanning keeps finding matches: one new job joins the queue per application started
        next = [...next, ...starting.map(() => newMatch())]
        // Renumber the queue, 1 to n, in its current order
        const order = next.filter(i => i.status === 'queued').sort((a, b) => queuePos(a) - queuePos(b)).map(i => i.id)
        setItems(next.map(i => (i.status === 'queued' ? { ...i, date: `#${order.indexOf(i.id) + 1} in queue` } : i)))
      }
      setSteps(st)
    }, 3000)
    return () => window.clearInterval(t)
  }, [])
  const retry = (id: number) => {
    const f = fails[id]
    setSteps(st => ({ ...st, [id]: f ? f.step : 0 }))
    setItems(list => {
      const it = list.find(i => i.id === id)!
      return [{ ...it, status: 'process', fresh: true }, ...list.filter(i => i.id !== id)]
    })
  }
  // The board scrolls sideways; the strip shows which stages are in view
  const board = useRef<HTMLElement>(null)
  // The page scrolls as a whole until the stage tabs reach the top, then they stay there
  const mainEl = useRef<HTMLElement>(null)
  const stripEl = useRef<HTMLElement>(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const main = mainEl.current, strip = stripEl.current, b = board.current
    if (!main || !strip || !b) return
    // The title row is pinned too, so the tabs pin just under it
    const stickAt = () => strip.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - TOP_H
    const onScroll = () => setStuck(main.scrollTop >= stickAt() - 1 && main.scrollTop > 0)
    // Before the tabs are pinned, scrolling down over the board moves the page, not a column
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || e.deltaY <= 0) return
      const room = stickAt() - main.scrollTop
      if (room > 1) { e.preventDefault(); main.scrollTop += Math.min(e.deltaY, room) }
    }
    main.addEventListener('scroll', onScroll, { passive: true })
    b.addEventListener('wheel', onWheel, { passive: false })
    return () => { main.removeEventListener('scroll', onScroll); b.removeEventListener('wheel', onWheel) }
  }, [view, layout])
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [inView, setInView] = useState<Status[]>([])
  const measureBoard = useCallback(() => {
    const el = board.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    const box = el.getBoundingClientRect()
    setInView([...el.querySelectorAll<HTMLElement>('[data-col]')].filter(c => {
      const r = c.getBoundingClientRect()
      return r.right > box.left + 40 && r.left < box.right - 40
    }).map(c => c.dataset.col as Status))
  }, [])
  useEffect(() => {
    measureBoard()
    window.addEventListener('resize', measureBoard)
    return () => window.removeEventListener('resize', measureBoard)
  }, [measureBoard, collapsed])
  const slide = (d: number) => {
    const el = board.current
    const col = el?.querySelector<HTMLElement>('[data-col]')
    if (el && col) el.scrollBy({ left: d * (col.offsetWidth + 12) * 2, behavior: 'smooth' })
  }
  const goTo = (k: Status) => {
    const el = board.current
    const col = el?.querySelector<HTMLElement>(`[data-col="${k}"]`)
    if (el && col) el.scrollTo({ left: el.scrollLeft + col.getBoundingClientRect().left - el.getBoundingClientRect().left - 8, behavior: 'smooth' })
    col?.classList.remove('is-ping'); void col?.offsetWidth; col?.classList.add('is-ping')
  }
  const byStatus = useMemo(() => {
    const hit = (i: Item) => `${i.title} ${i.company}`.toLowerCase().includes(q.toLowerCase())
    const out = Object.fromEntries(TABS.map(t => [t.key, []])) as unknown as Record<Status, Item[]>
    items.filter(hit).forEach(i => out[i.status].push(i))
    out.queued.sort((a, b) => queuePos(a) - queuePos(b))
    return out
  }, [q, items])
  // The drawer follows the live item, so a retried application switches to its in-process view
  const cur = detail ? items.find(i => i.id === detail.id) ?? detail : null

  return (
    <div className={`jb-layout jn2-layout${collapsed ? ' is-collapsed' : ''}`}>
      <AppDetailDrawer item={cur && cur.status !== 'process' && cur.status !== 'failed' ? (cur as DetailItem) : null} onClose={() => setDetail(null)} />
      <ProcessDrawer
        item={cur && (cur.status === 'process' || cur.status === 'failed') ? cur : null}
        step={cur ? steps[cur.id] ?? 0 : 0}
        paused={cur ? !!paused[cur.id] : false}
        onPause={() => cur && setPaused(p => ({ ...p, [cur.id]: !p[cur.id] }))}
        onClose={() => setDetail(null)}
        failure={cur?.status === 'failed' ? fails[cur.id] ?? null : null}
        onRetry={() => cur && retry(cur.id)}
      />
      <JnSidebarV2 active="Auto Apply" collapsed={collapsed} onToggle={toggle} />

      <section className="jb-content">
        <div className="jb-main-hd">
          <div className="jb-main-hd-inner">
            <div className="jb-main-hd-main">
              <div className="jb-tab-bar">
                <div className="jb-seg">
                  <button className={`jb-seg-item${view === 'applications' ? ' is-active' : ''}`} type="button" onClick={() => setView('applications')}>Applications</button>
                  <button className={`jb-seg-item${view === 'inbox' ? ' is-active' : ''}`} type="button" onClick={() => setView('inbox')}>Inbox <span className="jb-seg-n">33</span></button>
                </div>
              </div>
            </div>
            <div className="jb-main-hd-side">
              <div className="jb-credit-pill" aria-label="Credit balance">
                <span className="jb-credit-icon" aria-hidden="true" />
                <span className="jb-credit-value">230</span>
              </div>
              <span className="jb-top-avatar jb-user-av" aria-label="Profile" />
            </div>
          </div>
        </div>

        <div className={`jb-content-body${view === 'inbox' ? ' ap-inbox-body' : ' ap2-body'}`}>
          {view === 'inbox' ? <InboxView /> : (<>
          <main className="ap-main ap2-main" ref={mainEl}>
            <div className="ap-top">
              <div className="ap-title">
                <h1>Applications</h1>
              </div>
              {/* Two ways to read the same applications: by stage, or by date */}
              <div className="ap2-view" role="tablist" aria-label="View">
                <button role="tab" aria-selected={layout === 'pipeline'} className={layout === 'pipeline' ? 'is-on' : ''} onClick={() => setLayout('pipeline')}><Columns3 size={15} />Pipeline</button>
                <button role="tab" aria-selected={layout === 'calendar'} className={layout === 'calendar' ? 'is-on' : ''} onClick={() => setLayout('calendar')}><CalendarDays size={15} />Calendar<b>{UPCOMING}</b></button>
              </div>
              <label className="ap-search">
                <Search size={16} />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="companies,job titles…" />
              </label>
            </div>

            <div className="ap2-overview">
            <div className="ap-stats">
              <div className="ap-stat">
                <p className="ap-stat-h"><i />In process</p>
                <p className="ap-stat-n"><CountUp value={623} delay={150} /><span className="ap-up"><ArrowUp size={20} strokeWidth={1.6} />15% from last week</span></p>
                <div className="ap-stat-row"><span>New Queued</span><span>9/50</span></div>
              </div>
              <div className="ap-stat">
                <div className="ap-stat-hd">
                  <p className="ap-stat-h"><i />Submitted</p>
                  <RangeSwitch value={range} onChange={setRange} />
                </div>
                <p className="ap-stat-n"><CountUp value={rd.submitted} delay={250} /><span key={range} className={`ap2-delta ${rd.delta >= 0 ? 'ap-up' : 'ap-down'}`}>{rd.delta >= 0 ? <ArrowUp size={20} strokeWidth={1.6} /> : <ArrowDown size={20} strokeWidth={1.6} />}{rd.delta}% {rd.vs}</span></p>
                <Sparkline values={series(rd.submitted, rd.delta, RANGES.indexOf(range) + 1)} unit={SPARK_UNIT[range]} />
                <div className="ap-stat-row"><span>Success Rate</span><span><CountUp value={rd.success} ms={800} delay={250} />%</span></div>
              </div>

              <div className="ap-funnel">
              <div className="ap-funnel-hd"><p className="ap-stat-h"><i />Conversion funnel</p><RangeSwitch value={frange} onChange={setFrange} /></div>
              <div className="ap-funnel-shape" aria-hidden="true">
                {FUNNEL.map((st, i) => {
                  const h = funnelHeights(fd)
                  const next = h[i + 1] ?? h[i] * 0.7
                  const a = (100 - h[i]) / 2, b = (100 - next) / 2
                  return <span key={st.label} className={`ap-fseg ap-fseg--${i}`} style={{ clipPath: `polygon(0 ${a}%, 100% ${b}%, 100% ${100 - b}%, 0 ${100 - a}%)` }} />
                })}
              </div>
              <div className="ap-funnel-legend">
                {FUNNEL.map((st, i) => {
                  const n = fd[i]
                  return (
                    <div key={st.label}>
                      <span className={`ap-fdot ap-fdot--${i}`} />
                      <b>{st.label}</b>
                      <strong><CountUp value={n} delay={350 + i * 80} /></strong>
                      <em>{i === 0 ? 'Applications sent' : <><CountUp value={(n / fd[i - 1]) * 100} decimals={1} delay={350 + i * 80} />% of {FUNNEL[i - 1].label.toLowerCase()}</>}</em>
                    </div>
                  )
                })}
              </div>
              </div>
            </div>
            <div className="ap2-auto ap2-panel">
              <AutoApplyPanel />
              {/* The current rules, read-only: one statement first, the details after it */}
              <div className="ap2-auto-foot">
                <div className="ap2-rules">
                  <div className="ap2-rules-main">
                    <span className="ap2-rules-ic" aria-hidden="true">{MODE_ICON[mode]}</span>
                    <div>
                      <p className="ap2-rules-t">{MODES.find(m => m.key === mode)!.title}</p>
                      <p className="ap2-rules-s">{MODES.find(m => m.key === mode)!.text}</p>
                    </div>
                  </div>
                  <p className="ap2-rules-tags"><span title="Balanced strategy">55%+ match</span><span>Cover letter on</span></p>
                </div>
                {/* Credit: a quiet line, red only when it is running out */}
                <a className={`ap2-credit-line${CREDIT_LEFT <= 30 ? ' is-low' : ''}`} href="/jobs/subscribtion">
                  <span><i aria-hidden="true" /><b>{CREDIT_LEFT}</b> applications left</span>
                  <em>Upgrade</em>
                </a>
              </div>
            </div>
            </div>

            {layout === 'calendar' ? <CalendarView onOpen={id => { const it = items.find(i => i.id === id); if (it) setDetail(it) }} /> : (<>
            {/* The pipeline: one column per stage, every application visible at once */}
            {/* Stage strip: every stage and its count at a glance; click to bring that column into view */}
            <nav className={`ap2-strip${stuck ? ' is-stuck' : ''}`} aria-label="Pipeline stages" ref={stripEl}>
              <button className="ap2-arrow" onClick={() => slide(-1)} disabled={!canLeft} aria-label="Scroll pipeline left"><ChevronLeft size={16} /></button>
              <div className="ap2-strip-in">
                {TABS.map((t, i) => (
                  <Fragment key={t.key}>
                    {i > 0 && (PHASE[TABS[i - 1].key] !== PHASE[t.key] ? <span className="ap2-strip-gap">Employer</span> : <ChevronRight className="ap2-strip-sep" size={14} aria-hidden="true" />)}
                    <button className={`ap2-pill ap2-pill--${t.key}${inView.includes(t.key) ? ' is-in' : ''}`} onClick={() => goTo(t.key)}>
                      <i aria-hidden="true" />{t.label} <b>{COUNTS[t.key].toLocaleString()}</b>
                    </button>
                  </Fragment>
                ))}
              </div>
              <button className="ap2-arrow" onClick={() => slide(1)} disabled={!canRight} aria-label="Scroll pipeline right"><ChevronRight size={16} /></button>
            </nav>

            <section className={`ap2-board${canLeft ? ' fade-l' : ''}${canRight ? ' fade-r' : ''}`} aria-label="Application pipeline" ref={board} onScroll={measureBoard}>
              {TABS.map(col => {
                const items = byStatus[col.key]
                return (
                  <div key={col.key} data-col={col.key} className={`ap2-col ap2-col--${col.key} ap2-phase-${PHASE[col.key]}`}>
                    <header className="ap2-col-hd">
                      <span className="ap2-col-dot" aria-hidden="true" />
                      <h2>{col.label}</h2>
                      <b>{COUNTS[col.key].toLocaleString()}</b>
                      <p>{COL_NOTE[col.key]}</p>
                    </header>
                    <div className="ap2-col-list">
                      {items.length === 0 && <p className="ap2-empty">{q ? 'No matches.' : 'Nothing here.'}</p>}
                      {items.map(it => <PipeCard key={it.id} it={it} saved={!!saved[it.id]} onSave={() => setSaved(s => ({ ...s, [it.id]: !s[it.id] }))} onOpen={() => setDetail(it)} step={steps[it.id] ?? 0} paused={!!paused[it.id]} failure={fails[it.id]} />)}
                    </div>
                  </div>
                )
              })}
            </section>
            </>)}
          </main>
          </>)}
        </div>
      </section>
    </div>
  )
}
