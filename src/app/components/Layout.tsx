'use client';

// 页面基础布局组件
// 使用方法：在页面中用 <Layout>...</Layout> 包裹内容

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Footer 固定贴底（z 轴在正文下方），正文预留等高的滚动距离，
  // 滚动到底部时空白让出，正文上滑“露出”固定在底部的 footer。
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const update = () => setFooterHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // 外层容器：全屏高度，背景色和基础字体
    <div className="min-h-screen text-zinc-900" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 正文：相对定位 + 不透明背景，盖住下方 fixed footer；底部用 margin 留出 footer 高度的滚动距离。
          margin 不属于白色背景区域，所以滚动到底时不会把 fixed footer 遮住。 */}
      <div className="relative z-10 bg-white" style={{ marginBottom: footerHeight }}>
        {/* 主体内容区域：为 fixed 导航预留顶部内边距（pt-12 = 48px，适应 48px 高度的导航栏），水平居中、限制最大宽度 max-w-7xl */}
        <main className="mx-auto flex min-w-0 max-w-7xl flex-1 px-4 pt-12 pb-0 sm:px-6 lg:px-8">
          {/* min-w-0：flex 子项可窄于内容最小宽度，子页面内视口全宽突破计算才正确 */}
          <div className="w-full min-w-0">{children}</div>
        </main>
      </div>

      {/* 全站底部：Let's work together + 版权信息，固定贴底，正文滚完后露出 */}
      <div ref={footerRef} className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
    </div>
  );
}
