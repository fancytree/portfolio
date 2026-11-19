'use client'

// v2 Application Detail, built on the in-progress drawer's design. The original
// (../auto-apply/ApplicationDrawer.tsx) is untouched. Left: where the application stands now
// and what to do next, then a timeline that only holds events that fit its stage (emails open
// inline with Nova's summary). Right: exactly what was sent.

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, CalendarPlus, Check, ChevronDown, CircleDollarSign, Clock3, ExternalLink, FileText, Heart, HouseWifi, Inbox, Link2, Mail, MapPin, MessageSquareText, Search, Send, Sparkles, UserRound, X } from 'lucide-react'
import { BRAND_LOGOS } from '../../../components/jobs/brandLogos'
import { answersFor, atsFor, PROFILE_FIELDS } from './process'
import '../detail/resume.css'
import './process-drawer.css'
import './app-detail.css'

export type DetailStatus = 'queued' | 'submitted' | 'interview' | 'offer' | 'closed'
export type DetailItem = { id: number; status: DetailStatus; title: string; company: string; match: number; location: string; mode: string; salary: string; date: string; event?: string; posted: string; applicants: number; saved?: boolean; logo?: string }

type MailT = { subject: string; summary: string; body: string[] }
type Ev = { label: string; when: string; detail?: string; mail?: MailT; state: 'done' | 'now' | 'next' | 'end' }

function mails(it: DetailItem) {
  const co = it.company
  return {
    ack: { subject: `We received your application: ${it.title}`, summary: 'Confirms your application arrived. Nothing to do.', body: ['Hi Alex,', `Thanks for applying to the ${it.title} role at ${co}. We’ve received your application and will review it shortly.`, `${co} Recruiting`] },
    invite: { subject: `Interview invitation: ${it.title}`, summary: 'A 45-minute video interview. Three times are offered; reply with one.', body: ['Hi Alex,', `Thanks for applying to ${co}. We’d love to invite you to a 45-minute video interview with the team.`, 'Would Tuesday 10:00 AM, Wednesday 2:00 PM or Thursday 11:30 AM PT work for you?', `${co} Recruiting`] },
    offer: { subject: `Your offer from ${co}`, summary: 'The offer letter is attached. They ask for a reply by Dec 3.', body: ['Hi Alex,', `We’re delighted to offer you the ${it.title} position at ${co}. Your offer letter is attached.`, 'Please let us know your decision by December 3. Happy to answer any questions.', `${co} People Team`] },
    reject: { subject: `Update on your ${it.title} application`, summary: 'They are not moving forward with this application.', body: ['Hi Alex,', `Thank you for your interest in ${co}. After careful review, we won’t be moving forward with your application at this time.`, 'We encourage you to apply again in the future.', `${co} Recruiting`] },
  }
}

/** Only the events that fit the stage, in order */
function journey(it: DetailItem): Ev[] {
  const m = mails(it)
  const ats = atsFor(it.id)
  const matched: Ev = { label: 'Matched', when: 'Nov 24 · 8:05 AM', detail: `Found on ${ats}. ${it.match}% match with your profile.`, state: 'done' }
  if (it.status === 'queued') return [
    matched,
    { label: 'Waiting in the queue', when: it.date, detail: 'Auto Apply works through the queue in order, one application at a time.', state: 'now' },
    { label: 'Prepare materials and submit', when: 'next', detail: 'Tailored resume and cover letter, then the six application steps.', state: 'next' },
  ]
  const submitted: Ev = { label: 'Submitted by Auto Apply', when: `${it.date === 'just now' ? 'Today' : it.date} · 4:40 PM`, detail: `All 6 steps done on ${ats}. Resume, cover letter and 4 answers sent.`, state: 'done' }
  const ack: Ev = { label: 'Confirmation email', when: 'Nov 26 · 4:52 PM', mail: m.ack, state: 'done' }
  if (it.status === 'submitted') return [matched, submitted, ack, { label: 'Waiting on the employer', when: 'now', detail: 'Most companies reply within one to two weeks. JobNova watches your inbox for it.', state: 'now' }]
  if (it.status === 'interview') return [matched, submitted, ack, { label: 'Interview invitation', when: 'Nov 27 · 9:12 AM', mail: m.invite, state: 'now' }, { label: 'Interview', when: 'next', state: 'next' }]
  if (it.status === 'offer') return [matched, submitted, ack, { label: 'Interviews', when: 'Nov 18 – Nov 25', detail: 'Two rounds with the design team.', state: 'done' }, { label: 'Offer received', when: 'Nov 27 · 3:30 PM', mail: m.offer, state: 'now' }]
  const archived = /archived/i.test(it.event ?? '')
  return [matched, submitted, ack, archived
    ? { label: 'Archived by you', when: 'Nov 26', detail: 'Closed from the pipeline. You can reopen it.', state: 'end' }
    : { label: 'Rejected', when: it.event?.split('· ')[1] ?? 'Nov 23', mail: m.reject, state: 'end' }]
}

