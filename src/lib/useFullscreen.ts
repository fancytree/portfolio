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
    setSupported(typeof document !== 'undefined' && document.fullscreenEnabled);
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
