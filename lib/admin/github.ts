// "Sign in with GitHub" for /admin: a minimal OAuth web flow with fetch and Web Crypto,
// so it runs on Cloudflare Workers. The GitHub token is used once to read the user
// and is never stored. No server-only import: the tests use it directly.

import { randomToken, safeEqual, signToken, verifyToken } from "./session";

export const STATE_COOKIE = "pn_admin_state";
export const STATE_TTL_SECONDS = 10 * 60;
export const CALLBACK_PATH = "/api/admin/auth/callback";

export type GitHubAuthConfig = {
  clientId: string;
  clientSecret: string;
  sessionSecret: string;
  allowedLogins: string[];
  allowedIds: number[];
};

export type GitHubUser = { login: string; id: number };

/** Only same-site admin paths are allowed as a post-login destination. */
export function safeNext(value: unknown): string {
  if (typeof value !== "string" || value.startsWith("//") || value.includes("\\")) return "/admin";
  return /^\/(admin|keystatic)(\/|$|\?)/.test(value) ? value : "/admin";
}

/**
 * The allowlist. When ADMIN_GITHUB_IDS is set, only those numeric ids pass (ids never
 * change, logins can be renamed). Otherwise the login must be in ADMIN_GITHUB_LOGINS,
 * compared case-insensitively; numeric entries there are treated as ids.
 */
export function isAllowedUser(user: GitHubUser, { allowedLogins, allowedIds }: Pick<GitHubAuthConfig, "allowedLogins" | "allowedIds">): boolean {
  if (!user.login || !Number.isSafeInteger(user.id)) return false;
  if (allowedIds.length) return allowedIds.includes(user.id);
  const login = user.login.toLowerCase();
  return allowedLogins.some((entry) => (/^\d+$/.test(entry) ? Number(entry) === user.id : entry.toLowerCase() === login));
}

export function parseList(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[\s,]+/)
    .map((s) => s.trim().replace(/^@/, ""))
    .filter(Boolean);
}

/** Step 1: the GitHub authorize URL and the signed state cookie value that goes with it. */
export async function startLogin(config: GitHubAuthConfig, { origin, next }: { origin: string; next: string }) {
  const state = randomToken(32);
  const cookie = await signToken(config.sessionSecret, "st1", { state, next: safeNext(next) }, STATE_TTL_SECONDS);
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", `${origin}${CALLBACK_PATH}`);
  url.searchParams.set("state", state);
  // Reading the public profile needs no scope.
  url.searchParams.set("allow_signup", "false");
  return { url: url.toString(), cookie };
}

export type LoginResult = { ok: true; user: GitHubUser; next: string } | { ok: false; reason: "state" | "denied" | "github" | "not-allowed" };

/**
 * Step 2, the callback: checks `state` against the signed cookie (CSRF), exchanges
 * the code, reads the user, and applies the allowlist.
 */
export async function finishLogin(
  config: GitHubAuthConfig,
  { code, state, error, stateCookie, origin }: { code: string | null; state: string | null; error: string | null; stateCookie: string | undefined; origin: string },
  fetchImpl: typeof fetch = fetch,
): Promise<LoginResult> {
  const saved = await verifyToken<{ state?: unknown; next?: unknown }>(config.sessionSecret, "st1", stateCookie);
  if (!saved || typeof saved.state !== "string" || !state || !(await safeEqual(state, saved.state))) return { ok: false, reason: "state" };
  if (error || !code) return { ok: false, reason: "denied" };

  let token: string;
  try {
    const res = await fetchImpl("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: `${origin}${CALLBACK_PATH}`,
      }),
    });
    const body = (await res.json()) as { access_token?: unknown };
    if (!res.ok || typeof body.access_token !== "string") return { ok: false, reason: "github" };
    token = body.access_token;
  } catch {
    return { ok: false, reason: "github" };
  }

  let user: GitHubUser;
  try {
    const res = await fetchImpl("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "pooya-site-admin",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const body = (await res.json()) as { login?: unknown; id?: unknown };
    if (!res.ok || typeof body.login !== "string" || typeof body.id !== "number") return { ok: false, reason: "github" };
    user = { login: body.login, id: body.id };
  } catch {
    return { ok: false, reason: "github" };
  }

  if (!isAllowedUser(user, config)) return { ok: false, reason: "not-allowed" };
  return { ok: true, user, next: safeNext(saved.next) };
}