/** Where it stands now, and the next move */
function now(it: DetailItem) {
  switch (it.status) {
    case 'queued': return { tone: 'neutral', k: 'Queued', t: `${it.date.replace(' in queue', '')} in the queue`, m: 'Starts in about 4 minutes', actions: ['Move to front', 'Skip this job'] }
    case 'submitted': return { tone: 'neutral', k: 'Applied', t: 'Waiting on the employer', m: `Applied ${it.date} · no reply yet`, actions: ['Draft a follow-up', 'Withdraw'] }
    case 'interview': return { tone: 'go', k: 'Interviewing', t: it.event ?? 'Interview scheduled', m: '45-minute video call with the design team', actions: ['Reply', 'Add to calendar'] }
    case 'offer': return { tone: 'win', k: 'Offer', t: it.event ?? 'Offer received', m: 'Compare it with your other applications before you reply', actions: ['Review offer', 'Reply'] }
    default: return { tone: 'end', k: 'Closed', t: it.event ?? 'Closed', m: 'JobNova will keep finding similar roles', actions: ['Find similar roles', 'Reopen'] }
  }
}
const ACTION_ICON: Record<string, React.ReactNode> = {
  Reply: <Send size={14} />, 'Add to calendar': <CalendarPlus size={14} />, 'Review offer': <FileText size={14} />,
  'Draft a follow-up': <Mail size={14} />, 'Find similar roles': <Search size={14} />,
}

