import { Calculator, Files, History } from 'lucide-react';
import styles from './Story.module.css';

/** The four stages of my Agent UX map. Each step below names the ones it used. */
export const PRINCIPLES = [
  { id: 1, phase: 'Before', rule: 'Find it, say it, align on it.' },
  { id: 2, phase: 'During', rule: 'Visible, controllable, async, recoverable.' },
  { id: 3, phase: 'After', rule: 'Verify, refine, reuse.' },
  { id: 4, phase: 'Over time', rule: 'Remember, and show up at the right time.' },
] as const;

/** What a purchase decision asks of the buyer, and the part an Agent takes over. */
const WHY = [
  { Icon: Files, load: 'Many places to read', agent: 'It gathers sales, stock, and supplier terms for this purchase.' },
  { Icon: Calculator, load: 'A sum for every product', agent: 'It calls a calculation engine and shows the reason on each line.' },
  { Icon: History, load: 'Lessons kept in one head', agent: 'It keeps the user’s review, so the next plan starts from it.' },
] as const;

export function WhyAgent() {
  return (
    <ul className={styles.why}>
      {WHY.map(({ Icon, load, agent }) => (
        <li key={load}>
          <span className={styles.chip}><Icon aria-hidden="true" /></span>
          <p className={styles.name}>{load}</p>
          <p className={styles.answer}>{agent}</p>
        </li>
      ))}
    </ul>
  );
}

/** What has not been checked yet. */
export function StillOpen({ children }: { children: string }) {
  return <p className={styles.handoff}><span>Still to verify</span>{children}</p>;
}
