'use client';

/**
 * How "Use your own AI" works, as the journey the learner takes: MemQ's page, the
 * copied prompt, their own AI (and what the prompt makes it do), the format it
 * hands back, the paste, the cards. From buildPrompt and parseImport in
 * lib/cardImport.ts and app/import-cards.tsx. "Tested" marks rules settled by the
 * import harness on a real model (AI chat spec §40.2, §40.5).
 */
import { useEffect, useRef, useState } from 'react';
import p from './PromptFlow.module.css';

type Where = 'memq' | 'ai' | 'out';
type Stop = { where: Where; title: string; sub: string; place: string };

const JOURNEY: Stop[] = [
  { where: 'memq', place: 'MemQ', title: 'Use your own AI', sub: 'The page, from New Cards' },
  { where: 'memq', place: 'MemQ', title: 'Copy prompt', sub: 'Carries the lesson, the topic and the card rules' },
  { where: 'ai', place: 'Their AI', title: 'ChatGPT · Claude · Gemini', sub: 'Any AI they already use' },
  { where: 'ai', place: 'Their AI', title: 'Replies in MemQ’s format', sub: 'One JSON block, exact shape' },
  { where: 'memq', place: 'MemQ', title: 'Paste', sub: 'Back on the same page' },
  { where: 'out', place: 'MemQ', title: 'Cards created', sub: 'Checked, ticked, saved to a lesson' },
];

const WORKS: { n: number; title: string; lines: { text: string; tested?: boolean }[] }[] = [
  { n: 1, title: 'Find out what to learn', lines: [
    { text: 'A chat already going → cards from it' },
    { text: 'Notes or a file → only that' },
    { text: 'Otherwise → up to 3 short questions' },
  ] },
  { n: 2, title: 'Make the cards', lines: [
    { text: 'About 12, only what is true' },
    { text: 'Each with a multiple-choice and a recall question' },
    { text: 'Options ≤ 50 characters, recall ≤ 40', tested: true },
  ] },
  { n: 3, title: 'Hand them back', lines: [
    { text: 'In the learner’s language', tested: true },
    { text: 'With a lesson name and one line' },
    { text: 'Changes? The whole JSON again' },
  ] },
];

/* The order things light up in: the six stops, with the AI's three steps after its stop. */
const SEQ = ['s0', 's1', 's2', 'w1', 'w2', 'w3', 's3', 's4', 's5'] as const;
const STEP_MS = 1100;
const HOLD_MS = 2200;

/** Plays the journey while it is on screen; holds the whole picture with reduced motion. */
function usePlay(length: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(length - 1);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!inView || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => setAt((a) => (a >= length - 1 ? 0 : a + 1)), at >= length - 1 ? HOLD_MS : STEP_MS);
    return () => window.clearTimeout(t);
  }, [inView, paused, at, length]);
  return { ref, at, pause: () => setPaused(true), resume: () => setPaused(false) };
}

export function PromptFlow() {
  const { ref, at, pause, resume } = usePlay(SEQ.length);
  const state = (key: (typeof SEQ)[number]) => {
    const i = SEQ.indexOf(key);
    return i === at ? p.on : i > at ? p.ahead : '';
  };
  const worksOn = at >= SEQ.indexOf('w1') && at <= SEQ.indexOf('w3');
  return (
    <div ref={ref} className={p.flow} onMouseEnter={pause} onMouseLeave={resume}>
      <ol className={p.journey} aria-label="The journey, from MemQ to their AI and back">
        {JOURNEY.map((s, i) => [
          <li key={s.title} className={`${p.stop} ${p[s.where]} ${i === 2 ? p.hub : ''} ${state(`s${i}` as (typeof SEQ)[number])} ${i === 2 && worksOn ? p.feeding : ''}`}>
            <span className={p.place}>{s.place}</span>
            <b>{s.title}</b>
            <span className={p.sub}>{s.sub}</span>
          </li>,
          /* What the prompt makes their AI do, hung under the AI's stop: right after it
             on a phone, on its own row under the journey on a wide screen. */
          i === 2 && (
            <li key="works" className={`${p.works} ${at < SEQ.indexOf('w1') ? p.ahead : ''} ${worksOn ? p.worksOn : ''}`} aria-label="How their AI works with the prompt">
              <span className={p.worksHead}>How their AI works with the prompt</span>
              <ol className={p.worksSteps}>
                {WORKS.map((w) => (
                  <li key={w.n} className={`${p.work} ${state(`w${w.n}` as (typeof SEQ)[number])}`}>
                    <span className={p.workHead}><span className={p.workNum}>{w.n}</span>{w.title}</span>
                    <ul>
                      {w.lines.map((l) => <li key={l.text}>{l.text}{l.tested && <em className={p.tested}>tested</em>}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            </li>
          ),
        ])}
      </ol>

      <p className={p.read}>On paste, MemQ <b>reads wide</b> (JSON, then tables, then lines) <em className={p.tested}>tested</em> and <b>saves strict</b>: every card checked before the learner ticks what to keep.</p>
    </div>
  );
}
