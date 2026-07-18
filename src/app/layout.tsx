import type { Metadata } from "next";
import { dmMono, fraunces, geistMono, geistSans, inter, nunito } from "./fonts";
import "./globals.css";
// 引入页面基础布局组件，用于包裹整个应用内容
import Layout from "./components/Layout";

export const metadata: Metadata = {
  title: "Mei Chai — UX & Product Designer",
  description: "Portfolio of Mei Chai, a UX and Product Designer specializing in AI-powered products and 0-to-1 design.",
  // 浏览器 Tab 图标
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${fraunces.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body className="antialiased">
        {/* 使用自定义布局组件包裹整个应用的 children */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
