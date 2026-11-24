'use client';

import { useEffect, useRef, useState } from 'react';

export default function CaseReadingProgress() {
  const meter = useRef<HTMLProgressElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = meter.current?.closest('.mei-project-page');
    if (!article) return;

    const update = () => {
      const bounds = article.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - window.innerHeight);
      const fraction = Math.max(0, Math.min(1, -bounds.top / distance));
      setProgress(fraction === 1 ? 100 : Math.min(99, Math.round(fraction * 100)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(article);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="case-rail-progress">
      <progress ref={meter} max={100} value={progress} aria-label="Article reading progress" />
    </div>
  );
}
