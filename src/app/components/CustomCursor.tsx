'use client';

import { useEffect, useRef } from 'react';

const PILL_CURSOR_SELECTOR = '[data-cursor="pill"]';

function getCursorLabel(target: EventTarget | null) {
  if (!(target instanceof Element)) return '';
  const interactive = target.closest<HTMLElement>(PILL_CURSOR_SELECTOR);
  if (!interactive || interactive.getAttribute('aria-disabled') === 'true') return '';
  if ('disabled' in interactive && interactive.disabled) return '';
  return interactive.dataset.cursorLabel ?? '';
}

function getCursorVariant(target: EventTarget | null) {
  if (!(target instanceof Element)) return 'default';
  const interactive = target.closest<HTMLElement>(PILL_CURSOR_SELECTOR);
  if (!interactive || interactive.getAttribute('aria-disabled') === 'true') return 'default';
  if ('disabled' in interactive && interactive.disabled) return 'default';
  return 'pill';
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!supportsFinePointer || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    document.documentElement.classList.add('mei-custom-cursor-enabled');

    const animate = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      raf = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.dataset.visible = 'true';
      cursor.dataset.variant = getCursorVariant(event.target);
      label.textContent = getCursorLabel(event.target);
      cursor.dataset.hasLabel = label.textContent ? 'true' : 'false';
    };

    const handlePointerLeave = () => {
      cursor.dataset.visible = 'false';
    };

    raf = window.requestAnimationFrame(animate);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.documentElement.classList.remove('mei-custom-cursor-enabled');
    };
  }, []);

  return (
    <div ref={cursorRef} className="mei-custom-cursor" aria-hidden="true" data-visible="false" data-variant="default">
      <span ref={labelRef} className="mei-custom-cursor__label" />
    </div>
  );
}
