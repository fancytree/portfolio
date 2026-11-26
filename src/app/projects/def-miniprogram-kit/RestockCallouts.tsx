import { ScreenCallouts, type Screen } from './ScreenCallouts';

const screens: Screen[] = [
  { shot: 'stock-out', name: 'Sold out', marks: [
    { left: 12, top: 768, width: 366, height: 64, title: 'Notify me replaces Add to Bag', body: 'A sold-out item still has a next step.' },
  ] },
  { shot: 'stock-notify', name: 'Registered', marks: [
    { left: 12, top: 702, width: 366, height: 130, title: 'The tap records the demand', body: 'It is confirmed, and listed in Restock.' },
  ] },
  { shot: 'stock-restock', name: 'Restock tab', marks: [
    { left: 12, top: 380, width: 366, height: 198, flip: true, title: 'Waiting, with a date', body: 'Once back, it moves up, ready to add.' },
    { left: 12, top: 588, width: 366, height: 168, flip: true, title: 'Not in the store', body: 'Requests and their status sit below.' },
  ] },
  { shot: 'stock-request', name: 'Request a product', marks: [
    { left: 12, top: 156, width: 366, height: 350, flip: true, title: 'Only the basics', body: 'What it is, brand, link and quantity, sent to the ERP’s request list.' },
  ] },
];

/** Registering demand for what is sold out, and for what the store does not carry. */
export function RestockCallouts() {
  return <ScreenCallouts screens={screens} />;
}
