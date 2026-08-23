'use client';

import { useEffect, useRef } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/lib/useFullscreen';
import { DEMO_CLOSE_MESSAGE } from '@/lib/demoMessages';

type Props = {
  title: string;
  blurb: string;
  src: string;
  /** Scales the demo down inside the card so a full desktop layout stays legible. */
  previewScale?: number;
};

export default function HomeDemoCard({ title, blurb, src, previewScale = 0.62 }: Props) {
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

  return (
    <figure className="m-0 flex min-w-0 flex-col gap-4">
      <div
        ref={frameRef}
        className="mei-demo-frame relative overflow-hidden rounded-[14px] border border-[#0a0a0a]/12 bg-[#f5f7fb]"
      >
        <iframe
          title={`${title} demo`}
          src={src}
          loading="lazy"
          className="mei-demo-frame__stage block border-0"
          style={
            isFullscreen
              ? { height: '100%', width: '100%' }
              : {
                  height: `${100 / previewScale}%`,
                  width: `${100 / previewScale}%`,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }
          }
        />

        {/* Until it is fullscreen the card is a preview: one click target over the
            whole demo, so a stray click cannot land inside a shrunken UI. */}
        {!isFullscreen ? (
          <button
            type="button"
            onClick={toggle}
            disabled={!supported}
            className="mei-demo-frame__cta absolute inset-0 flex items-end justify-start p-4 text-left disabled:cursor-default"
            aria-label={supported ? `Open the ${title} demo fullscreen` : `${title} demo preview`}
          >
            {supported ? (
              <span
                className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a]/82 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-sm"
                style={{ fontFamily: 'var(--mei-font-primary)' }}
              >
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
