import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { MarkdocInline } from "@/components/markdoc-inline";
import { Container, PageHeader, Portrait } from "@/components/ui";
import { VideoPlayer } from "@/components/video-player";
import { type AboutActivity, type AboutTimelineEntry, getAbout } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { dateRange, tenure } from "@/lib/tenure";
import { introVideo } from "@/lib/videos";
import { siteConfig } from "@/site.config";

// Everything on this page is edited in Keystatic (the "About page" singleton, content/about.yaml).

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return pageMetadata({
    title: "About",
    description: about.metaDescription || about.lead,
    path: "/about",
  });
}

type Entry = { title: string; org: string; link: string | null; meta: string; body: AboutTimelineEntry["body"] };

const bodyClass =
  "mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-[3px]";

function Timeline({ id, title, entries }: { id: string; title: string; entries: Entry[] }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-[1.375rem] font-bold tracking-tight">
        {title}
      </h2>
      <ol className="mt-6 border-l border-border">
        {entries.map((e) => (
          <li key={e.title + e.org} className="relative pb-9 pl-7 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[5px] top-[0.45rem] h-[9px] w-[9px] rounded-full border-2 border-accent bg-background"
            />
            <h3 className="font-semibold leading-snug">{e.title}</h3>
            <p className="mt-0.5 text-[0.9375rem] text-ink">
              {e.link ? (
                <a href={e.link} className="underline-offset-[3px] hover:text-accent hover:underline">
                  {e.org}
                </a>
              ) : (
                e.org
              )}
              {e.meta ? <span className="text-muted"> · {e.meta}</span> : null}
            </p>
            <MarkdocInline node={e.body} className={bodyClass} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function TrackRecord({ activity }: { activity: AboutActivity }) {
  const total = activity.graphs.reduce((sum, g) => sum + g.contributions, 0);
  const years = activity.graphs.map((g) => Number(g.year)).filter(Boolean);
  return (
    <section aria-labelledby="track-record-heading">
      <h2 id="track-record-heading" className="text-[1.375rem] font-bold tracking-tight">
        {activity.title || "Track record"}
      </h2>
      {activity.intro ? <p className={bodyClass + " mt-3"}>{activity.intro}</p> : null}

      {activity.graphs.length ? (
        <div className="mt-8">
          <h3 className="font-semibold">
            My GitHub contributions, company account
            {total ? (
              <span className="font-normal text-muted">
                {" "}
                · {total.toLocaleString("en-US")} since {Math.min(...years)}
              </span>
            ) : null}
          </h3>
          <ul className="mt-4 space-y-5">
            {activity.graphs.map((g) => (
              <li key={g.year}>
                <figure>
                  <figcaption className="mb-2 flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-semibold">{g.year}</span>
                    <span className="font-mono text-xs text-muted">
                      {g.contributions.toLocaleString("en-US")} contributions
                    </span>
                  </figcaption>
                  <div className="overflow-hidden rounded-[10px] border border-border bg-white">
                    <Image
                      src={g.image}
                      alt={`GitHub contribution graph for ${g.year}: ${g.contributions} contributions`}
                      width={1490}
                      height={320}
                      sizes="(min-width: 1024px) 680px, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {activity.ticketCharts.length ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {activity.ticketCharts.map((chart) => {
            const max = Math.max(...chart.bars.map((b) => b.value), 1);
            return (
              <figure key={chart.title} className="rounded-[12px] border border-border p-5">
                <figcaption>
                  <h3 className="font-semibold">{chart.title}</h3>
                  {chart.note ? <p className="mt-1 text-sm leading-snug text-muted">{chart.note}</p> : null}
                </figcaption>
                <ol className="mt-5 space-y-3">
                  {chart.bars.map((b) => (
                    <li key={b.name} className="text-sm">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={b.me ? "font-semibold text-accent" : "text-muted"}>{b.name}</span>
                        <span className={"font-mono text-xs " + (b.me ? "font-semibold text-ink" : "text-muted")}>
                          {b.value}
                        </span>
                      </div>
                      <div aria-hidden="true" className="mt-1 h-2 rounded-full bg-surface">
                        <div
                          className={"h-2 rounded-full " + (b.me ? "bg-accent" : "bg-border")}
                          style={{ width: `${(b.value / max) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              </figure>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

const elsewhere = [
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Google Scholar", href: siteConfig.links.scholar },
  { label: "GitHub", href: siteConfig.links.github },
].filter((l) => l.href);

export default async function AboutPage() {
  const about = await getAbout();
  const experience: Entry[] = about.experience.map((e) => ({ ...e, meta: tenure(e.start, e.end) }));
  const education: Entry[] = about.education.map((e) => ({
    ...e,
    meta: [dateRange(e.start, e.end), e.meta].filter(Boolean).join(" · "),
  }));
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "About", path: "/about" }])} />
      <PageHeader
        eyebrow="About"
        title={about.title}
        intro={about.lead}
        aside={<Portrait priority className="mx-auto max-w-[15rem] lg:ml-auto lg:mr-0" />}
      />
      <Container>
        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="min-w-0 space-y-16">
            <section aria-labelledby="video-heading">
              <h2 id="video-heading" className="text-[1.375rem] font-bold tracking-tight">
                A short video about me and my work
              </h2>
              <VideoPlayer
                video={introVideo}
                sizes="(min-width: 1024px) 720px, 100vw"
                className="mt-5 rounded-[12px] border border-border"
              />
            </section>

            {about.intro.length ? (
              <div className="prose">
                {about.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {about.howIWork.length ? (
              <div className="prose">
                <h2 id="how-i-work">How I work</h2>
                <ul>
                  {about.howIWork.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {about.activity.graphs.length || about.activity.ticketCharts.length ? (
              <TrackRecord activity={about.activity} />
            ) : null}

            {experience.length ? <Timeline id="experience-heading" title="Experience" entries={experience} /> : null}
            {education.length ? <Timeline id="education-heading" title="Education" entries={education} /> : null}

            <section aria-labelledby="publications-heading">
              <h2 id="publications-heading" className="text-[1.375rem] font-bold tracking-tight">
                Publications
              </h2>
              {about.publicationsIntro ? (
                <MarkdocInline
                  node={about.publicationsIntro}
                  className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-[3px]"
                />
              ) : null}
              {about.publications.length ? (
                <ol className="mt-5 divide-y divide-border border-y border-border">
                  {about.publications.map((p) => (
                    <li key={p.title} className="flex items-baseline justify-between gap-6 py-3">
                      <a href={p.link} className="font-medium leading-snug hover:text-accent">
                        {p.title}
                      </a>
                      <span className="shrink-0 font-mono text-xs text-muted">{p.venue}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              <p className="mt-5">
                <Link
                  href="/work#research"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
                >
                  All research and earlier projects
                  <span aria-hidden="true">→</span>
                </Link>
              </p>
            </section>
            <p className="mt-12 text-[0.9375rem] text-muted">
              Hiring for a startup or a product team?{" "}
              <Link
                href="/for-teams"
                className="whitespace-nowrap font-semibold text-ink underline underline-offset-4 hover:text-accent"
              >
                See how I work with teams
              </Link>
            </p>
          </div>

          <div className="space-y-5">
            {about.stack.length ? (
              <aside aria-labelledby="stack-heading" className="rounded-[12px] border border-border bg-accent-tint p-6">
                <h2 id="stack-heading" className="font-semibold">
                  Day-to-day stack
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
                  {about.stack.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{s.label}</dt>
                      <dd className="mt-1 leading-relaxed">{s.items}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            ) : null}
            {elsewhere.length ? (
              <aside aria-labelledby="elsewhere-heading" className="rounded-[12px] border border-border p-6">
                <h2 id="elsewhere-heading" className="font-semibold">
                  Elsewhere
                </h2>
                <ul className="mt-3 text-sm">
                  {elsewhere.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        rel="me"
                        className="inline-flex min-h-10 items-center gap-2 font-medium text-accent underline-offset-4 hover:underline"
                      >
                        {l.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </Container>
      <ContactCta />
    </>
  );
}
