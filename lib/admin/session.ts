// Signed tokens with Web Crypto (HMAC-SHA256), so the same code runs in Node and on
// Cloudflare Workers. Used for the admin session cookie and the OAuth state cookie.
// No server-only import: the tests use it directly.

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const SESSION_COOKIE = "pn_admin";
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

export function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export function randomToken(bytes = 32): string {
  return base64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Compares two byte arrays in time that depends only on their length. */
export function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Constant-time string comparison. Both sides are hashed first, so timing reveals neither length nor prefix. */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  return timingSafeEqualBytes(new Uint8Array(ha), new Uint8Array(hb));
}

/**
 * Signs a small JSON payload: `<purpose>.<expires, unix seconds>.<base64url JSON>.<HMAC>`.
 * The purpose is part of the signed text, so a state cookie can't be replayed as a session.
 */
export async function signToken(secret: string, purpose: string, data: Record<string, unknown>, ttlSeconds: number, now = Date.now()) {
  if (!secret) throw new Error("A signing secret is required.");
  const expires = Math.floor(now / 1000) + ttlSeconds;
  const payload = `${purpose}.${expires}.${base64url(encoder.encode(JSON.stringify(data)))}`;
  return `${payload}.${base64url(await hmac(secret, payload))}`;
}

export async function verifyToken<T extends Record<string, unknown>>(
  secret: string,
  purpose: string,
  token: string | undefined | null,
  now = Date.now(),
): Promise<T | null> {
  if (!secret || !token || token.length > 2000) return null;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== purpose) return null;
  const [, expiresRaw, body, signature] = parts;
  if (!/^\d{1,12}$/.test(expiresRaw)) return null;
  const expected = base64url(await hmac(secret, `${purpose}.${expiresRaw}.${body}`));
  if (!timingSafeEqualBytes(encoder.encode(expected), encoder.encode(signature))) return null;
  if (Number(expiresRaw) * 1000 <= now) return null;
  try {
    const data = JSON.parse(decoder.decode(fromBase64url(body)));
    return data && typeof data === "object" ? (data as T) : null;
  } catch {
    return null;
  }
}

export type AdminSession = { login: string; id: number };

export function signSession(secret: string, user: AdminSession, { now = Date.now(), ttlSeconds = SESSION_TTL_SECONDS } = {}) {
  return signToken(secret, "s1", { login: user.login, id: user.id }, ttlSeconds, now);
}

export async function verifySession(secret: string, token: string | undefined | null, { now = Date.now() } = {}): Promise<AdminSession | null> {
  const data = await verifyToken<{ login?: unknown; id?: unknown }>(secret, "s1", token, now);
  if (!data || typeof data.login !== "string" || typeof data.id !== "number") return null;
  return { login: data.login, id: data.id };
}

/** Sliding-window limiter kept in memory (per Worker instance). */
export class RateLimiter {
  private hits = new Map<string, number[]>();
  constructor(
    private readonly max = 10,
    private readonly windowMs = 15 * 60 * 1000,
  ) {}

  /** Counts a hit and returns true when the key is over the limit. */
  limited(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    const over = recent.length >= this.max;
    if (!over) recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) {
      for (const [k, times] of this.hits) if (times.every((t) => now - t >= this.windowMs)) this.hits.delete(k);
    }
    return over;
  }
}
