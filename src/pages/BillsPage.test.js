import { describe, expect, it } from "vitest";
import { filterCurrentBills } from "../features/bills/filterBills";

const bills = [
  { id: 1, name: "Rent", paid: true },
  { id: 2, name: "Electric", paid: false },
];

describe("bill workspace filtering", () => {
  it("shows paid and unpaid records when All is selected", () => {
    expect(filterCurrentBills(bills, "", "all")).toEqual(bills);
  });

  it("combines status and text filters", () => {
    expect(filterCurrentBills(bills, "electric", "unpaid")).toEqual([bills[1]]);
    expect(filterCurrentBills(bills, "rent", "unpaid")).toEqual([]);
  });
});
