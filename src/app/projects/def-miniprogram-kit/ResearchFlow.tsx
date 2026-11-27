'use client';

import { useEffect, useRef, useState } from 'react';
import { OrderFlow } from './OrderFlow';
import styles from './ResearchFlow.module.css';

const totals = [
  { value: '7', label: 'merchant interviews' },
  { value: '7,354', label: 'orders' },
  { value: '2,886', label: 'items' },
];

/* The blue words are what the four reasons have in common. */
const reasons = [
  { before: 'Anything new from ', own: 'my brands', after: '?', answer: 'Your ranges', basis: '13% of range buyers took a new shade; 1% of others' },
  { before: 'Is ', own: 'my item', after: ' back in stock?', answer: 'Restock', basis: 'From interviews' },
  { before: 'Any offer on ', own: 'what I buy', after: '?', answer: 'Offers on what you buy', basis: 'From interviews' },
  { before: 'Otherwise, ', own: 'buy it again', after: '.', answer: 'Buy again', basis: '85% of repeat accounts rebought a product' },
];

/** The research on one screen: how much was looked at, where the orders went, what answers it. */
export function ResearchFlow() {
  const root = useRef<HTMLDivElement>(null);
  /* The page arrives finished. It is wound back only for a reader who has not reached it and allows motion. */
  const [state, setState] = useState<'done' | 'waiting' | 'playing'>('done');

  useEffect(() => {
    const el = root.current?.querySelector(`.${styles.orders}`);
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let first = true;
    const observer = new IntersectionObserver(([entry]) => {
      const seen = entry.intersectionRatio >= 0.5;
      if (first) {
        first = false;
        if (!entry.isIntersecting) setState('waiting');
        else if (seen) { setState('playing'); observer.disconnect(); }
        return;
      }
      if (seen) { setState('playing'); observer.disconnect(); }
    }, { threshold: [0, 0.5] });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className={styles.research} data-state={state}>
      <div>
        <ul className={styles.totals}>
          {totals.map((t) => <li key={t.label}><strong>{t.value}</strong> {t.label}</li>)}
        </ul>
        <p className={styles.period}>March to August 2026</p>
      </div>

      <OrderFlow />

      <div className={styles.solution}>
        <p className={styles.verdict}>Solution: all four asks are about what they already buy, so it gets its own tab, <em>Saved</em>.</p>
        <ul className={styles.asks}>
          {reasons.map((r) => (
            <li key={r.answer}>
              <p className={styles.ask}><span>{r.before}<em>{r.own}</em>{r.after}</span></p>
              <span className={styles.arrow} aria-hidden="true">↓</span>
              <p className={styles.answer}>{r.answer}</p>
              <p className={styles.basis}>{r.basis}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
