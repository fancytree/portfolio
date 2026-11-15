'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Stage } from '../stageshow/kit/stage';
import { Bar } from '../stageshow/kit/window';
import { useReducedMotion } from '../stageshow/kit/reduced-motion';
import type { Act } from '../stageshow/kit/act';
import { geistSans, oswald } from '@/app/fonts';
import { RIG_SVG } from './rigSvg';
import './memq-cover.css';

// MemQ in the language of its own website hero: a lime field with two faint
// orbits, and Inkling between the hills, peeking over the front one with its
// hands on the slope, alive on the app's own rig.
// Beside it, one card comes back as a question. It is answered right, Inkling
// is pleased, and the streak grows by a day. Plays while the pointer is over
// the project card; at rest it holds the poster, Inkling still.
type Mood = 'todayIdle' | 'happy' | 'streakReward';
type Scene = {
  resetting: boolean;
  picked: boolean;
  nice: boolean;
  streak: number;
  mood: Mood;
  /** Where Inkling looks, -1..1 each way. */
  look: [number, number];
  /** Bumped to make Inkling react, as a tap does in the app. */
  poke: number;
  run: number;
};

/** Where the story starts: nothing answered yet, Inkling resting and watching the card. */
const START: Scene = { resetting: false, picked: false, nice: false, streak: 21, mood: 'todayIdle', look: [-0.8, 0.15], poke: 0, run: 0 };
/** Where it ends, and so the still and each loop's first frame: answered, the streak one day longer. */
const END: Scene = { ...START, picked: true, nice: true, streak: 22, mood: 'streakReward', look: [0.55, -0.6] };
const initial = END;
const poster = END;

async function reset(a: Act<Scene>) {
  a.put({ resetting: true });
  await a.wait(380);
  await a.snap((s) => ({ ...START, run: s.run + 1, poke: s.poke, resetting: true }));
  await a.wait(40);
  await a.set({ resetting: false });
  await a.wait(600);
}

async function script(a: Act<Scene>) {
  a.mark('opening');
  await reset(a);
  await a.wait(900);

  a.mark('answer');
  await a.move({ at: 'answer' });
  await a.click({ at: 'answer' });
  a.put((s) => ({ picked: true, mood: 'happy', poke: s.poke + 1, look: [-0.4, -0.1] }));
  await a.wait(520);
  a.put({ nice: true });
  await a.move({ at: 'rest' });
  await a.wait(1100);

  a.mark('streak');
  a.put((s) => ({ streak: 22, mood: 'streakReward', look: [0.55, -0.6], poke: s.poke + 1 }));
  a.mark('payoff');
  await a.wait(3000);
  // The loop starts again from END, which is where this leaves it.
  a.put({ look: END.look });
}

type Frame = Record<string, number[] | number | string>;
type Rig = {
  CHANNEL_COUNT: number;
  createRigState: (mood: string) => unknown;
  solveRig: (state: unknown, input: unknown, dt: number) => Frame;
};

/** Inkling on the app's own spring rig (mascot-rig.js), drawn into the website hero's SVG. */
function Inkling({ mood, look, poke, active }: { mood: Mood; look: [number, number]; poke: number; active: boolean }) {
  const reduced = useReducedMotion();
  const still = reduced || !active;
  const host = useRef<HTMLDivElement>(null);
  const input = useRef({ mood, look, poke: 0 });
  const rigState = useRef<unknown>(null);
  // The rig reacts when its tap count changes, so it only ever counts up: a loop
  // going back to 0 must not read as a tap.
  const taps = useRef({ seen: poke, count: 0 });
  useEffect(() => {
    if (poke > taps.current.seen) taps.current.count += 1;
    taps.current.seen = poke;
    input.current = { mood, look, poke: taps.current.count };
  }, [mood, look, poke]);

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
      // One rig state for the life of the cover: going from the still to playing is
      // then a spring settling, not a new pose appearing.
      rigState.current ??= rig.createRigState(input.current.mood);
      const state = rigState.current;
      // How the website hero has it standing.
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
        const dt = last ? (t - last) / 1000 : 0;
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
        tag.src = '/demos/memq-mascot/mascot-rig.js';
        tag.async = true;
        tag.dataset.memqRig = '';
        document.head.appendChild(tag);
      }
      tag.addEventListener('load', () => { if (w.MemQMascot) start(w.MemQMascot); }, { once: true });
    }
    return () => { stopped = true; cancelAnimationFrame(frame); };
  }, [still]);

  return <div ref={host} className="mq-inkling" dangerouslySetInnerHTML={{ __html: RIG_SVG }} />;
}

