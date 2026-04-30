import { HDate } from "@hebcal/core";
import { describe, expect, it } from "vitest";
import {
  addDaysToDateOnly,
  assertDateOnly,
  diffDateOnlyDays,
  hDateFromDateOnly,
  hDateToDateOnly,
  nextHebrewMonthSameDay,
} from "@/lib/dates";

describe("date-only utilities", () => {
  it("keeps user-selected dates as date-only values", () => {
    expect(assertDateOnly("2026-04-30")).toBe("2026-04-30");
    expect(() => assertDateOnly("2026-02-31")).toThrow();
  });

  it("adds and diffs days without relying on local timezone offsets", () => {
    expect(addDaysToDateOnly("2026-03-08", 1)).toBe("2026-03-09");
    expect(addDaysToDateOnly("2026-03-08", -1)).toBe("2026-03-07");
    expect(diffDateOnlyDays("2026-03-09", "2026-03-08")).toBe(1);
  });

  it("rolls Elul to Tishrei in the next Hebrew year", () => {
    const elul15 = hDateToDateOnly(new HDate(15, 6, 5786));
    const next = nextHebrewMonthSameDay(elul15);
    expect(next).not.toBeNull();

    const hNext = hDateFromDateOnly(next!);
    expect(hNext.getDate()).toBe(15);
    expect(hNext.getMonth()).toBe(7);
    expect(hNext.getFullYear()).toBe(5787);
  });

  it("returns null when the same Hebrew day does not exist next month", () => {
    let foundMissingMonth = false;
    for (let year = 5785; year <= 5788; year += 1) {
      for (let month = 1; month <= 13; month += 1) {
        try {
          const candidate = hDateToDateOnly(new HDate(30, month, year));
          if (nextHebrewMonthSameDay(candidate) === null) {
            foundMissingMonth = true;
          }
        } catch {
          // Some month/year combinations are invalid in non-leap years.
        }
      }
    }

    expect(foundMissingMonth).toBe(true);
  });
});
