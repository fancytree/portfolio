'use client';

import { CaseButton } from './CaseButton';

/** Open the existing live preview so its close controls return to the case. */
export default function CaseDemoLink({ href, label, className }: { href: string; label: string; className?: string }) {
  return <CaseButton href={href} className={className} onClick={event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const preview = [...document.querySelectorAll<HTMLElement>('[data-case-demo-src]')]
      .find(element => element.dataset.caseDemoSrc === href);
    if (!preview || !document.fullscreenEnabled) return;
    event.preventDefault();
    void preview.requestFullscreen().catch(() => window.location.assign(href));
  }}>{label}</CaseButton>;
}
