'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/lib/useFullscreen';
import { DEMO_CLOSE_MESSAGE } from '@/lib/demoMessages';

type Props = {
  title: string;
  blurb: string;
  src: string;
};

/**
 * The preview renders the demo at a real desktop viewport and scales that down
 * to the card. Sizing the iframe as a percentage of the card instead would tie
 * the viewport to the card's width, so the app would lay itself out for a narrow
 * screen and the preview would read as zoomed-in and cropped.
 *
 * 1024 rather than a wider desktop width: it clears the md breakpoint both demos
 * use for their full layout, without shrinking the miniature so far that nothing
 * in it is legible.
 */
const PREVIEW_VIEWPORT_WIDTH = 1024;
const PREVIEW_VIEWPORT_HEIGHT = 720;

export default function HomeDemoCard({ title, blurb, src }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(0);
  const { isFullscreen, supported, toggle } = useFullscreen(frameRef);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const width = el.clientWidth;
      if (width > 0) setPreviewScale(width / PREVIEW_VIEWPORT_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The demo's mock browser chrome has a working close button, but it lives in
  // an iframe and cannot exit a fullscreen this page owns — it asks us instead.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if ((event.data as { type?: string } | null)?.type !== DEMO_CLOSE_MESSAGE) return;
      if (document.fullscreenElement !== frameRef.current) return;
      void document.exitFullscreen();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <figure className="m-0 flex min-w-0 flex-col gap-4">
      {/* The card is a scaled-down window, so its height comes from the window's
          aspect rather than a fixed px height that would crop it. */}
      <div
        ref={frameRef}
        className="mei-demo-frame relative overflow-hidden rounded-[14px] border border-[#0a0a0a]/12 bg-[#f5f7fb]"
        style={isFullscreen ? undefined : { aspectRatio: `${PREVIEW_VIEWPORT_WIDTH} / ${PREVIEW_VIEWPORT_HEIGHT}` }}
      >
        <iframe
          title={`${title} demo`}
          src={src}
          loading="lazy"
          className="mei-demo-frame__stage block border-0"
          style={
            isFullscreen || previewScale === 0
              ? { height: '100%', width: '100%' }
              : {
                  height: `${PREVIEW_VIEWPORT_HEIGHT}px`,
                  width: `${PREVIEW_VIEWPORT_WIDTH}px`,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }
          }
        />

        {/* 预览态整卡可点；桌面用鼠标胶囊提示，不在卡片上画按钮 */}
        {!isFullscreen ? (
          <button
            type="button"
            onClick={toggle}
            disabled={!supported}
            className="mei-demo-frame__cta absolute inset-0 disabled:cursor-default"
            data-cursor={supported ? 'pill' : undefined}
            data-cursor-label={supported ? 'Open fullscreen' : undefined}
            aria-label={supported ? `Open the ${title} demo fullscreen` : `${title} demo preview`}
          >
            {supported ? (
              <span className="mei-demo-frame__cta-label">
                <Maximize2 aria-hidden size={14} />
                Open fullscreen
              </span>
            ) : null}
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#0a0a0a]/82 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-sm"
            style={{ fontFamily: 'var(--mei-font-primary)' }}
          >
            <Minimize2 aria-hidden size={14} />
            Exit fullscreen
          </button>
        )}
      </div>

      <figcaption className="flex flex-col gap-1.5">
        <p className="m-0 text-[17px] text-[#0a0a0a] md:text-[19px]" style={{ fontFamily: 'var(--mei-font-primary)' }}>
          {title}
        </p>
        <p
          className="m-0 text-[14px] font-light leading-[1.6] text-[#0a0a0a]/58"
          style={{ fontFamily: 'var(--mei-font-primary)' }}
        >
          {blurb}
        </p>
      </figcaption>
    </figure>
  );
}
