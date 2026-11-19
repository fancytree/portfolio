'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { BRAND_LOGOS } from '../../../components/jobs/brandLogos'

type Cat = 'Interview invitation' | 'Additional info request' | 'Position Status Update' | 'Application Acknowledgement' | 'Rejection'

type Mail = { id: number; company: string; time: string; date: string; subject: string; snippet: string; cat: Cat; unread?: boolean; analysis: string; body: string[] }

const MAILS: Mail[] = [
  { id: 1, company: 'Cursor AI', time: '10:30 AM', date: 'Fri, Nov 28, 2025, 10:30 AM', subject: "Interview invitation: Design Engineer", snippet: 'We would love to invite you to a 45-minute interview with our design team next week…', cat: 'Interview invitation', unread: true, analysis: "They are inviting you to a 45-minute video interview next week. Three time slots are offered; the earliest is Tuesday 10:00 AM PT.", body: ['Hi Alex,', 'Thanks for applying to the Design Engineer role at Cursor AI. We were impressed by your portfolio and would love to invite you to a 45-minute video interview with our design team next week.', 'Please reply with the time that works best for you: Tuesday 10:00 AM PT, Wednesday 2:00 PM PT or Thursday 11:30 AM PT.', 'Best,\nMaya\nCursor AI Recruiting'] },
  { id: 2, company: 'Linear', time: '9:15 AM', date: 'Fri, Nov 28, 2025, 9:15 AM', subject: 'Additional info request: Portfolio link', snippet: 'Could you share a link to your portfolio or a few case studies we can review before…', cat: 'Additional info request', unread: true, analysis: 'The recruiter needs a portfolio link or two case studies before the next stage. A reply with links is enough.', body: ['Hi Alex,', 'Thank you for your application to the Staff Product Designer role. Before we move you to the next stage, could you share a link to your portfolio or two case studies we can review?', 'If any of the work is under NDA, a short written summary is fine.', 'Thanks,\nJonas\nLinear People Team'] },
  { id: 3, company: 'Backd Business Funding', time: 'Yesterday', date: 'Thu, Nov 27, 2025, 4:48 PM', subject: 'Interview invitation: UX Designer', snippet: 'Your application stood out. Are you available for a quick intro call on Monday?', cat: 'Interview invitation', unread: true, analysis: 'A 20-minute intro call is proposed for Monday. They ask you to confirm availability by Friday.', body: ['Hi Alex,', 'Your application stood out to us. Are you available for a 20-minute intro call on Monday afternoon?', 'Please confirm by Friday and we will send a calendar invite.', 'Regards,\nPriya\nBackd Talent'] },
  { id: 4, company: 'Michael Intl', time: '2 days ago', date: 'Wed, Nov 26, 2025, 11:02 AM', subject: 'Position Status Update', snippet: 'Your application is now with the hiring manager. We will be in touch within five business days…', cat: 'Position Status Update', analysis: 'No action needed. Your application moved to the hiring manager; expect an update within five business days.', body: ['Hi Alex,', 'A quick update: your application is now with the hiring manager. We will be in touch within five business days.', 'Thank you for your patience.', 'The Hiring Team'] },
  { id: 5, company: 'DD Studio', time: '2 days ago', date: 'Wed, Nov 26, 2025, 9:40 AM', subject: 'Application Acknowledgement', snippet: 'Thanks for applying. We have received your application and will review it shortly…', cat: 'Application Acknowledgement', analysis: 'Confirmation that your application was received. Nothing to do now.', body: ['Hi Alex,', 'Thanks for applying to Visual Designer at DD Studio. We have received your application and will review it shortly.', 'Best,\nDD Studio'] },
  { id: 6, company: 'Stripe', time: '3 days ago', date: 'Tue, Nov 25, 2025, 3:15 PM', subject: 'Additional info request: Work authorization', snippet: 'Please confirm your current work authorization status so we can move forward…', cat: 'Additional info request', analysis: 'They need you to confirm your work authorization status before moving forward.', body: ['Hi Alex,', 'To move your application forward, please confirm your current work authorization status and whether you would require sponsorship now or in the future.', 'Thanks,\nStripe Recruiting'] },
  { id: 7, company: 'Vercel', time: '3 days ago', date: 'Tue, Nov 25, 2025, 1:20 PM', subject: 'Position Status Update', snippet: 'The team is reviewing a high number of applications. We will update you next week…', cat: 'Position Status Update', analysis: 'The role is still open and under review. An update is expected next week.', body: ['Hi Alex,', 'The team is reviewing a high number of applications for Platform Designer. We will update you next week.', 'The Vercel Talent Team'] },
  { id: 8, company: 'Notion', time: '4 days ago', date: 'Mon, Nov 24, 2025, 5:05 PM', subject: 'Application Acknowledgement', snippet: 'We received your application for Senior Product Designer. A recruiter will review…', cat: 'Application Acknowledgement', analysis: 'Your application was received and queued for recruiter review.', body: ['Hi Alex,', 'We received your application for Senior Product Designer. A recruiter will review it and follow up if there is a match.', 'Notion Recruiting'] },
  { id: 9, company: 'Figma', time: '5 days ago', date: 'Sun, Nov 23, 2025, 10:10 AM', subject: 'Update on your application', snippet: 'Thank you for your interest. After careful consideration we will not be moving forward…', cat: 'Rejection', analysis: 'The company decided not to move forward with your application for this role.', body: ['Hi Alex,', 'Thank you for your interest in Figma. After careful consideration, we will not be moving forward with your application at this time.', 'We encourage you to apply again for future roles.', 'Figma Recruiting'] },
  { id: 10, company: 'Anthropic', time: '5 days ago', date: 'Sun, Nov 23, 2025, 8:30 AM', subject: 'Interview invitation: Brand Designer', snippet: 'We would like to schedule a portfolio review with the design leads…', cat: 'Interview invitation', analysis: 'A portfolio review with the design leads is proposed. Reply with your availability.', body: ['Hi Alex,', 'We would like to schedule a portfolio review with our design leads. Please reply with your availability over the next two weeks.', 'Anthropic Recruiting'] },
  { id: 11, company: 'Railway', time: '6 days ago', date: 'Sat, Nov 22, 2025, 2:14 PM', subject: 'Update on your application', snippet: 'We have decided to move forward with other candidates for this position…', cat: 'Rejection', analysis: 'The position was filled with other candidates.', body: ['Hi Alex,', 'We have decided to move forward with other candidates for the UX Researcher position. Thank you for taking the time to apply.', 'Railway Team'] },
]

