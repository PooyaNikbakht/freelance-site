import type { ReactNode } from "react";

// Flat line icons for the services, keyed by service slug.
const paths: Record<string, ReactNode> = {
  // Rocket over stacked layers.
  "mvp-and-feature-builds": (
    <>
      <path d="M12 3c3 1.6 4.5 4.6 4.5 8.2L14.6 14H9.4l-1.9-2.8C7.5 7.6 9 4.6 12 3Z" />
      <circle cx="12" cy="8.6" r="1.4" />
      <path d="M9.4 14 7 16.4M14.6 14l2.4 2.4" />
      <path d="M4 18.2 12 21l8-2.8" />
    </>
  ),
  // Globe with a lightning bolt.
  "nextjs-websites": (
    <>
      <circle cx="10.5" cy="12" r="7.5" />
      <path d="M3 12h15M10.5 4.5c-2 2.2-2.9 4.7-2.9 7.5s.9 5.3 2.9 7.5M10.5 4.5c2 2.2 2.9 4.7 2.9 7.5" />
      <path d="m19.5 10-2.5 4.5h3l-2.5 4.5" />
    </>
  ),
  // Chat bubble with a sparkle.
  "ai-features": (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3h0A1.5 1.5 0 0 1 4 12.5Z" />
      <path d="M18.5 12.5v2M18.5 18.5v2M15.5 16.5h2M19.5 16.5h2" />
      <path d="M8 8.5h5M8 11h3" />
    </>
  ),
  // Calendar with a check mark.
  "booking-ordering-and-quotes": (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
      <path d="m9.2 14.6 2 2 3.8-3.8" />
    </>
  ),
  // Wrench beside a gauge.
  "fix-and-speed-up": (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l3.5-4.5" />
      <circle cx="12" cy="17" r="1.3" />
      <path d="M6.5 11.5 5 10M17.5 11.5 19 10M12 9V7" />
    </>
  ),
};

export function ServiceIcon({ slug, size = "md" }: { slug: string; size?: "md" | "lg" }) {
  const tile = "bg-accent-tint text-accent";
  const dims = size === "lg" ? "h-24 w-24 rounded-[16px] [&>svg]:h-12 [&>svg]:w-12" : "h-14 w-14 rounded-[12px] [&>svg]:h-7 [&>svg]:w-7";
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center ${tile} ${dims}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paths[slug] ?? <circle cx="12" cy="12" r="7" />}
      </svg>
    </span>
  );
}
