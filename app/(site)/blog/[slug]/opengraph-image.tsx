import { getPost, getPosts } from "@/lib/content";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Article by Pooya Nikbakht";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getPosts()).map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPost(slug);
  return renderOg({ eyebrow: "Writing", title: item?.title ?? "Pooya Nikbakht" });
}
