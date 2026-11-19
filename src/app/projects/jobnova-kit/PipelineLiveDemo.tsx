'use client';

// The JobNova application pipeline, live in the case: five short tours a scripted cursor plays
// in turn. Moving the pointer into the frame stops the script and hands the page to the visitor.

import LiveShowcase, { type ShowcaseItem } from '../def-erp-kit/LiveShowcase';
import type { Helpers } from '../def-erp-kit/LiveDemo';
import styles from './ResumeLiveDemo.module.css';

const SRC = '/demos/jobnova-pipeline';

/** Steps after the first may start from the calendar or with a drawer open; bring the page back to the board */
async function toBoard(h: Helpers) {
  for (const x of h.all('.rv-root.is-open .rv-close')) await h.tap(x);
  const pipeline = h.all('.ap2-view button').find(b => b.textContent?.includes('Pipeline'));
  if (pipeline && !pipeline.classList.contains('is-on')) { await h.tap(pipeline); await h.wait(500); }
}

const items: ShowcaseItem[] = [
  {
    title: 'Where everything stands',
    lead: 'The overview answers “how is it going” before the list starts.',
    body: 'Numbers ease into place, the funnel follows the range you pick, and the Auto Apply card shows its rules rather than controls.',
    seconds: 14, fresh: true,
    script: async (h) => {
      h.say('Overview');
      await h.wait(1600);
      await h.click(h.find('.ap-funnel .ap-range button', '3d'));
      await h.wait(1300);
      await h.click(h.find('.ap-funnel .ap-range button', '90d'));
      await h.wait(1300);
      await h.click(h.find('.ap-stat .ap-range button', '90d'));
      await h.wait(900);
      await h.hover(h.find('.ap2-spark'));
      await h.wait(900);
      await h.hover(h.find('.ap2-rules'));
      await h.wait(1200);
    },
  },
  {
    title: 'Follow the pipeline',
    lead: 'From queue to offer, left to right.',
    body: 'Auto Apply’s part first, then the employer’s. The stage tabs jump to any column.',
    seconds: 11,
    script: async (h) => {
      h.say('Pipeline');
      await toBoard(h);
      await h.click(h.find('.ap2-pill--offer'));
      await h.wait(1300);
      await h.hover(h.find('.ap2-col--offer .ap2-card'));
      await h.wait(1000);
      await h.click(h.find('.ap2-pill--queued'));
      await h.wait(1300);
      await h.hover(h.find('.ap2-col--process .ap2-proc'));
      await h.wait(1200);
    },
  },
  {
    title: 'What “In process” means',
    lead: 'The step it is on, and what is ready.',
    body: 'Done steps, the current one, what comes next, and every answer prepared with its source.',
    seconds: 11,
    script: async (h) => {
      h.say('In process');
      await toBoard(h);
      await h.click(h.find('.ap2-col--process .ap2-card h3'));
      await h.wait(1200);
      await h.hover(h.find('.pd-now'));
      await h.wait(1000);
      await h.hover(h.find('.pd-qa'));
      await h.wait(1200);
      await h.click(h.find('.rv-root.is-open .rv-close'));
      await h.wait(700);
    },
  },
  {
    title: 'Fix a failed application',
    lead: 'Where it stopped, why, and the fix.',
    body: 'Answer the one missing question and Auto Apply carries on from that step. Everything prepared is kept.',
    seconds: 13,
    script: async (h) => {
      h.say('Failed');
      await toBoard(h);
      const cards = h.all('.ap2-col--failed .ap2-card');
      const card = cards.find(c => c.textContent?.includes('Desired salary')) ?? cards[0];
      await h.click(card.querySelector<HTMLElement>('.ap2-btn')!);
      await h.wait(1200);
      await h.hover(h.find('.pd-why'));
      await h.wait(800);
      const field = h.all('.pd-field input')[0];
      if (field) { await h.type(field, '140,000'); await h.wait(500); }
      await h.click(h.find('.pd-fix .pd-btn'));
      await h.wait(1400);
      await h.hover(h.find('.pd-now'));
      await h.wait(1000);
      await h.click(h.find('.rv-root.is-open .rv-close'));
      await h.wait(700);
    },
  },
  {
    title: 'See it by date',
    lead: 'Interviews and deadlines, and how each day went.',
    body: 'Past days are shaded by how many applications went out; click one for what it led to.',
    seconds: 12,
    script: async (h) => {
      h.say('Calendar');
      for (const x of h.all('.rv-root.is-open .rv-close')) await h.tap(x);
      await h.click(h.find('.ap2-view button', 'Calendar'));
      await h.wait(1200);
      await h.hover(h.find('.cal-ev--interview'));
      await h.wait(800);
      const day = h.all('.cal-month[data-month="2025-11"] .cal-day').find(d => d.querySelector('.cal-num')?.textContent === '14');
      if (day) { await h.click(day); await h.wait(1300); }
      await h.hover(h.find('.dd-win'));
      await h.wait(1300);
      await h.click(h.find('.rv-root.is-open .rv-close'));
      await h.wait(600);
    },
  },
];

export default function PipelineLiveDemo() {
  return (
    <div className={styles.jn}>
      <LiveShowcase
        items={items}
        src={SRC}
        label="applications"
        title="JobNova — Auto Apply pipeline, prototype with demonstration data"
        baseWidth={1440}
        ready=".ap2-board"
        storage={{ 'jn-sidebar-collapsed': '1' }}
      />
    </div>
  );
}
