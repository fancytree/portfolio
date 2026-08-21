'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll-driven demo stage.
 *
 * The outer stage is taller than the viewport; the frame inside sticks while you
 * scroll through it. Progress runs 0 → 1 → 0 across that travel, so the demo grows
 * from its content-column size to the full viewport and settles back again.
 *
 * The loop is driven by requestAnimationFrame while the stage is on screen rather
 * than by scroll events, so it stays correct under smooth scrolling, anchor jumps,
 * and programmatic scrolling.
 */
export default function ProcurementDemoEmbed({ src, title }: { src: string; title: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let last = -1;

    const write = (value: number) => {
      const rounded = Math.round(value * 1000) / 1000;

      // Deliberately NOT 100vw: that unit includes the classic scrollbar, which would
      // push the right edge under it and shift the frame off centre. clientWidth is the
      // width actually visible.
      const visibleWidth = document.documentElement.clientWidth;

      // The content column is not centred in the viewport (a 240px nav rail offsets it
      // on wide screens), so slide the frame by the measured delta as it expands.
      const holder = frame.parentElement;
      const delta = holder
        ? visibleWidth / 2 - (holder.getBoundingClientRect().left + holder.getBoundingClientRect().width / 2)
        : 0;

      frame.style.setProperty('--demo-viewport-width', `${visibleWidth}px`);
      frame.style.setProperty('--demo-shift', `${(delta * rounded).toFixed(2)}px`);

      if (rounded === last) return;
      last = rounded;
      frame.style.setProperty('--demo-progress', String(rounded));
    };

    const measure = () => {
      if (reduceMotion.matches) return 1;

      const rect = stage.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return 1;

      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      // Peak in the middle of the travel: 0 → 1 → 0.
      const triangle = 1 - Math.abs((scrolled / travel) * 2 - 1);
      // Reach full size before the exact midpoint so it holds there instead of spiking.
      const held = Math.min(1, triangle * 1.8);
      return held * held * (3 - 2 * held);
    };

    const tick = () => {
      write(measure());
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frameId) frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    // Only animate while the stage is anywhere near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
          write(measure());
        }
      },
      { rootMargin: '100% 0px' }
    );

    // rAF is frozen while the tab is hidden; re-sync the frame when it comes back.
    const onVisibility = () => {
      if (document.hidden) stop();
      else write(measure());
    };

    // Keep the measured viewport width correct even while the loop is parked.
    const onResize = () => write(measure());

    observer.observe(stage);
    write(measure());
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      stop();
    };
  }, []);

  return (
    <div ref={stageRef} className="relative h-[260svh]">
      {/*
        Sits right below the fixed 48px site header, so the demo never covers the site nav.
        z-40 lifts the expanded frame over the case-study rail (z-35); both live inside the
        page's z-10 stacking context, which the site header sits above, so the header stays clear.
      */}
      <div className="sticky top-[48px] z-40 flex h-[calc(100svh-48px)] items-center justify-center">
        <div
          ref={frameRef}
          className="overflow-hidden bg-white"
          style={{
            '--demo-progress': '0',
            '--demo-shift': '0px',
            '--demo-viewport-width': '100vw',
            transform: 'translateX(var(--demo-shift))',
            flexShrink: 0,
            // Rests at the width of its content column, grows to the visible viewport
            // width (scrollbar excluded, so the left/right edges are never cut off).
            width: 'calc(100% + (var(--demo-viewport-width) - 100%) * var(--demo-progress))',
            maxWidth: 'var(--demo-viewport-width)',
            // Peak height leaves the 48px header plus a 12px gap above and below.
            height: 'calc(560px + (100svh - 72px - 560px) * var(--demo-progress))',
            borderRadius: 0,
            boxShadow:
              '0 calc(22px * (1 - var(--demo-progress))) calc(58px * (1 - var(--demo-progress))) rgb(10 10 10 / calc(0.15 * (1 - var(--demo-progress))))',
          } as React.CSSProperties}
        >
          <iframe title={title} src={src} loading="lazy" className="block h-full w-full border-0 bg-white" />
        </div>
      </div>
    </div>
  );
}
