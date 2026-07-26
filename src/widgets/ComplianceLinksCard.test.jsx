import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ComplianceLinksCard from "./ComplianceLinksCard";
import { complianceLinks } from "./complianceLinks";
import { isTrustedExternalUrl } from "../native/externalLinks";

describe("ComplianceLinksCard", () => {
  it("renders every stable policy URL and keeps each native URL trusted", () => {
    render(<ComplianceLinksCard />);
    expect(complianceLinks.map(([, url]) => url)).toEqual([
      "https://budget-forge.com/privacy",
      "https://budget-forge.com/terms",
      "https://budget-forge.com/support",
      "https://budget-forge.com/account-deletion",
    ]);
    complianceLinks.forEach(([label, url]) => {
      expect(screen.getByRole("button", { name: new RegExp(label) })).toBeInTheDocument();
      expect(isTrustedExternalUrl(url)).toBe(true);
    });
  });
});
