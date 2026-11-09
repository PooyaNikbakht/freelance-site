import { adminAuth } from "@/lib/admin/config";
import { STATE_COOKIE, STATE_TTL_SECONDS, startLogin } from "@/lib/admin/github";

// Starts "Sign in with GitHub": sets a short-lived signed state cookie and sends the
// browser to GitHub's authorize page.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = adminAuth();
  if (!auth) return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  if (auth.mode === "dev") return Response.redirect(new URL("/admin", url), 303);

  const { url: authorize, cookie } = await startLogin(auth, { origin: url.origin, next: url.searchParams.get("next") ?? "/admin" });
  const headers = new Headers({ Location: authorize, "Cache-Control": "no-store" });
  headers.append(
    "Set-Cookie",
    `${STATE_COOKIE}=${cookie}; Path=/api/admin/auth; Max-Age=${STATE_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
  );
  return new Response(null, { status: 302, headers });
}
