'use client';

// 点阵：光标靠近时点会放大、变色，离开后回落。纯 DOM，无 canvas。

import { useRef, useState } from 'react';

const COLS = 12;
const ROWS = 12;
const RADIUS = 0.28; // 影响半径，占舞台宽度的比例

export default function DotField() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.PointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handleMove}
      onPointerLeave={() => setPointer(null)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        placeItems: 'center',
        width: '100%',
        height: '100%',
        padding: '8%',
        touchAction: 'none',
      }}
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const cx = ((i % COLS) + 0.5) / COLS;
        const cy = (Math.floor(i / COLS) + 0.5) / ROWS;
        const dist = pointer ? Math.hypot(cx - pointer.x, cy - pointer.y) : Infinity;
        const t = Math.max(0, 1 - dist / RADIUS);
        return (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: t > 0.05 ? 'var(--mei-orange)' : 'var(--mei-ink)',
              opacity: 0.25 + t * 0.75,
              transform: `scale(${1 + t * 1.6})`,
              transition: 'transform 0.18s ease-out, opacity 0.18s ease-out, background-color 0.18s',
            }}
          />
        );
      })}
    </div>
  );
}
