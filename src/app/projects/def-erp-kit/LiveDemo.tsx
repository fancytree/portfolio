'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './DesignSystemShowcase.module.css';

type Win = Window & typeof globalThis;

/**
 * Keep the framed page's own scrolling inside the frame. A same-origin frame's
 * scrollIntoView() and focus() also scroll the host page, which moves the demo off screen.
 */
function contain(view: Win | null) {
  if (!view) return;
  const proto = view.Element.prototype as Element & { __contained?: boolean };
  if (proto.__contained) return;
  proto.__contained = true;
  const scrollWithin = (el: Element, block: ScrollLogicalPosition = 'start', behavior: ScrollBehavior = 'auto') => {
    const r = el.getBoundingClientRect();
    let box = el.parentElement;
    while (box) {
      const flow = view.getComputedStyle(box).overflowY;
      if ((flow === 'auto' || flow === 'scroll') && box.scrollHeight > box.clientHeight + 1) break;
      box = box.parentElement;
    }
    const top = box ? box.getBoundingClientRect().top : 0;
    const height = box ? box.clientHeight : view.innerHeight;
    const margin = parseFloat(view.getComputedStyle(el).scrollMarginTop) || 0;
    const offset = r.top - top;
    if (block === 'nearest' && offset >= 0 && offset + r.height <= height) return;
    const delta = block === 'center' ? offset - (height - r.height) / 2
      : block === 'end' || (block === 'nearest' && offset > 0) ? offset - height + r.height
      : offset - margin;
    (box ?? view).scrollBy({ top: delta, behavior });
  };
  proto.scrollIntoView = function scrollIntoView(this: Element, arg?: boolean | ScrollIntoViewOptions) {
    const options = typeof arg === 'object' ? arg : {};
    scrollWithin(this, options.block ?? (arg === false ? 'end' : 'start'), options.behavior);
  };
  const focus = view.HTMLElement.prototype.focus;
  view.HTMLElement.prototype.focus = function focusWithin(this: HTMLElement, options?: FocusOptions) {
    focus.call(this, { ...options, preventScroll: true });
    if (!options?.preventScroll && this.isConnected) scrollWithin(this, 'nearest');
  };
}

/** Measured length of each script, from its last complete run. */
const learned = new Map<unknown, number>();


export type Helpers = {
  say: (text: string) => void;
  wait: (ms: number) => Promise<void>;
  find: (selector: string, text?: string) => HTMLElement;
  all: (selector: string) => HTMLElement[];
  /** The innermost element whose own text starts with the given words. */
  leaf: (text: string) => HTMLElement;
  /** Hand a file to a file input, as if the visitor had dropped it. */
  upload: (input: HTMLElement, fileName: string) => Promise<void>;
  click: (el: HTMLElement) => Promise<void>;
  hover: (el: HTMLElement) => Promise<void>;
  /** Move the camera in on an element; while zoomed, the camera follows the cursor. */
  zoom: (el: HTMLElement, level?: number) => Promise<void>;
  /** Pull the camera back to the whole page. */
  zoomOut: () => Promise<void>;
  /** Click without moving the cursor: for quietly bringing the page to a starting state. */
  tap: (el: HTMLElement) => Promise<void>;
  /** Choose an option in an open select (these respond to the keyboard, not synthetic pointer events). */
  pick: (el: HTMLElement) => Promise<void>;
  type: (el: HTMLElement, text: string) => Promise<void>;
  /** Leave a field, so the page applies what was entered. */
  commit: (el: HTMLElement) => Promise<void>;
  /** Set a field's whole value at once, for inputs such as dates that reject partial text. */
  fill: (el: HTMLElement, value: string) => Promise<void>;
};
export type Script = (h: Helpers) => Promise<void>;

/**
 * A real, same-origin product page driven by a scripted cursor. The moment the visitor's pointer
 * enters, the script stops and the page is theirs; it resets and replays when they leave.
 */
