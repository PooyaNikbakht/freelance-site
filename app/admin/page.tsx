import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/auth";
import { keystaticEnabled } from "@/lib/admin/config";
import { getDb } from "@/lib/db";
import { countUnread } from "@/lib/messages";

export const metadata: Metadata = { title: "Dashboard" };

const card = "block rounded-[12px] border border-border bg-background p-5 sm:p-6";

export default async function AdminDashboard() {
  const admin = await requireAdmin("/admin");
  const db = await getDb();
  const unread = db ? await countUnread(db).catch(() => null) : null;
  const editor = keystaticEnabled();

  return (
    <AdminShell active="dashboard" unread={unread} admin={admin}>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/messages" className={`${card} hover:border-accent`}>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Messages</p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{unread ?? "No inbox"}</p>
          <p className="mt-1 text-sm text-muted">
            {unread === null ? "The D1 database isn't connected. See the README." : unread === 1 ? "unread message" : "unread messages"}
          </p>
          <p className="mt-4 text-sm font-semibold text-accent">Open the inbox</p>
        </Link>
        {editor ? (
          <Link href="/keystatic" prefetch={false} className={`${card} hover:border-accent`}>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Content</p>
            <p className="mt-3 text-lg font-semibold">Edit the site</p>
            <p className="mt-1 text-sm text-muted">Settings, About, services, projects, research, and posts.</p>
            <p className="mt-4 text-sm font-semibold text-accent">Open the editor</p>
          </Link>
        ) : (
          <div className={card}>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Content</p>
            <p className="mt-3 text-lg font-semibold">Editor is off here</p>
            <p className="mt-1 text-sm text-muted">
              Set up Keystatic GitHub mode to edit from anywhere (README, &quot;Edit from anywhere&quot;), or edit locally with
              <code className="font-mono"> npm run dev</code> and push.
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
