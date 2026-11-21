import Link from "next/link";
import { formatPrice } from "@/lib/seo";
import { siteConfig } from "@/site.config";
import { ButtonLink, Container } from "./ui";

/** Full-bleed solid teal call to action. Render it outside any Container. */
export function ContactCta({
  title = "Have a project in mind?",
  service,
  text = "Send a short note on what you're building or the idea you have. I'll reply with questions and a rough plan. It's free, and I'd love to connect and help.",
}: {
  title?: string;
  text?: string;
  /** The matching service. Adds its timeline, starting price and a link to it. */
  service?: { slug: string; title: string; timeline: string; startingPrice: number };
}) {
  return (
    <section aria-labelledby="cta-heading" className="band-teal mt-24">
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 id="cta-heading" className="text-[1.875rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">
            {title}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{text}</p>
          {service ? (
            <p className="mt-4 text-base font-medium">
              {service.timeline ? `Typical timeline: ${service.timeline} · ` : ""}From {formatPrice(service.startingPrice)}.{" "}
              <Link href={`/services/${service.slug}`} className="underline underline-offset-4">
                See {service.title}
              </Link>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Let&apos;s chat, it&apos;s free</ButtonLink>
            {siteConfig.bookingUrl ? (
              <ButtonLink href={siteConfig.bookingUrl} variant="secondary">
                Book a short call
              </ButtonLink>
            ) : (
              <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary" className="break-all">
                Email {siteConfig.email}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
