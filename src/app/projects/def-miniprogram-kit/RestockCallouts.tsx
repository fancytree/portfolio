import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* A sold-out shade becomes registered demand; then Restock, including what is not in the store at all. */
const screens: (Screen | Screen[])[] = [
  { shot: 'stock-page', name: 'Product page', marks: [
    { left: 12, top: 768, width: 366, height: 64, title: 'Keep them buying', body: 'One sold-out shade shouldn’t stop them.' },
  ] },
  [
    { shot: 'stock-pick', name: 'Pick a sold-out shade', marks: [
      { left: 12, top: 742, width: 366, height: 88, flip: true, title: 'Don’t leave empty-handed', body: 'Invite them to ask to be told.' },
    ] },
    { shot: 'stock-told-crop', name: 'Registered', marks: [
      { left: 12, top: 12, width: 366, height: 128, flip: true, title: 'Noted, carry on', body: 'Reassure them, and let them keep choosing.' },
    ] },
  ],
  { shot: 'stock-wait', name: 'Restock: waiting', marks: [
    { left: 10, top: 218, width: 370, height: 350, flip: true, title: 'Know when to return', body: 'Help them plan around the date.' },
  ] },
  { shot: 'stock-requests', name: 'Restock: requests', marks: [
    { left: 14, top: 215, width: 180, height: 248, title: 'Ask for what’s missing', body: 'Encourage requests they can follow.' },
  ] },
  { shot: 'stock-request', name: 'Request a product', marks: [
    { left: 10, top: 102, width: 370, height: 486, flip: true, title: 'Make asking easy', body: 'Let a photo speak for them.' },
  ] },
];

/** Registering demand: for a sold-out item, and for a product the store does not carry. */
export function RestockFlow() {
  return <ScreenCallouts screens={screens} />;
}
