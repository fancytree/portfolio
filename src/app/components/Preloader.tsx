"use client";

// Full-screen loader, shown before the site comes in.
//
// A black seal in the middle of the screen, the same as the hero's "scroll to dive
// in" badge, counts the page in, with a ring filling round it; the homepage's fish,
// the same dithered 3D fish, swims round it. When the page is ready the sheet lifts
// away upwards to show the page, and the fish drops out of its circle and falls, the
// way the tools fall off the About shelf, into the hero's river, where the scene
// takes it back with a splash: the loader's fish and the river's fish are one fish.
// Elsewhere it falls out through the bottom of the screen.
//
// The markup is in the server HTML so it covers the page from the first paint;
// `preloaderGate`, run from the root layout before anything paints, hides it
// straight away when it is not wanted.

import { useEffect, useRef } from "react";
import { riverBus } from "../river/riverBus";
import type { SceneHandle } from "../river/scene3d/build";
import s from "./Preloader.module.css";

const SEEN = "mei-preloaded";
const MIN_MS = 3600; // time to see the fish come round the seal about twice
const MAX_MS = 8000; // never hold the site back longer than this
const FISH_BOX = 300; // css px the fish is rendered into
const FISH_SCALE = 0.62; // its size while it circles
const RING_R = 52; // the progress ring's radius, in the seal's 120-unit drawing
const RING_C = 2 * Math.PI * RING_R;
const SPIN = 1.5; // rad/s round the seal
const FALL_S = 1.05; // from leaving the loop to landing in the river

// Locally (next dev) it plays on every refresh, so it can be looked at; the
// production site plays it once per visit.
const ONCE = process.env.NODE_ENV === "production";

