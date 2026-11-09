import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { D1Like, D1PreparedStatementLike, D1Result } from "@/lib/messages";

// A small stand-in for Cloudflare D1, backed by Node's built-in SQLite (in memory)
// with the real migrations applied, so the queries run against the real schema.
const require = createRequire(import.meta.url);
type SqliteValue = null | number | bigint | string | Uint8Array;
type Statement = {
  get(...params: SqliteValue[]): unknown;
  all(...params: SqliteValue[]): unknown[];
  run(...params: SqliteValue[]): { changes: number | bigint };
};
const { DatabaseSync } = require("node:sqlite") as {
  DatabaseSync: new (path: string) => { exec(sql: string): void; prepare(sql: string): Statement };
};

function toSqlite(value: unknown): SqliteValue {
  if (value === undefined) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  return value as SqliteValue;
}

class FakeStatement implements D1PreparedStatementLike {
  constructor(
    private readonly stmt: Statement,
    private readonly params: SqliteValue[] = [],
  ) {}
  bind(...values: unknown[]) {
    return new FakeStatement(this.stmt, values.map(toSqlite));
  }
  async first<T>() {
    return ((this.stmt.get(...this.params) as T | undefined) ?? null) as T | null;
  }
  async all<T>(): Promise<D1Result<T>> {
    return { results: this.stmt.all(...this.params) as T[] };
  }
  async run(): Promise<D1Result> {
    const { changes } = this.stmt.run(...this.params);
    return { meta: { changes: Number(changes) } };
  }
}

export function createFakeD1(): D1Like {
  const db = new DatabaseSync(":memory:");
  const dir = path.join(process.cwd(), "migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    db.exec(readFileSync(path.join(dir, file), "utf8"));
  }
  return { prepare: (sql: string) => new FakeStatement(db.prepare(sql)) };
}
