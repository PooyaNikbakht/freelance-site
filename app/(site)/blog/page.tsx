import { PostItem } from "@/components/cards";
import { JsonLd } from "@/components/json-ld";
import { Container, PageHeader } from "@/components/ui";
import { getPosts } from "@/lib/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Writing",
  description: "Practical notes on building web apps, Next.js performance, technical SEO, and shipping reliable AI features.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Writing", path: "/blog" }])} />
      <PageHeader
        eyebrow="Writing"
        title="Notes from the work"
        intro={
          <>
            Practical write-ups on things I do for clients. Also available as an{" "}
            <a href="/blog/rss.xml" className="text-accent underline underline-offset-4">
              RSS feed
            </a>
            .
          </>
        }
      />
      <Container className="pb-24">
        <div className="mt-12 max-w-3xl">
          {posts.length === 0 ? <p className="text-muted">No posts yet.</p> : posts.map((p) => <PostItem key={p.slug} post={p} />)}
        </div>
      </Container>
    </>
  );
}
