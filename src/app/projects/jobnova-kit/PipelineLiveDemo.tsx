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
    title: "See how your search is going",
    body: "Get **the big picture first**. Choose a time range and check the rules Auto Apply follows for you.",
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
    title: "Track every application",
    body: "Follow each job **from queue to offer**, and jump to any stage with one tab.",
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
    title: "Know what happens next",
    body: "Open an application to see **what’s done, what’s next, and every answer prepared for you**.",
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
    title: "Get unstuck in one answer",
    body: "See where it stopped and why. **Answer the missing question and it carries on**, with your progress kept.",
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
    title: "Stay ready for interviews",
    body: "**Open any day** to see your interviews and applications, and look back at how each one went.",
    seconds: 14,
    script: async (h) => {
      h.say('Calendar');
      for (const x of h.all('.rv-root.is-open .rv-close')) await h.tap(x);
      await h.click(h.find('.ap2-view button', 'Calendar'));
      await h.wait(1200);
      await h.hover(h.find('.cal-ev--interview:not(.is-done)'));
      await h.wait(800);
      // A past day with two interviews: what happened, then what went out
      const day = h.all('.cal-month[data-month="2025-11"] .cal-day').find(d => d.querySelector('.cal-num')?.textContent === '20');
      if (day) { await h.click(day.querySelector('.cal-num') ?? day); await h.wait(1300); }
      await h.hover(h.find('.dd-ev-out'));
      await h.wait(1300);
      await h.click(h.find('.dd-tabs button', 'Sent'));
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
