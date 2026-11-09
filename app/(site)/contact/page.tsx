import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { Container, PageHeader } from "@/components/ui";
import { getSettings } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a project with Pooya Nikbakht. Send a short message through the form, email, or book a short call, and see what happens next.",
  path: "/contact",
});

const nextSteps = [
  "I reply within 1 to 2 business days with a few questions",
  "A short call to understand your business and goals",
  "A written plan with scope, milestones, and a fixed price, before any work starts",
];

// The page itself is static. Only the form is a client component, and it posts to /api/contact.
export default async function ContactPage() {
  const settings = await getSettings();
  const subject = encodeURIComponent("New project");
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Contact", path: "/contact" }])} />
      <PageHeader
        eyebrow="Contact"
        title="Start a project"
        intro="Send a short note on what you're building. I'll reply with questions and a rough plan."
      />
      <Container className="pb-24">
        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <section aria-labelledby="form-heading" className="min-w-0">
            <h2 id="form-heading" className="text-xl font-semibold tracking-tight">
              Tell me about your project
            </h2>
            <div className="mt-5">
              <ContactForm email={siteConfig.email} />
            </div>
          </section>

          <aside aria-label="About getting in touch" className="min-w-0 space-y-6">
            <section aria-labelledby="next-heading" className="rounded-[12px] bg-accent-tint p-6">
              <h2 id="next-heading" className="text-lg font-semibold tracking-tight">
                What happens next
              </h2>
              <ol className="mt-5 space-y-4">
                {nextSteps.map((step, i) => (
                  <li key={step} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-accent font-mono text-xs font-bold text-accent-ink"
                    >
                      0{i + 1}
                    </span>
                    <p className="pt-1 text-[0.9375rem] leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
              <Link
                href="/about#how-i-work"
                className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-accent hover:underline hover:underline-offset-2"
              >
                See how I work
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </section>

            <section aria-labelledby="email-heading" className="rounded-[12px] border border-border p-6">
              <h2 id="email-heading" className="text-lg font-semibold tracking-tight">
                Prefer email?
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                Write to{" "}
                <a
                  href={`mailto:${siteConfig.email}?subject=${subject}`}
                  className="break-all font-medium text-accent underline underline-offset-2"
                >
                  {siteConfig.email}
                </a>
                {siteConfig.bookingUrl ? (
                  <>
                    {" "}
                    or{" "}
                    <a href={siteConfig.bookingUrl} className="font-medium text-accent underline underline-offset-2">
                      book a short call
                    </a>
                  </>
                ) : null}
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{settings.availability}</p>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
