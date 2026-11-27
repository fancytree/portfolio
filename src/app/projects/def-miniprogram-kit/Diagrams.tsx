import styles from './Diagrams.module.css';

type Node = { name: string; note?: string; fresh?: boolean; planned?: boolean };

/** Pages under each of the four tabs. */
export function SiteMap() {
  const branches: { tab: string; pages: Node[] }[] = [
    { tab: 'Home', pages: [
      { name: 'For you', note: 'Banner, category tabs, feed', fresh: true },
      { name: 'Search', note: 'Recent, category, brand', fresh: true },
      { name: 'Filters and list' },
      { name: 'Product page', note: 'One scroll' },
      { name: 'Option sheet', note: 'Shade, size, pack' },
      { name: 'Save sheet', note: 'SKU only', fresh: true },
    ] },
    { tab: 'Saved', pages: [
      { name: 'Your ranges', note: 'New shades flagged', fresh: true },
      { name: 'Offers on what you buy', fresh: true },
      { name: 'Saved items' },
      { name: 'Buy again', note: 'Past orders' },
      { name: 'Restock', note: 'Back and expected', fresh: true },
      { name: 'Request a product', note: 'Not in the store', fresh: true },
      { name: 'Shared lists', note: 'Later', planned: true },
    ] },
    { tab: 'Bag', pages: [
      { name: 'Bag' },
      { name: 'Quote list', note: 'Equipment' },
      { name: 'Checkout', note: 'Balance, invoice' },
      { name: 'Payment', note: 'Receipt in 30 minutes', fresh: true },
      { name: 'Payment status', fresh: true },
    ] },
    { tab: 'Account', pages: [
      { name: 'Money summary', note: 'Follows the customer' },
      { name: 'Orders' },
      { name: 'Approvals' },
      { name: 'Quotes' },
      { name: 'Verify business', note: 'Picks categories' },
      { name: 'Settings' },
    ] },
  ];
  return (
    <div className={styles.tree}>
      <span className={styles.root}>Mini program</span>
      <ul className={styles.branches}>
        {branches.map((b) => (
          <li key={b.tab} className={styles.branch}>
            <span className={styles.tab}>{b.tab}</span>
            <ul className={styles.pages}>
              {b.pages.map((p) => (
                <li key={p.name} className={`${styles.page} ${p.fresh ? styles.fresh : ''} ${p.planned ? styles.planned : ''}`}>
                  {p.name}{p.note ? <small>{p.note}</small> : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className={styles.note}>Blue fill: new or substantially changed. Dashed: planned.</p>
    </div>
  );
}