// Run before the page paints (see the root layout): hides the loader at once when it
// has already played this visit, inside an embed, or on the bare /demos pages.
export const preloaderGate = `(function(){var d=document.documentElement;try{if((${ONCE}&&sessionStorage.getItem('${SEEN}'))||location.pathname.indexOf('/demos/')===0||window.top!==window){d.setAttribute('data-preloaded','');return}}catch(e){d.setAttribute('data-preloaded','');return}d.setAttribute('data-preloading','')})();`;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (v: number) => {
  const c = clamp(v);
  return c * c * (3 - 2 * c);
};

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fishRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    const canvas = fishRef.current;
    if (!root || !canvas || html.hasAttribute("data-preloaded")) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const home = window.location.pathname === "/";
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    let disposed = false;
    let frame = 0;
    let finished = false;
    const timers: number[] = [];
    let fish: SceneHandle | null = null;

    // the river's own fish is out of the water while this one circles
    if (home && !still) riverBus.intro.away = true;

    let shown = 0;
    let last = start;
    let upAt = -1; // s: when the fish first showed
    let angle = -Math.PI * 0.75; // where on the loop it is
    let dir = 0;
    // the fall
    let fallAt = -1;
    const from = { x: 0, y: 0, pitch: 0 };

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {
        /* private mode: it will simply play again next time */
      }
      // homepage: the river takes its fish back with a splash, and the page comes in
      riverBus.intro.away = false;
      root.setAttribute("data-done", "");
      html.removeAttribute("data-preloading");
      timers.push(
        window.setTimeout(() => {
          html.setAttribute("data-preloaded", "");
          cancelAnimationFrame(frame);
          fish?.dispose();
          fish = null;
        }, 520),
      );
    };

    // where the fish is on its circle round the seal: a plain circle, at a steady pace
    const loop = (a: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = Math.min(200, vw * 0.36);
      return { x: vw / 2 + Math.cos(a) * r, y: vh / 2 + Math.sin(a) * r };
    };

    const place = (x: number, y: number, scale: number) => {
      canvas.style.transform = `translate3d(${(x - (FISH_BOX * scale) / 2).toFixed(1)}px, ${(y - (FISH_BOX * scale) / 2).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    };

    const tick = (now: number) => {
      if (disposed || finished) return;
      const t = (now - start) / 1000;
      const realDt = Math.min(1, (now - last) / 1000);
      last = now;
      const elapsed = now - start;
      const ready = (loaded && elapsed >= MIN_MS) || elapsed >= MAX_MS;
      const target = ready ? 1 : Math.min(0.9, (elapsed / MIN_MS) * 0.9);
      // by real time, so a throttled tab still gets through
      shown += (target - shown) * (1 - Math.exp(-realDt * (ready ? 6 : 4)));
      if (ready && 1 - shown < 0.005) shown = 1;
      if (countRef.current)
        countRef.current.textContent = String(Math.round(shown * 100));
      arcRef.current?.style.setProperty(
        "stroke-dashoffset",
        (RING_C * (1 - shown)).toFixed(2),
      );

      if (!fish) {
        // no fish (reduced motion or no WebGL): the counter carries it alone
        if (shown === 1) finish();
        else frame = requestAnimationFrame(tick);
        return;
      }
      if (upAt < 0) {
        upAt = t;
        root.setAttribute("data-fish", "");
      }

      if (fallAt < 0) {
        // circling
        angle += SPIN * realDt;
        const p = loop(angle);
        const q = loop(angle + 0.02);
        const vx = q.x - p.x;
        const vy = q.y - p.y;
        // It faces the way it swims, turning smoothly the whole way round: right along
        // the top, left along the bottom, and head-on to the camera or away on the sides,
        // never flipping from one side to the other.
        const speed = Math.hypot(vx, vy) || 1;
        dir = Math.acos(clamp(vx / speed, -1, 1));
        const pitch = Math.atan2(-vy, Math.abs(vx)) * 0.55;
        fish.pose(dir, pitch, 2, 0, 0);
        place(p.x, p.y, FISH_SCALE);
        canvas.style.zIndex = Math.sin(angle) < -0.15 ? "1" : "3";
        // once the page is ready and the fish has been round a while, it lets go of the loop
        if (shown === 1 && t - upAt > 1.2) {
          fallAt = t;
          Object.assign(from, { x: p.x, y: p.y, pitch });
          root.setAttribute("data-clear", ""); // the sheet lifts away to show the page
        }
      } else {
        // falling, like a tool off the shelf: slow off the loop, fast into the water,
        // drifting across to where it lands and turning nose-down on the way
        const k = clamp((t - fallAt) / FALL_S);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const spot =
          home && riverBus.fish && riverBus.fish.y > 0 && riverBus.fish.y < vh
            ? riverBus.fish
            : null;
        const to = spot ?? {
          x: clamp(from.x, vw * 0.2, vw * 0.8),
          y: vh + 160,
        };
        const x = from.x + (to.x - from.x) * ease(k);
        // a little lift as it lets go, then the drop
        const y =
          from.y -
          50 * Math.sin(Math.min(1, k * 2.4) * Math.PI) * (1 - k) +
          (to.y - from.y) * k * k;
        const pitch = from.pitch + (-1.45 - from.pitch) * ease(k * 1.4);
        // it ends the size the river's fish looks on screen (the same overlay camera as
        // Journey's airborne fish: 2.5 units long over 300 px at 30°, 8.8 off), so the
        // fish that lands is the very size of the one the river takes back
        const flyerLen = (2.5 * FISH_BOX) / (2 * 8.8 * Math.tan((15 * Math.PI) / 180));
        const endScale = spot ? spot.len / flyerLen : 0.55;
        const scale = FISH_SCALE + (endScale - FISH_SCALE) * k * k;
        fish.pose(dir, pitch, 1.2 + k * 2, 0, -0.6 * Math.sin(k * Math.PI));
        place(x, y, scale);
        canvas.style.zIndex = "3";
        if (k >= 1) {
          canvas.style.opacity = "0";
          finish();
        }
      }
      fish.render(t, 0, 0, 0, 0);
      frame = requestAnimationFrame(tick);
    };

    if (still) {
      frame = requestAnimationFrame(tick);
    } else {
      import("../river/scene3d/build")
        .then(({ createScene }) => {
          if (disposed) return;
          fish = createScene("fish", canvas);
          fish.resize(FISH_BOX, FISH_BOX, 0);
        })
        .catch(() => {
          /* no WebGL: the counter carries it alone */
        })
        .finally(() => {
          if (!disposed) frame = requestAnimationFrame(tick);
        });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", onLoad);
      fish?.dispose();
      if (home) riverBus.intro.away = false;
    };
  }, []);

  return (
    <div ref={rootRef} className={s.loader} aria-hidden="true">
      {/* the sheet (paper and mark) and the seal lift away together when the page is ready;
          the fish swims between them, behind the seal on the far side of its circle */}
      <div className={s.sheet}>
        <div className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.logo}
            src="/logo.gif"
            alt=""
            width={33}
            height={20}
          />
          <span className={s.name}>Mei Chai°</span>
        </div>
      </div>
      <div className={s.seal}>
        <svg className={s.track} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={RING_R} />
          <circle
            ref={arcRef}
            className={s.arc}
            cx="60"
            cy="60"
            r={RING_R}
            strokeDasharray={RING_C.toFixed(2)}
            strokeDashoffset={RING_C.toFixed(2)}
          />
        </svg>
        <span className={s.badge}>
          <svg className={s.ring} viewBox="0 0 120 120">
            <defs>
              <path
                id="loader-circle"
                d="M60 60 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0"
              />
            </defs>
            <text>
              <textPath href="#loader-circle" textLength="278">
                LOADING · DIVE IN · LOADING · DIVE IN · LOADING · DIVE IN ·
              </textPath>
            </text>
          </svg>
          <span className={s.count}>
            <span ref={countRef}>0</span>
            <small>%</small>
          </span>
        </span>
      </div>
      <canvas
        ref={fishRef}
        className={s.fish}
        width={FISH_BOX}
        height={FISH_BOX}
      />
    </div>
  );
}
