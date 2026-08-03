import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Board of Trustees moved from its own page into a section of About.
  // /board was live, indexed and linked externally, so it redirects rather than
  // 404s. Permanent (308) so search engines transfer the ranking.
  async redirects() {
    return [{ source: "/board", destination: "/about#board", permanent: true }];
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
