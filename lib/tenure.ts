const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type YearMonth = [number, number];

function label([year, month]: YearMonth): string {
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Jan 2019 to Sep 2021"; no end means "present". */
export function dateRange(start: YearMonth, end: YearMonth | null): string {
  return `${label(start)} to ${end ? label(end) : "present"}`;
}

/** "Mar 2015 to Feb 2018 · 3 yrs"; no end means "present" and counts up to `now`. */
export function tenure(start: YearMonth, end: YearMonth | null, now = new Date()): string {
  const [ey, em] = end ?? [now.getFullYear(), now.getMonth() + 1];
  // Inclusive of both months, the way resumes and LinkedIn count.
  const months = (ey - start[0]) * 12 + (em - start[1]) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const length = [y ? `${y} ${y === 1 ? "yr" : "yrs"}` : "", m ? `${m} ${m === 1 ? "mo" : "mos"}` : ""].filter(Boolean).join(" ");
  return length ? `${dateRange(start, end)} · ${length}` : dateRange(start, end);
}
