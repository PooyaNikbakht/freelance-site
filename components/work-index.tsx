import Link from "next/link";
import { ResearchCard, WorkCard } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { Container, PageHeader } from "@/components/ui";
import { type WorkCategory, workCategories } from "@/lib/categories";
import type { Research, Work } from "@/lib/content";

/**
 * The /work page and its static category views (/work/category/<value>).
 * The filter is plain links between prebuilt pages, so it works without JavaScript.
 */
export function WorkIndex({
  work,
  research,
  active,
}: {
  work: Work[];
  research: Research[];
  active?: WorkCategory;
}) {
  const shown = active ? work.filter((w) => w.categories.includes(active)) : work;
  const filters = [
    { value: undefined, label: "All", href: "/work", count: work.length },
    ...workCategories.map((c) => ({
      value: c.value,
      label: c.label,
      href: `/work/category/${c.value}`,
      count: work.filter((w) => w.categories.includes(c.value)).length,
    })),
  ].filter((f) => f.count > 0);
  const activeLabel = filters.find((f) => f.value === active)?.label ?? "All";

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title={active ? activeLabel : "What I've built"}
        intro="A sample of what I build: websites, booking and ordering systems, AI tools, and fixes for existing sites. It's only a small part of my work. In my full-time roles I've built much more at scale, including a search engine, high-performance APIs, fast and complex frontend pages, databases and microservices. Pick a category to narrow it down."
      />
      <Container>
        <nav aria-label="Filter work by category" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const current = f.value === active;
              return (
                <li key={f.href}>
                  <Link
                    href={f.href}
                    scroll={false}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-colors ${
                      current
                        ? "border-accent bg-accent text-accent-ink"
                        : "border-border bg-background text-ink hover:border-accent hover:text-accent"
                    }`}
                  >
                    {f.label}
                    <span className={`font-mono text-xs ${current ? "" : "text-muted"}`}>
                      <span className="sr-only">(</span>
                      {f.count}
                      <span className="sr-only"> {f.count === 1 ? "project" : "projects"})</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 text-[0.9375rem]">
          <a
            href="/pooya-selected-work.pdf"
            download
            className="inline-flex min-h-11 items-center gap-2 font-medium text-accent underline-offset-4 hover:underline"
          >
            Download my selected work (PDF, 8 pages, 1 MB)
          </a>
        </p>

        <h2 className="sr-only">{active ? `${activeLabel} work` : "All work"}</h2>
        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {active
            ? `${shown.length} ${shown.length === 1 ? "project" : "projects"} in ${activeLabel}.`
            : `${shown.length} projects.`}
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {shown.map((w) => (
            <WorkCard key={w.slug} work={w} headingLevel="h3" sizes="(min-width: 640px) 50vw, 100vw" />
          ))}
        </div>

        {research.length ? (
          <section id="research" aria-labelledby="research-heading" className="mt-24 scroll-mt-24 border-t border-border pt-14">
            <div className="mb-8 max-w-2xl">
              <h2 id="research-heading" className="text-[1.5rem] font-bold leading-tight tracking-tight sm:text-[1.75rem]">
                Research and earlier projects
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                Papers from my MSc research on bin packing, published at computer science conferences, plus earlier data science projects and the startup I founded.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {research.map((r) => (
                <ResearchCard key={r.slug} item={r} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
      <ContactCta />
    </>
  );
}
