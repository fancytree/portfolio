import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* A long range, from how it is listed to the several shades that go to the bag. */
const screens: Screen[] = [
  { shot: 'shade-ranges', name: 'Long range: split', marks: [
    { left: 8, top: 94, width: 374, height: 638, flip: true, title: 'One product per range', body: 'Up to 25 shades stay together. Longer ranges split into twenties, named by their codes.' },
  ] },
  { shot: 'shade-collect', name: 'Shade sheet: collect', marks: [
    { left: 4, top: 708, width: 382, height: 130, title: 'Tap to collect', body: 'Each tap takes one piece. Picks stay selected and the footer counts them.' },
  ] },
  { shot: 'shade-panel', name: 'Side panel: check', marks: [
    { left: 280, top: 108, width: 100, height: 230, flip: true, title: 'Adjust each quantity', body: 'The picks are listed together, away from the grid.' },
    { left: 92, top: 656, width: 290, height: 172, title: 'Add all, or keep choosing', body: 'One button adds them; the other goes back to the shades.' },
  ] },
];

/** Choosing several shades of one range. */
export function ShadeCallouts() {
  return <ScreenCallouts screens={screens} />;
}
