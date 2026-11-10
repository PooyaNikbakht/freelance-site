import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { MobileNav } from "./mobile-nav";
import { navLinks } from "./nav-links";

export async function SiteHeader() {
  const { tagline, taglineShort, taglineMobile } = await getSettings();
  return (
    <header className="band-dark relative z-20 border-b border-border">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[8px] focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/people/pooya"
            alt=""
            width={44}
            height={44}
            sizes="44px"
            priority
            className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
          />
          <span className="min-w-0 leading-tight">
            <span className="block font-semibold tracking-tight">{siteConfig.name}</span>
            <span className="block text-xs text-muted sm:hidden">{taglineMobile}</span>
            <span className="hidden text-xs text-muted lg:block">{tagline}</span>
            <span className="hidden text-xs text-muted sm:block">{taglineShort}</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    l.href === "/contact"
                      ? "ml-2 inline-flex min-h-11 items-center rounded-[8px] bg-accent px-4 text-[0.9375rem] font-semibold text-accent-ink hover:opacity-90"
                      : "inline-flex min-h-11 items-center rounded-[8px] px-3 text-[0.9375rem] font-medium text-muted hover:text-ink"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
