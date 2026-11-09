// Work categories, shared by the Keystatic schema and the /work filter.
// The value is stored in each work entry and used in /work/category/<value>.
export const workCategories = [
  { value: "websites", label: "Websites" },
  { value: "ai", label: "AI solutions" },
  { value: "booking", label: "Booking and scheduling" },
  { value: "ordering", label: "Online ordering" },
  { value: "quotes", label: "Quotes and leads" },
  { value: "dashboards", label: "Dashboards and admin" },
  { value: "fixing", label: "Fixing and improving" },
  { value: "mvp", label: "MVPs" },
] as const;

export type WorkCategory = (typeof workCategories)[number]["value"];

export function workCategoryLabel(value: string): string | undefined {
  return workCategories.find((c) => c.value === value)?.label;
}
