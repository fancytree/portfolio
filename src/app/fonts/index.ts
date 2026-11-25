import localFont from "next/font/local";

// 使用 next/font/local 自托管字体，避免 Turbopack 在构建时请求 Google Fonts
// 失败（@vercel/turbopack-next/internal/font/google/font 无法解析）。

// The site uses three families: Oswald for headings, Geist for copy, Plex Mono for labels and code.
export const geistSans = localFont({
  src: "./geist-sans.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const oswald = localFont({
  src: "./oswald-latin-wght-normal.woff2",
  variable: "--font-oswald",
  weight: "200 700",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "./ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

// Not a portfolio font: two embedded product demos are set in Inter. Loaded only where used.
export const inter = localFont({
  src: "./inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "300 500",
  display: "swap",
  preload: false,
});
