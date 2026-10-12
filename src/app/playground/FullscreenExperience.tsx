'use client';

import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlaygroundExperience } from '@/lib/playground-items';
import styles from './playground.module.css';

export default function FullscreenExperience({ item }: { item: PlaygroundExperience }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const detachFrame = useRef<(() => void) | null>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const opener = trigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal?.showModal();
    return () => {
      detachFrame.current?.();
      detachFrame.current = null;
      modal?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  function connectFrame(frame: HTMLIFrameElement) {
    detachFrame.current?.();
    // Same-origin experiences keep Escape available after focus enters the canvas.
    const child = frame.contentWindow;
    if (!child) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Let the experience dismiss its own panels before leaving full screen.
      if (child.document.querySelector('dialog[open], #aboutPanel:not([hidden])')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    };
    child.addEventListener('keydown', onKey, true);
    detachFrame.current = () => child.removeEventListener('keydown', onKey, true);
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={styles.experienceCard}
        onClick={() => setOpen(true)}
        aria-label={`Open ${item.title} full screen`}
        aria-haspopup="dialog"
      >
        <span className={styles.experiencePoster}>
          <Image src={item.poster} alt="A clear woodland river reflecting the surrounding forest" width={1280} height={720} sizes="(max-width: 640px) 100vw, 66vw" />
          <span className={styles.experienceExpand} aria-hidden="true"><Maximize2 size={18} /></span>
        </span>
        <span className={styles.experienceCaption}>
          <span><strong>{item.title}</strong><span className={styles.experienceDescription}>{item.description}</span></span>
          <span className={styles.experienceAction}>Enter <span aria-hidden="true">↗</span></span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className={styles.experienceDialog}
        aria-label={`${item.title} — full screen experience`}
        onCancel={(event) => { event.preventDefault(); close(); }}
      >
        {open && (
          <>
            <iframe src={item.src} title={`${item.title} interactive experience`} allow="autoplay; fullscreen" allowFullScreen onLoad={(event) => connectFrame(event.currentTarget)} />
            <button type="button" autoFocus className={styles.experienceClose} aria-label={`Close ${item.title}`} onClick={close}><X size={20} /></button>
          </>
        )}
      </dialog>
    </>
  );
}
