'use client';

import { type Helpers } from './LiveDemo';
import LiveShowcase, { type ShowcaseItem } from './LiveShowcase';

const SRC = '/demos/def-design-system/index.html?view=docs';

/** Jump with the page's own sidebar, the way a visitor would. */
const go = async (h: Helpers, id: string) => {
  await h.zoomOut();
  await h.click(h.find(`[data-nav="${id}"]`));
  await h.wait(900);
};
const each = async (h: Helpers, selector: string, limit = 4) => {
  for (let i = 0; i < limit; i += 1) {
    const el = h.all(selector)[i];
    if (el) await h.hover(el);
  }
};

const items: ShowcaseItem[] = [
  {
    title: 'Principles', lead: 'People first, then ERP rules.', seconds: 19,
    body: 'Fourteen rules, one source of truth.',
    script: async (h) => {
      await go(h, 'principles');
      h.say('Start from the people');
      await each(h, '[data-principle]', 6);
      await go(h, 'how');
      h.say('Change once, pages follow');
      await each(h, '[data-flow]', 5);
    },
  },
  {
    title: 'Colour', lead: 'Each colour has one job.', seconds: 9,
    body: 'Blue acts. Status colours mean status.',
    script: async (h) => {
      await go(h, 'colour');
      h.say('Blue passes AA');
      await h.zoom(h.find('[data-detail]'), 1.5);
      await h.click(h.find('[data-token="--primary"]'));
      await h.wait(900);
      h.say('Tint for fills only');
      await h.click(h.find('[data-token="--primary-tint"]'));
      await h.wait(900);
      h.say('Red: errors, no undo');
      await h.click(h.find('[data-token="--destructive"]'));
      await h.wait(900);
    },
  },
  {
    title: 'Type & shape', lead: 'Few values, repeated.', seconds: 24,
    body: 'Four sizes, a 4px scale, five radii.',
    script: async (h) => {
      await go(h, 'type');
      h.say('Four sizes');
      await each(h, '[data-type-row]', 5);
      await go(h, 'space');
      h.say('Five radii');
      await each(h, '[data-radius]', 5);
      h.say('4px steps');
      await h.zoom(h.find('[data-space-demo]'), 1.7);
      await each(h, '[data-space]', 6);
      await go(h, 'icons');
      h.say('20px slot, 1.5px stroke');
      await h.zoom(h.find('[data-icon-anatomy]'), 1.5);
      await h.hover(h.find('[data-icon-anatomy]'));
      await h.hover(h.find('[data-icon-stroke]'));
      await each(h, '[data-icon-rule]', 4);
    },
  },
  {
    title: 'Controls', lead: 'Every state is designed.', seconds: 14,
    body: 'Pending, success, error.',
    script: async (h) => {
      await go(h, 'buttons');
      h.say('Pending, then saved');
      await h.click(h.find('[data-demo="save"]'));
      await h.wait(1600);
      h.say('Every icon has a name');
      await each(h, '[data-icon-button]', 3);
      await go(h, 'forms');
      h.say('Errors by the field');
      await h.zoom(h.find('#d-invoice'), 1.8);
      await h.click(h.find('#d-invoice'));
      await h.type(h.find('#d-invoice'), 'INV-2026-018');
      h.say('Fast entry');
      await h.zoomOut();
      await h.click(h.find('input[aria-label="Search SKU or product"]'));
      await h.type(h.find('input[aria-label="Search SKU or product"]'), 'Shampoo');
      const up = h.find('button[aria-label*="Quantity"]');
      await h.click(up);
      await h.click(up);
    },
  },
  {
    title: 'Patterns', lead: 'Components become patterns.', seconds: 18,
    body: 'Status, progress, the list page.',
    script: async (h) => {
      await go(h, 'tags');
      h.say('Words first, colour second');
      await each(h, '[data-tag]', 3);
      await go(h, 'progress');
      h.say('Partial is a state');
      await h.zoom(h.find('[data-section="progress"] [aria-label="Purchase order progress"]'), 1.6);
      await h.click(h.find('button', 'Fully received'));
      await h.wait(700);
      await h.click(h.find('button', 'Partial receipt'));
      await go(h, 'tables');
      h.say('Filter, search, page');
      await h.click(h.find('[role="tab"]', 'Review'));
      await h.click(h.find('input[aria-label="Search orders"]'));
      await h.type(h.find('input[aria-label="Search orders"]'), 'Studio');
      await h.wait(900);
    },
  },
  {
    title: 'Data visualisation', lead: 'Charts follow the tables.', seconds: 18,
    body: 'Same tokens, same formats.',
    script: async (h) => {
      await go(h, 'dataviz');
      h.say('KPIs follow the period');
      await h.click(h.find('[data-viz="kpi"] button', '7 days'));
      await h.wait(900);
      await h.click(h.find('[data-viz="kpi"] button', '30 days'));
      h.say('Hover for exact values');
      await h.zoom(h.find('[data-trend-chart]'), 1.4);
      const chart = h.find('[data-trend-chart]');
      await h.hover(chart);
      await h.wait(1200);
      h.say('One colour per value');
      await h.zoomOut();
      await each(h, '[data-viz="donut"] [data-slot="donut-legend"] button', 3);
      await each(h, '[data-share-row]', 3);
    },
  },
  {
    title: 'States & overlays', lead: 'No page is ever blank.', seconds: 20,
    body: 'Every state, every layer.',
    script: async (h) => {
      await go(h, 'states');
      h.say('Loading');
      await h.click(h.find('[data-state-btn="loading"]'));
      await h.wait(700);
      h.say('Empty: why, and what next');
      await h.zoom(h.find('[data-state-view]'), 1.5);
      await h.click(h.find('[data-state-btn="empty"]'));
      await h.wait(900);
      h.say('Error: retry');
      await h.click(h.find('[data-state-btn="error"]'));
      await h.wait(700);
      await h.click(h.find('[data-state-view] button', 'Retry'));
      await go(h, 'overlays');
      h.say('Details beside the list');
      await h.click(h.find('[data-overlay="sheet"]'));
      await h.wait(1400);
      await h.click(h.find('[data-slot="sheet-close"]'));
      await h.wait(400);
      h.say('Rare actions in a menu');
      await h.click(h.find('[data-overlay="menu"]'));
      await h.wait(1000);
      await h.click(h.find('[role="menuitem"]', 'Print DDT'));
    },
  },
  {
    title: 'Check', lead: 'Ask by consequence, then audit.', seconds: 25,
    body: 'Confirm by consequence. Audit the code.',
    script: async (h) => {
      await go(h, 'confirm');
      h.say('Draft edits: no dialog');
      await h.click(h.find('[data-demo="qty"]'));
      await h.click(h.find('[data-demo="qty"]'));
      h.say('Costly: say what is lost');
      await h.click(h.find('[data-demo="resume"]'));
      await h.wait(1300);
      await h.click(h.find('[role="dialog"] button', 'Replace'));
      await h.zoomOut();
      h.say('No undo: list consequences');
      await h.click(h.find('[data-demo="stocktake"]'));
      await h.wait(1500);
      await h.click(h.find('[role="dialog"] button', 'Cancel'));
      h.say('Counter: no dialog');
      await h.click(h.find('[data-demo="hold"]'));
      await h.wait(1500);
      await go(h, 'formats');
      h.say('Tabular digits hold still');
      await h.zoom(h.find('[data-tabular-demo]'), 1.4);
      await h.hover(h.find('[data-numerals="proportional"]'));
      await h.hover(h.find('[data-numerals="tabular"]'));
      await h.wait(800);
      await go(h, 'check');
      h.say('282 → 7 violations');
      await h.wait(1500);
    },
  },
];

export default function DesignSystemShowcase() {
  return <LiveShowcase items={items} src={SRC} label="design system" title="DEF ERP design system — live component library" />;
}
