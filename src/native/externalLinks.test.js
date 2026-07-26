import { describe, expect, it } from "vitest";
import { isTrustedExternalUrl } from "./externalLinks";

describe("isTrustedExternalUrl", () => {
  it("only allows HTTPS BudgetForge destinations", () => {
    expect(isTrustedExternalUrl("https://budget-forge.com/privacy")).toBe(true);
    expect(isTrustedExternalUrl("http://budget-forge.com/privacy")).toBe(false);
    expect(isTrustedExternalUrl("https://budget-forge.com.evil.example")).toBe(false);
  });
});
