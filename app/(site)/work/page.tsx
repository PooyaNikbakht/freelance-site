import { JsonLd } from "@/components/json-ld";
import { WorkIndex } from "@/components/work-index";
import { getResearch, getWork } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Projects by category: barbershop, clinic and vet websites with online booking, café online ordering, an instant cleaning quote with a leads inbox, a website support bot, a WordPress site rescue, AI paperwork automation, product search, and more. Plus research papers and earlier projects.",
  path: "/work",
});

export default async function WorkPage() {
  const [work, research] = await Promise.all([getWork(), getResearch()]);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Projects", path: "/work" }])} />
      <WorkIndex work={work} research={research} />
    </>
  );
}
