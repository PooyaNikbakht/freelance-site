import Image from "next/image";
import { siteConfig } from "@/site.config";
import { adminHref } from "./demo-admin";
import { ButtonLink } from "./ui";

// One section per business on the "Owner dashboards" project, each linking to that
// business's own admin (links and demo logins come from site.config.ts).

const dashboards: { slug: string; name: string; kind: string; shot: { src: string; alt: string }; text: string[] }[] = [
  {
    slug: "kingsway-cuts",
    name: "Kingsway Cuts",
    kind: "Barbershop",
    shot: {
      src: "/work/kingsway-cuts-admin-walkins",
      alt: "Kingsway Cuts walk-ins page: a Taking walk-ins switch, the wait in minutes and people waiting with plus and minus buttons, and an Update the site button.",
    },
    text: [
      "The walk-in board sits next to the day's book: the owner sets whether the shop is taking walk-ins, the wait in minutes and how many people are waiting, and the site shows it within a minute.",
      "The calendar has a column for each barber, so the whole shop's day fits on one screen.",
    ],
  },
  {
    slug: "harbourview-physio",
    name: "Harbourview Physio",
    kind: "Physiotherapy clinic",
    shot: {
      src: "/work/harbourview-physio-admin-intake",
      alt: "Harbourview Physio intake forms page: upcoming first visits still waiting on a form, the clinic's health form, and forms recently received online.",
    },
    text: [
      "New patients fill in a health form before their first visit, and the answers wait on the booking.",
      "Intake forms lists who still has one to do, with a reminder already scheduled, and a first visit can't be marked done until the form is in, online or recorded as a paper form at the desk.",
      "The clinic edits its own questions.",
    ],
  },
  {
    slug: "maple-paws-vet",
    name: "Maple Paws Vet",
    kind: "Animal clinic",
    shot: {
      src: "/work/maple-paws-vet-admin-vaccinations",
      alt: "Maple Paws Vet vaccinations due page: overdue vaccines by pet and owner, when each reminder went out, and Send again now and Book buttons.",
    },
    text: [
      "Every pet has a record with its vaccines and when the next dose is due.",
      "Reminders go out on their own 14 days ahead, with a link that opens booking with the pet and owner filled in, and Vaccinations due lists anything overdue with Send again now and Book one tap away.",
    ],
  },
  {
    slug: "northwind-coffee-ordering",
    name: "Northwind Coffee Co.",
    kind: "Café with three locations",
    shot: {
      src: "/work/northwind-coffee-ordering-admin-kitchen",
      alt: "Northwind Coffee kitchen screen: New, Preparing and Ready columns of pickup orders, a filter by café, and large Start and Picked up buttons.",
    },
    text: [
      "A live kitchen screen for a tablet: New, Preparing and Ready columns, new orders arriving within five seconds with an optional chime, late orders in red, and one big tap to move an order along.",
      "The menu editor changes items, sizes, milks, extras and prices directly, and an item can be hidden for the season or marked sold out.",
    ],
  },
  {
    slug: "brightside-cleaning-quotes",
    name: "Brightside Cleaning",
    kind: "Home and office cleaning",
    shot: {
      src: "/work/brightside-cleaning-quotes-admin-leads",
      alt: "Brightside Cleaning leads page: leads this month, win rate, open quotes and won this month, a follow up today list, and every lead with its status.",
    },
    text: [
      "Every quote request lands in Leads with the price exactly as the customer saw it, and moves from New to Contacted, Quoted, Won or Lost, with notes, follow-up dates and replies.",
      "A won lead becomes a booking in one step, and Quote pricing edits the price list with a live preview of a sample job.",
    ],
  },
];

export function OwnerDashboards() {
  return (
    <section aria-labelledby="dashboards-heading" className="mt-16 border-t border-border pt-12">
      <h2 id="dashboards-heading" className="text-[1.375rem] font-semibold leading-tight tracking-tight">
        Five businesses, five dashboards
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        On each login page, click &ldquo;Try the demo as the owner&rdquo; to sign in with one click. The sample data
        resets every hour, so change anything you like.
      </p>
      <ul className="mt-8 grid gap-6">
        {dashboards.map((d) => {
          const admin = siteConfig.projects[d.slug]?.admin;
          const href = admin ? adminHref(admin) : null;
          return (
            <li key={d.slug}>
              <article
                aria-labelledby={`dash-${d.slug}`}
                className="grid gap-6 rounded-[12px] border border-border bg-background p-5 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-border bg-surface">
                  <Image
                    src={d.shot.src}
                    alt={d.shot.alt}
                    fill
                    sizes="(min-width: 1024px) 460px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">{d.kind}</p>
                  <h3 id={`dash-${d.slug}`} className="mt-2 text-[1.25rem] font-semibold leading-tight tracking-tight">
                    {d.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{d.text.join(" ")}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {href ? <ButtonLink href={href}>Open the owner admin</ButtonLink> : null}
                    <ButtonLink href={`/work/${d.slug}`} variant="secondary">
                      See the project
                    </ButtonLink>
                  </div>
                  {admin && !href && process.env.NODE_ENV === "development" ? (
                    <p className="mt-3 text-sm text-muted">The admin link will be added here once it is deployed.</p>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
