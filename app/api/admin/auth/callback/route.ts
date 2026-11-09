import { cookies } from "next/headers";
import { adminAuth } from "@/lib/admin/config";
import { STATE_COOKIE, finishLogin } from "@/lib/admin/github";
import { RateLimiter, SESSION_COOKIE, SESSION_TTL_SECONDS, signSession } from "@/lib/admin/session";

// GitHub sends the browser back here. Checks state, exchanges the code, applies the
// allowlist, and sets the admin session cookie. The GitHub token is not kept.
export const dynamic = "force-dynamic";

// Per-IP cap on callback attempts (in memory, per Worker instance).
const limiter = new RateLimiter(10, 15 * 60 * 1000);

function clientIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function redirectTo(url: URL, path: string, setCookies: string[] = []) {
  const headers = new Headers({ Location: new URL(path, url).toString(), "Cache-Control": "no-store" });
  // The state cookie is single use.
  headers.append("Set-Cookie", `${STATE_COOKIE}=; Path=/api/admin/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  for (const c of setCookies) headers.append("Set-Cookie", c);
  return new Response(null, { status: 303, headers });
}

export async function GET(request: Request) {
  const auth = adminAuth();
  if (!auth) return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  if (auth.mode === "dev") return redirectTo(url, "/admin");
  if (limiter.limited(clientIp(request))) return redirectTo(url, "/admin/login?error=limited");

  const result = await finishLogin(auth, {
    code: url.searchParams.get("code"),
    state: url.searchParams.get("state"),
    error: url.searchParams.get("error"),
    stateCookie: (await cookies()).get(STATE_COOKIE)?.value,
    origin: url.origin,
  });
  if (!result.ok) return redirectTo(url, `/admin/login?error=${result.reason}`);

  const session = await signSession(auth.sessionSecret, result.user);
  return redirectTo(url, result.next, [
    `${SESSION_COOKIE}=${session}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
  ]);
}
