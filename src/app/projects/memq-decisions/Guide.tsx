'use client';

/**
 * Inkling, alive on MemQ's own spring rig (public/demos/memq-mascot/mascot-rig.js,
 * the same one the MemQ cover drives), as the guide to this case study.
 *
 * On arrival it comes up from the corner and asks to show the reader around.
 * - Yes: it tours by itself. The page scrolls to each stop, Inkling turns to look
 *   at it, takes the mood that fits, and says it in a bubble, typed out. Pause,
 *   skip or stop at any time; scrolling yourself pauses it too.
 * - No: it ducks to the edge of the screen, half showing. Tap it to carry on.
 * Reduced motion: no scrolling animation, no typing, a still Inkling.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal, preload } from 'react-dom';
import { RIG_SVG } from '../../components/memq-cover/rigSvg';
import g from './Guide.module.css';

type Mood = 'idle' | 'happy' | 'excited' | 'thinking' | 'focused' | 'surprised' | 'sleepy' | 'todayIdle'
  | 'onboarding' | 'learningComplete' | 'working' | 'wondering' | 'oops';
/** `solution`: a design is being shown; it stays up longer than the rest. */
type Stop = { target: string; mood: Mood; text: string; solution?: boolean };

// Told from the designer's side, in the designer's words.
// Each design: what it does for the learner, then what it still left them with,
// both over the design's own screens (the tiles below say the same).
const STOPS: Stop[] = [
  { target: 'problem', mood: 'thinking', text: 'I kept asking AI the same word. And kept forgetting it.' },
  { target: 'stages', mood: 'focused', text: 'Quiz apps already nail remembering. The hard part? Making the cards.' },
  { target: 'addterms', mood: 'excited', solution: true, text: 'First try: AI makes the cards. Paste text, type a topic, or drop in a PDF. No more typing every card, and you check the list before anything saves.' },
  { target: 'addterms', mood: 'surprised', text: 'But you still had to dig up the material and bring it here. And my AI could bend what it meant.' },
  { target: 'aiv1', mood: 'happy', solution: true, text: 'AI v1: just ask. The answer becomes a card in one tap, right where you learned it.' },
  { target: 'aiv1', mood: 'oops', text: 'But you had to pick a mode before you could even ask. One answer, one card. And a wrong answer got saved, unchecked.' },
  { target: 'aiv2', mood: 'excited', solution: true, text: 'AI v2: it explains first, so you actually get it. Cards only when you ask, as drafts you tick. No junk sneaks into your deck.' },
  { target: 'aiv2', mood: 'wondering', text: 'But you already learn in other AI apps, and this chat knows none of that. Plus every message eats your credits.' },
  { target: 'ownai', mood: 'happy', solution: true, text: 'So: use your own AI. It already knows what you talked about, writes cards in MemQ’s format, and it’s free, no limit.' },
  { target: 'ownai', mood: 'thinking', text: 'But you still copy a prompt over, then paste the reply back. Two hops, every time.' },
  { target: 'mcp', mood: 'excited', solution: true, text: 'MCP: ask in your own AI, and the cards land in MemQ. No switching apps, and you still tick what’s saved.' },
  { target: 'reflection', mood: 'learningComplete', solution: true, text: 'Looking back, every version got closer to where people already learn.\n\nThe iOS app is live! Try it with the button below. Tap me to go again.' },
];

type Phase = 'away' | 'greet' | 'tour' | 'paused' | 'hidden';
const SEEN_KEY = 'memq-case-guide';
const RIG_SRC = '/demos/memq-mascot/mascot-rig.js';
/** Set once a tour has been started this visit, so a tap later goes straight back in. */
const TOURED_KEY = 'memq-case-guide-toured';
const TYPE_MS = 22;
const READ_MS = (text: string) => 1600 + text.length * 38;

/** Marks a part of the page as a stop on the tour. */
export function TourMark({ id, children }: { id: string; children: ReactNode }) {
  return <div data-tour={id}>{children}</div>;
}

/* ───────────────────────── The rig ───────────────────────── */

type Frame = Record<string, number[] | number | string>;
type Rig = { CHANNEL_COUNT: number; createRigState: (mood: string) => unknown; solveRig: (state: unknown, input: unknown, dt: number) => Frame };

