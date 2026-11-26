'use client';

// The redesigned mini program, live in the case: five short tours a scripted cursor plays in
// turn. Moving the pointer into the frame stops the script and hands the prototype to the visitor.

import LiveShowcase, { type ShowcaseItem } from '../def-erp-kit/LiveShowcase';
import { DEF_MINI_REDESIGN_URL } from './demoUrl';

const items: ShowcaseItem[] = [
  {
    title: 'Find by trade and search',
    lead: 'For you first, everything else within reach.',
    body: 'Switch the home page to another trade, then open search for categories, brands and filters.',
    seconds: 14, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoMain`,
    script: async (h) => {
      h.say('Find');
      await h.wait(1100);
      await h.click(h.find('#base button.bs-chip', 'Nails'));
      await h.wait(1500);
      await h.click(h.find('#base button.bs-chip', 'Barber'));
      await h.wait(1500);
      await h.click(h.find('#base a[href="PhotoSearch.dc.html"]'));
      await h.wait(1500);
      await h.click(h.find('#base a[href="UIFilters.dc.html"]'));
      await h.wait(1500);
      await h.click(h.find('#over button', 'Tools'));
      await h.wait(900);
      await h.click(h.find('#over a', 'Show'));
      await h.wait(2000);
    },
  },
  {
    title: 'Add to the bag',
    lead: 'Options appear only when you are buying.',
    body: 'Pick a size and a pack, and the item lands in the bag. Piece, pack and case are the same product in different units.',
    seconds: 12, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoProduct`,
    script: async (h) => {
      h.say('Add to bag');
      await h.wait(900);
      await h.click(h.find('#base .bs-actionbar a'));
      await h.wait(900);
      await h.click(h.find('#over button', '50 ml'));
      await h.wait(600);
      await h.click(h.find('#over button', 'Pack'));
      await h.wait(900);
      await h.click(h.find('#over a', 'Add to Bag'));
      await h.wait(2600);
    },
  },
  {
    title: 'Choose a shade',
    lead: 'Twenty shades, one tap each.',
    body: 'Nail polish has no packaging step. A sold-out shade is struck through on its own picture.',
    seconds: 12, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoProductShade`,
    script: async (h) => {
      h.say('Shade');
      await h.wait(900);
      await h.click(h.find('#base .bs-actionbar a'));
      await h.wait(900);
      await h.click(h.find('#over button', '12'));
      await h.wait(800);
      await h.click(h.find('#over button', '07'));
      await h.wait(1200);
      await h.click(h.find('#over button', '16'));
      await h.wait(800);
      await h.click(h.find('#over a', 'Add to Bag'));
      await h.wait(2400);
    },
  },
  {
    title: 'Save for later',
    lead: 'Saving is a side path.',
    body: 'The heart opens its own sheet with SKU options only. The saved shade shows up under Saved.',
    seconds: 12, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoProductShade`,
    script: async (h) => {
      h.say('Save');
      await h.wait(900);
      await h.click(h.find('#base .bs-header__fav a'));
      await h.wait(900);
      await h.click(h.find('#over button', '14'));
      await h.wait(700);
      await h.click(h.find('#over button', 'Save'));
      await h.wait(1100);
      await h.click(h.find('#over a[aria-label="Close"]'));
      await h.wait(700);
      await h.click(h.find('#jump button', 'Saved'));
      await h.wait(2000);
    },
  },
  {
    title: 'Pay by transfer',
    lead: 'No online payment, so the order explains itself.',
    body: 'Balance first, then a receipt within 30 minutes. A demo control plays the finance team.',
    seconds: 18, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoBag`,
    script: async (h) => {
      h.say('Pay');
      await h.wait(900);
      await h.click(h.find('#base a', 'Checkout'));
      await h.wait(1200);
      await h.click(h.find('#base a', 'Place order'));
      await h.wait(1500);
      await h.click(h.find('#base button', 'Upload receipt'));
      await h.wait(900);
      await h.click(h.find('#base a', 'Submit receipt'));
      await h.wait(1400);
      await h.click(h.find('#base button', 'Receipt looks right'));
      await h.wait(1100);
      await h.click(h.find('#base button', 'Funds arrived'));
      await h.wait(2000);
    },
  },
];

export default function MiniProgramDemo() {
  return (
    <LiveShowcase
      items={items}
      src={`${DEF_MINI_REDESIGN_URL}?start=PhotoMain`}
      label="mini program"
      title="DEF mini program redesign, clickable prototype with demonstration data"
      baseWidth={1100}
      ready="body[data-ready]"
    />
  );
}
