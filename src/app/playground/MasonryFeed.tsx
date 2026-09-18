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

    const measure = (cell: HTMLElement) => {
      const content = cell.firstElementChild as HTMLElement | null;
      if (!content) return;
      const height = content.getBoundingClientRect().height;
      cell.style.gridRowEnd = `span ${Math.max(1, Math.ceil((height + GAP) / ROW))}`;
    };

    // 内容高度变化（字体加载、图片解码、交互组件变化）时重新测
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cell = (entry.target as HTMLElement).parentElement;
        if (cell) measure(cell);
      }
    });
    const track = (cell: Element) => {
      measure(cell as HTMLElement);
      if (cell.firstElementChild) resizeObserver.observe(cell.firstElementChild);
    };

    Array.from(feed.children).forEach(track);
    // 直接写 DOM 属性：只是切换一条 CSS 规则，没必要为此多渲染一次
    feed.dataset.ready = '';

    // 之后新加进来的格子（热更新、以后的筛选 / 加载更多）也要测量并跟踪，
    // 否则它只占一行 4px，内容溢出、容器也不会跟着变高
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) track(node);
        });
      }
    });
    mutationObserver.observe(feed, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div ref={feedRef} className={styles.feed}>
      {children}
    </div>
  );
}
