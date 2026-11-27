import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* What the heart does in each situation. */
const cases: (Screen | Screen[])[] = [
  { shot: 'save-single-page', name: 'One SKU: saved on tap', marks: [
    { left: 224, top: 45, width: 54, height: 54, flip: true, title: 'Save without stopping', body: 'One tap to keep it or drop it.' },
  ] },
  { shot: 'save-shade', name: 'Several shades: pick which', marks: [
    { left: 12, top: 384, width: 366, height: 378, flip: true, title: 'Keep the right shade', body: 'Show what’s saved; invite more.' },
  ] },
  { shot: 'save-glove', name: 'Colour and size: pick both', marks: [
    { left: 12, top: 556, width: 366, height: 206, flip: true, title: 'Decide quantity later', body: 'Keep saving quick.' },
  ] },
  [
    { shot: 'save-remove-crop', name: 'Already saved', marks: [
      { left: 12, top: 210, width: 366, height: 62, title: 'No second guessing', body: 'Show it’s saved, and how to remove it.' },
    ] },
    { shot: 'save-soldout-crop', name: 'Sold out: still savable', marks: [
      { left: 243, top: 154, width: 66, height: 50, flip: true, title: 'Don’t lose track', body: 'Let them keep it until it returns.' },
    ] },
  ],
  { shot: 'save-list', name: 'In Saved: one entry per SKU', marks: [
    { left: 8, top: 220, width: 374, height: 332, flip: true, title: 'Saved to ordered', body: 'Help them buy straight from the list.' },
  ] },
];

/** Saving, situation by situation. */
export function SaveCases() {
  return <ScreenCallouts screens={cases} />;
}
