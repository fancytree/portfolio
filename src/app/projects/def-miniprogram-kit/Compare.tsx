import Image from 'next/image';
import dims from './dims.json';
import styles from './Compare.module.css';

export type ShotName = keyof typeof dims;

export type Option = {
  shot: ShotName;
  name: string;
  /** Why it was picked, or why it was not. */
  why?: string;
  chosen?: boolean;
  /** A label for options that are neither picked nor turned down, such as an open question. */
  tag?: string;
  alt?: string;
};

/** Screens side by side, each with its reason; the chosen one is outlined and labelled. */
export function Compare({ items, columns, wide, label }: { items: Option[]; columns?: number; wide?: boolean; label: string }) {
  const judged = items.some((item) => item.chosen);
  return (
    <ul className={`${styles.grid} ${wide ? styles.wide : ''}`} style={{ '--cols': columns ?? items.length } as React.CSSProperties} aria-label={label}>
      {items.map((item) => {
        const [width, height] = dims[item.shot];
        const tag = item.chosen ? 'Chosen' : item.tag ?? (judged ? 'Not chosen' : null);
        return (
          <li key={item.shot} className={`${styles.item} ${item.chosen ? styles.chosen : ''}`}>
            <div className={styles.shot}>
              <Image src={`/img/def-miniprogram/${item.shot}.webp`} width={width} height={height} alt={item.alt ?? item.name} sizes="(min-width: 900px) 320px, 50vw" unoptimized />
            </div>
            {tag ? <em className={`${styles.badge} ${item.chosen ? '' : styles.plain}`}>{tag}</em> : null}
            <p className={styles.name}>{item.name}</p>
            {item.why ? <p className={styles.why}>{item.why}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}