// The app's StreakPill, as the case study's mascot demo plays it: the flame flares
// from its foot and throws an echo and three sparks; 260 ms later the number
// counts up in place, each new value popping, and the pill bumps to 1.08.
const FLAME_H = 21, STEP_MS = 320, ROLL_MAX_MS = 1300, FLARE_MS = 1150, LEAD_MS = 260;
const SPARKS = [{ at: 0.1, x: -11, y: -24 }, { at: 0.2, x: 3, y: -31 }, { at: 0.3, x: 13, y: -21 }];
const FLARE_AT = [0, 0.14, 0.32, 0.5, 0.7, 1];
const lerp = (xs: number[], ys: number[], v: number) => {
  for (let i = 1; i < xs.length; i++) if (v <= xs[i]) return ys[i - 1] + (ys[i] - ys[i - 1]) * ((v - xs[i - 1]) / (xs[i] - xs[i - 1]));
  return ys[ys.length - 1];
};
// The same flame.svg the mascot demo uses: five 17px sprites, no optimizer needed.
/* eslint-disable @next/next/no-img-element */
const FLAME_SRC = '/demos/memq-mascot/flame.svg';

function Streak({ value, active }: { value: number; active: boolean }) {
  const reduced = useReducedMotion();
  const face = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLElement>(null);
  const shown = useRef(value);

  // React writes the settled value; while it grows, the frames below write the
  // number in between, before the first paint.
  useLayoutEffect(() => {
    const pill = face.current, el = num.current, flames = box.current;
    if (!pill || !el || !flames) return;
    const [echo, ...rest] = Array.from(flames.querySelectorAll('img'));
    const flame = rest.pop()!, sparks = rest;
    const from = shown.current;
    shown.current = value;
    const show = (n: number) => {
      const text = String(n);
      if (el.textContent === text) return;
      el.textContent = text;
      el.classList.remove('mq-pop');
      void el.offsetWidth;
      el.classList.add('mq-pop');
    };
    const settle = () => {
      pill.style.transform = flame.style.transform = '';
      for (const s of [echo, ...sparks]) s.style.opacity = '0';
      el.textContent = String(value);
    };
    if (value <= from || reduced || !active) { settle(); el.classList.remove('mq-pop'); return; }

    el.textContent = String(from);
    const roll = Math.min(ROLL_MAX_MS, (value - from) * STEP_MS);
    const t0 = performance.now();
    let bump = { v: 1, vel: 0, phase: 'wait' as 'wait' | 'up' | 'spring' | 'rest' };
    let last = t0, frame = 0;
    const tick = (now: number) => {
      const t = Math.max(0, now - t0), dt = Math.max(0, (now - last) / 1000);
      last = now;
      const f = Math.min(1, t / FLARE_MS);
      const g = lerp(FLARE_AT, [1, 1.55, 0.92, 1.22, 0.98, 1], f), lean = lerp(FLARE_AT, [0, -12, 9, -6, 3, 0], f);
      flame.style.transform = `translateY(${-(g - 1) * FLAME_H / 2}px) rotate(${lean}deg) scale(${g})`;
      const p = Math.min(1, f / 0.55);
      echo.style.opacity = String(p <= 0 || p >= 1 ? 0 : 0.42 * (1 - p));
      echo.style.transform = `translateY(${-p * FLAME_H * 0.6}px) scale(${1 + p * 1.5})`;
      SPARKS.forEach((s, i) => {
        const q = Math.min(1, Math.max(0, (f - s.at) / 0.55)), out = 1 - (1 - q) * (1 - q);
        sparks[i].style.opacity = String(q <= 0 || q >= 1 ? 0 : 1 - q);
        sparks[i].style.transform = `translate(${s.x * out}px, ${s.y * out}px) scale(${1 - 0.45 * q})`;
      });
      const r = Math.min(1, Math.max(0, (t - LEAD_MS) / roll));
      show(Math.round(from + (value - from) * (1 - Math.pow(1 - r, 3))));
      const bt = t - LEAD_MS;
      if (bump.phase === 'wait' && bt >= 0) bump.phase = 'up';
      if (bump.phase === 'up') {
        const k = Math.min(1, bt / 130);
        bump.v = 1 + 0.08 * (1 - (1 - k) * (1 - k));
        if (k >= 1) bump = { ...bump, phase: 'spring', vel: 0 };
      } else if (bump.phase === 'spring') {
        const s = Math.min(dt, 0.032), a = -240 * (bump.v - 1) - 9 * bump.vel;
        bump.vel += a * s;
        bump.v += bump.vel * s;
        if (Math.abs(bump.v - 1) < 0.0005 && Math.abs(bump.vel) < 0.01) bump = { v: 1, vel: 0, phase: 'rest' };
      }
      pill.style.transform = `scale(${bump.v})`;
      if (t > LEAD_MS + roll + 400 && bump.phase === 'rest' && f >= 1) { settle(); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); settle(); };
  }, [value, active, reduced]);

  return (
    <div className="mq-streak" role="img" aria-label={`${value}-day streak`}>
      <div ref={face} className="mq-streak__face">
        <span ref={box} className="mq-streak__flame" aria-hidden="true">
          <img className="mq-streak__echo" src={FLAME_SRC} alt="" />
          <img className="mq-streak__spark" src={FLAME_SRC} alt="" />
          <img className="mq-streak__spark" src={FLAME_SRC} alt="" />
          <img className="mq-streak__spark" src={FLAME_SRC} alt="" />
          <img src={FLAME_SRC} alt="" />
        </span>
        <b ref={num}>{value}</b>
        <span>day streak</span>
      </div>
    </div>
  );
}

