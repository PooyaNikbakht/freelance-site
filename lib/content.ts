import "server-only";
import { createReader } from "@keystatic/core/reader";
import type { Node } from "@markdoc/markdoc";
import keystaticConfig from "@/keystatic.config";
import type { WorkCategory } from "@/lib/categories";
import { siteConfig } from "@/site.config";

const reader = createReader(process.cwd(), keystaticConfig);

const isProduction = process.env.NODE_ENV === "production";

export type Settings = {
  headline: string;
  subline: string;
  availability: string;
  tagline: string;
  taglineShort: string;
  taglineMobile: string;
};

/** [year, month], month 1 to 12. */
export type YearMonth = [number, number];

export type AboutTimelineEntry = {
  title: string;
  org: string;
  link: string | null;
  start: YearMonth;
  /** null means "present". */
  end: YearMonth | null;
  meta: string;
  body: Node;
};

export type AboutActivity = {
  title: string;
  intro: string;
  graphs: { year: string; contributions: number; image: string }[];
  ticketCharts: { title: string; note: string; bars: { name: string; value: number; me: boolean }[] }[];
};

export type About = {
  title: string;
  lead: string;
  metaDescription: string;
  intro: string[];
  howIWork: { title: string; text: string }[];
  activity: AboutActivity;
  experience: AboutTimelineEntry[];
  education: AboutTimelineEntry[];
  publicationsIntro: Node | null;
  publications: { title: string; venue: string; link: string; order: number }[];
  stack: { label: string; items: string }[];
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  startingPrice: number;
  timeline: string;
  order: number;
  relatedWork: string[];
  body: Node;
};

export type Work = {
  slug: string;
  title: string;
  summary: string;
  categories: WorkCategory[];
  stack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number;
  findable: WorkFindable | null;
  body: Node;
};

export type WorkFindable = {
  measured: string;
  scores: { label: string; value: number }[];
  structuredData: string[];
  result: { title: string; url: string; description: string; details: string } | null;
};

export type ResearchType = "research-paper" | "data-science" | "product";

export type Research = {
  slug: string;
  title: string;
  summary: string;
  type: ResearchType;
  year: string;
  when: string;
  authors: string;
  context: string;
  tags: string[];
  links: { label: string; url: string }[];
  order: number;
  body: Node;
};

export const researchTypeLabels: Record<ResearchType, string> = {
  "research-paper": "Research paper",
  "data-science": "Data science",
  product: "Product",
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  readingMinutes: number;
  body: Node;
};

const fallbackSettings: Settings = {
  headline: "Websites, web apps and AI, built end to end.",
  subline: "Booking and online ordering, fast websites, and AI assistants that answer your customers, built for small businesses and startups.",
  availability: "Available evenings and weekends, Eastern Time.",
  tagline: "Senior full-stack & AI engineer · AWS Certified Solutions Architect",
  taglineShort: "Websites, web apps and AI tools",
  taglineMobile: "Full-stack & AI engineer",
};

export async function getSettings(): Promise<Settings> {
  // Pages are prerendered, so this normally runs at build time. A page rendered on
  // the Worker at request time (a 404, the admin) has no content/ folder to read,
  // so it falls back to the defaults instead of failing.
  const settings = await reader.singletons.settings.read().catch(() => null);
  if (!settings) return fallbackSettings;
  return {
    headline: settings.headline || fallbackSettings.headline,
    subline: settings.subline || fallbackSettings.subline,
    availability: settings.availability,
    tagline: settings.tagline || fallbackSettings.tagline,
    taglineShort: settings.taglineShort || fallbackSettings.taglineShort,
    taglineMobile: settings.taglineMobile || fallbackSettings.taglineMobile,
  };
}

const emptyAbout: About = {
  title: siteConfig.name,
  lead: "",
  metaDescription: "",
  intro: [],
  howIWork: [],
  activity: { title: "", intro: "", graphs: [], ticketCharts: [] },
  experience: [],
  education: [],
  publicationsIntro: null,
  publications: [],
  stack: [],
};

function yearMonth(yearText: string, month: string): YearMonth | null {
  const year = Number(yearText.trim());
  if (!yearText.trim() || !Number.isInteger(year)) return null;
  const m = Number(month);
  return [year, Number.isInteger(m) && m >= 1 && m <= 12 ? m : 1];
}

function hasText(node: Node): boolean {
  for (const child of node.walk()) {
    if (child.type === "text" && typeof child.attributes.content === "string" && child.attributes.content.trim()) return true;
  }
  return false;
}

