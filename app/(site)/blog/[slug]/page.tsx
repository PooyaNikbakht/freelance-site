import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { MarkdocBody } from "@/components/markdoc-body";
import { Container, Monogram, PageHeader } from "@/components/ui";
import { getPost, getPosts } from "@/lib/content";
import { blogPostingLd, breadcrumbLd, formatDate, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          blogPostingLd(post),
          breadcrumbLd([
            { name: "Writing", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <article>
        <PageHeader
          breadcrumbs={[{ name: "Home", href: "/" }, { name: "Writing", href: "/blog" }, { name: post.title }]}
          eyebrow={
            <p className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted">
              <span aria-hidden="true" className="inline-block h-[3px] w-5 rounded-full bg-accent" />
              <time dateTime={post.date} className="text-accent">
                {formatDate(post.date)}
              </time>
              <span aria-hidden="true">·</span>
              {post.readingMinutes} min read
              {post.draft ? <span className="ml-2 text-accent">Draft (hidden in production)</span> : null}
            </p>
          }
          title={post.title}
          intro={post.description}
        >
          <div className="mt-8 flex items-center gap-3 text-sm">
            <Monogram size="sm" />
            <span>
              By{" "}
              <Link href="/about" className="font-medium hover:text-accent">
                {siteConfig.name}
              </Link>
            </span>
          </div>
        </PageHeader>
        <Container>
          <div className="pt-12">
            <MarkdocBody node={post.body} />
          </div>
        </Container>
      </article>
      <ContactCta title="Want help with something like this?" />
    </>
  );
}
