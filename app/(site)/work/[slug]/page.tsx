import { notFound } from "next/navigation";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { FindableCard } from "@/components/findable-card";
import { MarkdocBody } from "@/components/markdoc-body";
import { ButtonLink, Container, PageHeader, TagList } from "@/components/ui";
import { getSplitGallery, WorkGallery } from "@/components/work-gallery";
import { WorkMedia } from "@/components/work-media";
import Link from "next/link";
import { adminHref, DemoAdmin } from "@/components/demo-admin";
import { OwnerDashboards } from "@/components/owner-dashboards";
import { VideoPlayer } from "@/components/video-player";
import { WorkParts } from "@/components/work-parts";
import { workCategoryLabel } from "@/lib/categories";
import { getWork, getWorkItem } from "@/lib/content";
import { absoluteUrl, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { getWorkVideo } from "@/lib/videos";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getWork()).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const work = await getWorkItem(slug);
  if (!work) return {};
  return pageMetadata({ title: work.title, description: work.summary, path: `/work/${slug}`, type: "article" });
}

export default async function WorkItemPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const work = await getWorkItem(slug);
  if (!work) notFound();
  const project = siteConfig.projects[slug];
  const video = getWorkVideo(slug);
  const adminUrl = project?.admin ? adminHref(project.admin) : null;
  const hasLinks = Boolean(work.liveUrl || adminUrl || work.repoUrl);
  // The local demo URL is a shortcut for `npm run dev` only and never ships.
  const localUrl = process.env.NODE_ENV === "development" && !work.liveUrl ? project?.localUrl : undefined;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: work.title,
            description: work.summary,
            url: absoluteUrl(`/work/${slug}`),
            keywords: [...work.categories.map((c) => workCategoryLabel(c)), ...work.stack].filter(Boolean).join(", "),
            creator: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.name },
          },
          breadcrumbLd([
            { name: "Projects", path: "/work" },
            { name: work.title, path: `/work/${slug}` },
          ]),
        ]}
      />
      <PageHeader
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Projects", href: "/work" }, { name: work.title }]}
        eyebrow="Project"
        title={work.title}
        intro={work.summary}
        asideAfterTitleOnMobile
        aside={
          <WorkMedia
            slug={slug}
            sizes="(min-width: 1024px) 416px, 100vw"
            priority
            className="rounded-[12px] border border-border"
          />
        }
      >
        {work.categories.length ? (
          <ul aria-label="Categories" className="mt-6 flex flex-wrap gap-2">
            {work.categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/work/category/${c}`}
                  className="inline-flex min-h-8 items-center rounded-full border border-accent/40 bg-accent-tint px-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {workCategoryLabel(c)}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4">
          <TagList items={work.stack} label="Stack" />
        </div>
        {hasLinks ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {work.liveUrl ? <ButtonLink href={work.liveUrl}>Visit the live site</ButtonLink> : null}
            {adminUrl ? (
              <ButtonLink href={adminUrl} variant="secondary">
                Try the owner admin
              </ButtonLink>
            ) : null}
            {work.repoUrl ? (
              <ButtonLink href={work.repoUrl} variant="secondary">
                View the source on GitHub
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
        {/* Reminder for undeployed demos, shown during `npm run dev` only. */}
        {project?.liveUrl === null && process.env.NODE_ENV === "development" ? (
          <p className="mt-4 text-sm text-muted">The live link will be added here once it is deployed.</p>
        ) : null}
        {localUrl ? (
          <p className="mt-2 text-sm text-muted">
            Local demo (dev only): <a href={localUrl} className="underline underline-offset-4">{localUrl}</a>
          </p>
        ) : null}
      </PageHeader>
      <Container>
        <div className="pt-12">
          {video ? (
            <section aria-label="Video walkthrough" className="mb-12 max-w-4xl">
              <VideoPlayer
                video={video}
                sizes="(min-width: 1024px) 896px, 100vw"
                className="rounded-[12px] border border-border"
              />
            </section>
          ) : null}
          <MarkdocBody node={work.body} />
          {work.findable ? <FindableCard findable={work.findable} /> : null}
          {slug === "owner-dashboards" ? <OwnerDashboards /> : null}
          {getSplitGallery(slug) ? (
            <WorkParts
              slug={slug}
              siteHref={work.liveUrl ?? localUrl}
              siteComingSoon={project?.liveUrl === null}
              admin={project?.admin}
            />
          ) : (
            <>
              {project?.admin ? <DemoAdmin admin={project.admin} /> : null}
              <WorkGallery slug={slug} />
            </>
          )}
        </div>
      </Container>
      <ContactCta title="Want something like this?" />
    </>
  );
}
