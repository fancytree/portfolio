'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import '../../app/jobs/detail/resume.css'
import './settings-drawer.css'

type Criteria = 'explore' | 'balanced' | 'precision'
type Autonomy = 'instant' | 'after24' | 'approval'

const CRITERIA: { key: Criteria; title: string; badge: string; text: string }[] = [
  { key: 'explore', title: 'Explore All', badge: '>30% Match', text: 'Prioritizes volume. Best for quick opportunities.' },
  { key: 'balanced', title: 'Balanced', badge: '>55% Match', text: 'A healthy mix of strong matches and reach.' },
  { key: 'precision', title: 'Precision Only', badge: '>80% Match', text: 'Quality over quantity. Perfect fits only.' },
]
const AUTONOMY: { key: Autonomy; title: string; text: string; rec?: boolean }[] = [
  { key: 'instant', title: 'Apply instantly without approval', text: 'Applications are submitted immediately without your approve', rec: true },
  { key: 'after24', title: 'Apply automatically after 24 hours', text: 'You have 24 hours to approve or reject before it auto-submits' },
  { key: 'approval', title: 'Apply only with your approval', text: 'Applications are submitted only after you manually approve them' },
]
const EMAILS = [
  ['interview', 'Interview invitation'], ['status', 'Position Status Update'],
  ['info', 'Additional info request'], ['reject', 'Rejection Notification'],
  ['ack', 'Application Acknowledgement'], ['others', 'Others'],
] as const

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`st-switch${on ? ' is-on' : ''}`} onClick={() => onChange(!on)}><i /></button>
  )
}

export default function AutoApplySettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [criteria, setCriteria] = useState<Criteria>('balanced')
  const [autonomy, setAutonomy] = useState<Autonomy>('instant')
  const [resume, setResume] = useState(false)
  const [cover, setCover] = useState(false)
  const [mail, setMail] = useState<Record<string, boolean>>({ interview: true, status: true, info: true, reject: true, ack: true, others: true })

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (open) { const t = requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))); return () => cancelAnimationFrame(t) }
    setShow(false)
  }, [open])
  useEffect(() => {
    if (!show) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [show, onClose])

  if (!mounted || (!open && !show)) return null

  return createPortal(
    <div className={`rv-root st-root${show ? ' is-open' : ''}`} aria-hidden={!show}>
      <div className="rv-scrim" onClick={onClose} />
      <aside className="rv-drawer" role="dialog" aria-modal="true" aria-label="Auto Apply Settings">
        <header className="rv-head">
          <button className="rv-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" /></svg>
          </button>
          <h2>Auto Apply Settings</h2>
        </header>

        <div className="st-body">
          <section className="st-card">
            <h3>Job Matching Criteria</h3>
            <div className="st-crit">
              {CRITERIA.map(c => (
                <button key={c.key} type="button" className={`st-crit-item${criteria === c.key ? ' is-sel' : ''}`} onClick={() => setCriteria(c.key)} aria-pressed={criteria === c.key}>
                  <b>{c.title}</b>
                  <span className="st-badge">{c.badge}</span>
                  <p>{c.text}</p>
                </button>
              ))}
            </div>
          </section>

          <div className="st-row">
            <section className="st-card st-auto">
              <h3>Autonomy Level</h3>
              <div className="st-radios" role="radiogroup">
                {AUTONOMY.map(a => (
                  <button key={a.key} type="button" role="radio" aria-checked={autonomy === a.key} className={`st-radio${autonomy === a.key ? ' is-sel' : ''}`} onClick={() => setAutonomy(a.key)}>
                    <i />
                    <span>
                      <b>{a.title}{a.rec && <em>Recommend</em>}</b>
                      <p>{a.text}</p>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="st-card st-gen">
              <h3>Generate Cover letter &amp; resume</h3>
              <div className="st-gen-list">
                <div className="st-opt">
                  <div><b>Send a generated AI resume in job applications</b><p>Creates a unique letter tailored to the specific requirements of each job description.</p></div>
                  <Switch on={resume} onChange={setResume} label="Send a generated AI resume" />
                </div>
                <div className="st-opt">
                  <div><b>Generate a personalized cover letter for each job application</b><p>Optimizes keywords and formatting to match the job description, improving your ATS ranking.</p></div>
                  <Switch on={cover} onChange={setCover} label="Generate a personalized cover letter" />
                </div>
              </div>
            </section>
          </div>

          <section className="st-card">
            <div className="st-head">
              <h3>Email Forwarding Preferences</h3>
              <p>All messages will still be available in your inbox</p>
            </div>
            <div className="st-mails">
              {EMAILS.map(([k, label]) => (
                <div key={k} className="st-mail"><b>{label}</b><Switch on={mail[k]} onChange={v => setMail(m => ({ ...m, [k]: v }))} label={label} /></div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
