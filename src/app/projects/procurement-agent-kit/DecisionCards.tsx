/**
 * Decision records for the Procurement Agent case. Each card shows the choice that
 * was on the table, every option weighed, the evidence behind the pick, and the cost
 * accepted. Content is drawn from the DEF project's decision log (DEC-xxx).
 */

export type DecisionOption = { label: string; verdict: string; chosen?: boolean; reversed?: boolean };
export type Decision = {
  question: string;
  source: string;
  options: DecisionOption[];
  evidence: string;
  tradeoff: string;
};

export function DecisionCards({ items }: { items: Decision[] }) {
  return (
    <ol className="case-decisions" aria-label="Design decisions with the options considered">
      {items.map((decision, index) => (
        <li key={decision.question} className="case-decision">
          <header className="case-decision-head">
            <span className="case-decision-num">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="case-decision-question">{decision.question}</h3>
            <span className="case-decision-source">{decision.source}</span>
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
          <dl className="case-decision-foot">
            <div>
              <dt>Evidence</dt>
              <dd>{decision.evidence}</dd>
            </div>
            <div>
              <dt>Cost I accepted</dt>
              <dd>{decision.tradeoff}</dd>
            </div>
          </dl>
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
            <span className="case-reversal-source">{item.source}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
