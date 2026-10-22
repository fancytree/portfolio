'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { fontFamily } from '@/lib/design-tokens';

type CaseStudyNavItem = {
  id: string;
  label: string;
};

type CaseStudyTldrPoint = {
  label: string;
  body: string;
};

type CaseStudyControlsProps = {
  navLabels?: string[];
  tldrPoints?: CaseStudyTldrPoint[];
  accentColor?: string;
  /** 为 true 时左侧导航从页面顶部就显示，滚到底也不收起。默认仍是滚过开场后再出现。 */
  alwaysVisible?: boolean;
  /** 为 false 时不画导航右侧分隔线。默认保留，现有案例页不受影响。 */
  showDivider?: boolean;
  /** 样式页用的侧栏：返回、案例名、带编号的章节。不画圆点和连线。 */
  editorial?: boolean;
  railKicker?: string;
  railTitle?: string;
};

function normalizeLabel(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function slugify(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 42);

  return slug || `case-section-${index + 1}`;
}

function getDirectProjectSections() {
  const root = document.querySelector<HTMLElement>('.mei-project-page');
  if (!root) return [];

  // 样式页把章节放进槽里，侧栏才能和内容并排。其他案例页仍是外壳的直接子章节。
  const slot = root.querySelector<HTMLElement>(':scope > [data-case-sections]');
  const parent = slot ?? root;

  try {
    return Array.from(parent.querySelectorAll<HTMLElement>(':scope > section'));
  } catch {
    return Array.from(parent.children).filter((child): child is HTMLElement => child instanceof HTMLElement && child.tagName.toLowerCase() === 'section');
  }
}

function getProjectContentSections() {
  const root = document.querySelector<HTMLElement>('.mei-project-page');
  if (!root) return [];

  const labeledSections = Array.from(root.querySelectorAll<HTMLElement>('[data-case-nav-label]')).filter(
    (section) => !section.closest('[hidden], [aria-hidden="true"], .hidden')
  );
  if (labeledSections.length > 1) {
    return labeledSections;
  }

  return getDirectProjectSections().slice(1);
}

function getGeneratedTldrPoints(
  navItems: CaseStudyNavItem[],
  customPoints: CaseStudyTldrPoint[] | undefined,
  pageTitle: string,
  pageDescription: string
) {
  if (customPoints?.length) return customPoints;

  const sectionList = navItems.slice(0, 5).map((item) => item.label).join(', ');

  return [
    {
      label: 'Context',
      body:
        pageDescription ||
        `${pageTitle || 'This project'} is structured as a portfolio case study across problem framing, solution direction, implementation details, and reflection.`,
    },
    {
      label: 'Read path',
      body: sectionList
        ? `The quick navigation highlights the major sections in this page: ${sectionList}. Use it to jump between the parts of the case study without losing your place.`
        : 'The page is organized as a long-form case study, with the main story unfolding through research, design decisions, and outcomes.',
    },
    {
      label: 'Focus',
      body: 'The abbreviated view is meant to give recruiters and collaborators a fast scan of what problem the project addresses, what design role was played, and where to look for deeper evidence.',
    },
    {
      label: 'Detail',
      body: 'The full page keeps the richer process work in place: artifacts, constraints, iterations, implementation notes, and reflection stay available for readers who want the complete story.',
    },
    {
      label: 'Outcome',
      body: 'This summary is intentionally compact and reusable across project pages; project-specific TL;DR writing can be added later without changing the interaction template.',
    },
  ];
}

