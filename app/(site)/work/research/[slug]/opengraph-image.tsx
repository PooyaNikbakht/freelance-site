import { getResearch, getResearchItem } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Research by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getResearch()).map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getResearchItem(slug);
  return renderOg({ eyebrow: "Research", title: item?.title ?? "Pooya Nikbakht" });
}
