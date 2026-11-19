import type { NextConfig } from "next";

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    agentUpgrade: "security",
  },
  async redirects() {
    return [
      // retired case pages now land on their current versions
      { source: "/projects/procurement-agent", destination: "/projects/procurement-agent-kit", permanent: false },
      { source: "/projects/procurement-agent-v2", destination: "/projects/procurement-agent-kit", permanent: false },
      { source: "/projects/def-erp", destination: "/projects/def-erp-kit", permanent: false },
      { source: "/projects/jobnova", destination: "/projects/jobnova-kit", permanent: false },
      { source: "/projects/jobnova-ai-platform", destination: "/projects/jobnova-kit", permanent: false },
      { source: "/projects/jobnova-ai-platform-v2", destination: "/projects/jobnova-kit", permanent: false },
      { source: "/projects/jobnova-ai-platform-v3", destination: "/projects/jobnova-kit", permanent: false },
      { source: "/projects/connectnova", destination: "/projects/connectnova-kit", permanent: false },
      { source: "/projects/memq", destination: "/projects/memq-kit", permanent: false },
      // the river page was built at /river before it became the homepage
      {
        source: "/river",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    // The DEF ERP live demo is a single-page app; its demo routes all serve the same shell.
    const erpDemo = [
      { source: "/portfolio/live/:path*", destination: "/demos/def-erp/index.html" },
      // Purchasing, receiving and storefront-builder showcase pages of the same app.
      { source: "/portfolio/:page(po-detail|po-inbound|receiving|miniprogram-decoration|store-accounts)", destination: "/demos/def-erp/index.html" },
    ];
    if (!posthogHost) {
      return erpDemo;
    }

    const posthogAssetsHost = new URL(posthogHost);
    posthogAssetsHost.hostname = posthogAssetsHost.hostname.replace(
      ".i.",
      "-assets.i.",
    );

    return [
      ...erpDemo,
      {
        source: "/hzn/static/:path*",
        destination: `${posthogAssetsHost.origin}/static/:path*`,
      },
      {
        source: "/hzn/array/:path*",
        destination: `${posthogAssetsHost.origin}/array/:path*`,
      },
      {
        source: "/hzn/:path*",
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
