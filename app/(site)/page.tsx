import Link from "next/link";
import { Fragment } from "react";
import { ServiceGrid, WorkCard } from "@/components/cards";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { ScrollLink } from "@/components/scroll-link";
import { HeroCollage } from "@/components/hero-collage";
import { VideoPlayer } from "@/components/video-player";
import { ButtonLink, Container, DotGrid, Eyebrow, Portrait, SectionHeading } from "@/components/ui";
import { getFeaturedWork, getServices, getSettings } from "@/lib/content";
import { pageMetadata, personLd, professionalServiceLd, siteDescription } from "@/lib/seo";
import { introVideo } from "@/lib/videos";

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
  { big: "10+ years", caption: "building web products, from a startup to a large marketplace" },
  { big: "End to end", caption: "design, frontend, backend, database and cloud" },
  { big: "Try it live", caption: "every project here has a working demo" },
  { big: "AWS certified", caption: "Solutions Architect" },
] as const;

const heroWords = ["AI", "Website", "App"] as const;

// The phrase in the headline (plus any punctuation right after it) shown in gold, if the CMS headline contains it.
const highlightPhrase = "fair price";

function Highlighted({ text }: { text: string }) {
  const i = text.indexOf(highlightPhrase);
  if (i === -1) return <>{text}</>;
  const end = i + highlightPhrase.length;
  const punct = /^[.!?]*/.exec(text.slice(end))?.[0] ?? "";
  return (
    <>
      {text.slice(0, i)}
      {/* Non-breaking space keeps the phrase on one line. */}
      <span>{highlightPhrase.replace(/ /g, "\u00a0") + punct}</span>
      {text.slice(end + punct.length)}
    </>
  );
}

/**
 * Two-line hero heading. The line below the h1 sets the size, and the h1 is 1.891em of it, measured from
 * Inter's shaped widths for "Custom-built for you at a fair price." so both lines render the same width at
 * every viewport (re-measure if the headline copy changes). Dots and margins are in em, so they scale with
 * it. Below 820px the size is fluid: the lines fill 75% of the container (0.75 / 15.79em per line), never
 * below 1.2rem and never above 28px (about 442px wide). From 820px the hero is two columns, so the size steps down until lg.
 */
function HeroHeading({ headline }: { headline: string }) {
  return (
    <div className="max-sm:text-[clamp(1.2rem,calc((100vw_-_32px)*0.0475),28px)] sm:max-[820px]:text-[clamp(1.2rem,calc((100vw_-_48px)*0.0475),28px)] min-[820px]:max-lg:text-[1.4rem] lg:text-[1.9rem]">
      <h1 id="hero-heading" className="whitespace-nowrap text-[1.891em] font-bold leading-[1.05] tracking-[-0.03em]">
        <span className="sr-only">{heroWords.join(", ")}</span>
        <span aria-hidden="true">
          {heroWords.map((w, i) => (
            <Fragment key={w}>
              {i > 0 ? (
                <span className="mx-[0.32em] inline-block h-[0.2em] w-[0.2em] rounded-full bg-[#2dd4bf] align-middle" />
              ) : null}
              {w}
            </Fragment>
          ))}
        </span>
      </h1>
      <div className="mt-3.5 whitespace-nowrap font-medium leading-snug tracking-tight text-ink/90">
        <Highlighted text={headline} />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [settings, services, featured] = await Promise.all([getSettings(), getServices(), getFeaturedWork(6)]);

  return (
    <>
      <JsonLd data={[personLd(), professionalServiceLd(services)]} />

      <section aria-labelledby="hero-heading" className="band-dark relative overflow-hidden">
        <DotGrid className="opacity-[0.035]" />
        <Container className="relative grid items-center gap-8 pb-12 pt-6 sm:pb-14 sm:pt-8 min-[820px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[820px]:gap-10 lg:pb-14 lg:pt-10">
          <div className="min-w-0">
            <HeroHeading headline={settings.headline} />
            <p className="mt-[18px] max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{settings.subline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Let&apos;s chat, it&apos;s free</ButtonLink>
              <ButtonLink href="/work" variant="secondary">
                See my projects
              </ButtonLink>
            </div>
            <p className="mt-6 text-[0.875rem] text-muted sm:text-[0.9375rem]">
              Prefer to watch? See who I am and what I&apos;ve built in{" "}
              <span className="whitespace-nowrap">
                <ScrollLink
                  targetId="intro"
                  headingId="intro-heading"
                  className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
                >
                  a short video
                </ScrollLink>
                .
              </span>
            </p>
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
        <section id="intro" aria-labelledby="intro-heading" className="scroll-mt-4 pt-20 sm:pt-24">
          <div className="grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14 lg:[&>*:first-child]:mb-0">
            <SectionHeading id="intro-heading" eyebrow="Intro" title="Meet me in two minutes">
              <p>
                Nice to meet you! Here&apos;s a short video about who I am, what I&apos;ve built, and how we could
                work together.
              </p>
            </SectionHeading>
            <VideoPlayer
              video={introVideo}
              sizes="(min-width: 1024px) 680px, 100vw"
              className="rounded-[12px] border border-border"
            />
          </div>
        </section>

        <section aria-labelledby="services-heading" className="pt-20 sm:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-8">
            <SectionHeading id="services-heading" eyebrow="Services" title="What I do">
              <p>
                Websites, web apps, AI assistants and automations, and fixes for sites you already have. These are the
                most common starting points, each backed by a project you can try.
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
              <p>
                One for each kind of work: try them live, read how they were built, and see the numbers.
              </p>
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
              <WorkCard key={w.slug} work={w} sizes="(min-width: 768px) 50vw, 100vw" showStack={false} />
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
                I&apos;m a senior full-stack and AI engineer with 10+ years of experience, from founding a startup to building
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
