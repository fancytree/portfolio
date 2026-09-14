'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { fontFamily } from '@/lib/design-tokens';

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

type BeforeAfterSliderProps = {
  beforeSrc: string;
  beforeAlt: string;
  beforeLabel: string;
  afterSrc: string;
  afterAlt: string;
  afterLabel: string;
  /** width / height, defaults to a common wide-screenshot ratio */
  aspectRatio?: number;
};

/**
 * Drag-to-compare slider. The "after" image sits full-bleed underneath; the
 * "before" image sits on top, clipped to the handle position. Pointer events
 * cover mouse, touch and pen from one listener; arrow keys nudge the handle
 * for keyboard users, since this is a comparison control, not decoration.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  beforeAlt,
  beforeLabel,
  afterSrc,
  afterAlt,
  afterLabel,
  aspectRatio = 1.6,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, ratio)));
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const nudge = useCallback((delta: number) => {
    setPosition((prev) => Math.min(100, Math.max(0, prev + delta)));
  }, []);

  return (
    <figure className="m-0 flex flex-col gap-4">
      <div
        ref={containerRef}
        className="case-radius-lg relative w-full touch-none select-none overflow-hidden border border-[#e2e2e2]"
        style={{ aspectRatio: String(aspectRatio) }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        onPointerCancel={stopDragging}
      >
        <Image src={afterSrc} alt={afterAlt} fill sizes="(min-width: 1080px) 1080px, 100vw" loading="eager" className="pointer-events-none object-cover object-top" />

        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image src={beforeSrc} alt={beforeAlt} fill sizes="(min-width: 1080px) 1080px, 100vw" loading="eager" className="object-cover object-top" />
        </div>

        <span
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${position}%`, transform: 'translateX(-1px)' }}
          aria-hidden
        />

        <div
          role="slider"
          aria-label={`Comparison position between ${beforeLabel} and ${afterLabel}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          tabIndex={0}
          className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center case-radius-full border border-[#d8d8d8] bg-white text-[#161616] shadow-[0_4px_16px_rgba(0,0,0,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ left: `${position}%` }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              nudge(-4);
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              nudge(4);
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M5 2L1 7l4 5M9 2l4 5-4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <span
          className="pointer-events-none absolute left-3 top-3 case-radius-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-white backdrop-blur-sm"
          style={{ ...bodyStyle, opacity: position > 12 ? 1 : 0 }}
        >
          {beforeLabel}
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 case-radius-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-white backdrop-blur-sm"
          style={{ ...bodyStyle, opacity: position < 88 ? 1 : 0 }}
        >
          {afterLabel}
        </span>
      </div>
      <figcaption className="text-center text-[12px] font-normal text-[#8b93a7]" style={bodyStyle}>
        Drag the handle, or use the arrow keys, to compare.
      </figcaption>
    </figure>
  );
}
