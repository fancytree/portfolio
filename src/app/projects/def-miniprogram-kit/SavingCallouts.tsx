import Image from 'next/image';
import dims from './dims.json';
import styles from './SavingCallouts.module.css';

/** A circled area, in the screenshot's 390 × 844 points. */
type Mark = { left: number; top: number; width: number; height: number; title: string; body: string };

const screens: { shot: keyof typeof dims; name: string; before?: boolean; marks: Mark[] }[] = [
  { shot: 'save-before', name: 'Before', before: true, marks: [
    { left: 16, top: 772, width: 56, height: 58, title: 'Heart beside Add to Bag', body: 'It competed with the main action.' },
  ] },
  { shot: 'product-shade', name: 'After: product page', marks: [
    { left: 225, top: 45, width: 54, height: 54, title: 'Heart in the header', body: 'Away from the buying path.' },
    { left: 12, top: 771, width: 366, height: 60, title: 'Add to Bag stands alone', body: 'Nothing sits beside it.' },
  ] },
  { shot: 'save-sheet', name: 'After: save sheet', marks: [
    { left: 12, top: 386, width: 366, height: 376, title: 'The exact item', body: 'Choose the shade; saved ones carry a heart.' },
    { left: 12, top: 771, width: 366, height: 60, title: 'One decision', body: 'No quantity and no pack.' },
  ] },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/* Numbers run on across the screens. */
const start = screens.map((_, i) => screens.slice(0, i).reduce((n, s) => n + s.marks.length, 1));

/** How saving moved, circled on the screens themselves. */
export function SavingCallouts() {
  return (
    <ul className={styles.row}>
      {screens.map((screen, i) => {
        const [width, height] = dims[screen.shot];
        return (
          <li key={screen.shot} className={`${styles.column} ${screen.before ? styles.before : ''}`}>
            <p className={styles.name}>{screen.name}</p>
            <div className={styles.shot}>
              <div className={styles.canvas}>
                <Image src={`/img/def-miniprogram/${screen.shot}.webp`} width={width} height={height} alt={`${screen.name}, with design points circled`} sizes="240px" unoptimized />
                {screen.marks.map((m, k) => (
                  <span key={m.title} className={styles.ring} aria-hidden="true" style={{ left: pct(m.left, 390), top: pct(m.top, 844), width: pct(m.width, 390), height: pct(m.height, 844) }}>
                    <span className={styles.number}>{start[i] + k}</span>
                  </span>
                ))}
              </div>
            </div>
            <ol className={styles.notes} start={start[i]}>
              {screen.marks.map((m, k) => (
                <li key={m.title}>
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
