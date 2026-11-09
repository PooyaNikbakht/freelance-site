import { makeRouteHandler } from "@keystatic/next/route-handler";
import { keystaticEnabled } from "@/lib/admin/config";
import config from "@/keystatic.config";

// Keystatic's API: local file access in development, GitHub sign-in in production.
// Keystatic throws at setup when the GitHub env vars are missing, so the handler is
// built on the first request, after checking they are set (on Cloudflare, Worker
// secrets are only readable at request time). Without them it answers 404.
export const dynamic = "force-dynamic";

let handler: ReturnType<typeof makeRouteHandler> | null = null;

function getHandler() {
  handler ??= makeRouteHandler({ config });
  return handler;
}

const notFound = () => new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });

export async function GET(request: Request) {
  return keystaticEnabled() ? getHandler().GET(request) : notFound();
}

export async function POST(request: Request) {
  return keystaticEnabled() ? getHandler().POST(request) : notFound();
}