export default function MemQCover() {
  const figure = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // The illustration is inert so the project card stays one navigation
    // target. Listen on that link instead of the illustration.
    const link = figure.current?.closest('a');
    if (!link) return;
    const enter = (event: PointerEvent) => { if (event.pointerType !== 'touch') setPlaying(true); };
    const leave = () => setPlaying(false);
    link.addEventListener('pointerenter', enter);
    link.addEventListener('pointerleave', leave);
    link.addEventListener('pointercancel', leave);
    return () => {
      link.removeEventListener('pointerenter', enter);
      link.removeEventListener('pointerleave', leave);
      link.removeEventListener('pointercancel', leave);
    };
  }, []);

  return (
    <figure ref={figure} data-playing={playing || undefined} className={`mq-cover ${geistSans.variable} ${oswald.variable}`} aria-label="MemQ: Inkling, the mascot, stands on the hills while a card comes back as a question. It is answered right, Inkling is pleased, and the streak grows to 22 days.">
      <Stage<Scene> width={800} height={500} initial={initial} poster={poster} script={playing ? script : undefined} play="loop" fidelity="standard" accent="#6c3cbc" greys="cool" cursor={{ at: { x: 330, y: 470 }, idle: 1200 }} className="mq-scene">
        {(s) => <>
          <span className="mq-rest" data-target="rest" />
          <span className="mq-orbit mq-orbit--one" aria-hidden="true" />
          <span className="mq-orbit mq-orbit--two" aria-hidden="true" />

          <span className="mq-note" aria-hidden="true"><b>LESS<br />FORGETTING.</b><small>more knowing ↗</small></span>

          <div className="mq-composition" data-resetting={s.resetting || undefined}>
            <Inkling mood={s.mood} look={s.look} poke={s.poke} active={playing} />

            {/* One card, asked the way the app asks it. */}
            <section className="mq-card">
              <header className="mq-card__head"><span className="mq-topic">Economics</span><span className="mq-chip">Choose</span></header>
              <h3 className="mq-term">Opportunity cost</h3>
              <p className="mq-prompt" data-right={s.picked || undefined}>{s.picked ? 'You got it!' : 'Choose the meaning'}</p>
              <div className="mq-options">
                <div className="mq-option"><Bar w={150} h={7} tone={2} /></div>
                <div className="mq-option" data-target="answer" data-right={s.picked || undefined}><span className="mq-option__text">The value of the best option you give up</span></div>
                <div className="mq-option"><Bar w={176} h={7} tone={2} /></div>
                <div className="mq-option"><Bar w={128} h={7} tone={2} /></div>
              </div>
              <div className="mq-cta" data-ready={s.picked || undefined}><span>Continue →</span></div>
            </section>

            {/* The website's chips, here doing what they say. */}
            <Streak value={s.streak} active={playing} />
            <div className="mq-nice" data-on={s.nice || undefined}><span>✓</span>Nice work!</div>
          </div>
        </>}
      </Stage>
    </figure>
  );
}
