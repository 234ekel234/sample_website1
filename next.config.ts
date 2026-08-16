import type { NextConfig } from "next";
import { REMOTE_IMAGE_HOSTS } from "./src/lib/sheet-image";

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
    // Built from the same list src/lib/sheet-image.ts filters against, so the
    // hosts Next will load and the hosts we let through a sheet cell cannot
    // drift apart. A URL Next has not been told about throws during render, so
    // a host allowed in one place but not the other 500s the page.
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
