import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* How a sold-out item turns into registered demand. */
const waiting: Screen[] = [
  { shot: 'stock-out', name: 'Sold out', marks: [
    { left: 12, top: 768, width: 366, height: 64, title: 'Notify me replaces Add to Bag', body: 'A sold-out item still has a next step.' },
  ] },
  { shot: 'stock-notify', name: 'Registered', marks: [
    { left: 12, top: 702, width: 366, height: 130, title: 'The tap records the demand', body: 'It is confirmed, and listed in Restock.' },
  ] },
  { shot: 'stock-wait', name: 'Restock: waiting', marks: [
    { left: 10, top: 218, width: 370, height: 350, flip: true, title: 'Grouped by expected date', body: 'Once back, an item moves to In stock.' },
  ] },
];

/* What a merchant does inside Restock. */
const using: Screen[] = [
  { shot: 'stock-in', name: 'Restock: in stock', marks: [
    { left: 6, top: 98, width: 378, height: 116, flip: true, title: 'Two levels that look different', body: 'Underlined page tabs, then a capsule to filter Restock.' },
    { left: 12, top: 218, width: 366, height: 170, flip: true, title: 'Back, one tap to add', body: 'The same card as in Saved.' },
  ] },
  { shot: 'stock-requests', name: 'Restock: requests', marks: [
    { left: 14, top: 215, width: 180, height: 248, title: 'Add comes first', body: 'A product the store does not carry starts here.' },
    { left: 197, top: 215, width: 180, height: 248, flip: true, title: 'With or without a photo', body: 'The status sits on the card as a tag.' },
  ] },
  { shot: 'stock-request', name: 'Request a product', marks: [
    { left: 10, top: 102, width: 370, height: 128, flip: true, title: 'Up to three photos', body: 'Easier to show than to describe.' },
    { left: 10, top: 232, width: 370, height: 354, flip: true, title: 'Only the basics', body: 'What it is, brand, link and quantity.' },
  ] },
];

/** Registering demand for what is sold out. */
export function RestockWaiting() {
  return <ScreenCallouts screens={waiting} />;
}

/** Using Restock: what is back, what was asked for, and asking for more. */
export function RestockInUse() {
  return <ScreenCallouts screens={using} />;
}
