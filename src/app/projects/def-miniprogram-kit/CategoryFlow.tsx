import styles from './CategoryFlow.module.css';

/* One worked example, matching the "Nails and pedicure" home further down. */
const merchant = [
  { category: 'Nails', source: 'Chosen at verification, and bought the most' },
  { category: 'Pedicure', source: 'Added from purchases' },
];
const mine = merchant.map((m) => m.category);

const products = [
  { name: 'Nitrile gloves', categories: ['Hair', 'Barber', 'Nails', 'Pedicure', 'Spa'] },
  { name: 'Gel colour', categories: ['Nails', 'Pedicure'] },
  { name: 'Foot cream', categories: ['Pedicure', 'Spa'] },
  { name: 'Styling chair', categories: ['Hair', 'Barber'] },
];
const matches = (list: string[]) => list.some((c) => mine.includes(c));
const inTab = (category: string) => products.filter((p) => p.categories.includes(category)).map((p) => p.name);

const tabs = [
  { name: 'For you', rule: 'Shares any of the categories', items: products.filter((p) => matches(p.categories)).map((p) => p.name) },
  ...mine.map((c) => ({ name: c, rule: `Carries ${c}`, items: inTab(c) })),
];

function Step({ n, title, note, children }: { n: number; title: string; note: string; children: React.ReactNode }) {
  return (
    <li className={styles.step}>
      <p className={styles.title}><span className={styles.number} aria-hidden="true">{n}</span>{title}</p>
      {children}
      <p className={styles.note}>{note}</p>
    </li>
  );
}

/** Products carry categories, the merchant collects them, and the overlap becomes the home tabs. */
export function CategoryFlow() {
  return (
    <ol className={styles.flow}>
      <Step n={1} title="A product carries categories" note="Set in the back office. One product can carry several.">
        <ul className={styles.cards}>
          {products.map((p) => (
            <li key={p.name} className={`${styles.card} ${matches(p.categories) ? '' : styles.off}`}>
              <span className={styles.strong}>{p.name}</span>
              <span className={styles.chips}>
                {p.categories.map((c) => <span key={c} className={`${styles.chip} ${mine.includes(c) ? styles.hit : ''}`}>{c}</span>)}
              </span>
            </li>
          ))}
        </ul>
      </Step>
      <Step n={2} title="A merchant collects categories" note="Chosen or followed by the merchant, or added once it reaches 10% of six months’ purchases. A removed one stays removed.">
        <div className={`${styles.card} ${styles.merchant}`}>
          <span className={styles.strong}>Nail and foot studio</span>
          <ul className={styles.cards}>
            {merchant.map((m) => (
              <li key={m.category} className={styles.link}>
                <span className={`${styles.chip} ${styles.hit}`}>{m.category}</span>
                <span className={styles.small}>{m.source}</span>
              </li>
            ))}
          </ul>
        </div>
      </Step>
      <Step n={3} title="The overlap becomes the home tabs" note="For you comes first, then the merchant’s categories, most bought first. Everything else stays searchable.">
        <ul className={styles.cards}>
          {tabs.map((t, i) => (
            <li key={t.name} className={styles.card}>
              <span className={`${styles.tab} ${i === 0 ? styles.current : ''}`}>{t.name}</span>
              <span className={styles.small}>{t.rule}</span>
              <span className={styles.items}>{t.items.join(' · ')}</span>
            </li>
          ))}
        </ul>
      </Step>
    </ol>
  );
}
