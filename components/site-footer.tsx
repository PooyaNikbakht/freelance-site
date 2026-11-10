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

export function SiteFooter() {
  const socials = Object.entries(siteConfig.links).filter(([, url]) => Boolean(url));
  return (
    <footer className="band-dark border-t-4 border-[#0f766e]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 text-sm text-muted sm:grid-cols-[1fr_auto_auto] sm:gap-16 sm:px-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-base font-semibold text-ink">
            <Image src="/people/pooya" alt="" width={40} height={40} sizes="40px" className="h-10 w-10 rounded-full border border-border object-cover" />
            {siteConfig.name}
          </Link>
          <p className="mt-4 max-w-xs leading-relaxed">
            {siteConfig.role}. I build websites, web apps and AI features for businesses, startups and product teams.
          </p>
          <p className="mt-6">
            Built by{" "}
            <a href={siteConfig.links.github} className="font-medium text-ink underline underline-offset-4 hover:text-accent">
              {siteConfig.name}
            </a>
          </p>
          <p className="mt-2">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
              {siteConfig.email}
            </a>
          </p>
        </div>
        <nav aria-labelledby="footer-pages">
          <h2 id="footer-pages" className="font-mono text-xs uppercase tracking-[0.14em] text-ink">
            Pages
          </h2>
          <ul className="mt-4 grid content-start grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/for-teams" className="hover:text-accent">
                For teams
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-accent">
                Writing
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 id="footer-elsewhere" className="font-mono text-xs uppercase tracking-[0.14em] text-ink">
            Elsewhere
          </h2>
          <ul className="mt-4 grid content-start grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-1" aria-labelledby="footer-elsewhere">
            {socials.map(([key, url]) => (
              <li key={key}>
                <a href={url} className="hover:text-accent" rel="me">
                  {socialLabels[key] ?? key}
                </a>
              </li>
            ))}
            <li>
              <a href="/blog/rss.xml" className="hover:text-accent">
                RSS feed
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
