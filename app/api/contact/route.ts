import { ipHashSalt } from "@/lib/admin/config";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { getDb } from "@/lib/db";
import { type D1Like, hashIp, recordEmailResult, saveMessage } from "@/lib/messages";
import { siteConfig } from "@/site.config";

// Contact form endpoint. Uses only Web APIs (fetch, Request, Response), so it runs
// the same under `next dev`, `next start`, and Cloudflare Workers via OpenNext.
// Each message is saved to D1 first (the /admin/messages inbox), then emailed, so a
// failed email loses nothing. Without a D1 binding the message is only emailed.
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;

// Per-IP rate limit kept in memory. This is per instance: each Worker isolate (or
// each `next start` process) has its own counter, and it resets when the isolate
// is recycled. It stops casual abuse; use a Cloudflare rate limiting rule or a
// Durable Object for a hard global limit.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const emailFallback = `Something went wrong on my side. Please email me at ${siteConfig.email} instead.`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldRows(data: ContactInput): [string, string][] {
  return [
    ["Name", data.name],
    ["Email", data.email],
    ["Business or website", data.business || "Not given"],
    ["What they need", data.need],
    ["Budget", data.budget || "Not given"],
    ["Timing", data.timing || "Not given"],
  ];
}

function buildEmail(data: ContactInput, ip: string) {
  const rows = fieldRows(data);
  const subject = `New project inquiry: ${data.need} from ${data.name}`.replace(/[\r\n]+/g, " ");
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", data.message, "", `Sent from the contact form (IP ${ip}).`].join(
    "\n",
  );
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111827">
<h1 style="font-size:18px;margin:0 0 16px">New project inquiry</h1>
<table cellpadding="6" style="border-collapse:collapse">
${rows
  .map(
    ([k, v]) =>
      `<tr><th align="left" valign="top" style="color:#5b6472;font-weight:600;padding-right:16px">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<h2 style="font-size:16px;margin:24px 0 8px">Message</h2>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
<p style="color:#5b6472;font-size:13px;margin-top:24px">Sent from the contact form (IP ${escapeHtml(ip)}). Reply to this email to answer ${escapeHtml(data.name)}.</p>
</body></html>`;
  return { subject, text, html };
}

async function verifyTurnstile(secret: string, token: string | undefined, ip: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip !== "unknown") body.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, error: "That message is too long." }, 413);

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "That message is too long." }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "The request could not be read." }, 400);
  }
  if (!raw || typeof raw !== "object") return json({ ok: false, error: "The request could not be read." }, 400);

  // Honeypot: bots fill every field. Pretend it worked and drop it.
  const honeypot = (raw as Record<string, unknown>).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 400);
  }
  const data = parsed.data;

  // Counted only for valid messages: rejected requests do no outside work.
  if (rateLimited(ip)) {
    return json({ ok: false, error: "Too many messages from this connection. Please wait a few minutes or email me instead." }, 429);
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    const human = await verifyTurnstile(turnstileSecret, data.turnstileToken, ip);
    if (!human) {
      return json({ ok: false, error: "The spam check didn't pass. Please try again, or email me instead." }, 400);
    }
  }

  // 1. Save. A storage failure is logged and the email still goes out.
  const db = await getDb();
  let savedId: string | null = null;
  if (db) {
    try {
      savedId = await saveMessage(db, {
        name: data.name,
        email: data.email,
        business: data.business,
        need: data.need,
        budget: data.budget,
        timing: data.timing,
        message: data.message,
        ipHash: ip === "unknown" ? "" : await hashIp(ip, ipHashSalt()),
        userAgent: request.headers.get("user-agent") ?? "",
      });
    } catch (err) {
      console.error("[contact] Could not save the message to D1", err);
    }
  }

  // 2. Email.
  const result = await sendEmail(data, ip);
  if (db && savedId) await recordEmailResultSafely(db, savedId, result);

  if (result.sent || result.devLogged) return json({ ok: true });
  // Saved to the inbox: the visitor's message is safe even though the email failed.
  if (savedId) return json({ ok: true });
  if (result.notConfigured) {
    return json({ ok: false, error: `The form isn't accepting messages right now. Please email me at ${siteConfig.email} instead.` }, 503);
  }
  return json({ ok: false, error: emailFallback }, 502);
}

async function recordEmailResultSafely(db: D1Like, id: string, result: EmailResult) {
  try {
    await recordEmailResult(db, id, result.sent ? { sent: true } : { sent: false, error: result.error });
  } catch (err) {
    console.error("[contact] Could not record the email result", err);
  }
}

type EmailResult = { sent: true } | { sent: false; error: string; notConfigured?: boolean; devLogged?: boolean };

async function sendEmail(data: ContactInput, ip: string): Promise<EmailResult> {
  const email = buildEmail(data, ip);
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `\n[contact] Email not configured (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL). Message logged instead:\n` +
          `Subject: ${email.subject}\nReply-To: ${data.email}\n\n${email.text}\n`,
      );
      return { sent: false, error: "Email is not configured. Development only: the message was printed in the dev server console.", devLogged: true };
    }
    console.error("[contact] Email is not configured.");
    return { sent: false, error: "Email is not configured (RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL).", notConfigured: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: data.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      console.error(`[contact] Resend returned ${res.status}: ${detail}`);
      return { sent: false, error: `Resend returned ${res.status}: ${detail}` };
    }
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return { sent: false, error: `Resend request failed: ${err instanceof Error ? err.message : String(err)}` };
  }
  return { sent: true };
}
