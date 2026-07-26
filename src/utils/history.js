const SPENDING_KEY = "budgetforge-spending-history";
const SAVINGS_KEY = "budgetforge-savings-history";
import { isRecordObject, safeReadJson, safeWriteJson } from "./safeStorage";

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function readHistory(key) {
  return safeReadJson(key, {}, isRecordObject);
}

function writeHistory(key, history) {
  safeWriteJson(key, history);
}

export function recordPayment(bill) {
  const history = readHistory(SPENDING_KEY);
  const key = monthKey();
  const entry = history[key] || { total: 0, categories: {} };
  const amount = Number(bill.amount) || 0;
  const category = bill.category || "Other";

  entry.total += amount;
  entry.categories[category] = (entry.categories[category] || 0) + amount;
  history[key] = entry;
  writeHistory(SPENDING_KEY, history);
}

export function recordSavingsSnapshot(goals) {
  const history = readHistory(SAVINGS_KEY);
  history[monthKey()] = goals.reduce((total, goal) => total + (Number(goal.saved) || 0), 0);
  writeHistory(SAVINGS_KEY, history);
}

export function recentMonths(count = 6) {
  const months = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth() - index, 1);
    months.push({
      key: monthKey(date),
      label: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return months;
}

export function getSpendingHistory() {
  return readHistory(SPENDING_KEY);
}

export function getSavingsHistory() {
  return readHistory(SAVINGS_KEY);
}
