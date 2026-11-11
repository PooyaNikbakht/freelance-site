import Link from "next/link";
import { type Post, type Research, researchTypeLabels, type Service, type Work } from "@/lib/content";
import { formatDate, formatPrice } from "@/lib/seo";
import { ServiceIcon } from "./service-icon";
import { TagList } from "./ui";
import { WorkMedia } from "./work-media";

const card =
  "group relative flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-background transition-colors hover:border-accent focus-within:border-accent";
const stretched = "after:absolute after:inset-0 after:rounded-[12px] focus-visible:outline-none";

export function ServiceCard({ service, headingLevel = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={`${card} p-6 sm:p-7`}>
      <ServiceIcon slug={service.slug} />
      <H className="mt-5 text-xl font-bold tracking-tight">
        <Link href={`/services/${service.slug}`} className={`${stretched} group-hover:text-accent`}>
          {service.title}
        </Link>
      </H>
      <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{service.summary}</p>
      <dl className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-border pt-5">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Starting at (USD)</dt>
          <dd className="mt-1 text-[1.75rem] font-bold leading-none tracking-tight text-accent">
            {formatPrice(service.startingPrice)}
          </dd>
        </div>
        <div className="text-sm">
          <dt className="sr-only">Typical timeline</dt>
          <dd className="flex items-center gap-2 text-muted">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent" />
            {service.timeline}
          </dd>
        </div>
      </dl>
    </article>
  );
}

/**
 * Service cards in a balanced grid: two columns on tablets, and on wide screens
 * rows of three with a last row of two wider cards when the count calls for it
 * (five cards become three plus two). A lone last card on tablets spans the row.
 */
export function ServiceGrid({ services, headingLevel = "h3" }: { services: Service[]; headingLevel?: "h2" | "h3" }) {
  const n = services.length;
  const lastRowOfTwo = n % 3 === 2;
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
      {services.map((s, i) => {
        const wide = lastRowOfTwo && i >= n - 2;
        const lone = n % 2 === 1 && i === n - 1;
        return (
          <li key={s.slug} className={`${wide ? "lg:col-span-3" : "lg:col-span-2"} ${lone ? "sm:col-span-2 lg:col-span-3" : ""}`}>
            <ServiceCard service={s} headingLevel={headingLevel} />
          </li>
        );
      })}
    </ul>
  );
}

export function WorkCard({
  work,
  headingLevel = "h3",
  sizes = "(min-width: 768px) 33vw, 100vw",
  showStack = true,
}: {
  work: Work;
  headingLevel?: "h2" | "h3";
  sizes?: string;
  /** The stack tags help technical readers; the home page leaves them off. */
  showStack?: boolean;
}) {
  const H = headingLevel;
  return (
    <article className={card}>
      <WorkMedia slug={work.slug} sizes={sizes} className="border-b border-border" />
      <div className="flex flex-1 flex-col p-6">
        <H className="text-lg font-bold leading-snug tracking-tight">
          <Link href={`/work/${work.slug}`} className={`${stretched} group-hover:text-accent`}>
            {work.title}
          </Link>
        </H>
        <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted">{work.summary}</p>
        {showStack ? (
          <div className="mt-5">
            <TagList items={work.stack.slice(0, 4)} label={`Stack for ${work.title}`} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function PostItem({ post, headingLevel = "h2" }: { post: Post; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="group relative border-b border-border py-6 first:pt-0 last:border-0">
      <p className="font-mono text-xs text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        {post.readingMinutes} min read
        {post.draft ? <span className="ml-2 text-danger">Draft</span> : null}
      </p>
      <H className="mt-2 text-xl font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className={`${stretched} group-hover:text-accent`}>
          {post.title}
        </Link>
      </H>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">{post.description}</p>
    </article>
  );
}

/** Compact card for research and earlier projects: no thumbnail, quieter than a case study. */
export function ResearchCard({ item, headingLevel = "h3" }: { item: Research; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-[12px] border border-border bg-background p-5 transition-colors hover:border-accent focus-within:border-accent sm:p-6">
      <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted">
        <span className="text-accent">{researchTypeLabels[item.type]}</span>
        {item.year ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.year}</span>
          </>
        ) : null}
      </p>
      <H className="mt-2.5 text-base font-semibold leading-snug tracking-tight sm:text-[1.0625rem]">
        <Link href={`/work/research/${item.slug}`} className={`${stretched} group-hover:text-accent`}>
          {item.title}
        </Link>
      </H>
      <div className="mt-2 flex-1">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{item.summary}</p>
      </div>
    </article>
  );
}
