'use client';

import { type Helpers } from './LiveDemo';
import LiveShowcase, { type ShowcaseItem } from './LiveShowcase';

/** The role dashboards from the design-system build, one role per step (the role comes from the URL). */
const page = (role: string) => `/demos/def-design-system/index.html?view=shell&role=${role}`;

/** Elements inside the card with this title. */
const inCard = (h: Helpers, title: string, selector: string) => {
  const card = h.find('[data-slot="card-title"]', title).closest('[data-slot="card"]');
  return card ? [...card.querySelectorAll<HTMLElement>(selector)] : [];
};
const card = (h: Helpers, title: string) => h.find('[data-slot="card-title"]', title).closest<HTMLElement>('[data-slot="card"]')!;
const hoverAll = async (h: Helpers, els: HTMLElement[], limit = 3) => {
  for (const el of els.slice(0, limit)) await h.hover(el);
};

const items: ShowcaseItem[] = [
  {
    title: 'Admin', lead: 'The whole business on one page.', seconds: 20, src: page('admin'), fresh: true,
    body: 'Net sales by period, and what is waiting on each team.',
    script: async (h) => {
      h.say('Pick the period');
      await h.click(h.find('[role="tab"]', '7 days'));
      await h.wait(1000);
      await h.click(h.find('[role="tab"]', '90 days'));
      await h.wait(1000);
      h.say('Hover for exact values');
      const chart = card(h, 'Net sales').querySelector<HTMLElement>('.recharts-wrapper');
      if (chart) { await h.zoom(chart, 1.3); await h.hover(chart); await h.wait(1200); }
      await h.zoomOut();
      h.say('Waiting on each team');
      await hoverAll(h, inCard(h, 'Across teams', 'button'), 4);
      await h.click(h.find('[role="tab"]', '30 days'));
      await h.wait(600);
    },
  },
  {
    title: 'Sales', lead: 'Am I on target, and who owes me?', seconds: 18, src: page('sales'), fresh: true,
    body: 'A forecast against the monthly target, then the payments to chase.',
    script: async (h) => {
      h.say('On track for November?');
      const target = card(h, 'November target');
      await h.zoom(target, 1.25);
      const chart = target.querySelector<HTMLElement>('[role="img"]');
      if (chart) { await h.hover(chart); await h.wait(1200); }
      await h.zoomOut();
      h.say('Chase overdue payments');
      const remind = inCard(h, 'To collect', 'button').filter((b) => b.textContent?.trim() === 'Remind');
      for (const b of remind.slice(0, 2)) { await h.click(b); await h.wait(500); }
      h.say('Who has gone quiet');
      await hoverAll(h, inCard(h, 'Follow up', 'button'), 3);
    },
  },
  {
    title: 'Warehouse', lead: 'Today’s physical work, in order.', seconds: 22, src: page('warehouse'), fresh: true,
    body: 'Rush items for the store, then pick, pack and hand over.',
    script: async (h) => {
      h.say('Rush items for the store');
      const cards = inCard(h, 'Rush to store', 'div[role="checkbox"]');
      for (const c of cards.slice(0, 2)) { await h.click(c); await h.wait(300); }
      await h.click(h.find('button', 'Done'));
      await h.wait(800);
      h.say('Pick & pack board');
      await h.click(h.find('[role="tab"]', 'Pick & pack'));
      await h.wait(900);
      await h.click(h.find('[aria-label="Select SO-0842"]'));
      await h.wait(400);
      h.say('Packed moves on by itself');
      await h.click(h.find('button', 'Mark 1 packed'));
      await h.wait(1400);
      h.say('Confirm what arrived');
      await h.click(h.find('button', 'Confirm'));
      await h.wait(800);
    },
  },
  {
    title: 'Finance', lead: 'Approve, invoice, chase.', seconds: 20, src: page('finance'), fresh: true,
    body: 'Batch approvals and invoices, cash by period.',
    script: async (h) => {
      h.say('Approve payments in a batch');
      const pays = inCard(h, 'Payment approvals', 'div[role="checkbox"]');
      for (const p of pays.slice(0, 3)) { await h.click(p); await h.wait(250); }
      await h.click(h.find('button', 'Approve 3'));
      await h.wait(900);
      h.say('Cash in, by period');
      await h.click(h.find('[role="tab"]', '90 days'));
      await h.wait(1200);
      h.say('Issue invoices');
      const inv = inCard(h, 'Invoices to issue', 'div[role="checkbox"]');
      for (const i of inv.slice(0, 2)) { await h.click(i); await h.wait(250); }
      const issue = h.all('button').find((b) => b.textContent?.trim().startsWith('Issue 2'));
      if (issue) await h.click(issue);
      await h.wait(900);
    },
  },
];

export default function DashboardLiveDemo() {
  return (
    <LiveShowcase
      items={items}
      src={page('admin')}
      label="dashboards"
      title="DEF ERP — role dashboards, demonstration data"
      baseWidth={1440}
      ready="aside nav"
    />
  );
}
