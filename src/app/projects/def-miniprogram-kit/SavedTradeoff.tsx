import { ScreenCallouts, type Screen } from './ScreenCallouts';
import styles from './SavedTradeoff.module.css';

/* One point per screen: why it was set aside, or why it was chosen. The heading states what was given up. */
const saved: Screen[] = [
  { shot: 'tab-earlier', name: 'Earlier: wishlist', chosen: false, marks: [
    { left: 270, top: 434, width: 98, height: 55, title: 'Whole products only', body: 'The shade is chosen again, and nothing new reaches them.', cost: true },
  ] },
  { shot: 'tab-saved-v2', name: 'Now: reasons to return', chosen: true, marks: [
    { left: 8, top: 154, width: 374, height: 400, flip: true, title: 'News comes to them', body: '13% of a range’s buyers take its new shade, against 1% of others.' },
  ] },
];

const again: Screen[] = [
  { shot: 'buy-by-product-v2', name: 'Option: by product', chosen: false, marks: [
    { left: 14, top: 188, width: 362, height: 524, flip: true, title: 'Item by item', body: 'Repeating a whole order takes many taps.', cost: true },
  ] },
  { shot: 'tab-buy-v2', name: 'Now: by order', chosen: true, marks: [
    { left: 12, top: 160, width: 366, height: 208, flip: true, title: 'Whole orders', body: 'Recognised by its pictures, then added in part or whole.' },
  ] },
];

const groups = [
  { title: 'Saved', line: 'I gave up a one-screen list for a reason to return.', screens: saved },
  { title: 'Buy again', line: 'I gave up one-tap items for repeating an order.', screens: again },
];

/** Two decisions side by side. */
export function SavedTradeoff() {
  return (
    <div className={styles.pair}>
      {groups.map((g) => (
        <section key={g.title} className={styles.group} aria-label={`${g.title} trade-off`}>
          <div className={styles.head}>
            <p className={styles.title}>{g.title}</p>
            <p className={styles.line}>{g.line}</p>
          </div>
          <ScreenCallouts screens={g.screens} />
        </section>
      ))}
    </div>
  );
}
