'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fontFamily } from '@/lib/design-tokens';

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

type DashboardShot = {
  src: string;
  label: string;
  focus: string;
};

/**
 * Tab-switched dashboard screenshots. Same pattern as Phase1ScreenshotSwitcher
 * in procurement-agent-v2: one large image at a time instead of a stacked grid,
 * so each role's dashboard is legible instead of cramped at half width.
 */
export default function DashboardSwitcher({ shots, accent }: { shots: DashboardShot[]; accent: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const go = useCallback((next: number) => {
    setActive((next + shots.length) % shots.length);
  }, [shots.length]);

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    const handleFullscreenKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
      if (event.key === 'ArrowLeft') go(active - 1);
      if (event.key === 'ArrowRight') go(active + 1);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleFullscreenKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleFullscreenKey);
    };
  }, [active, expanded, go]);

  return (
    <figure className="m-0 flex flex-col gap-4" aria-label="Role dashboard screenshots">
      <div className="inline-flex w-fit flex-wrap gap-1 case-radius-full border border-[#e2e2e2] bg-white p-1" role="tablist" aria-label="Dashboard roles">
        {shots.map((shot, index) => {
          const selected = index === active;
          return (
            <button
              key={shot.label}
              type="button"
              role="tab"
              aria-selected={selected}
              className="flex min-h-9 items-center justify-center case-radius-full border-0 px-4 py-2 text-left transition-[background-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
              style={{
                ...bodyStyle,
                background: selected ? accent : 'transparent',
                color: selected ? '#ffffff' : '#666666',
              }}
              onClick={() => go(index)}
            >
              <span className="whitespace-nowrap text-[12px] font-semibold tracking-[-0.01em]">{shot.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="case-radius-xl relative block min-h-0 w-full flex-1 cursor-zoom-in overflow-hidden border border-[#d8d8d8] bg-[#eef1f6] p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            go(active - 1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            go(active + 1);
          }
        }}
        onClick={() => setExpanded(true)}
        aria-label={`View ${shots[active].label} dashboard fullscreen`}
      >
        <div className="aspect-[1600/1000] w-full" aria-hidden />
        {shots.map((shot, index) => (
          <Image
            key={shot.label}
            src={shot.src}
            alt={`${shot.label} dashboard: shared layout, role-specific KPIs and task list.`}
            fill
            sizes="(min-width: 1080px) 1080px, 100vw"
            priority={index === 0}
            className="object-cover object-top transition-opacity duration-300 ease-out"
            style={{ opacity: index === active ? 1 : 0 }}
            aria-hidden={index !== active}
          />
        ))}
      </button>

      <figcaption className="flex flex-col gap-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.05em]" style={{ ...bodyStyle, color: accent }}>{shots[active].label}</span>
        <span className="text-[13px] font-normal leading-[1.5] text-[#555]" style={bodyStyle}>{shots[active].focus}</span>
      </figcaption>
      <p className="sr-only">{`${active + 1} of ${shots.length}`}</p>

      {expanded && createPortal(
        <div
          className="fixed inset-0 m-0 flex h-[100dvh] w-screen max-w-none cursor-zoom-out items-center justify-center border-0 bg-[#080808] p-0 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
          style={{ zIndex: 2147483646 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${shots[active].label} dashboard fullscreen image`}
        >
          <button
            type="button"
            className="absolute inset-0 block h-[100dvh] w-screen border-0 bg-transparent p-0"
            onClick={() => setExpanded(false)}
            aria-label="Close fullscreen image"
          >
            <span className="relative block h-[100dvh] w-screen">
              <Image
                src={shots[active].src}
                alt={`${shots[active].label} dashboard, full size.`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </span>
          </button>

          <button
            type="button"
            className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center case-radius-full border border-white/70 bg-white/90 text-[#161616] shadow-[0_8px_30px_rgb(0_0_0/0.22)] backdrop-blur-md transition-[background-color,box-shadow,transform] duration-200 hover:scale-[1.06] hover:bg-white hover:shadow-[0_10px_36px_rgb(0_0_0/0.3)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:left-6 sm:size-12"
            onClick={() => go(active - 1)}
            aria-label={`Previous: ${shots[(active - 1 + shots.length) % shots.length].label}`}
          >
            <ChevronLeft className="size-[18px]" strokeWidth={1.8} aria-hidden />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center case-radius-full border border-white/70 bg-white/90 text-[#161616] shadow-[0_8px_30px_rgb(0_0_0/0.22)] backdrop-blur-md transition-[background-color,box-shadow,transform] duration-200 hover:scale-[1.06] hover:bg-white hover:shadow-[0_10px_36px_rgb(0_0_0/0.3)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:right-6 sm:size-12"
            onClick={() => go(active + 1)}
            aria-label={`Next: ${shots[(active + 1) % shots.length].label}`}
          >
            <ChevronRight className="size-[18px]" strokeWidth={1.8} aria-hidden />
          </button>
        </div>,
        document.body,
      )}
    </figure>
  );
}
