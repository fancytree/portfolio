'use client';

import LiveShowcase, { type ShowcaseItem } from '../def-erp-kit/LiveShowcase';

/**
 * Procurement Agent, played live on the redesigned ERP (the same build as the DEF ERP case).
 * The Agent has its own entry in the ERP sidebar; each step opens the page it needs.
 */
const BASE = '/demos/def-design-system/index.html?view=agent';
const WORKSPACE = BASE;
const DRAFT = `${BASE}&po=PO-2026-0842`;
const ORDERED = `${BASE}&po=PO-2026-0840`;
const RECEIVED = `${BASE}&po=PO-2026-0838`;
const TABLE = 'tbody button[aria-expanded]';
const CARDS = 'article[aria-label="MNP replenishment"]';

function collapseSidebar(doc: Document) {
  doc.querySelector<HTMLElement>('aside button[title="Collapse sidebar"]')?.click();
  const style = doc.createElement('style');
  style.textContent = 'aside button[title="Collapse sidebar"],aside button[title="Expand sidebar"]{display:none!important}';
  doc.head.appendChild(style);
}

const items: ShowcaseItem[] = [
  {
    title: 'Spot what to buy', lead: 'The agent finds it first.', seconds: 14, src: WORKSPACE, ready: CARDS, fresh: true,
    body: 'Supplier cards say when to order and what the goods cover.',
    script: async (h) => {
      h.say('Checked every weekday at 09:00');
      const card = h.find(CARDS);
      await h.zoom(card, 1.5);
      await h.hover(h.find(`${CARDS} span`, 'Order now'));
      await h.wait(900);
      h.say('Why this supplier, in one line');
      await h.click(h.find(`${CARDS} button`, 'Why this supplier?'));
      await h.wait(1600);
      h.say('One action starts a draft');
      await h.zoomOut();
      await h.click(h.find(`${CARDS} button`, 'Create purchase order'));
      await h.wait(4200);
    },
  },
  {
    title: 'Ask for a plan', lead: 'Supplier and coverage, nothing more.', seconds: 16, src: WORKSPACE, ready: CARDS, fresh: true,
    body: 'Progress shows in the panel while the table fills in.',
    script: async (h) => {
      h.say('Or ask in your own words');
      await h.click(h.find('button', 'Ask agent'));
      await h.wait(800);
      await h.click(h.find('button', 'Plan MNP for the next 30 days'));
      await h.wait(1700);
      await h.zoom(h.find('article[aria-label="Purchase plan"]'), 1.4);
      await h.wait(700);
      h.say('Nothing is ordered yet');
      await h.zoomOut();
      await h.click(h.find('button', 'Create purchase plan'));
      await h.wait(1800);
      h.say('Each step shows as it runs');
      await h.wait(2600);
      await h.hover(h.find('article[aria-label="Purchase plan ready"]'));
      await h.wait(1000);
    },
  },
  {
    title: 'Check the reasoning', lead: 'Every line explains itself.', seconds: 17, src: DRAFT, ready: TABLE, fresh: true,
    body: 'Edit in place. Supplier terms keep their own place.',
    script: async (h) => {
      h.say('Ask why, on the line');
      await h.click(h.find(TABLE, 'Reinforced bonder'));
      await h.wait(500);
      const why = h.find('tbody button', 'Why 96');
      await h.zoom(why, 1.8);
      await h.click(why);
      await h.wait(1800);
      await h.zoomOut();
      await h.hover(h.find('article[aria-label="370102 · 14 ml"]'));
      await h.wait(900);
      h.say('Change it like any table');
      const qty = h.all('tbody input')[0];
      await h.click(qty);
      await h.type(qty, '108');
      await h.wait(700);
      h.say('Supplier terms stay apart');
      await h.click(h.find('[role="tab"]', 'Supply rules'));
      await h.wait(1500);
    },
  },
  {
    title: 'Review the confirmation', lead: 'Exceptions first, then a person decides.', seconds: 22, src: DRAFT, ready: TABLE, fresh: true,
    body: 'Approving is not ordering.',
    script: async (h) => {
      h.say('Upload the supplier confirmation');
      await h.click(h.find('button', 'Upload confirmation'));
      await h.wait(700);
      await h.upload(h.find('[role="dialog"] input[type="file"]'), '26VOM002922.pdf');
      await h.wait(5200);
      h.say('Only the differences');
      await h.zoom(h.find('article[aria-label="Confirmation needs review"]'), 1.3);
      await h.wait(1200);
      await h.zoomOut();
      await h.hover(h.find('tbody span', 'Qty 96→90'));
      await h.wait(700);
      h.say('Choose who approves');
      await h.click(h.find('button', 'Approve'));
      await h.wait(800);
      await h.click(h.find('[role="radio"]', 'Push to owner'));
      await h.wait(600);
      await h.click(h.find('[role="dialog"] button', 'Send to owner'));
      await h.wait(900);
      await h.hover(h.find('span', 'Waiting for owner'));
      await h.wait(1000);
    },
  },
  {
    title: 'Receive with the agent', lead: 'DDT, counts and differences.', seconds: 22, src: ORDERED, ready: TABLE, fresh: true,
    body: 'Stock-in uses what the warehouse counted.',
    script: async (h) => {
      h.say('Upload the delivery note');
      await h.click(h.find('button', 'Upload DDT'));
      await h.wait(700);
      await h.upload(h.find('[role="dialog"] input[type="file"]'), 'DDT-MNP-0113.pdf');
      await h.wait(4400);
      await h.zoom(h.find('article[aria-label="Delivery note checked"]'), 1.3);
      await h.wait(1200);
      await h.zoomOut();
      h.say('An extra line: keep it as a gift');
      const gift = h.find('tbody button[aria-pressed]', 'Gift');
      await h.zoom(gift, 1.8);
      await h.click(gift);
      await h.wait(600);
      await h.zoomOut();
      h.say('Confirm what arrived');
      await h.click(h.find('button', 'Confirm receipt'));
      await h.wait(800);
      await h.click(h.find('[role="dialog"] button[role="combobox"]'));
      await h.wait(400);
      await h.pick(h.find('[role="option"]', 'Elena Rossi'));
      await h.click(h.find('[role="dialog"] button', 'Confirm receipt'));
      await h.wait(1600);
    },
  },
  {
    title: 'Learn from the order', lead: 'Reviewed before it becomes memory.', seconds: 14, src: RECEIVED, ready: TABLE, fresh: true,
    body: 'Nothing is saved until the buyer chooses.',
    script: async (h) => {
      h.say('Compare the plan with what happened');
      await h.click(h.find('button', 'Review this order'));
      await h.wait(3200);
      await h.zoom(h.find('article[aria-label="Order review"]'), 1.3);
      await h.wait(1500);
      await h.zoomOut();
      h.say('Keep it as a candidate');
      await h.click(h.find('button', 'Save as candidate'));
      await h.wait(1000);
      await h.click(h.find('[role="tab"]', 'Activity'));
      await h.wait(1500);
    },
  },
];

