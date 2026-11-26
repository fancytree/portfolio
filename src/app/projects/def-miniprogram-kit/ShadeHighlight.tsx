import styles from './ShadeHighlight.module.css';

const points = [
  { title: 'Type the numbers', body: 'Merchants order by shade number. Several go in at once, and sold-out or unknown ones are named.' },
  { title: 'Start from what they know', body: 'Bought before and New are one tap away, and a dot marks past purchases anywhere in the grid.' },
  { title: 'Filter the way the trade thinks', body: 'Gel polish by colour family. Hair colour by depth level and tone, as its codes are written.' },
  { title: 'Collect, then set quantities', body: 'Each tap takes one piece. Quantities change together or one by one, and one button adds them all.' },
];

/** The working shade picker beside the four ways it gets a merchant to the shades. */
export function ShadeHighlight() {
  return (
    <div className={styles.layout}>
      <iframe className={styles.phone} src="/demos/def-mini-shades/index.html" title="DEF shade picker prototype" loading="lazy" />
      <div className={styles.side}>
        <p className={styles.lead}>Try it: type <strong>5 12 48 101</strong>, or switch to hair colour.</p>
        <ol className={styles.points}>
          {points.map((p, i) => (
            <li key={p.title}>
              <span className={styles.number} aria-hidden="true">{i + 1}</span>
              <div>
                <p className={styles.title}>{p.title}</p>
                <p className={styles.body}>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
