'use client';

import { useRef, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './ProjectButton.module.css';

export default function ProjectButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    const reach = 150;
    const pull = Math.max(0, 1 - distance / reach);

    button.style.setProperty('--magnet-x', `${Math.max(-9, Math.min(9, dx * pull * 0.18))}px`);
    button.style.setProperty('--magnet-y', `${Math.max(-9, Math.min(9, dy * pull * 0.18))}px`);
    button.style.setProperty('--light-x', `${Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))}%`);
    button.style.setProperty('--light-y', `${Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100))}%`);
  }

  function reset() {
    const button = buttonRef.current;
    if (!button) return;
    button.style.setProperty('--magnet-x', '0px');
    button.style.setProperty('--magnet-y', '0px');
  }

  function press() {
    const button = buttonRef.current;
    if (!button) return;
    button.classList.remove(styles.clicked);
    // Restart the brief click response on consecutive presses.
    void button.offsetWidth;
    button.classList.add(styles.clicked);
  }

  return (
    <div className={styles.stage} onPointerMove={move} onPointerLeave={reset}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        onClick={press}
        onAnimationEnd={() => buttonRef.current?.classList.remove(styles.clicked)}
      >
        <span className={styles.label}>Start a project</span>
        <span className={styles.dot} aria-hidden="true">
          <ArrowUpRight className={styles.arrow} strokeWidth={2.2} />
        </span>
      </button>
    </div>
  );
}