function LiveInkling({ mood, look, poke, still }: { mood: Mood; look: [number, number]; poke: number; still: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const input = useRef({ mood, look, poke });
  useEffect(() => { input.current = { mood, look, poke }; }, [mood, look, poke]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let frame = 0;
    let stopped = false;
    const start = (rig: Rig) => {
      const svg = el.querySelector('svg');
      if (!svg || stopped) return;
      const pick = (attr: string) => Array.from(svg.querySelectorAll<SVGElement>(`[data-${attr}]`), (n) => [n, n.dataset[attr]!] as const);
      const placed = pick('m'), faded = pick('o'), drawn = pick('d'), wide = pick('rx'), tall = pick('ry');
      const r = (n: number) => Math.round(n * 1000) / 1000;
      const paint = (f: Frame) => {
        for (const [n, k] of placed) n.setAttribute('transform', `matrix(${(f[k] as number[]).map(r).join(' ')})`);
        for (const [n, k] of faded) n.setAttribute('opacity', String(r(f[k] as number)));
        for (const [n, k] of drawn) n.setAttribute('d', f[k] as string);
        for (const [n, k] of wide) n.setAttribute('rx', String(r(f[k] as number)));
        for (const [n, k] of tall) n.setAttribute('ry', String(r(f[k] as number)));
      };
      const tweak = new Array(rig.CHANNEL_COUNT).fill(0);
      const state = rig.createRigState(input.current.mood);
      // Standing as on the website hero: hands out on the ledge it peeks over.
      const pose = { level: true, hands: 1, handOutL: -6, handTurnL: 25, handTurnR: 6, tailX: 6, tailY: -26 };
      const solve = (dt: number, isStill: boolean) => {
        const i = input.current;
        return rig.solveRig(state, {
          mood: i.mood, still: isStill, linked: true, drift: true, tweak, dragX: 0, dragY: 0,
          lookX: i.look[0], lookY: i.look[1], wander: 0.35, blink: 0, wink: 0, beat: 0,
          poke: i.poke, pokePart: 0, debug: false, ...pose,
        }, dt);
      };
      if (still) { paint(solve(0, true)); return; }
      let last = 0;
      const tick = (t: number) => {
        if (stopped) return;
        const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
        last = t;
        paint(solve(dt, false));
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const w = window as unknown as { MemQMascot?: Rig };
    if (w.MemQMascot) start(w.MemQMascot);
    else {
      let tag = document.querySelector<HTMLScriptElement>('script[data-memq-rig]');
      if (!tag) {
        tag = document.createElement('script');
        tag.src = RIG_SRC;
        tag.async = true;
        tag.dataset.memqRig = '';
        document.head.appendChild(tag);
      }
      tag.addEventListener('load', () => { if (w.MemQMascot) start(w.MemQMascot); }, { once: true });
    }
    return () => { stopped = true; cancelAnimationFrame(frame); };
  }, [still]);

  return <div ref={host} className={g.rig} dangerouslySetInnerHTML={{ __html: RIG_SVG }} />;
}

/* ───────────────────────── Scrolling ───────────────────────── */

/** Scrolls so `el` sits in the upper middle of the screen; returns a cancel. */
/** The site scrolls smoothly by default; each frame here has to land exactly. */
const jump = (y: number) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });

function glideTo(el: HTMLElement, still: boolean, done: () => void) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const goal = window.scrollY + r.top - (r.height < vh * 0.6 ? (vh - r.height) / 2.6 : vh * 0.12);
  const from = window.scrollY;
  const to = Math.max(0, Math.min(goal, document.documentElement.scrollHeight - vh));
  // In a background tab animation frames stop; jump instead of waiting on them.
  if (still || document.hidden || Math.abs(to - from) < 4) { jump(to); done(); return () => {}; }
  const ms = Math.min(1400, 500 + Math.abs(to - from) * 0.35);
  const t0 = performance.now();
  let frame = 0;
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / ms);
    jump(from + (to - from) * ease(k));
    if (k < 1) frame = requestAnimationFrame(step);
    else done();
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

/** The stop the reader is looking at: the one crossing a line a third of the way
 *  down the screen, or, between stops, the one nearest to that line. */
