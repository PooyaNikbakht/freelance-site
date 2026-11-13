"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "./ui";

const compact = "min-h-11! px-4! text-sm!";

/**
 * Slim bottom bar on project pages. Shown once the header actions (#project-actions) have scrolled
 * above the viewport, hidden again while the contact CTA band is in view. SSR renders it hidden.
 */
export function ProjectStickyBar({
  title,
  liveUrl,
  adminUrl,
  repoUrl,
}: {
  title: string;
  liveUrl?: string | null;
  adminUrl?: string | null;
  repoUrl?: string | null;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const actions = document.getElementById("project-actions");
    const cta = document.querySelector('section[aria-labelledby="cta-heading"]');
    if (!actions) return;
    let pastActions = false;
    let ctaVisible = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === actions) pastActions = !e.isIntersecting && e.boundingClientRect.top < 0;
        else ctaVisible = e.isIntersecting;
      }
      setShow(pastActions && !ctaVisible);
    });
    io.observe(actions);
    if (cta) io.observe(cta);
    return () => io.disconnect();
  }, []);

  if (!liveUrl && !adminUrl && !repoUrl) return null;

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`band-dark fixed inset-x-0 lg:hidden bottom-0 z-30 border-t border-border pb-[env(safe-area-inset-bottom)] transition-[transform,opacity,visibility] duration-200 motion-reduce:transition-none ${
        show ? "translate-y-0 opacity-100" : "invisible translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-3 px-4 py-2.5 sm:justify-between sm:px-6">
        <p className="hidden min-w-0 truncate font-semibold text-ink sm:block">{title}</p>
        <div className="flex shrink-0 gap-2">
          {liveUrl ? (
            <ButtonLink href={liveUrl} className={compact}>
              Visit the live site
            </ButtonLink>
          ) : null}
          {adminUrl ? (
            <ButtonLink href={adminUrl} variant="secondary" className={compact}>
              Try the owner admin
            </ButtonLink>
          ) : null}
          {repoUrl ? (
            <ButtonLink href={repoUrl} variant="secondary" className={`${compact} hidden! md:inline-flex!`}>
              View source
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}
