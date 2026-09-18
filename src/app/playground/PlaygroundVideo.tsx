'use client';

// 视频卡片：静音循环自动播放。
// React 不会把 muted 写进 SSR 的 HTML，浏览器可能因此拦下 autoPlay，所以挂载后再手动 play 一次兜底。

import { useEffect, useRef } from 'react';

type Props = { src: string; poster?: string; width: number; height: number };

export default function PlaygroundVideo({ src, poster, width, height }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
}
