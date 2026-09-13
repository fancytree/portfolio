'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fontFamily } from '@/lib/design-tokens';

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

const shots = [
  {
    id: 'purchase-order',
    src: '/img/procurement-agent/Phase 1-02.png?v=3',
    label: 'Purchase order',
    description: 'A shared purchase record connects estimated quantities, supplier confirmation, pricing, and order status. AI flags confirmation discrepancies visually in the table.',
    alt: 'Purchase order workspace: draft PO with estimated quantities, supplier confirmation columns with visual discrepancy highlighting, and Upload confirmation action',
  },
  {
    id: 'goods-receipt',
    src: '/img/procurement-agent/Phase 1-01.png?v=3',
    label: 'Goods receipt',
    description: 'Receiving keeps ordered, DDT, and actual quantities visible together so discrepancies remain traceable. AI highlights mismatches between DDT and confirmation.',
    alt: 'Goods receipt workspace: ordered, DDT, and actual quantities on the same purchase order with visual discrepancy highlighting, and Confirm receipt as the primary action',
  },
] as const;

/**
 * Phase 1 两张产品截图：采购单草稿 / 收货核对，可切换查看。
 * 图片按截图比例通栏铺满，不留灰边。
 */
export default function Phase1ScreenshotSwitcher() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const go = useCallback((next: number) => {
    setActive((next + shots.length) % shots.length);
  }, []);

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
    <figure
      className="m-0 flex flex-col gap-4"
      aria-label="Phase 1 product screenshots"
    >
      <div className="inline-flex w-fit gap-1 case-radius-full border border-[#e2e2e2] bg-white p-1" role="tablist" aria-label="Phase 1 views">
        {shots.map((shot, index) => {
          const selected = index === active;
          return (
            <button
              key={shot.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className="flex min-h-9 items-center justify-center case-radius-full border-0 px-4 py-2 text-left transition-[background-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2155e8] active:scale-[0.98]"
              style={{
                ...bodyStyle,
                background: selected ? '#2155e8' : 'transparent',
                color: selected ? '#FFFFFF' : '#666666',
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
        className="case-radius-xl relative block min-h-0 w-full flex-1 cursor-zoom-in overflow-hidden border border-[#d8d8d8] bg-[#eef1f6] p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2155e8]"
        data-cursor="pill"
        data-cursor-label="View large"
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
        aria-label={`View ${shots[active].label} fullscreen`}
      >
        {/* 用截图比例撑开容器，fill + cover 铺满，切换时高度不变 */}
        <div className="aspect-[3024/1722] w-full" aria-hidden />
        {shots.map((shot, index) => (
          <Image
            key={shot.id}
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(min-width: 1080px) 1080px, 100vw"
            priority={index === 0}
            unoptimized
            className="object-cover object-left-top transition-opacity duration-300 ease-out"
            style={{ opacity: index === active ? 1 : 0 }}
            aria-hidden={index !== active}
          />
        ))}
      </button>

      <figcaption>
        <p className="m-0 max-w-[760px] text-[14px] font-normal leading-[1.55] text-[#555]" style={bodyStyle}>
          {shots[active].description}
        </p>
      </figcaption>
      <p className="sr-only">{`${active + 1} of ${shots.length}`}</p>

      {expanded && createPortal(
        <div
          className="fixed inset-0 m-0 flex h-[100dvh] w-screen max-w-none cursor-zoom-out items-center justify-center border-0 bg-[#080808] p-0 focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
          style={{ zIndex: 2147483646 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${shots[active].label} fullscreen image`}
        >
          <button
            type="button"
            className="absolute inset-0 block h-[100dvh] w-screen border-0 bg-transparent p-0"
            data-cursor="pill"
            data-cursor-label="View small"
            onClick={() => setExpanded(false)}
            aria-label="Close fullscreen image"
          >
            <span className="relative block h-[100dvh] w-screen">
              <Image
                src={shots[active].src}
                alt={shots[active].alt}
                fill
                sizes="100vw"
                unoptimized
                className="object-contain"
                priority
              />
            </span>
          </button>

          <button
            type="button"
            className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center case-radius-full border border-white/70 bg-white/90 text-[#161616] shadow-[0_8px_30px_rgb(0_0_0/0.22)] backdrop-blur-md transition-[background-color,box-shadow,transform] duration-200 hover:scale-[1.06] hover:bg-white hover:shadow-[0_10px_36px_rgb(0_0_0/0.3)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:left-6 sm:size-12"
            data-cursor="pill"
            data-cursor-label="Previous"
            onClick={() => go(active - 1)}
            aria-label={`Previous image: ${shots[(active - 1 + shots.length) % shots.length].label}`}
          >
            <ChevronLeft className="size-[18px]" strokeWidth={1.8} aria-hidden />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center case-radius-full border border-white/70 bg-white/90 text-[#161616] shadow-[0_8px_30px_rgb(0_0_0/0.22)] backdrop-blur-md transition-[background-color,box-shadow,transform] duration-200 hover:scale-[1.06] hover:bg-white hover:shadow-[0_10px_36px_rgb(0_0_0/0.3)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:right-6 sm:size-12"
            data-cursor="pill"
            data-cursor-label="Next"
            onClick={() => go(active + 1)}
            aria-label={`Next image: ${shots[(active + 1) % shots.length].label}`}
          >
            <ChevronRight className="size-[18px]" strokeWidth={1.8} aria-hidden />
          </button>
        </div>,
        document.body,
      )}
    </figure>
  );
}
