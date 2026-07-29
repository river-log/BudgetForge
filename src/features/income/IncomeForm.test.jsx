import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import IncomeForm from "./IncomeForm";

describe("IncomeForm", () => {
  it("creates a valid quick deposit and blocks invalid submission", async () => {
    const save = vi.fn();
    render(<IncomeForm open onClose={vi.fn()} onSave={save} />);
    fireEvent.click(screen.getByRole("button", { name: "Save income" }));
    expect(await screen.findByText("Amount must be greater than zero.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Source type/), { target: { value: "Gift" } });
    fireEvent.change(screen.getByLabelText("Source name"), { target: { value: "Family" } });
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText(/Deposit method/), { target: { value: "Cash" } });
    fireEvent.click(screen.getByRole("button", { name: "Save income" }));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ entryMode: "quick", amount: "100" }));
  });
  it("creates a paycheck, supports gross override, and resets to estimate", () => {
    const save = vi.fn();
    render(<IncomeForm open onClose={vi.fn()} onSave={save} />);
    fireEvent.click(screen.getByRole("button", { name: "Detailed Paycheck" }));
    fireEvent.change(screen.getByLabelText("Employer"), { target: { value: "Forge Co" } });
    fireEvent.change(screen.getByLabelText("Pay period start"), { target: { value: "2026-07-01" } });
    fireEvent.change(screen.getByLabelText("Pay period end"), { target: { value: "2026-07-14" } });
    fireEvent.change(screen.getByLabelText("Hourly rate"), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText("Regular hours"), { target: { value: "40" } });
    fireEvent.change(screen.getByLabelText("Gross pay"), { target: { value: "1000" } });
    expect(screen.getByLabelText("Gross pay")).toHaveValue(1000);
    fireEvent.click(screen.getByRole("button", { name: "Use estimate" }));
    expect(screen.getByLabelText("Gross pay")).toHaveValue(800);
    fireEvent.change(screen.getByLabelText("Deposit method"), { target: { value: "Direct Deposit" } });
    fireEvent.click(screen.getByRole("button", { name: "Save income" }));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ entryMode: "paycheck", employer: "Forge Co" }));
  });
});
