import { siteConfig } from "@/site.config";
import { ButtonLink, Container } from "./ui";

/** Full-bleed solid teal call to action. Render it outside any Container. */
export function ContactCta({
  title = "Have a project in mind?",
  text = "Send a short note on what you're building. I'll reply with questions and a rough plan.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className="band-teal mt-24">
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 id="cta-heading" className="text-[1.875rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">
            {title}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact">Start a project</ButtonLink>
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
