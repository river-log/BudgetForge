import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BillCard from "./BillCard";

describe("BillCard safety", () => {
  it("shows invalid dates without crashing and confirms deletion", () => {
    const deleteBill = vi.fn();
    render(<BillCard bill={{ id: 7, name: "Imported bill", amount: 10, category: "Other", dueDate: "2026-02-30", paid: false }} togglePaid={vi.fn()} deleteBill={deleteBill} />);
    expect(screen.getAllByText("Invalid date").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("dialog", { name: "Delete Imported bill?" })).toBeInTheDocument();
    expect(deleteBill).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Delete bill" }));
    expect(deleteBill).toHaveBeenCalledWith(7);
  });
});
