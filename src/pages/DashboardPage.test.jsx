import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BudgetContext from "../context/BudgetContext";
import { ToastProvider } from "../features/toasts";
import DashboardPage from "./DashboardPage";

describe("DashboardPage smart dashboard", () => {
  it("renders all five smart insights from context data", () => {
    const value = {
      bills: [], monthlyIncome: 4000, effectiveMonthlyIncome: 4000, trackedMonthlyIncome: 0,
      incomeMode: "manual", setIncomeMode: vi.fn(), setMonthlyIncome: vi.fn(),
      userName: "Shane", setUserName: vi.fn(), paycheckSchedules: [],
      savingsGoals: [{ id: 1, name: "Emergency fund", target: 1000, saved: 600 }],
      debts: [{ id: 2, name: "Credit card", balance: 500, apr: 18, minimum: 25 }],
    };
    render(<MemoryRouter><ToastProvider><BudgetContext.Provider value={value}><DashboardPage /></BudgetContext.Provider></ToastProvider></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Financial health" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bills due soon" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Highest-interest debt" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Closest savings goal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Suggested next action" })).toBeInTheDocument();
    expect(screen.getAllByText("Credit card").length).toBeGreaterThan(0);
    expect(screen.getByText("Emergency fund")).toBeInTheDocument();
  });
});
