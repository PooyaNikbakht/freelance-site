import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import type { AdminContext } from "@/lib/admin/auth";

export function AdminShell({
  children,
  active,
  unread,
  admin,
}: {
  children: ReactNode;
  active: "dashboard" | "messages";
  unread: number | null;
  admin: AdminContext;
}) {
  const link = (href: string, label: ReactNode, key: typeof active) => (
    <Link
      href={href}
      aria-current={active === key ? "page" : undefined}
      className={`inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-medium ${
        active === key ? "bg-accent-tint text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-1">
            <span className="mr-2 font-semibold tracking-tight">Admin</span>
            {link("/admin", "Dashboard", "dashboard")}
            {link(
              "/admin/messages",
              <>
                Messages
                {unread ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-accent-ink">
                    {unread}
                    <span className="sr-only"> unread</span>
                  </span>
                ) : null}
              </>,
              "messages",
            )}
          </nav>
          {admin.auth.mode === "dev" ? (
            <span
              title="No sign-in outside production"
              className="rounded-full border border-accent-2 bg-accent-2-tint px-2.5 py-1 font-mono text-xs text-ink"
            >
              Dev mode, not protected
            </span>
          ) : (
            <form action={logout} className="flex items-center gap-3">
              {admin.user ? <span className="hidden text-sm text-muted sm:inline">@{admin.user.login}</span> : null}
              <button
                type="submit"
                className="inline-flex min-h-10 items-center rounded-[8px] border border-border px-3 text-sm font-medium text-muted hover:border-accent hover:text-ink"
              >
                Log out
              </button>
            </form>
          )}
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </>
  );
}
