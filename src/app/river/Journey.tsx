'use client';

// The river journey: one 3D world on a fixed canvas behind the whole page.
// Scrolling the page tracks the camera downstream, from the hill at the source
// to the sea, so the sections read as stops along one river rather than as
// separate panels. Sections either let the world show through ("windows":
// hero, interlude, contact) or slide over it as opaque sheets (work, about).
//
// three.js is loaded on demand. Without WebGL the page simply has no scene.
// With reduced motion nothing animates on its own; the camera still follows
// the scroll, because that movement is the visitor's.

import { useEffect, useRef } from "react";
import { riverBus } from "./riverBus";
import type { SceneHandle } from "./scene3d/build";
import { SHELF_TOOL_FRACTION, SHELF_TOOL_SCALE, SHELF_WIDTH, TOOL_SLOTS, dropShare, shelfFraction, type ToolFall } from "./scene3d/toolLayout";

// page background at the source and at the sea; the sheets carry the tones in between
const PAPER = [0xfa, 0xfa, 0xf8];
const DUSK = [0xe1, 0xe0, 0xd8];
const FISH_REACH = 64; // css px around the fish that count as clicking it
const HEADER = 80;
// size of the overlay the airborne fish is drawn in, css px
const FLYER_W = 300;
const FLYER_H = 300;
// drawn smaller out of the water, so it fits the margins and gaps of Selected Work
const FLYER_SCALE = 0.55;
// Journey progress (0 source … 1 sea) at each of those moments. U_FIRST is just
// before the first node comes in from the right, U_LAST just after the last one
// has left on the left.
const U_PAN = 0.09; // how far downstream the camera has drifted by the time Selected Work covers the hero
const U_ENTER = 0.1;
const U_FIRST = 0.19;
const U_LAST = 0.735;
const U_GONE = 0.8;

type Props = { className?: string; buttonClassName?: string; flyerClassName?: string };

