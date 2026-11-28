import type { ReactNode } from 'react';
import s from './Beats.module.css';

/** A short label that opens a block inside an iteration: what I saw, what I changed. */
export function Label({ children }: { children: ReactNode }) {
  return <p className={s.beat}>{children}</p>;
}

type Stop = { href: string; version: string; date: string; title: string; body: string };

/** The four versions of card creation, in order, each linked to its chapter. */
export function Timeline({ stops }: { stops: Stop[] }) {
  return (
    <ol className={s.timeline} aria-label="Four versions of card creation">
      {stops.map((stop, i) => (
        <li key={stop.href} className={i === stops.length - 1 ? s.now : undefined}>
          <a href={stop.href} className={s.stop}>
            <span className={s.dot} aria-hidden="true" />
            <span className={s.when}>{stop.version} · {stop.date}</span>
            <span className={s.stopTitle}>{stop.title}</span>
            <span className={s.stopBody}>{stop.body}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/** What one version taught, carried into the next. */
export function CarryOver({ children }: { children: ReactNode }) {
  return <p className={s.carry}><span>Into the next version</span>{children}</p>;
}

/**
 * A design read from the learner's side, beside the screens it produced, drawn as a
 * short flow rather than paragraphs: the need, the ways in the design offers, where
 * they meet, and how that met the need. Same card shape as the decision cards.
 */
type Step = { title: string; sub?: string };
export function NeedBeside({ screen, title, need, branches, merge, met }: {
  screen: ReactNode; title: string; need: Step; branches: Step[]; merge: Step; met: Step;
}) {
  return (
    <div className={s.beside}>
      <figure className={s.besideScreen}>{screen}</figure>
      <div className={s.needCard}>
        <header className={s.needHead}>
          <span className={s.needKicker}>For the learner</span>
          <h3 className={s.needTitle}>{title}</h3>
        </header>
        <ol className={s.flowList}>
          <li className={s.flowStage}>
            <span className={s.flowTag}>What they needed</span>
            <span className={`${s.node} ${s.nodeNeed}`}><b>{need.title}</b>{need.sub && <span>{need.sub}</span>}</span>
          </li>
          <li className={s.flowStage}>
            <span className={s.flowTag}>What I designed</span>
            <span className={s.fan} style={{ ['--n' as string]: branches.length }}>
              {branches.map((b) => (
                <span key={b.title} className={`${s.node} ${s.nodeBranch}`}><b>{b.title}</b>{b.sub && <span>{b.sub}</span>}</span>
              ))}
            </span>
            <span className={`${s.node} ${s.nodeDesign}`}><b>{merge.title}</b>{merge.sub && <span>{merge.sub}</span>}</span>
          </li>
          <li className={s.flowStage}>
            <span className={s.flowTag}>How it met the need</span>
            <span className={`${s.node} ${s.nodeMet}`}><b>{met.title}</b>{met.sub && <span>{met.sub}</span>}</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

/** What happened after a design shipped: one tile per outcome, an icon, a few words. */
const OUTCOME_ICONS = {
  check: 'M9.55 15.15l8.48-8.48a1 1 0 0 1 1.4 1.42l-9.17 9.2a1 1 0 0 1-1.42 0L4.55 13a1 1 0 0 1 1.42-1.42z',
  coin: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 4a1 1 0 0 0-1 1v.6a2.9 2.9 0 0 0 .5 5.6h1a.9.9 0 0 1 0 1.8h-2.4a1 1 0 1 0 0 2H11v.5a1 1 0 1 0 2 0v-.6a2.9 2.9 0 0 0-.5-5.7h-1a.9.9 0 0 1 0-1.8h2.4a1 1 0 1 0 0-2H13V7a1 1 0 0 0-1-1Z',
  broken: 'M10.6 7.8 9.2 9.2 7.8 7.8a3 3 0 0 0-4.24 4.24l1.42 1.41-1.42 1.42-1.41-1.42a5 5 0 0 1 7.07-7.07l1.38 1.42Zm2.8 8.4 1.4-1.4 1.4 1.4a3 3 0 0 0 4.24-4.24l-1.42-1.41 1.42-1.42 1.41 1.42a5 5 0 0 1-7.07 7.07l-1.38-1.42ZM7.7 3.3l1.4-.4.9 3.1-1.4.4-.9-3.1Zm6.3 17.4 1.4-.4-.9-3.1-1.4.4.9 3.1ZM3.3 7.7l3.1.9.4-1.4-3.1-.9-.4 1.4Zm17.4 8.6-3.1-.9-.4 1.4 3.1.9.4-1.4Z',
  distort: 'M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v2c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2V8Zm0 7c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v2c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2v-2Z',
  unopened: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 0v9h3.5a1 1 0 0 1 .9.55l.73 1.45h3.74l.73-1.45a1 1 0 0 1 .9-.55H19V5H5Z',
  notMine: 'M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.3 3.1-6 7-6 1 0 2 .2 2.9.5A5.5 5.5 0 0 0 13 20H3Zm14.3-3.7 1.4-1.4 1.4 1.4 1.4-1.4 1.4 1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4-1.4-1.4Z',
} as const;
export type OutcomeIcon = keyof typeof OUTCOME_ICONS;

export function Outcomes({ items, head = 'What happened' }: { items: { tone: 'good' | 'bad'; icon: OutcomeIcon; title: string; sub: string }[]; head?: string }) {
  return (
    <div className={s.outcomes}>
      <span className={s.outcomesHead}>{head}</span>
      <ul className={s.outcomeGrid} style={{ ['--n' as string]: items.length }}>
        {items.map((o) => (
          <li key={o.title} className={`${s.outcome} ${o.tone === 'good' ? s.good : s.bad}`}>
            <span className={s.outcomeIcon}><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={OUTCOME_ICONS[o.icon]} /></svg></span>
            <b>{o.title}</b>
            <span>{o.sub}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Two lists side by side: what the host decides, and what MemQ keeps within it. */
export function HostSplit({ host, keep }: { host: string[]; keep: string[] }) {
  return (
    <div className={s.split}>
      <div className={s.splitCol}><span className={s.splitHead}>The host sets</span><ul>{host.map((x) => <li key={x}>{x}</li>)}</ul></div>
      <span className={s.splitArrow} aria-hidden="true">→</span>
      <div className={`${s.splitCol} ${s.splitKeep}`}><span className={s.splitHead}>MemQ keeps</span><ul>{keep.map((x) => <li key={x}>{x}</li>)}</ul></div>
    </div>
  );
}

/** The page root: MemQ's purple in place of the case kit's blue, for every shared component below. */
export function MemQTone({ children }: { children: ReactNode }) {
  return <div className={s.tone}>{children}</div>;
}
