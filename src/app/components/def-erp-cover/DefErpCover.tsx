'use client';

import { useEffect, useRef } from 'react';
import styles from './DefErpCover.module.css';

const poster = '/videos/def-erp/hero-cover.png';

export default function DefErpCover() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    // The cover is decorative/inert inside the project link, so listen on
    // that link rather than relying on pointer events reaching the video.
    const trigger = element.closest('a');
    const surface = element.parentElement;
    if (!trigger || !surface) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let hovered = trigger.matches(':hover');
    let visible = false;
    const shouldPlay = () => hovered && visible && hover.matches && !document.hidden && !reduced.matches;
    const stop = () => {
      surface.removeAttribute('data-playing');
      element.pause();
      if (element.readyState > 0) element.currentTime = 0;
    };
    const update = () => {
      if (shouldPlay()) {
        void element.play().then(() => {
          if (shouldPlay()) surface.setAttribute('data-playing', '');
          else stop();
        }).catch(() => { /* Keep the static cover if playback is unavailable. */ });
      } else {
        stop();
      }
    };
    const enter = () => { hovered = true; update(); };
    const leave = () => { hovered = false; update(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    trigger.addEventListener('pointerenter', enter);
    trigger.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', update);
    hover.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      trigger.removeEventListener('pointerenter', enter);
      trigger.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', update);
      hover.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      stop();
    };
  }, []);

  return (
    <div className={styles.cover}>
      {/* Decorative media: the enclosing project link provides its accessible name. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.poster} src={poster} alt="" />
      <video ref={video} className={styles.video} src="/videos/def-erp/hero-cover.mp4" poster={poster} preload="metadata" muted loop playsInline aria-hidden="true" />
    </div>
  );
}
