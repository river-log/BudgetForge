import { describe, expect, it } from "vitest";
import { calculatePaycheck, filterIncome, incomeSummary, normalizeIncomeEntry, resolveMonthlyIncome, validateIncome } from "./income";

const quick = { entryMode: "quick", sourceType: "Gift", sourceName: "Family", amount: "100.10", dateReceived: "2026-07-15", depositMethod: "Cash", notes: "Birthday" };
const paycheck = { entryMode: "paycheck", sourceType: "Paycheck", employer: "Forge Co", payPeriodStart: "2026-07-01", payPeriodEnd: "2026-07-14", dateReceived: "2026-07-18", depositMethod: "Direct Deposit", hourlyRate: "20", regularHours: "40", overtimeHours: "5", overtimeMultiplier: "1.5", grossPay: "", federalTax: "100", stateTax: "25", localTax: "5", socialSecurityTax: "40", medicareTax: "10", healthInsurance: "20", retirementContribution: "30", otherDeductions: "5", notes: "Payroll" };

describe("income calculations and validation", () => {
  it("calculates regular, overtime, gross, deductions, and net with cent rounding", () => {
    expect(calculatePaycheck(paycheck)).toEqual({ regularPay: 800, overtimePay: 150, estimatedGrossPay: 950, grossPay: 950, totalDeductions: 235, netPay: 715 });
  });
  it("honors a gross-pay override and resets when the value is blank", () => {
    expect(calculatePaycheck({ ...paycheck, grossPay: "1000" }).netPay).toBe(765);
    expect(calculatePaycheck({ ...paycheck, grossPay: "" }).grossPay).toBe(950);
  });
  it("validates quick deposits, negative values, and pay-period order", () => {
    expect(validateIncome({ ...quick, sourceName: " ", amount: "0" })).toMatchObject({ sourceName: expect.any(String), amount: expect.any(String) });
    expect(validateIncome({ ...paycheck, hourlyRate: "-1" })).toHaveProperty("hourlyRate");
    expect(validateIncome({ ...paycheck, payPeriodEnd: "2026-06-30" })).toHaveProperty("payPeriodEnd");
  });
  it("creates normalized quick deposits and paychecks with net amount", () => {
    expect(normalizeIncomeEntry(quick, { id: "1", now: "2026-07-20T00:00:00.000Z" })).toMatchObject({ id: "1", amount: 100.1, entryMode: "quick" });
    expect(normalizeIncomeEntry(paycheck, { id: "2", now: "2026-07-20T00:00:00.000Z" })).toMatchObject({ id: "2", amount: 715, grossPay: 950, totalDeductions: 235 });
  });
});

describe("income reporting", () => {
  const entries = [
    normalizeIncomeEntry(quick, { id: "1", now: "2026-07-20T00:00:00.000Z" }),
    normalizeIncomeEntry(paycheck, { id: "2", now: "2026-07-20T00:00:00.000Z" }),
    normalizeIncomeEntry({ ...quick, sourceName: "Refund Store", sourceType: "Refund", amount: "50", dateReceived: "2026-06-01", depositMethod: "PayPal", notes: "Shoes" }, { id: "3", now: "2026-06-01T00:00:00.000Z" }),
  ];
  it("calculates fixed monthly, yearly, average paycheck, and largest totals", () => {
    expect(incomeSummary(entries, new Date("2026-07-28T12:00:00"))).toEqual({ monthIncome: 815.1, yearIncome: 865.1, monthCount: 2, averagePaycheck: 715, largestIncome: 715 });
  });
  it("preserves manual mode and switches to tracked income explicitly", () => {
    expect(resolveMonthlyIncome(4000, entries, "manual", new Date("2026-07-28T12:00:00"))).toBe(4000);
    expect(resolveMonthlyIncome(4000, entries, "tracked", new Date("2026-07-28T12:00:00"))).toBe(815.1);
  });
  it("searches, filters, and sorts deterministically", () => {
    expect(filterIncome(entries, { query: "shoes" }).map((entry) => entry.id)).toEqual(["3"]);
    expect(filterIncome(entries, { entryMode: "paycheck" }).map((entry) => entry.id)).toEqual(["2"]);
    expect(filterIncome(entries, { depositMethod: "Cash", month: "7", year: "2026" }).map((entry) => entry.id)).toEqual(["1"]);
    expect(filterIncome(entries, { sort: "lowest" }).map((entry) => entry.id)).toEqual(["3", "1", "2"]);
  });
});