function scrollToTarget(id: string) {
  if (id === 'case-study-top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CaseStudyQuickNav({
  visible,
  activeId,
  items,
  accentColor,
  showDivider,
}: {
  visible: boolean;
  activeId: string;
  items: CaseStudyNavItem[];
  accentColor: string;
  showDivider: boolean;
}) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/#work');
  };

  return (
    <aside
      className="mei-case-study-rail hidden xl:flex"
      aria-label="Case study quick navigation"
      style={{
        position: 'fixed',
        left: 0,
        top: '88px',
        zIndex: 35,
        width: '240px',
        height: 'calc(100svh - 112px)',
        boxSizing: 'border-box',
        flexDirection: 'column',
        gap: '12px',
        padding: '30px 24px 24px',
        borderRight: showDivider ? '1px solid rgb(10 10 10 / 0.07)' : 'none',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 0.32s ease, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <button
        type="button"
        className="mei-case-study-scroll-top"
        onClick={handleBackClick}
        style={{
          fontFamily: fontFamily.sans,
          alignSelf: 'flex-start',
          border: 0,
          background: 'transparent',
          color: 'var(--case-muted, #686868)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '13px',
          fontWeight: 300,
          lineHeight: '18px',
          padding: 0,
          textAlign: 'left',
        }}
      >
        ← Back to Work
      </button>

      <nav
        style={{
          display: 'flex',
          minHeight: 0,
          flex: 1,
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const idleColor = 'var(--case-muted, #686868)';
          const activeColor = accentColor;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToTarget(item.id)}
              style={{
                fontFamily: fontFamily.sans,
                width: '100%',
                maxWidth: '100%',
                border: 0,
                background: 'transparent',
                color: isActive ? activeColor : idleColor,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 300,
                lineHeight: '20px',
                padding: '2px 0',
                textAlign: 'left',
                whiteSpace: 'normal',
                transition: 'color 0.2s ease',
              }}
              aria-current={isActive ? 'true' : undefined}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = activeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive ? activeColor : idleColor;
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  flexShrink: 0,
                  width: '14px',
                  height: '1px',
                  marginTop: '10px',
                  backgroundColor: isActive ? activeColor : 'var(--case-rule, rgb(23 23 23 / 0.16))',
                  opacity: isActive ? 1 : 0,
                  transition: 'background-color 0.2s ease, opacity 0.2s ease',
                }}
              />
              <span style={{ minWidth: 0 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function splitNumberedLabel(label: string) {
  const match = label.match(/^(\d+)\s*\/\s*(.+)$/);
  if (!match) return null;
  return { index: match[1], name: match[2] };
}

/** 样式页侧栏。结构对齐参考稿：返回、眉题、案例名、章节。每行左侧不放圆点或连线，编号保留。 */
function CaseStudyEditorialNav({
  visible,
  activeId,
  items,
  showDivider,
  kicker,
  title,
}: {
  visible: boolean;
  activeId: string;
  items: CaseStudyNavItem[];
  showDivider: boolean;
  kicker: string;
  title: string;
}) {
  const router = useRouter();
  const idleColor = 'var(--case-nav-idle)';
  const backColor = 'var(--case-nav-back)';
  const activeColor = 'var(--case-nav-active)';
  void showDivider;

  return (
    <aside
      className="mei-case-study-rail hidden xl:block"
      aria-label="Case study quick navigation"
      style={{
        position: 'relative',
        width: '240px',
        alignSelf: 'stretch',
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '68px',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 28px 24px',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.32s ease',
        }}
      >
      <button
        type="button"
        onClick={() => router.push('/#work')}
        style={{
          fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
          alignSelf: 'flex-start',
          border: 0,
          background: 'transparent',
          color: backColor,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: 'var(--case-type-nav-meta)',
          fontWeight: 500,
          letterSpacing: 'var(--case-tracking-nav-back)',
          lineHeight: 'var(--case-leading-nav-meta)',
          padding: 0,
          textAlign: 'left',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.color = activeColor;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.color = backColor;
        }}
      >
        <span aria-hidden>‹</span>
        <span>Back to Work</span>
      </button>

      <div style={{ marginTop: '28px' }}>
        <p
          style={{
            margin: 0,
            color: 'var(--case-nav-kicker)',
            fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
            fontSize: 'var(--case-type-nav-meta)',
            fontWeight: 500,
            letterSpacing: 'var(--case-tracking-nav-kicker)',
            lineHeight: 'var(--case-leading-nav-meta)',
            textTransform: 'uppercase',
          }}
        >
          {kicker}
        </p>
        <p
          style={{
            margin: '6px 0 0',
            color: activeColor,
            fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
            fontSize: 'var(--case-type-card-body)',
            fontWeight: 400,
            letterSpacing: 'var(--case-tracking-nav-title)',
            lineHeight: 'var(--case-leading-nav-title)',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </p>
      </div>

      <nav
        style={{
          display: 'flex',
          minHeight: 0,
          flex: 1,
          flexDirection: 'column',
          gap: '22px',
          marginTop: '48px',
          overflowY: 'auto',
        }}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const parts = splitNumberedLabel(item.label);
          const color = isActive ? activeColor : idleColor;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToTarget(item.id)}
              aria-current={isActive ? 'true' : undefined}
              style={{
                fontFamily: 'var(--mei-font-display), Oswald, sans-serif',
                width: '100%',
                maxWidth: '100%',
                border: 0,
                background: 'transparent',
                color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                fontSize: 'var(--case-type-spec)',
                fontWeight: 500,
                letterSpacing: 'var(--case-tracking-nav-item)',
                lineHeight: 'var(--case-leading-nav-item)',
                padding: 0,
                textAlign: 'left',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = activeColor;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = color;
              }}
            >
              {parts ? (
                <>
                  <span style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{parts.index}</span>
                  <span style={{ minWidth: 0 }}>{parts.name}</span>
                </>
              ) : (
                <span style={{ minWidth: 0 }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
      </div>
    </aside>
  );
}

function CaseStudyTldrButton({ visible, onOpen }: { visible: boolean; onOpen: () => void }) {
  void visible;
  void onOpen;
  return null;
}

function CaseStudyTldrModal({ open, onClose, points, accentColor }: { open: boolean; onClose: () => void; points: CaseStudyTldrPoint[]; accentColor: string }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-tldr-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(10 10 10 / 0.26)',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(860px, 100%)',
          maxHeight: 'min(720px, calc(100dvh - 48px))',
          overflow: 'auto',
          overscrollBehavior: 'contain',
          border: '1px solid var(--case-rule, #d2d2d2)',
          borderRadius: '8px',
          background: 'var(--case-surface, #f4f4f1)',
          color: 'var(--case-ink, #171717)',
          padding: 0,
          boxShadow: '0 24px 80px rgb(0 0 0 / 0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            padding: '18px 28px',
            background: 'var(--case-surface, #f4f4f1)',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <h2
            id="case-study-tldr-title"
            style={{
              fontFamily: fontFamily.display,
              fontSize: '30px',
              fontWeight: 500,
              lineHeight: 1,
              margin: 0,
            }}
          >
            TL;DR
          </h2>

          <button type="button" className="mei-case-study-tldr-close" onClick={onClose} aria-label="Close TL;DR">
            <X size={16} strokeWidth={1.7} />
          </button>
        </div>

        <div style={{ padding: '0 28px 28px' }}>
          {points.map((point, index) => (
            <article
              key={point.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderBottom: index === points.length - 1 ? 0 : '1px solid var(--case-rule, #d2d2d2)',
                padding: index === 0 ? '0 0 18px' : '18px 0',
              }}
            >
              <h3
                style={{
                  fontFamily: fontFamily.display,
                  color: accentColor,
                  fontSize: '22px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  margin: 0,
                }}
              >
                {point.label}
              </h3>
              <p
                style={{
                  fontFamily: fontFamily.sans,
                  color: 'var(--case-copy, #3f3f3f)',
                  fontSize: '15px',
                  fontWeight: 300,
                  lineHeight: '24px',
                  margin: 0,
                }}
              >
                {point.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyControls({
  navLabels,
  tldrPoints,
  accentColor = '#ed5b2b',
  alwaysVisible = false,
  showDivider = true,
  editorial = false,
  railKicker = 'Case study',
  railTitle,
}: CaseStudyControlsProps) {
  const [visible, setVisible] = useState(alwaysVisible);
  const [activeId, setActiveId] = useState('');
  const [navItems, setNavItems] = useState<CaseStudyNavItem[]>([]);
  const [pageTitle, setPageTitle] = useState('This project');
  const [pageDescription, setPageDescription] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.mei-project-page');
    if (!root) return;

    root.style.setProperty('--case-accent', accentColor);
    return () => {
      root.style.removeProperty('--case-accent');
    };
  }, [accentColor]);

  useEffect(() => {
    const prepareSections = () => {
      const contentSections = getProjectContentSections();

      const allowedLabels = navLabels?.map(normalizeLabel);
      const nextItems = contentSections
        .map((section, index) => {
          const heading = section.querySelector('h1, h2');
          const label = normalizeLabel(section.dataset.caseNavLabel ?? heading?.textContent ?? '');
          if (!label) return null;
          if (allowedLabels?.length && !allowedLabels.includes(label)) return null;

          if (!section.id) {
            section.id = slugify(label, index);
          }

          return {
            id: section.id,
            label: label.length > 56 ? `${label.slice(0, 56).trim()}...` : label,
          };
        })
        .filter((item): item is CaseStudyNavItem => Boolean(item));

      setNavItems(nextItems);
      setPageTitle(normalizeLabel(document.querySelector('h1')?.textContent ?? 'This project'));
      setPageDescription(normalizeLabel(document.querySelector('.mei-project-page p')?.textContent ?? ''));
    };

    prepareSections();
    window.setTimeout(prepareSections, 300);
  }, [navLabels]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = getDirectProjectSections();
      const hero = sections[0];
      const projectRoot = document.querySelector('.mei-project-page');
      const footerIsEntering = projectRoot ? projectRoot.getBoundingClientRect().bottom <= window.innerHeight : false;
      const hasPassedHero = hero ? hero.getBoundingClientRect().bottom <= 220 : window.scrollY > window.innerHeight * 0.75;
      setVisible(alwaysVisible || (hasPassedHero && !footerIsEntering));

      let current: CaseStudyNavItem | undefined;
      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= 160) {
          current = item;
        }
      }

      if (current) setActiveId(current.id);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [alwaysVisible, navItems]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const previousOverscrollBehavior = documentElement.style.overscrollBehavior;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    documentElement.style.overscrollBehavior = 'none';

    return () => {
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      documentElement.style.overscrollBehavior = previousOverscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const modalPoints = useMemo(
    () => getGeneratedTldrPoints(navItems, tldrPoints, pageTitle, pageDescription),
    [navItems, pageDescription, pageTitle, tldrPoints]
  );

  if (navItems.length === 0) return null;

  return (
    <>
      {editorial ? (
        <CaseStudyEditorialNav
          visible={visible}
          activeId={activeId}
          items={navItems}
          showDivider={showDivider}
          kicker={railKicker}
          title={railTitle || pageTitle}
        />
      ) : (
        <CaseStudyQuickNav visible={visible} activeId={activeId} items={navItems} accentColor={accentColor} showDivider={showDivider} />
      )}
      <CaseStudyTldrButton visible={visible} onOpen={() => setOpen(true)} />
      <CaseStudyTldrModal open={open} onClose={() => setOpen(false)} points={modalPoints} accentColor={accentColor} />
    </>
  );
}

// Opt-in navigation for the shared Case Kit shell.
export { default as CaseKitControls } from './case-kit/CaseKitControls';
