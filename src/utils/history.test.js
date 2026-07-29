import { beforeEach, describe, expect, it } from "vitest";
import { getSpendingHistory, recordPayment, removePayment } from "./history";

describe("spending history adjustments", () => {
  beforeEach(() => localStorage.clear());

  it("reverses a payment without leaving negative or empty history", () => {
    const date = new Date("2026-07-15T12:00:00");
    const bill = { amount: "85.55", category: "Utilities" };
    recordPayment(bill, date);
    expect(getSpendingHistory()["2026-07"]).toEqual({ total: 85.55, categories: { Utilities: 85.55 } });
    removePayment(bill, date);
    expect(getSpendingHistory()).toEqual({});
  });

  it("does not create negative history while repairing inconsistent legacy state", () => {
    removePayment({ amount: 100, category: "Other" }, new Date("2026-07-15T12:00:00"));
    expect(getSpendingHistory()).toEqual({});
  });
});
