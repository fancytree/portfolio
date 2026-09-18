'use client';

// 按下会被压扁、松开回弹的按钮，并记录按了几次。

import { useState } from 'react';

export default function SquishButton() {
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, height: '100%' }}>
      <button
        type="button"
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: '14px 28px',
          border: 'none',
          borderRadius: 999,
          backgroundColor: 'var(--mei-orange)',
          color: '#fff',
          fontFamily: 'var(--mei-font-primary)',
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          transform: pressed ? 'scale(1.08, 0.86)' : 'scale(1)',
          transition: pressed ? 'transform 0.08s ease-out' : 'transform 0.45s cubic-bezier(0.34, 1.8, 0.64, 1)',
        }}
      >
        Press me
      </button>
      <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12, color: 'var(--mei-muted)' }}>
        {count === 0 ? 'untouched' : `squished ×${count}`}
      </span>
    </div>
  );
}
