import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InstallAppCard from "./InstallAppCard";

describe("Settings App Installation card", () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => { window.matchMedia = originalMatchMedia; });

  it("stays visible and reports installed standalone status", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    render(<InstallAppCard />);
    expect(screen.getByRole("heading", { name: "App Installation" })).toBeInTheDocument();
    expect(screen.getAllByText("Installed").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Install BudgetForge" })).not.toBeInTheDocument();
    expect(screen.getByText("v2.8.0")).toBeInTheDocument();
  });
});
