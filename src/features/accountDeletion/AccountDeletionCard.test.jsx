import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CloudSyncContext from "../cloud/CloudSyncContext";
import AccountDeletionCard from "./AccountDeletionCard";

describe("AccountDeletionCard", () => {
  it("uses an accessible confirmation dialog and prevents duplicate submission", () => {
    const deleteAccount = vi.fn(() => new Promise(() => {}));
    render(<CloudSyncContext.Provider value={{ session: { user: { id: "verified" } }, deleteAccount }}><AccountDeletionCard /></CloudSyncContext.Provider>);
    fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByRole("dialog", { name: "Permanently delete your account?" })).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "Delete permanently" });
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Type DELETE/), { target: { value: "wrong" } });
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Type DELETE/), { target: { value: "DELETE" } });
    fireEvent.click(submit);
    fireEvent.click(submit);
    expect(deleteAccount).toHaveBeenCalledTimes(1);
  });
});
