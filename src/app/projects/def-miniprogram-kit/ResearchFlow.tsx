import styles from './ResearchFlow.module.css';

/* The blue words are what the four reasons have in common. */
const reasons = [
  { before: 'Anything new from ', own: 'my brands', after: '?', answer: 'Your ranges' },
  { before: 'Is ', own: 'my item', after: ' back in stock?', answer: 'Restock' },
  { before: 'Any offer on ', own: 'what I buy', after: '?', answer: 'Offers on what you buy' },
  { before: 'Otherwise, ', own: 'buy it again', after: '.', answer: 'Buy again' },
];

function Bar({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`${styles.bar} ${strong ? styles.strongBar : ''}`}>
      <span className={styles.barLabel}>{label}</span>
      <span className={styles.track} aria-hidden="true"><span className={styles.fill} style={{ '--value': `${value}%` } as React.CSSProperties} /></span>
      <span className={styles.barValue}>{value}%</span>
    </div>
  );
}

/** Ask, check, decide: the research as one chain. */
export function ResearchFlow() {
  return (
    <ol className={styles.flow}>
      <li className={styles.step}>
        <p className={styles.title}><span className={styles.number}>1</span>Ask: why do you open the store?</p>
        <ul className={styles.four}>
          {reasons.map((r) => (
            <li key={r.answer} className={styles.card}>
              {r.before}<em>{r.own}</em>{r.after}
            </li>
          ))}
        </ul>
        <p className={styles.finding}>All four are about things they already buy.</p>
      </li>

      <li className={styles.step}>
        <p className={styles.title}><span className={styles.number}>2</span>Check: do the orders agree?</p>
        <div className={styles.two}>
          <div className={styles.card}>
            <p className={styles.claim}>They buy the same products again</p>
            <Bar label="Repeat accounts that rebought a product" value={85} strong />
          </div>
          <div className={styles.card}>
            <p className={styles.claim}>New shades sell within known ranges</p>
            <Bar label="Accounts buying the range" value={13} strong />
            <Bar label="Other accounts" value={1} />
          </div>
        </div>
      </li>

      <li className={styles.step}>
        <p className={styles.title}><span className={styles.number}>3</span>Decide</p>
        <p className={styles.verdict}>Coming back for what they buy gets its own tab: <strong>Saved</strong>.</p>
        <ul className={styles.four} aria-label="What Saved answers, in the order of the four questions">
          {reasons.map((r) => <li key={r.answer} className={styles.answer}>{r.answer}</li>)}
        </ul>
      </li>
    </ol>
  );
}
