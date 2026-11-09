import Link from "next/link";
import { notFound } from "next/navigation";
import { ResearchCard } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { MarkdocBody } from "@/components/markdoc-body";
import { Container, PageHeader, TagList } from "@/components/ui";
import { getResearch, getResearchItem, researchTypeLabels } from "@/lib/content";
import { absoluteUrl, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getResearch()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/research/[slug]">) {
  const { slug } = await params;
  const item = await getResearchItem(slug);
  if (!item) return {};
  return pageMetadata({ title: item.title, description: item.summary, path: `/work/research/${slug}`, type: "article" });
}

export default async function ResearchItemPage({ params }: PageProps<"/work/research/[slug]">) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getResearchItem(slug), getResearch()]);
  if (!item) notFound();
  const others = all.filter((r) => r.slug !== slug).slice(0, 3);
  const path = `/work/research/${slug}`;

  const facts = [
    { label: "Type", value: researchTypeLabels[item.type] },
    { label: "When", value: item.when || item.year },
    { label: "Authors", value: item.authors },
    { label: "Context", value: item.context },
  ].filter((f) => f.value);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": item.type === "research-paper" ? "ScholarlyArticle" : "CreativeWork",
            name: item.title,
            headline: item.title,
            description: item.summary,
            url: absoluteUrl(path),
            keywords: item.tags.join(", "),
            ...(item.year ? { datePublished: item.year } : {}),
            ...(item.authors ? { author: item.authors.split(/,\s*/).map((name) => ({ "@type": "Person", name })) } : {}),
            creator: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.name },
            ...(item.links.length ? { sameAs: item.links.map((l) => l.url) } : {}),
          },
          breadcrumbLd([
            { name: "Projects", path: "/work" },
            { name: item.title, path },
          ]),
        ]}
      />
      <PageHeader
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Projects", href: "/work" }, { name: item.title }]}
        eyebrow={researchTypeLabels[item.type]}
        title={item.title}
        intro={item.summary}
      >
        {item.tags.length ? (
          <div className="mt-6">
            <TagList items={item.tags} label="Topics" />
          </div>
        ) : null}
      </PageHeader>
      <Container>
        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <MarkdocBody node={item.body} />
          <aside aria-labelledby="facts-heading" className="order-first h-fit rounded-[12px] border border-border bg-surface p-6 lg:order-none">
            <h2 id="facts-heading" className="sr-only">
              Details
            </h2>
            <dl className="space-y-4 text-sm">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{f.label}</dt>
                  <dd className="mt-1 leading-relaxed">{f.value}</dd>
                </div>
              ))}
            </dl>
            {item.links.length ? (
              <ul className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
                {item.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      {l.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>

        {others.length ? (
          <section aria-labelledby="more-heading" className="mt-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
              <h2 id="more-heading" className="text-xl font-bold tracking-tight">
                More research and earlier projects
              </h2>
              <Link
                href="/work#research"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                See all
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((r) => (
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
