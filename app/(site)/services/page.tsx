import Link from "next/link";
import { ServiceGrid } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { Container, PageHeader } from "@/components/ui";
import { getServices } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Fast, SEO-ready websites (Next.js or WordPress), online booking, ordering and quotes for local businesses, AI assistants for your website, fixing and speeding up existing WordPress, Shopify, React, and Next.js sites, and MVP builds. Starting prices and timelines.",
  path: "/services",
});

// The full range of work behind the packaged services above.
const areas = [
  {
    title: "Frontend",
    text: "React, Next.js, TypeScript, HTML and CSS (Tailwind). Fast, accessible, mobile-first interfaces, from marketing pages to complex dashboards.",
  },
  {
    title: "Backend and APIs",
    text: "Node.js (NestJS), Python (FastAPI, Django) and Ruby on Rails. REST and GraphQL APIs, auth, payments, email and third-party integrations.",
  },
  {
    title: "Databases and search",
    text: "PostgreSQL, MySQL, MongoDB, DynamoDB, Redis and OpenSearch/Elasticsearch. Data modelling, migrations, query tuning and search relevance.",
  },
  {
    title: "Architecture",
    text: "Microservices or a well-structured monolith, whichever fits. System design, clear boundaries, and plans that scale with you.",
  },
  {
    title: "Async and event-driven systems",
    text: "Queues, background jobs, scheduled tasks and pub/sub messaging (SQS, SNS) for work that shouldn't block your users.",
  },
  {
    title: "Cloud and DevOps",
    text: "AWS (certified Solutions Architect: Lambda, EKS), Kubernetes, Docker, Cloudflare, Vercel, CI/CD, monitoring and cost-aware hosting.",
  },
  {
    title: "AI features",
    text: "Assistants, smart search, recommendations and document automation, tested before they ship.",
  },
  {
    title: "Fixes and rescues",
    text: "Slow, broken or half-finished apps: performance, security updates, bugs and cleanup, in code someone else wrote.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Services", path: "/services" }])} />
      <PageHeader
        eyebrow="Services"
        title="What I can help with"
        intro="Websites, online booking and quotes, and AI that saves you time, for local businesses that want more customers and less admin. Each service below is backed by working examples you can try. Prices are starting points in US dollars for a well-scoped job, and every project starts with a short call and a written plan."
      />
      <Container>
        <div className="mt-14">
          <ServiceGrid services={services} headingLevel="h2" />
        </div>

        <section aria-labelledby="areas-heading" className="pt-20 sm:pt-24">
          <h2 id="areas-heading" className="text-[1.75rem] font-bold tracking-tight sm:text-3xl">
            Full stack, end to end
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
            The services above are the usual starting points. Behind them is the full range of web app work, so if your
            project isn&apos;t listed, it&apos;s very likely still something I can take on. Hiring for a startup or a
            product team? See <Link href="/for-teams" className="font-semibold text-accent underline underline-offset-4">how I work with teams</Link>.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <li key={area.title} className="rounded-[12px] border border-border p-6">
                <span aria-hidden="true" className="block h-1 w-8 rounded-full bg-accent" />
                <h3 className="mt-4 font-semibold">{area.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{area.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
      <ContactCta />
    </>
  );
}
