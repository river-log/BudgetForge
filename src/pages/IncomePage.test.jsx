import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BudgetContext from "../context/BudgetContext";
import IncomePage from "./IncomePage";

describe("IncomePage", () => {
  it("renders its summary and honest empty state", () => {
    render(<BudgetContext.Provider value={{ incomeEntries: [], addIncomeEntry: vi.fn(), updateIncomeEntry: vi.fn(), deleteIncomeEntry: vi.fn() }}><IncomePage /></BudgetContext.Provider>);
    expect(screen.getByRole("heading", { level: 1, name: "Income" })).toBeInTheDocument();
    expect(screen.getByText("No income recorded yet")).toBeInTheDocument();
    expect(screen.getByText("Income This Month")).toBeInTheDocument();
  });
});
