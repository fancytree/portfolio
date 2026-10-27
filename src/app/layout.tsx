import type { Metadata } from "next";
import { dmMono, geistMono, geistSans, inter, nunito, oswald } from "./fonts";
import "./globals.css";
// 引入页面基础布局组件，用于包裹整个应用内容
import Layout from "./components/Layout";

export const metadata: Metadata = {
  title: "Mei Chai — Product Designer · AI-Native Products & Design Systems",
  description: "Product designer with 6+ years in UX and user research. Selected work in AI-native SaaS, design systems, human-in-the-loop workflows, and data-informed iteration.",
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
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${inter.variable} ${dmMono.variable} ${oswald.variable}`}
    >
      <body className="antialiased">
        {/* 使用自定义布局组件包裹整个应用的 children */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
