'use client';

// The bridge from the hero to Selected Work. The four featured projects float in
// the hero's river as small cards: they are part of the river scene there, standing
// half in the water and going with it, like the tools at sea (scene3d/build.ts).
// As the page scrolls they rise out of the water and square up; once a card is
// clear of the water this overlay takes it over, at the same place and size, and
// flies it to its place in the grid, growing to the size of its card. The real card
// is not there before it: it appears as its 3D card lands, over the top of it.
// Scrolling back plays it in reverse.
//
// The overlay is one canvas fixed over the viewport, above the Work sheet and under
// its cards. The scene and this component talk through riverBus: this one says how
// far each card has risen (worksUp); the scene says where each is on screen (workSpots).

import { useEffect, useRef } from "react";
import { riverBus } from "./riverBus";
import s from "./river.module.css";
import type { SceneHandle, WorkCard } from "./scene3d/build";

const SHAPE = 0.72; // width : height of a card, close to the real cards'
const TILT = [-0.05, 0.04, -0.03, 0.05]; // a card in the air is not quite straight

export default function WorkFloaters() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const work = document.querySelector<HTMLElement>("#work");
    if (!canvas || !work) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // the cards simply are where they are
    const places = TILT.map((_, i) => document.querySelector<HTMLElement>(`[data-work-card="${i}"]`));
    const ease = (v: number) => v * v * (3 - 2 * v);
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const mix = (a: number, b: number, k: number) => a + (b - a) * k;
    const start = performance.now();
    let handle: SceneHandle | null = null;
    let disposed = false;
    let raf = 0;
    const size = { w: 0, h: 0 };
    const release = () => places.forEach((el) => el && (el.style.opacity = "")); // the real cards, as the stylesheet has them

    const leave = () => {
      canvas.style.visibility = "hidden";
      riverBus.worksUp = null; // the scene puts its floating cards away
      release();
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!handle) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // no river on screen yet, or a narrow screen: the page is as it would be without this
      if (!riverBus.waterY || vw < 900) {
        leave();
        return;
      }
      const t = (performance.now() - start) / 1000;
      const lift = clamp(window.scrollY / (vh * 0.5)); // out of the water over the first half screen of scroll
      const spots = riverBus.workSpots;
      const ups: number[] = [];
      let busy = false;
      const cards: WorkCard[] = TILT.map((tilt, i) => {
        const place = places[i];
        const cue = places[i % 2] ?? place; // the second row is timed from the card above it, and follows it
        const spot = spots?.[i];
        const up = ease(clamp(lift * 1.3 - i * 0.08));
        ups.push(up);
        if (!place || !cue || !spot) return { x: 0, y: 0, w: 1, h: 1, turn: 0, visible: false };
        const to = place.getBoundingClientRect();
        // 0 while its card is still below the screen, 1 once the card's top is well into view
        // (all four have landed by the time the section sits at the top of the screen, where the Work link stops)
        const land = clamp((vh * 0.98 - cue.getBoundingClientRect().top) / (vh * 0.42) - (i >= 2 ? 0.15 : 0) - (i % 2) * 0.05);
        const go = ease(land);
        const grow = Math.pow(go, 1.25);
        place.style.opacity = land >= 1 ? "" : clamp((land - 0.72) / 0.28).toFixed(2); // the real card arrives with it
        // in the air it hangs where the scene left it, breathing a little, until its place comes up
        const hover = Math.sin(t * 0.9 + i * 2.1) * 5 * (1 - go);
        const flying = up >= 1 && land < 1; // before that the scene draws it, in the water
        if (flying) busy = true;
        return {
          x: mix(spot.x, to.left + to.width / 2, go),
          y: mix(spot.y + hover, to.top + to.height / 2, go),
          w: mix(spot.h * SHAPE, to.width, grow),
          h: mix(spot.h, to.height, grow),
          turn: (tilt + Math.sin(t * 0.8 + i) * 0.02) * (1 - go),
          visible: flying,
        };
      });
      riverBus.worksUp = ups;
      if (!busy) {
        canvas.style.visibility = "hidden"; // nothing in the air: all afloat, or all landed
        return;
      }
      canvas.style.visibility = "visible";
      if (vw !== size.w || vh !== size.h) {
        size.w = vw;
        size.h = vh;
        handle.resize(vw, vh, 0);
      }
      handle.setWorkCards(cards);
      handle.render(t, 0, 0, 0, 0);
    };

    import("./scene3d/build")
      .then(({ createScene }) => {
        if (disposed) return;
        handle = createScene("works", canvas);
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {
        /* no WebGL: the cards are simply in their grid */
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      riverBus.worksUp = null;
      release();
      handle?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={s.floaters} aria-hidden="true" />;
}
