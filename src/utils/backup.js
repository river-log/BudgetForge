const BACKUP_VERSION = "19.0";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function createBackup() {
  return {
    version: BACKUP_VERSION,
    exportDate: new Date().toISOString(),
    income: Number(localStorage.getItem("budgetforge-income") || 0),
    bills: readJson("budgetforge-bills", []),
    savings: readJson("budgetforge-savings", []),
    debts: readJson("budgetforge-debts", []),
    budgetCategories: readJson("budgetforge-budget-categories", []),
  };
}

export function backupFile() {
  const date = new Date().toISOString().split("T")[0];
  const json = JSON.stringify(createBackup(), null, 2);

  return new File([json], `BudgetForge-${date}.json`, {
    type: "application/json",
  });
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

export function restoreBackup(backup) {
  if (!backup || !backup.version || !backup.exportDate) {
    throw new Error("Invalid BudgetForge backup.");
  }

  localStorage.setItem("budgetforge-income", String(Number(backup.income) || 0));
  localStorage.setItem("budgetforge-bills", JSON.stringify(backup.bills || []));
  localStorage.setItem("budgetforge-savings", JSON.stringify(backup.savings || []));
  localStorage.setItem("budgetforge-debts", JSON.stringify(backup.debts || []));
  localStorage.setItem(
    "budgetforge-budget-categories",
    JSON.stringify(backup.budgetCategories || [])
  );
}
