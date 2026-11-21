import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Markdoc, { type Node } from "@markdoc/markdoc";
import { describe, expect, it } from "vitest";
import { h2Text, splitWorkBody, technicalHeading } from "@/lib/work-body";

const root = process.cwd();
const workDir = join(root, "content/work");
const servicesDir = join(root, "content/services");

function parse(file: string) {
  const raw = readFileSync(file, "utf8");
  const [, frontmatter = "", body = ""] = raw.split(/^---\n/m);
  return { frontmatter, body, ast: Markdoc.parse(body) };
}

function h2s(ast: Node): string[] {
  return ast.children.map(h2Text).filter((t): t is string => t !== null);
}

const slugs = readdirSync(workDir)
  .filter((f) => f.endsWith(".mdoc"))
  .map((f) => f.replace(/\.mdoc$/, ""));
const serviceSlugs = readdirSync(servicesDir)
  .filter((f) => f.endsWith(".mdoc"))
  .map((f) => f.replace(/\.mdoc$/, ""));

const benefits = /^How it helps your (business|show)$/;
// Pages that keep a story order of their own, as listed in the work-page plan.
const exceptions: Record<string, string[]> = {
  "marketplace-search": ["Problem", "What it does", "Outcome", "What carries over to your project", "How I built it", "Stack"],
};
const customOrder = new Set(["site-rescue", "owner-dashboards", ...Object.keys(exceptions)]);

describe("work page structure", () => {
  it.each(slugs)("%s has the expected section order", (slug) => {
    const titles = h2s(parse(join(workDir, `${slug}.mdoc`)).ast);
    if (exceptions[slug]) return expect(titles).toEqual(exceptions[slug]);
    if (slug === "site-rescue") {
      expect(titles.at(-2)).toBe("Outcome");
      expect(titles.at(-1)).toBe("Stack");
      return;
    }
    if (slug === "owner-dashboards") return expect(titles[0]).toBe("Problem");
    expect(customOrder.has(slug)).toBe(false);
    expect(titles[0]).toBe("Problem");
    const b = titles.findIndex((t) => benefits.test(t));
    if (b !== -1) expect(b).toBe(1);
    expect(titles[b === -1 ? 1 : b + 1]).toBe("What it does");
    const firstTech = titles.findIndex((t) => technicalHeading.test(t));
    if (firstTech !== -1) {
      expect(titles.slice(firstTech).every((t) => technicalHeading.test(t))).toBe(true);
      expect(titles.at(-1)).toMatch(/^(Stack|How it's built)$/);
    }
    const outcome = titles.indexOf("Outcome");
    if (outcome !== -1 && firstTech !== -1) expect(outcome).toBeLessThan(firstTech);
  });

  it.each(slugs)("%s has no Try it heading, em dash or banned wording", (slug) => {
    const { frontmatter, body, ast } = parse(join(workDir, `${slug}.mdoc`));
    expect(h2s(ast).map((t) => t.toLowerCase())).not.toContain("try it");
    expect(frontmatter + body).not.toContain("—");
  });

  it.each(slugs)("%s points to an existing service", (slug) => {
    const { frontmatter } = parse(join(workDir, `${slug}.mdoc`));
    const service = /^service: (.+)$/m.exec(frontmatter)?.[1];
    expect(service).toBeTruthy();
    expect(serviceSlugs).toContain(service);
  });

  it("keeps banned wording out of the work pages and the files they render", () => {
    const banned =
      /4242|test card|real money|resets every hour|hidden from search engines|real person|demo data|sample data|fictional|made-up|because this is a demo/i;
    const files = [
      ...slugs.map((s) => join(workDir, `${s}.mdoc`)),
      ...readdirSync(join(root, "components"))
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => join(root, "components", f)),
      join(root, "site.config.ts"),
    ];
    for (const file of files) expect(readFileSync(file, "utf8"), file).not.toMatch(banned);
  });
});

describe("splitWorkBody", () => {
  const body = [
    "Intro text.",
    "",
    "## Problem",
    "",
    "Text.",
    "",
    "## What it does",
    "",
    "- One",
    "",
    "## How it's built",
    "",
    "Built.",
    "",
    "## Stack",
    "",
    "Tools.",
  ].join("\n");

  it("splits the intro, main and technical parts", () => {
    const { intro, main, technical } = splitWorkBody(Markdoc.parse(body));
    expect(h2s(intro)).toEqual([]);
    expect(intro.children).toHaveLength(1);
    expect(h2s(main)).toEqual(["Problem", "What it does"]);
    expect(h2s(technical)).toEqual(["How it's built", "Stack"]);
  });

  it("puts everything in main when there is no technical section", () => {
    const { main, technical } = splitWorkBody(Markdoc.parse("Hi.\n\n## Problem\n\nText."));
    expect(h2s(main)).toEqual(["Problem"]);
    expect(technical.children).toHaveLength(0);
  });

  it("puts everything in the intro when there is no H2", () => {
    const { intro, main, technical } = splitWorkBody(Markdoc.parse("Only an intro."));
    expect(intro.children).toHaveLength(1);
    expect(main.children).toHaveLength(0);
    expect(technical.children).toHaveLength(0);
  });

  it.each(["How I built it", "How they're built"])("recognises the %s heading", (title) => {
    const { technical } = splitWorkBody(Markdoc.parse(`## Problem\n\nText.\n\n## ${title}\n\nBuilt.`));
    expect(h2s(technical)).toEqual([title]);
  });
});
