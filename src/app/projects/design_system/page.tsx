'use client';

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
            Decoding 12 leading design systems through a clear 3-layer framework: trends, company breakdown,
            and actionable methods.
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
            <iframe
              src="/design_system_article.html"
              title="Design System Article"
              style={{
                width: '100%',
                height: '200vh',
                border: '0',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

