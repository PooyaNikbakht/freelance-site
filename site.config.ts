export type ProjectLinks = {
  liveUrl: string | null;
  repoUrl: string | null;
  localUrl?: string;
  admin?: { url: string | null; localUrl?: string };
};

/**
 * Single source for personal details, links, and deploy settings.
 * Every value marked TODO is a placeholder Pooya should confirm before launch.
 * Empty strings or null hide the related link in the UI instead of showing a dead link.
 */
export const siteConfig = {
  // TODO: confirm display name.
  name: "Pooya Nikbakht",
  initials: "PN",
  role: "Senior full-stack & AI engineer",
  email: "contact@pooya.website",
  url: (process.env.SITE_URL ?? "https://pooya.website").replace(/\/$/, ""),
  locale: "en_US",
  timezone: "Eastern Time (ET)",
  links: {
    github: "https://github.com/PooyaNikbakht",
    linkedin: "https://www.linkedin.com/in/pooya-nikbakht",
    scholar: "https://scholar.google.com/citations?user=OlblXBsAAAAJ&hl=en",
    // TODO: add Upwork profile URL.
    upwork: "",
    // TODO: add Contra profile URL.
    contra: "",
  },
  /** Academic background, shown on About and in the Person JSON-LD. */
  education: {
    msc: {
      degree: "MSc in Computer Science",
      school: "University of Manitoba",
      schoolUrl: "https://umanitoba.ca",
      labUrl: "https://home.cs.umanitoba.ca/~gada/",
      thesisUrl:
        "https://mspace.lib.umanitoba.ca/server/api/core/bitstreams/a4a362db-ba40-4eda-8f8b-fb00a5461985/content",
    },
    bsc: {
      degree: "BSc in Software Engineering",
      school: "Isfahan University of Technology",
      schoolUrl: "https://iut.ac.ir",
    },
  },
  // TODO: add a booking link (for example a Cal.com or Calendly page). Hidden while empty.
  bookingUrl: "",
  /**
   * Demo links for case studies, keyed by work entry slug. These override the
   * liveUrl / repoUrl fields in the CMS so deploy URLs live in one place.
   * liveUrl null shows a "live demo coming soon" note; an empty string shows nothing.
   * localUrl is only shown during `npm run dev`, as a shortcut to the local demo.
   * admin adds a "Try the owner admin" box with a demo login, linking to that business's
   * own admin on its own host. Its url is null until the demo is deployed; localUrl is
   * only shown during `npm run dev`.
   * repoUrl null hides the "View code" link.
   */
  projects: {
    "kingsway-cuts": {
      liveUrl: "https://kingsway.pooya.website",
      repoUrl: null,
      admin: { url: "https://kingsway.pooya.website/admin" },
    },
    "harbourview-physio": {
      liveUrl: "https://harbourview.pooya.website",
      repoUrl: null,
      admin: { url: "https://harbourview.pooya.website/admin" },
    },
    "maple-paws-vet": {
      liveUrl: "https://maplepaws.pooya.website",
      repoUrl: null,
      admin: { url: "https://maplepaws.pooya.website/admin" },
    },
    "northwind-coffee-website": {
      liveUrl: "https://coffee.pooya.website",
      repoUrl: "https://github.com/PooyaNikbakht/docs-chat",
      localUrl: "http://localhost:3010",
    },
    "northwind-coffee-ordering": {
      liveUrl: "https://northwind.pooya.website",
      repoUrl: null,
      admin: { url: "https://northwind.pooya.website/admin" },
    },
    "brightside-cleaning-quotes": {
      liveUrl: "https://brightside.pooya.website/quote",
      repoUrl: null,
      admin: { url: "https://brightside.pooya.website/admin" },
    },
    "owner-dashboards": {
      // Empty on purpose: the page links to each business's own admin instead.
      liveUrl: "",
      repoUrl: null,
    },
    "workflow-runner": {
      liveUrl: "https://runner.pooya.website",
      repoUrl: "https://github.com/PooyaNikbakht/workflow-runner",
      localUrl: "http://localhost:3050",
    },
    "paperwork-ai": {
      liveUrl: "https://paperwork.pooya.website",
      repoUrl: "https://github.com/PooyaNikbakht/paperwork-ai",
    },
    "harbourview-bakery-website": {
      liveUrl: "https://bakery.pooya.website",
      repoUrl: "https://github.com/PooyaNikbakht/site-rescue",
      localUrl: "http://localhost:8882",
    },
    "site-rescue": {
      // The rescued ("after") site is live as the bakery; the slow "before" copy stays local.
      liveUrl: "https://bakery.pooya.website",
      repoUrl: "https://github.com/PooyaNikbakht/site-rescue",
    },
    "shop-search": {
      liveUrl: "https://shop.pooya.website",
      repoUrl: "https://github.com/PooyaNikbakht/shop-search",
    },
    "docs-chat": {
      liveUrl: "https://coffee.pooya.website/try",
      repoUrl: "https://github.com/PooyaNikbakht/docs-chat",
    },
    "freelance-site": {
      // Empty on purpose: this site is the live demo.
      liveUrl: "",
      repoUrl: "https://github.com/PooyaNikbakht/freelance-site",
    },
  } as Record<string, ProjectLinks | undefined>,
} as const;

export type SiteConfig = typeof siteConfig;
