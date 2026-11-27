import Image from 'next/image';
import dims from './dims.json';
import styles from './HomeCallouts.module.css';

/** Circled areas of the new home screenshot, in its 390 × 844 points. */
const points = [
  { top: 105, height: 50, title: 'Find it fast', body: 'Invite them to search, then narrow down.' },
  { top: 369, height: 50, title: 'Feel at home', body: 'Their own categories come first.' },
  { top: 433, height: 322, title: 'Act right away', body: 'Make adding feel easy and clear.' },
  { top: 757, height: 72, title: 'Come back for yours', body: 'Draw them back to check and reorder.' },
];

/** The new home with its design points circled and explained beside it. */
export function HomeCallouts() {
  const [width, height] = dims.home;
  return (
    <div className={styles.layout}>
      <div className={styles.shot}>
        <div className={styles.canvas}>
          <Image src="/img/def-miniprogram/home.webp" width={width} height={height} alt="New home page, with four design points circled" sizes="(min-width: 700px) 360px, 100vw" unoptimized />
          {points.map((p, i) => (
            <span key={p.title} className={styles.ring} style={{ top: `${(p.top / 844) * 100}%`, height: `${(p.height / 844) * 100}%` }} aria-hidden="true">
              <span className={styles.number}>{i + 1}</span>
            </span>
          ))}
        </div>
      </div>
      <ol className={styles.notes}>
        {points.map((p, i) => (
          <li key={p.title}>
            <span className={styles.number} aria-hidden="true">{i + 1}</span>
            <div>
              <p className={styles.name}>{p.title}</p>
              <p className={styles.body}>{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
