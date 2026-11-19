'use client';
// Chapter 01: how JobNova works, as two lanes. The top lane is what JobNova does; the
// bottom lane is where the person stays in control. One step plays at a time while the
// figure is on screen; hovering pauses it, clicking a step jumps to it. Reduced motion
// shows every step finished. Sample content, not product data.
import { useEffect, useRef, useState } from 'react';
import { BriefcaseBusiness, FileText, Send, ListChecks } from 'lucide-react';
import styles from './JobnovaFlow.module.css';

type Mode = 'idle' | 'run' | 'done';

const STEPS = [
  { Icon: BriefcaseBusiness, ai: 'Finds jobs', aiBody: 'Matches new roles to the profile and scores each one.', you: 'Say what you want', youBody: 'Roles, places and pay.' },
  { Icon: FileText, ai: 'Tailors the resume', aiBody: 'Rewrites it for each job and checks the ATS keywords.', you: 'Edit on the resume', youBody: 'Keep, change or undo any line.' },
  { Icon: Send, ai: 'Applies', aiBody: 'Fills in each form and submits, step by step.', you: 'Set the rules once', youBody: 'Which matches, with or without approval.' },
  { Icon: ListChecks, ai: 'Tracks', aiBody: 'Follows every application from queue to offer.', you: 'Step in when asked', youBody: 'A missing answer or a human check, by email.' },
];
const STEP_MS = 3000;
const LOOP_PAUSE = 1400;

function useTween(mode: Mode, from: number, to: number, ms = 1100) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (mode !== 'run') { setV(mode === 'done' ? to : from); return; }
    let raf = 0; const t0 = performance.now();
    const f = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(from + (to - from) * (1 - Math.pow(1 - k, 4))); if (k < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [mode, from, to, ms]);
  return v;
}

function useSteps(mode: Mode, count: number, every: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (mode !== 'run') { setN(mode === 'done' ? count : 0); return; }
    setN(0);
    const id = setInterval(() => setN(x => (x < count ? x + 1 : x)), every);
    return () => clearInterval(id);
  }, [mode, count, every]);
  return n;
}

const JOBS = [{ t: 'Product Designer', c: 'Figma', m: 93 }, { t: 'UX Designer', c: 'Stripe', m: 88 }, { t: 'Design Lead', c: 'Notion', m: 79 }];
function FindMini({ mode }: { mode: Mode }) {
  const n = useSteps(mode, JOBS.length, 380);
  return (
    <ul className={styles.jobs}>
      {JOBS.map((j, i) => (
        <li key={j.t} className={i < n ? styles.in : undefined}>
          <span className={styles.jobT}>{j.t}<em>{j.c}</em></span>
          <span className={styles.match}><i style={{ width: i < n ? `${j.m}%` : '0%' }} /></span>
          <b>{j.m}%</b>
        </li>
      ))}
    </ul>
  );
}

const KEYWORDS = ['Figma', 'A/B testing', 'Accessibility', 'Design systems'];
function TailorMini({ mode }: { mode: Mode }) {
  const score = useTween(mode, 5.2, 7.7);
  const n = useSteps(mode, KEYWORDS.length, 300);
  return (
    <div className={styles.tailor}>
      <div className={styles.score}><span className={styles.from}>5.2</span><span className={styles.arrow}>→</span><span className={styles.to}>{score.toFixed(1)}</span><small>fit for this job</small></div>
      <div className={styles.chips}>{KEYWORDS.map((k, i) => <span key={k} className={i < n ? styles.found : undefined}>{i < n ? '✓ ' : '+ '}{k}</span>)}</div>
    </div>
  );
}

const APPLY = ['Opening the form', 'Filling in your profile', 'Uploading the resume', 'Answering questions', 'Reviewing', 'Submitting'];
function ApplyMini({ mode }: { mode: Mode }) {
  const n = useSteps(mode, APPLY.length, 380);
  const label = n >= APPLY.length ? 'Submitted' : APPLY[n];
  return (
    <div className={styles.apply}>
      <div className={styles.segs}>{APPLY.map((s, i) => <i key={s} className={i < n ? styles.segOn : undefined} />)}</div>
      <p><b>{n >= APPLY.length ? 'Done' : `Step ${n + 1} of 6`}</b> {label}</p>
    </div>
  );
}

const STAGES = ['Applied', 'Interviewing', 'Offer'];
function TrackMini({ mode }: { mode: Mode }) {
  const n = useSteps(mode, 2, 700);
  return (
    <div className={styles.track}>
      <div className={styles.stages}>{STAGES.map((s, i) => <span key={s} className={i < n + 1 && i < 2 ? styles.stageOn : undefined}>{s}</span>)}</div>
      <p className={n >= 2 ? styles.invite : styles.wait}>{n >= 2 ? 'Interview · Thu 10:00, added to the calendar' : 'Waiting on the employer'}</p>
    </div>
  );
}

const MINIS = [FindMini, TailorMini, ApplyMini, TrackMini];

export default function JobnovaFlow() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(mq.matches); sync();
    mq.addEventListener('change', sync);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '-25% 0px' });
    if (ref.current) io.observe(ref.current);
    return () => { mq.removeEventListener('change', sync); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (still || !visible || paused) return;
    const last = active === STEPS.length - 1;
    const id = setTimeout(() => setActive(last ? 0 : active + 1), STEP_MS + (last ? LOOP_PAUSE : 0));
    return () => clearTimeout(id);
  }, [active, visible, paused, still]);

  const modeOf = (i: number): Mode => (still ? 'done' : i < active ? 'done' : i === active ? (visible ? 'run' : 'idle') : 'idle');

  return (
    <figure ref={ref} className={styles.flow} style={{ ['--p' as string]: still ? 1 : active / (STEPS.length - 1) }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className={styles.head}>
        <span className={styles.legend}><i className={styles.dotAi} />JobNova does the work</span>
        <span className={styles.legend}><i className={styles.dotYou} />You stay in control</span>
      </div>
      <div className={styles.lanes}>
      <span className={styles.rail} aria-hidden="true"><i /></span>
      <ol className={styles.steps}>
        {STEPS.map(({ Icon, ai, aiBody, you, youBody }, i) => {
          const mode = modeOf(i); const Mini = MINIS[i];
          return (
            <li key={ai} className={styles.step} data-mode={mode} onClick={() => setActive(i)}>
              <span className={styles.node} aria-hidden="true"><Icon size={16} strokeWidth={2} /></span>
              <div className={styles.ai}>
                <span className={styles.num}>0{i + 1}</span>
                <h3>{ai}</h3>
                <p>{aiBody}</p>
                <div className={styles.mini} aria-hidden="true"><Mini mode={mode} /></div>
              </div>
              <span className={styles.link} aria-hidden="true" />
              <div className={styles.you}>
                <span className={styles.youTag}>You</span>
                <h4>{you}</h4>
                <p>{youBody}</p>
              </div>
            </li>
          );
        })}
      </ol>
      </div>
      <figcaption className={styles.caption}>A new round starts every day as new jobs come in. Sample content.</figcaption>
    </figure>
  );
}
