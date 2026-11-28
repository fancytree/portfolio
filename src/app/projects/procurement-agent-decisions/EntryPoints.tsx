/** The purchase list, with the four places a purchase can begin or resume marked on it. */
import AnnotatedShot, { type Note } from './AnnotatedShot';

const ENTRIES: Note[] = [
  { title: 'Ask the Agent', body: 'The user says what they need in their own words. It becomes supplier and coverage.', box: [803, 102, 131, 44], side: 'top', endAtLine: true },
  { title: 'New PO', body: 'Already sure? Choose the supplier and the days in two fields.', box: [934, 102, 118, 44], side: 'top' },
  { title: 'A suggested supplier', body: 'The Agent shows who is running low. One click drafts the order.', box: [1103, 202, 322, 297], side: 'right' },
  { title: 'Open a ready plan', body: 'The Agent column shows what is prepared. Open a row and carry on.', box: [866, 262, 170, 418], side: 'bottom' },
];

export default function EntryPoints() {
  return (
    <AnnotatedShot
      src="/img/procurement-agent/entry/workspace.webp"
      alt="Purchase workspace: a list of purchase orders with an Agent column, Ask agent and New PO buttons above it, and suppliers to replenish on the right."
      notes={ENTRIES}
      caption="Four ways into one purchase. Each ends in the same editable draft."
    />
  );
}
