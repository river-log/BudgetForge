import { beforeEach, describe, expect, it } from "vitest";
import { RECOVERY_STORAGE_KEY } from "../../utils/backup";
import { INVALID_STORAGE_PREFIX } from "../../utils/safeStorage";
import { CLOUD_STORAGE_KEYS, clearAccountLocalSafetyData, clearCloudStorage, clearDeletedAccountLocalData, getCloudSnapshot, hasMeaningfulWorkspaceData, hasUnsyncedLocalChanges, replaceCloudSnapshot, serializeCloudSnapshot } from "./cloudStorage";
describe("cloud storage snapshot", () => {
  beforeEach(() => localStorage.clear());
  it("replaces only cloud-owned values", () => {
    localStorage.setItem("budgetforge-device-id", "device");
    localStorage.setItem(RECOVERY_STORAGE_KEY, "recovery");
    localStorage.setItem(CLOUD_STORAGE_KEYS[0], "old");
    replaceCloudSnapshot({ [CLOUD_STORAGE_KEYS[0]]: "new" });
    expect(getCloudSnapshot()[CLOUD_STORAGE_KEYS[0]]).toBe("new");
    expect(getCloudSnapshot()).not.toHaveProperty(RECOVERY_STORAGE_KEY);
    clearCloudStorage();
    expect(localStorage.getItem(CLOUD_STORAGE_KEYS[0])).toBeNull();
    expect(localStorage.getItem("budgetforge-device-id")).toBe("device");
    expect(localStorage.getItem(RECOVERY_STORAGE_KEY)).toBe("recovery");
  });
  it("clears local safety data only during account isolation", () => {
    localStorage.setItem(RECOVERY_STORAGE_KEY, "recovery");
    localStorage.setItem(`${INVALID_STORAGE_PREFIX}budgetforge-bills`, "bad");
    clearAccountLocalSafetyData();
    expect(localStorage.getItem(RECOVERY_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(`${INVALID_STORAGE_PREFIX}budgetforge-bills`)).toBeNull();
  });
  it("clears account workspace, recovery, quarantine, owner, device, and isolation values after deletion", () => {
    CLOUD_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, "value"));
    localStorage.setItem(RECOVERY_STORAGE_KEY, "recovery");
    localStorage.setItem(`${INVALID_STORAGE_PREFIX}budgetforge-bills`, "bad");
    localStorage.setItem("budgetforge-cloud-owner-id", "owner");
    localStorage.setItem("budgetforge-device-id", "device");
    sessionStorage.setItem("budgetforge-cloud-isolation-reload-user", "owner");
    clearDeletedAccountLocalData();
    expect(CLOUD_STORAGE_KEYS.every((key) => localStorage.getItem(key) === null)).toBe(true);
    expect(localStorage.getItem(RECOVERY_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("budgetforge-cloud-owner-id")).toBeNull();
    expect(localStorage.getItem("budgetforge-device-id")).toBeNull();
    expect(sessionStorage.getItem("budgetforge-cloud-isolation-reload-user")).toBeNull();
  });
  it("distinguishes default empty state from meaningful guest data", () => {
    expect(hasMeaningfulWorkspaceData({ "budgetforge-income": "4000", "budgetforge-bills": "[]" })).toBe(false);
    expect(hasMeaningfulWorkspaceData({ "budgetforge-income": "4500", "budgetforge-bills": "[]" })).toBe(true);
    expect(hasMeaningfulWorkspaceData({ "budgetforge-bills": JSON.stringify([{ id: 1 }]) })).toBe(true);
  });
  it("detects local edits made after the last confirmed snapshot", () => {
    const original = { "budgetforge-bills": "[]" };
    expect(hasUnsyncedLocalChanges(original, serializeCloudSnapshot(original))).toBe(false);
    expect(hasUnsyncedLocalChanges({ "budgetforge-bills": "[{\"id\":1}]" }, serializeCloudSnapshot(original))).toBe(true);
  });
});
