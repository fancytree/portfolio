'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, FileText, Zap } from 'lucide-react';
import { Stage } from '../stageshow/kit/stage';
import { Window, Bar } from '../stageshow/kit/window';
import { Check } from '../stageshow/kit/parts/Check';
import { Meter } from '../stageshow/kit/parts/Meter';
import { Badge } from '../stageshow/kit/controls/Badge';
import { Button } from '../stageshow/kit/controls/Button';
import { Toggle } from '../stageshow/kit/controls/Toggle';
import { Count } from '../stageshow/kit/motion/Count';
import { Roll } from '../stageshow/kit/motion/Roll';
import type { Act } from '../stageshow/kit/act';
import './jobnova-cover.css';

// Beats: the resume is read, the user picks how strict matching should be and
// turns Auto Apply on; JobNova then works down the matched jobs by itself,
// filling in each application and marking it submitted, one after another.
type Phase = 'off' | 'scan' | 'queue' | 'submit';
type Scene = {
  resetting: boolean;
  /** Counts the cycles: keys the number parts so a reset remounts them instead of rolling them backwards. */
  run: number;
  resume: boolean;
  /** Matching strictness: 0 Explore All, 1 Balanced, 2 Precision Only. */
  criteria: number;
  on: boolean;
  phase: Phase;
  /** The job being filled in (-1 for none) and how far along its form is (0 to 2). */
  working: number;
  step: number;
  done: number;
};

const initial: Scene = { resetting: false, run: 0, resume: false, criteria: 0, on: false, phase: 'off', working: -1, step: 0, done: 0 };
const poster: Scene = { resetting: false, run: 0, resume: true, criteria: 1, on: true, phase: 'submit', working: -1, step: 0, done: 3 };

type Job = { id: string; title: string; company: string; logo?: string; meta: string; score: number };
const jobs: Job[] = [
  { id: 'cursor', title: 'Product Designer', company: 'Cursor', logo: '/img/jobnova/auto-apply-state-assets/company-cursor.png', meta: 'Remote · Full time · $120K–$150K', score: 93 },
  { id: 'accenture', title: 'UX Designer', company: 'Accenture', logo: '/img/jobnova/auto-apply-state-assets/company-accenture-mark.png', meta: 'Hybrid · Full time · $112K–$152K', score: 88 },
  { id: 'brightpath', title: 'Founding Product Designer', company: 'Brightpath', meta: 'Remote · Full time · $95K–$125K', score: 84 },
];
const criteria = [
  { name: 'Explore All', level: '>30% Match' },
  { name: 'Balanced', level: '>55% Match' },
  { name: 'Precision Only', level: '>80% Match' },
];
const steps = ['Reading the application form…', 'Filling in your details…', 'Attaching your resume…'];
const QUEUE = 12;

// Everything the run added goes while the cards and panel are masked: at the
// seam, and when a hover begins on the finished poster.
async function reset(a: Act<Scene>) {
  a.put({ resetting: true });
  await a.wait(320);
  await a.snap((s) => ({ ...initial, run: s.run + 1, resetting: true }));
  await a.wait(40);
  await a.set({ resetting: false });
  await a.wait(420);
}

async function script(a: Act<Scene>) {
  a.mark('opening');
  await reset(a);
  a.put({ resume: true });
  await a.wait(800);

  a.mark('preferences');
  await a.move({ at: 'crit-1' });
  await a.click({ at: 'crit-1' });
  a.put({ criteria: 1 });
  await a.wait(550);

  a.mark('enable');
  await a.move({ at: 'toggle' });
  await a.click({ at: 'toggle' });
  a.put({ on: true, phase: 'scan' });
  await a.wait(1000);
  a.put({ phase: 'queue' });
  await a.wait(750);

  a.mark('apply');
  for (let i = 0; i < jobs.length; i++) {
    a.put({ phase: 'submit', working: i, step: 0 });
    await a.wait(750);
    a.put({ step: 1 });
    await a.wait(750);
    a.put({ step: 2 });
    await a.wait(750);
    a.put({ working: -1, done: i + 1 });
    await a.wait(500);
  }
  a.mark('payoff');
  await a.move({ at: 'rest' });
  await a.wait(2400);

  a.mark('restart');
  await reset(a);
}

type CardState = 'idle' | 'queued' | 'applying' | 'applied';
const stateOf = (s: Scene, i: number): CardState => (!s.on ? 'idle' : i < s.done ? 'applied' : i === s.working ? 'applying' : 'queued');
const chipLabel: Record<CardState, string> = { idle: '', queued: 'Queued', applying: 'Applying…', applied: 'Applied' };

function CompanyLogo({ src }: { src: string }) {
  // Decorative: the company name sits beside it.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={14} height={14} />;
}

function Ring({ score, state }: { score: number; state: CardState }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <span className="jn-ring" data-state={state}>
      <svg viewBox="0 0 54 54" width="54" height="54" aria-hidden>
        <circle className="jn-ring__track" cx="27" cy="27" r={r} />
        <circle className="jn-ring__arc" cx="27" cy="27" r={r} strokeDasharray={`${(c * score) / 100} ${c}`} transform="rotate(-90 27 27)" />
      </svg>
      <span className="jn-ring__label"><b>{score}%</b><small>Match</small></span>
    </span>
  );
}

