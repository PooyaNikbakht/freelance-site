import { collection, config, fields, singleton } from "@keystatic/core";
import { workCategories } from "./lib/categories";

// Local mode in development: the admin at /keystatic writes straight to content/.
// GitHub mode in production (or with KEYSTATIC_STORAGE=github locally): each save
// is a commit to the repo, and the next deploy picks it up. See README, "Edit from anywhere".
const useGitHub = process.env.NODE_ENV === "production" || process.env.KEYSTATIC_STORAGE === "github";

const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
  (label, i) => ({ label, value: String(i + 1) }),
);

/** Start and end as year + month. An empty end year means "present". */
const dateFields = () => ({
  // Text, not integer: Keystatic's number input shows 2012 as "2,012".
  startYear: fields.text({
    label: "Start year",
    description: "Four digits, e.g. 2019.",
    validation: { length: { min: 4, max: 4 }, pattern: { regex: /^\d{4}$/, message: "Use four digits, e.g. 2019." } },
  }),
  startMonth: fields.select({ label: "Start month", options: monthOptions, defaultValue: "1" }),
  endYear: fields.text({
    label: "End year",
    description: 'Four digits. Leave empty for "present".',
    validation: { pattern: { regex: /^(\d{4})?$/, message: "Use four digits, or leave empty for present." } },
  }),
  endMonth: fields.select({ label: "End month", description: "Ignored while the end year is empty.", options: monthOptions, defaultValue: "1" }),
});

