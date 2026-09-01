'use client';

import { useEffect, useRef } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/lib/useFullscreen';
import { DEMO_CLOSE_MESSAGE } from '@/lib/demoMessages';

const blue = '#2459D3';
const muted = 'rgba(10, 10, 10, 0.58)';

/**
 * Case-study embed for the sequence demo. It runs in an iframe so the case
 * study does not carry three React Flow canvases in its own bundle, and so it
 * gets the same mock browser chrome the homepage cards show.
 *
 * Unlike those cards this one stays interactive inline — it is the centrepiece
 * of the section, not a thumbnail.
 */
export default function SequenceDemoEmbed() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, supported, toggle } = useFullscreen(frameRef);

  // The chrome's close button lives inside the iframe and cannot exit a
  // fullscreen this page owns, so it asks us to do it.
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
    <>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <p style={{ color: muted, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
          The canvas is built for a full screen — open it fullscreen for the best experience.
        </p>
        {supported ? (
          <button
            type="button"
            onClick={toggle}
            style={{
              alignItems: 'center',
              background: isFullscreen ? blue : '#FFFFFF',
              border: `1px solid ${isFullscreen ? blue : 'rgba(36, 89, 211, 0.35)'}`,
              borderRadius: 'var(--case-radius-sm, 8px)',
              color: isFullscreen ? '#FFFFFF' : blue,
              cursor: 'pointer',
              display: 'inline-flex',
              fontSize: '13px',
              fontWeight: 500,
              gap: '8px',
              lineHeight: 1,
              padding: '9px 14px',
              transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {isFullscreen ? 'Exit fullscreen' : 'Open fullscreen'}
          </button>
        ) : null}
      </div>

      <div
        ref={frameRef}
        className="case-radius-xl cn-demo-frame"
        style={{ background: '#eef0f4', border: '1px solid rgba(10,10,10,0.12)' }}
      >
        <iframe
          title="ConnectNova sequence builder demo"
          src="/demos/connectnova-sequence"
          loading="lazy"
          style={{ border: 0, display: 'block', height: '100%', width: '100%' }}
        />
      </div>
    </>
  );
}
