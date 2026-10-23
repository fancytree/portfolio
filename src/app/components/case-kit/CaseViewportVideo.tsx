'use client';

import { useEffect, useRef } from 'react';

type CaseViewportVideoProps = {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
};

/** Play only while the recording is visible, without browser playback controls. */
export default function CaseViewportVideo({ src, poster, label, width, height }: CaseViewportVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let inView = false;
    let disposed = false;

    const syncPlayback = () => {
      if (!inView || document.hidden || disposed) {
        video.pause();
        return;
      }
      video.muted = true;
      void video.play().then(() => {
        if (!inView || document.hidden || disposed) video.pause();
      }).catch(() => {
        // Keep the poster if the browser declines automatic playback.
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      syncPlayback();
    }, { threshold: [0, 0.25] });
    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [src]);

  return (
    <video ref={ref} muted loop playsInline controls={false} preload="none" poster={poster} width={width} height={height} aria-label={label}>
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video. <a href={src}>Open the recording</a>.
    </video>
  );
}
