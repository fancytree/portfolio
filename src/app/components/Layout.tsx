'use client';

// 页面基础布局组件
// 使用方法：在页面中用 <Layout>...</Layout> 包裹内容

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "../river/SiteChrome";
import river from "../river/river.module.css";
import CustomCursor from "./CustomCursor";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Footer 固定贴底（z 轴在正文下方），正文预留等高的滚动距离，
  // 滚动到底部时空白让出，正文上滑“露出”固定在底部的 footer。
  const footerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const pathname = usePathname();

  // 导航和 footer 的左右边界跟着当前页面的内容走：页面的版式各不相同
  // （带左侧目录的 case 页、居中窄版的旧页面，边距也不一样），所以量出来而不是写死。
  // 左边：有左侧目录时对齐目录里的文字，否则对齐正文；右边：对齐正文。
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const main = root.querySelector("main");
    if (!main) return;
    const visible = (el: Element | null): el is HTMLElement => !!el && el.getBoundingClientRect().width > 0;
    const measure = () => {
      const vw = document.documentElement.clientWidth;
      // the text column. Case Kit pages: the first block of a section that sets its
      // own measure. Older case pages: the block holding the page title.
      let column: DOMRect | null = null;
      if (main.querySelector(".case-kit")) {
        for (const el of main.querySelectorAll<HTMLElement>("section, section > div, section > div > div")) {
          if (!visible(el)) continue;
          const max = getComputedStyle(el).maxWidth;
          if (max !== "none" && !max.endsWith("%")) {
            column = el.getBoundingClientRect();
            break;
          }
        }
      }
      const title = [...main.querySelectorAll("h1")].find(visible)?.parentElement;
      if (!column && title) {
        const box = title.getBoundingClientRect();
        const cs = getComputedStyle(title);
        column = new DOMRect(box.left + parseFloat(cs.paddingLeft), 0, box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), 0);
      }
      if (!column) {
        // no title either: the page's own box, inside its padding
        const box = main.getBoundingClientRect();
        const cs = getComputedStyle(main);
        column = new DOMRect(box.left + parseFloat(cs.paddingLeft), 0, box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), 0);
      }
      let left = column.left;
      const rail = main.querySelector(".case-rail-sticky");
      if (visible(rail)) left = rail.getBoundingClientRect().left + parseFloat(getComputedStyle(rail).paddingLeft);
      root.style.setProperty("--nav-left", `${Math.max(16, Math.round(left))}px`);
      root.style.setProperty("--nav-right", `${Math.max(16, Math.round(vw - column.right))}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(main);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    // 减 2px 让正文轻微覆盖 footer 顶部边缘，避免子像素取整导致的白色缝隙
    const update = () => setFooterHeight(Math.max(0, el.getBoundingClientRect().height - 2));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // /demos/* 是给 iframe 嵌入和全屏体验用的裸舞台：
  // 导航、footer、居中容器都会挤占 demo 的空间，这里一律不渲染。
  // 首页（/）和 Playground 用河流首页的独立版面，自带 header / footer。
  if (pathname?.startsWith("/demos/") || pathname === "/" || pathname === "/playground") {
    return <>{children}</>;
  }

  // 样式页自己排左侧导航和内容，不再套全站的居中窄容器。
  const caseFrame = ["/design-system", "/projects/case-kit", "/projects/def-erp-kit", "/projects/def-miniprogram-kit", "/projects/jobnova-kit", "/projects/connectnova-kit", "/projects/procurement-agent-kit", "/projects/procurement-agent-decisions", "/projects/memq-kit", "/projects/mono", "/playground/design-should-run"].includes(pathname ?? "");

  return (
    // 外层容器：全屏高度，背景色和基础字体
    <div ref={rootRef} id="top" className="mei-page-root min-h-screen bg-white text-zinc-900">
      {/* 顶部导航栏：与首页同一个 header。外层负责吸顶（header 自己的 sticky 只在
          它的父元素里生效），river.root 提供配色和字体变量。高度见 --site-nav-h。 */}
      {/* --river-bg 换成作品集页面自己的底色，导航和正文是同一张纸 */}
      <div
        className={`sticky top-0 z-50 ${river.root}`}
        style={{ minHeight: 0, ["--river-bg" as string]: "var(--case-white, #ffffff)" }}
      >
        <SiteHeader frame={river.siteFrame} />
      </div>
      <CustomCursor />

      {/* 正文：相对定位 + 不透明背景，盖住下方 fixed footer；底部用 margin 留出 footer 高度的滚动距离。
          margin 不属于白色背景区域，所以滚动到底时不会把 fixed footer 遮住。 */}
      <div className="mei-page-surface relative z-10 bg-white" style={{ marginBottom: footerHeight }}>
        {/* 主体内容区域：导航吸顶且占位，不再需要顶部内边距；水平居中、限制最大宽度 max-w-7xl */}
        <main
          className={
            caseFrame
              ? "flex w-full min-w-0 flex-1"
              : "mx-auto flex min-w-0 max-w-7xl flex-1 px-4 pb-0 sm:px-6 lg:px-8"
          }
        >
          {/* min-w-0：flex 子项可窄于内容最小宽度，子页面内视口全宽突破计算才正确 */}
          <div className="w-full min-w-0">{children}</div>
        </main>
      </div>

      {/* 全站底部：与首页同一个 footer（深色条 + 联系方式），固定贴底，正文滚完后露出。
          river.root 提供它的配色、字体变量；min-height 归零，免得撑满一屏。 */}
      <div ref={footerRef} className={`fixed inset-x-0 bottom-0 z-0 ${river.root}`} style={{ minHeight: 0 }}>
        <SiteFooter frame={river.siteFrame} />
      </div>
    </div>
  );
}
