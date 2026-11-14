'use client';

// Mei, from the river into the About section, in one unbroken move.
//
// In the river scene the boardwalk ends in a jetty that runs out toward the viewer,
// so she comes running at the screen. When the About sheet comes up to her feet,
// this overlay takes her over: a small canvas placed exactly over the runner,
// drawing the same figure the same size. As the page scrolls on, the canvas travels
// and grows into the portrait frame while the camera inside it closes in, ending
// on her head and shoulders: one run toward the screen, with no turn. Scrolling
// back plays it in reverse and hands her back to the scene.
//
// The drawing hides her photograph. Passing the cursor over her scans it: under
// the cursor the drawing's pixels break off and scatter, and the photo shows
// through the hole, which closes again a moment after the cursor has moved on.
// Focusing the frame with the keyboard, or tapping it, clears the whole drawing.
// The photo is a cut-out, so she stands in the same frame, on the same page.

import { useEffect, useRef } from "react";
import { portraitCrop, portraitPhoto } from "./content";
import { riverBus } from "./riverBus";
import s from "./river.module.css";
import type { SceneHandle } from "./scene3d/build";

// how the far framing is laid out: her feet sit this far down the canvas and she is this tall in it
const FEET = 0.744;
const BODY = 0.5;
const TRAVEL = 400; // px of scroll over which she goes from the boardwalk to the frame

const CELL = 6; // css px: the scan clears the drawing in squares this size
const BRUSH = 44; // css px: how far round the cursor the scan reaches
const SPILL = 160; // css px: the canvas reaches this far past the frame, so loose pixels can fly out of it
const HOLD = 1.7; // a cleared square stays open this long (in decay units) before it closes
type Mote = { x: number; y: number; vx: number; vy: number; life: number; span: number; dark: boolean };

