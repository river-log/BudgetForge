import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BudgetProvider, useBudget } from "../../context";
import CloudSyncContext from "../cloud/CloudSyncContext";
import { ToastProvider } from "../toasts";

const quick = { entryMode: "quick", sourceType: "Gift", sourceName: "Family", amount: "100", dateReceived: "2026-07-15", depositMethod: "Cash", notes: "" };

function Harness() {
  const budget = useBudget();
  return <><output>{budget.incomeEntries.map((entry) => `${entry.sourceName}:${entry.amount}`).join(",") || "empty"}</output><button onClick={() => budget.addIncomeEntry(quick)}>Add</button><button onClick={() => budget.updateIncomeEntry(budget.incomeEntries[0]?.id, { ...quick, sourceName: "Edited", amount: "125" })}>Edit</button><button onClick={() => budget.deleteIncomeEntry(budget.incomeEntries[0]?.id)}>Delete</button></>;
}

describe("income mutations", () => {
  beforeEach(() => localStorage.clear());
  it("adds, edits, deletes, and persists one shared income array", () => {
    render(<CloudSyncContext.Provider value={{ session: null }}><ToastProvider><BudgetProvider><Harness /></BudgetProvider></ToastProvider></CloudSyncContext.Provider>);
    expect(screen.getByText("empty")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Family:100")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByText("Edited:125")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("empty")).toBeInTheDocument();
  });
});
