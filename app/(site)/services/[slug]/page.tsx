import { notFound } from "next/navigation";
import { WorkCard } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { MarkdocBody } from "@/components/markdoc-body";
import { ServiceIcon } from "@/components/service-icon";
import { Container, PageHeader } from "@/components/ui";
import { getService, getServices, getWork } from "@/lib/content";
import { breadcrumbLd, formatPrice, pageMetadata, serviceLd } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.title, description: service.summary, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  const related = (await getWork()).filter((w) => service.relatedWork.includes(w.slug));

  return (
    <>
      <JsonLd
        data={[
          serviceLd(service),
          breadcrumbLd([
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${slug}` },
          ]),
        ]}
      />
      <PageHeader
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: service.title }]}
        eyebrow="Service"
        title={service.title}
        intro={service.summary}
      >
        <div className="mt-8 flex flex-wrap items-stretch gap-3">
          <div className="flex items-center gap-4 rounded-[12px] border border-border bg-surface py-3 pl-3 pr-6">
            <ServiceIcon slug={service.slug} />
            <dl>
              <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Starting at (USD)</dt>
              <dd className="mt-1 text-2xl font-bold leading-none text-accent">{formatPrice(service.startingPrice)}</dd>
            </dl>
          </div>
          <dl className="flex flex-col justify-center rounded-[12px] border border-border bg-surface px-5 py-3">
            <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Typical timeline</dt>
            <dd className="mt-1 flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent" />
              {service.timeline}
            </dd>
          </dl>
        </div>
      </PageHeader>
      <Container>
        <div className="pt-12">
          <MarkdocBody node={service.body} />
        </div>
        {related.length > 0 ? (
          <section aria-labelledby="related-heading" className="mt-20">
            <h2 id="related-heading" className="mb-8 text-[1.75rem] font-bold tracking-tight">
              Related work
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((w) => (
                <WorkCard key={w.slug} work={w} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
      <ContactCta title="Want to talk about your project?" />
    </>
  );
}
