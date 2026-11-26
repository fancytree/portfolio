import Image from 'next/image';
import dims from './dims.json';
import styles from './SavedTabs.module.css';

/* One sentence each. Shares come from the March to August order data. */
const tabs: { shot: keyof typeof dims; name: string; stat?: string; line: string }[] = [
  { shot: 'tab-saved', name: 'Saved', stat: '13%', line: 'of a range’s buyers take its new shade, against 1% of others.' },
  { shot: 'tab-buy', name: 'Buy again', stat: '85%', line: 'of repeat accounts bought a product again.' },
  { shot: 'tab-restock', name: 'Restock', line: 'Merchants asked for this in interviews.' },
];

/** The tabs inside Saved that work today, each with the reason for it. */
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
            <p className={styles.line}>
              {t.stat ? <strong className={styles.stat}>{t.stat} </strong> : null}
              {t.line}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
