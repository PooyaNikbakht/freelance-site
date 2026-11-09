import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser, requireAdminEnabled } from "@/lib/admin/auth";
import { safeNext } from "@/lib/admin/github";

export const metadata: Metadata = { title: "Sign in" };

const errors: Record<string, string> = {
  state: "The sign-in link expired or didn't match. Please try again.",
  denied: "GitHub sign-in was cancelled.",
  github: "GitHub didn't answer as expected. Please try again.",
  "not-allowed": "That GitHub account doesn't have access to this admin.",
  limited: "Too many sign-in attempts. Wait 15 minutes and try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const auth = requireAdminEnabled();
  const params = await searchParams;
  const next = safeNext(params.next);
  if (auth.mode === "dev" || (await currentUser(auth))) redirect(next);
  const error = typeof params.error === "string" ? errors[params.error] : undefined;

  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-[12px] border border-border bg-background p-6 sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted">Messages and site content.</p>
        {error ? (
          <p role="alert" className="mt-5 rounded-[8px] border border-danger px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        ) : params.signedOut ? (
          <p role="status" className="mt-5 text-sm text-muted">
            You&apos;re signed out.
          </p>
        ) : null}
        {/* A plain link: the route sets the state cookie and redirects to GitHub. */}
        <a
          href={`/api/admin/auth/login?next=${encodeURIComponent(next)}`}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[8px] bg-ink px-5 text-[0.9375rem] font-semibold text-background hover:opacity-90"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-5 w-5" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Sign in with GitHub
        </a>
      </div>
    </main>
  );
}
