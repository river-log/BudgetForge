import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SettingsPage from "./SettingsPage";

vi.mock("../features/pwa", () => ({ InstallAppCard: () => <section><h2>App Installation</h2></section> }));
vi.mock("../widgets/ExportDataCard", () => ({ default: () => null }));
vi.mock("../widgets/ImportDataCard", () => ({ default: () => null }));
vi.mock("../widgets/CloudSyncCard", () => ({ default: () => null }));
vi.mock("../features/accountDeletion/AccountDeletionCard", () => ({ default: () => null }));
vi.mock("../widgets/ComplianceLinksCard", () => ({ default: () => null }));

describe("SettingsPage", () => {
  it("includes the App Installation section", () => {
    render(<SettingsPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "App Installation" })).toBeInTheDocument();
  });
});
