import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BillForm from "./BillForm";

describe("BillForm", () => {
  it("exposes safe constraints and submits a valid recurring bill", () => {
    const addBill = vi.fn();
    render(<BillForm addBill={addBill} />);

    const amount = screen.getByLabelText("Amount");
    expect(amount).toHaveAttribute("min", "0.01");
    expect(amount).toHaveAttribute("step", "0.01");
    expect(screen.getByLabelText("Bill name")).toBeRequired();
    expect(screen.getByLabelText("Due date")).toBeRequired();

    fireEvent.change(screen.getByLabelText("Bill name"), { target: { value: "Electric" } });
    fireEvent.change(amount, { target: { value: "125.50" } });
    fireEvent.change(screen.getByLabelText("Due date"), { target: { value: "2026-07-30" } });
    fireEvent.submit(screen.getByRole("button", { name: "Add bill" }).closest("form"));

    expect(addBill).toHaveBeenCalledWith(expect.objectContaining({
      name: "Electric",
      amount: "125.50",
      dueDate: "2026-07-30",
      category: "Utilities",
      paid: false,
    }));
  });
});

