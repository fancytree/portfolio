'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** The site hides the native cursor and draws its own from a fixed element at
 *  body level. That element sits outside the fullscreen subtree, so a fullscreen
 *  demo would leave the reader with no cursor at all. */
const CURSOR_CLASS = 'mei-custom-cursor-enabled';

/**
 * Fullscreen state for one element, with the site's custom cursor suspended for
 * as long as that element owns the screen.
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const cursorWasEnabledRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSupported(Boolean(document.fullscreenEnabled)));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const restoreCursor = () => {
      if (!cursorWasEnabledRef.current) return;
      document.documentElement.classList.add(CURSOR_CLASS);
      cursorWasEnabledRef.current = false;
    };

    const onChange = () => {
      const entered = document.fullscreenElement === ref.current;
      setIsFullscreen(entered);
      if (entered) {
        const root = document.documentElement;
        cursorWasEnabledRef.current = root.classList.contains(CURSOR_CLASS);
        root.classList.remove(CURSOR_CLASS);
      } else {
        restoreCursor();
      }
    };

    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      restoreCursor();
    };
  }, [ref]);

  // Keyboard events inside a same-origin demo iframe do not bubble to its parent.
  useEffect(() => {
    if (!isFullscreen) return;
    const element = ref.current;
    if (!element) return;
    const documents = new Set<Document>();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement === element) {
        void document.exitFullscreen().catch(() => undefined);
      }
    };
    const connect = (doc: Document | null) => {
      if (!doc || documents.has(doc)) return;
      documents.add(doc);
      doc.addEventListener('keydown', onKeyDown, true);
    };
    connect(document);
    const frames = [...element.querySelectorAll('iframe')];
    const connectFrame = () => {
      for (const frame of frames) {
        try { connect(frame.contentDocument); } catch { /* Native Escape handles cross-origin frames. */ }
      }
    };
    connectFrame();
    frames.forEach(frame => frame.addEventListener('load', connectFrame));
    return () => {
      documents.forEach(doc => doc.removeEventListener('keydown', onKeyDown, true));
      frames.forEach(frame => frame.removeEventListener('load', connectFrame));
    };
  }, [isFullscreen, ref]);

  const toggle = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Refused by permissions policy or unsupported — the demo stays usable
      // inline, so drop the affordance rather than surfacing an error.
      setSupported(false);
    }
  }, [ref]);

  return { isFullscreen, supported, toggle };
}
