import { getPosts, getServices, getWork } from "@/lib/content";
import { absoluteUrl, formatPrice, siteDescription } from "@/lib/seo";
import { siteConfig } from "@/site.config";

// /llms.txt (llmstxt.org): a plain Markdown map of the site for AI assistants and agents.
// Built from the same content as the pages, so prices and links never drift.
export const dynamic = "force-static";

export async function GET() {
  const [services, work, posts] = await Promise.all([getServices(), getWork(), getPosts()]);
  const link = (title: string, path: string, text: string) => `- [${title}](${absoluteUrl(path)}): ${text}`;

  const text = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteDescription}`,
    "",
    `Freelance senior full-stack and AI engineer in Toronto, Canada, working with clients worldwide. 10+ years of experience, an ${siteConfig.education.msc.degree}, and AWS Certified Solutions Architect. Prices are starting points in US dollars, and every project starts with a short call and a written plan.`,
    "",
    "## Services",
    "",
    ...services.map((s) => link(s.title, `/services/${s.slug}`, `${s.summary} From US${formatPrice(s.startingPrice)}, ${s.timeline.toLowerCase()}.`)),
    "",
    "## Projects",
    "",
    "Most projects have a live demo and a video walkthrough on their page.",
    "",
    ...work.map((w) => link(w.title, `/work/${w.slug}`, w.summary)),
    "",
    "## About and contact",
    "",
    link("About", "/about", "Background, experience, education and stack."),
    link("For teams", "/for-teams", "How I work with startups and product teams."),
    link("Contact", "/contact", `Start a project or ask a question. Email: ${siteConfig.email}.`),
    "",
    "## Optional",
    "",
    ...posts.map((p) => link(p.title, `/blog/${p.slug}`, p.description)),
    "",
  ].join("\n");

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