function stopHere(): number {
  const line = window.innerHeight * 0.35;
  let best = 0, bestGap = Infinity;
  STOPS.forEach((stop, i) => {
    const el = document.querySelector<HTMLElement>(`[data-tour="${stop.target}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
    if (gap < bestGap) { bestGap = gap; best = i; }
  });
  return best;
}

/* ───────────────────────── The guide ───────────────────────── */

export function InklingGuide() {
  // Fetch the rig with the page, not after it hydrates, so Inkling moves as soon as it shows.
  preload(RIG_SRC, { as: 'script' });
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('away');
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState(0);
  const [mood, setMood] = useState<Mood>('happy');
  const [look, setLook] = useState<[number, number]>([-0.5, -0.2]);
  const [poke, setPoke] = useState(0);
  const [still, setStill] = useState(false);
  const me = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const cancelGlide = useRef<() => void>(() => {});
  const gliding = useRef(false);
  const playNext = useRef<(i: number) => void>(() => {});
  const atRef = useRef(0);

  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; cancelGlide.current(); gliding.current = false; };
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const nudge = () => setPoke((p) => p + 1);

  // Arrive: greet, unless they said not now earlier in this visit.
  useEffect(() => {
    let seen: string | null = null;
    try { seen = sessionStorage.getItem(SEEN_KEY); } catch { /* private window: greet anyway */ }
    // Told "not now" already: be at the edge from the first frame, no slide in.
    const ready = window.setTimeout(() => {
      setMounted(true);
      setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (seen === 'hidden') { setMood('todayIdle'); setPhase('hidden'); }
    }, 0);
    const arrive = window.setTimeout(() => {
      if (seen === 'hidden') return;
      setMood('happy'); setPhase('greet'); setPoke((p) => p + 1);
    }, 350);
    const pending = timers.current;
    return () => { window.clearTimeout(ready); window.clearTimeout(arrive); pending.forEach((t) => window.clearTimeout(t)); cancelGlide.current(); };
  }, []);

  const remember = (v: string) => { try { sessionStorage.setItem(SEEN_KEY, v); if (v === 'touring') sessionStorage.setItem(TOURED_KEY, '1'); } catch { /* fine */ } };

  // Look at the stop: where it is on screen, from where Inkling stands.
  const lookAt = useCallback((el: HTMLElement) => {
    const me0 = me.current?.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (!me0) return;
    const dx = (r.left + r.width / 2) - (me0.left + me0.width / 2);
    const dy = (r.top + Math.min(r.height, 300) / 2) - (me0.top + me0.height / 2);
    setLook([Math.max(-1, Math.min(1, dx / 500)), Math.max(-1, Math.min(1, dy / 400))]);
  }, []);

  /** Plays stop `i`: glide there, look, type the line, wait, go on. */
  const play = useCallback((i: number) => {
    clear();
    const stop = STOPS[i];
    const el = document.querySelector<HTMLElement>(`[data-tour="${stop.target}"]`);
    setAt(i); setTyped(0); setPhase('tour'); setMood('focused');
    document.querySelectorAll('[data-tour-on]').forEach((n) => n.removeAttribute('data-tour-on'));
    const speak = () => {
      gliding.current = false;
      if (el) { el.setAttribute('data-tour-on', ''); lookAt(el); }
      setMood(stop.mood); setPoke((p) => p + 1);
      if (still) setTyped(stop.text.length);
      else for (let c = 1; c <= stop.text.length; c++) later(() => setTyped(c), c * TYPE_MS);
      const read = (still ? 0 : stop.text.length * TYPE_MS) + READ_MS(stop.text) * (stop.solution ? 1.4 : 1) + (stop.solution ? 1500 : 0);
      if (i < STOPS.length - 1) later(() => playNext.current(i + 1), read);
      else later(() => { setPhase('hidden'); setMood('todayIdle'); setLook([-0.6, 0]); document.querySelectorAll('[data-tour-on]').forEach((n) => n.removeAttribute('data-tour-on')); setAt(0); }, read + 2500);
    };
    if (!el) { speak(); return; }
    gliding.current = true;
    setLook([-0.4, el.getBoundingClientRect().top > window.innerHeight / 2 ? 0.7 : -0.7]);
    cancelGlide.current = glideTo(el, still, speak);
  }, [still, lookAt]);
  useEffect(() => { playNext.current = play; }, [play]);
  useEffect(() => { atRef.current = at; }, [at]);

  const pause = useCallback(() => {
    clear();
    setTyped(STOPS[at].text.length);
    setPhase('paused'); setMood('idle');
  }, [at]);
  const resume = () => { remember('touring'); play(stopHere()); };
  const hide = () => { clear(); remember('hidden'); setPhase('hidden'); setMood('todayIdle'); setLook([-0.6, 0]); document.querySelectorAll('[data-tour-on]').forEach((n) => n.removeAttribute('data-tour-on')); };

  // Scrolling yourself mid-tour pauses it, so the page is never fought over.
  useEffect(() => {
    if (phase !== 'tour') return;
    const mine = () => pause();
    const keys = (e: KeyboardEvent) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key) && !(e.target as HTMLElement).closest?.('button')) pause(); };
    window.addEventListener('wheel', mine, { passive: true });
    window.addEventListener('touchmove', mine, { passive: true });
    window.addEventListener('keydown', keys);
    return () => { window.removeEventListener('wheel', mine); window.removeEventListener('touchmove', mine); window.removeEventListener('keydown', keys); };
  }, [phase, pause]);

  useEffect(() => {
    if (phase !== 'paused') return;
    let frame = 0;
    const follow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = stopHere();
        if (atRef.current === i) return;
        atRef.current = i;
        setAt(i);
        setTyped(STOPS[i].text.length);
        document.querySelectorAll('[data-tour-on]').forEach((n) => n.removeAttribute('data-tour-on'));
      });
    };
    window.addEventListener('scroll', follow, { passive: true });
    return () => { window.removeEventListener('scroll', follow); cancelAnimationFrame(frame); };
  }, [phase]);

  // Esc stops the tour.
  useEffect(() => {
    if (phase === 'away' || phase === 'hidden') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const tapInkling = () => {
    nudge();
    if (phase === 'hidden') {
      let touring = false;
      try { touring = sessionStorage.getItem(SEEN_KEY) === 'touring' || sessionStorage.getItem(TOURED_KEY) === '1'; } catch { /* fine */ }
      if (touring) resume();
      else { setPhase('greet'); setMood('happy'); }
    } else if (phase === 'paused') resume();
  };


  if (!mounted) return null;
  const stop = STOPS[at];
  const line = phase === 'greet'
    ? 'Hi! MemQ turns what you look up into cards, then quizzes you before you forget. I made it, start to finish. Quick tour?'
    : stop.text.slice(0, typed);

  return createPortal(
    <div className={`${g.guide} ${g[phase] ?? ''}`} aria-live="polite">
      {(phase === 'greet' || phase === 'tour' || phase === 'paused') && (
        <div className={g.bubble} role="dialog" aria-label="Inkling, your guide to this case">
          <p>{line}{phase === 'tour' && typed < stop.text.length && <span className={g.caret} aria-hidden="true" />}</p>
          {phase === 'greet' ? (
            <div className={g.row}>
              <button type="button" className={g.ghost} onClick={hide}>Not now</button>
              <button type="button" className={g.go} onClick={() => { remember('touring'); play(stopHere()); }}><span>Sure!</span></button>
            </div>
          ) : (
            <div className={g.row}>
              <span className={g.count}>{at + 1} of {STOPS.length}</span>
              <span className={g.controls}>
                {phase === 'tour'
                  ? <button type="button" className={g.icon} onClick={pause} aria-label="Pause the tour">❚❚</button>
                  : <button type="button" className={g.icon} onClick={resume} aria-label="Carry on">▶</button>}
                {at < STOPS.length - 1 && <button type="button" className={g.icon} onClick={() => play(at + 1)} aria-label="Next stop">›</button>}
                <button type="button" className={g.icon} onClick={hide} aria-label="Stop the tour">×</button>
              </span>
            </div>
          )}
        </div>
      )}
      <div ref={me} className={g.me}>
        <button type="button" className={g.tap} onClick={tapInkling}
          aria-label={phase === 'hidden' ? 'Inkling: tap for a tour of this case' : 'Inkling'}>
          <LiveInkling mood={mood} look={look} poke={poke} still={still} />
        </button>
        {phase === 'hidden' && <span className={g.peekHint} aria-hidden="true">Tour?</span>}
      </div>
    </div>,
    document.body,
  );
}
