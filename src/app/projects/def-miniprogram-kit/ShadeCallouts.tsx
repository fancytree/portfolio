import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* A long range, from how it is listed to what each product has put in the bag. */
const screens: Screen[] = [
  { shot: 'shade-split', name: 'Long range: split', marks: [
    { left: 12, top: 136, width: 366, height: 700, flip: true, title: 'One product per range', body: 'Up to 25 shades stay together. Longer ranges split into twenties, named by their codes.' },
  ] },
  { shot: 'shade-pick', name: 'Shade sheet: pick', marks: [
    { left: 6, top: 696, width: 378, height: 142, title: 'One shade, one quantity', body: 'Each shade is confirmed with its own quantity.' },
  ] },
  { shot: 'shade-added', name: 'Added panel: check', marks: [
    { left: 246, top: 96, width: 130, height: 170, flip: true, title: 'What this product added', body: 'The panel opens after adding and lists its shades in the bag, ready to adjust.' },
    { left: 94, top: 662, width: 288, height: 170, title: 'Carry on, or check out', body: 'Keep choosing returns to the shades; View Bag opens the bag.' },
  ] },
];

/** Choosing shades of one range, one at a time. */
export function ShadeCallouts() {
  return <ScreenCallouts screens={screens} />;
}
