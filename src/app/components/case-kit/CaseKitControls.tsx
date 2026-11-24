'use client';

import { useEffect, useState } from 'react';
import { CaseKitBackButton as CaseStudyBackButton } from '../CaseStudyBackButton';
import { CaseButton } from './CaseButton';
import CaseReadingProgress from './CaseReadingProgress';

type NavItem = { id: string; label: string; index: string };
type CaseStudyControlsProps = {
  navLabels?: string[];
  railKicker?: string;
  railTitle?: string;
  backHref?: string;
  backLabel?: string;
  showProgress?: boolean;
  mobileContents?: boolean;
  /** Content retained for callers that also use these summaries in their story. */
  tldrPoints?: { label: string; body: string }[];
};

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

export default function CaseStudyControls({ navLabels, railKicker = 'Case study', railTitle, backHref, backLabel = 'Back', showProgress = false, mobileContents = false }: CaseStudyControlsProps) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [title, setTitle] = useState(railTitle ?? '');

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.mei-project-page');
    if (!root) return;
    const prepare = () => {
      const slot = root.querySelector('[data-case-sections]') ?? root;
      const sections = Array.from(slot.querySelectorAll<HTMLElement>(':scope > section'));
      const content = sections.filter(section => !section.classList.contains('mei-case-study-hero') && !section.hidden && section.getClientRects().length > 0);
      const usedIds = new Set<string>();
      const next = content.flatMap((section, index) => {
        const explicit = section.matches('[data-case-nav-label]') ? section : section.querySelector<HTMLElement>('[data-case-nav-label]');
        const heading = section.querySelector('h1, h2') ?? section.querySelector('h3');
        const label = normalize(explicit?.dataset.caseNavLabel ?? heading?.textContent ?? '');
        if (!label || (navLabels?.length && !navLabels.includes(label))) return [];
        const numbered = label.match(/^(\d+)\s*(?:[\/·.\-]\s*)?(.*)$/);
        const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || `chapter-${index + 1}`;
        if (!section.id) section.id = `case-${slug}`;
        if (usedIds.has(section.id)) section.id = `${section.id}-${index + 1}`;
        usedIds.add(section.id);
        return [{ id: section.id, label: numbered?.[2] ?? label, index: numbered?.[1] ?? String(index + 1).padStart(2, '0') }];
      });
      setItems(next);
      setActiveId(current => next.some(item => item.id === current) ? current : next[0]?.id ?? '');
      setTitle(railTitle ?? normalize(root.querySelector('h1')?.textContent ?? 'This project'));
    };
    prepare();
    // Chapter ids are assigned here, after the browser's own hash jump, so honour a #case-… link once they exist.
    const timer = window.setTimeout(() => {
      prepare();
      const target = window.location.hash.startsWith('#case-') ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
      target?.scrollIntoView({ block: 'start' });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [navLabels, railTitle]);

  useEffect(() => {
    const update = () => {
      let current = items[0]?.id ?? '';
      for (const item of items) {
        if ((document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 160) current = item.id;
      }
      setActiveId(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  const chapterLinks = items.map(item => (
    <a key={item.id} href={`#${item.id}`} aria-current={item.id === activeId ? 'location' : undefined}>
      <span aria-hidden>{item.index}</span><span>{item.label}</span>
    </a>
  ));

  return (
    <aside className="mei-case-study-rail case-rail" data-reading-progress={mobileContents || undefined} aria-label="Case study navigation">
      <div className="case-rail-sticky">
        {backHref ? <CaseButton variant="back" arrow="left" href={backHref}>{backLabel}</CaseButton> : <CaseStudyBackButton />}
        <div className="case-rail-heading">
          <p className="case-rail-kicker">{railKicker}</p>
          <p className="case-rail-title">{title}</p>
        </div>
        {showProgress && <CaseReadingProgress />}
        <nav className="case-rail-links" aria-label="Chapters">{chapterLinks}</nav>
        {mobileContents && (
          <details className="case-rail-mobile">
            <summary>Contents</summary>
            <nav className="case-rail-links" aria-label="Chapters" onClick={event => {
              if (event.target instanceof Element && event.target.closest('a')) event.currentTarget.closest('details')?.removeAttribute('open');
            }}>{chapterLinks}</nav>
          </details>
        )}
      </div>
    </aside>
  );
}
