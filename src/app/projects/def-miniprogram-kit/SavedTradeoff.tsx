import { ScreenCallouts, type Screen } from './ScreenCallouts';
import styles from './SavedTradeoff.module.css';

const saved: Screen[] = [
  { shot: 'tab-earlier', name: 'Earlier: wishlist', marks: [
    { left: 14, top: 166, width: 362, height: 328, title: 'Gain: simple', body: 'Everything kept is in view at once.' },
    { left: 270, top: 434, width: 98, height: 55, title: 'Cost: whole products', body: 'The shade is chosen again, and nothing new reaches them.', cost: true },
  ] },
  { shot: 'tab-saved', name: 'Now: reasons to return', marks: [
    { left: 8, top: 168, width: 374, height: 398, flip: true, title: 'Gain: news comes to them', body: '13% of a range’s buyers take its new shade, against 1% of others.' },
    { left: 8, top: 578, width: 374, height: 180, flip: true, title: 'Cost: kept items move down', body: 'One scroll further, though each keeps its exact shade or size.', cost: true },
  ] },
];

const again: Screen[] = [
  { shot: 'buy-by-product', name: 'Option: by product', marks: [
    { left: 14, top: 192, width: 362, height: 172, flip: true, title: 'Gain: one tap', body: 'One item restocks at its last quantity.' },
    { left: 14, top: 368, width: 362, height: 346, flip: true, title: 'Cost: item by item', body: 'Repeating a whole order takes many taps.', cost: true },
  ] },
  { shot: 'tab-buy', name: 'Now: by order', marks: [
    { left: 12, top: 164, width: 366, height: 210, flip: true, title: 'Gain: whole orders', body: 'Recognised by its pictures, then added in part or whole.' },
    { left: 223, top: 311, width: 132, height: 52, title: 'Cost: one more step', body: 'A single item needs the order opened first.', cost: true },
  ] },
];

const groups = [
  { title: 'Saved', line: 'I gave up a one-screen list for a reason to return.', screens: saved },
  { title: 'Buy again', line: 'I gave up one-tap items for repeating an order.', screens: again },
];

/** Two trade-offs side by side: what each version gains and costs. */
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
