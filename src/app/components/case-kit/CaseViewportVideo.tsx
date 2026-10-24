'use client';

import { useEffect, useRef } from 'react';

type CaseViewportVideoProps = {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
  controls?: boolean;
};

/** Play while visible; optional native controls preserve manual pause and audio choices. */
export default function CaseViewportVideo({ src, poster, label, width, height, controls = false }: CaseViewportVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let inView = false;
    let disposed = false;
    let userPaused = false;
    const onPause = () => {
      if (controls && inView && !document.hidden && !disposed) userPaused = true;
    };
    const onPlay = () => { userPaused = false; };

    const syncPlayback = () => {
      if (!inView || document.hidden || disposed) {
        video.pause();
        return;
      }
      if (userPaused) return;
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
    video.addEventListener('pause', onPause);
    video.addEventListener('play', onPlay);
    document.addEventListener('visibilitychange', syncPlayback);

    return () => {
      disposed = true;
      observer.disconnect();
      video.removeEventListener('pause', onPause);
      video.removeEventListener('play', onPlay);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [src, controls]);

  return (
    <video ref={ref} muted loop playsInline controls={controls} preload="none" poster={poster} width={width} height={height} aria-label={label}>
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video. <a href={src}>Open the recording</a>.
    </video>
  );
}
