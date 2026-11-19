'use client'

import { useState, useEffect, useRef } from 'react'
import { BRAND_LOGOS } from './brandLogos'
import { AlertCtaButton, AutoApplyToggleButton } from '../Buttons'
import { Settings } from 'lucide-react'
import AutoApplySettingsDrawer from './AutoApplySettingsDrawer'
import '../../app/jobs/jobs-shell.css'

// ── Types ──────────────────────────────────────────────────────────
type AppStatus = 'queued' | 'process' | 'submitted'
type AutoApp = {
  id: number; title: string; company: string; companyColor: string
  status: AppStatus; date: string; salary: string
}

type LiveApp = AutoApp & { age: number; motion: 'in' | 'rest' | 'leaving' }

/** Jobs that arrive in the Live Workspace, in turn */
const ARRIVALS = [
  { title: 'Product Designer', company: 'Linear', color: '#5e6ad2' },
  { title: 'AI Product Designer', company: 'Anthropic', color: '#cc6c24' },
  { title: 'Design Engineer', company: 'Cursor AI', color: '#09090b' },
  { title: 'UX Designer', company: 'Google', color: '#4285f4' },
  { title: 'Senior Frontend Engineer', company: 'Vercel', color: '#000000' },
  { title: 'Design Systems Lead', company: 'Figma', color: '#a259ff' },
  { title: 'Payments UI Engineer', company: 'Stripe', color: '#635bff' },
  { title: 'Web Developer', company: 'Notion', color: '#000000' },
]

const AUTO_APPS: AutoApp[] = [
  { id: 1, title: 'Frontend Engineer', company: 'Vercel', companyColor: '#000000', status: 'process', date: 'Just now', salary: '$130k–$160k' },
  { id: 2, title: 'Product Designer', company: 'Figma', companyColor: '#a259ff', status: 'queued', date: '3m ago', salary: '$120k–$150k' },
  { id: 3, title: 'React Developer', company: 'Stripe', companyColor: '#635bff', status: 'submitted', date: '8m ago', salary: '$140k–$170k' },
  { id: 4, title: 'UI Engineer', company: 'Notion', companyColor: '#000000', status: 'submitted', date: '15m ago', salary: '$110k–$140k' },
  { id: 5, title: 'Full Stack Dev', company: 'Railway', companyColor: '#7b2bf9', status: 'submitted', date: '22m ago', salary: '$100k–$130k' },
]


// ── Helpers ────────────────────────────────────────────────────────
function CompanyAvatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  if (BRAND_LOGOS[name]) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="jb-co-av jb-co-av--mark" src={BRAND_LOGOS[name]} alt="" style={{ '--sz': `${size}px` } as React.CSSProperties} />
  }
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div className="jb-co-av" style={{ '--co': color, '--sz': `${size}px` } as React.CSSProperties}>
      {initials}
    </div>
  )
}

const STATUS_META: Record<AppStatus, { label: string; cls: string }> = {
  queued: { label: 'Queued', cls: 'aa-s--queued' },
  process: { label: 'In-process', cls: 'aa-s--process' },
  submitted: { label: 'Submitted', cls: 'aa-s--submitted' },
}

// ── Auto Apply Panel ───────────────────────────────────────────────
/* A number whose digits roll upward to the new value, like a counter */
function CountUp({ value }: { value: number }) {
  const chars = String(value).split('')
  return (
    <strong className="aa-roll" aria-label={String(value)}>
      {chars.map((ch, i) => {
        const fromRight = chars.length - 1 - i
        return /\d/.test(ch) ? (
          <span key={fromRight} className="aa-roll-col" aria-hidden="true">
            <span className="aa-roll-strip" style={{ transform: `translateY(-${Number(ch) * 10}%)`, transitionDelay: `${fromRight * 60}ms` }}>
              {'0123456789'.split('').map(d => <i key={d}>{d}</i>)}
            </span>
          </span>
        ) : <span key={`c${i}`} aria-hidden="true">{ch}</span>
      })}
    </strong>
  )
}

