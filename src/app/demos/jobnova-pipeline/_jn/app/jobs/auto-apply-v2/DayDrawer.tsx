'use client'

// Half-screen detail for one calendar day. A past day (and today) has two tabs:
// Scheduled, the interviews and deadlines on that day with how they went, and Sent, how
// many applications went out, where they stand now, and the list itself. A future day
// only has what is scheduled. Uses the original drawer frame (.rv-root).

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, CalendarCheck2, CircleCheck, Clock3, Mail, Sparkles, Video } from 'lucide-react'
import { BRAND_LOGOS } from '../../../components/jobs/brandLogos'
import { minutesOf, type CalEvent } from './CalendarView'
import '../detail/resume.css'
import './day-drawer.css'

export type DayInfo = { date: Date; sent: number | null; interviewFrom?: { id: number; title: string; company: string } | null; events: CalEvent[]; isToday: boolean }

const POOL = [
  ['Product Designer', 'Figma'], ['UX Designer', 'Notion'], ['Design Engineer', 'Vercel'], ['Senior Product Designer', 'Linear'],
  ['Interaction Designer', 'Stripe'], ['UX Researcher', 'Railway'], ['Brand Designer', 'Anthropic'], ['Product Designer, Growth', 'Cursor AI'],
  ['UI Designer', 'Google'], ['Design Systems Designer', 'Accenture'], ['Visual Designer', 'Notion'], ['Staff Designer', 'Stripe'],
] as const
type Row = { title: string; company: string; time: string; match: number; state: 'waiting' | 'interview' | 'rejected' | 'viewed' }

/** The day's applications (demo, stable per day) */
function rowsFor(d: Date, n: number, win: DayInfo['interviewFrom']): Row[] {
  const seed = d.getDate() * 31 + d.getMonth() * 7
  return Array.from({ length: n }, (_, i) => {
    const [title, company] = POOL[(seed + i * 5) % POOL.length]
    const r = (seed * 13 + i * 29) % 100
    const mins = 9 * 60 + Math.floor((i / Math.max(1, n)) * 9 * 60) + ((seed + i) % 17)
    return {
      title, company,
      time: `${((Math.floor(mins / 60) + 11) % 12) + 1}:${String(mins % 60).padStart(2, '0')} ${mins >= 720 ? 'PM' : 'AM'}`,
      match: 52 + ((seed + i * 11) % 44),
      state: r < 22 ? 'rejected' : r < 34 ? 'viewed' : 'waiting',
    } as Row
  }).map((row, i) => (win && i === 2 ? { ...row, title: win.title, company: win.company, state: 'interview' as const } : row))
}

const STATE: Record<Row['state'], string> = { waiting: 'Waiting', viewed: 'Viewed', interview: 'Interviewing', rejected: 'Rejected' }
const KIND: Record<CalEvent['kind'], { label: string; icon: React.ReactNode }> = {
  interview: { label: 'Interview', icon: <Video size={14} strokeWidth={2} /> },
  deadline: { label: 'Reply due', icon: <Mail size={14} strokeWidth={2} /> },
  offer: { label: 'Offer', icon: <Sparkles size={14} strokeWidth={2} /> },
}
type Tab = 'scheduled' | 'sent'

