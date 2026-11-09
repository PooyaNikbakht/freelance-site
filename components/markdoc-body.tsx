import Markdoc, { type Config, type Node, Tag } from "@markdoc/markdoc";
import React from "react";

// Tables are wrapped in a focusable region that scrolls sideways on small screens,
// so wide tables never widen the page and keyboard users can scroll them too.
const config: Config = {
  nodes: {
    table: {
      ...Markdoc.nodes.table,
      transform(node, cfg) {
        return new Tag("div", { className: "table-scroll", tabIndex: 0, role: "region", "aria-label": "Table" }, [
          new Tag("table", node.transformAttributes(cfg), node.transformChildren(cfg)),
        ]);
      },
    },
  },
};

/** Server-rendered Markdoc body. No client JS. */
export function MarkdocBody({ node }: { node: Node }) {
  const content = Markdoc.transform(node, config);
  return <div className="prose">{Markdoc.renderers.react(content, React)}</div>;
}