const COUNTS: Record<string, number> = { All: 1623, 'Interview invitation': 4, 'Additional info request': 29, 'Position Status Update': 32, 'Application Acknowledgement': 32, Rejection: 32 }
const TABS = ['All', 'Interview invitation', 'Additional info request', 'Position Status Update', 'Application Acknowledgement', 'Rejection']
const CAT_CLASS: Record<Cat, string> = {
  'Interview invitation': 'ib-cat--amber',
  'Additional info request': 'ib-cat--lime',
  'Position Status Update': 'ib-cat--line',
  'Application Acknowledgement': 'ib-cat--line',
  Rejection: 'ib-cat--line',
}

function Av({ name }: { name: string }) {
  const src = BRAND_LOGOS[name]
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img className="ib-av" src={src} alt="" />
  return <span className="ib-av ib-av--init">{name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</span>
}

export default function InboxView() {
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(1)
  const [read, setRead] = useState<Set<number>>(new Set())
  const strip = useRef<HTMLDivElement>(null)

  const list = useMemo(() => MAILS.filter(m => (tab === 'All' || m.cat === tab) && `${m.company} ${m.subject} ${m.snippet}`.toLowerCase().includes(q.toLowerCase())), [tab, q])
  const cur = list.find(m => m.id === sel) ?? list[0]
  const scroll = (d: number) => strip.current?.scrollBy({ left: d * 240, behavior: 'smooth' })

  return (
    <div className="ib">
      <label className="ib-search"><Search size={18} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search companies, keywords, or job titles…" /></label>

      <div className="ib-tabs">
        <button className="ib-arrow" onClick={() => scroll(-1)} aria-label="Scroll left"><ArrowLeft size={14} /></button>
        <div className="ib-strip" ref={strip}>
          {TABS.map(t => (
            <button key={t} className={`ib-tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
              {t}
              <span className={`ib-n${t === 'Interview invitation' ? ' ib-n--amber' : t === 'Additional info request' ? ' ib-n--lime' : ''}`}>{COUNTS[t].toLocaleString()}</span>
            </button>
          ))}
        </div>
        <button className="ib-arrow" onClick={() => scroll(1)} aria-label="Scroll right"><ArrowRight size={14} /></button>
      </div>

      <div className="ib-panes">
        <div className="ib-list">
          {list.length === 0 && <p className="ib-empty">No messages.</p>}
          {list.map(m => (
            <button key={m.id} className={`ib-item${cur?.id === m.id ? ' is-sel' : ''}`} onClick={() => { setSel(m.id); setRead(r => new Set(r).add(m.id)) }}>
              <span className="ib-av-wrap">
                <Av name={m.company} />
                {m.unread && !read.has(m.id) && <span className="ib-dot" aria-label="Unread" />}
              </span>
              <span className="ib-item-main">
                <span className="ib-row"><b>{m.company}</b><em>{m.time}</em></span>
                <span className="ib-subj">{m.subject}</span>
                <span className="ib-snip">{m.snippet}</span>
                <span className={`ib-cat ${CAT_CLASS[m.cat]}`}>{m.cat}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="ib-detail">
          {cur ? (
            <div className="ib-detail-in" key={cur.id}>
              <span className={`ib-cat ib-cat--lg ${CAT_CLASS[cur.cat]}`}>{cur.cat}</span>
              <h2>{cur.subject}</h2>
              <div className="ib-meta">
                <div className="ib-meta-top"><Av name={cur.company} /><div><b>{cur.company}</b><span>to me</span></div><em>{cur.date}</em></div>
                <hr />
                <div className="ib-ai"><label>AI Analysis:</label><p>{cur.analysis}</p></div>
              </div>
              <div className="ib-body">{cur.body.map((p, i) => <p key={i}>{p}</p>)}</div>
            </div>
          ) : <p className="ib-empty">Select a message.</p>}
        </div>
      </div>
    </div>
  )
}
