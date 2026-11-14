'use client';

// The tools Mei works with, as a shelf of small objects in display cases, in
// three groups. Each object is a blocky take on the tool's mark, drawn with the
// same dithered rendering as the river scene (scene3d/build.ts).
//
// The names and group headings are ordinary text laid out from the same slot
// positions the 3D shelf uses, so each name sits under its own case. As the page
// scrolls on, the objects drop out of their cases; the river scene catches the
// same drop and floats them in the sea below (see riverBus.drop).

import { useEffect, useRef } from "react";
import { riverBus } from "./riverBus";
import s from "./river.module.css";
import type { SceneHandle } from "./scene3d/build";
import { SHELF_SLOT, TOOL_GROUPS, TOOL_SLOTS, shelfFraction } from "./scene3d/toolLayout";

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

export default function ToolShelf() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    let handle: SceneHandle | null = null;
    let disposed = false;
    let raf = 0;
    let visible = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    // the canvas carries on below the frame to the bottom of the About sheet, so a tool
    // falling off the shelf is seen all the way to the edge where the river takes over
    const section = frame.closest("section");
    const below = () => (section ? Math.max(0, Math.round(section.getBoundingClientRect().bottom - frame.getBoundingClientRect().bottom)) : 0);
    let extra = -1;
    const renderOnce = () => {
      if (!handle) return;
      handle.setDrop(riverBus.drop);
      const fall = riverBus.toolFall;
      if (fall) {
        const rect = frame.getBoundingClientRect();
        handle.setToolPath(fall.map((f) => ({ ...f, x: f.x - rect.left, y: f.y - rect.top })));
      } else handle.setToolPath(null);
      handle.render(still ? 0 : (performance.now() - start) / 1000, 0, 0, 0, 0);
    };
    const loop = () => {
      renderOnce();
      if (visible && !still) raf = requestAnimationFrame(loop);
    };
    const resize = () => {
      if (!handle || !frame.clientWidth || !frame.clientHeight) return;
      extra = below();
      handle.resize(frame.clientWidth, frame.clientHeight + extra, extra);
      renderOnce();
    };
    const resizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !still) raf = requestAnimationFrame(loop);
    });
    const onScroll = () => {
      if (still) renderOnce();
    };

    import("./scene3d/build")
      .then(({ createScene }) => {
        if (disposed) return;
        handle = createScene("tools", canvas);
        resize();
        resizeObserver.observe(frame);
        viewObserver.observe(canvas); // the canvas, not the frame: it reaches further down
        window.addEventListener("scroll", onScroll, { passive: true });
      })
      .catch(() => {
        /* no WebGL: the names below still list every tool */
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      handle?.dispose();
    };
  }, []);

  return (
    <div className={s.shelf}>
      {/* group headings, each spanning the cases it covers */}
      <div className={s.shelfGroups}>
        {TOOL_GROUPS.map((group, g) => {
          const slots = TOOL_SLOTS.filter((slot) => slot.group === g);
          const left = shelfFraction(slots[0].x) - SHELF_SLOT / 2;
          const right = shelfFraction(slots[slots.length - 1].x) + SHELF_SLOT / 2;
          return (
            <h4 key={group.title} className={s.shelfGroup} style={{ left: pct(left), width: pct(right - left) }}>
              {group.title}
            </h4>
          );
        })}
      </div>
      <div ref={frameRef} className={s.shelfFrame} data-tool-shelf aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <ul className={s.shelfNames}>
        {TOOL_SLOTS.map((slot) => (
          <li key={slot.id} style={{ left: pct(shelfFraction(slot.x)) }}>
            {slot.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
