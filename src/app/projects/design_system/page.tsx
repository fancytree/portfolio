'use client';

import Image from 'next/image';
import Link from 'next/link';

// Design System 项目占位页（后续可继续按你现有项目模板完善）
export default function DesignSystemProjectPage() {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FAFAFA' }}>
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div style={{ marginBottom: '48px' }}>
            <Link
              href="/"
              style={{
                ...fontStyle,
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              ← Back to Work
            </Link>
          </div>

          <h1
            style={{
              ...fontStyle,
              fontSize: '40px',
              lineHeight: '52px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '16px',
            }}
          >
            Design System
          </h1>

          <p
            style={{
              ...fontStyle,
              fontSize: '18px',
              lineHeight: '30px',
              fontWeight: 300,
              color: '#171616',
              maxWidth: '760px',
              marginBottom: '32px',
            }}
          >
            A scalable foundation for consistent UI, interaction patterns, and reusable components. This page is
            currently a placeholder and will be refined with your full case study content.
          </p>

          <div
            style={{
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <div style={{ width: '100%', aspectRatio: '16 / 9' }}>
              <Image
                src="/img/Beikemama/Design%20System.avif"
                alt="Design System cover"
                width={1280}
                height={720}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

