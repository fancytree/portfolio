import Image from 'next/image';
import dims from './dims.json';
import styles from './FeedCards.module.css';

type Card = [keyof typeof dims, string];

/* Grouped by what each card is for. */
const groups: { title: string; note: string; cards: Card[] }[] = [
  { title: 'Products', note: 'Buy now, or buy again.', cards: [['card-p1', 'Product tile'], ['card-p3', 'Reorder row'], ['card-p2', 'Immersive product']] },
  { title: 'Collections', note: 'Several products at once.', cards: [['card-c1', 'Collection mosaic'], ['card-c2', 'Collection shelf'], ['card-c3', 'Shop the set']] },
  { title: 'Brands and offers', note: 'Follow a range, see the price break.', cards: [['card-b1', 'Brand cover'], ['card-b2', 'Brand with picks'], ['card-o1', 'Volume offer']] },
  { title: 'Content', note: 'Learn, then shop what was used.', cards: [['card-v1', 'Short video'], ['card-v2', 'Tutorial with products'], ['card-e1', 'Article']] },
];

/** The cards the For you feed is built from. */
export function FeedCards() {
  return (
    <div className={styles.grid}>
      {groups.map((group) => (
        <section key={group.title} className={styles.group} aria-label={group.title}>
          <div>
            <p className={styles.title}>{group.title}</p>
            <p className={styles.note}>{group.note}</p>
          </div>
          <ul className={styles.cards}>
            {group.cards.map(([shot, name]) => {
              const [width, height] = dims[shot];
              return (
                <li key={shot}>
                  <Image src={`/img/def-miniprogram/${shot}.webp`} width={width} height={height} alt={`${name} card`} sizes="(min-width: 900px) 280px, 50vw" unoptimized />
                  <p className={styles.name}>{name}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
