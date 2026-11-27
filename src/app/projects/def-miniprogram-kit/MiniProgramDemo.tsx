'use client';

// The redesigned mini program, live in the case: six short tours a scripted cursor plays in
// turn. Moving the pointer into the frame stops the script and hands the prototype to the visitor.

import LiveShowcase, { type ShowcaseItem } from '../def-erp-kit/LiveShowcase';
import { DEF_MINI_REDESIGN_URL } from './demoUrl';

const items: ShowcaseItem[] = [
  {
    title: 'Find by category and search',
    body: <>Help them find their way: <strong>their own category first</strong>, search for the rest.</>,
    seconds: 14, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoMain`,
    script: async (h) => {
      h.say('Find');
      await h.wait(1100);
      await h.click(h.find('#base button.bs-chip', 'Nails'));
      await h.wait(1500);
      await h.click(h.find('#base button.bs-chip', 'Hair'));
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
    body: <>Make adding feel certain: size and pack are chosen <strong>only when buying</strong>.</>,
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
    title: 'Choose shades',
    body: <>Help them build a shade order: add one, <strong>check the total</strong>, take another.</>,
    seconds: 17, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoShadeRanges`,
    script: async (h) => {
      h.say('Shades');
      await h.wait(1200);
      await h.click(h.find('#base a', 'Choose shade'));
      await h.wait(1000);
      await h.click(h.find('#over button[aria-label="Increase"]'));
      await h.wait(400);
      await h.click(h.find('#over button[aria-label="Increase"]'));
      await h.wait(600);
      await h.click(h.find('#over button', 'Add to Bag'));
      await h.wait(1800);
      await h.click(h.find('#over button', 'Keep choosing'));
      await h.wait(800);
      await h.click(h.find('#over .bs-option', 'LL12'));
      await h.wait(600);
      await h.click(h.find('#over button', 'Add to Bag'));
      await h.wait(2000);
      await h.click(h.find('#over a', 'View Bag'));
      await h.wait(1800);
    },
  },
  {
    title: 'Save for later',
    body: <>Give them a <strong>reason to return</strong>: save a shade, then come back for news and restocks.</>,
    seconds: 12, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoProductShade`,
    script: async (h) => {
      h.say('Save');
      await h.wait(900);
      await h.click(h.find('#base .bs-header__fav a'));
      await h.wait(900);
      await h.click(h.find('#over button', 'LL14'));
      await h.wait(700);
      await h.click(h.find('#over button', 'Save'));
      await h.wait(1100);
      await h.click(h.find('#over a[aria-label="Close"]'));
      await h.wait(700);
      await h.click(h.find('#jump button', 'Saved'));
      await h.wait(1800);
      await h.click(h.find('#base button', 'Restock'));
      await h.wait(1600);
      await h.click(h.find('#base button', 'Saved'));
      await h.wait(900);
      await h.click(h.find('#base a', 'Choose shade'));
      await h.wait(1800);
    },
  },
  {
    title: 'Reorder and restock',
    body: <>Help them <strong>restock the salon</strong>: reorder, check what’s back, or ask for more.</>,
    seconds: 17, fresh: true, src: `${DEF_MINI_REDESIGN_URL}?start=PhotoSaved`,
    script: async (h) => {
      h.say('Reorder');
      await h.wait(900);
      await h.click(h.find('#base button', 'Buy again'));
      await h.wait(1400);
      await h.click(h.find('#base a', 'Choose items'));
      await h.wait(1800);
      await h.click(h.find('#base a[href="PhotoSaved.dc.html"]'));
      await h.wait(700);
      await h.click(h.find('#base button', 'Restock'));
      await h.wait(1500);
      await h.click(h.find('#base button', 'Waiting'));
      await h.wait(1500);
      await h.click(h.find('#base button', 'Requests'));
      await h.wait(1400);
      await h.click(h.find('#base a[href="PhotoRequest.dc.html"]'));
      await h.wait(1800);
      await h.click(h.find('#base a', 'Send request'));
      await h.wait(1600);
    },
  },
  {
    title: 'Pay by transfer',
    body: <>Guide them through payment: pay, <strong>upload the receipt within 30 minutes</strong>, track it. A demo control plays finance.</>,
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
