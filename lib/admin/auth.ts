import "server-only";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { type AdminAuth, adminAuth } from "./config";
import { type AdminSession, SESSION_COOKIE, verifySession } from "./session";

export type AdminContext = { auth: AdminAuth; user: AdminSession | null };

/** The admin auth settings, or a 404 when the admin is switched off. */
export function requireAdminEnabled(): AdminAuth {
  const auth = adminAuth();
  if (!auth) notFound();
  return auth;
}

/** The signed-in GitHub user, or null. Dev mode has no session. */
export async function currentUser(auth: AdminAuth): Promise<AdminSession | null> {
  if (auth.mode !== "github") return null;
  return verifySession(auth.sessionSecret, (await cookies()).get(SESSION_COOKIE)?.value);
}

/** For admin pages and server actions: 404 when switched off, the login page when signed out. */
export async function requireAdmin(next = "/admin"): Promise<AdminContext> {
  const auth = requireAdminEnabled();
  if (auth.mode === "dev") return { auth, user: null };
  const user = await currentUser(auth);
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  return { auth, user };
}
