'use client';

/**
 * A guided tour of the Procurement Agent case, narrated by Mei's head, with
 * the hair and face of the homepage figure. Same behaviour as MemQ's Inkling tour:
 * - Yes: it scrolls to each stop, outlines it and types what it says. Pause, skip or
 *   stop at any time; scrolling yourself pauses it too.
 * - No: it ducks to the edge of the screen. Tap it to start.
 * Reduced motion: no scrolling animation and no typing.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Pause, Play, Sparkles, X } from 'lucide-react';
import { CaseButton } from '../../components/case-kit/CaseButton';
import MeiHead, { type MeiHeadHandle } from '../../components/guide/MeiHead';
import type { Action, Face } from '../../components/guide/headRig';
import g from './TourGuide.module.css';

/** `face` and `action`: how Mei takes the stop. `dwell`: extra time to watch a live demo or try a control. */
type Stop = { target: string; text: string; face: Face; action?: Action; dwell?: number };

// Each design: what it does for the buyer, then what it still left them with.
const STOPS: Stop[] = [
  { target: 'problem', face: 'worried', action: 'shake', text: 'Before I started, buying ran on **Excel, supplier messages, and paper**. Only the goods arriving was keyed into the system, so **nobody could see a purchase whole**.' },
  { target: 'v1', face: 'smile', text: 'So first, the whole purchase moved **onto one platform**: create a draft, record the confirmed order, record the goods into stock. **AI checks the documents** along the way.', dwell: 4000 },
  { target: 'turning', face: 'thinking', text: 'Checking got easier. **Deciding didn’t.** What to buy, and how much, still lived in the buyer’s head.\n\nSo I needed to **reduce the buyer’s cognitive load**.' },
  { target: 'why', face: 'smile', action: 'nod', text: 'Is an AI Agent the answer? **Here, yes.** That load comes from three things: reading many places, doing a sum for every product, and remembering last time. An Agent can take on all three, and **the buyer still decides**.', dwell: 2000 },
  { target: 'principles', face: 'focused', action: 'nod', text: 'Then, how should an AI Agent be designed? These principles are **the foundation I design every Agent on**, and I keep them in mind: before, during, after, and over time. Tap a stage.', dwell: 4000 },
  { target: 'workflow', face: 'neutral', text: 'First, I needed to **design the whole Agent flow**. It reads what each stage needs, and **the user steps in** wherever the decision is theirs.', dwell: 4000 },
  { target: 'byhand', face: 'smile', action: 'wink', text: 'My first rule: it still **works without the AI**. Same page, same actions. Drag the handle to compare.', dwell: 4000 },
  { target: 'choice-1', face: 'thinking', text: 'How should a purchase begin? **Plain words to start**, fields for what has to be exact.', dwell: 2000 },
  { target: 'entries', face: 'smile', text: 'So there are **four ways in**: ask in words, fill two fields, take a suggested supplier, or open a plan that is ready.', dwell: 4000 },
  { target: 'choice-2', face: 'thinking', action: 'tilt', text: 'How can the user trust a quantity? **One plan, with its reason on every line.**', dwell: 2000 },
  { target: 'evidence', face: 'focused', action: 'nod', text: 'First, **the Agent shows its evidence**. It forecasts demand, allowing for seasons and customer changes, then counts stock and lead time. The user can trace each line back.', dwell: 4000 },
  { target: 'score', face: 'thinking', text: 'Then **a score for each supplier**, because each is ordered from at its own rhythm. Less history means **lower confidence**.', dwell: 4000 },
  { target: 'review', face: 'neutral', text: 'After delivery, **the Agent reviews first**: planned against needed, product by product.', dwell: 4000 },
  { target: 'review-note', face: 'smile', action: 'nod', text: 'Then the user **adds what the data can’t show**. The note is read back as a product and an action.', dwell: 4000 },
  { target: 'review-learned', face: 'happy', text: 'Both go into **the next plan**: coverage, lead time and products. A rule changes only when someone publishes it.', dwell: 4000 },
  { target: 'result', face: 'happy', action: 'hop', text: 'Here it is running: a supplier to order from, a plan the user can question, and **nothing ordered until they do it**.', dwell: 12000 },
  { target: 'results', face: 'smile', action: 'laugh', text: 'A plan that took 30 minutes to 2 hours now takes **5 to 10 minutes**, and three people use it daily.\n\nTry the working demo just below. Tap me to go again.' },
];

const GREETING = 'Hi! This Agent drafts purchase orders, then **leaves the decision to the buyer**. I designed it. Quick tour?';

