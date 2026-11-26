'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './CategoryFlow.module.css';

const products = [
  { id: 'gel', name: 'Gel colour', categories: ['Nails'] },
  { id: 'gloves', name: 'Nitrile gloves', categories: ['Hair', 'Nails', 'Pedicure'] },
  { id: 'chair', name: 'Styling chair', categories: ['Hair', 'Barber'] },
];
const merchants = [
  { name: 'Nail and foot studio', categories: ['Nails', 'Pedicure'] },
  { name: 'Barber shop', categories: ['Barber', 'Hair'] },
];
/* Step 0 shows the merchant; steps 1–3 compare one product each; the last step holds the result. */
const DONE = products.length + 1;
const shared = (p: (typeof products)[number], mine: string[]) => p.categories.filter((c) => mine.includes(c));
const list = (names: string[]) => names.join(' and ');

function Photo({ id, name }: { id: string; name: string }) {
  return <Image className={styles.photo} src={`/img/def-miniprogram/p-${id}.webp`} width={480} height={480} alt={name} unoptimized />;
}

/** Plays how products are matched to a merchant: a shared category puts a product into For you. */
export function CategoryFlow() {
  const root = useRef<HTMLDivElement>(null);
  const [{ who, step }, setState] = useState({ who: 0, step: DONE });
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const started = useRef(false);
  const reduced = useRef(false);

  /* Starts from the beginning the first time it is seen; people who prefer less motion get the result. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced.current) return;
        setState({ who: 0, step: 0 });
        setPlaying(true);
      }
    }, { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    const timer = window.setTimeout(() => {
      setState((s) => (s.step < DONE ? { ...s, step: s.step + 1 } : { who: (s.who + 1) % merchants.length, step: 0 }));
    }, step === DONE ? 3500 : 1800);
    return () => window.clearTimeout(timer);
  }, [playing, visible, who, step]);

  const merchant = merchants[who];
  const mine = merchant.categories;
  const checked = products.slice(0, Math.min(step, products.length));
  const added = checked.filter((p) => shared(p, mine).length > 0);
  const current = step >= 1 && step <= products.length ? products[step - 1] : null;
  const message = step === 0
    ? `${merchant.name} has ${list(mine)}. Those become the tabs.`
    : current
      ? shared(current, mine).length
        ? `${current.name} shares ${list(shared(current, mine))}: added to For you.`
        : `${current.name} shares no category: left out, still searchable.`
      : `For you: ${list(added.map((p) => p.name))}.`;

  return (
    <div ref={root} className={styles.flow}>
      <div className={styles.board}>
        <p className={styles.heading}>Products</p>
        {/* The demonstration's own control, styled with the diagram. */}
        <div className={styles.switch} role="group" aria-label="Choose a merchant" data-case-visual>
          {merchants.map((m, i) => (
            <button key={m.name} type="button" className={styles.option} aria-pressed={i === who}
              onClick={() => { started.current = true; setState({ who: i, step: reduced.current ? DONE : 0 }); setPlaying(!reduced.current); }}>
              {m.name}
            </button>
          ))}
        </div>

        <ul className={styles.products} aria-label="Products and their categories">
          {products.map((p, i) => {
            const seen = i < step;
            const match = shared(p, mine).length > 0;
            return (
              <li key={p.id} className={`${styles.product} ${current === p ? styles.checking : ''} ${seen ? (match ? styles.inside : styles.outside) : ''}`}>
                <Photo id={p.id} name={p.name} />
                <span className={styles.detail}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.chips}>
                    {p.categories.map((c) => <span key={c} className={`${styles.chip} ${seen && mine.includes(c) ? styles.hit : ''}`}>{c}</span>)}
                  </span>
                </span>
                <span className={styles.verdict} role="img" aria-label={seen ? (match ? 'In For you' : 'Not in For you') : 'Not compared yet'}>{seen ? (match ? '✓' : '✕') : ''}</span>
              </li>
            );
          })}
        </ul>

        <div className={styles.home}>
          <div className={styles.tabsBlock}>
            <div className={styles.tabs}>
              <span className={`${styles.tab} ${styles.current}`}>For you</span>
              {mine.map((c) => <span key={`${who}-${c}`} className={`${styles.tab} ${styles.arrive}`}>{c}</span>)}
            </div>
            <p className={styles.caption}>The tabs are the merchant’s categories</p>
          </div>
          {/* Both merchants end with two products, so the two places never move the page. */}
          <ul className={styles.feed} aria-label="For you">
            {[0, 1].map((slot) => {
              const p = added[slot];
              return (
                <li key={p ? `${who}-${p.id}` : `empty-${slot}`} className={p ? styles.arrive : undefined}>
                  {p ? <><Photo id={p.id} name={p.name} /><span className={styles.name}>{p.name}</span></> : <><span className={styles.empty} /><span className={styles.name}>{'\u00a0'}</span></>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className={styles.message}>{message}</p>
    </div>
  );
}