export default function LiveDemo({ src, title, script, label, onDriving, onDone, onProgress, prepare, storage, resetKey = 0, estimateMs = 20000, baseWidth = 1100, ready = '[data-nav]', loop = false }: {
  src: string; title: string; script: Script;
  /** Text in the window's title pill. */
  label: string;
  /** Tells the parent when the visitor takes over or hands back. */
  onDriving?: (driving: boolean) => void;
  /** Reports the point the script will reach, 0 to 1, and how long it takes to get there, so a bar can glide. */
  onProgress?: (fraction: number, overMs: number) => void;
  /** Changing this reloads the page even when `src` stays the same. */
  resetKey?: number;
  /** First-run guess at the script's length; later runs use the measured length. */
  estimateMs?: number;
  /** Called when the script has played to the end. */
  onDone?: () => void;
  /** Runs once in the loaded page before anything is shown, e.g. to set its layout. */
  prepare?: (doc: Document) => void;
  /** Storage the framed app reads on start, written before it loads (e.g. a collapsed sidebar). */
  storage?: Record<string, string>;
  /** Layout width the page is rendered at before it is scaled to fit. */
  baseWidth?: number;
  /** Selector that exists once the page can be driven. */
  ready?: string;
  /** Reload and replay after the script ends. */
  loop?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const toastTimer = useRef<number>(undefined);
  const [cursor, setCursor] = useState<{ x: number; y: number; down: boolean } | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, z: 1 });
  const cameraRef = useRef(1);
  /** Centre the camera on a point in view coordinates, without showing past the page edges. */
  const aim = (cx: number, cy: number, z: number) => {
    const el = wrap.current;
    cameraRef.current = z;
    if (!el || z <= 1) { setCamera({ x: 0, y: 0, z: 1 }); return; }
    const W = el.clientWidth;
    const H = el.clientHeight;
    const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
    setCamera({ x: clamp(W / 2 - cx * z, W - W * z), y: clamp(H / 2 - cy * z, H - H * z), z });
  };
  const [driving, setDriving] = useState(false);
  const [toast, setToast] = useState(false);
  const [run, setRun] = useState(0);
  const doneRef = useRef(onDone);
  const progressRef = useRef(onProgress);
  useEffect(() => { doneRef.current = onDone; progressRef.current = onProgress; }, [onDone, onProgress]);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);

  // The page is laid out at desktop width and scaled to fit, like a screenshot that still works.
  useEffect(() => {
    const el = wrap.current!;
    const fit = () => { const next = Math.min(1, el.clientWidth / baseWidth); scaleRef.current = next; setScale(next); };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  // Load and run only while on screen.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  // Each (re)load starts clean: the embedded app keeps its open tabs in demo-scoped storage,
  // so it is cleared strictly before the frame is created, never while the app is running.
  const frameKey = `${run}:${src}:${resetKey}`;
  const [armed, setArmed] = useState<string | null>(null);
  const clearedFor = useRef<string | null>(null);
  useEffect(() => {
    // Only ever clear before a frame is created; clearing under a running app breaks its tabs.
    if (!visible || clearedFor.current === frameKey) return;
    clearedFor.current = frameKey;
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('portfolio-demo:')).forEach((k) => localStorage.removeItem(k));
      Object.entries(storage ?? {}).forEach(([k, v]) => localStorage.setItem(k, v));
    } catch { /* storage unavailable */ }
    // The frame may only exist after storage is cleared, so this ordering has to live in an effect.
    setArmed(frameKey);
  }, [frameKey, visible, storage]);
  const live = armed === frameKey;
  // The frame stays invisible until the page is ready and set up, so no setup step is ever seen.
  const [shownFor, setShownFor] = useState<string | null>(null);
  const shown = shownFor === `${frameKey}|${src}`;


  useEffect(() => {
    if (driving || !visible || !live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const token = { stop: false };
    let lastSaid = '';

    // While the script plays, the host page only scrolls when the visitor scrolls it.
    // Anything else (focus, anchoring, a framed scrollIntoView) is put back.
    let userAt = 0;
    let rest = window.scrollY;
    const mark = () => { userAt = Date.now(); };
    const onScroll = () => {
      // A guided tour moving the page counts as intended scrolling.
      if (document.documentElement.dataset.guidedScroll !== undefined) { rest = window.scrollY; return; }
      if (Date.now() - userAt < 1000) { userAt = Date.now(); rest = window.scrollY; return; }
      if (Math.abs(window.scrollY - rest) > 1) window.scrollTo({ top: rest, behavior: 'instant' });
    };
    const userEvents = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const;
    userEvents.forEach((type) => window.addEventListener(type, mark, { passive: true, capture: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    // Every action announces how long it will take, so the bar moves continuously instead of in jumps.
    // The total is learned from the last full run of this script; before that, the caller's estimate.
    const total = learned.get(script) ?? estimateMs;
    let spent = 0;
    const advance = (ms: number) => {
      spent += ms;
      progressRef.current?.(Math.min(0.97, spent / total), ms);
    };
    progressRef.current?.(0, 0);
    const sleep = (ms: number) => new Promise<void>((resolve, reject) => setTimeout(() => (token.stop ? reject(new Error('stop')) : resolve()), ms));
    const doc = () => frame.current!.contentDocument!;
    const win = () => frame.current!.contentWindow as Win;

    /** Bring the target into view inside the frame, then glide the cursor onto it. */
    const point = async (el: HTMLElement) => {
      if (!el) throw new Error('target not found');
      // Scroll only the container a visitor would scroll. scrollIntoView also shifts
      // overflow-hidden app shells, which pushes the whole page up and leaves a blank band.
      const before = el.getBoundingClientRect();
      const h = frame.current!.clientHeight;
      if (before.top < 60 || before.bottom > h - 60) {
        const view = win();
        let box: HTMLElement | null = el.parentElement;
        while (box) {
          const flow = view.getComputedStyle(box).overflowY;
          if ((flow === 'auto' || flow === 'scroll') && box.scrollHeight > box.clientHeight + 1) break;
          box = box.parentElement;
        }
        if (box) {
          const edge = box.getBoundingClientRect();
          box.scrollTo({ top: box.scrollTop + (before.top - edge.top) - (box.clientHeight - before.height) / 2, behavior: 'smooth' });
        } else {
          const root = doc().documentElement;
          const locked = [root, doc().body].some((node) => view.getComputedStyle(node).overflowY === 'hidden');
          if (!locked && root.scrollHeight > view.innerHeight + 1) {
            view.scrollTo({ top: view.scrollY + before.top - (h - before.height) / 2, behavior: 'smooth' });
          }
        }
        await sleep(750);
      }
      const r = el.getBoundingClientRect();
      const k = scaleRef.current;
      const x = (r.left + Math.min(r.width / 2, 120)) * k;
      const y = (r.top + r.height / 2) * k;
      if (cameraRef.current > 1) aim(x, y, cameraRef.current);
      setCursor({ x, y, down: false });
      await sleep(800);
      return { x, y };
    };

    let hovered: HTMLElement | null = null;

    /** React tracks field values, so they have to be set through the element's own setter. */
    const valueSetter = (el: HTMLElement) => {
      const proto = el instanceof win().HTMLTextAreaElement ? win().HTMLTextAreaElement.prototype : win().HTMLInputElement.prototype;
      return Object.getOwnPropertyDescriptor(proto, 'value')!.set!;
    };

    /** A full pointer-and-mouse click sequence, which the app's controls expect. */
    const press = (el: HTMLElement) => {
      const init = { bubbles: true, cancelable: true, button: 0, view: win() };
      for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
        el.dispatchEvent(type.startsWith('pointer')
          ? new (win().PointerEvent)(type, { ...init, pointerType: 'mouse', pointerId: 1, isPrimary: true })
          : new (win().MouseEvent)(type, init));
      }
    };

    const helpers: Helpers = {
      // Narration is not shown; the step name is kept for error reports.
      say: (text) => { lastSaid = text; },
      wait: (ms) => { advance(ms); return sleep(ms); },
      all: (selector) => [...doc().querySelectorAll<HTMLElement>(selector)],
      leaf: (text) => {
        const el = [...doc().querySelectorAll<HTMLElement>('body *')].find((e) => e.childElementCount === 0 && e.textContent?.trim().startsWith(text));
        if (!el) throw new Error(`missing text ${text}`);
        return el;
      },
      upload: async (input, fileName) => {
        advance(600);
        const transfer = new (win().DataTransfer)();
        transfer.items.add(new (win().File)(['%PDF-1.4\n'], fileName, { type: 'application/pdf' }));
        (input as HTMLInputElement).files = transfer.files;
        input.dispatchEvent(new (win().Event)('change', { bubbles: true }));
        await sleep(600);
      },
      find: (selector, text) => {
        const el = [...doc().querySelectorAll<HTMLElement>(selector)].find((e) => !text || e.textContent?.trim().startsWith(text));
        if (!el) throw new Error(`missing ${selector} ${text ?? ''}`);
        return el;
      },
      pick: async (el) => {
        advance(1290);
        const { x, y } = await point(el);
        setCursor({ x, y, down: true });
        await sleep(140);
        el.focus();
        el.dispatchEvent(new (win().KeyboardEvent)('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        setCursor({ x, y, down: false });
        await sleep(350);
      },
      tap: async (el) => {
        if (!el) throw new Error('target not found');
        advance(150);
        press(el);
        await sleep(150);
      },
      zoom: async (el, level = 1.7) => {
        advance(1000);
        const r = el.getBoundingClientRect();
        const k = scaleRef.current;
        aim((r.left + r.width / 2) * k, (r.top + r.height / 2) * k, level);
        await sleep(1000);
      },
      zoomOut: async () => {
        if (cameraRef.current <= 1) return;
        advance(900);
        aim(0, 0, 1);
        await sleep(900);
      },
      hover: async (el) => {
        advance(1300);
        await point(el);
        // Send real mouse events where the cursor landed, so tooltips, charts and legends respond.
        const r = el.getBoundingClientRect();
        const clientX = r.left + Math.min(r.width / 2, 120);
        const clientY = r.top + r.height / 2;
        const target = (doc().elementFromPoint(clientX, clientY) as HTMLElement | null) ?? el;
        const init = { bubbles: true, cancelable: true, clientX, clientY, view: win() };
        if (hovered && hovered !== target) {
          for (const type of ['pointerout', 'pointerleave', 'mouseout', 'mouseleave']) {
            hovered.dispatchEvent(new (win().MouseEvent)(type, { ...init, bubbles: !type.endsWith('leave') }));
          }
        }
        for (const type of ['pointerover', 'pointerenter', 'mouseover', 'mouseenter', 'pointermove', 'mousemove']) {
          const options = { ...init, bubbles: !type.endsWith('enter') };
          target.dispatchEvent(type.startsWith('pointer')
            ? new (win().PointerEvent)(type, { ...options, pointerType: 'mouse', pointerId: 1, isPrimary: true })
            : new (win().MouseEvent)(type, options));
        }
        hovered = target;
        await sleep(500);
      },
      click: async (el) => {
        advance(1290);
        const { x, y } = await point(el);
        setCursor({ x, y, down: true });
        await sleep(140);
        press(el);
        if (el instanceof win().HTMLInputElement) el.focus();
        setCursor({ x, y, down: false });
        await sleep(350);
      },
      commit: async (el) => {
        advance(400);
        el.dispatchEvent(new (win().FocusEvent)('blur', { bubbles: false }));
        el.dispatchEvent(new (win().FocusEvent)('focusout', { bubbles: true }));
        await sleep(400);
      },
      fill: async (el, value) => {
        advance(500);
        valueSetter(el).call(el, value);
        el.dispatchEvent(new (win().Event)('input', { bubbles: true }));
        el.dispatchEvent(new (win().Event)('change', { bubbles: true }));
        await sleep(500);
      },
      type: async (el, text) => {
        advance(text.length * 70);
        const set = valueSetter(el);
        let value = '';
        for (const ch of text) {
          value += ch;
          set.call(el, value);
          el.dispatchEvent(new (win().Event)('input', { bubbles: true }));
          await sleep(70);
        }
      },
    };

    (async () => {
      for (let i = 0; i < 100 && !frame.current?.contentDocument?.querySelector(ready); i += 1) await sleep(100);
      contain(frame.current?.contentWindow as Win | null);
      aim(0, 0, 1);
      const v = wrap.current!;
      setCursor({ x: v.clientWidth * 0.8, y: v.clientHeight * 0.8, down: false });
      await sleep(900);
      await script(helpers);
      if (cameraRef.current > 1) { aim(0, 0, 1); await sleep(900); }
      await sleep(1200);
      setCursor(null);
      if (loop) { await sleep(2500); setRun((r) => r + 1); return; }
      learned.set(script, Math.max(spent, 1000));
      if (!loop) { progressRef.current?.(1, 300); await sleep(600); doneRef.current?.(); }
    })().catch((error: Error) => { if (error.message !== 'stop') console.warn('[live demo]', error.message, '· at:', lastSaid); });

    return () => {
      token.stop = true;
      setCursor(null);
      aim(0, 0, 1);
      userEvents.forEach((type) => window.removeEventListener(type, mark, { capture: true }));
      window.removeEventListener('scroll', onScroll);
    };
  }, [driving, run, script, visible, live, ready, loop, src, estimateMs]);

  const takeOver = () => {
    setDriving(true);
    onDriving?.(true);
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 2200);
  };
  const handBack = () => {
    setDriving(false);
    onDriving?.(false);
    setRun((r) => r + 1);
  };

  // Set the page up as soon as it can be driven, whether or not the script runs.
  useEffect(() => {
    if (!live) return;
    let tries = 0;
    let reveal = 0;
    const key = `${frameKey}|${src}`;
    const timer = window.setInterval(() => {
      const doc = frame.current?.contentDocument;
      tries += 1;
      if (doc?.querySelector(ready)) {
        window.clearInterval(timer);
        prepare?.(doc);
        reveal = window.setTimeout(() => setShownFor(key), 150);
      } else if (tries > 80) { window.clearInterval(timer); setShownFor(key); }
    }, 100);
    return () => { window.clearInterval(timer); window.clearTimeout(reveal); };
  }, [run, live, prepare, ready, src, frameKey]);

  return (
    <div className={styles.stage} onMouseEnter={takeOver} onMouseLeave={handBack} onTouchStart={takeOver}>
      <div className={styles.browser}>
        <div className={styles.chrome} aria-hidden="true"><i /><i /><i /><span>{label}</span></div>
        <div ref={wrap} className={styles.view}>
          <div className={styles.camera} style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.z})` }}>
          {live ? <iframe key={frameKey} ref={frame} onLoad={(e) => contain(e.currentTarget.contentWindow as Win | null)} className={styles.liveFrame} style={{ width: baseWidth, height: `${100 / scale}%`, transform: `scale(${scale})`, opacity: shown ? 1 : 0, transition: 'opacity 0.35s ease' }} src={src} title={title} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" /> : null}
          {cursor ? <span className={`${styles.cursor} ${cursor.down ? styles.cursorDown : ''}`} style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} aria-hidden="true" /> : null}
          </div>
          {toast ? <span className={styles.toast} role="status">You are driving</span> : !driving ? <span className={styles.hint} aria-hidden="true">Move the pointer here to use it</span> : null}
        </div>
      </div>
    </div>
  );
}
