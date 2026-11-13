import { describe, expect, it } from "vitest";
import { sortByWorkOrder } from "@/lib/work-order";

const item = (slug: string, order = 0, title = slug) => ({ slug, order, title });

describe("sortByWorkOrder", () => {
  it("follows the listed order", () => {
    const items = [item("a", 1), item("b", 2), item("c", 3)];
    expect(sortByWorkOrder(items, ["c", "a", "b"]).map((w) => w.slug)).toEqual(["c", "a", "b"]);
  });

  it("puts unlisted projects last, by old order then title", () => {
    const items = [item("new-z", 5, "Zeta"), item("listed", 99), item("new-a", 5, "Alpha"), item("new-early", 1)];
    expect(sortByWorkOrder(items, ["listed"]).map((w) => w.slug)).toEqual(["listed", "new-early", "new-a", "new-z"]);
  });

  it("is stable for ties, ignores empty and duplicate entries, and never uses NaN", () => {
    const items = [item("b", NaN, "Same"), item("a", 0, "Same"), item("x", 3)];
    expect(sortByWorkOrder(items, [null, "x", "x", undefined]).map((w) => w.slug)).toEqual(["x", "a", "b"]);
    expect(sortByWorkOrder(items, []).map((w) => w.slug)).toEqual(sortByWorkOrder([...items].reverse(), []).map((w) => w.slug));
  });

  it("does not mutate the input", () => {
    const items = [item("b"), item("a")];
    sortByWorkOrder(items, ["a"]);
    expect(items.map((w) => w.slug)).toEqual(["b", "a"]);
  });
});
