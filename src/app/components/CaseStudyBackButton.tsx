'use client';

import { useRouter } from 'next/navigation';
import { fontFamily } from '@/lib/design-tokens';

export default function CaseStudyBackButton() {
  const router = useRouter();
  const fontStyle = { fontFamily: fontFamily.sans };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleBackClick}
      style={{
        ...fontStyle,
        background: 'transparent',
        border: 0,
        color: 'rgb(10 10 10 / 0.58)',
        cursor: 'pointer',
        display: 'inline-flex',
        fontSize: '13px',
        lineHeight: '20px',
        padding: 0,
        textDecoration: 'none',
        transition: 'color 0.24s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#ed5b2b';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgb(10 10 10 / 0.58)';
      }}
    >
      ← Back
    </button>
  );
}
