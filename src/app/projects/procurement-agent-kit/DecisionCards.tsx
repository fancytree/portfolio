/**
 * Decision records for the Procurement Agent case. Each card shows the choice that
 * was on the table, every option weighed, the evidence behind the pick, and the cost
 * accepted. Content is drawn from the DEF project's decision log (DEC-xxx).
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

export type DecisionOption = { label: string; verdict: string; chosen?: boolean; reversed?: boolean };
export type Decision = {
  question: string;
  /** Internal decision-log reference; kept for traceability, not shown to readers. */
  source: string;
  options: DecisionOption[];
  /** Only when there is an observed fact behind the pick (data, an interview, a test). Leave out rather than pad. */
  evidence?: string;
  /** Only when the pick cost something real. Leave out rather than pad. */
  tradeoff?: string;
  /** The screen this decision produced, shown beside it so the reader can match decision and design. */
  /** For decisions about a process rather than a screen: an animated diagram instead of a screenshot. */
  /** wide: a large diagram goes above the decision, full width, instead of beside it. */
  diagram?: { node: ReactNode; caption: string; wide?: boolean };
  shot?: { src: string; width: number; height: number; alt: string; caption: string; marks?: readonly { label: string; x: number; y: number; w: number; h: number }[] };
};

/** start：从第几号开始编号（某个决定放在后面的章节里时，编号接着前面的） */
export function DecisionCards({ items, start = 1 }: { items: Decision[]; start?: number }) {
  return (
    <ol className="case-decisions" aria-label="Design decisions with the options considered">
      {items.map((decision, index) => (
        <li key={decision.question} className={`case-decision${decision.shot || decision.diagram ? ' has-shot' : ''}${decision.diagram?.wide ? ' is-wide' : ''}`}>
          {decision.shot && (
            <figure className="case-decision-shot">
              {/* Frame keeps the image's own ratio (max 680px tall) so callouts line up with the pixels under them. */}
              <a className="case-decision-frame" href={decision.shot.src} target="_blank" rel="noreferrer" aria-label={`Open full-size screenshot: ${decision.shot.alt}`}
                style={{ width: `min(100%, ${Math.round((680 * decision.shot.width) / decision.shot.height)}px)` }}>
                <Image src={decision.shot.src} alt={decision.shot.alt} width={decision.shot.width} height={decision.shot.height} sizes="(min-width: 1024px) 780px, 100vw" unoptimized />
                {decision.shot.marks?.map((m) => (
                  <span key={m.label} className="case-decision-mark-box" style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }} aria-hidden="true">
                    <span className={`case-decision-mark-label${m.y < 14 && m.y + m.h > 86 ? ' is-inside' : m.y < 14 ? ' is-below' : ''}${m.x + m.w > 70 ? ' is-right' : ''}`}>{m.label}</span>
                  </span>
                ))}
              </a>
              {decision.shot.marks?.length ? <ul className="sr-only">{decision.shot.marks.map((m) => <li key={m.label}>{m.label}</li>)}</ul> : null}
              <figcaption>{decision.shot.caption}</figcaption>
            </figure>
          )}
          {decision.diagram && (
            <figure className="case-decision-shot is-diagram">
              <div className="case-decision-diagram">{decision.diagram.node}</div>
              <figcaption>{decision.diagram.caption}</figcaption>
            </figure>
          )}
          <div className="case-decision-body">
          <header className="case-decision-head">
            <span className="case-decision-num">{String(index + start).padStart(2, '0')}</span>
            <h3 className="case-decision-question">{decision.question}</h3>
          </header>
          <ul className="case-decision-options">
            {decision.options.map((option) => (
              <li key={option.label} className={`case-decision-option${option.chosen ? ' is-chosen' : ''}`}>
                <span className="case-decision-mark" aria-hidden="true">{option.chosen ? '✓' : '✕'}</span>
                <span className="case-decision-text">
                  <span className="case-decision-label">
                    {option.label}
                    {option.chosen ? <em className="case-decision-badge">Chosen</em> : null}
                    {option.reversed ? <em className="case-decision-badge is-reversed">First pick, later reversed</em> : null}
                    <span className="sr-only">{option.chosen ? ' (chosen)' : ' (rejected)'}</span>
                  </span>
                  <span className="case-decision-verdict">{option.verdict}</span>
                </span>
              </li>
            ))}
          </ul>
          {(decision.evidence || decision.tradeoff) && (
            <dl className={`case-decision-foot${decision.evidence && decision.tradeoff ? '' : ' is-single'}`}>
              {decision.evidence && <div><dt>Evidence</dt><dd>{decision.evidence}</dd></div>}
              {decision.tradeoff && <div><dt>Cost I accepted</dt><dd>{decision.tradeoff}</dd></div>}
            </dl>
          )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export type Reversal = { before: string; evidence: string; after: string; source: string };

/** Where evidence overturned what I had designed. */
export function ReversalList({ items }: { items: Reversal[] }) {
  return (
    <ol className="case-reversals" aria-label="Design assumptions that evidence overturned">
      {items.map((item) => (
        <li key={item.before} className="case-reversal">
          <div className="case-reversal-col">
            <span className="case-reversal-tag">I designed</span>
            <p>{item.before}</p>
          </div>
          <div className="case-reversal-col case-reversal-evidence">
            <span className="case-reversal-tag">Then I learned</span>
            <p>{item.evidence}</p>
          </div>
          <div className="case-reversal-col case-reversal-after">
            <span className="case-reversal-tag">So I changed it to</span>
            <p>{item.after}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