export default function AutoApplyPanel() {
  const [enabled, setEnabled] = useState(true)
  const [activeFlowIndex, setActiveFlowIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showStartModal, setShowStartModal] = useState(false)
  const [skipStartReminder, setSkipStartReminder] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('aa_skip_start_reminder')
    if (saved === '1') setSkipStartReminder(true)
  }, [])

  const handleSkipReminderChange = (checked: boolean) => {
    setSkipStartReminder(checked)
    if (checked) {
      window.localStorage.setItem('aa_skip_start_reminder', '1')
    } else {
      window.localStorage.removeItem('aa_skip_start_reminder')
    }
  }

  // 仅在用户从关闭切换到开启时弹窗，避免初始化时打扰
  const handleToggleAutoApply = () => {
    setEnabled(prev => {
      const next = !prev
      if (!prev && next && !skipStartReminder) {
        setShowStartModal(true)
      }
      return next
    })
  }

  useEffect(() => {
    if (!enabled) return
    const timer = window.setInterval(() => {
      setActiveFlowIndex(prev => (prev + 1) % 3)
    }, 900)
    return () => window.clearInterval(timer)
  }, [enabled])

  // ── Live Workspace: new jobs keep coming in ─────────────────────
  const [apps, setApps] = useState<LiveApp[]>(() => AUTO_APPS.map((a, i) => ({ ...a, age: [0, 3, 8, 15, 22][i] ?? i * 5, motion: 'rest' })))
  const [stats, setStats] = useState({ queued: 246, process: 12 })
  const arrival = useRef(0)
  const nextId = useRef(100)

  useEffect(() => {
    if (!enabled) return
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }
    const tick = window.setInterval(() => {
      const pick = ARRIVALS[arrival.current++ % ARRIVALS.length]
      const id = ++nextId.current
      // the newcomer enters at the top and pushes the rest down; the oldest row leaves when the list is full
      setApps(prev => {
        const aged = prev.map(x => ({ ...x, age: x.age + 1 }))
        const next: LiveApp[] = [{ id, title: pick.title, company: pick.company, companyColor: pick.color, status: 'queued', date: '', salary: '', age: 0, motion: 'in' }, ...aged]
        return next
      })
      setStats(s => ({ ...s, queued: s.queued + 1 }))
      later(() => setApps(prev => prev.map(x => (x.id === id ? { ...x, motion: 'rest' as const } : x))), 1500)
      // queued → in-process → submitted, each stage lasting a while (varies per job, so several are in flight at once)
      const n = (arrival.current - 1) % 5
      const toProcess = [3600, 5200, 4400, 6200, 3000][n]
      const toDone = toProcess + [5200, 7400, 5800, 8600, 4200][n]
      later(() => {
        setApps(prev => prev.map(x => (x.id === id ? { ...x, status: 'process' as const } : x)))
        setStats(s => ({ queued: Math.max(0, s.queued - 1), process: s.process + 1 }))
      }, toProcess)
      later(() => {
        setApps(prev => prev.map(x => (x.id === id ? { ...x, status: 'submitted' as const } : x)))
        setStats(s => ({ ...s, process: Math.max(0, s.process - 1) }))
      }, toDone)
    }, 3400)
    return () => { window.clearInterval(tick); timers.forEach(window.clearTimeout) }
  }, [enabled])

  return (
    <div className="aa-panel">
      <AutoApplySettingsDrawer open={showSettings} onClose={() => setShowSettings(false)} />
      {showStartModal && (
        <div className="aa-start-overlay" onClick={() => setShowStartModal(false)}>
          <div className="aa-start-modal" role="dialog" aria-modal="true" aria-label="Auto Apply started" onClick={e => e.stopPropagation()}>
            <button className="aa-start-close" type="button" onClick={() => setShowStartModal(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="aa-start-anim" aria-hidden="true">
              <span className="aa-start-anim-icon-wrap">
                <img
                  className="aa-start-anim-icon"
                  src="/demos/jobnova/img/resume-portfolio-svgrepo-com%201.svg"
                  alt=""
                />
                <span className="aa-start-upload-badge">⬆</span>
              </span>
            </div>
            <p className="aa-start-title">Auto Apply is now running</p>
            <p className="aa-start-desc">
              Our AI agent is working hard to apply for you, so you can leave and have a coffee.
            </p>
            <button className="aa-start-cta" onClick={() => setShowStartModal(false)}>
              Nice
            </button>
            <label className="aa-start-remind-toggle">
              <input
                type="checkbox"
                checked={skipStartReminder}
                onChange={(e) => handleSkipReminderChange(e.target.checked)}
              />
              <span>Don't remind me again</span>
            </label>
          </div>
        </div>
      )}
      <div className="aa-top-card">
        <div className="aa-hd">
          <div className="aa-hd-left">
            <span className="aa-bolt" aria-hidden="true" />
            <span className="aa-hd-title">Auto Apply</span>
          </div>
          <div className="aa-hd-right">
            <button className="aa-settings-btn" onClick={() => setShowSettings(true)} aria-label="Auto Apply settings">
              <Settings size={18} strokeWidth={1.6} />
            </button>
            <AutoApplyToggleButton enabled={enabled} onToggle={handleToggleAutoApply} />
          </div>
        </div>

        <div className="aa-steps aa-steps--pill">
          {['Scanning', 'Queued', 'Submitting'].map((s, i) => (
            <div key={s} className={`aa-step${enabled && activeFlowIndex === i ? ' is-active' : ''}`}>
              <span className="aa-step-dot" />
              {s}
            </div>
          ))}
        </div>

        <div className="aa-today-stats aa-today-stats--two">
          <div className="aa-tstat">
            <CountUp value={stats.queued} />
            <span>Queued</span>
          </div>
          <div className="aa-tstat">
            <CountUp value={stats.process} />
            <span>In process</span>
          </div>
        </div>
      </div>

      {/* Credit alerts */}
      <div className="aa-alert aa-alert--error">
        <span className="aa-alert-msg">You are out of credit</span>
        <AlertCtaButton>Upgrade</AlertCtaButton>
      </div>
      <div className="aa-alert aa-alert--warn">
        <span className="aa-alert-msg">You've used 90% of credit</span>
        <AlertCtaButton>Upgrade</AlertCtaButton>
      </div>

      <div className="aa-live-card" id="autoapply">
        {/* Live Workspace */}
        <div className="aa-list-hd">
          <div className="aa-list-hd-left">
            <span className={`aa-pulse${enabled ? ' is-live' : ''}`} style={{ width: 7, height: 7 }} />
            <span className="aa-list-title">Live Workspace</span>
          </div>
          <a href="/jobs#autoapply" className="aa-list-count">View all</a>
        </div>
        <div className="aa-list">
          {apps.map(app => {
            const s = STATUS_META[app.status]
            return (
              <div key={app.id} className={`aa-row aa-row--${app.motion}`}>
                <div className="aa-row-inner">
                  <div className={`aa-item aa-item--${app.status}${app.motion === 'in' ? ' is-fresh' : ''}`} style={{ animation: 'none' }}>
                    <div className={`aa-item-av-wrap${app.status === 'submitted' ? ' aa-item--applied' : ''}`}>
                      <CompanyAvatar name={app.company} color={app.companyColor} size={32} />
                    </div>
                    <div className="aa-item-info">
                      <p className="aa-item-title">{app.title}</p>
                      <p className="aa-item-co">{app.company} · {app.age === 0 ? 'Just now' : `${app.age}m ago`}</p>
                    </div>
                    <span className={`aa-status-badge ${s.cls}`} key={app.status}>{s.label}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

