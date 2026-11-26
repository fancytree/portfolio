import { ScreenCallouts, type Screen } from './ScreenCallouts';

const screens: Screen[] = [
  { shot: 'save-before', name: 'Before', before: true, marks: [
    { left: 16, top: 772, width: 56, height: 58, title: 'Heart beside Add to Bag', body: 'It competed with the main action.' },
  ] },
  { shot: 'product-shade', name: 'After: product page', marks: [
    { left: 225, top: 45, width: 54, height: 54, title: 'Heart in the header', body: 'Away from the buying path.' },
    { left: 12, top: 771, width: 366, height: 60, title: 'Add to Bag stands alone', body: 'Nothing sits beside it.' },
  ] },
  { shot: 'save-sheet', name: 'After: save sheet', marks: [
    { left: 12, top: 386, width: 366, height: 376, title: 'The exact item', body: 'Choose the shade; saved ones carry a heart.' },
    { left: 12, top: 771, width: 366, height: 60, title: 'One decision', body: 'No quantity and no pack.' },
  ] },
];

/** How saving moved, circled on the screens themselves. */
export function SavingCallouts() {
  return <ScreenCallouts screens={screens} />;
}
