import { getService, getServices } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Service by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getServices()).map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getService(slug);
  return renderOg({ eyebrow: "Service", title: item?.title ?? "Pooya Nikbakht" });
}
