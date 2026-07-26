import { describe, expect, it } from "vitest";
import { parseNativeAuthCallback } from "./auth";

describe("parseNativeAuthCallback", () => {
  it("accepts the exact custom-scheme callback", () => {
    expect(parseNativeAuthCallback("com.budgetforge.app://auth/callback?code=once")).toEqual({ code: "once" });
  });

  it("accepts the production universal link", () => {
    expect(parseNativeAuthCallback("https://budget-forge.com/auth/callback?code=once")).toEqual({ code: "once" });
  });

  it("rejects untrusted hosts and incomplete links", () => {
    expect(parseNativeAuthCallback("https://evil.example/auth/callback?code=once")).toBeNull();
    expect(parseNativeAuthCallback("com.budgetforge.app://auth/callback")).toEqual({ error: expect.any(String) });
  });
});
