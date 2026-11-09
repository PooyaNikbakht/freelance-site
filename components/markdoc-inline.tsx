import Markdoc, { type Config, type Node, type RenderableTreeNode, Tag } from "@markdoc/markdoc";
import Link from "next/link";
import React, { type ReactNode } from "react";

// Short rich text (a paragraph or two with links) stored inline in a YAML entry.
// Each paragraph renders as a <p> with the caller's class, so it can sit in a tight
// layout without the spacing of the full .prose body. Internal links use next/link.
const config: Config = {
  nodes: {
    link: { ...Markdoc.nodes.link, render: "SmartLink" },
  },
};

function SmartLink({ href, title, children }: { href: string; title?: string; children: ReactNode }) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} title={title}>
      {children}
    </a>
  );
}

const components = { SmartLink };

export function MarkdocInline({ node, className }: { node: Node; className?: string }) {
  const tree = Markdoc.transform(node, config);
  const blocks: RenderableTreeNode[] = Tag.isTag(tree) ? tree.children : [tree];
  return (
    <>
      {blocks.map((block, i) =>
        Tag.isTag(block) && block.name === "p" ? (
          <p key={i} className={className}>
            {Markdoc.renderers.react(block.children, React, { components })}
          </p>
        ) : (
          <React.Fragment key={i}>{Markdoc.renderers.react(block, React, { components })}</React.Fragment>
        ),
      )}
    </>
  );
}
