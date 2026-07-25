import { beforeEach, describe, expect, it } from "vitest";
import { CLOUD_STORAGE_KEYS } from "../cloud/cloudStorage";
import { completeOnboarding, ONBOARDING_KEY, shouldShowOnboarding } from "./onboarding";

describe("onboarding", () => {
  beforeEach(() => localStorage.clear());
  it("shows only for a genuinely empty workspace", () => { expect(shouldShowOnboarding()).toBe(true); localStorage.setItem(CLOUD_STORAGE_KEYS[0], "[]"); expect(shouldShowOnboarding()).toBe(false); });
  it("does not show after dismissal", () => { completeOnboarding(); expect(localStorage.getItem(ONBOARDING_KEY)).toBe("true"); expect(shouldShowOnboarding()).toBe(false); });
});
