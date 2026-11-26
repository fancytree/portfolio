'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ResearchFlow.module.css';

/* The blue words are what the four reasons have in common. */
const reasons = [
  { before: 'Anything new from ', own: 'my brands', after: '?', answer: 'Your ranges' },
  { before: 'Is ', own: 'my item', after: ' back in stock?', answer: 'Restock' },
  { before: 'Any offer on ', own: 'what I buy', after: '?', answer: 'Offers on what you buy' },
  { before: 'Otherwise, ', own: 'buy it again', after: '.', answer: 'Buy again' },
];

/* Reveal order: questions, the common thread, the order data, its bars, the conclusion, the answers. */
const DELAYS = [200, 1800, 1500, 500, 1800, 1100];
const LAST = DELAYS.length;

function Bar({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={`${styles.bar} ${strong ? styles.strongBar : ''}`}>
      <span className={styles.barLabel}>{label}</span>
      <span className={styles.track} aria-hidden="true"><span className={styles.fill} style={{ '--value': `${value}%` } as React.CSSProperties} /></span>
      <span className={styles.barValue}>{value}%</span>
    </div>
  );
}

/** Ask, check, decide: the research as one chain that builds itself when it comes into view. */
export function ResearchFlow() {
  const root = useRef<HTMLOListElement>(null);
  const [stage, setStage] = useState(LAST);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = root.current;
    /* People who prefer less motion keep the finished picture. */
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const reset = window.setTimeout(() => setStage(0), 0);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => { window.clearTimeout(reset); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!seen || stage >= LAST) return;
    const timer = window.setTimeout(() => setStage((s) => s + 1), DELAYS[stage]);
    return () => window.clearTimeout(timer);
  }, [seen, stage]);

  const on = (n: number) => (stage >= n ? styles.shown : styles.waiting);

  return (
    <ol ref={root} className={styles.flow}>
      <li className={`${styles.step} ${on(1)}`}>
        <p className={styles.title}><span className={styles.number}>1</span>Ask: why do you open the store?</p>
        <ul className={styles.four}>
          {reasons.map((r) => (
            <li key={r.answer} className={`${styles.card} ${stage >= 2 ? styles.marked : ''}`}>
              {r.before}<em>{r.own}</em>{r.after}
            </li>
          ))}
        </ul>
        <p className={`${styles.finding} ${on(2)}`}>All four are about things they already buy.</p>
      </li>

      <li className={`${styles.step} ${on(3)}`}>
        <p className={styles.title}><span className={styles.number}>2</span>Check: do the orders agree?</p>
        <div className={`${styles.two} ${stage >= 4 ? styles.grown : ''}`}>
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

      <li className={`${styles.step} ${on(5)}`}>
        <p className={styles.title}><span className={styles.number}>3</span>Decide</p>
        <p className={styles.verdict}>Coming back for what they buy gets its own tab: <strong>Saved</strong>.</p>
        <ul className={`${styles.four} ${on(6)}`} aria-label="What Saved answers, in the order of the four questions">
          {reasons.map((r) => <li key={r.answer} className={styles.answer}>{r.answer}</li>)}
        </ul>
      </li>
    </ol>
  );
}
