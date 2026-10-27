'use client';

import { useEffect, useRef } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/lib/useFullscreen';
import { CaseButton } from './case-kit/CaseButton';
import { DEMO_CLOSE_MESSAGE } from '@/lib/demoMessages';
import posthog from 'posthog-js';

const posthogEnabled = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

type Props = {
  title: string;
  blurb: string;
  src: string;
  /** Still of the demo at PREVIEW_VIEWPORT_WIDTH × PREVIEW_VIEWPORT_HEIGHT,
   *  made with `node scripts/capture-demo-posters.mjs`. */
  poster: string;
};

/**
 * The card shows a still of the demo at a real desktop viewport, scaled down to
 * the card. 1024 clears the md breakpoint both demos use for their full layout
 * without shrinking the miniature so far that nothing in it is legible.
 */
const PREVIEW_VIEWPORT_WIDTH = 1024;
const PREVIEW_VIEWPORT_HEIGHT = 720;

export default function HomeDemoCard({ title, blurb, src, poster }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, supported, toggle } = useFullscreen(frameRef);

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

  const toggleFullscreen = () => {
    if (posthogEnabled) {
      posthog.capture('portfolio_demo_fullscreen_toggled', {
        demo_title: title,
        fullscreen_action: isFullscreen ? 'exited' : 'opened',
      });
    }
    toggle();
  };

  return (
    <figure className="m-0 flex min-w-0 flex-col gap-4">
      {/* The card is a scaled-down window, so its height comes from the window's
          aspect rather than a fixed px height that would crop it. */}
      <div
        ref={frameRef}
        className="mei-demo-frame relative overflow-hidden rounded-[8px] border border-[#0a0a0a]/12 bg-[#f5f7fb]"
        style={isFullscreen ? undefined : { aspectRatio: `${PREVIEW_VIEWPORT_WIDTH} / ${PREVIEW_VIEWPORT_HEIGHT}` }}
      >
        {/* Each demo is a whole app that keeps running once loaded, so the card
            only shows a still. The iframe mounts when the reader opens it
            fullscreen — laying out at full size from the start — and unmounts
            again on exit. */}
        {isFullscreen ? (
          <iframe title={`${title} demo`} src={src} className="mei-demo-frame__stage block h-full w-full border-0" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- a fixed-size still; next/image would only add a resize pipeline
          <img
            src={poster}
            alt={`${title} demo preview`}
            width={PREVIEW_VIEWPORT_WIDTH}
            height={PREVIEW_VIEWPORT_HEIGHT}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="block h-full w-full object-cover"
          />
        )}

        {/* 预览态整卡可点；桌面用鼠标胶囊提示，不在卡片上画按钮 */}
        {!isFullscreen ? (
          <>
            <button type="button" onClick={toggleFullscreen} disabled={!supported}
              className="mei-demo-frame__cta absolute inset-0 disabled:cursor-default" tabIndex={-1} aria-hidden="true" />
            <CaseButton variant="icon" data-tone="dark" onClick={toggleFullscreen} disabled={!supported}
              className="absolute bottom-4 left-4 z-10" title="Open fullscreen" aria-label={`Open the ${title} demo fullscreen`}>
              <Maximize2 aria-hidden />
            </CaseButton>
          </>
        ) : (
          <CaseButton variant="icon" data-tone="dark" onClick={toggleFullscreen}
            className="absolute bottom-4 left-4 z-10" title="Exit fullscreen" aria-label="Exit fullscreen">
            <Minimize2 aria-hidden />
          </CaseButton>
        )}
      </div>

      <figcaption className="flex flex-col gap-1.5">
        <p
          className="m-0 text-[22px] leading-none text-[#0a0a0a] md:text-[26px]"
          style={{ fontFamily: 'var(--mei-font-display), Oswald, sans-serif', fontWeight: 400 }}
        >
          {title}
        </p>
        <p
          className="m-0 text-[14px] font-light leading-snug text-[#0a0a0a]/58 md:text-[15px]"
          style={{ fontFamily: 'var(--mei-font-primary)' }}
        >
          {blurb}
        </p>
      </figcaption>
    </figure>
  );
}
