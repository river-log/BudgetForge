import { describe, expect, it } from "vitest";
import { estimatedSchedulePaycheck, nextExpectedPayDate, normalizePaycheckSchedule, prefillPaycheckFromSchedule, scheduleForecast, validatePaycheckSchedule } from "./paycheckSchedules";

const base = { id: "s1", employer: "Forge Co", payFrequency: "weekly", anchorDate: "2026-12-25", nextExpectedPayDate: "2026-12-25", isActive: true, defaultHourlyRate: 20, defaultRegularHours: 40, defaultOvertimeHours: 0, defaultOvertimeMultiplier: 1.5, defaultDeductions: 100, defaultDepositMethod: "Direct Deposit" };

describe("paycheck schedule dates", () => {
  it("advances weekly and biweekly across year and month boundaries", () => {
    expect(nextExpectedPayDate(base, "2026-12-25")).toBe("2027-01-01");
    expect(nextExpectedPayDate({ ...base, payFrequency: "biweekly" }, "2026-01-25")).toBe("2026-02-08");
  });
  it("handles semimonthly patterns and clamps custom day 31", () => {
    expect(nextExpectedPayDate({ ...base, payFrequency: "semimonthly", semimonthlyPattern: "first-fifteenth" }, "2026-02-01")).toBe("2026-02-15");
    expect(nextExpectedPayDate({ ...base, payFrequency: "semimonthly", semimonthlyPattern: "fifteenth-last" }, "2024-02-15")).toBe("2024-02-29");
    expect(nextExpectedPayDate({ ...base, payFrequency: "semimonthly", semimonthlyPattern: "custom", semimonthlyDayOne: 15, semimonthlyDayTwo: 31 }, "2026-04-15")).toBe("2026-04-30");
  });
  it("handles monthly day clamping and explicit month end", () => {
    expect(nextExpectedPayDate({ ...base, payFrequency: "monthly", monthlyDay: 31 }, "2026-01-31")).toBe("2026-02-28");
    expect(nextExpectedPayDate({ ...base, payFrequency: "monthly", useLastDayOfMonth: true }, "2024-01-31")).toBe("2024-02-29");
  });
  it("returns unavailable rather than guessing from missing anchors", () => {
    expect(nextExpectedPayDate({ ...base, anchorDate: null, nextExpectedPayDate: null })).toBeNull();
  });
});

describe("schedule normalization and forecasting", () => {
  it("rejects invalid frequency and identical custom days", () => {
    expect(validatePaycheckSchedule({ employer: "Forge", payFrequency: "sometimes" })).toHaveProperty("payFrequency");
    expect(validatePaycheckSchedule({ employer: "Forge", payFrequency: "semimonthly", semimonthlyPattern: "custom", semimonthlyDayOne: 15, semimonthlyDayTwo: 15 })).toHaveProperty("semimonthlyDayTwo");
  });
  it("normalizes ownership and sorted custom days", () => {
    expect(normalizePaycheckSchedule({ ...base, semimonthlyDayOne: 28, semimonthlyDayTwo: 1 }, { id: "s1", userId: "user" })).toMatchObject({ id: "s1", userId: "user", semimonthlyDayOne: 1, semimonthlyDayTwo: 28 });
  });
  it("uses shared paycheck math and keeps forecasts separate from received income", () => {
    expect(estimatedSchedulePaycheck(base)).toBe(700);
    expect(scheduleForecast([{ ...base, nextExpectedPayDate: "2026-07-25" }], [{ amount: 500, dateReceived: "2026-07-01" }], "2026-07")).toEqual({ received: 500, expected: 700, remainingExpected: 200, scheduledCount: 1 });
    expect(scheduleForecast([{ ...base, isActive: false }], [], "2026-12").expected).toBe(0);
  });
  it("prefills a reviewable paycheck without creating income", () => {
    expect(prefillPaycheckFromSchedule(base)).toMatchObject({ entryMode: "paycheck", scheduleId: "s1", payFrequency: "weekly", payPeriodStart: "2026-12-19", payPeriodEnd: "2026-12-25" });
  });
});
