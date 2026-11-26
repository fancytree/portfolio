import Image from 'next/image';
import dims from './dims.json';
import styles from './SavedTabs.module.css';

/* Shares come from the March to August order data; a tab without data says so. */
const tabs: { shot: keyof typeof dims; name: string; role: string; stat?: string; evidence: string }[] = [
  { shot: 'tab-saved', name: 'Saved', role: 'New, on offer and kept items.', stat: '13% vs 1%', evidence: 'New-shade pick-up: range buyers against others.' },
  { shot: 'tab-buy', name: 'Buy again', role: 'Add part or all of a past order.', stat: '85%', evidence: 'of repeat accounts bought a product again.' },
  { shot: 'tab-restock', name: 'Restock', role: 'What is back, and what is expected.', evidence: 'From interviews; no sales data yet.' },
];

/** The tabs inside Saved that work today, each with its job and what supports it. */
export function SavedTabs() {
  return (
    <ul className={styles.row} aria-label="Tabs inside Saved">
      {tabs.map((t) => {
        const [width, height] = dims[t.shot];
        return (
          <li key={t.name} className={styles.column}>
            <p className={styles.name}>{t.name}</p>
            <div className={styles.shot}>
              <Image src={`/img/def-miniprogram/${t.shot}.webp`} width={width} height={height} alt={`${t.name} tab`} sizes="(min-width: 900px) 250px, 50vw" unoptimized />
            </div>
            <p className={styles.role}>{t.role}</p>
            <p className={`${styles.evidence} ${t.stat ? '' : styles.none}`}>
              {t.stat ? <strong className={styles.stat}>{t.stat}</strong> : null}
              {t.evidence}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
