import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="band-dark relative flex-1 overflow-hidden">
        <Container className="relative py-24 sm:py-32">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-3 text-[2.25rem] font-bold leading-tight tracking-tight sm:text-5xl">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            The link may be old, or the page may have moved. These are good places to start instead.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/">Go to the home page</ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              See my work
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
