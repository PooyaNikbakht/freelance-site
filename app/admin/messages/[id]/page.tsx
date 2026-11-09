import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { removeMessage, updateStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatDate, statusLabels } from "@/components/admin/format";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import { countUnread, getMessage, type MessageStatus } from "@/lib/messages";

export const metadata: Metadata = { title: "Message" };

const button =
  "inline-flex min-h-10 items-center justify-center rounded-[8px] border border-border bg-background px-3 text-sm font-medium text-ink hover:border-accent";

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin(`/admin/messages/${encodeURIComponent(id)}`);
  const db = await getDb();
  if (!db) notFound();
  const [message, unread] = await Promise.all([getMessage(db, id), countUnread(db).catch(() => null)]);
  if (!message) notFound();

  const subject = `Re: ${message.need}`;
  const quoted = message.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const mailto = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Hi ${message.name.split(" ")[0]},\n\n\n\nOn ${formatDate(message.createdAt)} you wrote:\n${quoted}`,
  )}`;

  const statusButton = (status: MessageStatus, label: string) => (
    <form action={updateStatus}>
      <input type="hidden" name="id" value={message.id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={button}>
        {label}
      </button>
    </form>
  );

  const details: [string, string][] = [
    ["Email", message.email],
    ["Business or website", message.business || "Not given"],
    ["Needs", message.need],
    ["Budget", message.budget || "Not given"],
    ["Timing", message.timing || "Not given"],
    ["Received", formatDate(message.createdAt)],
  ];

  return (
    <AdminShell active="messages" unread={unread} admin={admin}>
      <Link href="/admin/messages" className="text-sm font-semibold text-accent hover:underline">
        All messages
      </Link>

      {!message.emailSent && message.emailError ? (
        <div role="note" className="mt-4 rounded-[8px] border border-danger bg-background px-4 py-3 text-sm">
          <p className="font-semibold text-danger">The notification email for this message wasn&apos;t sent.</p>
          <p className="mt-1 break-words text-muted">{message.emailError}</p>
        </div>
      ) : null}

      <article className="mt-4 rounded-[12px] border border-border bg-background">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight break-words">{message.name}</h1>
            <p className="mt-0.5 text-sm text-muted">
              Status: <span className="font-medium text-ink">{statusLabels[message.status]}</span>
            </p>
          </div>
          <a href={mailto} className="inline-flex min-h-10 items-center rounded-[8px] bg-accent px-4 text-sm font-semibold text-accent-ink hover:opacity-90">
            Reply
          </a>
        </header>
        <dl className="grid gap-x-6 gap-y-3 p-5 text-sm sm:grid-cols-2">
          {details.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{k}</dt>
              <dd className="mt-0.5 break-words">{k === "Email" ? <a href={`mailto:${v}`} className="text-accent underline underline-offset-2">{v}</a> : v}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-border p-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Message</h2>
          <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
        </div>
      </article>

      <div className="mt-4 flex flex-wrap items-start gap-2">
        {message.status !== "read" ? statusButton("read", message.status === "archived" ? "Move to inbox" : "Mark read") : null}
        {message.status === "read" ? statusButton("new", "Mark unread") : null}
        {message.status !== "archived" ? statusButton("archived", "Archive") : null}
        <details className="ml-auto">
          <summary className="inline-flex min-h-10 cursor-pointer list-none items-center rounded-[8px] border border-border bg-background px-3 text-sm font-medium text-danger hover:border-danger [&::-webkit-details-marker]:hidden">
            Delete
          </summary>
          <form action={removeMessage} className="mt-2 rounded-[8px] border border-danger bg-background p-3 text-sm">
            <input type="hidden" name="id" value={message.id} />
            <p>Delete this message for good? This can&apos;t be undone.</p>
            <button type="submit" className="mt-2 min-h-10 rounded-[8px] bg-danger px-3 font-semibold text-background hover:opacity-90">
              Delete permanently
            </button>
          </form>
        </details>
      </div>

      <p className="mt-6 font-mono text-xs text-muted">
        ID {message.id}
        {message.userAgent ? ` · ${message.userAgent}` : ""}
      </p>
    </AdminShell>
  );
}
