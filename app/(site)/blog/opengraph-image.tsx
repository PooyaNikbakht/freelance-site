import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Writing by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Writing", title: "Notes from the work" });
}
