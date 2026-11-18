'use client';

import { useEffect, useRef, useState } from 'react';

/* The scripted cursor behind the auto-played demos (the same pattern as the DEF ERP
   live demos and the practice ladder): steps play one at a time while the stage is
   in view; a pointer over the stage hands it to the visitor. */

export type Helpers = {
  wait: (ms: number) => Promise<void>;
  /** The first element under the demo's root matching `selector`, optionally by its text. */
  find: (selector: string, text?: string) => HTMLElement;
  click: (el: HTMLElement) => Promise<void>;
  type: (el: HTMLElement, text: string) => Promise<void>;
  /** Press, drag sideways by `dx` screen pixels, and let go. */
  drag: (el: HTMLElement, dx: number) => Promise<void>;
};
export type Scripted = { seconds: number; script: (h: Helpers) => Promise<void> };
export type Cursor = { x: number; y: number; down: boolean; drag?: boolean };

/** Bring `el` into view inside the nearest scrolling pane of the demo, never the page. */
function reveal(el: HTMLElement) {
  const pane = el.closest<HTMLElement>('[data-scroll]');
  if (!pane) return;
  const r = el.getBoundingClientRect();
  const p = pane.getBoundingClientRect();
  const scale = p.height / pane.clientHeight || 1;
  if (r.bottom > p.bottom - 8) pane.scrollTop += (r.bottom - p.bottom) / scale + 24;
  else if (r.top < p.top + 8) pane.scrollTop -= (p.top - r.top) / scale + 24;
}

export function useAutoplay<T extends Scripted>(items: T[], root: string) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState({ value: 0, ms: 0 });
  const [driving, setDriving] = useState(false);
  const [run, setRun] = useState(0);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [toast, setToast] = useState(false);
  const [visible, setVisible] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number>(undefined);
  const autoRef = useRef(auto);
  useEffect(() => { autoRef.current = auto; }, [auto]);
  const item = items[active];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(stage.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (driving || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const token = { stop: false };
    const total = item.seconds * 1000;
    let spent = 0;
    const advance = (ms: number) => { spent += ms; setProgress({ value: Math.min(0.97, spent / total), ms }); };
    const sleep = (ms: number) => new Promise<void>((res, rej) => setTimeout(() => (token.stop ? rej(new Error('stop')) : res()), ms));
    const base = () => stage.current!.querySelector<HTMLElement>(root)!;
    const point = async (el: HTMLElement) => {
      if (!el) throw new Error('target not found');
      reveal(el);
      await sleep(60);
      const r = el.getBoundingClientRect();
      const w = stage.current!.getBoundingClientRect();
      const x = r.left - w.left + Math.min(r.width / 2, 90);
      const y = r.top - w.top + r.height / 2;
      setCursor({ x, y, down: false });
      await sleep(700);
      return { x, y };
    };
    const press = (el: HTMLElement) => {
      const init = { bubbles: true, cancelable: true, button: 0, clientX: 0, clientY: 0 };
      for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
        el.dispatchEvent(type.startsWith('pointer') ? new PointerEvent(type, { ...init, pointerType: 'mouse', pointerId: 1, isPrimary: true }) : new MouseEvent(type, init));
      }
    };
    const h: Helpers = {
      wait: (ms) => { advance(ms); return sleep(ms); },
      find: (selector, text) => {
        if (selector === root) return base();
        const el = [...base().querySelectorAll<HTMLElement>(selector)].find((e) => !text || e.textContent?.trim() === text || e.textContent?.trim().startsWith(text) || e.getAttribute('aria-label') === text);
        if (!el) throw new Error(`missing ${selector} ${text ?? ''}`);
        return el;
      },
      click: async (el) => {
        advance(1000);
        const { x, y } = await point(el);
        setCursor({ x, y, down: true });
        await sleep(120);
        press(el);
        if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) el.focus({ preventScroll: true });
        setCursor({ x, y, down: false });
        await sleep(180);
      },
      drag: async (el, dx) => {
        advance(2200);
        reveal(el);
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height * 0.55;
        const w = stage.current!.getBoundingClientRect();
        setCursor({ x: cx - w.left, y: cy - w.top, down: false });
        await sleep(700);
        const fire = (type: string, x: number) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: cy, pointerType: 'mouse', pointerId: 1, isPrimary: true }));
        setCursor({ x: cx - w.left, y: cy - w.top, down: true, drag: true });
        fire('pointerdown', cx);
        await sleep(160);
        const steps = 14;
        for (let i = 1; i <= steps; i += 1) {
          const k = i / steps, x = cx + dx * (1 - (1 - k) * (1 - k));
          fire('pointermove', x);
          setCursor({ x: x - w.left, y: cy - w.top, down: true, drag: true });
          await sleep(40);
        }
        await sleep(120);
        fire('pointerup', cx + dx);
        setCursor({ x: cx + dx - w.left, y: cy - w.top, down: false });
        await sleep(500);
      },
      type: async (el, text) => {
        advance(text.length * 70);
        const proto = el instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
        const set = Object.getOwnPropertyDescriptor(proto, 'value')!.set!;
        let value = (el as HTMLInputElement).value;
        for (const ch of text) {
          value += ch;
          set.call(el, value);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          await sleep(70);
        }
      },
    };
    (async () => {
      setProgress({ value: 0, ms: 0 });
      await sleep(400);
      const w = stage.current!.getBoundingClientRect();
      setCursor({ x: w.width * 0.82, y: w.height * 0.8, down: false });
      await sleep(500);
      await item.script(h);
      setProgress({ value: 1, ms: 300 });
      await sleep(700);
      setCursor(null);
      if (autoRef.current) { setActive((a) => (a + 1) % items.length); setRun((r) => r + 1); }
    })().catch((e: Error) => { if (e.message !== 'stop') console.warn('[memq demo]', e.message); });
    return () => { token.stop = true; setCursor(null); };
  }, [active, run, driving, visible, item, items, root]);

  const go = (i: number) => { setAuto(false); setActive(i); setRun((r) => r + 1); setProgress({ value: 0, ms: 0 }); };
  const takeOver = () => {
    if (driving) return;
    setDriving(true);
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 2200);
  };
  const handBack = () => { setDriving(false); setRun((r) => r + 1); };

  return { active, item, progress, driving, run, cursor, toast, stage, go, takeOver, handBack };
}
