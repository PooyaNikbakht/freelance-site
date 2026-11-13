"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath, navLinks } from "./nav-links";

// Client component: desktop nav list with active-page state.
export function NavLinkList() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {navLinks.map((l) => {
        const active = isActivePath(pathname, l.href);
        return (
          <li key={l.href}>
            {l.href === "/contact" ? (
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className="ml-2 inline-flex min-h-11 items-center rounded-[8px] bg-accent px-4 text-[0.9375rem] font-semibold text-accent-ink hover:opacity-90"
              >
                {l.label}
              </Link>
            ) : (
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`inline-grid min-h-11 items-center justify-items-center rounded-[8px] px-3 text-[0.9375rem] hover:text-ink ${
                  active ? "font-semibold text-ink" : "font-medium text-muted"
                }`}
              >
                <span className="col-start-1 row-start-1">{l.label}</span>
                {/* Invisible bold copy reserves the active width so neighbours do not shift. */}
                <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-semibold">
                  {l.label}
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
