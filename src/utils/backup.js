import { isValidStoredDate } from "./storedDates";
import { isRecordArray, isRecordObject, safeReadJson } from "./safeStorage";

export const BACKUP_APPLICATION = "BudgetForge";
export const BACKUP_SCHEMA_VERSION = 2;
export const RECOVERY_STORAGE_KEY = "budgetforge-restore-recovery-v1";
export const MAX_COLLECTION_SIZE = 5000;

export const WORKSPACE_STORAGE_KEYS = Object.freeze({
  bills: "budgetforge-bills",
  income: "budgetforge-income",
  userName: "budgetforge-user",
  budgetCategories: "budgetforge-budget-categories",
  savingsGoals: "budgetforge-savings",
  savingsHistory: "budgetforge-savings-history",
  debts: "budgetforge-debts",
  debtStrategy: "budgetforge-debt-strategy",
  spendingHistory: "budgetforge-spending-history",
  reminderDays: "budgetforge-reminder-days",
  incomeEntries: "budgetforge-income-entries-v1",
  incomeMode: "budgetforge-income-mode-v1",
});

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const ID_TYPES = ["string", "number"];

function fail(section, message) {
  throw new Error(`${section}: ${message}`);
}

function assertSafeObject(value, section = "backup", seen = new Set()) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key)) fail(section, `unsafe key "${key}" is not allowed`);
    assertSafeObject(value[key], `${section}.${key}`, seen);
  }
}

function finiteNonNegative(value, section) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) fail(section, "must be a finite non-negative number");
  return number;
}

function validId(value, section) {
  if (!ID_TYPES.includes(typeof value) || String(value).trim() === "") fail(section, "must have a valid id");
  return value;
}

function validateArray(value, section, normalizer) {
  if (!Array.isArray(value)) fail(section, "must be an array");
  if (value.length > MAX_COLLECTION_SIZE) fail(section, `exceeds the ${MAX_COLLECTION_SIZE} item limit`);
  const ids = new Set();
  return value.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) fail(`${section}[${index}]`, "must be an object");
    const normalized = normalizer(item, `${section}[${index}]`);
    const id = String(normalized.id);
    if (ids.has(id)) fail(section, `contains duplicate id "${id}"`);
    ids.add(id);
    return normalized;
  });
}

function normalizeBill(item, section) {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) fail(`${section}.name`, "is required");
  if (!isValidStoredDate(item.dueDate)) fail(`${section}.dueDate`, "must be a valid YYYY-MM-DD date");
  const paidMonths = item.paidMonths === undefined ? [] : item.paidMonths;
  if (!Array.isArray(paidMonths) || paidMonths.some((month) => !MONTH_PATTERN.test(month))) fail(`${section}.paidMonths`, "must contain valid YYYY-MM month values");
  return { ...item, id: validId(item.id, `${section}.id`), name, amount: finiteNonNegative(item.amount, `${section}.amount`), dueDate: item.dueDate, category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : "Other", paid: Boolean(item.paid), paidMonths: [...new Set(paidMonths)] };
}

function normalizeSavings(item, section) {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) fail(`${section}.name`, "is required");
  return { ...item, id: validId(item.id, `${section}.id`), name, target: finiteNonNegative(item.target, `${section}.target`), saved: finiteNonNegative(item.saved, `${section}.saved`) };
}

function normalizeDebt(item, section) {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) fail(`${section}.name`, "is required");
  return { ...item, id: validId(item.id, `${section}.id`), name, balance: finiteNonNegative(item.balance, `${section}.balance`), apr: finiteNonNegative(item.apr, `${section}.apr`), minimum: finiteNonNegative(item.minimum, `${section}.minimum`) };
}

function normalizeCategory(item, section) {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!name) fail(`${section}.name`, "is required");
  return { ...item, id: validId(item.id, `${section}.id`), name, amount: finiteNonNegative(item.amount, `${section}.amount`) };
}