export default function Portrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLCanvasElement>(null);

  // the scan: squares of the drawing clear under the cursor and show the photograph
  useEffect(() => {
    const frame = frameRef.current;
    const canvas = revealRef.current;
    if (!frame || !canvas || !portraitPhoto) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.src = portraitPhoto;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paper = getComputedStyle(frame).getPropertyValue("--section-bg").trim() || "#eae9e3";
    const layer = document.createElement("canvas"); // the photograph, laid out as it sits in the frame
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let open = new Float32Array(0); // per square: above its threshold the photo shows
    let edge = new Float32Array(0); // per square: its own threshold, so the hole has a ragged, dithered rim
    let solid = new Uint8Array(0); // per square: is she there (rather than empty page)
    let motes: Mote[] = [];
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, inside: false };
    let all = false; // keyboard focus or a tap: clear everything
    let raf = 0;
    let last = 0;

    const layout = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = frame.clientWidth;
      const ch = frame.clientHeight;
      if (!cw || !ch || !img.complete || !img.naturalWidth) return false;
      const w = Math.round(cw * dpr);
      const h = Math.round(ch * dpr);
      if (layer.width === w && layer.height === h && cols) return true;
      layer.width = w;
      layer.height = h;
      canvas.width = w + Math.round(SPILL * dpr) * 2;
      canvas.height = h + Math.round(SPILL * dpr) * 2;
      const scale = w / portraitCrop.width;
      const lctx = layer.getContext("2d");
      if (!lctx) return false;
      lctx.clearRect(0, 0, w, h);
      lctx.drawImage(img, -portraitCrop.x * scale, -portraitCrop.y * scale, img.naturalWidth * scale, img.naturalHeight * scale);
      cols = Math.ceil(cw / CELL);
      rows = Math.ceil(ch / CELL);
      open = new Float32Array(cols * rows);
      edge = new Float32Array(cols * rows);
      solid = new Uint8Array(cols * rows);
      for (let i = 0; i < edge.length; i++) {
        const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
        edge[i] = 0.06 + (n - Math.floor(n)) * 0.5;
      }
      // where she is: the photo's own alpha, one sample per square
      const probe = document.createElement("canvas");
      probe.width = cols;
      probe.height = rows;
      const pctx = probe.getContext("2d", { willReadFrequently: true });
      if (pctx) {
        pctx.drawImage(layer, 0, 0, w, h, 0, 0, cw / CELL, ch / CELL);
        const data = pctx.getImageData(0, 0, cols, rows).data;
        for (let i = 0; i < solid.length; i++) solid[i] = data[i * 4 + 3] > 60 ? 1 : 0;
      }
      return true;
    };

    const step = (now: number) => {
      raf = 0;
      if (!layout()) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      let busy = pointer.inside || all;
      // the cursor clears the squares round it, and knocks a pixel loose from each one it opens
      if (pointer.inside) {
        const c0 = Math.max(0, Math.floor((pointer.x - BRUSH) / CELL));
        const c1 = Math.min(cols - 1, Math.floor((pointer.x + BRUSH) / CELL));
        const r0 = Math.max(0, Math.floor((pointer.y - BRUSH) / CELL));
        const r1 = Math.min(rows - 1, Math.floor((pointer.y + BRUSH) / CELL));
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const cx = (c + 0.5) * CELL;
            const cy = (r + 0.5) * CELL;
            const d = Math.hypot(cx - pointer.x, cy - pointer.y) / BRUSH;
            if (d >= 1) continue;
            const i = r * cols + c;
            const was = open[i];
            open[i] = Math.max(was, HOLD * (1 - d * d * 0.7));
            if (!still && was <= edge[i] && solid[i] && motes.length < 700 && Math.random() < 0.55) {
              const away = Math.atan2(cy - pointer.y, cx - pointer.x) + (Math.random() - 0.5) * 1.2;
              const speed = 50 + Math.random() * 150;
              motes.push({
                x: cx,
                y: cy,
                vx: Math.cos(away) * speed + pointer.vx * 0.25,
                vy: Math.sin(away) * speed + pointer.vy * 0.25 - 30,
                life: 0,
                span: 0.45 + Math.random() * 0.5,
                dark: Math.random() < 0.7,
              });
            }
          }
        }
      }
      pointer.vx *= 0.8;
      pointer.vy *= 0.8;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(Math.round(SPILL * dpr), Math.round(SPILL * dpr)); // the frame's own corner
      const cs = CELL * dpr;
      for (let i = 0; i < open.length; i++) {
        let v = open[i];
        if (all) v = Math.min(HOLD, v + dt * 4);
        else if (v > 0) v = Math.max(0, v - dt);
        open[i] = v;
        if (v <= 0) continue;
        busy = true;
        if (v <= edge[i]) continue;
        const x = (i % cols) * cs;
        const y = Math.floor(i / cols) * cs;
        ctx.fillStyle = paper; // hide the drawing here…
        ctx.fillRect(x, y, cs, cs);
        ctx.drawImage(layer, x, y, cs, cs, x, y, cs, cs); // …and show her
      }
      // the loose pixels fly off, slow down, fall a little and shrink away
      if (motes.length) {
        busy = true;
        motes = motes.filter((m) => m.life < m.span);
        for (const m of motes) {
          m.life += dt;
          m.vx *= 1 - dt * 2.4;
          m.vy = m.vy * (1 - dt * 2.4) + 220 * dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          const k = 1 - m.life / m.span;
          const size = Math.max(1, Math.round((k > 0.5 ? 4 : 2) * dpr)); // steps, not a fade: they are pixels
          ctx.fillStyle = m.dark ? "#222222" : "#a5a5a5";
          ctx.fillRect(Math.round(m.x * dpr), Math.round(m.y * dpr), size, size);
        }
      }
      if (busy) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const at = (e: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (pointer.inside) {
        pointer.vx = (x - pointer.x) * 60;
        pointer.vy = (y - pointer.y) * 60;
      }
      pointer.x = x;
      pointer.y = y;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      at(e);
      pointer.inside = true;
      kick();
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      all = !all; // a tap clears her, a second tap draws her again
      kick();
    };
    const onFocus = () => {
      if (!frame.matches(":focus-visible")) return;
      all = true;
      kick();
    };
    const onBlur = () => {
      all = false;
      kick();
    };
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("focus", onFocus);
    frame.addEventListener("blur", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("focus", onFocus);
      frame.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const section = frame?.closest("section");
    if (!frame || !canvas || !section) return;
    let handle: SceneHandle | null = null;
    let disposed = false;
    let raf = 0;
    const look = { x: 0, y: 0 };
    const size = { w: 0, h: 0 };
    let lastRunner = riverBus.runner;
    let heldX: number | null = null; // where she was across the screen when the overlay took her over
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const ease = (v: number) => v * v * (3 - 2 * v);

    const tick = () => {
      if (!handle) return;
      const vh = window.innerHeight;
      const top = section.getBoundingClientRect().top; // the edge of the About sheet
      const to = frame.getBoundingClientRect();
      if (riverBus.runner) lastRunner = riverBus.runner;
      const runner = lastRunner;
      // 0 until the sheet reaches her feet, then up to 1 as it carries on rising
      let q = top >= vh ? 0 : runner ? (runner.feetY - top) / TRAVEL : 1;
      if (still) q = top < vh * 0.9 ? 1 : 0;
      q = Math.min(1, Math.max(0, q));
      riverBus.runnerHidden = q > 0;
      frame.toggleAttribute("data-ready", q >= 1); // she has arrived: the invitation to scan her can show
      // the camera keeps panning after the handoff; she should not slide sideways with the scenery
      if (q <= 0) heldX = null;
      else if (q < 0.15 && runner) heldX = runner.x; // taken at the handoff itself; a jump straight past it falls back to where she is now
      if (q <= 0 || to.bottom < -200 || to.top > vh + 200) {
        canvas.style.opacity = "0";
        return;
      }
      canvas.style.opacity = "";
      // start: a box drawn round the runner so the figure inside lands exactly on her
      const bodyPx = runner ? Math.max(40, runner.feetY - runner.headY) : 120;
      const h0 = bodyPx / BODY;
      const w0 = h0 * (to.width / to.height);
      const x0 = (heldX ?? (runner ? runner.x : to.left + to.width / 2)) - w0 / 2;
      const y0 = (runner ? runner.feetY : to.top) - h0 * FEET;
      const k = ease(q);
      const w = w0 + (to.width - w0) * k;
      const h = h0 + (to.height - h0) * k;
      const x = x0 + (to.left - x0) * k;
      // she is already running at the screen, so the frame simply carries on along her line
      const y = y0 + (to.top - y0) * k;
      if (Math.abs(w - size.w) >= 2 || Math.abs(h - size.h) >= 2) {
        size.w = w;
        size.h = h;
        handle.resize(w, h, 0); // keeps the pixels the same size as the scene's, whatever the canvas size
      }
      canvas.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      handle.setPortrait(q, look.x, look.y);
      handle.render(still ? 0 : (performance.now() - start) / 1000, 0, 0, 0, 0);
    };
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    const onPointer = (e: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      look.x = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth * 0.35)));
      look.y = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height * 0.35)) / (window.innerHeight * 0.4)));
    };
    const onScroll = () => tick();

    import("./scene3d/build")
      .then(({ createScene }) => {
        if (disposed) return;
        handle = createScene("portrait", canvas);
        if (still) {
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          tick();
        } else {
          window.addEventListener("pointermove", onPointer, { passive: true });
          raf = requestAnimationFrame(loop);
        }
      })
      .catch(() => {
        /* no WebGL: the frame stays empty and the photograph, if any, still shows on hover */
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      riverBus.runnerHidden = false;
      handle?.dispose();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={s.portrait}
      tabIndex={0}
      role="img"
      aria-label="Mei, drawn as a traveller with a wavy shoulder-length bob. Move the cursor over the drawing to see her photograph."
    >
      <canvas ref={canvasRef} className={s.portraitCanvas} aria-hidden="true" />
      {portraitPhoto && <canvas ref={revealRef} className={s.portraitReveal} aria-hidden="true" />}
      {portraitPhoto && (
        <>
          {/* a scan line that passes over her now and then, until the visitor takes over */}
          <span className={s.portraitScan} aria-hidden="true" />
          <p className={s.portraitHint} aria-hidden="true">
            <i />
            <span className={s.hintHover}>Scan me with your cursor</span>
            <span className={s.hintTouch}>Tap to see me</span>
          </p>
        </>
      )}
    </div>
  );
}
