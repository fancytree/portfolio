'use client';

// 全站底部：Let's work together + 版权信息
// 在所有页面底部显示

import Button from './Button';

const fontStyle = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

export default function Footer() {
  const handleWorkWithMe = () => {
    if (typeof window === 'undefined') return;
    const isHome = window.location.pathname === '/';
    if (isHome) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <section
      className="w-screen"
      style={{
        backgroundColor: '#FFFFFF',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}
    >
      <div
        className="flex flex-col items-center w-full"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* 大标题 */}
        <h2
          style={{
            ...fontStyle,
            fontSize: '60px',
            lineHeight: '75px',
            fontWeight: 400,
            color: 'rgb(0, 0, 0)',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          Let&apos;s work together
        </h2>

        {/* 按钮 */}
        <div style={{ marginBottom: '240px' }}>
          <Button onClick={handleWorkWithMe}>Work with me</Button>
        </div>

        {/* 分割线 */}
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            marginBottom: '48px',
          }}
        />

        {/* 版权信息 */}
        <p
          style={{
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '32px',
            fontWeight: 400,
            color: 'oklch(0.556 0 0)',
            textAlign: 'center',
          }}
        >
          © 2025 Mei Chai. Designed with intention.
        </p>
      </div>
    </section>
  );
}
