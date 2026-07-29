export const CLOUD_STORAGE_KEYS = [
  "budgetforge-bills",
  "budgetforge-income",
  "budgetforge-user",
  "budgetforge-savings",
  "budgetforge-debts",
  "budgetforge-budget-categories",
  "budgetforge-spending-history",
  "budgetforge-savings-history",
  "budgetforge-reminder-days",
  "budgetforge-debt-strategy",
  "budgetforge-income-entries-v1",
  "budgetforge-income-mode-v1",
];
import { RECOVERY_STORAGE_KEY } from "../../utils/backup";
import { clearQuarantinedStorage } from "../../utils/safeStorage";

const CLOUD_OWNER_KEY = "budgetforge-cloud-owner-id";

export function getCloudSnapshot() {
  return Object.fromEntries(
    CLOUD_STORAGE_KEYS.map((key) => [key, localStorage.getItem(key)])
  );
}

export function serializeCloudSnapshot(snapshot) {
  return JSON.stringify(
    Object.fromEntries(
      CLOUD_STORAGE_KEYS.map((key) => [key, snapshot?.[key] ?? null])
    )
  );
}

export function clearCloudStorage() {
  CLOUD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function clearAccountLocalSafetyData() {
  localStorage.removeItem(RECOVERY_STORAGE_KEY);
  clearQuarantinedStorage();
}

export function replaceCloudSnapshot(snapshot) {
  clearCloudStorage();

  CLOUD_STORAGE_KEYS.forEach((key) => {
    const value = snapshot?.[key];

    if (value !== null && value !== undefined) {
      localStorage.setItem(key, value);
    }
  });
}

export function getCloudOwnerId() {
  return localStorage.getItem(CLOUD_OWNER_KEY);
}

export function setCloudOwnerId(userId) {
  localStorage.setItem(CLOUD_OWNER_KEY, userId);
}

export function clearCloudOwnerId() {
  localStorage.removeItem(CLOUD_OWNER_KEY);
}

export function clearDeletedAccountLocalData(storage = localStorage, temporaryStorage = sessionStorage) {
  CLOUD_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
  storage.removeItem(CLOUD_OWNER_KEY);
  storage.removeItem(RECOVERY_STORAGE_KEY);
  storage.removeItem("budgetforge-device-id");
  clearQuarantinedStorage(storage);
  temporaryStorage.removeItem("budgetforge-cloud-isolation-reload-user");
}
