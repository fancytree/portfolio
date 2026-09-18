'use client';

// 瀑布流容器：CSS Grid + 细行高。每个格子按自身内容高度占若干行（grid-row-end: span N），
// 这样既能像瀑布流一样错落，又能让宽卡片横跨两列（多栏布局做不到这一点）。
// 测量完成前按普通网格排布，避免水合前卡片互相重叠。

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './playground.module.css';

const ROW = 4; // 与 CSS 中 grid-auto-rows 一致
const GAP = 20; // 卡片之间的纵向间距

export default function MasonryFeed({ children }: { children: ReactNode }) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const cells = Array.from(feed.children) as HTMLElement[];

    const measure = (cell: HTMLElement) => {
      const content = cell.firstElementChild as HTMLElement | null;
      if (!content) return;
      const height = content.getBoundingClientRect().height;
      cell.style.gridRowEnd = `span ${Math.max(1, Math.ceil((height + GAP) / ROW))}`;
    };

    cells.forEach(measure);
    // 直接写 DOM 属性：只是切换一条 CSS 规则，没必要为此多渲染一次
    feed.dataset.ready = '';

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cell = (entry.target as HTMLElement).parentElement;
        if (cell) measure(cell);
      }
    });
    cells.forEach((cell) => cell.firstElementChild && observer.observe(cell.firstElementChild));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={feedRef} className={styles.feed}>
      {children}
    </div>
  );
}
