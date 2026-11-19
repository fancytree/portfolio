'use client';

import { useEffect } from 'react';

/** Inside the demo, the app's own page links (Jobs, Profile, Subscription…) stay put instead of leaving the frame. */
export default function DemoGuard() {
  useEffect(() => {
    const stop = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href]');
      if (a && !a.getAttribute('href')?.startsWith('#')) e.preventDefault();
    };
    document.addEventListener('click', stop, true);
    return () => document.removeEventListener('click', stop, true);
  }, []);
  return null;
}
