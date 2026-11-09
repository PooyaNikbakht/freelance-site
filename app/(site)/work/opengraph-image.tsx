import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Projects by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Projects", title: "Websites, booking, ordering and AI tools" });
}
