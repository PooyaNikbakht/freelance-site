import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "About Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "About", title: "Senior full-stack engineer with 10+ years of experience" });
}