export default function AppDetailDrawer({ item, onClose }: { item: DetailItem | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState<DetailItem | null>(null)
  const [open, setOpen] = useState(false)
  const [mailOpen, setMailOpen] = useState<number | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (item) {
      setShown(item); setSaved(!!item.saved); setPreview(null)
      // The newest email opens by itself: it is usually why the person came here
      const evs = journey(item); const last = evs.map((e, i) => (e.mail ? i : -1)).filter(i => i >= 0).pop()
      setMailOpen(item.status === 'submitted' || last === undefined ? null : last)
      const t = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
      return () => cancelAnimationFrame(t)
    }
    setOpen(false)
  }, [item])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!mounted || !shown) return null

  const it = shown
  const logo = it.logo ?? BRAND_LOGOS[it.company]
  const n = now(it)
  const evs = journey(it)
  const sent = it.status !== 'queued'
  const answers = answersFor(it.company, it.title)

  return createPortal(
    <div className={`rv-root pd-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="rv-scrim" onClick={onClose} />
      <aside className="rv-drawer pd-drawer" role="dialog" aria-modal="true" aria-label="Application detail">
        <header className="rv-head">
          <button className="rv-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
          </button>
          <h2>Application detail</h2>
        </header>

        <div className="pd-body">
          <section className="pd-card pd-job">
            {logo ? /* eslint-disable-next-line @next/next/no-img-element */ <img className="pd-logo" src={logo} alt="" /> : <span className="pd-logo pd-logo--init">{it.company[0]}</span>}
            <div className="pd-job-id">
              <h3>{it.title}</h3>
              <p>{it.company} · posted {it.posted} · {it.applicants} applicants</p>
              <p className="pd-facts"><span><MapPin size={14} strokeWidth={1.6} />{it.location}</span><span><HouseWifi size={14} strokeWidth={1.6} />{it.mode}</span><span><CircleDollarSign size={14} strokeWidth={1.6} />{it.salary}</span></p>
            </div>
            <div className="adx-job-side">
              <span className="pd-match">{it.match}%<small>match</small></span>
              <span className="adx-icons">
                <a href="#" onClick={e => e.preventDefault()} aria-label="Open the job posting"><Link2 size={17} strokeWidth={1.6} /></a>
                <button onClick={() => setSaved(v => !v)} aria-label="Save job" aria-pressed={saved}><Heart size={17} strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} /></button>
              </span>
            </div>
          </section>

          <div className="pd-cols">
            <section className="pd-card pd-steps" aria-label="Where it stands">
              {/* Now: the one thing to read first */}
              <div className={`pd-now adx-now adx-now--${n.tone}`} aria-live="polite">
                <p className="pd-now-k">{n.k}</p>
                <p className="pd-now-t">{n.t}</p>
                <p className="pd-now-m">{n.m}</p>
                <div className="adx-acts">
                  {n.actions.map((a, i) => (
                    <button key={a} className={`pd-btn${i ? ' pd-btn--ghost' : ''}`}>{ACTION_ICON[a]}{a}</button>
                  ))}
                </div>
              </div>

              <ol className="pd-list">
                {evs.map((e, i) => (
                  <li key={i} className={`pd-step is-${e.state === 'end' ? (/reject/i.test(e.label) ? 'fail' : 'done') : e.state}${e.state === 'now' ? ' adx-cur' : ''}`}>
                    <span className="pd-dot" aria-hidden="true">
                      {e.state === 'done' ? <Check size={12} strokeWidth={2.6} /> : e.state === 'end' ? (/reject/i.test(e.label) ? <X size={12} strokeWidth={2.6} /> : <Inbox size={12} strokeWidth={2.2} />) : e.state === 'now' ? <i className="adx-pulse" /> : <i />}
                    </span>
                    <div className="pd-step-b">
                      <p className="pd-step-t">{e.label}<em>{e.when}</em></p>
                      {e.detail && <p className="pd-step-d">{e.detail}</p>}
                      {e.mail && (
                        <div className={`adx-mail${mailOpen === i ? ' is-open' : ''}`}>
                          <button className="adx-mail-hd" onClick={() => setMailOpen(o => (o === i ? null : i))} aria-expanded={mailOpen === i}>
                            <Mail size={14} /><span>{e.mail.subject}</span><ChevronDown size={14} className="adx-chev" />
                          </button>
                          {mailOpen === i && (
                            <div className="adx-mail-b">
                              <p className="adx-ai"><Sparkles size={12} /><b>Nova</b>{e.mail.summary}</p>
                              {e.mail.body.map((p, k) => <p key={k}>{p}</p>)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="pd-card pd-mats" aria-label={sent ? 'What was sent' : 'What will be sent'}>
              <h3 className="pd-h">{sent ? 'Sent with this application' : 'Will be sent'}</h3>
              {!sent && <p className="pd-kept adx-later"><Clock3 size={13} strokeWidth={2} />Prepared when its turn comes. These are your current defaults.</p>}
              <div className="pd-docs">
                {[
                  { name: 'Resume', note: sent ? 'Tailored version, as sent' : 'Will be tailored for this role', tag: 'Tailored by Nova' },
                  { name: 'Cover letter', note: sent ? `Written for ${it.company}, as sent` : `Will be written for ${it.company}`, tag: 'Written by Nova' },
                ].map(d => (
                  <button key={d.name} type="button" className={`pd-doc${preview === d.name ? ' is-on' : ''}${sent ? '' : ' adx-ghost'}`} onClick={() => sent && setPreview(p => (p === d.name ? null : d.name))} aria-expanded={preview === d.name} disabled={!sent}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/demos/jobnova/img/resume/timeline-thumb.png" alt="" />
                    <span className="pd-doc-b">
                      <b><FileText size={14} strokeWidth={1.8} />{d.name}</b>
                      <em>{d.note}</em>
                      {sent && <span className="pd-tag pd-tag--nova"><Sparkles size={11} />{d.tag}</span>}
                    </span>
                  </button>
                ))}
              </div>
              {preview && (
                <div className="pd-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/demos/jobnova/img/resume/timeline-thumb.png" alt={`${preview} preview`} />
                </div>
              )}

              {sent && (
                <>
                  <h4 className="pd-sub"><MessageSquareText size={14} strokeWidth={1.8} />Screening answers</h4>
                  <ul className="pd-qa">
                    {answers.map(a => (
                      <li key={a.q}>
                        <p className="pd-q">{a.q}</p>
                        <p className="pd-a">{a.a}</p>
                        <span className={`pd-tag ${a.source === 'nova' ? 'pd-tag--nova' : ''}`}>{a.source === 'nova' ? <><Sparkles size={11} />Written by Nova</> : 'From your profile'}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h4 className="pd-sub"><UserRound size={14} strokeWidth={1.8} />Profile fields</h4>
              <dl className="pd-fields">
                {PROFILE_FIELDS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              {sent && <a className="adx-posting" href="#" onClick={e => e.preventDefault()}><ExternalLink size={13} />View the job posting as it was when you applied<ArrowUpRight size={13} /></a>}
            </section>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
