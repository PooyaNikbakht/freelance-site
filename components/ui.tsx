import Image from "next/image";
import Link from "next/link";
import { type ComponentProps, type ReactNode, useId } from "react";
import { siteConfig } from "@/site.config";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: "primary" | "secondary" };

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] px-5 text-[0.9375rem] font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-ink hover:opacity-90"
      : "border border-border text-ink hover:border-accent hover:text-accent";
  return <Link className={`${base} ${styles} ${className}`} {...props} />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">
      <span aria-hidden="true" className="inline-block h-[2px] w-5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-lg leading-relaxed text-muted">{children}</div> : null}
    </div>
  );
}

/** Flat dot grid used behind dark bands. Decorative only. */
export function DotGrid({ className = "" }: { className?: string }) {
  const id = `dots${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.25" fill="#ffffff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Compact dark page header used on every inner page. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  aside,
  asideAfterTitleOnMobile = false,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  intro?: ReactNode;
  breadcrumbs?: { name: string; href?: string }[];
  aside?: ReactNode;
  /** Below lg, place the aside between the title and the intro (desktop layout is unchanged). */
  asideAfterTitleOnMobile?: boolean;
  children?: ReactNode;
}) {
  const head = (
    <>
      {eyebrow ? typeof eyebrow === "string" ? <Eyebrow>{eyebrow}</Eyebrow> : eyebrow : null}
      <h1 className={`mt-4 max-w-3xl text-[2.125rem] font-bold leading-[1.1] tracking-tight sm:text-5xl`}>{title}</h1>
    </>
  );
  const split = Boolean(aside) && asideAfterTitleOnMobile;
  return (
    <header className="band-dark relative overflow-hidden border-b border-border">
      <Container className="relative pb-12 pt-8 sm:pb-16 sm:pt-10">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        {split ? (
          // Below md the column is capped at the body text width (45rem) so title, image and intro share one edge. Three grid children in reading order (head, aside, rest). At md the title has its own full-width row above the summary and image; from lg the aside spans both rows of
          // column 2; the spanning image grows both rows equally, so head (self-end) and rest (self-start)
          // stay flush and centred against it, matching the single-column layout below.
          <div
            className={`${breadcrumbs ? "mt-8" : "mt-4 sm:mt-8"} grid max-w-[45rem] md:max-w-none md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:content-center md:gap-x-10 md:gap-y-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]`}
          >
            <div className="min-w-0 md:col-span-2 md:col-start-1 md:row-start-1 md:self-end lg:col-span-1">{head}</div>
            <div className="mt-8 min-w-0 md:col-start-2 md:row-start-2 md:mt-5 md:self-start lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center">{aside}</div>
            <div className="min-w-0 md:col-start-1 md:row-start-2 md:self-start">
              {intro ? <div className="mt-8 text-lg leading-relaxed text-muted md:mt-5 md:max-w-2xl">{intro}</div> : null}
              {children}
            </div>
          </div>
        ) : (
          <div
            className={`${breadcrumbs ? "mt-8" : "mt-4 sm:mt-8"} grid items-center gap-10 ${aside ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]" : ""}`}
          >
            <div className="min-w-0">
              {head}
              {intro ? <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</div> : null}
              {children}
            </div>
            {aside ? <div className="min-w-0">{aside}</div> : null}
          </div>
        )}
      </Container>
    </header>
  );
}

export function Monogram({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-8 w-8 text-xs", md: "h-14 w-14 text-base", lg: "h-24 w-24 text-2xl" }[size];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-[8px] bg-accent font-mono font-bold tracking-wider text-accent-ink ${dims}`}
    >
      {siteConfig.initials}
    </span>
  );
}

/** Square portrait for the About sections. Source is a 580px crop, served at both loader widths. */
export function Portrait({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-[12px] border border-border bg-surface ${className}`}>
      <Image
        src="/people/pooya"
        alt={`${siteConfig.name}, smiling, outdoors by a river`}
        fill
        priority={priority}
        sizes="(min-width: 768px) 272px, 80vw"
        className="object-cover"
      />
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-[6px] border border-border bg-surface px-2 py-0.5 font-mono text-xs text-muted">{children}</li>
  );
}

export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </ul>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-nowrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.name} className={`flex items-center gap-1.5 ${item.href ? "shrink-0" : "min-w-0"}`}>
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-ink">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
