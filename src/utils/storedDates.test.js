import { describe, expect, it } from "vitest";
import { formatStoredDateSafely, isValidStoredDate, parseStoredDate, recurringStoredDate, storedDateInMonth } from "./storedDates";

describe("stored date safety", () => {
  it.each(["", "not-a-date", "2026-02-30", "2026-13-01", null])("rejects invalid stored date %s", (value) => {
    expect(parseStoredDate(value)).toBeNull();
    expect(isValidStoredDate(value)).toBe(false);
  });

  it("parses YYYY-MM-DD at local noon without changing the calendar day", () => {
    const date = parseStoredDate("2026-07-01");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(12);
  });

  it("provides a neutral visible fallback", () => {
    expect(formatStoredDateSafely("bad")).toBe("Invalid date");
  });

  it("excludes malformed dates from calendar calculations", () => {
    expect(storedDateInMonth("2026-02-30", 2026, 6)).toBeNull();
    expect(storedDateInMonth("", 2026, 6)).toBeNull();
    expect(storedDateInMonth("2026-01-31", 2026, 1).getDate()).toBe(28);
  });

  it("creates recurring local dates without UTC serialization shifts", () => {
    expect(recurringStoredDate("2026-01-31", new Date("2026-02-10T12:00:00"))).toBe("2026-02-28");
  });
});
