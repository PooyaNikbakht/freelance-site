"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { navLinks } from "./nav-links";

// Client component: the small-screen menu toggle.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();

  // Close the menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[8px] border border-border px-3 text-sm font-medium"
      >
        <span>{open ? "Close" : "Menu"}</span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2 4.5h12M2 8h12M2 11.5h12" />}
        </svg>
      </button>
      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full z-10 border-b border-border bg-background"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {navLinks.map((l) => (
            <li key={l.href} className="border-b border-border last:border-0">
              <Link
                href={l.href}
                aria-current={pathname === l.href || pathname.startsWith(`${l.href}/`) ? "page" : undefined}
                className="flex min-h-12 items-center text-base aria-[current=page]:text-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
