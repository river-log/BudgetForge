import { describe, expect, it } from "vitest";
import { calculateFinancialHealth, getBillsDueSoon, getClosestSavingsGoal, getHighestInterestDebt, getSuggestedNextAction } from "./financialInsights";

const now = new Date(2026, 7, 10, 12);

describe("smart dashboard financial insights", () => {
  it("orders overdue and seven-day bill occurrences safely", () => {
    const result = getBillsDueSoon([
      { id: 1, name: "Late", dueDate: "2025-01-08", amount: 50, paid: false },
      { id: 2, name: "Soon", dueDate: "2025-01-14", amount: 75, paid: false },
      { id: 3, name: "Later", dueDate: "2025-01-20", amount: 90, paid: false },
    ], now);
    expect(result.items.map((bill) => bill.name)).toEqual(["Late", "Soon"]);
    expect(result.overdue).toHaveLength(1);
    expect(result.dueSoon).toHaveLength(1);
  });

  it("scores the four documented factors deterministically", () => {
    const health = calculateFinancialHealth({
      monthlyIncome: 1000,
      bills: [{ id: 1, amount: 250, dueDate: "2025-01-08", paid: false }],
      savingsGoals: [{ target: 1000, saved: 500 }],
      debts: [{ balance: 1000, apr: 20, minimum: 50 }],
      now,
    });
    expect(health.factors.map((factor) => factor.score)).toEqual([75, 75, 50, 0]);
    expect(health.score).toBe(55);
    expect(health.status).toBe("Fair");
  });

  it("handles zero income and malformed values without producing NaN", () => {
    const health = calculateFinancialHealth({ monthlyIncome: 0, bills: [{ amount: "bad", dueDate: "bad" }], savingsGoals: [{}], debts: [{}], now });
    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
    expect(Number.isNaN(health.score)).toBe(false);
  });

  it("selects highest APR active debt and closest incomplete savings goal", () => {
    expect(getHighestInterestDebt([{ name: "Paid", balance: 0, apr: 30 }, { name: "Card", balance: 500, apr: 18, minimum: 25 }]).name).toBe("Card");
    expect(getClosestSavingsGoal([{ name: "A", target: 100, saved: 50 }, { name: "B", target: 100, saved: 80 }]).goal.name).toBe("B");
    expect(getClosestSavingsGoal([{ name: "Done", target: 100, saved: 100 }]).allComplete).toBe(true);
  });

  it("uses the required next-action priority and onboarding fallback", () => {
    const data = { bills: [{ name: "Rent", amount: 900, dueDate: "2025-01-08", paid: false }], debts: [{ name: "Card", balance: 100, apr: 20 }], savingsGoals: [{ name: "Fund", target: 100, saved: 50 }], now };
    expect(getSuggestedNextAction(data).type).toBe("overdue");
    expect(getSuggestedNextAction({ now }).type).toBe("onboarding");
  });
});