export default function DayDrawer({ day, onClose, onOpen }: { day: DayInfo | null; onClose: () => void; onOpen: (id: number) => void }) {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState<DayInfo | null>(null)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('scheduled')
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    // A day opens on what happened or is planned; with nothing scheduled, on what was sent
    if (day) { setShown(day); setTab(day.events.length || day.sent === null ? 'scheduled' : 'sent'); const t = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); return () => cancelAnimationFrame(t) }
    setOpen(false)
  }, [day])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!mounted || !shown) return null

  const d = shown
  const title = d.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const hasSent = d.sent !== null // past days and today
  const rows = hasSent ? rowsFor(d.date, d.sent ?? 0, d.interviewFrom) : []
  const count = (s: Row['state']) => rows.filter(r => r.state === s).length
  const events = [...d.events].sort((a, b) => minutesOf(a) - minutesOf(b))
  const interviews = events.filter(e => e.kind === 'interview').length
  const showScheduled = !hasSent || tab === 'scheduled'
  const showSent = hasSent && tab === 'sent'

  return createPortal(
    <div className={`rv-root dd-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="rv-scrim" onClick={onClose} />
      <aside className="rv-drawer dd-drawer" role="dialog" aria-modal="true" aria-label={title}>
        <header className="rv-head">
          <button className="rv-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
          </button>
          <h2>{title}{d.isToday && <span className="dd-today">Today</span>}</h2>
        </header>

        <div className="dd-body">
          {/* Past days and today: what was on the calendar, and what went out */}
          {hasSent && (
            <div className="dd-tabs" role="tablist" aria-label="This day">
              <button role="tab" aria-selected={tab === 'scheduled'} className={tab === 'scheduled' ? 'is-on' : ''} onClick={() => setTab('scheduled')}>Scheduled<b>{events.length}</b></button>
              <button role="tab" aria-selected={tab === 'sent'} className={tab === 'sent' ? 'is-on' : ''} onClick={() => setTab('sent')}>Sent<b>{d.sent}</b></button>
            </div>
          )}

          {/* What is scheduled that day; past events say how they went */}
          {showScheduled && events.length > 0 && (
            <section className="dd-card" key={`s-${tab}`}>
              {/* Under the tabs the tab already says "Scheduled", so the card names what is in it */}
              <h3 className="dd-h">
                {hasSent ? (interviews ? `${interviews} interview${interviews > 1 ? 's' : ''}` : 'On the calendar') : 'Scheduled'}
                {!hasSent && interviews > 1 && <small>{interviews} interviews</small>}
              </h3>
              <ul className="dd-events">
                {events.map((e, i) => {
                  const logo = BRAND_LOGOS[e.company]
                  return (
                    <li key={i} className={`dd-ev dd-ev--${e.kind}${e.outcome ? ' is-done' : ''}`}>
                      <span className="dd-ev-time">{e.time ?? 'All day'}</span>
                      <div className="dd-ev-b">
                        <p className="dd-ev-k">{KIND[e.kind].icon}{KIND[e.kind].label}</p>
                        <p className="dd-ev-t">{e.title}</p>
                        <p className="dd-ev-co">{logo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={logo} alt="" /> : null}{e.company} · {e.note}</p>
                        {e.outcome && <p className="dd-ev-out"><CircleCheck size={13} strokeWidth={2} />{e.outcome}</p>}
                      </div>
                      <button className="dd-btn" onClick={() => onOpen(e.id)}>Open<ArrowUpRight size={14} /></button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          {showScheduled && events.length === 0 && (
            hasSent && !d.isToday
              ? <section className="dd-card dd-empty"><CalendarCheck2 size={22} strokeWidth={1.6} /><p>Nothing was scheduled.</p><span>No interviews or deadlines this day. See what Auto Apply sent in the Sent tab.</span></section>
              : <section className="dd-card dd-empty"><CalendarCheck2 size={22} strokeWidth={1.6} /><p>Nothing scheduled.</p><span>Auto Apply keeps sending on its own; interviews and deadlines will show up here.</span></section>
          )}

          {/* What went out that day, and how it is going */}
          {showSent && (
            <>
              <section className="dd-card dd-sum">
                <div className="dd-big"><b>{d.sent}</b><span>applications sent</span></div>
                <ul className="dd-split">
                  <li><i className="is-waiting" />Waiting <b>{count('waiting') + count('viewed')}</b></li>
                  <li><i className="is-interview" />Interviewing <b>{count('interview')}</b></li>
                  <li><i className="is-rejected" />Rejected <b>{count('rejected')}</b></li>
                </ul>
                {rows.length > 0 && (
                  <div className="dd-bar" aria-hidden="true">
                    <i className="is-interview" style={{ flex: count('interview') }} />
                    <i className="is-waiting" style={{ flex: count('waiting') + count('viewed') }} />
                    <i className="is-rejected" style={{ flex: count('rejected') }} />
                  </div>
                )}
                {d.interviewFrom && (
                  <button className="dd-win" onClick={() => onOpen(d.interviewFrom!.id)}>
                    <Sparkles size={16} />
                    <span><b>Led to an interview</b>{d.interviewFrom.title} · {d.interviewFrom.company}</span>
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </section>

              <section className="dd-card">
                <h3 className="dd-h">Sent this day <small>{rows.length}</small></h3>
                {rows.length === 0 ? <p className="dd-none">Nothing was sent this day.</p> : (
                  <ul className="dd-rows">
                    {rows.map((r, i) => {
                      const logo = BRAND_LOGOS[r.company]
                      return (
                        <li key={i} className="dd-row">
                          {logo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={logo} alt="" /> : <span className="dd-init">{r.company[0]}</span>}
                          <span className="dd-row-id"><b>{r.title}</b><em>{r.company}</em></span>
                          <span className="dd-row-time"><Clock3 size={12} />{r.time}</span>
                          <span className="dd-row-match">{r.match}%</span>
                          <span className={`dd-state is-${r.state}`}>{STATE[r.state]}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  )
}
