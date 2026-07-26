import { beforeEach, describe, expect, it } from "vitest";
import { INVALID_STORAGE_PREFIX, safeReadEnum, safeReadJson, safeReadNumber } from "./safeStorage";

describe("safe storage recovery", () => {
  beforeEach(() => localStorage.clear());

  it("returns a default and quarantines malformed JSON", () => {
    localStorage.setItem("budgetforge-bills", "{bad");
    expect(safeReadJson("budgetforge-bills", [], Array.isArray)).toEqual([]);
    expect(localStorage.getItem("budgetforge-bills")).toBeNull();
    expect(localStorage.getItem(`${INVALID_STORAGE_PREFIX}budgetforge-bills`)).toBe("{bad");
  });

  it("preserves valid values unchanged", () => {
    localStorage.setItem("budgetforge-bills", "[]");
    expect(safeReadJson("budgetforge-bills", [], Array.isArray)).toEqual([]);
    expect(localStorage.getItem("budgetforge-bills")).toBe("[]");
  });

  it("recovers incorrect array, numeric, and enum shapes", () => {
    localStorage.setItem("budgetforge-savings", "{}");
    localStorage.setItem("budgetforge-income", "NaN");
    localStorage.setItem("budgetforge-debt-strategy", "unknown");
    expect(safeReadJson("budgetforge-savings", [], Array.isArray)).toEqual([]);
    expect(safeReadNumber("budgetforge-income", 4000)).toBe(4000);
    expect(safeReadEnum("budgetforge-debt-strategy", ["snowball", "avalanche"], "snowball")).toBe("snowball");
  });
});

