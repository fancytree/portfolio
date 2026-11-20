'use client'

// Calendar view of the application pipeline. One grid, two jobs:
// past days show how many applications went out (the heat), whether that day's
// applications later got an interview (a dot), and the interviews that took place there
// (muted, with how they went); today and after show what needs the person: interviews
// and reply deadlines. A "Coming up" list sits beside it.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CalendarPlus, ChevronLeft, ChevronRight, Clock3, Mail, Sparkles, Video } from 'lucide-react'
import DayDrawer, { type DayInfo } from './DayDrawer'
import { BRAND_LOGOS } from '../../../components/jobs/brandLogos'
import './calendar.css'

type Kind = 'interview' | 'deadline' | 'offer'
/** `outcome` is set on events that already happened: how it went */
export type CalEvent = { id: number; date: string; time?: string; kind: Kind; title: string; company: string; note: string; outcome?: string }

// Demo "today" matches the sample data (Fri, Nov 28, 2025)
const TODAY = new Date(2025, 10, 28)
const DAY = 86400000
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const EVENTS: CalEvent[] = [
  // Already happened
  { id: 9, date: '2025-10-14', time: '11:00 AM', kind: 'interview', title: 'Portfolio review', company: 'Notion', note: 'Brand Designer · 60 min', outcome: 'Not selected' },
  { id: 12, date: '2025-10-21', time: '2:00 PM', kind: 'interview', title: 'Recruiter call', company: 'Google', note: 'Interaction Designer · 30 min', outcome: 'Moved to the design interview' },
  { id: 12, date: '2025-10-30', time: '10:00 AM', kind: 'interview', title: 'Design interview', company: 'Google', note: 'Interaction Designer · 45 min', outcome: 'Not selected' },
  { id: 1, date: '2025-11-17', time: '10:00 AM', kind: 'interview', title: 'Phone screen', company: 'Accenture', note: 'Founding Product Designer · 30 min', outcome: 'Moved to the panel' },
  { id: 1, date: '2025-11-20', time: '10:00 AM', kind: 'interview', title: 'Panel interview', company: 'Accenture', note: 'Founding Product Designer · 90 min', outcome: 'Led to an offer' },
  { id: 10, date: '2025-11-20', time: '3:00 PM', kind: 'interview', title: 'Screening call', company: 'Cursor AI', note: 'Design Engineer · 30 min', outcome: 'Moved to the video interview' },
  { id: 11, date: '2025-11-24', time: '1:00 PM', kind: 'interview', title: 'Recruiter call', company: 'Linear', note: 'Staff Product Designer · 30 min', outcome: 'Moved to the portfolio review' },
  { id: 1, date: '2025-11-26', kind: 'offer', title: 'Offer received', company: 'Accenture', note: 'Founding Product Designer', outcome: 'Reply by Dec 3' },
  // Today and after
  { id: 2, date: '2025-11-28', time: '6:00 PM', kind: 'deadline', title: 'Reply to interview invite', company: 'Cursor AI', note: 'User Experience Designer' },
  { id: 10, date: '2025-12-02', time: '10:00 AM', kind: 'interview', title: 'Video interview', company: 'Cursor AI', note: 'Design Engineer · 45 min' },
  { id: 1, date: '2025-12-03', kind: 'offer', title: 'Offer reply due', company: 'Accenture', note: 'Founding Product Designer' },
  { id: 11, date: '2025-12-04', time: '2:00 PM', kind: 'interview', title: 'Portfolio review', company: 'Linear', note: 'Staff Product Designer · 60 min' },
  { id: 11, date: '2025-12-09', time: '9:30 AM', kind: 'interview', title: 'Design exercise', company: 'Linear', note: 'Staff Product Designer · 60 min' },
  { id: 2, date: '2025-12-09', time: '11:30 AM', kind: 'interview', title: 'Intro call', company: 'Cursor AI', note: 'User Experience Designer · 30 min' },
  { id: 10, date: '2025-12-09', time: '3:00 PM', kind: 'interview', title: 'Technical design interview', company: 'Cursor AI', note: 'Design Engineer · 60 min' },
  { id: 11, date: '2025-12-16', time: '3:00 PM', kind: 'interview', title: 'Final round', company: 'Linear', note: 'Staff Product Designer · 2 h' },
]
/** Minutes after midnight, for ordering a day's events; all-day items come first */
export const minutesOf = (e: CalEvent) => {
  if (!e.time) return -1
  const [, h, m, ap] = e.time.match(/(\d+):(\d+)\s*(AM|PM)/) ?? []
  return ((+h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + +m
}
/** How many event chips fit in a day cell before "+N more" */
const CELL_MAX = 2
const STARTED = new Date(2025, 8, 8) // Auto Apply was switched on
/** The months the calendar covers, oldest first */
const MONTHS = [[2025, 8], [2025, 9], [2025, 10], [2025, 11], [2026, 0]] as const
const mKey = (y: number, m: number) => `${y}-${String(m + 1).padStart(2, '0')}`

/** Applications sent each past day (demo, stable): fewer at weekends, quiet before Auto Apply started */
function sentOn(d: Date) {
  const t = d.getTime()
  if (t > TODAY.getTime()) return null
  if (d < STARTED) return 0
  const n = d.getDate() * 7 + d.getMonth() * 13
  const base = (n * 37) % 41
  const weekend = d.getDay() === 0 || d.getDay() === 6
  return Math.round((weekend ? base * 0.3 : base) * (d < new Date(2025, 10, 6) ? 0.4 : 1))
}
/** Days whose applications later turned into an interview (demo) */
const LED_TO_INTERVIEW = new Set(['2025-09-22', '2025-10-08', '2025-10-17', '2025-10-29', '2025-11-10', '2025-11-14', '2025-11-19', '2025-11-21', '2025-11-25'])
/** Which application from that day got the interview (ids from the pipeline where there is one) */
const WINS: Record<string, { id: number; title: string; company: string }> = {
  '2025-11-10': { id: 1, title: 'Founding Product Designer', company: 'Accenture' },
  '2025-11-14': { id: 10, title: 'Design Engineer', company: 'Cursor AI' },
  '2025-11-19': { id: 11, title: 'Staff Product Designer', company: 'Linear' },
  '2025-11-21': { id: 2, title: 'User Experience Designer', company: 'Cursor AI' },
  '2025-11-25': { id: 11, title: 'Staff Product Designer', company: 'Linear' },
}
const level = (n: number) => (n === 0 ? 0 : n < 8 ? 1 : n < 16 ? 2 : n < 26 ? 3 : 4)

const KIND_ICON: Record<Kind, React.ReactNode> = {
  interview: <Video size={12} strokeWidth={2} />,
  deadline: <Mail size={12} strokeWidth={2} />,
  offer: <Sparkles size={12} strokeWidth={2} />,
}

export default function CalendarView({ onOpen }: { onOpen: (id: number) => void }) {
  const [picked, setPicked] = useState<DayInfo | null>(null)
  const [cur, setCur] = useState(mKey(TODAY.getFullYear(), TODAY.getMonth()))
  const scroller = useRef<HTMLDivElement>(null)
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o)
  const upcoming = EVENTS.filter(e => e.date >= iso(TODAY)).sort((a, b) => a.date.localeCompare(b.date) || minutesOf(a) - minutesOf(b))

  // Bring a month to the top of the calendar
  const goTo = (key: string, smooth = true) => {
    const box = scroller.current
    const el = box?.querySelector<HTMLElement>(`[data-month="${key}"]`)
    if (!box || !el) return
    const top = box.scrollTop + el.getBoundingClientRect().top - box.getBoundingClientRect().top
    if (smooth) box.scrollTo({ top, behavior: 'smooth' })
    else { box.style.scrollBehavior = 'auto'; box.scrollTop = top; box.style.scrollBehavior = '' }
  }
  // Open on this month, without moving the page
  useLayoutEffect(() => { goTo(mKey(TODAY.getFullYear(), TODAY.getMonth()), false); setCur(mKey(TODAY.getFullYear(), TODAY.getMonth())) }, [])
  // The bar follows the month being read
  useEffect(() => {
    const box = scroller.current
    if (!box) return
    const onScroll = () => {
      const top = box.getBoundingClientRect().top + 40
      const months = [...box.querySelectorAll<HTMLElement>('[data-month]')]
      const at = months.filter(m => m.getBoundingClientRect().top <= top).pop() ?? months[0]
      if (at) setCur(at.dataset.month!)
    }
    box.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    // Before the calendar reaches the top of the page, scrolling down over it moves the page first
    const main = box.closest<HTMLElement>('.ap2-main')
    const cal = box.closest<HTMLElement>('.cal')
    const onWheel = (e: WheelEvent) => {
      if (!main || !cal || Math.abs(e.deltaY) <= Math.abs(e.deltaX) || e.deltaY <= 0) return
      const room = cal.getBoundingClientRect().top - main.getBoundingClientRect().top - 58
      if (room > 1) { e.preventDefault(); main.scrollTop += Math.min(e.deltaY, room) }
    }
    box.addEventListener('wheel', onWheel, { passive: false })
    return () => { box.removeEventListener('scroll', onScroll); box.removeEventListener('wheel', onWheel) }
  }, [])

  const idx = MONTHS.findIndex(([y, m]) => mKey(y, m) === cur)
  const step = (d: number) => { const n = MONTHS[idx + d]; if (n) goTo(mKey(n[0], n[1])) }
  const [cy, cm] = MONTHS[Math.max(0, idx)]

  return (
    <section className="cal" aria-label="Application calendar">
      <DayDrawer day={picked} onClose={() => setPicked(null)} onOpen={id => { setPicked(null); onOpen(id) }} />
      <div className="cal-main">
        {/* Month bar: arrows, the month, a jump to any month, Today */}
        <header className="cal-bar">
          <div className="cal-nav">
            <button className="cal-arrow" onClick={() => step(-1)} disabled={idx <= 0} aria-label="Previous month"><ChevronLeft size={16} /></button>
            <h2 aria-live="polite">{new Date(cy, cm, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            <button className="cal-arrow" onClick={() => step(1)} disabled={idx >= MONTHS.length - 1} aria-label="Next month"><ChevronRight size={16} /></button>
          </div>
          <div className="cal-months" role="tablist" aria-label="Months">
            {MONTHS.map(([y, m]) => {
              const k = mKey(y, m)
              return <button key={k} role="tab" aria-selected={k === cur} className={k === cur ? 'is-on' : ''} onClick={() => goTo(k)}>{new Date(y, m, 1).toLocaleDateString('en-US', { month: 'short' })}</button>
            })}
          </div>
          <button className="cal-today" onClick={() => goTo(mKey(TODAY.getFullYear(), TODAY.getMonth()))}>Today</button>
        </header>
        <div className="cal-dows">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}</div>

        <div className="cal-scroll" ref={scroller}>
          {MONTHS.map(([y, m]) => {
            const first = new Date(y, m, 1)
            const count = new Date(y, m + 1, 0).getDate()
            const lead = (first.getDay() + 6) % 7
            const days = Array.from({ length: count }, (_, i) => new Date(y, m, i + 1))
            const sentTotal = days.reduce((s2, d) => s2 + (sentOn(d) ?? 0), 0)
            const wins = days.filter(d => LED_TO_INTERVIEW.has(iso(d))).length
            const evs = EVENTS.filter(e => e.date.startsWith(mKey(y, m)) && e.kind === 'interview').length
            return (
              <section key={mKey(y, m)} className="cal-month" data-month={mKey(y, m)}>
                <h3 className="cal-month-h">
                  {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  <small>{sentTotal ? `${sentTotal.toLocaleString()} sent` : ''}{wins ? ` · ${wins} led to interviews` : ''}{evs ? `${sentTotal ? ' · ' : ''}${evs} interview${evs > 1 ? 's' : ''}` : ''}{!sentTotal && !evs ? 'Nothing yet' : ''}</small>
                </h3>
                <div className="cal-grid" role="grid">
                  {Array.from({ length: lead }, (_, i) => <div key={`l${i}`} className="cal-pad" aria-hidden="true" />)}
                  {days.map(d => {
                    const key = iso(d)
                    const sent = sentOn(d)
                    const events = EVENTS.filter(e => e.date === key).sort((a, b) => minutesOf(a) - minutesOf(b))
                    const isToday = key === iso(TODAY)
                    const past = sent !== null && !isToday
                    const info = { date: d, sent, isToday, events, interviewFrom: WINS[key] ?? null }
                    return (
                      <div key={key} role="gridcell" tabIndex={0}
                        className={`cal-day${isToday ? ' is-today' : ''}${past ? ` is-past lv-${level(sent!)}` : ''}${picked && iso(picked.date) === key ? ' is-picked' : ''}`}
                        title={sent !== null ? `${sent} applications sent` : undefined}
                        onClick={() => setPicked(info)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPicked(info) } }}>
                        <div className="cal-day-hd">
                          <span className="cal-num">{d.getDate()}</span>
                          {past && sent! > 0 && <span className="cal-sent">{sent}</span>}
                          {LED_TO_INTERVIEW.has(key) && <span className="cal-dot" aria-label="Led to an interview" />}
                        </div>
                        {events.slice(0, CELL_MAX).map((e, i) => (
                          <button key={i} className={`cal-ev cal-ev--${e.kind}${e.outcome ? ' is-done' : ''}`} title={e.outcome ? `${e.title} · ${e.outcome}` : e.title} onClick={ev => { ev.stopPropagation(); onOpen(e.id) }}>
                            {KIND_ICON[e.kind]}<span className="cal-ev-t"><b>{e.company}</b>{e.time && <em>{e.time}</em>}</span>
                          </button>
                        ))}
                        {events.length > CELL_MAX && <span className="cal-more">+{events.length - CELL_MAX} more</span>}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <footer className="cal-legend">
          <span>Applications sent</span>
          <span className="cal-scale">Less{[0, 1, 2, 3, 4].map(l => <i key={l} className={`lv-${l}`} />)}More</span>
          <span><span className="cal-dot" />Got an interview</span>
          <span><span className="cal-key cal-ev--interview" />Interview</span>
          <span><span className="cal-key cal-ev--interview is-done" />Done</span>
          <span><span className="cal-key cal-ev--deadline" />Reply due</span>
          <span><span className="cal-key cal-ev--offer" />Offer</span>
        </footer>
      </div>

      <aside className="cal-side" aria-label="Coming up">
        <header className="cal-side-hd">
          <h3>Coming up</h3>
          <button className="cal-sync"><CalendarPlus size={14} />Add to calendar</button>
        </header>
        <ol className="cal-list">
          {upcoming.map((e, i) => {
            const d = new Date(`${e.date}T00:00:00`)
            const logo = BRAND_LOGOS[e.company]
            const days = Math.round((d.getTime() - TODAY.getTime()) / DAY)
            return (
              <li key={i}>
                <button className={`cal-item cal-item--${e.kind}`} onClick={() => onOpen(e.id)}>
                  <span className="cal-when"><b>{fmt(d, { day: 'numeric' })}</b>{fmt(d, { month: 'short' })}</span>
                  <span className="cal-what">
                    <span className="cal-what-t">{KIND_ICON[e.kind]}{e.title}</span>
                    <span className="cal-what-co">
                      {logo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={logo} alt="" /> : null}{e.company} · {e.note}
                    </span>
                    <span className="cal-what-time"><Clock3 size={12} />{days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}{e.time ? ` · ${e.time}` : ''}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </aside>
    </section>
  )
}
