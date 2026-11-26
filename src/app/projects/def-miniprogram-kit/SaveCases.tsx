import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* What the heart does in each situation. */
const cases: (Screen | Screen[])[] = [
  { shot: 'save-single', name: 'One SKU: saved on tap', marks: [
    { left: 321, top: 593, width: 50, height: 50, flip: true, title: 'No sheet', body: 'One tap saves it, another removes it.' },
  ] },
  { shot: 'save-shade', name: 'Several shades: pick which', marks: [
    { left: 12, top: 384, width: 366, height: 378, flip: true, title: 'The exact shade', body: 'Saved ones carry a heart, and the sheet stays open for more.' },
  ] },
  { shot: 'save-glove', name: 'Colour and size: pick both', marks: [
    { left: 12, top: 556, width: 366, height: 206, flip: true, title: 'Attributes only', body: 'No quantity and no packaging: those belong to buying.' },
  ] },
  [
    { shot: 'save-remove-crop', name: 'Already saved', marks: [
      { left: 12, top: 210, width: 366, height: 62, title: 'The button turns around', body: 'Save becomes Remove from Saved.' },
    ] },
    { shot: 'save-soldout-crop', name: 'Sold out: still savable', marks: [
      { left: 243, top: 154, width: 66, height: 50, flip: true, title: 'Keep it for later', body: 'A sold-out option can be saved like any other.' },
    ] },
  ],
  { shot: 'save-list', name: 'In Saved: one entry per SKU', marks: [
    { left: 8, top: 220, width: 374, height: 332, flip: true, title: 'Ready to buy', body: '+ adds it; with a pack to choose, it opens the buy sheet.' },
  ] },
];

/** Saving, situation by situation. */
export function SaveCases() {
  return <ScreenCallouts screens={cases} />;
}
