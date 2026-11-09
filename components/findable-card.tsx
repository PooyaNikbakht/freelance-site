import type { WorkFindable } from "@/lib/content";

/** Lighthouse scores, structured data and a search-result preview for a website project. */
export function FindableCard({ findable }: { findable: WorkFindable }) {
  const { scores, structuredData, result, measured } = findable;
  return (
    <section aria-labelledby="findable-heading" className="mt-14 rounded-[12px] border border-border p-6 sm:p-8">
      <h2 id="findable-heading" className="text-[1.375rem] font-bold tracking-tight">
        Fast, and easy to find on Google
      </h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-semibold">Lighthouse scores</h3>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {scores.map((s) => (
              <li key={s.label} className="text-center">
                <span
                  className={
                    "mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 font-mono text-xl font-bold " +
                    (s.value >= 90 ? "border-accent text-accent" : "border-border text-ink")
                  }
                >
                  {s.value}
                </span>
                <span className="mt-2 block text-sm text-muted">{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">{measured}</p>
          {structuredData.length ? (
            <>
              <h3 className="mt-6 font-semibold">Structured data for Google</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {structuredData.map((d) => (
                  <li key={d} className="rounded-full border border-border px-3 py-1 font-mono text-xs">
                    {d}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        {result ? (
          <figure>
            <figcaption className="font-semibold">How it can look in search results</figcaption>
            <div className="mt-4 rounded-[10px] border border-border bg-white p-5 text-left text-[#202124]">
              <p className="text-sm text-[#4d5156]">{result.url}</p>
              <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{result.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#4d5156]">{result.description}</p>
              {result.details ? <p className="mt-2 text-sm text-[#4d5156]">{result.details}</p> : null}
            </div>
            <p className="mt-2 text-xs text-muted">An illustration of how the site&apos;s title, description and business data can show up in search.</p>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
