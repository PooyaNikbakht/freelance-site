import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Like } from "@/lib/messages";

/**
 * The D1 database bound as `DB`, or null when there isn't one: under plain
 * `next build`, or if the binding is missing. On the Worker the binding comes from
 * wrangler.jsonc; under `npm run dev` it is Wrangler's local copy in .wrangler/state
 * (set up by initOpenNextCloudflareForDev in next.config.ts).
 */
export async function getDb(): Promise<D1Like | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as { DB?: D1Like }).DB;
    return db && typeof db.prepare === "function" ? db : null;
  } catch {
    return null;
  }
}
