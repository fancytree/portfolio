import styles from './CategoryFlow.module.css';

/* One worked example, matching the "Nails and pedicure" home further down. */
const sources = [
  { name: 'Verification', example: 'Picks Nails' },
  { name: 'Purchases', example: 'Pedicure reaches 10%' },
  { name: 'Follow', example: 'Adds more any time' },
];

const tabs = [
  { name: 'For you', items: 'Gloves · Gel colour · Foot cream' },
  { name: 'Nails', items: 'Gloves · Gel colour' },
  { name: 'Pedicure', items: 'Gloves · Gel colour · Foot cream' },
];

function Chips({ list }: { list: string[] }) {
  return <span className={styles.chips}>{list.map((c) => <span key={c} className={styles.chip}>{c}</span>)}</span>;
}

/** A flowchart: how a merchant's categories and a product's categories decide the home tabs. */
export function CategoryFlow() {
  return (
    <div className={styles.flow} role="group" aria-label="How the home tabs are made">
      <ul className={styles.sources}>
        {sources.map((s) => (
          <li key={s.name} className={styles.node}>
            <span className={styles.strong}>{s.name}</span>
            <span className={styles.small}>{s.example}</span>
          </li>
        ))}
      </ul>
      <div className={styles.merge} aria-hidden="true"><span className={styles.tip} /></div>

      <div className={`${styles.node} ${styles.key}`}>
        <span className={styles.strong}>Merchant’s categories</span>
        <Chips list={['Nails', 'Pedicure']} />
        <span className={styles.small}>Nail and foot studio</span>
      </div>
      <div className={styles.line} aria-hidden="true" />

      <div className={styles.check}>
        <div className={styles.decision}>
          <span>Does the product share one of them?</span>
        </div>
        <div className={`${styles.node} ${styles.product}`}>
          <span className={styles.strong}>Product’s categories</span>
          <span className={styles.small}>Set in the back office, one or several</span>
        </div>
      </div>
      <div className={styles.split} aria-hidden="true" />

      <div className={styles.outcomes}>
        <div className={styles.outcome}>
          <span className={styles.answer}>Yes</span>
          <div className={`${styles.node} ${styles.key}`}>
            <span className={styles.strong}>Home tabs</span>
            <span className={styles.small}>For you, then each category, most bought first</span>
            <ul className={styles.tabs}>
              {tabs.map((t, i) => (
                <li key={t.name}>
                  <span className={`${styles.tab} ${i === 0 ? styles.current : ''}`}>{t.name}</span>
                  <span className={styles.items}>{t.items}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.outcome}>
          <span className={`${styles.answer} ${styles.no}`}>No</span>
          <div className={`${styles.node} ${styles.off}`}>
            <span className={styles.strong}>Search only</span>
            <span className={styles.small}>Not on this merchant’s home</span>
            <span className={styles.items}>Styling chair · Hair, Barber</span>
          </div>
        </div>
      </div>
    </div>
  );
}
