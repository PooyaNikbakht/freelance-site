import { describe, expect, it } from "vitest";
import { RateLimiter, safeEqual, signSession, signToken, timingSafeEqualBytes, verifySession, verifyToken } from "@/lib/admin/session";

const secret = "a-test-secret-that-is-long-enough-1234";
const user = { login: "PooyaNikbakht", id: 12345 };

describe("admin session tokens", () => {
  it("verifies a token it signed and returns the user", async () => {
    const token = await signSession(secret, user);
    expect(token).toMatch(/^s1\.\d+\.[\w-]+\.[\w-]+$/);
    expect(await verifySession(secret, token)).toEqual(user);
  });

  it("rejects a token signed with another secret", async () => {
    const token = await signSession(secret, user);
    expect(await verifySession("another-secret-that-is-long-enough-5678", token)).toBeNull();
  });

  it("rejects a tampered expiry, body, or signature", async () => {
    const token = await signSession(secret, user);
    const [p, exp, body, sig] = token.split(".");
    expect(await verifySession(secret, [p, String(Number(exp) + 3600), body, sig].join("."))).toBeNull();
    const otherBody = (await signSession(secret, { login: "someone-else", id: 1 })).split(".")[2];
    expect(await verifySession(secret, [p, exp, otherBody, sig].join("."))).toBeNull();
    const flipped = sig.slice(0, -1) + (sig.endsWith("A") ? "B" : "A");
    expect(await verifySession(secret, [p, exp, body, flipped].join("."))).toBeNull();
  });

  it("rejects expired tokens", async () => {
    const now = Date.now();
    const token = await signSession(secret, user, { now, ttlSeconds: 60 });
    expect(await verifySession(secret, token, { now: now + 30_000 })).toEqual(user);
    expect(await verifySession(secret, token, { now: now + 61_000 })).toBeNull();
  });

  it("does not accept a token signed for another purpose", async () => {
    const state = await signToken(secret, "st1", { login: "PooyaNikbakht", id: 12345 }, 600);
    expect(await verifySession(secret, state)).toBeNull();
    const session = await signSession(secret, user);
    expect(await verifyToken(secret, "st1", session)).toBeNull();
  });

  it("rejects missing and malformed tokens", async () => {
    for (const bad of [undefined, null, "", "s1", "s1.1.2", "s2.9999999999.abc.def", "s1.notanumber.abc.def", "x".repeat(5000)]) {
      expect(await verifySession(secret, bad)).toBeNull();
    }
    expect(await verifySession("", await signSession(secret, user))).toBeNull();
  });

  it("refuses to sign without a secret", async () => {
    await expect(signSession("", user)).rejects.toThrow();
  });
});

describe("constant-time comparison", () => {
  it("compares strings", async () => {
    expect(await safeEqual("abc", "abc")).toBe(true);
    expect(await safeEqual("abc", "abC")).toBe(false);
    expect(await safeEqual("short", "a much longer value")).toBe(false);
  });

  it("compares bytes", () => {
    expect(timingSafeEqualBytes(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(timingSafeEqualBytes(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(timingSafeEqualBytes(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });
});

describe("rate limiter", () => {
  it("limits after the maximum hits and recovers after the window", () => {
    const limiter = new RateLimiter(3, 1000);
    for (let i = 0; i < 3; i++) expect(limiter.limited("ip", 10_000)).toBe(false);
    expect(limiter.limited("ip", 10_000)).toBe(true);
    expect(limiter.limited("other-ip", 10_000)).toBe(false);
    expect(limiter.limited("ip", 11_001)).toBe(false);
  });
});