function normalizeIncomeEntry(item, section) {
  const mode = item.entryMode;
  if (!["quick", "paycheck"].includes(mode)) fail(`${section}.entryMode`, "must be quick or paycheck");
  const sourceName = typeof item.sourceName === "string" ? item.sourceName.trim() : "";
  if (!sourceName) fail(`${section}.sourceName`, "is required");
  if (!isValidStoredDate(item.dateReceived)) fail(`${section}.dateReceived`, "must be a valid YYYY-MM-DD date");
  const normalized = {
    ...item,
    id: validId(item.id, `${section}.id`),
    userId: typeof item.userId === "string" ? item.userId : null,
    entryMode: mode,
    sourceType: typeof item.sourceType === "string" ? item.sourceType : "Other",
    sourceName,
    amount: finiteNonNegative(item.amount, `${section}.amount`),
    dateReceived: item.dateReceived,
    depositMethod: typeof item.depositMethod === "string" ? item.depositMethod : "Other",
    notes: typeof item.notes === "string" ? item.notes : "",
    createdAt: typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt)) ? item.createdAt : new Date(0).toISOString(),
    updatedAt: typeof item.updatedAt === "string" && !Number.isNaN(Date.parse(item.updatedAt)) ? item.updatedAt : new Date(0).toISOString(),
  };
  if (mode === "paycheck") {
    ["hourlyRate", "regularHours", "overtimeHours", "overtimeMultiplier", "grossPay", "federalTax", "stateTax", "localTax", "socialSecurityTax", "medicareTax", "healthInsurance", "retirementContribution", "otherDeductions", "totalDeductions", "netPay"].forEach((field) => {
      normalized[field] = finiteNonNegative(item[field] ?? 0, `${section}.${field}`);
    });
    normalized.employer = typeof item.employer === "string" ? item.employer.trim() : sourceName;
    if (!isValidStoredDate(item.payPeriodStart) || !isValidStoredDate(item.payPeriodEnd) || item.payPeriodEnd < item.payPeriodStart) fail(`${section}.payPeriod`, "must contain an ordered valid date range");
    normalized.payPeriodStart = item.payPeriodStart;
    normalized.payPeriodEnd = item.payPeriodEnd;
  }
  return normalized;
}

function normalizeSpendingHistory(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("data.spendingHistory", "must be an object");
  const entries = Object.entries(value);
  if (entries.length > 240) fail("data.spendingHistory", "exceeds the 240 month limit");
  return Object.fromEntries(entries.map(([month, entry]) => {
    if (!MONTH_PATTERN.test(month)) fail("data.spendingHistory", `contains invalid month "${month}"`);
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail(`data.spendingHistory.${month}`, "must be an object");
    const categories = entry.categories;
    if (!categories || typeof categories !== "object" || Array.isArray(categories)) fail(`data.spendingHistory.${month}.categories`, "must be an object");
    const normalizedCategories = Object.fromEntries(Object.entries(categories).map(([name, amount]) => [name, finiteNonNegative(amount, `data.spendingHistory.${month}.categories.${name}`)]));
    return [month, { total: finiteNonNegative(entry.total, `data.spendingHistory.${month}.total`), categories: normalizedCategories }];
  }));
}

function normalizeSavingsHistory(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("data.savingsHistory", "must be an object");
  const entries = Object.entries(value);
  if (entries.length > 240) fail("data.savingsHistory", "exceeds the 240 month limit");
  return Object.fromEntries(entries.map(([month, amount]) => {
    if (!MONTH_PATTERN.test(month)) fail("data.savingsHistory", `contains invalid month "${month}"`);
    return [month, finiteNonNegative(amount, `data.savingsHistory.${month}`)];
  }));
}

export function detectBackupVersion(backup) {
  if (!backup || typeof backup !== "object" || Array.isArray(backup)) fail("backup", "must be an object");
  assertSafeObject(backup);
  if (Object.hasOwn(backup, "schemaVersion")) return backup.schemaVersion;
  if (Object.hasOwn(backup, "version") && Object.hasOwn(backup, "exportDate")) return 1;
  fail("backup", "format is not recognized");
}

export function migrateV1ToV2(legacy) {
  const legacyPresence = [
    ["bills", "bills"],
    ["income", "income"],
    ["userName", "userName"],
    ["budgetCategories", "budgetCategories"],
    ["savings", "savingsGoals"],
    ["savingsHistory", "savingsHistory"],
    ["debts", "debts"],
    ["debtStrategy", "debtStrategy"],
    ["spendingHistory", "spendingHistory"],
    ["reminderDays", "reminderDays"],
  ].filter(([legacyKey]) => Object.hasOwn(legacy, legacyKey)).map(([, field]) => field);
  return {
    application: BACKUP_APPLICATION,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: legacy.exportDate,
    migratedFrom: 1,
    presentFields: legacyPresence,
    data: {
      bills: legacy.bills ?? [],
      income: legacy.income ?? 0,
      userName: legacy.userName ?? "",
      budgetCategories: legacy.budgetCategories ?? [],
      savingsGoals: legacy.savings ?? [],
      savingsHistory: legacy.savingsHistory ?? {},
      debts: legacy.debts ?? [],
      debtStrategy: legacy.debtStrategy ?? "snowball",
      spendingHistory: legacy.spendingHistory ?? {},
      reminderDays: legacy.reminderDays ?? 3,
    },
  };
}