export default function AgentLiveDemo() {
  return (
    <LiveShowcase
      items={items}
      src={WORKSPACE}
      label="procurement agent"
      title="DEF ERP — Procurement Agent, live demonstration data"
      baseWidth={1440}
      ready={CARDS}
      prepare={collapseSidebar}
    />
  );
}

/* ───────── Iteration 2 · model evaluation (Procurement agent V1) ───────── */
const V1 = '/demos/def-design-system/index.html?view=agent&v=1';
const SCORE_TILE = 'button[title="Why this score"]';

const evaluation: ShowcaseItem[] = [
  {
    title: 'Review before the next plan', lead: 'The agent compares; the buyer explains.', seconds: 38, src: V1, ready: CARDS, fresh: true,
    body: 'Rate three dimensions, then name products in plain words. Skippable, but never counted then.',
    script: async (h) => {
      h.say('Each supplier shows its plan accuracy');
      await h.zoom(h.find(`${CARDS} button`, 'Plan accuracy'), 1.8);
      await h.wait(1200);
      await h.zoomOut();
      h.say('Its last order was never reviewed');
      await h.click(h.find(`${CARDS} button`, 'Create purchase order'));
      await h.wait(900);
      await h.zoom(h.find('[role="dialog"]'), 1.3);
      await h.wait(1400);
      await h.zoomOut();
      await h.click(h.find('[role="dialog"] button', 'Review first'));
      await h.wait(4200);
      h.say('The agent compares plan and sales');
      await h.zoom(h.find('article[aria-label="Order review"]'), 1.3);
      await h.wait(1600);
      await h.zoomOut();
      h.say('The buyer adds what data can’t show');
      await h.click(h.find('button', 'Write review'));
      await h.wait(900);
      h.say('Rate the order overall');
      const mix = h.find('[role="slider"][aria-label="Product mix"]');
      await h.zoom(mix, 1.5);
      await h.click(h.find('button[aria-label="Product mix: Right"]'));
      await h.wait(900);
      await h.zoomOut();
      h.say('Name products in plain words');
      await h.click(h.find('#review-note'));
      await h.type(h.find('#review-note'), 'Black Onyx sells, but salons report chipping. Keep it flat.');
      await h.wait(400);
      await h.zoom(h.find('#review-note'), 1.4);
      await h.wait(1400);
      await h.zoomOut();
      await h.click(h.find('[role="dialog"] button', 'Save review'));
      await h.wait(1200);
      h.say('It shapes the next plan');
      await h.zoom(h.find('article[aria-label="What changes in the next MNP plan"]'), 1.3);
      await h.wait(1800);
    },
  },
  {
    title: 'Score follows the supplier', lead: 'Accuracy and confidence differ.', seconds: 14, src: V1, ready: CARDS, fresh: true,
    body: 'Fewer reviewed orders, wider uncertainty.',
    script: async (h) => {
      h.say('MNP: frequent orders, long history');
      await h.click(h.find(`${CARDS} button`, 'Plan accuracy'));
      await h.wait(1600);
      await h.hover(h.find('[role="dialog"] dl'));
      await h.wait(1200);
      await h.click(h.find('[role="dialog"] button', 'Close'));
      await h.wait(600);
      h.say('Moroccanoil: two reviews, low confidence');
      await h.click(h.find('article[aria-label="Moroccanoil replenishment"] button', 'Plan accuracy'));
      await h.wait(2200);
    },
  },
  {
    title: 'Score the new plan', lead: 'Expected accuracy, with its basis.', seconds: 16, src: `${V1}&po=PO-2026-0843&generate=30`, ready: 'table', fresh: true,
    body: 'Track record, minus what this plan’s data lacks.',
    script: async (h) => {
      h.say('The plan is drafted, then scored');
      await h.wait(4600);
      const tile = h.find(SCORE_TILE);
      await h.zoom(tile, 1.8);
      await h.wait(1600);
      await h.zoomOut();
      h.say('Every point is explained');
      await h.click(tile);
      await h.wait(2600);
    },
  },
];

export function AgentEvaluationLiveDemo() {
  return (
    <LiveShowcase
      items={evaluation}
      src={V1}
      label="plan accuracy"
      title="DEF ERP — Procurement Agent plan accuracy, demonstration data"
      baseWidth={1440}
      ready={CARDS}
      prepare={collapseSidebar}
    />
  );
}
