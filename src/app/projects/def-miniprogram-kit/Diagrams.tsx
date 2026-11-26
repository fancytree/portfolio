import styles from './Diagrams.module.css';

/** The old five places, and where each job went. */
export function TabMap() {
  const rows = [
    { from: 'Home · category grid', to: 'Home · For you', why: 'Tabs follow the merchant’s categories' },
    { from: 'Categories tab', to: 'Search, inside Home', why: 'Categories, brands and filters' },
    { from: 'No such place', to: 'Saved', why: 'Ranges, offers, restock, buy again', isNew: true },
    { from: 'Cart', to: 'Bag', why: 'Order list and quote list' },
    { from: 'Me', to: 'Account', why: 'Money owed first, orders, approvals' },
  ];
  return (
    <div className={styles.panel}>
      <ul className={styles.map}>
        {rows.map((row) => (
          <li key={row.to} className={`${styles.mapRow} ${row.isNew ? styles.isNew : ''}`}>
            <span className={styles.from}>{row.from}</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
            <span className={styles.to}>{row.to}</span>
            <span className={styles.why}>{row.why}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
      <p className={styles.note}>Blue edge: new or substantially changed. Dashed: planned.</p>
    </div>
  );
}