type Phase = 'away' | 'greet' | 'tour' | 'paused' | 'hidden';
const SEEN_KEY = 'procurement-case-guide';
/** Set once a tour has been started this visit, so a tap later goes straight back in. */
const TOURED_KEY = 'procurement-case-guide-toured';
const TYPE_MS = 22;
const READ_MS = (text: string) => 1600 + text.length * 38;

/** A line as read, without the `**` that marks its key words. */
const plain = (text: string) => text.replace(/\*\*/g, '');

/** The first `count` characters of a line, with the key words in bold. */
function Said({ text, count }: { text: string; count: number }) {
  const parts = text.split('**');
  return <>{parts.map((part, i) => {
    const before = parts.slice(0, i).join('').length;
    const shown = part.slice(0, Math.max(0, count - before));
    return i % 2 ? <strong key={i}>{shown}</strong> : shown;
  })}</>;
}

/** Marks a part of the page as a stop on the tour. */
export function TourMark({ id, children }: { id: string; children: ReactNode }) {
  return <div data-mei-tour={id}>{children}</div>;
}

/* ───────────────────────── Scrolling ───────────────────────── */

/** Scrolls so `el` sits in the upper middle of the screen; returns a cancel. */
/** The site scrolls smoothly by default; each frame here has to land exactly. */
let release = 0;
const jump = (y: number) => {
  // Live demos hold the page still while they play; this tells them the guide is moving it.
  const root = document.documentElement;
  root.dataset.guidedScroll = '';
  window.clearTimeout(release);
  release = window.setTimeout(() => { delete root.dataset.guidedScroll; }, 300);
  window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
};

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
    const el = document.querySelector<HTMLElement>(`[data-mei-tour="${stop.target}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
    if (gap < bestGap) { bestGap = gap; best = i; }
  });
  return best;
}

/* ───────────────────────── The guide ───────────────────────── */

export function TourGuide() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('away');
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState(0);
  const [still, setStill] = useState(false);
  const [look, setLook] = useState<[number, number]>([-0.5, 0]);
  const [moving, setMoving] = useState(false);
  const me = useRef<HTMLDivElement>(null);
  const head = useRef<MeiHeadHandle>(null);
  const [hailing, setHailing] = useState(false);
  const timers = useRef<number[]>([]);
  const cancelGlide = useRef<() => void>(() => {});
  const gliding = useRef(false);
  const playNext = useRef<(i: number) => void>(() => {});
  const atRef = useRef(0);

  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; cancelGlide.current(); gliding.current = false; };
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  // Arrive: greet, unless they said not now earlier in this visit.
  useEffect(() => {
    let seen: string | null = null;
    try { seen = sessionStorage.getItem(SEEN_KEY); } catch { /* private window: greet anyway */ }
    // Told "not now" already: be at the edge from the first frame, no slide in.
    const ready = window.setTimeout(() => {
      setMounted(true);
      setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (seen === 'hidden') setPhase('hidden');
    }, 0);
    const arrive = window.setTimeout(() => {
      if (seen === 'hidden') return;
      setPhase('greet');
    }, 350);
    const pending = timers.current;
    return () => { window.clearTimeout(ready); window.clearTimeout(arrive); pending.forEach((t) => window.clearTimeout(t)); cancelGlide.current(); };
  }, []);

  const remember = (v: string) => { try { sessionStorage.setItem(SEEN_KEY, v); if (v === 'touring') sessionStorage.setItem(TOURED_KEY, '1'); } catch { /* fine */ } };

  // Look at the stop: where it is on screen, from where she stands.
  const lookAt = useCallback((el: HTMLElement) => {
    const from = me.current?.getBoundingClientRect();
    if (!from) return;
    const r = el.getBoundingClientRect();
    const dx = (r.left + r.width / 2) - (from.left + from.width / 2);
    const dy = (r.top + Math.min(r.height, 300) / 2) - (from.top + from.height / 2);
    setLook([Math.max(-1, Math.min(1, dx / 500)), Math.max(-1, Math.min(1, dy / 400))]);
  }, []);

  /** Plays stop `i`: glide there, look, type the line, wait, go on. */
  const play = useCallback((i: number) => {
    clear();
    const stop = STOPS[i];
    const el = document.querySelector<HTMLElement>(`[data-mei-tour="${stop.target}"]`);
    setAt(i); setTyped(0); setPhase('tour');
    document.querySelectorAll('[data-mei-tour-on]').forEach((n) => n.removeAttribute('data-mei-tour-on'));
    const speak = () => {
      gliding.current = false;
      setMoving(false);
      if (el) { el.setAttribute('data-mei-tour-on', ''); lookAt(el); }
      if (stop.action && !still) head.current?.play(stop.action);
      const { length } = plain(stop.text);
      if (still) setTyped(length);
      else for (let c = 1; c <= length; c++) later(() => setTyped(c), c * TYPE_MS);
      const read = (still ? 0 : length * TYPE_MS) + READ_MS(plain(stop.text)) + (stop.dwell ?? 0);
      if (i < STOPS.length - 1) later(() => playNext.current(i + 1), read);
      else later(() => { setPhase('hidden'); document.querySelectorAll('[data-mei-tour-on]').forEach((n) => n.removeAttribute('data-mei-tour-on')); setAt(0); }, read + 2500);
    };
    if (!el) { speak(); return; }
    gliding.current = true;
    setMoving(true);
    cancelGlide.current = glideTo(el, still, speak);
  }, [still, lookAt]);
  useEffect(() => { playNext.current = play; }, [play]);
  useEffect(() => { atRef.current = at; }, [at]);

  const pause = useCallback(() => {
    clear();
    setMoving(false);
    setTyped(plain(STOPS[at].text).length);
    setPhase('paused');
  }, [at]);
  const resume = () => { remember('touring'); play(stopHere()); };
  const hide = () => { clear(); setMoving(false); setLook([-0.8, 0]); remember('hidden'); setPhase('hidden'); document.querySelectorAll('[data-mei-tour-on]').forEach((n) => n.removeAttribute('data-mei-tour-on')); };

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
        setTyped(plain(STOPS[i].text).length);
        document.querySelectorAll('[data-mei-tour-on]').forEach((n) => n.removeAttribute('data-mei-tour-on'));
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

  // A wave and a few words when she asks.
  useEffect(() => {
    if (phase !== 'greet' || still) return;
    head.current?.play('hello');
    const from = window.setTimeout(() => setHailing(true), 0);
    const to = window.setTimeout(() => setHailing(false), 2600);
    return () => { window.clearTimeout(from); window.clearTimeout(to); setHailing(false); };
  }, [phase, still]);

  const tapGuide = () => {
    if (phase === 'hidden') {
      let touring = false;
      try { touring = sessionStorage.getItem(SEEN_KEY) === 'touring' || sessionStorage.getItem(TOURED_KEY) === '1'; } catch { /* fine */ }
      if (touring) resume();
      else setPhase('greet');
    } else if (phase === 'paused') resume();
  };


  if (!mounted) return null;
  const stop = STOPS[at];
  const { length } = plain(stop.text);
  const talking = hailing || (phase === 'tour' && typed > 0 && typed < length);
  const face: Face = phase === 'tour' ? stop.face : phase === 'paused' ? 'neutral' : 'smile';

  return createPortal(
    <div className={`${g.guide} ${g[phase] ?? ''}`} aria-live="polite">
      {(phase === 'greet' || phase === 'tour' || phase === 'paused') && (
        <div className={g.bubble} role="dialog" aria-label="Your guide to this case">
          <p>
            {phase === 'greet' ? <Said text={GREETING} count={GREETING.length} /> : <Said text={stop.text} count={typed} />}
            {phase === 'tour' && typed < length && <span className={g.caret} aria-hidden="true" />}
          </p>
          {phase === 'greet' ? (
            <div className={g.row}>
              <CaseButton variant="text" onClick={hide}>Not now</CaseButton>
              <CaseButton arrow="none" onClick={() => { remember('touring'); play(stopHere()); }}>Show me</CaseButton>
            </div>
          ) : (
            <div className={g.row}>
              <span className={g.count}>{at + 1} / {STOPS.length}</span>
              <span className={g.controls}>
                {phase === 'tour'
                  ? <CaseButton variant="icon" onClick={pause} aria-label="Pause the tour"><Pause aria-hidden="true" /></CaseButton>
                  : <CaseButton variant="icon" onClick={resume} aria-label="Carry on"><Play aria-hidden="true" /></CaseButton>}
                {at < STOPS.length - 1 && <CaseButton variant="icon" onClick={() => play(at + 1)} aria-label="Next stop"><ChevronRight aria-hidden="true" /></CaseButton>}
                <CaseButton variant="icon" onClick={hide} aria-label="Stop the tour"><X aria-hidden="true" /></CaseButton>
              </span>
            </div>
          )}
        </div>
      )}
      <div ref={me} className={g.me}>
        <CaseButton variant="icon" className={g.tap} onClick={tapGuide}
          aria-label={phase === 'hidden' ? 'Mei: take a tour of this case' : 'Mei, your guide'}>
          <MeiHead ref={head} className={g.avatar} face={face} talking={talking} look={look} moving={moving} still={still} fallback={<Sparkles aria-hidden="true" />} />
        </CaseButton>
        {phase === 'hidden' && <span className={g.peekHint} aria-hidden="true">Tour?</span>}
      </div>
    </div>,
    document.body,
  );
}
