import Image from 'next/image';
import dims from './dims.json';
import styles from './ScreenCallouts.module.css';

/** A circled area, in the screenshot's points: 390 wide, and as tall as the screen or crop shown. */
export type Mark = { left: number; top: number; width: number; height: number; title: string; body: string; cost?: boolean; flip?: boolean };
export type Screen = { shot: keyof typeof dims; name: string; before?: boolean; chosen?: boolean; marks: Mark[] };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/**
 * Screens with their points circled; numbers run on across the screens, and costs are marked in red.
 * A column is one screen, or several short ones stacked.
 */
export function ScreenCallouts({ screens, columns }: { screens: (Screen | Screen[])[]; columns?: number }) {
  const cells = screens.map((s) => (Array.isArray(s) ? s : [s]));
  const flat = cells.flat();
  const first = flat.map((_, i) => flat.slice(0, i).reduce((n, s) => n + s.marks.length, 1));
  const cols = columns ?? cells.length;
  return (
    <ul className={`${styles.row} ${cols > 4 ? styles.many : ''}`} style={{ '--cols': cols } as React.CSSProperties}>
      {cells.map((cell) => (
        <li key={cell[0].shot} className={styles.cell}>
          {cell.map((screen) => <Panel key={screen.shot} screen={screen} start={first[flat.indexOf(screen)]} />)}
        </li>
      ))}
    </ul>
  );
}

function Panel({ screen, start }: { screen: Screen; start: number }) {
  const [width, height] = dims[screen.shot];
  const points = (height / width) * 390;
  return (
    <div className={`${styles.column} ${screen.before ? styles.before : ''} ${screen.chosen === undefined ? '' : screen.chosen ? styles.chosen : styles.rejected}`}>
      {screen.chosen === undefined ? null : <em className={styles.badge}>{screen.chosen ? '✓ Chosen' : '✕ Not chosen'}</em>}
      <p className={styles.name}>{screen.name}</p>
      <div className={styles.shot}>
        <div className={styles.canvas}>
          <Image src={`/img/def-miniprogram/${screen.shot}.webp`} width={width} height={height} alt={`${screen.name}, with design points circled`} sizes="240px" unoptimized />
          {screen.marks.map((m, k) => (
            <span key={m.title} className={`${styles.ring} ${m.cost ? styles.cost : ''} ${m.flip ? styles.flip : ''}`} aria-hidden="true" style={{ left: pct(m.left, 390), top: pct(m.top, points), width: pct(m.width, 390), height: pct(m.height, points) }}>
              <span className={styles.number}>{start + k}</span>
            </span>
          ))}
        </div>
      </div>
      <ol className={styles.notes} start={start}>
        {screen.marks.map((m, k) => (
          <li key={m.title} className={m.cost ? styles.cost : undefined}>
            <span className={styles.number} aria-hidden="true">{start + k}</span>
            <div>
              <p className={styles.name}>{m.title}</p>
              <p className={styles.body}>{m.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
