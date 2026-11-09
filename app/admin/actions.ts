"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { SESSION_COOKIE } from "@/lib/admin/session";
import { getDb } from "@/lib/db";
import { deleteMessage, isMessageStatus, setMessageStatus } from "@/lib/messages";

// Server actions are public POST endpoints, so each one checks the session itself.
// Next.js also rejects cross-site action posts by comparing Origin and Host.

export async function logout() {
  (await cookies()).set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  redirect("/admin/login?signedOut=1");
}

function backTo(value: FormDataEntryValue | null, fallback: string): string {
  return typeof value === "string" && /^\/admin\/messages(\/[\w-]+)?(\?[^\s]*)?$/.test(value) ? value : fallback;
}

export async function updateStatus(formData: FormData) {
  await requireAdmin("/admin/messages");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status");
  const db = await getDb();
  if (db && id && isMessageStatus(status)) await setMessageStatus(db, id, status);
  redirect(backTo(formData.get("back"), `/admin/messages/${encodeURIComponent(id)}`));
}

export async function removeMessage(formData: FormData) {
  await requireAdmin("/admin/messages");
  const id = String(formData.get("id") ?? "");
  const db = await getDb();
  if (db && id) await deleteMessage(db, id);
  redirect("/admin/messages?deleted=1");
}
