import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { navLinks } from "./nav-links";

const socialLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  scholar: "Google Scholar",
  upwork: "Upwork",
  contra: "Contra",
};

// 24px-grid filled marks, drawn at 18px in the link's own color.
const icons: Record<string, string> = {
  github:
    "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  scholar: "M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6.5 9.6V16c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.4L12 16.2l-6.5-3.6z",
  rss: "M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z",
};

function Icon({ name }: { name: string }) {
  const d = icons[name];
  if (!d) return null;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="shrink-0 fill-current">
      <path d={d} />
    </svg>
  );
}

const pageLinks = [...navLinks, { href: "/for-teams", label: "For teams" }, { href: "/blog", label: "Writing" }];

export function SiteFooter() {
  const socials = Object.entries(siteConfig.links).filter(([, url]) => Boolean(url));
  return (
    <footer className="band-dark border-t-4 border-[#0f766e]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 text-sm text-muted sm:px-6">
        {/* Pages, then a divider, then icon links; both rows are centered and wrap on phones. */}
        <nav aria-labelledby="footer-pages" >
          <h2 id="footer-pages" className="sr-only">
            Pages
          </h2>
          <ul className="flex flex-nowrap justify-center gap-x-3.5 text-[0.8125rem] sm:flex-wrap sm:gap-x-8 sm:text-sm">
            {pageLinks.map((l) => (
              <li key={l.href} className={l.href === "/contact" ? "max-sm:hidden" : undefined}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 border-t border-border pt-6">
          <h2 id="footer-elsewhere" className="sr-only">
            Elsewhere
          </h2>
          <ul className="flex flex-nowrap justify-center gap-x-4 text-[0.8125rem] sm:flex-wrap sm:gap-x-8 sm:text-sm" aria-labelledby="footer-elsewhere">
            {socials.map(([key, url]) => (
              <li key={key}>
                <a href={url} className="inline-flex items-center gap-1.5 hover:text-accent sm:gap-2" rel="me">
                  <Icon name={key} />
                  {socialLabels[key] ?? key}
                </a>
              </li>
            ))}
            <li>
              <a href="/blog/rss.xml" className="inline-flex items-center gap-1.5 hover:text-accent sm:gap-2">
                <Icon name="rss" />
                RSS feed
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-border pt-6 text-center">
          <span className="inline-flex items-center gap-2">
            <Image
              src="/people/pooya"
              alt=""
              width={28}
              height={28}
              sizes="28px"
              className="h-7 w-7 rounded-full border border-border object-cover"
            />
            <span>
              Built by <span className="font-medium text-ink">{siteConfig.name}</span>
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${siteConfig.email}`} className="whitespace-nowrap hover:text-accent">
            {siteConfig.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
