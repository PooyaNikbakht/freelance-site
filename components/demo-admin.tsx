import type { ProjectLinks } from "@/site.config";
import { ButtonLink } from "./ui";

type Admin = NonNullable<ProjectLinks["admin"]>;

/** The business's own owner admin: the production URL, or the local one during `npm run dev` only. */
export function adminHref(admin: Admin) {
  return admin.url ?? (process.env.NODE_ENV === "development" ? admin.localUrl : null);
}

/** "Try the owner admin" box on a case study: the demo login for the business owner's side. */
export function DemoAdmin({
  admin,
  headingLevel = "h2",
  className = "mt-16",
}: {
  admin: Admin;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}) {
  const href = adminHref(admin);
  const Heading = headingLevel;
  return (
    <section aria-labelledby="admin-heading" className={`rounded-[12px] border border-border bg-surface p-6 sm:p-8 ${className}`}>
      <Heading id="admin-heading" className="text-[1.25rem] font-semibold leading-tight tracking-tight">
        Try the owner admin
      </Heading>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        See the other side as the business owner. On the login page, click &ldquo;Try the demo as the owner&rdquo; to
        sign in with one click. The sample data resets every hour, so change anything you like.
      </p>
      {href ? (
        <div className="mt-6">
          <ButtonLink href={href}>Open the owner admin</ButtonLink>
        </div>
      ) : process.env.NODE_ENV === "development" ? (
        <p className="mt-6 text-sm text-muted">The login link will be added here once it is deployed.</p>
      ) : null}
    </section>
  );
}
