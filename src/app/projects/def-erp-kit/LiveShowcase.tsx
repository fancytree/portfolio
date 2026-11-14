'use client';

import { useState } from 'react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import LiveDemo, { type Script } from './LiveDemo';
import styles from './DesignSystemShowcase.module.css';

export type ShowcaseItem = {
  title: string;
  lead: string;
  body: string;
  /** First-run estimate of the script's length in seconds; later runs use the measured length. */
  seconds?: number;
  script: Script;
  /** Page for this step; a different value reloads the frame. */
  src?: string;
  ready?: string;
  /** Start from a freshly loaded page. Without it, a step on the same page carries on from where the last one stopped. */
  fresh?: boolean;
};

/** A list of modules on the left; the real page on the right, played one module at a time. */
export default function LiveShowcase({ items, src, label, title, baseWidth, ready, prepare }: {
  items: ShowcaseItem[];
  src: string;
  label: string;
  title: string;
  baseWidth?: number;
  ready?: string;
  prepare?: (doc: Document) => void;
}) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState({ value: 0, ms: 0 });
  const reset = () => setProgress({ value: 0, ms: 0 });
  const [nonce, setNonce] = useState(0);
  const go = (index: number) => {
    reset();
    if (items[index].fresh) setNonce((n) => n + 1);
    setActive(index);
  };
  const item = items[active];

  return (
    <div className={styles.wrap}>
      <ol className={styles.list}>
        {items.map((entry, i) => {
          const on = i === active;
          return (
            <li key={entry.title} className={`${styles.item} ${on ? styles.on : ''}`}>
              {on ? (
                <span className={styles.track} role="progressbar" aria-label={`${entry.title} demo progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.value * 100)}>
                  <span className={styles.fill} style={{ width: `${progress.value * 100}%`, transitionDuration: `${progress.ms}ms` }} />
                </span>
              ) : null}
              <CaseButton variant="tab" type="button" className={styles.head} aria-expanded={on} onClick={() => { go(i); setAuto(false); }}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.title}>{entry.title}</span>
              </CaseButton>
              {on ? (
                <div className={styles.copy}>
                  <p className={styles.lead}>{entry.lead}</p>
                  <p className={styles.body}>{entry.body}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <LiveDemo
        src={item.src ?? src}
        title={title}
        label={label}
        script={item.script}
        baseWidth={baseWidth}
        ready={item.ready ?? ready}
        prepare={prepare}
        resetKey={nonce}
        onProgress={(value, ms) => setProgress({ value, ms })}
        estimateMs={(item.seconds ?? 20) * 1000}
        onDone={() => { if (auto) go((active + 1) % items.length); }}
      />
    </div>
  );
}
