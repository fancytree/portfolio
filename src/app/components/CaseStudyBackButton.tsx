'use client';

import { useRouter } from 'next/navigation';
import { fontFamily } from '@/lib/design-tokens';

type CaseStudyBackButtonProps = {
  /** 'light' renders the idle label in a light color for use on dark hero backgrounds. Defaults to the original dark-on-light look. */
  tone?: 'light';
  /** Hover color override. Defaults to the original JobNova-era orange so existing pages are unaffected. */
  hoverColor?: string;
};

export default function CaseStudyBackButton({ tone, hoverColor = '#ed5b2b' }: CaseStudyBackButtonProps = {}) {
  const router = useRouter();
  const fontStyle = { fontFamily: fontFamily.sans };
  const idleColor = tone === 'light' ? 'rgb(255 255 255 / 0.62)' : 'rgb(10 10 10 / 0.58)';

  const handleBackClick = () => {
    router.push('/#work');
  };

  return (
    <button
      type="button"
      onClick={handleBackClick}
      style={{
        ...fontStyle,
        background: 'transparent',
        border: 0,
        color: idleColor,
        cursor: 'pointer',
        display: 'inline-flex',
        fontSize: '13px',
        lineHeight: '20px',
        padding: 0,
        textDecoration: 'none',
        transition: 'color 0.24s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = idleColor;
      }}
    >
      ← Back to Work
    </button>
  );
}
