import Image from "next/image";

// Thumbnails are pre-optimized WebP files in public/work; lib/image-loader.ts maps
// each requested width to the nearest file.

const shots: Record<string, { src: string; alt: string }> = {
  "kingsway-cuts": {
    src: "/work/kingsway-cuts",
    alt: "Kingsway Cuts home page: a dark barbershop site with the headline Sharp cuts. Straight talk. No rush. and a Book a chair button.",
  },
  "harbourview-physio": {
    src: "/work/harbourview-physio",
    alt: "Harbourview Physio home page: a light clinic site with the headline Move with less pain, at your own pace, and a Book an appointment button.",
  },
  "maple-paws-vet": {
    src: "/work/maple-paws-vet",
    alt: "Maple Paws Vet home page: a warm cream site with the headline Vet visits your pet won't dread, a photo of a small dog and a Book a visit button.",
  },
  "northwind-coffee-website": {
    src: "/work/northwind-coffee-website",
    alt: "Northwind Coffee Co. home page: a warm photo of a drum roaster behind the headline Small-batch coffee, roasted by the harbour, with Shop coffee and Start a subscription buttons.",
  },
  "northwind-coffee-ordering": {
    src: "/work/northwind-coffee-ordering-phone",
    alt: "Three phone screens: choosing size, milk and extras for a mocha, picking a pickup time, and the order page showing Ready for pickup.",
  },
  "owner-dashboards": {
    src: "/work/owner-dashboards",
    alt: "A café kitchen screen on a tablet: New, Preparing and Ready columns of pickup orders, with large Start and Picked up buttons.",
  },
  "harbourview-bakery-website": {
    src: "/work/harbourview-bakery-website",
    alt: "Harbourview Bakery home page: a holiday pre-order banner, the bakery's name and menu links above a full-width photo of fresh sourdough loaves.",
  },
  "brightside-cleaning-quotes": {
    src: "/work/brightside-cleaning-quotes",
    alt: "Brightside Cleaning quote calculator: choices for the place on the left and a live price of $281.20 plus HST, itemised line by line, on the right.",
  },
  "site-rescue": {
    src: "/work/site-rescue",
    alt: "Lighthouse on the bakery home page, mobile, before and after: Performance 62 to 96, Largest Contentful Paint 143.3 s to 2.7 s (the median run).",
  },
  "paperwork-ai": {
    src: "/work/paperwork-ai",
    alt: "Paperwork AI review screen: a scanned invoice with the misread line highlighted, next to two failed checks and the editable fields.",
  },
  "customer-assistant": {
    src: "/work/customer-assistant",
    alt: "Two phone screens: the customer's chat with a booking confirmed, next to the owner's private admin chat showing the same booking approved and added to Google Calendar.",
  },
  "booking-assistant": {
    src: "/work/booking-assistant",
    alt: "A phone showing the assistant's Telegram messages, next to the n8n workflow and a confirmation email written in French.",
  },
  "shop-search": {
    src: "/work/shop-search",
    alt: "shop-search: a search box with a plain-English query, the filters it produced shown as removable chips, and a grid of hiking boots.",
  },
  "docs-chat": {
    src: "/work/docs-chat",
    alt: "Website support bot: a coffee shop website with the chat open, answering a shipping question and showing the quoted passage from page 2 of the help center.",
  },
  "workflow-runner": {
    src: "/work/workflow-runner",
    alt: "A lead outreach run in progress: a stepper with the first step completed and the company lookup retrying after a simulated failure, next to a live log.",
  },
  "freelance-site": {
    src: "/work/freelance-site",
    alt: "The home page of this site: a dark hero with the headline and a collage of work examples.",
  },
};

export function hasWorkMedia(slug: string) {
  return slug in shots || slug === "marketplace-search";
}

/** 16:10 thumbnail for a case study: a real screenshot, or a flat illustration where screenshots aren't allowed. */
export function WorkMedia({
  slug,
  sizes,
  priority = false,
  className = "",
}: {
  slug: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const shot = shots[slug];
  return (
    <div className={`relative aspect-[16/10] overflow-hidden bg-surface ${className}`}>
      {shot ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover object-top"
        />
      ) : (
        <MarketplaceIllustration />
      )}
    </div>
  );
}

/** Abstract filter panel and result grid, standing in for screenshots of private work. */
export function MarketplaceIllustration() {
  const cards = [0, 1, 2, 3, 4, 5];
  return (
    <svg
      role="img"
      aria-label="Illustration of a search page: a filter panel with checkboxes and a price slider beside a grid of result cards."
      viewBox="0 0 320 200"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="200" className="fill-accent-tint" />
      {/* Search bar */}
      <rect x="16" y="14" width="288" height="22" rx="5" className="fill-background" />
      <rect x="26" y="22" width="110" height="6" rx="3" className="fill-border" />
      <rect x="262" y="18" width="36" height="14" rx="4" className="fill-accent" />
      {/* Filter chips */}
      <rect x="16" y="44" width="46" height="12" rx="6" className="fill-accent" />
      <rect x="68" y="44" width="38" height="12" rx="6" className="fill-background" />
      <rect x="112" y="44" width="52" height="12" rx="6" className="fill-background" />
      {/* Filter panel */}
      <rect x="16" y="64" width="78" height="124" rx="6" className="fill-background" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="26" y={76 + i * 16} width="8" height="8" rx="2" className={i < 2 ? "fill-accent" : "fill-border"} />
          <rect x="40" y={78 + i * 16} width={i % 2 ? 30 : 40} height="4" rx="2" className="fill-border" />
        </g>
      ))}
      <rect x="26" y="150" width="58" height="3" rx="1.5" className="fill-border" />
      <rect x="38" y="150" width="30" height="3" rx="1.5" className="fill-accent" />
      <circle cx="38" cy="151.5" r="4.5" className="fill-accent" />
      <circle cx="68" cy="151.5" r="4.5" className="fill-accent" />
      <rect x="26" y="166" width="48" height="10" rx="3" className="fill-accent" />
      {/* Result grid */}
      {cards.map((i) => {
        const x = 104 + (i % 3) * 68;
        const y = 64 + Math.floor(i / 3) * 64;
        return (
          <g key={i}>
            <rect x={x} y={y} width="60" height="58" rx="6" className="fill-background" />
            <rect x={x + 6} y={y + 6} width="48" height="24" rx="4" className={i === 1 ? "fill-border" : i === 3 ? "fill-accent" : "fill-surface"} />
            <rect x={x + 6} y={y + 36} width="36" height="4" rx="2" className="fill-border" />
            <rect x={x + 6} y={y + 45} width="20" height="5" rx="2" className="fill-ink" />
          </g>
        );
      })}
    </svg>
  );
}
