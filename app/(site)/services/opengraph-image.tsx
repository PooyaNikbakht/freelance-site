import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Services by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Services", title: "MVPs, Next.js sites, AI features, and fixes for React apps" });
}
