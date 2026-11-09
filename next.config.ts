import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Project pages from the old Google Sites site (www.pooya.website/projects/<slug>).
// Each one now lives at /work/research/<slug>, with the same slug.
const oldProjectSlugs = [
  "square-packing-with-rotation",
  "server-consolidation-fault-tolerant-online-bin-packing",
  "scor-an-online-stack-overflow-code-recommender",
  "medical-data-mining-for-predicting-the-length-of-stay-at-the-hospital",
  "an-analysis-on-the-outbreak-of-covid-19",
  "sentiment-analysis-of-code-review-questions",
  "shahragah-a-social-network-for-businesses",
];

const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

export default function config(phase: string): NextConfig {
  // Under `next dev`, give getCloudflareContext() Wrangler's local bindings (the D1
  // database in .wrangler/state), the same bindings the Worker gets in production.
  if (phase === PHASE_DEVELOPMENT_SERVER) initOpenNextCloudflareForDev();
  return {
    agentRules: false,
    poweredByHeader: false,
    // Keystatic's GitHub setup runs at http://127.0.0.1:3020/keystatic; without this, dev
    // blocks the page's scripts from that origin and the editor loads blank.
    allowedDevOrigins: ["127.0.0.1"],
    // keystatic.config.ts runs in the browser too, so the storage switch must be inlined.
    env: { KEYSTATIC_STORAGE: process.env.KEYSTATIC_STORAGE ?? "" },
    // The admin and the content editor are private; keep them out of search engines.
    async headers() {
      return [
        { source: "/admin", headers: noindex },
        { source: "/admin/:path*", headers: noindex },
        { source: "/keystatic", headers: noindex },
        { source: "/keystatic/:path*", headers: noindex },
        { source: "/api/:path*", headers: noindex },
      ];
    },
    // Permanent (308) redirects from the old site's URLs. OpenNext on Cloudflare
    // applies these in the Worker, before routing, the same way `next start` does.
    async redirects() {
      return [
        { source: "/home", destination: "/", permanent: true },
        { source: "/projects", destination: "/work#research", permanent: true },
        { source: "/work/research", destination: "/work#research", permanent: true },
        // Category filter links like /work?category=booking go to the static category page.
        {
          source: "/work",
          has: [{ type: "query", key: "category", value: "(?<category>[a-z-]+)" }],
          destination: "/work/category/:category",
          permanent: false,
        },
        ...oldProjectSlugs.map((slug) => ({
          source: `/projects/${slug}`,
          destination: `/work/research/${slug}`,
          permanent: true,
        })),
      ];
    },
    images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
    turbopack: {
      root: process.cwd(),
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
  };
}
