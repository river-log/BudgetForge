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
];

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
