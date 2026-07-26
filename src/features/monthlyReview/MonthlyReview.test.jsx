import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MonthlyReview from "./MonthlyReview";

describe("MonthlyReview", () => {
  it("renders stored metrics and changes the selected month", () => {
    const onMonthChange = vi.fn();
    render(
      <MonthlyReview
        selectedMonth="2026-07"
        months={[{ key: "2026-07", label: "July 2026" }, { key: "2026-06", label: "June 2026" }]}
        onMonthChange={onMonthChange}
        bills={[{ amount: 100, paidMonths: ["2026-07"] }]}
        monthlyIncome={1000}
        spendingHistory={{ "2026-07": { total: 100, categories: { Utilities: 100 } }, "2026-06": { total: 80, categories: { Utilities: 80 } } }}
        savingsHistory={{}}
        budgetCategories={[]}
      />
    );
    expect(screen.getByRole("heading", { name: "Monthly summary" })).toBeInTheDocument();
    expect(screen.getByText("Increased by $20")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Review month"), { target: { value: "2026-06" } });
    expect(onMonthChange).toHaveBeenCalledWith("2026-06");
  });
});
