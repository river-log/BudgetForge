import { describe, expect, it } from "vitest";
import { getBackAction } from "./backButton";

describe("getBackAction", () => {
  it("closes overlays before navigating", () => {
    expect(getBackAction({ hasOverlay: true, pathname: "/reports", historyLength: 3 })).toBe("close-overlay");
  });

  it("navigates nested routes and stays safely at the root", () => {
    expect(getBackAction({ hasOverlay: false, pathname: "/settings", historyLength: 2 })).toBe("history-back");
    expect(getBackAction({ hasOverlay: false, pathname: "/", historyLength: 1 })).toBe("stay");
  });
});
