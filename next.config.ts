import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Board of Trustees moved from its own page into a section of About.
  // /board was live, indexed and linked externally, so it redirects rather than
  // 404s. Permanent (308) so search engines transfer the ranking.
  async redirects() {
    return [
      { source: "/board", destination: "/about#board", permanent: true },
      // pmafi.vercel.app is the project's auto-generated production alias, not
      // a domain Vercel lets you configure — so it answers 200 with the full
      // site and competes with www.pmafi.org as duplicate content. Send it to
      // the real domain instead.
      //
      // The host is matched exactly, so per-deployment preview URLs
      // (pmafi-<hash>-....vercel.app) are unaffected and stay browsable.
      {
        source: "/:path*",
        has: [{ type: "host", value: "pmafi.vercel.app" }],
        destination: "https://www.pmafi.org/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Google Drive shared images (converted to direct display URLs)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
