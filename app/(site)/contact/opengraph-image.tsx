import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Contact Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Contact", title: "Start a project" });
}
