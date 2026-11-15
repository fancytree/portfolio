'use client';

import { useEffect, useRef, useState } from 'react';
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

function Flame({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.24} viewBox="0 0 17.024 21.105" aria-hidden="true">
      <defs><linearGradient id="mq-cover-flame" x1="2" y1="8.6" x2="9.5" y2="20.6" gradientUnits="userSpaceOnUse"><stop stopColor="#FDAE1C" /><stop offset="1" stopColor="#FE9227" /></linearGradient></defs>
      <path d="M9.875 1.105C8.875.105 7.733-.181 6.875.105 6.017.391 5.875 2.605 5.875 4.605s-.5 3.5-1.5 3.5c-.707 0-.744-1-1.5-1-.5 0-1 .5-2 2s-1.5 6.5.5 8.5 4 3.5 7 3.5c4.5 0 7.733-3.432 8.5-6.5.5-2-.367-5.235-1-6.5-.5-1-1-1.5-1.5-1.5s-1.5 1.5-2 1c-.5-.5-.732-4.732-2.5-6.5Z" fill="url(#mq-cover-flame)" />
      <path d="M11.5 15.105c-.203-1.199-2.105-3.773-3-3.476-.791.262.1 2.5-1.5 2.5-2 0-2 1.5-2 2s.5 2.5 3.5 2.5c2.4 0 3.203-2.325 3-3.524Z" fill="#fff" />
    </svg>
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
            <div className="mq-streak" data-grew={s.streak > START.streak || undefined}>
              <span className="mq-streak__flame"><Flame /></span>
              <b key={s.streak} className={s.streak > START.streak && !s.resetting ? 'mq-pop' : undefined}>{s.streak}</b>
              <span>day streak</span>
            </div>
            <div className="mq-nice" data-on={s.nice || undefined}><span>✓</span>Nice work!</div>
          </div>
        </>}
      </Stage>
    </figure>
  );
}
