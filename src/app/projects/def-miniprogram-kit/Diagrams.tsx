import { BadgePercent, Database, MessageSquareText, PackageCheck, RotateCcw, Sparkles, Users } from 'lucide-react';
import { ShareBars } from './ResearchCharts';
import styles from './Diagrams.module.css';

/** Three sources, as numbers. */
export function Method() {
  const sources = [
    { icon: <Users aria-hidden="true" />, big: '7', name: 'Merchant interviews', note: 'What they come to the store for' },
    { icon: <MessageSquareText aria-hidden="true" />, big: '1', name: 'Salesperson interview', note: 'How orders are really handled' },
    { icon: <Database aria-hidden="true" />, big: '6', name: 'Months of sales lines', note: 'March to August 2026, repeat accounts' },
  ];
  return (
    <div className={styles.panel}>
      <ul className={styles.three}>
        {sources.map((s) => (
          <li key={s.name} className={styles.card}>
            {s.icon}
            <span className={styles.big}>{s.big}</span>
            <span className={styles.strong}>{s.name}</span>
            <span className={styles.label}>{s.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** What merchants asked for, and what the design does about it. */
export function Needs() {
  const needs = [
    { icon: <Sparkles aria-hidden="true" />, need: 'Anything new from my brands?', answer: 'Your ranges' },
    { icon: <PackageCheck aria-hidden="true" />, need: 'Is it back in stock?', answer: 'Restock' },
    { icon: <BadgePercent aria-hidden="true" />, need: 'Is what I buy on offer?', answer: 'Offers for you' },
    { icon: <RotateCcw aria-hidden="true" />, need: 'Otherwise, buy it again', answer: 'Saved tab' },
  ];
  return (
    <div className={styles.panel}>
      <p className={styles.title}>Merchants: four reasons to open the store</p>
      <ul className={styles.four}>
        {needs.map((n) => (
          <li key={n.need} className={styles.card}>
            {n.icon}
            <span className={styles.strong}>{n.need}</span>
            <span className={styles.answer}>→ {n.answer}</span>
          </li>
        ))}
      </ul>
      <p className={styles.note}>The salesperson added: one listing per shade is hard to search, many orders arrive as chat messages, and payments are checked in four places.</p>
    </div>
  );
}

/** Four small charts from the order data. */
export function OrderCharts() {
  return (
    <div className={styles.charts}>
      <ShareBars title="They come back" rows={[
        { label: 'Repeat accounts that rebought a product', value: 85, key: true },
        { label: 'With four or more order days', value: 99 },
        { label: 'Orders that were return visits', value: 73 },
      ]} />
      <ShareBars title="Established accounts: bought before" rows={[
        { label: 'Same shade', value: 42 },
        { label: 'Same product', value: 75, key: true },
        { label: 'Same brand', value: 94 },
      ]} />
      <ShareBars title="When they buy a colour" rows={[
        { label: 'New shade, known range', value: 54, key: true },
        { label: 'Same shade again', value: 36 },
        { label: 'New range', value: 10 },
      ]} />
      <ShareBars title="Who picks up a new shade" rows={[
        { label: 'Accounts that buy the range', value: 13, key: true },
        { label: 'Other accounts', value: 1 },
      ]} />
      <ShareBars title="Spend concentrates in one category" rows={[
        { label: '80% or more in one category', value: 69, key: true },
        { label: 'Only ever one category', value: 26 },
      ]} />
      <ShareBars title="Main category" rows={[
        { label: 'Nails', value: 80, key: true },
        { label: 'Hair', value: 14 },
        { label: 'Hair removal', value: 6 },
      ]} />
    </div>
  );
}

/** Products and merchants both link to categories, many to many; a merchant’s links become the home tabs. */
export function CategoryLinks() {
  const categories = ['Hair', 'Barber', 'Nails', 'Pedicure', 'Spa'];
  const groups = [
    { title: 'Products', rows: [
      { name: 'Nitrile gloves', in: ['Hair', 'Barber', 'Nails', 'Pedicure', 'Spa'] },
      { name: 'Gel colour', in: ['Nails', 'Pedicure'] },
      { name: 'Styling chair', in: ['Hair', 'Barber'] },
    ] },
    { title: 'Merchants', rows: [
      { name: 'Nail and foot studio', in: ['Nails', 'Pedicure'] },
      { name: 'Barber shop', in: ['Barber', 'Hair'] },
    ] },
  ];
  return (
    <div className={styles.panel}>
      <div className={styles.scroll}>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <td />
              {categories.map((c) => <th key={c} scope="col">{c}</th>)}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.title} className={g.title === 'Merchants' ? styles.merchants : undefined}>
              <tr><th colSpan={categories.length + 1} scope="colgroup" className={styles.group}>{g.title}</th></tr>
              {g.rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  {categories.map((c) => (
                    <td key={c}>{row.in.includes(c) ? <span className={styles.dot} role="img" aria-label="Linked" /> : null}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <ul className={styles.three}>
        <li className={styles.card}><span className={styles.strong}>Chosen</span><span className={styles.label}>Picked at business verification, or followed later</span></li>
        <li className={styles.card}><span className={styles.strong}>Bought</span><span className={styles.label}>Added from purchase history</span></li>
        <li className={styles.card}><span className={styles.strong}>Shown</span><span className={styles.label}>Tabs: For you, then their categories, most bought first</span></li>
      </ul>
      <p className={styles.note}>An illustration of the model. Categories only shape what is shown first; every product stays searchable.</p>
    </div>
  );
}

/** How far merchants and products spread across categories. */
export function SpreadCharts() {
  return (
    <div className={styles.charts}>
      <ShareBars title="Merchants work across categories" rows={[
        { label: '10% or more of spend in a second one', value: 48, key: true },
        { label: 'Buy both nails and hair removal', value: 39 },
      ]} />
      <ShareBars title="Who buys gloves, by main category" rows={[
        { label: 'Nails', value: 86 },
        { label: 'Hair', value: 8 },
        { label: 'Hair removal', value: 6 },
      ]} />
    </div>
  );
}

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
