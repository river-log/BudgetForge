import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import BudgetContext from "../context/BudgetContext";
import ReportsPage from "./ReportsPage";

describe("ReportsPage financial dashboard", () => {
  beforeEach(() => localStorage.clear());

  it("renders the new report cards alongside the existing monthly review", () => {
    const value = {
      bills: [{ id: 1, name: "Rent", amount: 1000, category: "Housing", paid: false }],
      effectiveMonthlyIncome: 4000, incomeEntries: [], paycheckSchedules: [],
      savingsGoals: [{ id: 2, name: "Fund", saved: 500, target: 1000 }],
      debts: [{ id: 3, name: "Card", balance: 800, apr: 20, minimum: 40 }],
    };
    render(<BudgetContext.Provider value={value}><ReportsPage /></BudgetContext.Provider>);
    expect(screen.getByRole("heading", { level: 1, name: "Reports" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Financial summary" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Net worth" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Savings progress" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Debt report" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Monthly spending" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Report actions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A clear look at your month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PDF export — Coming Soon" })).toBeDisabled();
  });
});
