import styles from './ResearchCharts.module.css';

/**
 * Shares measured from six months of the previous system's sales lines (March to August 2026).
 * Only percentages are published: no revenue, order counts or customer details.
 */
export function ShareBars({ title, rows }: { title: string; rows: { label: string; value: number; key?: boolean }[] }) {
  return (
    <div className={styles.chart}>
      <p className={styles.title}>{title}</p>
      <ul className={styles.rows}>
        {rows.map((row) => (
          <li key={row.label} className={`${styles.row} ${row.key ? styles.key : ''}`}>
            <span className={styles.label}>{row.label}</span>
            <span className={styles.track} aria-hidden="true"><span className={styles.bar} style={{ width: `${row.value}%` }} /></span>
            <span className={styles.value}>{row.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
