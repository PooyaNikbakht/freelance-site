import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const siteDescription =
  "Senior full-stack and AI engineer building websites, web apps and AI features end to end, for local businesses, startups and product teams. I also fix and speed up existing WordPress, Shopify, React and Next.js sites.";

export function absoluteUrl(path = "/"): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

export function sameAs(): string[] {
  return Object.values(siteConfig.links).filter(Boolean);
}

type PageMetaInput = {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Per-page metadata: title (through the layout template), description, canonical, and social cards. */
export function pageMetadata({ title, description, path, type = "website", publishedTime }: PageMetaInput): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name}, ${siteConfig.role}`;
  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Based in Toronto, working with clients anywhere. */
const toronto = {
  "@type": "Place",
  name: "Toronto, Ontario, Canada",
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
};

export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Senior Full-Stack & AI Engineer",
    image: `${siteConfig.url}/people/pooya-640.webp`,
    description: siteDescription,
    sameAs: sameAs(),
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Python",
      "FastAPI",
      "Django",
      "Ruby on Rails",
      "AWS",
      "Cloudflare Workers",
      "PostgreSQL",
      "WordPress",
      "Search",
      "LLM integration",
      "Retrieval-augmented generation (RAG)",
      "OpenAI API",
      "Claude API",
      "AI chatbots",
      "Online booking systems",
      "Core Web Vitals",
      "Technical SEO",
    ],
    homeLocation: toronto,
    alumniOf: [siteConfig.education.msc, siteConfig.education.bsc].map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.school,
      url: e.schoolUrl,
    })),
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "AWS Certified Solutions Architect",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: siteConfig.education.msc.degree,
        recognizedBy: { "@type": "CollegeOrUniversity", name: siteConfig.education.msc.school },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: siteConfig.education.bsc.degree,
        recognizedBy: { "@type": "CollegeOrUniversity", name: siteConfig.education.bsc.school },
      },
    ],
  };
}

export function professionalServiceLd(services: { title: string; summary: string; slug: string; startingPrice: number }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    name: `${siteConfig.name}, freelance web development`,
    url: siteConfig.url,
    description: siteDescription,
    email: siteConfig.email,
    founder: { "@id": `${siteConfig.url}/#person` },
    address: toronto.address,
    areaServed: "Worldwide",
    currenciesAccepted: "USD",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.summary, url: absoluteUrl(`/services/${s.slug}`) },
        priceSpecification: { "@type": "PriceSpecification", minPrice: s.startingPrice, priceCurrency: "USD" },
      })),
    },
  };
}

export function serviceLd(s: { title: string; summary: string; slug: string; startingPrice: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    url: absoluteUrl(`/services/${s.slug}`),
    serviceType: s.title,
    areaServed: "Worldwide",
    provider: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.name, url: siteConfig.url },
    offers: {
      "@type": "Offer",
      priceSpecification: { "@type": "PriceSpecification", minPrice: s.startingPrice, priceCurrency: "USD" },
    },
  };
}

export function blogPostingLd(p: { title: string; description: string; slug: string; date: string; words?: number }) {
  const url = absoluteUrl(`/blog/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    url,
    mainEntityOfPage: url,
    datePublished: p.date,
    dateModified: p.date,
    inLanguage: "en",
    author: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
  };
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatPrice(usd: number): string {
  return `$${usd.toLocaleString("en-US")}`;
}
