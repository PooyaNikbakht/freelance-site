import type { Metadata } from "next";
import Link from "next/link";
import { updateStatus } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatDate, statusLabels } from "@/components/admin/format";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import { countUnread, isMessageFilter, listMessages, type Message, type MessageFilter } from "@/lib/messages";

export const metadata: Metadata = { title: "Messages" };

const PAGE_SIZE = 50;

const filterLabels: Record<MessageFilter, string> = { inbox: "Inbox", new: "New", read: "Read", archived: "Archived", all: "All" };

type Search = Promise<Record<string, string | string[] | undefined>>;

function href(filter: MessageFilter, q: string, page = 1) {
  const params = new URLSearchParams();
  if (filter !== "inbox") params.set("status", filter);
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return `/admin/messages${s ? `?${s}` : ""}`;
}

export default async function MessagesPage({ searchParams }: { searchParams: Search }) {
  const admin = await requireAdmin("/admin/messages");
  const params = await searchParams;
  const filter: MessageFilter = isMessageFilter(params.status) ? params.status : "inbox";
  const q = typeof params.q === "string" ? params.q.slice(0, 200) : "";
  const page = Math.max(1, Number(params.page) || 1);
  const db = await getDb();

  let messages: Message[] = [];
  let hasMore = false;
  let unread: number | null = null;
  let loadError = false;
  if (db) {
    try {
      [{ messages, hasMore }, unread] = await Promise.all([
        listMessages(db, { filter, query: q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
        countUnread(db),
      ]);
    } catch (err) {
      console.error("[admin] Could not read messages", err);
      loadError = true;
    }
  }
  const current = href(filter, q, page);

  return (
    <AdminShell active="messages" unread={unread} admin={admin}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        {unread !== null ? <p className="text-sm text-muted">{unread} unread</p> : null}
      </div>

      {params.deleted ? (
        <p role="status" className="mt-4 rounded-[8px] border border-border bg-background px-4 py-2 text-sm">
          Message deleted.
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Filter messages" className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {(Object.keys(filterLabels) as MessageFilter[]).map((f) => (
            <Link
              key={f}
              href={href(f, q)}
              aria-current={f === filter ? "page" : undefined}
              className={`inline-flex min-h-10 shrink-0 items-center rounded-[8px] border px-3 text-sm font-medium ${
                f === filter ? "border-accent bg-accent-tint text-ink" : "border-border bg-background text-muted hover:text-ink"
              }`}
            >
              {filterLabels[f]}
            </Link>
          ))}
        </nav>
        <form role="search" action="/admin/messages" className="flex gap-2">
          {filter !== "inbox" ? <input type="hidden" name="status" value={filter} /> : null}
          <label htmlFor="q" className="sr-only">
            Search messages
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search name, email, text"
            className="min-h-10 w-full min-w-0 rounded-[8px] border border-border bg-background px-3 text-sm text-ink placeholder:text-muted/80 focus-visible:border-accent sm:w-64"
          />
          <button type="submit" className="min-h-10 shrink-0 rounded-[8px] bg-accent px-4 text-sm font-semibold text-accent-ink hover:opacity-90">
            Search
          </button>
        </form>
      </div>

      {!db ? (
        <Empty title="No database connected">
          The D1 binding <code className="font-mono">DB</code> isn&apos;t available, so messages are only emailed. See the README,
          &quot;Messages inbox&quot;.
        </Empty>
      ) : loadError ? (
        <Empty title="Couldn't load messages">
          The database didn&apos;t answer. If this is a new setup, apply the migrations (<code className="font-mono">npm run db:migrate:local</code> or{" "}
          <code className="font-mono">db:migrate:remote</code>).
        </Empty>
      ) : messages.length === 0 ? (
        <Empty title={q ? "No matches" : "Nothing here"}>
          {q ? `No messages match "${q}".` : filter === "inbox" ? "New contact form messages will show up here." : `No ${filterLabels[filter].toLowerCase()} messages.`}
        </Empty>
      ) : (
        <ul className="mt-5 divide-y divide-border overflow-hidden rounded-[12px] border border-border bg-background">
          {messages.map((m) => (
            <li key={m.id} className="flex items-start gap-3 p-4">
              <span
                aria-hidden="true"
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.status === "new" ? "bg-accent" : "bg-transparent"}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <Link href={`/admin/messages/${m.id}`} className={`truncate hover:text-accent ${m.status === "new" ? "font-bold" : "font-medium"}`}>
                    {m.name}
                    <span className="sr-only"> ({statusLabels[m.status]})</span>
                  </Link>
                  <time dateTime={m.createdAt} className="shrink-0 font-mono text-xs text-muted">
                    {formatDate(m.createdAt)}
                  </time>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink">
                  {m.need}
                  {m.business ? <span className="text-muted"> · {m.business}</span> : null}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{m.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {m.status === "archived" ? <Badge>Archived</Badge> : null}
                  {!m.emailSent && m.emailError ? <Badge tone="danger">Email not sent</Badge> : null}
                  <QuickStatus message={m} back={current} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {page > 1 || hasMore ? (
        <nav aria-label="Pages" className="mt-4 flex justify-between text-sm font-semibold">
          {page > 1 ? (
            <Link href={href(filter, q, page - 1)} className="text-accent hover:underline">
              Newer
            </Link>
          ) : (
            <span />
          )}
          {hasMore ? (
            <Link href={href(filter, q, page + 1)} className="text-accent hover:underline">
              Older
            </Link>
          ) : null}
        </nav>
      ) : null}
    </AdminShell>
  );
}

function QuickStatus({ message, back }: { message: Message; back: string }) {
  const next = message.status === "new" ? { status: "read", label: "Mark read" } : message.status === "read" ? { status: "archived", label: "Archive" } : null;
  if (!next) return null;
  return (
    <form action={updateStatus} className="ml-auto">
      <input type="hidden" name="id" value={message.id} />
      <input type="hidden" name="status" value={next.status} />
      <input type="hidden" name="back" value={back} />
      <button type="submit" className="min-h-9 rounded-[8px] border border-border px-3 text-xs font-medium text-muted hover:border-accent hover:text-ink">
        {next.label}
        <span className="sr-only">: {message.name}</span>
      </button>
    </form>
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "danger" }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] ${
        tone === "danger" ? "border-danger text-danger" : "border-border text-muted"
      }`}
    >
      {children}
    </span>
  );
}

function Empty({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-[12px] border border-dashed border-border bg-background p-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{children}</p>
    </div>
  );
}
