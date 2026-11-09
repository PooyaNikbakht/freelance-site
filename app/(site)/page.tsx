import Link from "next/link";
import { ServiceGrid, WorkCard } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { HeroCollage } from "@/components/hero-collage";
import { ButtonLink, Container, DotGrid, Eyebrow, Portrait, SectionHeading } from "@/components/ui";
import { getFeaturedWork, getServices, getSettings } from "@/lib/content";
import { pageMetadata, personLd, professionalServiceLd, siteDescription } from "@/lib/seo";

export const metadata = pageMetadata({ description: siteDescription, path: "/" });

const steps = [
  {
    title: "Short call",
    text: "We talk through what you're building, who it's for, and what done looks like.",
  },
  {
    title: "Written plan",
    text: "I send a short written plan: scope, milestones, price, and the questions I still have. Nothing starts until you're happy with it.",
  },
  {
    title: "Small milestones",
    text: "Work ships in small pieces you can see and test. You get written updates you can read at the start of your day.",
  },
  {
    title: "Launch and support",
    text: "Careful, finished work at the price we agreed. After launch I stay available for fixes and the next round of improvements.",
  },
];

const credentials = [
  { big: "10+ years", caption: "building web products" },
  { big: "Founder", caption: "of a startup, then product owner" },
  { big: "MSc CS", caption: "research in optimization algorithms" },
  { big: "AWS certified", caption: "Solutions Architect" },
] as const;

// The phrase in the headline that gets the amber underline, if the CMS headline contains it.
const highlightPhrase = "small businesses";

function Headline({ text }: { text: string }) {
  const i = text.indexOf(highlightPhrase);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="marker">{highlightPhrase}</span>
      {text.slice(i + highlightPhrase.length)}
    </>
  );
}

export default async function HomePage() {
  const [settings, services, featured] = await Promise.all([getSettings(), getServices(), getFeaturedWork(4)]);

  return (
    <>
      <JsonLd data={[personLd(), professionalServiceLd(services)]} />

      <section aria-labelledby="hero-heading" className="band-dark relative overflow-hidden">
        <DotGrid className="opacity-[0.035]" />
        <Container className="relative grid items-center gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="min-w-0">
            <Eyebrow>Senior full-stack engineer, freelance</Eyebrow>
            <h1
              id="hero-heading"
              className="mt-5 text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-[3.5rem] lg:text-[4rem]"
            >
              <Headline text={settings.headline} />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{settings.subline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ButtonLink href="/work" variant="secondary">
                See my work
              </ButtonLink>
            </div>
          </div>
          <HeroCollage />
        </Container>
      </section>

      <section aria-label="Background" className="border-b border-border bg-surface">
        <Container>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
            {credentials.map((c) => (
              <li key={c.big}>
                <span
                  aria-hidden="true"
                  className="block h-1 w-8 rounded-full bg-accent"
                />
                <p className="mt-4 text-[1.5rem] font-bold leading-tight tracking-tight sm:text-[2rem]">{c.big}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{c.caption}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        <section aria-labelledby="services-heading" className="pt-20 sm:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-8">
            <SectionHeading id="services-heading" eyebrow="Services" title="What I do">
              <p>
                Full-stack web work, from frontend to backend, databases, APIs and cloud architecture. These are the most
                common starting points, each backed by real projects.
              </p>
            </SectionHeading>
            <Link
              href="/services"
              className="mb-10 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
            >
              See all services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ServiceGrid services={services} />
        </section>

        <section aria-labelledby="work-heading" className="pt-20 sm:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-8">
            <SectionHeading id="work-heading" eyebrow="Selected projects" title="Recent projects">
              <p>Built the way I&apos;d build yours: try them live, read how they work, and see the numbers.</p>
            </SectionHeading>
            <Link
              href="/work"
              className="mb-10 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
            >
              See all projects
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((w) => (
              <WorkCard key={w.slug} work={w} sizes="(min-width: 768px) 50vw, 100vw" />
            ))}
          </div>
        </section>
      </Container>

      <section aria-labelledby="process-heading" className="mt-20 bg-accent-tint py-16 sm:mt-24 sm:py-20">
        <Container>
          <SectionHeading id="process-heading" eyebrow="Process" title="How I work">
            <p>Four steps, the same on every project, so you always know what happens next.</p>
          </SectionHeading>
          <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="relative pl-20 lg:pl-0">
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-2rem] left-7 top-16 w-[2px] bg-accent lg:bottom-auto lg:left-[4.5rem] lg:right-[-1rem] lg:top-7 lg:h-[2px] lg:w-auto"
                  >
                    <svg
                      viewBox="0 0 10 10"
                      className="absolute -bottom-1 -left-[4px] h-2.5 w-2.5 rotate-90 fill-accent lg:-right-1 lg:-top-[4px] lg:bottom-auto lg:left-auto lg:rotate-0"
                    >
                      <path d="M0 0 10 5 0 10Z" />
                    </svg>
                  </span>
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 inline-flex h-14 w-14 items-center justify-center rounded-[12px] bg-accent-2 font-mono text-xl font-bold text-accent-2-ink lg:static"
                >
                  0{i + 1}
                </span>
                <h3 className="text-lg font-bold lg:mt-5">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container>
        <section aria-labelledby="about-heading" className="pt-20 sm:pt-24">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-14">
            <Portrait className="max-w-[17rem]" />
            <div className="max-w-2xl">
              <Eyebrow>About</Eyebrow>
              <h2 id="about-heading" className="mt-3 text-[1.75rem] font-bold tracking-tight sm:text-4xl">
                Hi, I&apos;m Pooya
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                I&apos;m a senior full-stack engineer with 10+ years of experience, from founding a startup to building
                large-scale products at bigger companies: one of the top Persian news apps, and a global marketplace with
                high-traffic search, recommendation systems, microservices on AWS, and AI features. I bring that same care
                for solid architecture and fast, reliable systems to every project, big or small.
              </p>
              <p className="mt-6">
                <Link
                  href="/about"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
                >
                  More about my background
                  <span aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </Container>

      <ContactCta />
    </>
  );
}
