import { describe, expect, it } from "vitest";
import { calculateDebtReport, calculateFinancialSummary, calculateMonthlySpending, calculateNetWorth, calculateSavingsReport, createFinancialReport } from "./reportCalculations";

describe("financial report calculations", () => {
  const bills = [
    { id: 1, name: "Rent", amount: 1000, category: "Housing", paidMonths: ["2026-08"] },
    { id: 2, name: "Power", amount: 100, category: "Utilities", paidMonths: [] },
  ];
  const savingsGoals = [{ name: "Fund", saved: 500, target: 1000 }, { name: "Trip", saved: 200, target: 200 }];
  const debts = [{ name: "Card", balance: 800, apr: 20, minimum: 40 }, { name: "Loan", balance: 1200, apr: 5, minimum: 60 }];

  it("calculates financial summary and net worth", () => {
    expect(calculateFinancialSummary({ monthlyIncome: 3000, bills, savingsGoals, debts })).toEqual({ monthlyIncome: 3000, totalBills: 1100, totalSavings: 700, totalDebt: 2000, remainingCashFlow: 1900 });
    expect(calculateNetWorth(savingsGoals, debts)).toMatchObject({ netWorth: -1300, status: "Negative" });
  });

  it("calculates savings completion and active debt metrics", () => {
    expect(calculateSavingsReport(savingsGoals)).toMatchObject({ totalSaved: 700, goalCount: 2, averageCompletion: 75, completedGoals: 1 });
    expect(calculateDebtReport(debts)).toMatchObject({ totalDebt: 2000, minimumPayments: 100, averageApr: 12.5, accountCount: 2 });
    expect(calculateDebtReport(debts).highestAprAccount.name).toBe("Card");
  });

  it("separates paid and unpaid bills and totals categories", () => {
    const report = calculateMonthlySpending(bills, new Date(2026, 7, 10, 12));
    expect(report).toMatchObject({ totalPaidBills: 1000, totalUnpaidBills: 100, paidCount: 1, unpaidCount: 1 });
    expect(report.largestBill.name).toBe("Rent");
    expect(report.categories[0]).toEqual({ category: "Housing", total: 1000 });
  });

  it("handles malformed and empty data and creates a deterministic report envelope", () => {
    expect(calculateFinancialSummary({ monthlyIncome: "bad", bills: [{}] }).remainingCashFlow).toBe(0);
    const report = createFinancialReport({}, new Date("2026-08-02T12:00:00.000Z"));
    expect(report).toMatchObject({ application: "BudgetForge", reportVersion: 1, generatedAt: "2026-08-02T12:00:00.000Z" });
    expect(report.report.netWorth.netWorth).toBe(0);
  });
});