export default config({
  storage: useGitHub ? { kind: "github", repo: "PooyaNikbakht/freelance-site" } : { kind: "local" },
  ui: {
    brand: { name: "Pooya Nikbakht" },
  },
  singletons: {
    settings: singleton({
      label: "Site settings",
      path: "content/settings",
      schema: {
        headline: fields.text({
          label: "Headline",
          description: "The one-line offer at the top of the home page.",
          validation: { length: { min: 1 } },
        }),
        subline: fields.text({
          label: "Subline",
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        availability: fields.text({
          label: "Availability note",
          description: "Shown in the hero, on About, and on Contact.",
        }),
        tagline: fields.text({
          label: "Header tagline (desktop)",
          description: "Under your name in the header on wide screens.",
          validation: { length: { min: 1 } },
        }),
        taglineShort: fields.text({
          label: "Header tagline (tablet)",
          validation: { length: { min: 1 } },
        }),
        taglineMobile: fields.text({
          label: "Header tagline (phone)",
          validation: { length: { min: 1 } },
        }),
      },
    }),
    about: singleton({
      label: "About page",
      path: "content/about",
      schema: {
        title: fields.text({ label: "Page title", validation: { length: { min: 1 } } }),
        lead: fields.text({ label: "Header intro", multiline: true }),
        metaDescription: fields.text({
          label: "Meta description",
          description: "Shown by search engines and link previews.",
          multiline: true,
        }),
        intro: fields.array(fields.text({ label: "Paragraph", multiline: true }), {
          label: "Intro paragraphs",
          itemLabel: (props) => props.value.slice(0, 80) || "Paragraph",
        }),
        howIWork: fields.array(
          fields.object({
            title: fields.text({ label: "Title", description: "Shown in bold, e.g. Plan in writing.", validation: { length: { min: 1 } } }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          { label: "How I work", itemLabel: (props) => props.fields.title.value || "Item" },
        ),
        activity: fields.object(
          {
            title: fields.text({ label: "Section title" }),
            intro: fields.text({ label: "Intro", multiline: true }),
            graphs: fields.array(
              fields.object({
                year: fields.text({ label: "Year", validation: { length: { min: 1 } } }),
                contributions: fields.integer({ label: "Contributions" }),
                image: fields.text({
                  label: "Image path",
                  description: "Without size or extension, e.g. /about/github-2025 (needs -640.webp and -1200.webp files).",
                }),
              }),
              { label: "GitHub contribution graphs", itemLabel: (props) => props.fields.year.value || "Year" },
            ),
            ticketCharts: fields.array(
              fields.object({
                title: fields.text({ label: "Chart title", validation: { length: { min: 1 } } }),
                note: fields.text({ label: "Note", description: "Short line under the title." }),
                bars: fields.array(
                  fields.object({
                    name: fields.text({ label: "Name", description: "Use Me for yourself, e.g. Colleague A for others." }),
                    value: fields.integer({ label: "Tickets" }),
                    me: fields.checkbox({ label: "This is me" }),
                  }),
                  { label: "Bars", itemLabel: (props) => `${props.fields.name.value}: ${props.fields.value.value ?? 0}` },
                ),
              }),
              { label: "Ticket charts", itemLabel: (props) => props.fields.title.value || "Chart" },
            ),
          },
          { label: "Track record" },
        ),
        experience: fields.array(
          fields.object({
            title: fields.text({ label: "Role", validation: { length: { min: 1 } } }),
            org: fields.text({ label: "Organization", validation: { length: { min: 1 } } }),
            link: fields.url({ label: "Organization link", description: "Optional." }),
            ...dateFields(),
            body: fields.markdoc.inline({ label: "Description", options: { heading: false, image: false, table: false } }),
          }),
          {
            label: "Experience",
            itemLabel: (props) => `${props.fields.title.value} · ${props.fields.org.value}`,
          },
        ),
        education: fields.array(
          fields.object({
            degree: fields.text({ label: "Degree", validation: { length: { min: 1 } } }),
            school: fields.text({ label: "School", validation: { length: { min: 1 } } }),
            ...dateFields(),
            meta: fields.text({ label: "Short note", description: "Shown after the dates, e.g. GPA 4.5 / 4.5." }),
            body: fields.markdoc.inline({ label: "Description", options: { heading: false, image: false, table: false } }),
          }),
          { label: "Education", itemLabel: (props) => props.fields.degree.value || "Degree" },
        ),
        publicationsIntro: fields.markdoc.inline({
          label: "Publications intro",
          options: { heading: false, image: false, table: false },
        }),
        publications: fields.array(
          fields.object({
            title: fields.text({ label: "Title", validation: { length: { min: 1 } } }),
            venue: fields.text({ label: "Venue label", description: "Short, e.g. CCCG 2022." }),
            link: fields.url({ label: "Link", validation: { isRequired: true } }),
            order: fields.integer({ label: "Order", description: "Lower numbers come first.", defaultValue: 0 }),
          }),
          { label: "Publications", itemLabel: (props) => props.fields.title.value || "Publication" },
        ),
        stack: fields.array(
          fields.object({
            label: fields.text({ label: "Group", validation: { length: { min: 1 } } }),
            items: fields.text({ label: "Tools", description: "Comma separated." }),
          }),
          { label: "Day-to-day stack", itemLabel: (props) => props.fields.label.value || "Group" },
        ),
      },
    }),
  },
  collections: {
    services: collection({
      label: "Services",
      slugField: "title",
      path: "content/services/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "order"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "Summary", multiline: true }),
        startingPrice: fields.integer({
          label: "Starting price (USD)",
          description: 'Shown as "From $X".',
          validation: { isRequired: true, min: 0 },
        }),
        timeline: fields.text({ label: "Typical timeline" }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
        relatedWork: fields.array(
          fields.relationship({ label: "Case study", collection: "work" }),
          { label: "Related work", itemLabel: (props) => props.value ?? "Select a case study" },
        ),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
    work: collection({
      label: "Work",
      slugField: "title",
      path: "content/work/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "featured", "order"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "Summary", multiline: true }),
        categories: fields.multiselect({
          label: "Categories",
          description: "Used by the category filter on /work.",
          options: workCategories.map((c) => ({ label: c.label, value: c.value })),
          defaultValue: [],
        }),
        stack: fields.array(fields.text({ label: "Technology" }), {
          label: "Stack",
          itemLabel: (props) => props.value,
        }),
        liveUrl: fields.url({
          label: "Live URL",
          description: "Optional. site.config.ts overrides this for the demo projects.",
        }),
        repoUrl: fields.url({
          label: "Repository URL",
          description: "Optional. site.config.ts overrides this for the demo projects.",
        }),
        featured: fields.checkbox({ label: "Featured on home page", defaultValue: false }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
        findable: fields.object(
          {
            measured: fields.text({
              label: "How it was measured",
              description: "Leave empty to hide the card, e.g. Lighthouse 13.6.0, mobile, home page, median of 3 runs.",
            }),
            performance: fields.integer({ label: "Performance" }),
            accessibility: fields.integer({ label: "Accessibility" }),
            bestPractices: fields.integer({ label: "Best practices" }),
            seo: fields.integer({ label: "SEO" }),
            structuredData: fields.array(fields.text({ label: "Item" }), {
              label: "Structured data",
              itemLabel: (props) => props.value || "Item",
            }),
            resultTitle: fields.text({ label: "Search result title" }),
            resultUrl: fields.text({ label: "Search result URL", description: "As shown in Google, e.g. harbourviewbakery.ca" }),
            resultDescription: fields.text({ label: "Search result description", multiline: true }),
            resultDetails: fields.text({ label: "Search result details", description: "e.g. address and hours line." }),
          },
          { label: "Speed and search card" },
        ),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
    research: collection({
      label: "Research and earlier projects",
      slugField: "title",
      path: "content/research/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "year", "order"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { description: "Keep the old Google Sites slug so the redirects from /projects/<slug> keep working." },
        }),
        summary: fields.text({ label: "Summary", description: "One paragraph, shown on the card and as the meta description.", multiline: true }),
        type: fields.select({
          label: "Type",
          options: [
            { label: "Research paper", value: "research-paper" },
            { label: "Data science", value: "data-science" },
            { label: "Product", value: "product" },
          ],
          defaultValue: "research-paper",
        }),
        year: fields.text({ label: "Year", description: "Optional. Only if the source states it, e.g. 2020." }),
        when: fields.text({ label: "Date as stated", description: "Optional, e.g. December 2020 or Winter 2021." }),
        authors: fields.text({ label: "Authors", description: "Optional, as listed on the paper." }),
        context: fields.text({ label: "Context", description: "Optional, e.g. MSc research or Undergraduate final project." }),
        tags: fields.array(fields.text({ label: "Tag" }), { label: "Tags", itemLabel: (props) => props.value }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: "Label", validation: { length: { min: 1 } } }),
            url: fields.url({ label: "URL", validation: { isRequired: true } }),
          }),
          { label: "Links", itemLabel: (props) => props.fields.label.value || "Link" },
        ),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          description: "Used for the post list, meta description, and RSS.",
          multiline: true,
        }),
        date: fields.date({ label: "Date", validation: { isRequired: true } }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Drafts show in dev but are left out of production builds.",
          defaultValue: false,
        }),
        body: fields.markdoc({ label: "Body" }),
      },
    }),
  },
});
