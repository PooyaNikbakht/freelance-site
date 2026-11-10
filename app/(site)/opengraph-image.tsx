import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Pooya Nikbakht, senior full-stack engineer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Freelance", title: "Websites, web apps and AI, built end to end." });
}
