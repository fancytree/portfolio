'use client'

// The detail drawer for an application Auto Apply is working on right now: which step it is
// on, what is already done, what comes next, and everything it prepared to send. Same
// geometry as the original detail drawer (../auto-apply/ApplicationDrawer.tsx, untouched).

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, X, Download, FileText, Loader2, MapPin, HouseWifi, CircleDollarSign, Pause, Play, ExternalLink, UserRound, MessageSquareText, Sparkles } from 'lucide-react'
import { BRAND_LOGOS } from '../../../components/jobs/brandLogos'
import { STEPS, answersFor, atsFor, PROFILE_FIELDS, type Failure } from './process'
import '../detail/resume.css'
import './process-drawer.css'

export type ProcItem = { id: number; title: string; company: string; match: number; location: string; mode: string; salary: string; logo?: string }

const ago = (n: number) => (n <= 0 ? 'just now' : `${n} min ago`)

export default function ProcessDrawer({ item, step: liveStep, paused, onPause, onClose, failure, onRetry }: { item: ProcItem | null; step: number; paused: boolean; onPause: () => void; onClose: () => void; failure?: Failure | null; onRetry?: () => void }) {
  const [answer, setAnswer] = useState('')
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState<ProcItem | null>(null)
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (item) { setShown(item); const t = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); return () => cancelAnimationFrame(t) }
    setOpen(false)
    setPreview(null)
  }, [item])
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])

  useEffect(() => { setAnswer('') }, [item])
  if (!mounted || !shown) return null
  const fail = failure ?? null
  const step = fail ? fail.step : liveStep
  const needs = fail?.fix.field && !answer.trim()
  const it = shown
  const ctx = { company: it.company, title: it.title, ats: atsFor(it.id) }
  const logo = it.logo ?? BRAND_LOGOS[it.company]
  const answers = answersFor(it.company, it.title)
  const cur = STEPS[step]
  // Minutes since each finished step, counted back from now (demo timing)
  const doneAt = (i: number) => (step - 1 - i) * 1 + 1

  return createPortal(
    <div className={`rv-root pd-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="rv-scrim" onClick={onClose} />
      <aside className={`rv-drawer pd-drawer${fail ? ' is-failed' : ''}`} role="dialog" aria-modal="true" aria-label={fail ? 'Application needs you' : 'Application in progress'}>
        <header className="rv-head">
          <button className="rv-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
          </button>
          <h2>{fail ? 'Application needs you' : 'Application in progress'}</h2>
        </header>

        <div className="pd-body">
          {/* The job, briefly */}
          <section className="pd-card pd-job">
            {logo ? /* eslint-disable-next-line @next/next/no-img-element */ <img className="pd-logo" src={logo} alt="" /> : <span className="pd-logo pd-logo--init">{it.company[0]}</span>}
            <div className="pd-job-id">
              <h3>{it.title}</h3>
              <p>{it.company} · via {ctx.ats}</p>
              <p className="pd-facts"><span><MapPin size={14} strokeWidth={1.6} />{it.location}</span><span><HouseWifi size={14} strokeWidth={1.6} />{it.mode}</span><span><CircleDollarSign size={14} strokeWidth={1.6} />{it.salary}</span></p>
            </div>
            <span className="pd-match">{it.match}%<small>match</small></span>
          </section>

          <div className="pd-cols">
            {/* Where it is now, what is done, what is next */}
            <section className="pd-card pd-steps" aria-label="Application steps">
              {fail ? (
                <div className="pd-now pd-now--fail" role="alert">
                  <p className="pd-now-k">Stopped at step {step + 1} of {STEPS.length}</p>
                  <p className="pd-now-t">{STEPS[step].short}</p>
                  <div className="pd-seg" aria-hidden="true">
                    {STEPS.map((x, i) => <i key={x.key} className={i < step ? 'is-done' : i === step ? 'is-fail' : ''} />)}
                  </div>
                  <p className="pd-why">{fail.reason}</p>
                  {fail.fix.field && (
                    <label className="pd-field">
                      <span>{fail.fix.field.label}</span>
                      <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder={fail.fix.field.placeholder} />
                    </label>
                  )}
                  <div className="pd-fix">
                    <button className="pd-btn" disabled={!!needs} onClick={() => onRetry?.()}>{fail.fix.label}</button>
                    <a className="pd-btn pd-btn--ghost" href="#" onClick={e => e.preventDefault()}><ExternalLink size={14} />Apply manually</a>
                  </div>
                </div>
              ) : (
                <div className="pd-now" aria-live="polite">
                <p className="pd-now-k">{paused ? 'Paused' : `Step ${step + 1} of ${STEPS.length}`}</p>
                <p className="pd-now-t">{cur.short}{paused ? '' : '…'}</p>
                <div className="pd-seg" aria-hidden="true">
                  {STEPS.map((s, i) => <i key={s.key} className={i < step ? 'is-done' : i === step ? (paused ? 'is-paused' : 'is-now') : ''} />)}
                </div>
                <p className="pd-now-m">Started {step + 1} min ago · usually about 6 min in total</p>
              </div>
              )}

              <ol className="pd-list">
                {STEPS.map((s, i) => {
                  const state = i < step ? 'done' : i === step ? (fail ? 'fail' : 'now') : 'next'
                  return (
                    <li key={s.key} className={`pd-step is-${state}`}>
                      <span className="pd-dot" aria-hidden="true">
                        {state === 'done' ? <Check size={12} strokeWidth={2.6} /> : state === 'fail' ? <X size={12} strokeWidth={2.6} /> : state === 'now' ? (paused ? <Pause size={11} strokeWidth={2.4} /> : <Loader2 size={13} strokeWidth={2.4} className="pd-spin" />) : <i />}
                      </span>
                      <div className="pd-step-b">
                        <p className="pd-step-t">{s.label}<em>{state === 'done' ? ago(doneAt(i)) : state === 'fail' ? 'stopped' : state === 'now' ? (paused ? 'paused' : 'now') : 'next'}</em></p>
                        {state !== 'next' && <p className="pd-step-d">{state === 'fail' ? fail!.reason : s.detail(ctx)}</p>}
                      </div>
                    </li>
                  )
                })}
              </ol>

              <div className="pd-actions">
                {!fail && <button className="pd-btn" onClick={onPause}>{paused ? <><Play size={14} />Resume</> : <><Pause size={14} />Pause this application</>}</button>}
                <a className="pd-btn pd-btn--ghost" href="#" onClick={e => e.preventDefault()}><ExternalLink size={14} />Job posting</a>
              </div>
            </section>

            {/* What Auto Apply prepared, and where each part came from */}
            <section className="pd-card pd-mats" aria-label="Prepared materials">
              <h3 className="pd-h">Prepared for this application</h3>
              {fail && <p className="pd-kept"><Check size={13} strokeWidth={2.4} />Everything below is kept. Retry, or use it to apply yourself.</p>}

              <div className="pd-docs">
                {[
                  { name: 'Resume', note: 'Tailored for this role · 1 page', tag: 'Tailored by Nova' },
                  { name: 'Cover letter', note: `Written for ${it.company} · 210 words`, tag: 'Written by Nova' },
                ].map(d => (
                  <button key={d.name} type="button" className={`pd-doc${preview === d.name ? ' is-on' : ''}`} onClick={() => setPreview(p => (p === d.name ? null : d.name))} aria-expanded={preview === d.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/demos/jobnova/img/resume/timeline-thumb.png" alt="" />
                    <span className="pd-doc-b">
                      <b><FileText size={14} strokeWidth={1.8} />{d.name}</b>
                      <em>{d.note}</em>
                      <span className="pd-tag pd-tag--nova"><Sparkles size={11} />{d.tag}</span>
                      {fail && <span className="pd-dl" role="link" tabIndex={0} onClick={e => e.stopPropagation()}><Download size={12} />Download</span>}
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

              <h4 className="pd-sub"><MessageSquareText size={14} strokeWidth={1.8} />Screening answers</h4>
              <ul className="pd-qa">
                {[...answers, ...(fail?.fix.field ? [{ q: fail.fix.field.label, a: answer.trim() || 'Needed from you', source: 'missing' as const }] : [])].map(a => (
                  <li key={a.q} className={a.source === 'missing' ? (answer.trim() ? '' : 'is-missing') : step < 3 ? 'is-pending' : ''}>
                    <p className="pd-q">{a.q}</p>
                    <p className="pd-a">{a.a}</p>
                    <span className={`pd-tag ${a.source === 'nova' ? 'pd-tag--nova' : a.source === 'missing' ? 'pd-tag--miss' : ''}`}>{a.source === 'nova' ? <><Sparkles size={11} />Written by Nova</> : a.source === 'missing' ? 'Not in your profile' : 'From your profile'}</span>
                  </li>
                ))}
              </ul>

              <h4 className="pd-sub"><UserRound size={14} strokeWidth={1.8} />Profile fields</h4>
              <dl className="pd-fields">
                {PROFILE_FIELDS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              {!fail && <p className="pd-note">You can pause before the last step to change anything here.</p>}
            </section>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
