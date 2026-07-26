import { describe, expect, it } from "vitest";
import { isPaidForMonth, toggleBillMonth } from "./billPayments";

describe("monthly bill payments", () => {
  const july = new Date("2026-07-15T12:00:00");

  it("toggles only the selected month while preserving other history", () => {
    const bill = { paid: false, paidMonths: ["2026-06"] };
    const paid = toggleBillMonth(bill, july);
    expect(paid.paidMonths).toEqual(["2026-06", "2026-07"]);
    expect(isPaidForMonth(paid, july)).toBe(true);

    const unpaid = toggleBillMonth(paid, july);
    expect(unpaid.paidMonths).toEqual(["2026-06"]);
    expect(isPaidForMonth(unpaid, july)).toBe(false);
  });
});

