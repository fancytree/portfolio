import localFont from "next/font/local";

// 使用 next/font/local 自托管字体，避免 Turbopack 在构建时请求 Google Fonts
// 失败（@vercel/turbopack-next/internal/font/google/font 无法解析）。

export const geistSans = localFont({
  src: "./geist-sans.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const geistMono = localFont({
  src: "./geist-mono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const nunito = localFont({
  src: "./nunito-latin-wght-normal.woff2",
  variable: "--font-nunito",
  weight: "400 800",
  display: "swap",
});

export const fraunces = localFont({
  src: [
    {
      path: "./fraunces-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "./fraunces-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  weight: "400 600",
  display: "swap",
});

export const inter = localFont({
  src: "./inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "300 500",
  display: "swap",
});

export const dmMono = localFont({
  src: [
    {
      path: "./dm-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./dm-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-dm-mono",
  display: "swap",
});
