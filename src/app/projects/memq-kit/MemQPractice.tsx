'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import p from './MemQPractice.module.css';

/* ───────────────────────── Phone frame ───────────────────────── */

/**
 * An iPhone outline in the app's deepest ink. The screen keeps the real 402 × 874
 * proportion, and both radii are set in container units so the bezel stays even
 * and the screen corners match the device at any size.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${p.frameWrap} ${className ?? ''}`}>
      <div className={p.frame}>
        <div className={p.screen}>{children}</div>
      </div>
    </div>
  );
}

/** A captured screen inside the frame. Captures shorter than the device are pinned to the top. */
export function PhoneShot({ src, alt, full = false, className }: { src: string; alt: string; full?: boolean; className?: string }) {
  return (
    <PhoneFrame className={className}>
      <Image src={src} alt={alt} fill={full} width={full ? undefined : 600} height={full ? undefined : 1209}
        sizes="(min-width: 900px) 320px, 45vw"
        className={full ? p.shotFull : p.shotTop} />
    </PhoneFrame>
  );
}

/* ───────────────────────── Overview showcase ───────────────────────── */

const showcase = [
  { src: '/img/memq-v2/phone-09-build.webp', alt: 'Build a sentence practice', pos: 'farLeft' },
  { src: '/img/memq-v2/phone-05-match.webp', alt: 'Match words practice', pos: 'left' },
  { src: '/img/memq-v2/screen-today.webp', alt: 'Today screen with 13 cards due and the Inkling mascot', pos: 'center', full: true },
  { src: '/img/memq-v2/phone-07-listen.webp', alt: 'Listening practice', pos: 'right' },
  { src: '/img/memq-v2/phone-08-meaning.webp', alt: 'Answer in your own words practice', pos: 'farRight' },
] as const;

/** Today in front, four ways of being asked fanned behind it, on the app's own lime ground. Phones run off the bottom edge. */
export function ProductShowcase() {
  return (
    <div className={p.show} role="img" aria-label="MemQ 2.0: the Today screen in front, with match, listen, own-words and sentence-building practice screens behind it.">
      <svg className={p.showWave} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 220 C180 120 340 300 600 210 S980 90 1200 190 V400 H0 Z" fill="#6c3cbc" />
        <path d="M0 290 C220 220 420 360 640 290 S1000 230 1200 280 V400 H0 Z" fill="#c59af0" />
      </svg>
      {showcase.map((s, i) => (
        <div key={s.src} className={`${p.showPhone} ${p[s.pos]}`} style={{ animationDelay: `${i * -1.3}s` }}>
          <PhoneShot src={s.src} alt={s.alt} full={'full' in s} />
        </div>
      ))}
    </div>
  );
}
