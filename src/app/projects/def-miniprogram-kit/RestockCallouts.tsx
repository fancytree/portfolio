import { ScreenCallouts, type Screen } from './ScreenCallouts';

/* Top row: a sold-out shade becomes registered demand. Bottom row: what is not in the store at all. */
const screens: Screen[] = [
  { shot: 'stock-page', name: 'Product page', marks: [
    { left: 12, top: 768, width: 366, height: 64, title: 'Choosing happens in the sheet', body: 'The page keeps Add to Bag while other shades are in stock.' },
  ] },
  { shot: 'stock-pick', name: 'Pick a sold-out shade', marks: [
    { left: 89, top: 339, width: 70, height: 96, title: 'Sold out, still selectable', body: 'Demand belongs to one shade, not the whole product.' },
    { left: 12, top: 742, width: 366, height: 88, flip: true, title: 'Notify me takes over', body: 'It replaces the quantity and Add to Bag.' },
  ] },
  { shot: 'stock-told', name: 'Registered', marks: [
    { left: 12, top: 702, width: 366, height: 128, title: 'Recorded per shade', body: 'The sheet stays open, so other shades can be added.' },
  ] },
  { shot: 'stock-wait', name: 'Restock: waiting', marks: [
    { left: 10, top: 218, width: 370, height: 350, flip: true, title: 'Grouped by expected date', body: 'Once back, it moves to In stock, with one tap to add.' },
  ] },
  { shot: 'stock-requests', name: 'Restock: requests', marks: [
    { left: 14, top: 215, width: 180, height: 248, title: 'Not in the store', body: 'The first card starts a request.' },
    { left: 197, top: 215, width: 180, height: 248, flip: true, title: 'Status on the card', body: 'With a photo or without.' },
  ] },
  { shot: 'stock-request', name: 'Request a product', marks: [
    { left: 10, top: 102, width: 370, height: 486, flip: true, title: 'Photos and the basics', body: 'Up to three photos, then what it is, brand, link and quantity.' },
  ] },
];

/** Registering demand: for a sold-out item, and for a product the store does not carry. */
export function RestockFlow() {
  return <ScreenCallouts screens={screens} columns={3} />;
}
