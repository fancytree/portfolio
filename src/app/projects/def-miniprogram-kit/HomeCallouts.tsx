import Image from 'next/image';
import dims from './dims.json';
import styles from './HomeCallouts.module.css';

/** Areas of the home screenshot, in its 390 × 844 points. */
const points = [
  { top: 105, height: 50, title: 'Search comes first', body: 'It takes over the Categories tab, so every product stays one step away.' },
  { top: 157, height: 202, title: 'One banner, one action', body: 'Campaigns get a single image with a clear button, ahead of the products.' },
  { top: 369, height: 50, title: 'Tabs that are the merchant’s own', body: 'For you, then the categories they work in. No more fixed grid.' },
  { top: 433, height: 322, title: 'Products, with the next step', body: 'Price on the card, and the button says what happens: add, or choose a shade.' },
  { top: 757, height: 72, title: 'Four floating tabs', body: 'Saved takes the Categories slot, for coming back.' },
];

const before = [
  { shot: 'before-home', name: 'Before: Home', alt: 'Previous home page' },
  { shot: 'before-catalog', name: 'Before: Categories', alt: 'Previous categories tab' },
] as const;

function Screen({ shot, alt }: { shot: keyof typeof dims; alt: string }) {
  const [width, height] = dims[shot];
  return <Image src={`/img/def-miniprogram/${shot}.webp`} width={width} height={height} alt={alt} sizes="(min-width: 900px) 320px, 50vw" unoptimized />;
}

/** The previous two screens, then the new home with its design points circled and explained. */
export function HomeCallouts() {
  return (
    <div className={styles.layout}>
      <ul className={styles.before} aria-label="Previous screens">
        {before.map((b) => (
          <li key={b.shot}>
            <div className={styles.shot}><Screen shot={b.shot} alt={b.alt} /></div>
            <p className={styles.name}>{b.name}</p>
          </li>
        ))}
      </ul>
      <div className={styles.after}>
        <div className={`${styles.shot} ${styles.current}`}>
          <div className={styles.canvas}>
            <Screen shot="home" alt="New home page, with five design points circled" />
            {points.map((p, i) => (
              <span key={p.title} className={styles.ring} style={{ top: `${(p.top / 844) * 100}%`, height: `${(p.height / 844) * 100}%` }} aria-hidden="true">
                <span className={styles.number}>{i + 1}</span>
              </span>
            ))}
          </div>
        </div>
        <p className={styles.name}>After: Home</p>
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
