'use client';

/**
 * Mei's head, live: the homepage figure's hair and face on a small rig that can hold an
 * expression, talk, look somewhere and play short actions.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import type { SceneHandle } from '../../river/scene3d/build';
import type { Action, Face, createHeadRig } from './headRig';

// The scene draws one pixel for every two it is given. The frame here is small, so it
// is asked for twice the size and shown at half, or her face would be lost.
const DETAIL = 2;

export type MeiHeadHandle = { play(action: Action): void };

type Props = {
  face?: Face;
  talking?: boolean;
  /** Where she looks, each from -1 to 1. */
  look?: [number, number];
  moving?: boolean;
  /** No motion: she holds the face and only changes when it does. */
  still?: boolean;
  className?: string;
  /** Shown if the drawing cannot start, for example without WebGL. */
  fallback?: ReactNode;
};

const MeiHead = forwardRef<MeiHeadHandle, Props>(function MeiHead(
  { face = 'neutral', talking = false, look = [0, 0], moving = false, still = false, className, fallback = null }, ref,
) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef({ face, talking, look, moving });
  const rig = useRef<ReturnType<typeof createHeadRig> | null>(null);
  const waiting = useRef<Action | null>(null);
  const redraw = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);

  useImperativeHandle(ref, () => ({
    play(action) {
      if (rig.current) rig.current.play(action);
      else waiting.current = action;
    },
  }), []);
  useEffect(() => {
    input.current = { face, talking, look, moving };
    redraw.current();
  }, [face, talking, look, moving]);

  useEffect(() => {
    const element = canvas.current!;
    let handle: SceneHandle | null = null;
    let frame = 0;
    let disposed = false;
    const size = { w: 0, h: 0 };
    const start = performance.now();
    let last = 0;
    Promise.all([import('../../river/scene3d/build'), import('./headRig')])
      .then(([{ createScene }, { createHeadRig }]) => {
        if (disposed) return;
        handle = createScene('head', element);
        let live = createHeadRig();
        rig.current = live;
        if (waiting.current) live.play(waiting.current);
        const draw = (seconds: number) => {
          const w = element.clientWidth;
          const h = element.clientHeight;
          if (!w || !h) return;
          if (w !== size.w || h !== size.h) { size.w = w; size.h = h; handle!.resize(w * DETAIL, h * DETAIL, 0); }
          handle!.setHead(live.step(seconds, input.current));
          handle!.render(seconds, 0, 0, 0, 0);
        };
        if (still) {
          // Settle straight into the pose, with nothing left to animate.
          redraw.current = () => {
            live = createHeadRig();
            for (let i = 0; i < 40; i += 1) live.step(i * 0.033, { ...input.current, talking: false });
            draw(1.33);
          };
          redraw.current();
          return;
        }
        const loop = (now: number) => {
          frame = requestAnimationFrame(loop);
          if (now - last < 32) return;
          last = now;
          draw((now - start) / 1000);
        };
        draw(0);
        frame = requestAnimationFrame(loop);
      })
      .catch(() => { if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      redraw.current = () => {};
      rig.current = null;
      handle?.dispose();
    };
  }, [still]);

  return failed ? <>{fallback}</> : <canvas ref={canvas} className={className} aria-hidden="true" />;
});

export default MeiHead;
