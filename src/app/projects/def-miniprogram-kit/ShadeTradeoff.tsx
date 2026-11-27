import { ScreenCallouts, type Screen } from './ScreenCallouts';
import styles from './SavedTradeoff.module.css';

/* Every way tried of taking several shades, in order, with one point each. */
const screens: Screen[] = [
  { shot: 'swatch-bulk', name: 'First: bulk grid', chosen: false, marks: [
    { left: 8, top: 694, width: 374, height: 66, title: 'Hard to track', body: 'They can’t see all their picks.', cost: true },
  ] },
  { shot: 'try-range', name: 'Then: all 120 at once', chosen: false, marks: [
    { left: 10, top: 66, width: 370, height: 162, flip: true, title: 'Too much to search', body: '120 shades make them filter first.', cost: true },
  ] },
  { shot: 'try-collect', name: 'Then: collect, then review', chosen: false, marks: [
    { left: 6, top: 696, width: 378, height: 142, title: 'Easy to get wrong', body: 'They may miss the quantity.', cost: true },
  ] },
  { shot: 'shade-added', name: 'Now: one at a time', chosen: true, marks: [
    { left: 92, top: 92, width: 288, height: 182, flip: true, title: 'Sure of every shade', body: 'Let them confirm, then watch it add up.' },
  ] },
];

/** How several shades are taken: what was tried and what stayed. */
export function ShadeTradeoff() {
  return (
    <div>
      <div className={`${styles.group} ${styles.head}`}>
        <p className={styles.title}>Several shades</p>
        <p className={styles.line}>I gave up picking all at once to get each quantity right.</p>
      </div>
      <ScreenCallouts screens={screens} />
    </div>
  );
}
