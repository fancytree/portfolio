'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fontFamily } from '@/lib/design-tokens';

const bodyStyle = {
  fontFamily: fontFamily.sans,
} as const;

const shots = [
  {
    id: 'purchase-order',
    src: '/img/procurement-agent/Phase 1-01.png',
    index: '01',
    label: 'Purchase order',
    alt: 'Purchase order workspace: draft PO with estimated quantities, empty confirmation columns, and Upload confirmation',
  },
  {
    id: 'goods-receipt',
    src: '/img/procurement-agent/Phase 1-02.png?v=2',
    index: '02',
    label: 'Goods receipt',
    alt: 'Goods receipt workspace: ordered, DDT, and actual quantities on the same purchase order, with Confirm receipt as the primary action',
  },
] as const;

/**
 * Phase 1 两张产品截图：采购单草稿 / 收货核对，可切换查看。
 * 图片按截图比例通栏铺满，不留灰边。
 */
export default function Phase1ScreenshotSwitcher() {
  const [active, setActive] = useState(0);

  const go = useCallback((next: number) => {
    setActive((next + shots.length) % shots.length);
  }, []);

  return (
    <figure
      className="m-0 flex flex-col overflow-hidden border border-[#e2e2e2] bg-[#f4f4f4]"
      aria-label="Phase 1 product screenshots"
    >
      <div
        className="relative min-h-0 flex-1"
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
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Phase 1 screenshots"
      >
        {/* 用截图比例撑开容器，fill + cover 铺满，切换时高度不变 */}
        <div className="aspect-[3024/1721] w-full" aria-hidden />
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

        <button
          type="button"
          className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center border border-[#d8d8d8] bg-white/95 text-[#161616] transition-colors hover:border-[#2155e8] hover:text-[#2155e8]"
          aria-label="Previous screenshot"
          onClick={() => go(active - 1)}
        >
          <ChevronLeft className="size-4" strokeWidth={2.25} />
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center border border-[#d8d8d8] bg-white/95 text-[#161616] transition-colors hover:border-[#2155e8] hover:text-[#2155e8]"
          aria-label="Next screenshot"
          onClick={() => go(active + 1)}
        >
          <ChevronRight className="size-4" strokeWidth={2.25} />
        </button>
      </div>

      <div className="relative z-10 grid shrink-0 grid-cols-2 border-t border-[#e2e2e2] bg-white" role="tablist" aria-label="Phase 1 views">
        {shots.map((shot, index) => {
          const selected = index === active;
          return (
            <button
              key={shot.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className="flex items-baseline gap-2 px-4 py-3 text-left transition-colors"
              style={{
                background: selected ? '#e9eef8' : '#ffffff',
                boxShadow: selected ? 'inset 0 2px 0 #2155e8' : 'none',
              }}
              onClick={() => go(index)}
            >
              <span
                className="text-[11px] font-bold"
                style={{ ...bodyStyle, color: selected ? '#2155e8' : '#777' }}
              >
                {shot.index}
              </span>
              <span
                className="text-[13px] font-bold"
                style={{ ...bodyStyle, color: selected ? '#161616' : '#555' }}
              >
                {shot.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only">{`${active + 1} of ${shots.length}`}</p>
    </figure>
  );
}
