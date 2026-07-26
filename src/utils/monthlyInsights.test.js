import { describe, expect, it } from "vitest";
import {
  calculateCategoryShares,
  calculateMonthComparison,
  calculateMonthlySummary,
  calculateSavingsRate,
  generateMonthlyInsights,
} from "./monthlyInsights";

describe("monthly insight calculations", () => {
  it("calculates a deterministic current-month summary", () => {
    const summary = calculateMonthlySummary({
      selectedMonth: "2026-07",
      currentMonth: "2026-07",
      monthlyIncome: 4000,
      bills: [
        { amount: 1000, category: "Housing", paidMonths: ["2026-07"] },
        { amount: 200, category: "Utilities", paidMonths: [] },
      ],
      budgetCategories: [{ amount: 300 }],
      spendingHistory: { "2026-07": { total: 1000, categories: { Housing: 1000 } } },
      savingsHistory: { "2026-07": 500 },
    });
    expect(summary).toMatchObject({ income: 4000, totalBills: 1200, paidAmount: 1000, paidCount: 1, unpaidAmount: 200, unpaidCount: 1, remainingIncome: 2800, savingsBalance: 500 });
    expect(summary.budgetUtilization).toBe(37.5);
  });

  it("returns no percentage when the previous value is zero", () => {
    const result = calculateMonthComparison({ paidAmount: 50 }, { paidAmount: 0 }, "paidAmount", "Paid bills");
    expect(result.change).toBe(50);
    expect(result.percentageChange).toBeNull();
    expect(result.direction).toBe("increase");
  });

  it("returns no savings rate for zero income", () => {
    expect(calculateSavingsRate(100, 0)).toBeNull();
  });

  it("calculates category shares and ignores malformed values", () => {
    expect(calculateCategoryShares({ Housing: 300, Food: 100, Broken: "x" })).toEqual([
      { category: "Housing", amount: 300, share: 75 },
      { category: "Food", amount: 100, share: 25 },
    ]);
  });

  it("prioritizes unpaid bills and limits insight output", () => {
    const insights = generateMonthlyInsights({
      unpaidCount: 3,
      largestCategory: { category: "Housing", share: 50 },
      income: 4000,
      totalBills: 2000,
      savingsBalance: 300,
      paidAmount: 900,
    }, { paidAmount: 1000, savingsBalance: 250 });
    expect(insights[0].id).toBe("unpaid");
    expect(insights).toHaveLength(5);
  });

  it("keeps unavailable historical fields null", () => {
    const summary = calculateMonthlySummary({ selectedMonth: "2026-06", currentMonth: "2026-07" });
    expect(summary).toMatchObject({ income: null, totalBills: null, unpaidCount: null, remainingIncome: null, paidAmount: null });
    expect(generateMonthlyInsights(summary, null)).toEqual([]);
  });
});