export default function JobNovaCover() {
  const figure = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // The illustration is inert so the project card stays one navigation
    // target. Listen on that link instead of the illustration's controls.
    const link = figure.current?.closest('a');
    if (!link) return;
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') setPlaying(true);
    };
    const leave = () => setPlaying(false);
    link.addEventListener('pointerenter', enter);
    link.addEventListener('pointerleave', leave);
    link.addEventListener('pointercancel', leave);
    return () => {
      link.removeEventListener('pointerenter', enter);
      link.removeEventListener('pointerleave', leave);
      link.removeEventListener('pointercancel', leave);
    };
  }, []);

  return (
    <figure ref={figure} className="jn-cover" aria-label="With a resume and a few preferences, JobNova's Auto Apply works through matched jobs on its own, filling in each application and marking it submitted.">
      <Stage<Scene> width={800} height={500} initial={initial} poster={poster} script={playing ? script : undefined} play="loop" fidelity="standard" accent="#9ae600" greys="cool" cursor={{ at: { x: 430, y: 82 }, idle: 1400 }} className="jn-scene">
        {(s) => {
          const queued = s.on ? QUEUE - s.done : 0;
          return <>
            <span className="jn-rest" data-target="rest" />
            <div className="jn-composition" data-resetting={s.resetting || undefined}>
              <Window className="jn-win" url="jobnova.ai/jobs" body={{ className: 'jn-body' }}>
                <header className="jn-head">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="jn-logo" src="/img/jobnova/page-design/logo.png" alt="" width={83} height={18} />
                  <span className="jn-tab" data-active>Matched Jobs</span>
                  <span className="jn-tab">Liked <i>2</i></span>
                  <span className="jn-credits"><Zap size={12} fill="currentColor" strokeWidth={0} />230</span>
                </header>

                <div className="jn-main">
                  <div className="jn-list">
                    {jobs.map((job, i) => {
                      const st = stateOf(s, i);
                      const text = st === 'idle' ? 'Matches your resume and preferences' : st === 'queued' ? 'Your application is in line and will submit automatically.' : st === 'applying' ? steps[s.step] : 'Your application was automatically submitted.';
                      return <article key={job.id} className="jn-card" data-state={st}>
                        <Ring score={job.score} state={st} />
                        <div className="jn-card__body">
                          <div className="jn-chips">
                            <Badge className="jn-chip" data-on={st !== 'idle' || undefined} data-state={st}><Roll variant="fade">{chipLabel[st] || 'Queued'}</Roll></Badge>
                            <Badge>1 hours ago</Badge>
                          </div>
                          <div className="jn-title">{job.title}</div>
                          <div className="jn-company">
                            {job.logo ? <CompanyLogo src={job.logo} /> : <Bar w={14} h={14} r={4} tone={3} />}
                            <span>{job.company}</span><i>·</i><span>{job.meta}</span>
                          </div>
                        </div>
                        <footer className="jn-foot">
                          <Roll variant="fade" className="jn-foot__text">{text}</Roll>
                          <span className="jn-act">
                            <span className="jn-act__progress" data-on={st === 'applying' || undefined}><Meter value={st === 'applying' ? (s.step + 1) / 3 : 0} className="jn-meter" /></span>
                            <span className="jn-act__button" data-on={st !== 'applying' || undefined}>
                              <Button className="jn-btn" variant="primary" size="small" trailingIcon={st === 'idle' ? <ArrowUpRight size={12} strokeWidth={2} /> : undefined}>{st === 'idle' ? 'Apply Now' : st === 'queued' ? 'Move to Front' : 'View Application'}</Button>
                            </span>
                          </span>
                        </footer>
                      </article>;
                    })}
                  </div>

                  <aside className="jn-panel">
                    <div className="jn-panel__head"><Zap size={14} fill="currentColor" strokeWidth={0} /><span>Auto Apply</span><Toggle data-target="toggle" on={s.on} /></div>
                    <div className="jn-phases">
                      {([['scan', 'Scanning'], ['queue', 'Queued'], ['submit', 'Submitting']] as const).map(([key, label]) => <span key={key} data-on={s.phase === key || undefined}><i />{label}</span>)}
                    </div>
                    <div className="jn-counts">
                      <div><b className="jn-counts__done"><Count key={s.run} value={s.done} /></b><small>Submitted</small></div>
                      <div><b><Count key={s.run} value={queued} /></b><small>In queue</small></div>
                    </div>

                    <div className="jn-section">
                      <small>Resume</small>
                      <div className="jn-file"><FileText size={14} strokeWidth={1.75} /><span>Alex_Chen_Resume.pdf</span><Check on={s.resume} pending={!s.resume} size={14} /></div>
                    </div>
                    <div className="jn-section">
                      <small>Job matching</small>
                      {criteria.map((c, i) => <div key={c.name} className="jn-option" data-target={`crit-${i}`} data-on={s.criteria === i || undefined}><i /><span>{c.name}</span><em>{c.level}</em></div>)}
                    </div>
                    <div className="jn-section">
                      <small>Autonomy</small>
                      <div className="jn-option" data-on><i /><span>Apply instantly</span><em>Recommend</em></div>
                    </div>
                  </aside>
                </div>
              </Window>
            </div>
          </>;
        }}
      </Stage>
    </figure>
  );
}
