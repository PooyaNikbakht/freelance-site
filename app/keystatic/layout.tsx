import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/admin/auth";
import { adminAuth, keystaticEnabled } from "@/lib/admin/config";
import KeystaticApp from "./keystatic";

// The content editor. Keystatic serves it from /keystatic (the path is fixed in
// Keystatic itself); /admin links here.
// - Development: local mode, edits files in content/, no login.
// - Production: GitHub mode, so each save is a commit. Returns 404 unless the GitHub
//   app's env vars are set, and asks for the admin GitHub sign-in first when it is set up.
//   Keystatic's own GitHub sign-in still decides who can write to the repo.
export const dynamic = "force-dynamic";

export const metadata = { title: "Keystatic", robots: { index: false, follow: false } };

export default async function KeystaticLayout() {
  if (!keystaticEnabled()) notFound();
  const admin = adminAuth();
  if (admin?.mode === "github" && !(await currentUser(admin))) redirect("/admin/login?next=/keystatic");
  return <KeystaticApp />;
}
