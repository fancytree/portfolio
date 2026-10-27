import { useEffect, useRef, useState } from 'react';

function findScrollParent(element: HTMLElement): Element | null {
  let current = element.parentElement;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

/** Tracks whether content immediately before a sticky toolbar has scrolled away. */
export function useStickyStuck() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      {
        root: findScrollParent(sentinel),
        rootMargin: '-1px 0px 0px 0px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, stuck };
}
