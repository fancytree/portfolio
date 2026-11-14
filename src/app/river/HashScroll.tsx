'use client';

// Arriving on the homepage with an anchor (/#work from a case study's "Back to
// Work", /#about from another page's nav) should land on that section. The page is
// tall and settles in steps (fonts, the 3D shelf, the long river stretch), so the
// browser's own jump can fire before the section is where it will end up. This
// goes to the anchor again once the page has settled.

import { useEffect } from "react";

export default function HashScroll() {
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      // already there (within a few px of where scroll-padding puts it)? leave it
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (Math.abs(target.getBoundingClientRect().top - pad) < 4) return;
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    if (!window.location.hash) return;
    // once now, and again as the layout settles; a visitor who has started scrolling is left alone
    let cancelled = false;
    const stop = () => (cancelled = true);
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });
    const timers = [0, 120, 400, 900].map((ms) => window.setTimeout(() => !cancelled && go(), ms));
    document.fonts?.ready.then(() => !cancelled && go());
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);
  return null;
}
