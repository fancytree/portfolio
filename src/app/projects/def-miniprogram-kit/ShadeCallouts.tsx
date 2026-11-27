import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* A long range, from how it is listed to what each product has put in the bag. */
const screens: Screen[] = [
  { shot: 'shade-split', name: 'Long range: split', marks: [
    { left: 12, top: 136, width: 366, height: 700, flip: true, title: 'Find the right numbers', body: 'Short lists, labelled by codes they know.' },
  ] },
  { shot: 'shade-pick', name: 'Shade sheet: pick', marks: [
    { left: 6, top: 696, width: 378, height: 142, title: 'Get each shade right', body: 'Confirm quantity while the shade is in mind.' },
  ] },
  { shot: 'shade-added', name: 'Added panel: check', marks: [
    { left: 246, top: 96, width: 130, height: 170, flip: true, title: 'Check before moving on', body: 'With several SKUs, let them fix it at once.' },
    { left: 94, top: 662, width: 288, height: 170, title: 'One more, or finish', body: 'Encourage more, with the bag always close.' },
  ] },
];

/** Choosing shades of one range, one at a time. */
export function ShadeCallouts() {
  return <ScreenCallouts screens={screens} />;
}
