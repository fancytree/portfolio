import styles from './Story.module.css';

/** The four stages of my Agent UX map. Each step below names the ones it used. */
export const PRINCIPLES = [
  { id: 1, phase: 'Before', rule: 'Find it, say it, align on it.' },
  { id: 2, phase: 'During', rule: 'Visible, controllable, async, recoverable.' },
  { id: 3, phase: 'After', rule: 'Verify, refine, reuse.' },
  { id: 4, phase: 'Over time', rule: 'Remember, and show up at the right time.' },
] as const;

/** What the design means to the person using it. */
export function ForTheBuyer({ need, help, act }: { need: string; help: string; act: string }) {
  return (
    <dl className={styles.value}>
      <div><dt>Why you need it</dt><dd>{need}</dd></div>
      <div><dt>How it helps</dt><dd>{help}</dd></div>
      <div><dt>What you do</dt><dd>{act}</dd></div>
    </dl>
  );
}

/** What has not been checked yet. */
export function StillOpen({ children }: { children: string }) {
  return <p className={styles.handoff}><span>Still to verify</span>{children}</p>;
}
