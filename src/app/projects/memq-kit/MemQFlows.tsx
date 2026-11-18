'use client';

/*
 * Small animated flows for decisions that have no screen of their own. Each fits the
 * narrow column beside a decision, plays while in view and holds its last frame with
 * reduced motion.
 */

import { useEffect, useRef, useState } from 'react';
import f from './MemQFlows.module.css';

/** Steps 0..n-1 on a fixed beat while the figure is in view; the last step with reduced motion. */
function useBeat(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.3 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(() => setAt(steps - 1), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setInterval(() => setAt((a) => (a + 1) % steps), ms);
    return () => window.clearInterval(t);
  }, [on, steps, ms]);
  return { ref, at };
}

/* ───────────────────────── MCP: the chat writes, MemQ checks and saves ───────────────────────── */

const WRITER = [
  { who: 'You, in Claude or ChatGPT', what: '“Make cards from what we just went through”' },
  { who: 'MemQ skill', what: 'Finds a lesson they belong in' },
  { who: 'The chat’s model', what: 'Writes cards and their questions' },
  { who: 'MemQ tools', what: 'Check every card against the rules' },
  { who: 'MemQ', what: 'Saves the kept ones in one step' },
];
const RULES = ['5–6 options', 'exactly one right', 'a recall question', 'all or none'];

export function WriterFlow() {
  const { ref, at } = useBeat(WRITER.length + 1, 1300);
  return (
    <div ref={ref} className={f.flow} role="img" aria-label="In an AI chat, you ask for cards; MemQ's skill finds a lesson, the chat's model writes the cards, MemQ's tools check them and save them.">
      <ol className={f.chain}>
        {WRITER.map((w, i) => (
          <li key={w.who} className={`${f.link} ${i <= at ? f.linkOn : ''} ${i === at ? f.linkNow : ''}`}>
            <span className={f.linkWho}>{w.who}</span>
            <span className={f.linkWhat}>{w.what}</span>
            {i === 3 && (
              <span className={f.rules}>
                {RULES.map((r, k) => <em key={r} className={i <= at ? f.ruleOn : ''} style={{ transitionDelay: `${k * 120}ms` }}>{r}</em>)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
