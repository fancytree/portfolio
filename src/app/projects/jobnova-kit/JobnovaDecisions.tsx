import { DecisionCards, type Decision } from '../procurement-agent-kit/DecisionCards';
import styles from './JobnovaDecisions.module.css';

/** The shared decision cards, dressed in JobNova's palette instead of the case-kit blue. */
export function JobnovaDecisions({ items, start = 1 }: { items: Decision[]; start?: number }) {
  return (
    <div className={styles.jn}>
      <DecisionCards items={items} start={start} />
    </div>
  );
}
