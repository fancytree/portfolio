'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import styles from './HoldCheckbox.module.css';

const HOLD_MS = 960;

export default function HoldCheckbox() {
  const [checked, setChecked] = useState(false);
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyHolding = useRef(false);
  const ignoreKeyboardClick = useRef(false);

  function stopHold() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    keyHolding.current = false;
    setHolding(false);
  }

  function startHold() {
    if (checked) {
      setChecked(false);
      return;
    }
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      setChecked(true);
    }, HOLD_MS);
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startHold();
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!timer.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const margin = 12;
    if (
      event.clientX < rect.left - margin ||
      event.clientX > rect.right + margin ||
      event.clientY < rect.top - margin ||
      event.clientY > rect.bottom + margin
    ) stopHold();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    if (event.repeat || keyHolding.current) return;
    keyHolding.current = true;
    ignoreKeyboardClick.current = true;
    startHold();
  }

  function onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    stopHold();
    window.setTimeout(() => { ignoreKeyboardClick.current = false; }, 0);
  }

  return (
    <div className={styles.stage}>
      <div className={styles.content}>
        <p className={styles.title}>Interest payment to the lenders</p>
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-describedby="hold-checkbox-hint"
          className={styles.option}
          data-holding={holding || undefined}
          data-checked={checked || undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopHold}
          onPointerCancel={stopHold}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={stopHold}
          onClick={(event) => {
            // Assistive technology can activate the control without a pointer or held key.
            if (ignoreKeyboardClick.current) {
              ignoreKeyboardClick.current = false;
            } else if (event.detail === 0) {
              setChecked(true);
            }
          }}
        >
          <span className={styles.box} aria-hidden="true">
            <svg className={styles.borderProgress} viewBox="0 0 30 30" fill="none">
              <path className={styles.outline} d="M15 1.5 H21 Q28.5 1.5 28.5 9 V21 Q28.5 28.5 21 28.5 H9 Q1.5 28.5 1.5 21 V9 Q1.5 1.5 9 1.5 H15 Z" />
              <path className={styles.outlineProgress} d="M15 1.5 H21 Q28.5 1.5 28.5 9 V21 Q28.5 28.5 21 28.5 H9 Q1.5 28.5 1.5 21 V9 Q1.5 1.5 9 1.5 H15 Z" pathLength="100" />
            </svg>
            <span className={styles.dropDot} />
            <svg className={styles.check} viewBox="0 0 30 30" fill="none">
              <path d="M6.5 15.5 12 21 24 8.7" pathLength="100" />
            </svg>
          </span>
          <span className={styles.copy}>
            <strong>Pay off the loan</strong>
            <small>$894,000,000</small>
          </span>
        </button>
        <p id="hold-checkbox-hint" className={styles.hint} aria-live="polite">
          {checked ? 'Confirmed. Press once to reset.' : holding ? 'Keep holding…' : 'Press and hold to confirm.'}
        </p>
      </div>
    </div>
  );
}
