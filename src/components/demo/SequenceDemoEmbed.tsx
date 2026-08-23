'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Maximize2, Minimize2 } from 'lucide-react';

const SequenceDemoWorkspace = dynamic(
  () => import('@/components/demo/SequenceDemoWorkspace').then((m) => m.SequenceDemoWorkspace),
  { ssr: false },
);

const blue = '#2459D3';
const muted = 'rgba(10, 10, 10, 0.58)';

/**
 * Case-study embed for the sequence demo: a fullscreen affordance plus the
 * workspace itself. The canvas is cramped at the width of a prose column, so
 * the hint points at fullscreen before the reader starts poking at it.
 */
export default function SequenceDemoEmbed() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cursorWasEnabledRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof document !== 'undefined' && document.fullscreenEnabled);
  }, []);

  useEffect(() => {
    // The site draws its own cursor from a fixed element at body level and hides
    // the native one. That element is outside the fullscreen subtree, so in
    // fullscreen the reader would be left with no cursor at all — suspend the
    // custom cursor for as long as the demo owns the screen.
    const CURSOR_CLASS = 'mei-custom-cursor-enabled';
    const onChange = () => {
      const entered = document.fullscreenElement === frameRef.current;
      setIsFullscreen(entered);
      const root = document.documentElement;
      if (entered) {
        cursorWasEnabledRef.current = root.classList.contains(CURSOR_CLASS);
        root.classList.remove(CURSOR_CLASS);
      } else if (cursorWasEnabledRef.current) {
        root.classList.add(CURSOR_CLASS);
        cursorWasEnabledRef.current = false;
      }
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      if (cursorWasEnabledRef.current) {
        document.documentElement.classList.add(CURSOR_CLASS);
        cursorWasEnabledRef.current = false;
      }
    };
  }, []);

  const toggle = useCallback(async () => {
    const el = frameRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen can be refused (permissions policy, unsupported browser).
      // The demo stays usable inline, so there is nothing to recover from.
      setSupported(false);
    }
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
              borderRadius: '8px',
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
        className="cn-demo-scope cn-demo-frame"
        style={{ background: '#F5F9FF', border: '1px solid rgba(10,10,10,0.12)' }}
      >
        <SequenceDemoWorkspace />
        {isFullscreen ? (
          <button
            type="button"
            onClick={toggle}
            aria-label="Exit fullscreen"
            style={{
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(10, 10, 10, 0.12)',
              borderRadius: '8px',
              color: 'rgba(10, 10, 10, 0.7)',
              cursor: 'pointer',
              display: 'inline-flex',
              fontSize: '13px',
              fontWeight: 500,
              gap: '8px',
              lineHeight: 1,
              padding: '9px 14px',
              position: 'absolute',
              right: '16px',
              top: '16px',
              zIndex: 60,
            }}
          >
            <Minimize2 size={15} />
            Exit fullscreen
          </button>
        ) : null}
      </div>
    </>
  );
}
