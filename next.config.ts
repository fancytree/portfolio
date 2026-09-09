import type { NextConfig } from "next";

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    if (!posthogHost) {
      return [];
    }

    const posthogAssetsHost = new URL(posthogHost);
    posthogAssetsHost.hostname = posthogAssetsHost.hostname.replace(
      ".i.",
      "-assets.i.",
    );

    return [
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
