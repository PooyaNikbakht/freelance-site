/**
 * Sorts projects by the drag-to-reorder list in the "Project order" singleton. Projects missing from the
 * list come after all listed ones, by their old numeric `order` and then title, so a new project never
 * disappears and the result is always deterministic.
 */
export function sortByWorkOrder<T extends { slug: string; order: number; title: string }>(
  items: readonly T[],
  orderList: readonly (string | null | undefined)[],
): T[] {
  const position = new Map<string, number>();
  orderList.forEach((slug, i) => {
    if (slug && !position.has(slug)) position.set(slug, i);
  });
  return [...items].sort((a, b) => {
    const pa = position.get(a.slug);
    const pb = position.get(b.slug);
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    const oa = Number.isFinite(a.order) ? a.order : 0;
    const ob = Number.isFinite(b.order) ? b.order : 0;
    return oa - ob || a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug);
  });
}
