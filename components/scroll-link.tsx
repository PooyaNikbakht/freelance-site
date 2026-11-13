"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Same-page anchor link that scrolls every time it is clicked, even when the URL already has the hash.
 * Moves focus to the target's heading for keyboard and screen reader users. Without JS it is a plain
 * `#id` link.
 */
export function ScrollLink({
  targetId,
  headingId,
  className,
  children,
}: {
  targetId: string;
  headingId?: string;
  className?: string;
  children: ReactNode;
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    const focusTarget = (headingId && document.getElementById(headingId)) || target;
    if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    history.replaceState(null, "", `#${targetId}`);
  }

  return (
    <a href={`#${targetId}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
