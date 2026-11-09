import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { WorkIndex } from "@/components/work-index";
import { type WorkCategory, workCategories, workCategoryLabel } from "@/lib/categories";
import { getResearch, getWork } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

// One static page per category that has work in it.
export async function generateStaticParams() {
  const work = await getWork();
  return workCategories
    .filter((c) => work.some((w) => w.categories.includes(c.value)))
    .map((c) => ({ category: c.value }));
}

export async function generateMetadata({ params }: PageProps<"/work/category/[category]">) {
  const { category } = await params;
  const label = workCategoryLabel(category);
  if (!label) return {};
  const titles = (await getWork()).filter((w) => w.categories.includes(category as WorkCategory)).map((w) => w.title.split(":")[0]);
  return pageMetadata({
    title: `${label} work`,
    description: `${label} projects by ${siteConfig.name}. ${titles.join(", ")}.`,
    path: `/work/category/${category}`,
  });
}

export default async function WorkCategoryPage({ params }: PageProps<"/work/category/[category]">) {
  const { category } = await params;
  const label = workCategoryLabel(category);
  if (!label) notFound();
  const [work, research] = await Promise.all([getWork(), getResearch()]);
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Projects", path: "/work" },
          { name: label, path: `/work/category/${category}` },
        ])}
      />
      <WorkIndex work={work} research={research} active={category as WorkCategory} />
    </>
  );
}
