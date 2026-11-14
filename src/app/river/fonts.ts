import localFont from "next/font/local";

// Self-hosted, same as the rest of the site (see ../fonts/index.ts).
export const plexMono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-river-mono",
  display: "swap",
});
