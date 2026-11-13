import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Pooya Nikbakht, senior full-stack and AI engineer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "AI · Website · App", title: "Custom-built for you at a fair price." });
}
