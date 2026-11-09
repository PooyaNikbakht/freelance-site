// Which admin features are switched on, from environment variables read at request
// time (on Cloudflare these are Worker secrets, available through process.env).

import { type GitHubAuthConfig, parseList } from "./github";

const isProduction = () => process.env.NODE_ENV === "production";

/**
 * - "dev": `npm run dev` and other non-production runs. No login; the admin shows a
 *   "dev mode, not protected" badge.
 * - "github": production with the GitHub sign-in configured.
 * - null: production without it. Every /admin route returns 404.
 */
export type AdminAuth = { mode: "dev" } | ({ mode: "github" } & GitHubAuthConfig);

export function adminAuth(): AdminAuth | null {
  if (!isProduction()) return { mode: "dev" };
  // The Keystatic GitHub App can double as the login app (add our callback URL to it),
  // so its credentials are the fallback.
  const clientId = process.env.ADMIN_GITHUB_CLIENT_ID || process.env.KEYSTATIC_GITHUB_CLIENT_ID || "";
  const clientSecret = process.env.ADMIN_GITHUB_CLIENT_SECRET || process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!clientId || !clientSecret || sessionSecret.length < 32) return null;
  const logins = parseList(process.env.ADMIN_GITHUB_LOGINS);
  return {
    mode: "github",
    clientId,
    clientSecret,
    sessionSecret,
    allowedLogins: logins.length ? logins : ["PooyaNikbakht"],
    allowedIds: parseList(process.env.ADMIN_GITHUB_IDS)
      .map(Number)
      .filter((n) => Number.isSafeInteger(n) && n > 0),
  };
}

/**
 * The Keystatic editor (/keystatic and /api/keystatic). Always on in development
 * (local mode, edits files in content/). In production it runs in GitHub mode and
 * is on only when the GitHub app's credentials are set.
 */
export function keystaticEnabled(): boolean {
  if (!isProduction()) return true;
  return Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && (process.env.KEYSTATIC_SECRET ?? "").length >= 32,
  );
}

/** Salt for hashing sender IPs. */
export function ipHashSalt(): string {
  return process.env.IP_HASH_SALT || process.env.ADMIN_SESSION_SECRET || "pooya-site-ip-salt";
}
