'use client';

/**
 * Version 1 in the current design language: the whole purchase by hand, with the two
 * places where AI took part (reading the supplier confirmation and the delivery note).
 * The scripts are the ERP case's purchasing demo; only the step copy differs.
 */
import LiveShowcase, { type ShowcaseItem } from '../def-erp-kit/LiveShowcase';
import { collapseNewSidebar, purchasing } from '../def-erp-kit/ErpLiveDemo';

/** [step in the ERP purchasing demo, title, body] */
const STEPS: [number, string, string][] = [
  [0, 'Draft the order', 'Set quantities from recent sales and stock. **The decision is the user’s**: nothing here suggests a number.'],
  [2, 'AI checks the confirmation', 'Upload the supplier PDF. **AI reads it and marks what changed**, so the user only looks at those lines.'],
  [3, 'AI checks the delivery', 'Upload the delivery note. **AI compares it with the confirmation** and flags short or extra goods.'],
  [4, 'Settle each exception', 'For goods never confirmed, **choose to return them, keep a gift, or stock them in**.'],
  [5, 'Close what is missing', 'Wait, flag a delay, close, or return. **The user always knows what is still open.**'],
];
const items: ShowcaseItem[] = STEPS.map(([i, title, body]) => ({ ...purchasing[i], title, body }));

/** Version 1 had no Agent, so its sidebar entry is hidden. */
function prepare(doc: Document) {
  collapseNewSidebar(doc);
  const style = doc.createElement('style');
  style.textContent = 'aside button[title="Procurement agent"]{display:none!important}';
  doc.head.appendChild(style);
}

export default function FirstVersionDemo() {
  return (
    <LiveShowcase
      items={items}
      src={purchasing[0].src!}
      label="purchasing · version 1"
      title="DEF ERP — first version of purchasing, demonstration data"
      baseWidth={1440}
      ready="tbody button[aria-expanded]"
      prepare={prepare}
    />
  );
}
