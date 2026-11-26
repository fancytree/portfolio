import { ScreenCallouts, type Screen } from './ScreenCallouts';
import styles from './SavedTradeoff.module.css';

/* Every way tried of taking several shades, in order, with one point each. */
const screens: Screen[] = [
  { shot: 'swatch-bulk', name: 'First: bulk grid', chosen: false, marks: [
    { left: 8, top: 694, width: 374, height: 66, title: 'Quantities in a strip', body: 'Several shades are in play, and the strip shows only some at once.', cost: true },
  ] },
  { shot: 'try-range', name: 'Then: all 120 at once', chosen: false, marks: [
    { left: 10, top: 66, width: 370, height: 162, flip: true, title: 'Filters to find a shade', body: 'Nobody should pick from 120, so the range is split instead.', cost: true },
  ] },
  { shot: 'try-collect', name: 'Then: collect, then review', chosen: false, marks: [
    { left: 6, top: 696, width: 378, height: 142, title: 'Quantity comes later', body: 'A tap takes one piece; each shade is not confirmed as it is picked.', cost: true },
  ] },
  { shot: 'shade-added', name: 'Now: one at a time', chosen: true, marks: [
    { left: 92, top: 92, width: 288, height: 182, flip: true, title: 'Confirmed, then in view', body: 'Each shade goes in with its quantity, and the panel adds them up.' },
  ] },
];

/** How several shades are taken: what was tried and what stayed. */
export function ShadeTradeoff() {
  return (
    <div>
      <div className={`${styles.group} ${styles.head}`}>
        <p className={styles.title}>Several shades</p>
        <p className={styles.line}>I gave up picking them all at once for a confirmed quantity on each.</p>
      </div>
      <ScreenCallouts screens={screens} />
    </div>
  );
}
