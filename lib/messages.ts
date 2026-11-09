// Storage for contact form messages in Cloudflare D1. Takes the database as an
// argument (a small structural type), so the tests can pass a fake.

export type D1Result<T = unknown> = { results?: T[]; meta?: { changes?: number } };

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Like {
  prepare(query: string): D1PreparedStatementLike;
}

export const messageStatuses = ["new", "read", "archived"] as const;
export type MessageStatus = (typeof messageStatuses)[number];

/** List filters. "inbox" is everything that isn't archived. */
export const messageFilters = ["inbox", "new", "read", "archived", "all"] as const;
export type MessageFilter = (typeof messageFilters)[number];

export type Message = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  business: string;
  need: string;
  budget: string;
  timing: string;
  message: string;
  ipHash: string;
  userAgent: string;
  status: MessageStatus;
  emailSent: boolean;
  emailError: string | null;
};

export type NewMessage = Pick<Message, "name" | "email" | "business" | "need" | "budget" | "timing" | "message"> & {
  ipHash: string;
  userAgent: string;
};

type Row = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  business: string;
  need: string;
  budget: string;
  timing: string;
  message: string;
  ip_hash: string;
  user_agent: string;
  status: string;
  email_sent: number;
  email_error: string | null;
};

export const USER_AGENT_MAX = 256;

function toMessage(row: Row): Message {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    business: row.business,
    need: row.need,
    budget: row.budget,
    timing: row.timing,
    message: row.message,
    ipHash: row.ip_hash,
    userAgent: row.user_agent,
    status: isMessageStatus(row.status) ? row.status : "new",
    emailSent: Boolean(row.email_sent),
    emailError: row.email_error,
  };
}

export function isMessageStatus(value: unknown): value is MessageStatus {
  return typeof value === "string" && (messageStatuses as readonly string[]).includes(value);
}

export function isMessageFilter(value: unknown): value is MessageFilter {
  return typeof value === "string" && (messageFilters as readonly string[]).includes(value);
}

/** Salted SHA-256 of an IP address, hex encoded. The raw IP is never stored. */
export async function hashIp(ip: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function saveMessage(
  db: D1Like,
  input: NewMessage,
  { id = crypto.randomUUID(), now = new Date() }: { id?: string; now?: Date } = {},
): Promise<string> {
  await db
    .prepare(
      `INSERT INTO messages (id, created_at, name, email, business, need, budget, timing, message, ip_hash, user_agent, status, email_sent, email_error)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 0, NULL)`,
    )
    .bind(
      id,
      now.toISOString(),
      input.name,
      input.email,
      input.business,
      input.need,
      input.budget,
      input.timing,
      input.message,
      input.ipHash,
      input.userAgent.slice(0, USER_AGENT_MAX),
    )
    .run();
  return id;
}

/** Records the outcome of the notification email for a saved message. */
export async function recordEmailResult(db: D1Like, id: string, result: { sent: true } | { sent: false; error: string }) {
  await db
    .prepare("UPDATE messages SET email_sent = ?, email_error = ? WHERE id = ?")
    .bind(result.sent ? 1 : 0, result.sent ? null : result.error.slice(0, 500), id)
    .run();
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function listMessages(
  db: D1Like,
  { filter = "inbox", query = "", limit = 50, offset = 0 }: { filter?: MessageFilter; query?: string; limit?: number; offset?: number } = {},
): Promise<{ messages: Message[]; hasMore: boolean }> {
  const where: string[] = [];
  const values: unknown[] = [];
  if (filter === "inbox") where.push("status != 'archived'");
  else if (filter !== "all") {
    where.push("status = ?");
    values.push(filter);
  }
  const q = query.trim();
  if (q) {
    const like = `%${escapeLike(q.toLowerCase())}%`;
    where.push(
      "(lower(name) LIKE ? ESCAPE '\\' OR lower(email) LIKE ? ESCAPE '\\' OR lower(business) LIKE ? ESCAPE '\\' OR lower(message) LIKE ? ESCAPE '\\' OR lower(need) LIKE ? ESCAPE '\\')",
    );
    values.push(like, like, like, like, like);
  }
  const sql = `SELECT * FROM messages${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`;
  const { results = [] } = await db
    .prepare(sql)
    .bind(...values, limit + 1, offset)
    .all<Row>();
  return { messages: results.slice(0, limit).map(toMessage), hasMore: results.length > limit };
}

export async function getMessage(db: D1Like, id: string): Promise<Message | null> {
  const row = await db.prepare("SELECT * FROM messages WHERE id = ?").bind(id).first<Row>();
  return row ? toMessage(row) : null;
}

export async function setMessageStatus(db: D1Like, id: string, status: MessageStatus): Promise<boolean> {
  const res = await db.prepare("UPDATE messages SET status = ? WHERE id = ?").bind(status, id).run();
  return (res.meta?.changes ?? 0) > 0;
}

export async function deleteMessage(db: D1Like, id: string): Promise<boolean> {
  const res = await db.prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
  return (res.meta?.changes ?? 0) > 0;
}

export async function countUnread(db: D1Like): Promise<number> {
  const row = await db.prepare("SELECT COUNT(*) AS n FROM messages WHERE status = 'new'").first<{ n: number }>();
  return Number(row?.n ?? 0);
}