export default function Journey({ className, buttonClassName, flyerClassName }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flyerRef = useRef<HTMLCanvasElement>(null);
  const jumpRef = useRef<() => void>(() => {});

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let handle: SceneHandle | null = null;
    // The fish out of water: a second, small canvas above the page. When a sheet
    // covers the river the fish bursts out and flies alongside the scroll; when
    // water shows again it dives back in and the river fish takes over.
    const flyerCanvas = flyerRef.current;
    let flyer: SceneHandle | null = null;
    const fly = {
      state: "water" as "water" | "air" | "diving",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      dir: Math.PI,
      pitch: 0,
      side: 1, // which side of the mouse it settles on
      resting: false,
      heading: -Math.PI / 2, // direction of travel on screen, radians (0 = right, π/2 = down)
      speed: 0,
      turn: 0,
      since: 0,
      wet: 0,
      lastY: window.scrollY,
      lastT: 0,
    };
    // where the mouse is, in px, and when it last moved (the airborne fish follows it)
    const mouse = { x: 0, y: 0, at: -99 };
    let disposed = false;
    let frame = 0;
    let running = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const windows = Array.from(document.querySelectorAll<HTMLElement>("[data-river-window]"));
    const seaWindow = document.querySelector<HTMLElement>("#contact");
    // blocks of text that lie over the scene; it is kept clear behind whichever is on screen
    const texts = Array.from(document.querySelectorAll<HTMLElement>("[data-river-text]"));
    // A block's own box runs the full column, so measure the words themselves:
    // the clearing should be no wider than what there is to read. The result is
    // kept as insets from the block's box and only re-measured when the layout changes.
    const range = document.createRange();
    const insets = new Map<HTMLElement, { l: number; t: number; r: number; b: number }>();
    const measureText = () => {
      insets.clear();
      for (const el of texts) {
        const box = el.getBoundingClientRect();
        let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (!node.textContent?.trim()) continue;
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            l = Math.min(l, rect.left);
            t = Math.min(t, rect.top);
            r = Math.max(r, rect.right);
            b = Math.max(b, rect.bottom);
          }
        }
        // buttons and links are wider than their labels
        el.querySelectorAll("a").forEach((link) => {
          const rect = link.getBoundingClientRect();
          l = Math.min(l, rect.left);
          r = Math.max(r, rect.right);
          b = Math.max(b, rect.bottom);
        });
        if (r > l) insets.set(el, { l: l - box.left, t: t - box.top, r: r - box.left, b: b - box.top });
      }
    };
    const textZone = () => {
      for (const el of texts) {
        const box = el.getBoundingClientRect();
        const inset = insets.get(el);
        if (!inset || box.bottom <= 0 || box.top >= window.innerHeight) continue;
        const left = box.left + inset.l;
        // near the edge of the screen, clear right up to it rather than leave a sliver of scene
        return { left: left < 140 ? -200 : left - 28, top: box.top + inset.t - 22, right: box.left + inset.r + 28, bottom: box.top + inset.b + 22 };
      }
      return null;
    };

    const stretch = document.querySelector<HTMLElement>("[data-river-stretch]");
    const ease = (v: number) => v * v * (3 - 2 * v);
    // How far down the river the camera is (0 source … 1 sea). The page sets the
    // pace: the hero eases away, the long stretch between Work and About carries
    // the camera steadily past the stage nodes, and the last leg eases into the sea.
    // Through the long stretch the camera does not glide: it stops at each stage, so
    // the stage can be read, and runs on to the next. `s` is how far through the
    // stretch the page has scrolled (0..1); the result is the journey progress.
    const STAGE_P = [0, 1, 2, 3, 4].map((i) => (14 + i * 6 - 0.35 - 0.7) / 59.3); // camera beside stage i, on a river 0.7..60 long
    const DRIFT = 0.006; // while stopped she still eases along a little, so the scene is not frozen
    const LEGS: { to: number; from: number; weight: number; stop: boolean }[] = [];
    {
      let at = U_FIRST;
      STAGE_P.forEach((p, i) => {
        LEGS.push({ from: at, to: p - DRIFT, weight: i === 0 ? 0.4 : 0.8, stop: false }); // the run to this stage
        LEGS.push({ from: p - DRIFT, to: p + DRIFT, weight: 1, stop: true }); // the stop at it
        at = p + DRIFT;
      });
      LEGS.push({ from: at, to: U_LAST, weight: 0.9, stop: false });
    }
    const LEGS_TOTAL = LEGS.reduce((sum, leg) => sum + leg.weight, 0);
    const stepped = (s: number) => {
      let left = Math.min(1, Math.max(0, s)) * LEGS_TOTAL;
      for (const leg of LEGS) {
        if (left <= leg.weight) {
          const k = left / leg.weight;
          return leg.from + (leg.to - leg.from) * (leg.stop ? k : ease(k)); // a run starts and ends gently
        }
        left -= leg.weight;
      }
      return U_LAST;
    };
    // Where each stage's stop sits in the page (scroll y), for snapping to it.
    const stageStops = () => {
      if (!stretch) return [];
      const top = stretch.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, stretch.offsetHeight - window.innerHeight);
      const stops: number[] = [];
      let before = 0;
      for (const leg of LEGS) {
        if (leg.stop) stops.push(top + (span * (before + leg.weight / 2)) / LEGS_TOTAL);
        before += leg.weight;
      }
      return stops;
    };
    // Snapping: when the visitor stops scrolling somewhere in the stretch, the page
    // carries on by itself to the stage ahead (in the direction they were going), so
    // it always comes to rest on a stage. Before the first stage and after the last
    // it lets go, so the stretch can be left in either direction.
    let snapTimer = 0;
    let snapTo: number | null = null; // where a snap in flight is heading
    let lastY = window.scrollY;
    let heading = 0; // 1 scrolling down, -1 up
    const settle = () => {
      snapTo = null;
      const stops = stageStops();
      if (!stops.length) return;
      const y = window.scrollY;
      const near = stops.find((stop) => Math.abs(stop - y) < 6);
      if (near !== undefined) return; // resting on a stage already
      let target: number | undefined;
      if (heading >= 0) target = y < stops[stops.length - 1] && y > stops[0] - window.innerHeight * 0.34 ? stops.find((stop) => stop > y) : undefined;
      else target = y > stops[0] && y < stops[stops.length - 1] + window.innerHeight * 0.34 ? [...stops].reverse().find((stop) => stop < y) : undefined;
      if (target === undefined) return;
      snapTo = target;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    const onSnapScroll = () => {
      const y = window.scrollY;
      if (snapTo !== null) {
        if (Math.abs(y - snapTo) < 2) snapTo = null; // arrived
      } else if (y !== lastY) heading = y > lastY ? 1 : -1;
      lastY = y;
      window.clearTimeout(snapTimer);
      if (snapTo === null) snapTimer = window.setTimeout(settle, 140); // scrolling has stopped
    };
    // the visitor taking over mid-snap cancels it
    const onSnapInput = () => {
      snapTo = null;
    };
    const progress = () => progressAt(window.scrollY);
    const progressAt = (y: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      if (!stretch) return Math.min(1, Math.max(0, y / max));
      const vh = window.innerHeight;
      const top = stretch.getBoundingClientRect().top + y;
      // scroll positions: the stretch starts to show, fills the viewport, starts to leave, is gone
      const enter = Math.max(1, top - vh);
      const full = top;
      const leaving = Math.max(full + 1, top + stretch.offsetHeight - vh);
      const gone = Math.min(max - 1, top + stretch.offsetHeight);
      const span = (a: number, b: number) => Math.min(1, Math.max(0, (y - a) / Math.max(1, b - a)));
      // Over the hero the camera drifts downstream, off the island and onto open water,
      // so the project cards lifting out of the river have clear water behind them.
      // It has covered U_PAN by the time the Work sheet is most of the way up the screen;
      // the rest of the way to U_ENTER happens behind that sheet.
      const workEl = document.querySelector<HTMLElement>("#work");
      const panEnd = workEl ? Math.min(enter - 1, Math.max(1, workEl.getBoundingClientRect().top + y - vh * 0.3)) : enter;
      if (y <= panEnd) return U_PAN * ease(span(0, panEnd));
      if (y <= enter) return U_PAN + (U_ENTER - U_PAN) * span(panEnd, enter);
      // The nodes only go by while the window fills the screen, so no card is ever
      // caught half under the sheet above or below.
      if (y <= full) return U_ENTER + (U_FIRST - U_ENTER) * span(enter, full);
      if (y <= leaving) return stepped(span(full, leaving));
      if (y <= gone) return U_LAST + (U_GONE - U_LAST) * span(leaving, gone);
      // The camera reaches the sea and stops before the tools start to drop (the last
      // window's top edge at 62% of the screen), so they fall into still water.
      const sea = document.querySelector<HTMLElement>("#contact");
      const arrived = sea ? Math.max(gone + 1, Math.min(max, sea.getBoundingClientRect().top + window.scrollY - vh * 0.62)) : max;
      return U_GONE + (1 - U_GONE) * ease(span(gone, arrived));
    };
    // The stage cards are rendered by StageNodes inside the page (so they can be
    // clicked); here they are only moved to sit above their 3D markers.
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-river-node]"));
    let stageNow = -1;
    const placeNodes = () => {
      if (!handle) return;
      const spots = handle.nodesScreen();
      // Which stage is she at? A marker stands at the downstream edge of its plateau,
      // so she is "at" a stage from a little over two units before the marker to just past it.
      const runner = riverBus.runnerHidden ? null : riverBus.runner;
      const unit = spots.length > 1 ? Math.abs(spots[1].x - spots[0].x) / 6 : 0; // px per world unit: the stages are 6 apart
      let at = -1;
      if (runner && unit > 1) {
        spots.forEach((n, i) => {
          const d = (runner.x - n.x) / unit;
          if (n.k > 0.5 && d > -2.4 && d < 0.5) at = i;
        });
      }
      if (at !== stageNow) {
        stageNow = at;
        handle.setActiveNode(at);
        // StageNodes opens the card of the stage she has reached, and closes it when she runs on
        window.dispatchEvent(new CustomEvent("river:stage", { detail: at }));
      }
      spots.forEach((n, i) => {
        const el = cards[i];
        if (!el) return;
        el.style.opacity = n.k.toFixed(2);
        el.style.visibility = n.k > 0.05 ? "visible" : "hidden"; // out of reach of clicks and focus when gone
        // hang above the marker, but never slide up under the header
        const y = Math.max(n.y - 14, HEADER + el.offsetHeight + 12);
        // open or closed, a card rides with its node and leaves the screen with it
        el.style.transform = `translate3d(${n.x.toFixed(0)}px, ${y.toFixed(0)}px, 0) translate(-50%, -100%)`;
      });
    };
    // the world only needs drawing while some window onto it is on screen
    const worldVisible = () =>
      windows.length === 0 ||
      windows.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      });

    // is the river's surface, where the fish swims, actually showing on screen?
    const waterShowing = (fishY: number) =>
      windows.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < fishY - 70 && rect.bottom > fishY + 50;
      });
    // Selected Work, and the places in it where nothing is written
    const work = document.querySelector<HTMLElement>("#work");
    const workHead = work?.querySelector<HTMLElement>('[data-fish-zone="head"]') ?? null;
    const workMore = work?.querySelector<HTMLElement>('[data-fish-zone="more"]') ?? null;
    const workCovers = (y: number) => {
      if (!work) return false;
      const r = work.getBoundingClientRect();
      return r.top < y + 40 && r.bottom > y - 60;
    };
    /** Where the airborne fish should be right now, or null if Selected Work offers nowhere clear. */
    const workSpot = (t: number) => {
      if (!work || !workHead) return null;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const sec = work.getBoundingClientRect();
      if (sec.bottom < HEADER || sec.top > vh) return null;
      const lo = HEADER + 16;
      const hi = vh - 16;
      // 1. beside the heading: the right half of the section head, above the "view all" link
      const head = workHead.getBoundingClientRect();
      const hTop = Math.max(lo, head.top - 20);
      const hBottom = Math.min(hi, head.bottom - 70);
      if (hBottom - hTop >= 110) {
        const x0 = head.left + head.width * 0.56;
        const x1 = head.right - 70;
        return {
          x: (x0 + x1) / 2 + Math.sin(t * 0.45) * Math.max(0, (x1 - x0) / 2 - 70),
          y: (hTop + hBottom) / 2 + Math.sin(t * 0.9) * Math.max(0, (hBottom - hTop) / 2 - 50),
        };
      }
      // 2. the band under the last row, once it has come into view
      const floor = (workMore ?? workHead).getBoundingClientRect().bottom + 24;
      const fTop = Math.max(lo, floor);
      const fBottom = Math.min(hi, sec.bottom - 20);
      if (fBottom - fTop >= 84) {
        return {
          x: vw * 0.5 + Math.sin(t * 0.4) * vw * 0.24,
          y: (fTop + fBottom) / 2 + Math.sin(t * 0.8) * Math.max(0, (fBottom - fTop) / 2 - 38),
        };
      }
      // 3. otherwise the page margin, swimming up and down beside the cards
      const margin = vw - head.right;
      if (margin >= 52) {
        const x = head.right + margin / 2;
        // Not in the margin yet: get there sideways first, at the height it is already
        // at, rather than cutting the corner across a card on the way down.
        if (fly.state !== "water" && fly.x < x - 46) return { x, y: Math.max(lo + 40, Math.min(hi - 40, fly.y)) };
        return { x, y: (lo + hi) / 2 + Math.sin(t * 0.55) * (hi - lo) * 0.3 };
      }
      return null;
    };

    const updateFlyer = (t: number) => {
      if (!handle || !flyer || !flyerCanvas || still) return;
      const dt = Math.min(0.05, Math.max(0.001, t - fly.lastT));
      fly.lastT = t;
      const scrolled = window.scrollY - fly.lastY;
      fly.lastY = window.scrollY;
      const home = handle.fishScreen();
      if (!home) return;
      const wet = waterShowing(home.y);
      fly.wet = wet ? fly.wet + dt : 0;

      const spot = workSpot(t);
      if (fly.state !== "water" && !wet && !spot) {
        // Selected Work has gone and there is no river in view either (a jump down the
        // page, or the About sheet): the fish is simply back in the river, out of sight
        handle.fishEnter();
        fly.state = "water";
      }
      if (fly.state === "water") {
        if (!wet && spot && workCovers(home.y)) {
          // the Selected Work sheet has reached the water: out it comes, with a splash
          handle.fishLeave();
          fly.state = "air";
          fly.since = t;
          fly.x = home.x;
          fly.y = home.y;
          fly.vx = 120;
          fly.vy = -820;
        }
      } else {
        // Out of the water it keeps to the empty parts of Selected Work: the space
        // beside the heading, the page margin while the cards go by, the band under
        // the last row. It is routed there; it does not follow the mouse.
        let tx = spot ? spot.x : fly.x;
        let ty = spot ? spot.y : fly.y;
        let top = 560; // px per second
        let agility = 4.6; // rad per second it can turn at speed
        if (fly.state === "air" && fly.wet > 0.25) {
          fly.state = "diving";
          fly.since = t;
          fly.vy = Math.min(fly.vy, -260); // a little hop before the plunge
        }
        if (fly.state === "diving") {
          tx = home.x;
          ty = home.y;
          top = 1100;
          agility = 10;
          if (!wet && t - fly.since > 0.2) fly.state = "air"; // the water went away again mid-dive
          else if (Math.hypot(tx - fly.x, ty - fly.y) < 26 || (t - fly.since > 0.5 && fly.y > ty)) {
            handle.fishEnter();
            fly.state = "water";
          }
        } else {
          fly.y -= scrolled * 0.35; // carried along by the scroll
        }
        // It swims the way a fish does: always forward along its own heading, turning
        // toward where it wants to go. It cannot slide sideways or straight up, so
        // going up or down means nosing round into a climb or a dive, in an arc.
        const dx = tx - fly.x;
        const dy = ty - fly.y;
        const dist = Math.hypot(dx, dy) || 1;
        const launching = fly.state === "air" && t - fly.since < 0.32; // still on the momentum of the leap
        // close enough: stop swimming. It only sets off again once the target has
        // moved well away, so it does not twitch after every small mouse movement.
        fly.resting = false; // on a route it keeps moving
        if (launching) {
          fly.vy += 1500 * dt;
          fly.heading = Math.atan2(fly.vy, fly.vx);
          fly.speed = Math.hypot(fly.vx, fly.vy);
          fly.turn = 0;
        } else if (fly.resting) {
          // hanging in place: it drifts to a stop, levels out, and turns to face the pointer
          const level = Math.PI;
          const settle = Math.atan2(Math.sin(level - fly.heading), Math.cos(level - fly.heading));
          fly.turn += (settle * 2.2 - fly.turn) * Math.min(1, dt * 4);
          fly.heading += fly.turn * dt;
          fly.speed += (0 - fly.speed) * Math.min(1, dt * 3);
          fly.vx = Math.cos(fly.heading) * fly.speed + dx * 1.2; // the last few pixels, as a drift
          fly.vy = Math.sin(fly.heading) * fly.speed + dy * 1.2 + Math.sin(t * 1.5) * 5;
        } else {
          let want = Math.atan2(dy, dx) - fly.heading;
          want = Math.atan2(Math.sin(want), Math.cos(want));
          // slow fish turn tightly, fast ones sweep; and it cannot spin on the spot
          const maxTurn = agility * (0.55 + Math.min(1, fly.speed / 420));
          const turnTo = Math.max(-maxTurn, Math.min(maxTurn, want * 4.2));
          fly.turn += (turnTo - fly.turn) * Math.min(1, dt * 7);
          fly.heading += fly.turn * dt;
          // ease off when the target is behind it, so the loop round is small
          const facing = Math.cos(want);
          const cruise = Math.max(60, Math.min(top, dist * 2.4) * (0.45 + 0.55 * Math.max(0, facing)));
          fly.speed += (cruise - fly.speed) * Math.min(1, dt * (cruise > fly.speed ? 3.2 : 2.2));
          fly.vx = Math.cos(fly.heading) * fly.speed;
          fly.vy = Math.sin(fly.heading) * fly.speed;
        }
        fly.x += fly.vx * dt;
        fly.y += fly.vy * dt;
      }

      const out = fly.state !== "water";
      flyerCanvas.style.opacity = out ? "1" : "0";
      if (!out) return;
      // Seen side-on: which way it faces, and how steeply it is climbing or diving.
      // The nose follows the heading all the way to vertical; the body arches into
      // every change of pitch and curls as it flips from one side to the other.
      const cosH = Math.cos(fly.heading);
      const wasDir = fly.dir;
      if (Math.abs(cosH) > 0.22) fly.dir = cosH < 0 ? Math.PI : 0;
      const pitch = Math.max(-1.5, Math.min(1.5, Math.atan2(-Math.sin(fly.heading), Math.abs(cosH))));
      const pitchRate = Math.max(-9, Math.min(9, (pitch - fly.pitch) / dt));
      fly.pitch = pitch;
      const arch = Math.max(-0.85, Math.min(0.85, pitchRate * 0.14));
      const bend = fly.dir !== wasDir ? 0.5 : 0;
      // long strokes when it has somewhere to go, harder ones in a turn, a lazy fan when it idles
      flyer.pose(fly.dir, pitch, (fly.resting ? 0.45 : 0.7) + Math.min(4.2, fly.speed / 150 + Math.abs(fly.turn) * 0.35), bend, arch);
      flyer.render(t, 0, 0, 0, 0);
      flyerCanvas.style.transform = `translate3d(${(fly.x - FLYER_W / 2).toFixed(1)}px, ${(fly.y - FLYER_H / 2).toFixed(1)}px, 0) scale(${FLYER_SCALE})`;
    };

    // Each tool lands straight below its case: the landing spots are worked out from
    // where the cases are across the page, and again whenever the layout changes.
    let aimedFor = "";
    const aimTools = () => {
      const shelf = document.querySelector<HTMLElement>("[data-tool-shelf]");
      if (!handle || !shelf || !seaWindow) return;
      const vh = window.innerHeight;
      const key = `${window.innerWidth}x${vh}x${document.documentElement.scrollHeight}x${shelf.clientWidth}`;
      if (key === aimedFor) return;
      aimedFor = key;
      const rect = shelf.getBoundingClientRect();
      // the camera has stopped at the sea by the time anything falls (see progressAt)
      handle.aimLandings(TOOL_SLOTS.map((slot) => ({ p: 1, x: rect.left + rect.width * shelfFraction(slot.x) })));
      // and the four project cards float across the right of the hero
      handle.aimWorks([0.56, 0.67, 0.78, 0.9].map((k) => window.innerWidth * k));
    };

    const renderOnce = () => {
      if (!handle) return;
      aimTools();
      const p = progress();
      const k = ease(p);
      wrap.style.backgroundColor = `rgb(${PAPER.map((c, i) => Math.round(c + (DUSK[i] - c) * k)).join(",")})`;
      // The tools leave their shelf once the last window has opened some way under
      // the About sheet, so the shelf is seen whole first: 0 with the window's top
      // edge at 62% of the screen, 1 by the time it reaches 18%.
      if (seaWindow) {
        const vh = window.innerHeight;
        riverBus.drop = Math.min(1, Math.max(0, (vh * 0.62 - seaWindow.getBoundingClientRect().top) / (vh * 0.44)));
      }
      handle.setDrop(riverBus.drop);
      handle.setWorksUp(riverBus.worksUp);
      // One fall for each tool, in screen space: from its case on the shelf to where it
      // floats. The shelf's canvas shows it as far as the bottom edge of the About
      // sheet; this scene, which is what shows below that edge, has it from there.
      const shelf = riverBus.drop > 0 ? document.querySelector<HTMLElement>("[data-tool-shelf]") : null;
      const landings = shelf ? handle.toolLandings() : [];
      if (shelf && landings.length === TOOL_SLOTS.length) {
        const rect = shelf.getBoundingClientRect();
        const unit0 = (SHELF_TOOL_SCALE * rect.width) / SHELF_WIDTH;
        const y0 = rect.top + rect.height * SHELF_TOOL_FRACTION;
        const fall: ToolFall[] = TOOL_SLOTS.map((slot, i) => {
          const k = dropShare(riverBus.drop, i);
          const x0 = rect.left + rect.width * shelfFraction(slot.x);
          const to = landings[i];
          // It comes straight down: its landing spot was put under its own case (see
          // aimTools), so this only takes up what the scene has panned in the meantime.
          const across = k * k * k;
          const shrink = Math.min(1, Math.max(0, (k - 0.35) / 0.65));
          return {
            k,
            x: x0 + (to.x - x0) * across,
            y: y0 + (to.y - y0) * k * k, // falling: slow off the shelf, fast into the water
            unit: unit0 + (to.unit - unit0) * shrink * shrink * (3 - 2 * shrink),
          };
        });
        riverBus.toolFall = fall;
        handle.setToolPath(fall);
      } else {
        riverBus.toolFall = null;
        handle.setToolPath(null);
      }
      const now = still ? 0 : (performance.now() - start) / 1000;
      if (!worldVisible()) {
        updateFlyer(now);
        return;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      handle.setTextZone(textZone());
      // while the mouse is about, the fish in the river keeps under it
      handle.setPointer(!still && now - mouse.at < 5 ? Math.min(window.innerWidth - 60, Math.max(60, mouse.x)) : null);
      handle.render(now, pointer.x, pointer.y, p, 0);
      riverBus.waterY = handle.fishScreen()?.y ?? 0;
      riverBus.runner = handle.runnerScreen();
      riverBus.workSpots = handle.workSpots();
      handle.setRunnerHidden(riverBus.runnerHidden);
      placeNodes();
      updateFlyer(now);
    };
    const loop = () => {
      renderOnce();
      if (running) frame = requestAnimationFrame(loop);
    };
    const resize = () => {
      if (!handle || !wrap.clientWidth || !wrap.clientHeight) return;
      handle.resize(wrap.clientWidth, wrap.clientHeight, 0);
      measureText();
      renderOnce();
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.at = (performance.now() - start) / 1000;
      document.documentElement.style.cursor = overFish(e) ? "pointer" : "";
    };
    // The canvas sits behind the content, so the fish cannot take clicks itself.
    // A click counts when it lands on a window section, near the fish, and not on a control.
    const overFish = (e: MouseEvent) => {
      const target = e.target;
      if (!handle || !(target instanceof Element) || target.closest("a, button, input, textarea, select")) return false;
      if (!target.closest("[data-river-window]")) return false;
      const at = handle.fishScreen();
      return !!at && Math.hypot(e.clientX - at.x, e.clientY - at.y) < FISH_REACH;
    };
    const onClick = (e: MouseEvent) => {
      if (overFish(e)) handle?.jump();
    };
    let scrollFrame = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(renderOnce);
    };
    const onVisibility = () => {
      const was = running;
      running = !still && !document.hidden;
      if (running && !was) frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(resize);

    import("./scene3d/build")
      .then(({ createScene }) => {
        if (disposed) return;
        handle = createScene("hero", canvas);
        if (flyerCanvas && !still) {
          flyer = createScene("fish", flyerCanvas);
          flyer.resize(FLYER_W, FLYER_H, 0);
        }
        jumpRef.current = () => handle?.jump();
        // dev only: lets the world be rendered at an exact time and progress from the console
        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __river?: SceneHandle }).__river = handle;
        }
        resize();
        resizeObserver.observe(wrap);
        if (still) {
          window.addEventListener("scroll", onScroll, { passive: true });
        } else {
          window.addEventListener("pointermove", onPointer, { passive: true });
          window.addEventListener("click", onClick);
          document.addEventListener("visibilitychange", onVisibility);
          window.addEventListener("scroll", onSnapScroll, { passive: true });
          window.addEventListener("wheel", onSnapInput, { passive: true });
          window.addEventListener("touchstart", onSnapInput, { passive: true });
          window.addEventListener("keydown", onSnapInput);
          onVisibility();
        }
      })
      .catch(() => {
        // no WebGL: the page stands on its layout alone, and the stages become a plain list
        stretch?.setAttribute("data-river-static", "");
      });

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onSnapScroll);
      window.removeEventListener("wheel", onSnapInput);
      window.removeEventListener("touchstart", onSnapInput);
      window.removeEventListener("keydown", onSnapInput);
      window.clearTimeout(snapTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.style.cursor = "";
      handle?.dispose();
      flyer?.dispose();
    };
  }, []);

  return (
    <>
      <div ref={wrapRef} className={className} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <canvas ref={flyerRef} className={flyerClassName} aria-hidden="true" />
      {/* keyboard and screen-reader route to the same leap; shown only when focused */}
      {buttonClassName && (
        <button type="button" className={buttonClassName} onClick={() => jumpRef.current()}>
          Make the fish jump
        </button>
      )}
    </>
  );
}
