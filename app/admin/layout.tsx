import type { Metadata } from "next";

// Private admin: messages inbox and a link to the content editor. Not linked from the
// public site, not in the sitemap, and noindex (also sent as an X-Robots-Tag header
// from next.config.ts). Every page checks the session itself.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-surface text-ink">{children}</div>;
}
