import type { ProjectLinks } from "@/site.config";
import { DemoAdmin } from "./demo-admin";
import { ButtonLink } from "./ui";
import { getSplitGallery, ShotGrid } from "./work-gallery";

function PartHeading({ id, part, title, intro }: { id: string; part: string; title: string; intro: string }) {
  return (
    <>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">{part}</p>
      <h3 id={id} className="mt-2 text-[1.25rem] font-semibold leading-tight tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">{intro}</p>
    </>
  );
}

/**
 * "What you get" on a business project: the customer site and the owner's admin,
 * each with its own screenshots and a way in.
 */
export function WorkParts({
  slug,
  siteHref,
  siteComingSoon,
  admin,
}: {
  slug: string;
  siteHref?: string;
  siteComingSoon: boolean;
  admin?: ProjectLinks["admin"];
}) {
  const gallery = getSplitGallery(slug);
  if (!gallery) return null;
  return (
    <section aria-labelledby="parts-heading" className="mt-16 border-t border-border pt-12">
      <h2 id="parts-heading" className="text-[1.375rem] font-semibold leading-tight tracking-tight">
        What you get
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        Two parts that work together: the website customers use, and the admin the owner runs the business from.
      </p>

      <section aria-labelledby="part-site" className="mt-10">
        <PartHeading
          id="part-site"
          part="Part 1"
          title="The customer site"
          intro="What customers see and use, on a phone or a laptop."
        />
        <ShotGrid shots={gallery.site} />
        {siteHref ? (
          <div className="mt-6">
            <ButtonLink href={siteHref} variant="secondary">
              Visit the site
            </ButtonLink>
          </div>
        ) : siteComingSoon && process.env.NODE_ENV === "development" ? (
          <p className="mt-6 text-sm text-muted">The site link will be added here once it is deployed.</p>
        ) : null}
      </section>

      <section aria-labelledby="part-admin" className="mt-14 border-t border-border pt-12">
        <PartHeading
          id="part-admin"
          part="Part 2"
          title="The owner's admin"
          intro="Where the owner runs the day, behind a login of its own for this business."
        />
        <ShotGrid shots={gallery.admin} />
        {admin ? <DemoAdmin admin={admin} headingLevel="h4" className="mt-8" /> : null}
      </section>
    </section>
  );
}
