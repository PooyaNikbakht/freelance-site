import { beforeEach, describe, expect, it } from "vitest";
import {
  countUnread,
  type D1Like,
  deleteMessage,
  getMessage,
  hashIp,
  listMessages,
  type NewMessage,
  recordEmailResult,
  saveMessage,
  setMessageStatus,
  USER_AGENT_MAX,
} from "@/lib/messages";
import { createFakeD1 } from "./fake-d1";

const base: NewMessage = {
  name: "Jane Doe",
  email: "jane@example.com",
  business: "Jane's Bakery",
  need: "A new website",
  budget: "",
  timing: "",
  message: "A new site for my bakery, with online orders.",
  ipHash: "abc",
  userAgent: "Mozilla/5.0",
};

let db: D1Like;
beforeEach(() => {
  db = createFakeD1();
});

describe("messages storage", () => {
  it("saves a message as new, with the email not yet sent", async () => {
    const id = await saveMessage(db, base, { now: new Date("2026-11-01T12:00:00Z") });
    const m = await getMessage(db, id);
    expect(m).toMatchObject({
      id,
      createdAt: "2026-11-01T12:00:00.000Z",
      name: "Jane Doe",
      status: "new",
      emailSent: false,
      emailError: null,
    });
  });

  it("truncates long user agents", async () => {
    const id = await saveMessage(db, { ...base, userAgent: "x".repeat(1000) });
    expect((await getMessage(db, id))!.userAgent).toHaveLength(USER_AGENT_MAX);
  });

  it("records the email result", async () => {
    const id = await saveMessage(db, base);
    await recordEmailResult(db, id, { sent: false, error: "Resend returned 500" });
    expect(await getMessage(db, id)).toMatchObject({ emailSent: false, emailError: "Resend returned 500" });
    await recordEmailResult(db, id, { sent: true });
    expect(await getMessage(db, id)).toMatchObject({ emailSent: true, emailError: null });
  });

  it("lists newest first and filters by status", async () => {
    const a = await saveMessage(db, { ...base, name: "Older" }, { now: new Date("2026-10-01T00:00:00Z") });
    const b = await saveMessage(db, { ...base, name: "Newer" }, { now: new Date("2026-10-02T00:00:00Z") });
    const c = await saveMessage(db, { ...base, name: "Newest" }, { now: new Date("2026-10-03T00:00:00Z") });
    await setMessageStatus(db, a, "archived");
    await setMessageStatus(db, b, "read");

    const names = async (filter: Parameters<typeof listMessages>[1]) => (await listMessages(db, filter)).messages.map((m) => m.name);
    expect(await names({ filter: "all" })).toEqual(["Newest", "Newer", "Older"]);
    expect(await names({ filter: "inbox" })).toEqual(["Newest", "Newer"]);
    expect(await names({ filter: "new" })).toEqual(["Newest"]);
    expect(await names({ filter: "read" })).toEqual(["Newer"]);
    expect(await names({ filter: "archived" })).toEqual(["Older"]);
    expect(await countUnread(db)).toBe(1);
    expect(c).toBeTruthy();
  });

  it("searches name, email, business and text, case-insensitively, with LIKE wildcards escaped", async () => {
    await saveMessage(db, { ...base, name: "Sam", email: "sam@shop.example", business: "Corner Shop", message: "Need 100% better search" });
    await saveMessage(db, { ...base, name: "Alex", email: "alex@example.com", business: "", message: "Booking for a salon please" });
    const find = async (query: string) => (await listMessages(db, { filter: "all", query })).messages.map((m) => m.name);
    expect(await find("corner")).toEqual(["Sam"]);
    expect(await find("SALON")).toEqual(["Alex"]);
    expect(await find("alex@")).toEqual(["Alex"]);
    expect(await find("100%")).toEqual(["Sam"]);
    expect(await find("%")).toEqual(["Sam"]);
    expect(await find("nothing like this")).toEqual([]);
  });

  it("pages results", async () => {
    for (let i = 0; i < 5; i++) await saveMessage(db, { ...base, name: `M${i}` }, { now: new Date(Date.UTC(2026, 0, i + 1)) });
    const first = await listMessages(db, { filter: "all", limit: 2 });
    expect(first.messages.map((m) => m.name)).toEqual(["M4", "M3"]);
    expect(first.hasMore).toBe(true);
    const last = await listMessages(db, { filter: "all", limit: 2, offset: 4 });
    expect(last.messages.map((m) => m.name)).toEqual(["M0"]);
    expect(last.hasMore).toBe(false);
  });

  it("updates status and deletes", async () => {
    const id = await saveMessage(db, base);
    expect(await setMessageStatus(db, id, "read")).toBe(true);
    expect((await getMessage(db, id))!.status).toBe("read");
    expect(await deleteMessage(db, id)).toBe(true);
    expect(await getMessage(db, id)).toBeNull();
    expect(await deleteMessage(db, id)).toBe(false);
    expect(await setMessageStatus(db, "missing", "read")).toBe(false);
  });

  it("rejects an invalid status at the database level", async () => {
    const id = await saveMessage(db, base);
    await expect(setMessageStatus(db, id, "spam" as never)).rejects.toThrow();
  });
});

describe("hashIp", () => {
  it("is a salted SHA-256 that never contains the IP", async () => {
    const h = await hashIp("203.0.113.7", "salt-1");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).not.toContain("203.0.113.7");
    expect(await hashIp("203.0.113.7", "salt-1")).toBe(h);
    expect(await hashIp("203.0.113.7", "salt-2")).not.toBe(h);
  });
});
