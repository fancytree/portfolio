import Image from 'next/image';
import dims from './dims.json';
import styles from './HomeCallouts.module.css';

/** A circled area of a home screenshot, in its 390 × 844 points. */
type Point = { top: number; height: number; title: string; body: string };

/* The two lists run in the same order, so each number is a problem and its answer. */
const problems: Point[] = [
  { top: 105, height: 50, title: 'Only a search box', body: 'Browsing by category sits on another tab.' },
  { top: 165, height: 254, title: 'One message for everyone', body: 'A generic campaign and a shipping notice, whatever the merchant buys.' },
  { top: 433, height: 194, title: 'The same eight icons', body: 'Every category with equal weight, though a merchant works in only some.' },
  { top: 647, height: 110, title: 'No products yet', body: 'Brand logos follow: no price and nothing to add on the first screen.' },
  { top: 761, height: 66, title: 'A tab for browsing', body: 'Categories hold a fixed place. Buying again has none.' },
];

const highlights: Point[] = [
  { top: 105, height: 50, title: 'Search comes first', body: 'With filters beside it, it takes over the Categories tab.' },
  { top: 157, height: 202, title: 'One banner, one action', body: 'Campaigns get a single image with a clear button.' },
  { top: 369, height: 50, title: 'The merchant’s own tabs', body: 'For you, then the categories they work in. No fixed grid.' },
  { top: 433, height: 322, title: 'Products, with the next step', body: 'Price on the card, and the button says what happens: add, or choose a shade.' },
  { top: 757, height: 72, title: 'A tab for coming back', body: 'Saved takes the Categories slot.' },
];

function Side({ before, shot, name, alt, points }: { before?: boolean; shot: keyof typeof dims; name: string; alt: string; points: Point[] }) {
  const [width, height] = dims[shot];
  return (
    <div className={`${styles.side} ${before ? styles.before : styles.after}`}>
      <div className={styles.screen}>
        <div className={styles.shot}>
          <div className={styles.canvas}>
            <Image src={`/img/def-miniprogram/${shot}.webp`} width={width} height={height} alt={alt} sizes="(min-width: 900px) 320px, 100vw" unoptimized />
            {points.map((p, i) => (
              <span key={p.title} className={styles.ring} style={{ top: `${(p.top / 844) * 100}%`, height: `${(p.height / 844) * 100}%` }} aria-hidden="true">
                <span className={styles.number}>{i + 1}</span>
              </span>
            ))}
          </div>
        </div>
        <p className={styles.name}>{name}</p>
      </div>
      <ol className={styles.notes} aria-label={before ? 'Problems' : 'Design highlights'}>
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

/** The two home pages side by side: problems circled on the old one, design points on the new one. */
export function HomeCallouts() {
  return (
    <div className={styles.layout}>
      <Side before shot="before-home" name="Before: the problems" alt="Previous home page, with five problems circled" points={problems} />
      <Side shot="home" name="After: the design" alt="New home page, with five design points circled" points={highlights} />
    </div>
  );
}
