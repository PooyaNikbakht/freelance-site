import { describe, expect, it, vi } from "vitest";
import { finishLogin, type GitHubAuthConfig, isAllowedUser, parseList, safeNext, startLogin } from "@/lib/admin/github";

const config: GitHubAuthConfig = {
  clientId: "Iv1.test",
  clientSecret: "client-secret",
  sessionSecret: "a-test-secret-that-is-long-enough-1234",
  allowedLogins: ["PooyaNikbakht"],
  allowedIds: [],
};
const origin = "https://pooya.website";

function fakeGitHub(user: { login: string; id: number } | null = { login: "pooyanikbakht", id: 42 }, tokenOk = true) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://github.com/login/oauth/access_token") {
      const body = JSON.parse(String(init?.body));
      expect(body).toMatchObject({ client_id: "Iv1.test", client_secret: "client-secret", code: "the-code", redirect_uri: `${origin}/api/admin/auth/callback` });
      return Response.json(tokenOk ? { access_token: "gho_token", token_type: "bearer" } : { error: "bad_verification_code" });
    }
    if (url === "https://api.github.com/user") {
      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer gho_token");
      return user ? Response.json(user) : new Response("{}", { status: 401 });
    }
    throw new Error(`unexpected fetch ${url}`);
  }) as unknown as typeof fetch;
}

async function begin(next = "/admin/messages") {
  const { url, cookie } = await startLogin(config, { origin, next });
  const state = new URL(url).searchParams.get("state")!;
  return { url: new URL(url), cookie, state };
}

describe("startLogin", () => {
  it("builds the authorize URL with a random state", async () => {
    const a = await begin();
    const b = await begin();
    expect(a.url.origin + a.url.pathname).toBe("https://github.com/login/oauth/authorize");
    expect(a.url.searchParams.get("client_id")).toBe("Iv1.test");
    expect(a.url.searchParams.get("redirect_uri")).toBe(`${origin}/api/admin/auth/callback`);
    expect(a.state).toMatch(/^[\w-]{40,}$/);
    expect(a.state).not.toBe(b.state);
    expect(a.cookie).not.toContain(a.state);
  });
});

describe("finishLogin", () => {
  it("signs in an allowed user and keeps the next path", async () => {
    const { cookie, state } = await begin("/admin/messages?status=new");
    const result = await finishLogin(config, { code: "the-code", state, error: null, stateCookie: cookie, origin }, fakeGitHub());
    expect(result).toEqual({ ok: true, user: { login: "pooyanikbakht", id: 42 }, next: "/admin/messages?status=new" });
  });

  it("rejects a missing, forged, or mismatched state (CSRF) before calling GitHub", async () => {
    const { cookie, state } = await begin();
    const other = await begin();
    const fetchImpl = fakeGitHub();
    const cases = [
      { state, stateCookie: undefined },
      { state: null, stateCookie: cookie },
      { state: other.state, stateCookie: cookie },
      { state, stateCookie: other.cookie },
      { state, stateCookie: cookie.replace(/.$/, (c) => (c === "A" ? "B" : "A")) },
    ];
    for (const c of cases) {
      expect(await finishLogin(config, { code: "the-code", error: null, origin, ...c }, fetchImpl)).toEqual({ ok: false, reason: "state" });
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects an expired state cookie", async () => {
    vi.useFakeTimers();
    try {
      const { cookie, state } = await begin();
      vi.advanceTimersByTime(11 * 60 * 1000);
      expect(await finishLogin(config, { code: "the-code", state, error: null, stateCookie: cookie, origin }, fakeGitHub())).toEqual({
        ok: false,
        reason: "state",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("handles a cancelled sign-in and GitHub errors", async () => {
    const { cookie, state } = await begin();
    expect(await finishLogin(config, { code: null, state, error: "access_denied", stateCookie: cookie, origin }, fakeGitHub())).toEqual({
      ok: false,
      reason: "denied",
    });
    expect(await finishLogin(config, { code: "the-code", state, error: null, stateCookie: cookie, origin }, fakeGitHub(undefined, false))).toEqual({
      ok: false,
      reason: "github",
    });
    expect(await finishLogin(config, { code: "the-code", state, error: null, stateCookie: cookie, origin }, fakeGitHub(null))).toEqual({
      ok: false,
      reason: "github",
    });
  });

  it("rejects users who aren't on the allowlist", async () => {
    const { cookie, state } = await begin();
    const result = await finishLogin(config, { code: "the-code", state, error: null, stateCookie: cookie, origin }, fakeGitHub({ login: "someone", id: 7 }));
    expect(result).toEqual({ ok: false, reason: "not-allowed" });
  });
});

describe("allowlist", () => {
  it("matches logins case-insensitively", () => {
    expect(isAllowedUser({ login: "POOYANIKBAKHT", id: 1 }, { allowedLogins: ["PooyaNikbakht"], allowedIds: [] })).toBe(true);
    expect(isAllowedUser({ login: "PooyaNikbakht2", id: 1 }, { allowedLogins: ["PooyaNikbakht"], allowedIds: [] })).toBe(false);
  });

  it("prefers numeric ids when they are set", () => {
    const rules = { allowedLogins: ["PooyaNikbakht"], allowedIds: [42] };
    expect(isAllowedUser({ login: "renamed", id: 42 }, rules)).toBe(true);
    expect(isAllowedUser({ login: "PooyaNikbakht", id: 99 }, rules)).toBe(false);
  });

  it("treats numeric entries in the login list as ids", () => {
    expect(isAllowedUser({ login: "x", id: 42 }, { allowedLogins: ["42"], allowedIds: [] })).toBe(true);
  });

  it("parses comma or space separated lists", () => {
    expect(parseList(" PooyaNikbakht, @other  third ")).toEqual(["PooyaNikbakht", "other", "third"]);
    expect(parseList(undefined)).toEqual([]);
  });
});

describe("safeNext", () => {
  it("only allows admin and editor paths", () => {
    expect(safeNext("/admin/messages?q=a")).toBe("/admin/messages?q=a");
    expect(safeNext("/keystatic")).toBe("/keystatic");
    for (const bad of ["https://evil.example", "//evil.example", "/administrator", "/", "/admin\\@evil", undefined, 5]) {
      expect(safeNext(bad)).toBe("/admin");
    }
  });
});
