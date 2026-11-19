// Small evidence charts for the JobNova case. Every value is printed next to its mark, so
// nothing depends on colour alone. Colours were checked with the dataviz validator on white:
// grey #8c8e99 = before / context, deep lime #5f9a00 = after / the result.
import styles from './JobnovaCharts.module.css';

type Row = { label: string; value: number; tone: 'before' | 'after' };

/** One measure, before and after: horizontal bars on a shared 0–100% scale, labelled directly */
export function CompareBars({ title, rows, note }: { title: string; rows: Row[]; note?: string }) {
  return (
    <figure className={styles.chart}>
      <figcaption className={styles.title}>{title}</figcaption>
      <ul className={styles.rows}>
        {rows.map(r => (
          <li key={r.label} className={styles.row} title={`${r.label}: ${r.value}%`}>
            <span className={styles.rowLabel}>{r.label}</span>
            <span className={styles.track} aria-hidden="true"><i className={styles[r.tone]} style={{ width: `${r.value}%` }} /></span>
            <b className={styles.value}>{r.value}%</b>
          </li>
        ))}
      </ul>
      {note ? <p className={styles.note}>{note}</p> : null}
    </figure>
  );
}

/** A share of 100: one square per percent, the share filled */
export function ShareGrid({ value, headline, label, note }: { value: number; headline: string; label: string; note?: string }) {
  const filled = Math.round(value);
  return (
    <figure className={styles.chart}>
      <div className={styles.share}>
        <div className={styles.grid} role="img" aria-label={`${value}% ${label}`}>
          {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < filled ? styles.on : undefined} />)}
        </div>
        <div className={styles.shareText}>
          <b className={styles.big}>{headline}</b>
          <span className={styles.shareLabel}>{label}</span>
          {note ? <span className={styles.note}>{note}</span> : null}
        </div>
      </div>
    </figure>
  );
}

/** What people told us, kept as short paraphrases, never presented as quotes */
export function Heard({ title, items }: { title: string; items: string[] }) {
  return (
    <figure className={styles.chart}>
      <figcaption className={styles.title}>{title}</figcaption>
      <ul className={styles.heard}>
        {items.map(t => <li key={t}>{t}</li>)}
      </ul>
    </figure>
  );
}
