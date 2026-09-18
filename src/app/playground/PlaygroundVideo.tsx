'use client';

// 视频卡片：静音循环，只在进入视口时播放，离开就暂停，避免一屏多个视频同时解码。

import { useEffect, useRef } from 'react';

type Props = { src: string; poster?: string; width: number; height: number };

export default function PlaygroundVideo({ src, poster, width, height }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
}