export async function getAbout(): Promise<About> {
  const about = await reader.singletons.about.read({ resolveLinkedFiles: true }).catch(() => null);
  if (!about) return emptyAbout;
  const timeline = (e: {
    title: string;
    org: string;
    link?: string | null;
    startYear: string;
    startMonth: string;
    endYear: string;
    endMonth: string;
    meta?: string;
    body: { node: Node };
  }): AboutTimelineEntry | null => {
    const start = yearMonth(e.startYear, e.startMonth);
    if (!start) return null;
    return {
      title: e.title,
      org: e.org,
      link: e.link || null,
      start,
      end: yearMonth(e.endYear, e.endMonth),
      meta: e.meta ?? "",
      body: e.body.node,
    };
  };
  return {
    title: about.title || emptyAbout.title,
    lead: about.lead,
    metaDescription: about.metaDescription,
    intro: about.intro.filter((p) => p.trim()),
    howIWork: about.howIWork.filter((i) => i.title.trim()).map((i) => ({ title: i.title, text: i.text })),
    activity: {
      title: about.activity.title,
      intro: about.activity.intro,
      graphs: about.activity.graphs
        .filter((g) => g.year.trim() && g.image.trim())
        .map((g) => ({ year: g.year, contributions: g.contributions ?? 0, image: g.image })),
      ticketCharts: about.activity.ticketCharts
        .map((c) => ({
          title: c.title,
          note: c.note,
          bars: c.bars
            .filter((b) => b.name.trim())
            .map((b) => ({ name: b.name, value: b.value ?? 0, me: b.me }))
            .sort((a, b) => b.value - a.value),
        }))
        .filter((c) => c.bars.length),
    },
    experience: about.experience.map(timeline).filter((e): e is AboutTimelineEntry => e !== null),
    education: about.education
      .map((e) => timeline({ ...e, title: e.degree, org: e.school }))
      .filter((e): e is AboutTimelineEntry => e !== null),
    publicationsIntro: hasText(about.publicationsIntro.node) ? about.publicationsIntro.node : null,
    publications: about.publications
      .map((p, i) => ({ title: p.title, venue: p.venue, link: p.link ?? "", order: p.order ?? i, index: i }))
      .filter((p) => p.title && p.link)
      .sort((a, b) => a.order - b.order || a.index - b.index)
      .map(({ title, venue, link, order }) => ({ title, venue, link, order })),
    stack: about.stack.filter((s) => s.label.trim()).map((s) => ({ label: s.label, items: s.items })),
  };
}

export async function getServices(): Promise<Service[]> {
  const entries = await reader.collections.services.all({ resolveLinkedFiles: true });
  return entries
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      summary: entry.summary,
      startingPrice: entry.startingPrice,
      timeline: entry.timeline,
      order: entry.order ?? 0,
      relatedWork: entry.relatedWork.filter((s): s is string => Boolean(s)),
      body: entry.body.node,
    }))
    .sort(byOrder);
}

export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getWork(): Promise<Work[]> {
  const entries = await reader.collections.work.all({ resolveLinkedFiles: true });
  return entries
    .map(({ slug, entry }) => {
      // Demo links live in site.config.ts so deploy URLs are set in one place.
      const override = siteConfig.projects[slug];
      return {
        slug,
        title: entry.title,
        summary: entry.summary,
        categories: [...entry.categories],
        stack: [...entry.stack],
        liveUrl: (override ? override.liveUrl : entry.liveUrl) || null,
        repoUrl: (override ? override.repoUrl : entry.repoUrl) || null,
        featured: entry.featured,
        order: entry.order ?? 0,
        findable: findable(entry.findable),
        body: entry.body.node,
      };
    })
    .sort(byOrder);
}

function findable(f: {
  measured: string;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  structuredData: readonly string[];
  resultTitle: string;
  resultUrl: string;
  resultDescription: string;
  resultDetails: string;
}): WorkFindable | null {
  if (!f.measured.trim()) return null;
  const scores = [
    { label: "Performance", value: f.performance },
    { label: "Accessibility", value: f.accessibility },
    { label: "Best practices", value: f.bestPractices },
    { label: "SEO", value: f.seo },
  ].filter((s): s is { label: string; value: number } => s.value !== null);
  return {
    measured: f.measured,
    scores,
    structuredData: f.structuredData.filter((d) => d.trim()),
    result: f.resultTitle.trim()
      ? { title: f.resultTitle, url: f.resultUrl, description: f.resultDescription, details: f.resultDetails }
      : null,
  };
}

export async function getWorkItem(slug: string): Promise<Work | undefined> {
  return (await getWork()).find((w) => w.slug === slug);
}

export async function getFeaturedWork(limit = 4): Promise<Work[]> {
  return (await getWork()).filter((w) => w.featured).slice(0, limit);
}

export async function getResearch(): Promise<Research[]> {
  const entries = await reader.collections.research.all({ resolveLinkedFiles: true });
  return entries
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      summary: entry.summary,
      type: entry.type,
      year: entry.year,
      when: entry.when,
      authors: entry.authors,
      context: entry.context,
      tags: [...entry.tags],
      links: entry.links.filter((l): l is { label: string; url: string } => Boolean(l.label && l.url)),
      order: entry.order ?? 0,
      body: entry.body.node,
    }))
    .sort(byOrder);
}

export async function getResearchItem(slug: string): Promise<Research | undefined> {
  return (await getResearch()).find((r) => r.slug === slug);
}

export async function getPosts(): Promise<Post[]> {
  const entries = await reader.collections.posts.all({ resolveLinkedFiles: true });
  return entries
    .filter(({ entry }) => !(isProduction && entry.draft))
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      description: entry.description,
      date: entry.date,
      draft: entry.draft,
      readingMinutes: readingMinutes(entry.body.node),
      body: entry.body.node,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

function byOrder<T extends { order: number; title: string }>(a: T, b: T) {
  return a.order - b.order || a.title.localeCompare(b.title);
}

function readingMinutes(node: Node): number {
  let words = 0;
  for (const child of node.walk()) {
    if (child.type === "text" && typeof child.attributes.content === "string") {
      words += child.attributes.content.split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.round(words / 220));
}
