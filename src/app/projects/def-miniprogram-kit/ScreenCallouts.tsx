import Image from 'next/image';
import dims from './dims.json';
import styles from './ScreenCallouts.module.css';

/** A circled area, in the screenshot's 390 × 844 points. */
export type Mark = { left: number; top: number; width: number; height: number; title: string; body: string; cost?: boolean; flip?: boolean };
export type Screen = { shot: keyof typeof dims; name: string; before?: boolean; chosen?: boolean; marks: Mark[] };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/** Screens with their points circled; numbers run on across the screens, and costs are marked in red. */
export function ScreenCallouts({ screens, columns }: { screens: Screen[]; columns?: number }) {
  const start = screens.map((_, i) => screens.slice(0, i).reduce((n, s) => n + s.marks.length, 1));
  return (
    <ul className={styles.row} style={{ '--cols': columns ?? screens.length } as React.CSSProperties}>
      {screens.map((screen, i) => {
        const [width, height] = dims[screen.shot];
        return (
          <li key={screen.shot} className={`${styles.column} ${screen.before ? styles.before : ''} ${screen.chosen === undefined ? '' : screen.chosen ? styles.chosen : styles.rejected}`}>
            {screen.chosen === undefined ? null : <em className={styles.badge}>{screen.chosen ? '✓ Chosen' : '✕ Not chosen'}</em>}
            <p className={styles.name}>{screen.name}</p>
            <div className={styles.shot}>
              <div className={styles.canvas}>
                <Image src={`/img/def-miniprogram/${screen.shot}.webp`} width={width} height={height} alt={`${screen.name}, with design points circled`} sizes="240px" unoptimized />
                {screen.marks.map((m, k) => (
                  <span key={m.title} className={`${styles.ring} ${m.cost ? styles.cost : ''} ${m.flip ? styles.flip : ''}`} aria-hidden="true" style={{ left: pct(m.left, 390), top: pct(m.top, 844), width: pct(m.width, 390), height: pct(m.height, 844) }}>
                    <span className={styles.number}>{start[i] + k}</span>
                  </span>
                ))}
              </div>
            </div>
            <ol className={styles.notes} start={start[i]}>
              {screen.marks.map((m, k) => (
                <li key={m.title} className={m.cost ? styles.cost : undefined}>
                  <span className={styles.number} aria-hidden="true">{start[i] + k}</span>
                  <div>
                    <p className={styles.name}>{m.title}</p>
                    <p className={styles.body}>{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ul>
  );
}
