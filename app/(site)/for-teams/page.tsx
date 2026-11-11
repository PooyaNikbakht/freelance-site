import { WorkCard } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Container, PageHeader, SectionHeading } from "@/components/ui";
import { getWork } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For startups and teams",
  description:
    "A senior full-stack and AI engineer for startups and product teams: React and Next.js frontends, Node and Python APIs, databases, microservices, async systems on AWS, and AI features that are tested before they ship.",
  path: "/for-teams",
});

// Projects that show the engineering side, in the order they appear here.
const technicalProjects = ["marketplace-search", "workflow-runner", "shop-search", "docs-chat", "paperwork-ai", "site-rescue"];

const offers = [
  {
    title: "Own a feature end to end",
    text: "From the database schema and API contract to a polished, accessible UI, with tests and a clear PR.",
  },
  {
    title: "APIs, data and architecture",
    text: "REST and GraphQL APIs, data models, microservices, queues and background jobs, sized to your traffic and your team.",
  },
  {
    title: "AI that holds up in production",
    text: "Tool calling, structured outputs validated against a schema, retrieval with citations, and eval suites so a prompt or model change can't quietly make things worse.",
  },
  {
    title: "Performance and rescue work",
    text: "Slow pages, heavy bundles, slow queries, flaky jobs. I measure first, fix what matters, and show the before and after.",
  },
];

const howWeWork = [
  "Work in your repo, your tools and your process: GitHub or GitLab, Jira or Linear, your CI.",
  "Small PRs with tests and a short description, ready for your review.",
  "Written async updates at the end of each working session, so you always know where things stand.",
  "Hourly or fixed-price milestones, agreed in writing before work starts.",
];

export default async function ForTeamsPage() {
  const work = await getWork();
  const projects = technicalProjects
    .map((slug) => work.find((w) => w.slug === slug))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "For startups and teams", path: "/for-teams" }])} />
      <PageHeader
        eyebrow="For startups and teams"
        title="A senior full-stack and AI engineer for your team"
        intro="I've spent 10+ years building web products, most recently search, recommendations, microservices and AI features at ApplyBoard, a marketplace used by hundreds of thousands of students. I can join your team for a feature, a project or a few hours a week, and take work from idea to production."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Talk about your project</ButtonLink>
          <ButtonLink href="/services#areas-heading" variant="secondary">
            See the full stack I cover
          </ButtonLink>
        </div>
      </PageHeader>
      <Container>
        <section aria-labelledby="offers-heading" className="pt-16">
          <SectionHeading id="offers-heading" eyebrow="What I take on" title="Where I help most" />
          <ul className="grid gap-5 sm:grid-cols-2">
            {offers.map((o) => (
              <li key={o.title} className="rounded-[12px] border border-border p-6">
                <span aria-hidden="true" className="block h-1 w-8 rounded-full bg-accent" />
                <h3 className="mt-4 font-semibold">{o.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{o.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {projects.length ? (
          <section aria-labelledby="tech-work-heading" className="pt-20 sm:pt-24">
            <SectionHeading id="tech-work-heading" eyebrow="Projects" title="Engineering work you can look at">
              <p>Public code you can read and run, plus a summary of production work I can describe but not show.</p>
            </SectionHeading>
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((w) => (
                <WorkCard key={w.slug} work={w} sizes="(min-width: 768px) 50vw, 100vw" />
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="team-process-heading" className="pt-20 sm:pt-24">
          <SectionHeading id="team-process-heading" eyebrow="Working together" title="How I work with teams" />
          <ul className="max-w-3xl space-y-3 text-[0.9375rem] leading-relaxed">
            {howWeWork.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </Container>
      <ContactCta title="Need an extra senior engineer?" text="Tell me about your stack and what you need shipped. I'll reply with questions and a rough plan." />
    </>
  );
}