export function migrateBackup(backup) {
  const version = detectBackupVersion(backup);
  if (version === 1) return migrateV1ToV2(backup);
  if (version === BACKUP_SCHEMA_VERSION) return backup;
  fail("schemaVersion", `version ${String(version)} is not supported`);
}

export function normalizeBackupData(input) {
  const backup = migrateBackup(input);
  if (backup.application !== BACKUP_APPLICATION) fail("application", `must be "${BACKUP_APPLICATION}"`);
  if (backup.schemaVersion !== BACKUP_SCHEMA_VERSION) fail("schemaVersion", `must be ${BACKUP_SCHEMA_VERSION}`);
  if (typeof backup.exportedAt !== "string" || Number.isNaN(Date.parse(backup.exportedAt))) fail("exportedAt", "must be a valid ISO 8601 date");
  if (!backup.data || typeof backup.data !== "object" || Array.isArray(backup.data)) fail("data", "must be an object");
  assertSafeObject(backup.data, "data");
  const data = backup.data;
  const supportedFields = Object.keys(WORKSPACE_STORAGE_KEYS);
  const presentFields = backup.presentFields ?? supportedFields.filter((field) => Object.hasOwn(data, field));
  if (!Array.isArray(presentFields) || presentFields.some((field) => !supportedFields.includes(field))) fail("presentFields", "must contain only supported workspace fields");
  const strategy = data.debtStrategy ?? "snowball";
  if (!["snowball", "avalanche"].includes(strategy)) fail("data.debtStrategy", "must be snowball or avalanche");
  const reminderDays = finiteNonNegative(data.reminderDays ?? 3, "data.reminderDays");
  if (![0, 1, 3, 7, 14].includes(reminderDays)) fail("data.reminderDays", "must be an available reminder interval");
  return {
    application: BACKUP_APPLICATION,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date(backup.exportedAt).toISOString(),
    migratedFrom: backup.migratedFrom,
    presentFields: [...new Set(presentFields)],
    data: {
      bills: validateArray(data.bills ?? [], "data.bills", normalizeBill),
      income: finiteNonNegative(data.income ?? 0, "data.income"),
      userName: typeof data.userName === "string" ? data.userName : fail("data.userName", "must be a string"),
      budgetCategories: validateArray(data.budgetCategories ?? [], "data.budgetCategories", normalizeCategory),
      savingsGoals: validateArray(data.savingsGoals ?? [], "data.savingsGoals", normalizeSavings),
      savingsHistory: normalizeSavingsHistory(data.savingsHistory ?? {}),
      debts: validateArray(data.debts ?? [], "data.debts", normalizeDebt),
      debtStrategy: strategy,
      spendingHistory: normalizeSpendingHistory(data.spendingHistory ?? {}),
      reminderDays,
      incomeEntries: validateArray(data.incomeEntries ?? [], "data.incomeEntries", normalizeIncomeEntry),
      incomeMode: data.incomeMode === "tracked" ? "tracked" : "manual",
    },
  };
}

function rawWorkspaceData(storage = localStorage) {
  return {
    bills: safeReadJson(WORKSPACE_STORAGE_KEYS.bills, [], isRecordArray, storage),
    income: Number(storage.getItem(WORKSPACE_STORAGE_KEYS.income) ?? 0),
    userName: storage.getItem(WORKSPACE_STORAGE_KEYS.userName) ?? "",
    budgetCategories: safeReadJson(WORKSPACE_STORAGE_KEYS.budgetCategories, [], isRecordArray, storage),
    savingsGoals: safeReadJson(WORKSPACE_STORAGE_KEYS.savingsGoals, [], isRecordArray, storage),
    savingsHistory: safeReadJson(WORKSPACE_STORAGE_KEYS.savingsHistory, {}, isRecordObject, storage),
    debts: safeReadJson(WORKSPACE_STORAGE_KEYS.debts, [], isRecordArray, storage),
    debtStrategy: storage.getItem(WORKSPACE_STORAGE_KEYS.debtStrategy) ?? "snowball",
    spendingHistory: safeReadJson(WORKSPACE_STORAGE_KEYS.spendingHistory, {}, isRecordObject, storage),
    reminderDays: Number(storage.getItem(WORKSPACE_STORAGE_KEYS.reminderDays) ?? 3),
    incomeEntries: safeReadJson(WORKSPACE_STORAGE_KEYS.incomeEntries, [], isRecordArray, storage),
    incomeMode: storage.getItem(WORKSPACE_STORAGE_KEYS.incomeMode) === "tracked" ? "tracked" : "manual",
  };
}

