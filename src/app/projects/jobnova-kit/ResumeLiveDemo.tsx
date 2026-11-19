'use client';

// The JobNova resume co-editor, live in the case: four short tours a scripted cursor plays in
// turn. Moving the pointer into the frame stops the script and hands the page to the visitor.
// Runs the DEF case's showcase runner, dressed in JobNova's lime.

import LiveShowcase, { type ShowcaseItem } from '../def-erp-kit/LiveShowcase';
import type { Helpers } from '../def-erp-kit/LiveDemo';
import styles from './ResumeLiveDemo.module.css';

const SRC = '/demos/jobnova-resume';

/** Wait until Nova has finished the rewrite (each step may be the first one played) */
async function ready(h: Helpers) {
  for (let i = 0; i < 40; i++) {
    if (h.all('.cv.is-done').length && h.all('.cv-change').length >= 3) return;
    await h.wait(250);
  }
}

/** Select part of a resume line, as a person dragging across it would */
function selectIn(el: HTMLElement, chars: number) {
  const doc = el.ownerDocument;
  const walker = doc.createTreeWalker(el, 4 /* NodeFilter.SHOW_TEXT */);
  const texts: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) texts.push(n as Text);
  const range = doc.createRange();
  range.setStart(texts[0], 0);
  let left = chars;
  for (const t of texts) {
    if (left <= t.length) { range.setEnd(t, left); break; }
    left -= t.length;
    range.setEnd(t, t.length);
  }
  const sel = doc.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

/** Type at the end of a resume line, one character at a time. The text goes in directly and the
 *  editor hears the same input event as real typing; no caret moves, so the host page never scrolls. */
async function typeAtEnd(h: Helpers, el: HTMLElement, text: string) {
  const doc = el.ownerDocument;
  const host = el.closest<HTMLElement>('[contenteditable="true"]');
  const node = doc.createTextNode('');
  el.appendChild(node);
  for (const ch of text) {
    node.data += ch;
    host?.dispatchEvent(new (doc.defaultView as Window & typeof globalThis).InputEvent('input', { bubbles: true, inputType: 'insertText', data: ch }));
    await h.wait(70);
  }
}

const items: ShowcaseItem[] = [
  {
    title: 'Nova rewrites in place',
    lead: 'The resume is rewritten where it will be read.',
    body: 'Lines change one by one; the score climbs only when Nova has finished, then the changes are named.',
    seconds: 16, fresh: true,
    script: async (h) => {
      h.say('Generation');
      await ready(h);
      await h.wait(400);
      await h.hover(h.find('.cv-ringbox'));
      await h.wait(700);
      await h.hover(h.find('.cv-score-copy .cv-from'));
      await h.wait(600);
      await h.hover(h.find('.cv-score-copy .cv-to'));
      await h.wait(700);
      await h.click(h.find('.cv-change-head', '3'));
      await h.wait(1600);
    },
  },
  {
    title: 'Fix one line with Nova',
    lead: 'Select the words, then ask.',
    body: 'Only the selected words change. Nova leaves a slot for a result it cannot know, and every change can be undone.',
    seconds: 12,
    script: async (h) => {
      h.say('Select and ask');
      await ready(h);
      const line = h.find('[data-block="e1b4"]');
      await h.hover(line);
      selectIn(line, 40);
      await h.wait(800);
      await h.hover(h.find('.cv-ask-field'));
      await h.wait(700);
      await h.click(h.find('.cv-chips-row button', 'Add result'));
      await h.wait(1100);
      await h.hover(h.find('[data-block="e1b4"] .cv-slot'));
      await h.wait(800);
      await h.hover(h.find('.cv-toast'));
      await h.wait(1500);
    },
  },
  {
    title: 'Check the job’s keywords',
    lead: 'See what an applicant tracking system looks for.',
    body: 'Missing terms can be added to the skills line in one click, only if they are true.',
    seconds: 10,
    script: async (h) => {
      h.say('Keywords');
      await ready(h);
      await h.hover(h.find('.cv-ats'));
      await h.wait(600);
      const add = h.all('.cv-chips li button')[0];
      if (add) { await h.click(add); await h.wait(1200); }
      await h.hover(h.find('[data-block="skills"]'));
      await h.wait(1600);
    },
  },
  {
    title: 'Edit it like a document',
    lead: 'Type anywhere on the page.',
    body: 'Nova’s marks step aside while you write; the switch brings them back, for Nova’s words only.',
    seconds: 12,
    script: async (h) => {
      h.say('Edit in place');
      await ready(h);
      const line = h.find('[data-block="e2b4"]');
      await h.hover(line);
      await h.wait(300);
      await typeAtEnd(h, line, ' Every Monday.');
      await h.wait(900);
      await h.click(h.find('.cv-switch'));
      await h.wait(1800);
    },
  },
];

export default function ResumeLiveDemo() {
  return (
    <div className={styles.jn}>
      <LiveShowcase
        items={items}
        src={SRC}
        label="tailored resume"
        title="JobNova — tailored resume, co-editing prototype with sample content"
        baseWidth={1440}
        ready=".cv"
      />
    </div>
  );
}
