import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every route is prerendered at build time. The static assets cache serves those
// prerendered pages and OG images straight from Workers static assets, with no
// KV or R2 binding to set up. Switch to the R2 cache if pages ever use ISR.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
