// Chapter 03: how the first version was designed, and what it was built from.
// The process strip names each step and what it produced; the map shows the shipped
// structure, flagging the two modules the redesign later replaced and why.
import styles from './JobnovaFirstVersion.module.css';

const PROCESS = [
  { title: 'Research', did: '20+ interviews and a journey map.', out: 'Three needs: judge the fit, check the AI’s work, choose how much it may do.' },
  { title: 'Structure', did: 'One journey in four modules, on one shared profile.', out: 'The information architecture below.' },
  { title: 'Rules', did: 'Auto Apply acts only within rules people set.', out: 'A permission model: which jobs, when, what it sends.' },
  { title: 'System', did: 'One component language for AI states and UI.', out: 'Design system and application card states.' },
  { title: 'Test', did: 'Step-by-step onboarding, A/B tested for a week.', out: 'Setup completion 73% → 96%, 100+ users.' },
];

type Module = {
  title: string; img: string; alt: string;
  parts: { name: string; detail: string }[];
  options?: { q: string; a: string[] }[];
  stuck?: { chapter: string; note: string };
};

const MODULES: Module[] = [
  {
    title: 'Matching', img: '/img/jobnova/evidence/matched-jobs-current.webp', alt: 'First version: recommended jobs with match scores',
    parts: [
      { name: 'Jobs', detail: 'Recommended and direct-hire roles, each with a match score.' },
      { name: 'Job detail', detail: 'Why it fits, and an Agent to ask about the role.' },
    ],
  },
  {
    title: 'Resume tailoring', img: '/img/jobnova/evidence/resume-overview-editor.webp', alt: 'First version: tailored resume drawer with Overview and Editor tabs',
    parts: [
      { name: 'Tailored resume drawer', detail: 'Opened from a job, beside a preview.' },
      { name: 'Overview tab', detail: 'Score and a summary of changes.' },
      { name: 'Editor tab', detail: 'One form per resume section.' },
    ],
    stuck: { chapter: '04–05', note: 'Only 17% opened the Editor tab.' },
  },
  {
    title: 'Auto Apply rules', img: '/img/jobnova/evidence/auto-apply-rules.webp', alt: 'First version: Auto Apply rules with match strategy and approval modes',
    parts: [{ name: 'Rules', detail: 'Three questions, answered once.' }],
    options: [
      { q: 'Which jobs', a: ['Explore all', 'Balanced', 'Precision only'] },
      { q: 'When it submits', a: ['Instantly', 'After 24 hours', 'With approval'] },
      { q: 'What it sends', a: ['Tailored resume', 'Cover letter'] },
    ],
  },
  {
    title: 'Tracking', img: '/img/jobnova/evidence/application-dashboard-current.webp', alt: 'First version: applications dashboard with status tabs',
    parts: [
      { name: 'Applications', detail: 'Totals and a funnel, then tabs: Queued, In process, Submitted, Failed.' },
      { name: 'Inbox', detail: 'Replies from employers.' },
    ],
    stuck: { chapter: '06–07', note: 'Tabs followed the system, and failures gave no reason.' },
  },
];

export function FirstVersionProcess() {
  return (
    <ol className={styles.process} aria-label="How the first version was designed">
      {PROCESS.map((p, i) => (
        <li key={p.title}>
          <span className={styles.pNum}>0{i + 1}</span>
          <h3>{p.title}</h3>
          <p>{p.did}</p>
          <p className={styles.out}>{p.out}</p>
        </li>
      ))}
    </ol>
  );
}

export function FirstVersionMap() {
  return (
    <figure className={styles.map}>
      <figcaption className={styles.mapTitle}>The first version’s structure</figcaption>
      <div className={styles.base}>
        <b>Shared profile</b>
        <span>Profile · Base resume · Job preference</span>
        <em>Set up once in onboarding, used by every module</em>
      </div>
      <div className={styles.ticks} aria-hidden="true">{MODULES.map(m => <i key={m.title} />)}</div>
      <ol className={styles.modules}>
        {MODULES.map(m => (
          <li key={m.title} className={m.stuck ? styles.flagged : undefined}>
            <a className={styles.shot} href={m.img} target="_blank" rel="noreferrer" aria-label={`Open full-size image: ${m.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt={m.alt} loading="lazy" />
            </a>
            <h3>{m.title}</h3>
            <ul className={styles.parts}>
              {m.parts.map(p => <li key={p.name}><b>{p.name}</b>{p.detail}</li>)}
            </ul>
            {m.options ? (
              <dl className={styles.options}>
                {m.options.map(o => (
                  <div key={o.q}><dt>{o.q}</dt><dd>{o.a.map(a => <span key={a}>{a}</span>)}</dd></div>
                ))}
              </dl>
            ) : null}
            {m.stuck ? (
              <p className={styles.stuck}><span>Iterated in {m.stuck.chapter}</span>{m.stuck.note}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