export function createBackup(storage = localStorage, now = new Date()) {
  const presentFields = Object.entries(WORKSPACE_STORAGE_KEYS).filter(([, key]) => storage.getItem(key) !== null).map(([field]) => field);
  return normalizeBackupData({
    application: BACKUP_APPLICATION,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    presentFields,
    data: rawWorkspaceData(storage),
  });
}

export function backupFile() {
  const date = new Date().toISOString().split("T")[0];
  return new File([JSON.stringify(createBackup(), null, 2)], `BudgetForge-${date}.json`, { type: "application/json" });
}

export function downloadBackup(file = backupFile()) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function serializedWorkspace(data) {
  return {
    [WORKSPACE_STORAGE_KEYS.bills]: JSON.stringify(data.bills),
    [WORKSPACE_STORAGE_KEYS.income]: String(data.income),
    [WORKSPACE_STORAGE_KEYS.userName]: data.userName,
    [WORKSPACE_STORAGE_KEYS.budgetCategories]: JSON.stringify(data.budgetCategories),
    [WORKSPACE_STORAGE_KEYS.savingsGoals]: JSON.stringify(data.savingsGoals),
    [WORKSPACE_STORAGE_KEYS.savingsHistory]: JSON.stringify(data.savingsHistory),
    [WORKSPACE_STORAGE_KEYS.debts]: JSON.stringify(data.debts),
    [WORKSPACE_STORAGE_KEYS.debtStrategy]: data.debtStrategy,
    [WORKSPACE_STORAGE_KEYS.spendingHistory]: JSON.stringify(data.spendingHistory),
    [WORKSPACE_STORAGE_KEYS.reminderDays]: String(data.reminderDays),
    [WORKSPACE_STORAGE_KEYS.incomeEntries]: JSON.stringify(data.incomeEntries),
    [WORKSPACE_STORAGE_KEYS.incomeMode]: data.incomeMode,
  };
}

function restoreRawSnapshot(snapshot, storage) {
  Object.entries(snapshot).forEach(([key, value]) => {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, value);
  });
}

export function restoreBackup(input, storage = localStorage) {
  const normalized = normalizeBackupData(input);
  const writes = serializedWorkspace(normalized.data);
  const previous = Object.fromEntries([...Object.values(WORKSPACE_STORAGE_KEYS), RECOVERY_STORAGE_KEY].map((key) => [key, storage.getItem(key)]));
  const recovery = createBackup(storage);
  try {
    storage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(recovery));
    Object.entries(writes).forEach(([key, value]) => storage.setItem(key, value));
    Object.entries(writes).forEach(([key, value]) => {
      if (storage.getItem(key) !== value) throw new Error(`Could not verify restored value for ${key}.`);
    });
    return normalized;
  } catch (error) {
    restoreRawSnapshot(previous, storage);
    throw new Error(`Restore failed and the previous workspace was recovered. ${error.message}`, { cause: error });
  }
}

export function getRecoveryBackup(storage = localStorage) {
  const raw = storage.getItem(RECOVERY_STORAGE_KEY);
  if (!raw) return null;
  try {
    return normalizeBackupData(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function restoreRecoveryBackup(storage = localStorage) {
  const recovery = getRecoveryBackup(storage);
  if (!recovery) throw new Error("No valid recovery copy is available.");
  return restoreBackup(recovery, storage);
}

export function getBackupPreview(input) {
  const normalized = normalizeBackupData(input);
  const months = new Set([...Object.keys(normalized.data.spendingHistory), ...Object.keys(normalized.data.savingsHistory)]);
  return {
    normalized,
    schemaVersion: normalized.schemaVersion,
    exportedAt: normalized.exportedAt,
    migratedLegacy: normalized.migratedFrom === 1,
    bills: normalized.data.bills.length,
    savingsGoals: normalized.data.savingsGoals.length,
    debts: normalized.data.debts.length,
    budgetCategories: normalized.data.budgetCategories.length,
    incomeEntries: normalized.data.incomeEntries.length,
    historyMonths: [...months].sort(),
    preferences: ["User profile", "Debt strategy", "Reminder window"],
  };
}
