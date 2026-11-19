'use client';
// A V1 screen with numbered pins on what got in people's way. Hovering a pin or its note
// highlights the pair; the notes are also a plain ordered list for screen readers.
import { useState } from 'react';
import styles from './JobnovaAnnotated.module.css';

export type Pin = { x: number; y: number; title: string; note: string };

export function AnnotatedShot({ src, alt, width, height, pins, label = 'V1' }: { src: string; alt: string; width: number; height: number; pins: Pin[]; label?: string }) {
  const [on, setOn] = useState<number | null>(null);
  return (
    <figure className={styles.wrap}>
      <div className={styles.stage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={width} height={height} loading="lazy" />
        {pins.map((p, i) => (
          <span key={p.title} aria-hidden="true" className={`${styles.pin} ${on === i ? styles.pinOn : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)}>
            {i + 1}
          </span>
        ))}
      </div>
      <ol className={styles.notes}>
        <li className={styles.notesHead} aria-hidden="true"><span className={styles.tag}>{label}</span>What got in the way</li>
        {pins.map((p, i) => (
          <li key={p.title} className={on === i ? styles.noteOn : undefined} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)}>
            <span className={styles.num} aria-hidden="true">{i + 1}</span>
            <div><b>{p.title}</b><p>{p.note}</p></div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
