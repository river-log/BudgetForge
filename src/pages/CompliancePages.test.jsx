import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PrivacyPage from "./PrivacyPage";
import TermsPage from "./TermsPage";
import SupportPage from "./SupportPage";
import AccountDeletionPage from "./AccountDeletionPage";

describe("public compliance pages", () => {
  it.each([
    [PrivacyPage, "Privacy Policy"],
    [TermsPage, "Terms of Use"],
    [SupportPage, "BudgetForge Support"],
    [AccountDeletionPage, "Delete a BudgetForge Account"],
  ])("renders %s with a heading, effective date, and contact", (Page, heading) => {
    render(<MemoryRouter><Page /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByText(/Effective: July 26, 2026/)).toBeInTheDocument();
    expect(screen.getAllByText("support@budget-forge.com").length).toBeGreaterThan(0);
  });
});
