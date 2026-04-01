// 页面基础布局组件
// 使用方法：在页面中用 <Layout>...</Layout> 包裹内容

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatWidget from "./AIChatWidget";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    // 外层容器：全屏高度，背景色和基础字体
    <div className="min-h-screen text-zinc-900" style={{ backgroundColor: '#FFFFFF' }}>
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主体内容区域：为 fixed 导航预留顶部内边距（pt-20 = 80px，适应 72px 高度的导航栏），水平居中、限制最大宽度 max-w-7xl */}
      <main className="mx-auto flex max-w-7xl flex-1 px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        {/* 这里包裹 children，后续页面内容会渲染在这里 */}
        <div className="w-full">{children}</div>
      </main>

      {/* 全站底部：Let's work together + 版权信息 */}
      <Footer />

      {/* 右下角 AI Chat */}
      <AIChatWidget />
    </div>
  );
}

