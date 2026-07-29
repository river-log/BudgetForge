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
  "budgetforge-paycheck-schedules-v1",
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

export function hasMeaningfulWorkspaceData(snapshot) {
  const parse = (key, fallback) => {
    try {
      return JSON.parse(snapshot?.[key] ?? JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };
  const collectionKeys = [
    "budgetforge-bills",
    "budgetforge-savings",
    "budgetforge-debts",
    "budgetforge-budget-categories",
    "budgetforge-income-entries-v1",
  ];
  const historyKeys = ["budgetforge-spending-history", "budgetforge-savings-history"];
  if (collectionKeys.some((key) => Array.isArray(parse(key, [])) && parse(key, []).length > 0)) return true;
  if (historyKeys.some((key) => Object.keys(parse(key, {})).length > 0)) return true;
  if (String(snapshot?.["budgetforge-user"] || "").trim()) return true;
  const manualIncome = Number(snapshot?.["budgetforge-income"]);
  return Number.isFinite(manualIncome) && manualIncome !== 4000;
}

export function hasUnsyncedLocalChanges(localSnapshot, lastSyncedSnapshot) {
  return serializeCloudSnapshot(localSnapshot) !== lastSyncedSnapshot;
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
