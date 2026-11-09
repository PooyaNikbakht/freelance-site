import { getWorkItem, getWork } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Project by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getWork()).map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getWorkItem(slug);
  return renderOg({ eyebrow: "Project", title: item?.title ?? "Pooya Nikbakht" });
}
