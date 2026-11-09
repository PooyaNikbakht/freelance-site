import { describe, expect, it } from "vitest";
import { dateRange, tenure } from "@/lib/tenure";

describe("tenure", () => {
  it("counts both months, like a resume", () => {
    expect(tenure([2015, 3], [2018, 2])).toBe("Mar 2015 to Feb 2018 · 3 yrs");
    expect(tenure([2012, 10], [2013, 10])).toBe("Oct 2012 to Oct 2013 · 1 yr 1 mo");
    expect(tenure([2013, 4], [2015, 3])).toBe("Apr 2013 to Mar 2015 · 2 yrs");
  });

  it("counts up to today when there is no end", () => {
    expect(tenure([2022, 2], null, new Date(2026, 10, 3))).toBe("Feb 2022 to present · 4 yrs 10 mos");
  });

  it("formats plain ranges", () => {
    expect(dateRange([2019, 1], [2021, 9])).toBe("Jan 2019 to Sep 2021");
  });
});
