import type { MetadataRoute } from "next";
import { getPosts, getResearch, getServices, getWork } from "@/lib/content";
import { workCategories } from "@/lib/categories";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, research, posts] = await Promise.all([getServices(), getWork(), getResearch(), getPosts()]);
  const latestPost = posts[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/for-teams"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7, ...(latestPost ? { lastModified: latestPost } : {}) },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...workCategories
      .filter((c) => work.some((w) => w.categories.includes(c.value)))
      .map((c) => ({ url: absoluteUrl(`/work/category/${c.value}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...work.map((w) => ({ url: absoluteUrl(`/work/${w.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
    ...research.map((r) => ({ url: absoluteUrl(`/work/research/${r.slug}`), changeFrequency: "yearly" as const, priority: 0.4 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
