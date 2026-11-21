import Markdoc, { type Node } from "@markdoc/markdoc";

/** H2 headings that start the technical part of a work page ("How it's built", "Stack"). */
export const technicalHeading = /^(How (it's built|I built it|they're built)|Stack)$/;

function plainText(node: Node): string {
  if (node.type === "text") return String(node.attributes.content ?? "");
  return node.children.map(plainText).join("");
}

export function h2Text(node: Node): string | null {
  return node.type === "heading" && node.attributes.level === 2 ? plainText(node).trim() : null;
}

function doc(children: Node[]): Node {
  return new Markdoc.Ast.Node("document", {}, children);
}

/**
 * Splits a work page body into the intro (before the first H2), the main sections, and the
 * technical sections ("How it's built" and "Stack") that close the page.
 */
export function splitWorkBody(node: Node): { intro: Node; main: Node; technical: Node } {
  const children = node.children;
  const firstH2 = children.findIndex((c) => h2Text(c) !== null);
  const start = firstH2 === -1 ? children.length : firstH2;
  const techIndex = children.findIndex((c, i) => i >= start && technicalHeading.test(h2Text(c) ?? ""));
  const end = techIndex === -1 ? children.length : techIndex;
  return {
    intro: doc(children.slice(0, start)),
    main: doc(children.slice(start, end)),
    technical: doc(children.slice(end)),
  };
}
