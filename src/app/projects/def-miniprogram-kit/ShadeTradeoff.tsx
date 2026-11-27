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

/* Then: showing, on the sheet, what is already in the bag. */
const counts: Screen[] = [
  { shot: 'shade-count-stepper-v2', name: 'First: in the stepper', chosen: false, marks: [
    { left: 244, top: 716, width: 134, height: 58, flip: true, title: 'Add three more?', body: 'They may read it as adding three.', cost: true },
  ] },
  { shot: 'shade-count-line-v2', name: 'Then: mark and a line', chosen: false, marks: [
    { left: 10, top: 674, width: 370, height: 46, title: 'More to read', body: 'One more line before they can add.', cost: true },
  ] },
  { shot: 'shade-count-label-v2', name: 'Then: written mark', chosen: false, marks: [
    { left: 10, top: 238, width: 370, height: 290, flip: true, title: 'Long counts crowd it', body: 'Two digits or more barely fit.', cost: true },
  ] },
  { shot: 'shade-count-icon-v2', name: 'Now: bag and number', chosen: true, marks: [
    { left: 10, top: 238, width: 370, height: 290, flip: true, title: 'Seen at a glance', body: 'They spot what they’ve added, however many.' },
  ] },
];

/** How a shade already in the bag is shown. */
export function InBagTradeoff() {
  return (
    <div>
      <div className={`${styles.group} ${styles.head}`}>
        <p className={styles.title}>Already in the bag</p>
        <p className={styles.line}>I gave up a written note for a mark that fits any count.</p>
      </div>
      <ScreenCallouts screens={counts} />
    </div>
  );
}
