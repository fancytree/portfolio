'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '@/lib/useFullscreen';
import { DEMO_CLOSE_MESSAGE } from '@/lib/demoMessages';
import { CaseButton } from './CaseButton';
import styles from './case-kit.module.css';

/** A complete desktop product preview; opening it preserves the same live session. */
export default function CaseDemoPreview({ src, title }: { src: string; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0);
  const { isFullscreen, supported, toggle } = useFullscreen(container);

  useEffect(() => {
    const element = container.current;
    const iframe = frame.current;
    if (!element || !iframe) return;
    const measure = () => {
      const width = parseFloat(getComputedStyle(element).getPropertyValue('--case-demo-viewport-width'));
      if (width > 0) setScale(element.clientWidth / width);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === DEMO_CLOSE_MESSAGE && document.fullscreenElement === container.current) {
        void document.exitFullscreen();
      }
    };
    window.addEventListener('message', close);
    return () => window.removeEventListener('message', close);
  }, []);

  const open = () => {
    if (supported) void toggle();
    else window.location.assign(src);
  };

  return <div ref={container} className={styles.demoPreview} data-case-demo-preview data-case-demo-src={src}>
    <iframe ref={frame} src={src} title={`${title} full workflow demo`} loading="lazy" className={styles.demoPreviewFrame}
      allow="fullscreen" style={{ transform: isFullscreen ? undefined : `scale(${scale})` }} />
    {!isFullscreen && <>
      <CaseButton variant="overlay" arrow="none" className={styles.demoPreviewLaunch} onClick={open} tabIndex={-1} aria-hidden="true" />
      <CaseButton variant="icon" data-tone="dark" className={styles.demoPreviewLabel} onClick={open} title="Open fullscreen" aria-label={`Open ${title} demo fullscreen`}><Maximize2 aria-hidden /></CaseButton>
    </>}
    {isFullscreen && <CaseButton variant="icon" data-tone="dark" className={styles.demoPreviewLabel} onClick={() => void toggle()} title="Exit fullscreen" aria-label="Exit fullscreen"><Minimize2 aria-hidden /></CaseButton>}
  </div>;
}
