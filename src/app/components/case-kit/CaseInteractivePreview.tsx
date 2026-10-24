'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './case-kit.module.css';

/** Same-origin product evidence that reports its content height as controls change. */
export default function CaseInteractivePreview({ src, title, layout = 'content' }: { src: string; title: string; layout?: 'content' | 'canvas' }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const element = frame.current;
    if (!element || layout === 'canvas') return;
    let observer: ResizeObserver | undefined;
    let mutations: MutationObserver | undefined;
    let disposed = false;
    const applyHeight = (next: unknown) => {
      if (!disposed && typeof next === 'number' && Number.isFinite(next) && next > 0 && next <= 20000) {
        setHeight(Math.ceil(next));
      }
    };
    const measure = () => {
      try {
        const content = element.contentDocument?.getElementById('evidence');
        if (content) applyHeight(content.getBoundingClientRect().height);
      } catch {
        // Cross-origin evidence can still report its height through the message protocol.
      }
    };
    const connect = () => {
      observer?.disconnect();
      mutations?.disconnect();
      try {
        const doc = element.contentDocument;
        if (doc?.body) {
          observer = new ResizeObserver(measure);
          observer.observe(doc.body);
          mutations = new MutationObserver(measure);
          mutations.observe(doc.body, { childList: true, subtree: true, characterData: true });
          void doc.fonts.ready.then(measure);
        }
      } catch {
        // Keep the validated message listener available if direct measurement is unavailable.
      }
      measure();
      element.contentWindow?.postMessage({ source: 'case-kit', type: 'request-resize' }, window.location.origin);
    };
    const resize = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== element.contentWindow) return;
      if (event.data?.source !== 'def-design-system' || event.data.type !== 'resize') return;
      applyHeight(event.data.height);
    };
    window.addEventListener('message', resize);
    window.addEventListener('resize', measure);
    element.addEventListener('load', connect);
    // A cached iframe may finish loading before React attaches the listener.
    const initial = requestAnimationFrame(connect);
    return () => {
      disposed = true;
      cancelAnimationFrame(initial);
      observer?.disconnect();
      mutations?.disconnect();
      element.removeEventListener('load', connect);
      window.removeEventListener('message', resize);
      window.removeEventListener('resize', measure);
    };
  }, [src, layout]);

  return <iframe ref={frame} className={layout === 'canvas' ? `${styles.interactivePreview} ${styles.interactiveCanvas}` : styles.interactivePreview} src={src} title={title} loading="lazy"
    sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" style={layout === 'content' && height ? { height } : undefined} />;
}
