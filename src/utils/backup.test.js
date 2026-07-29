import { beforeEach, describe, expect, it } from "vitest";
import {
  BACKUP_SCHEMA_VERSION,
  MAX_COLLECTION_SIZE,
  RECOVERY_STORAGE_KEY,
  createBackup,
  detectBackupVersion,
  getRecoveryBackup,
  migrateBackup,
  normalizeBackupData,
  restoreBackup,
  restoreRecoveryBackup,
} from "./backup";

function validData(overrides = {}) {
  return {
    bills: [{ id: 1, name: "Rent", amount: 1200, dueDate: "2026-07-01", category: "Housing", paid: true, paidMonths: ["2026-07"] }],
    income: 4200,
    userName: "Shane",
    budgetCategories: [{ id: 2, name: "Food", amount: 400 }],
    savingsGoals: [{ id: 3, name: "Emergency", target: 5000, saved: 800 }],
    savingsHistory: { "2026-07": 800 },
    debts: [{ id: 4, name: "Card", balance: 900, apr: 12, minimum: 50 }],
    debtStrategy: "avalanche",
    spendingHistory: { "2026-07": { total: 1200, categories: { Housing: 1200 } } },
    reminderDays: 7,
    incomeEntries: [],
    incomeMode: "manual",
    ...overrides,
  };
}

function v2(overrides = {}) {
  return { application: "BudgetForge", schemaVersion: 2, exportedAt: "2026-07-26T12:00:00.000Z", data: validData(overrides) };
}

class MemoryStorage {
  constructor() { this.values = new Map(); this.failOnceFor = null; }
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  removeItem(key) { this.values.delete(key); }
  setItem(key, value) {
    if (this.failOnceFor === key) { this.failOnceFor = null; throw new Error("simulated write failure"); }
    this.values.set(key, String(value));
  }
  clear() { this.values.clear(); }
}

describe("BudgetForge schema v2 backups", () => {
  beforeEach(() => localStorage.clear());

  it("exports the complete user workspace without device or auth values", () => {
    const mapping = {
      "budgetforge-bills": validData().bills,
      "budgetforge-budget-categories": validData().budgetCategories,
      "budgetforge-savings": validData().savingsGoals,
      "budgetforge-savings-history": validData().savingsHistory,
      "budgetforge-debts": validData().debts,
      "budgetforge-spending-history": validData().spendingHistory,
    };
    Object.entries(mapping).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
    localStorage.setItem("budgetforge-income", "4200");
    localStorage.setItem("budgetforge-user", "Shane");
    localStorage.setItem("budgetforge-debt-strategy", "avalanche");
    localStorage.setItem("budgetforge-reminder-days", "7");
    localStorage.setItem("budgetforge-device-id", "secret-device");
    localStorage.setItem("supabase.auth.token", "secret-session");

    const backup = createBackup(localStorage, new Date("2026-07-26T12:00:00.000Z"));
    expect(backup.schemaVersion).toBe(BACKUP_SCHEMA_VERSION);
    expect(backup.data).toEqual(validData());
    expect(backup.presentFields).toHaveLength(10);
    expect(JSON.stringify(backup)).not.toContain("secret-device");
    expect(JSON.stringify(backup)).not.toContain("secret-session");
    expect(JSON.stringify(backup)).toBe(JSON.stringify(createBackup(localStorage, new Date("2026-07-26T12:00:00.000Z"))));
  });

  it("migrates a legacy backup without writing storage", () => {
    const legacy = { version: "19.0", exportDate: "2026-07-01T00:00:00.000Z", income: 1000, bills: [], savings: [], debts: [], budgetCategories: [] };
    const migrated = migrateBackup(legacy);
    expect(detectBackupVersion(legacy)).toBe(1);
    expect(migrated).toMatchObject({ schemaVersion: 2, migratedFrom: 1, data: { income: 1000, reminderDays: 3 } });
    expect(localStorage.length).toBe(0);
  });

  it("imports a pre-income schema v2 backup with safe defaults", () => {
    const legacyV2 = v2();
    delete legacyV2.data.incomeEntries;
    delete legacyV2.data.incomeMode;
    const normalized = normalizeBackupData(legacyV2);
    expect(normalized.data.incomeEntries).toEqual([]);
    expect(normalized.data.incomeMode).toBe("manual");
  });

  it("rejects unsupported versions and malformed structures", () => {
    expect(() => normalizeBackupData({ ...v2(), schemaVersion: 3 })).toThrow("version 3 is not supported");
    expect(() => normalizeBackupData([])).toThrow("must be an object");
    expect(() => normalizeBackupData(v2({ bills: {} }))).toThrow("data.bills: must be an array");
    expect(() => normalizeBackupData(v2({ income: -1 }))).toThrow("data.income");
    expect(() => normalizeBackupData(v2({ bills: [{ ...validData().bills[0], dueDate: "2026-02-30" }] }))).toThrow("data.bills[0].dueDate");
    expect(() => normalizeBackupData(v2({ bills: [validData().bills[0], { ...validData().bills[0] }] }))).toThrow("duplicate id");
    expect(() => normalizeBackupData(v2({ bills: Array.from({ length: MAX_COLLECTION_SIZE + 1 }, (_, id) => ({ ...validData().bills[0], id })) }))).toThrow("item limit");
  });

  it("rejects prototype-pollution keys", () => {
    const unsafe = JSON.parse('{"application":"BudgetForge","schemaVersion":2,"exportedAt":"2026-07-26T12:00:00.000Z","data":{"__proto__":{}}}');
    expect(() => normalizeBackupData(unsafe)).toThrow("unsafe key");
  });

  it("validates before writes and restores atomically with a recovery copy", () => {
    localStorage.setItem("budgetforge-income", "2500");
    expect(() => restoreBackup(v2({ bills: "bad" }))).toThrow();
    expect(localStorage.getItem("budgetforge-income")).toBe("2500");
    expect(localStorage.getItem(RECOVERY_STORAGE_KEY)).toBeNull();

    restoreBackup(v2());
    expect(localStorage.getItem("budgetforge-income")).toBe("4200");
    expect(getRecoveryBackup().data.income).toBe(2500);
  });

  it("rolls back every value after a simulated write failure", () => {
    const storage = new MemoryStorage();
    storage.setItem("budgetforge-income", "2500");
    storage.failOnceFor = "budgetforge-debts";
    expect(() => restoreBackup(v2(), storage)).toThrow("previous workspace was recovered");
    expect(storage.getItem("budgetforge-income")).toBe("2500");
    expect(storage.getItem("budgetforge-bills")).toBeNull();
    expect(storage.getItem(RECOVERY_STORAGE_KEY)).toBeNull();
  });

  it("can restore the retained pre-import workspace", () => {
    localStorage.setItem("budgetforge-income", "2500");
    restoreBackup(v2());
    expect(localStorage.getItem("budgetforge-income")).toBe("4200");
    restoreRecoveryBackup();
    expect(localStorage.getItem("budgetforge-income")).toBe("2500");
  });
});
