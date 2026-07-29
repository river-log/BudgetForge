import { useEffect, useState } from "react";

import { recordPayment } from "../utils/history";
import { isRecordArray, safeReadJson, safeReadNumber } from "../utils/safeStorage";
import {
  isPaidForMonth,
  toggleBillMonth,
} from "../utils/billPayments";
import { useToast } from "../features/toasts";
import useCloudSync from "../features/cloud/useCloudSync";
import { INCOME_MODE_STORAGE_KEY, INCOME_STORAGE_KEY } from "../features/income/constants";
import { incomeSummary, normalizeIncomeEntry, resolveMonthlyIncome, validateIncome } from "../features/income/income";

export default function useBudgetData() {
  const { showToast } = useToast();
  const cloud = useCloudSync();
  // Bills
  const [bills, setBills] = useState(() => {
    return safeReadJson("budgetforge-bills", [], isRecordArray);
  });

  // Monthly Income
  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    return safeReadNumber("budgetforge-income", 4000);
  });
  const [incomeEntries, setIncomeEntries] = useState(() => safeReadJson(INCOME_STORAGE_KEY, [], isRecordArray));
  const [incomeMode, setIncomeMode] = useState(() => localStorage.getItem(INCOME_MODE_STORAGE_KEY) === "tracked" ? "tracked" : "manual");

  // User Name
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("budgetforge-user") || "";
  });

  // Persist Bills
  useEffect(() => {
    localStorage.setItem(
      "budgetforge-bills",
      JSON.stringify(bills)
    );
  }, [bills]);

  // Persist Income
  useEffect(() => {
    localStorage.setItem(
      "budgetforge-income",
      monthlyIncome
    );
  }, [monthlyIncome]);
  useEffect(() => {
    localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(incomeEntries));
  }, [incomeEntries]);
  useEffect(() => {
    localStorage.setItem(INCOME_MODE_STORAGE_KEY, incomeMode);
  }, [incomeMode]);

  // Persist User Name
  useEffect(() => {
    localStorage.setItem(
      "budgetforge-user",
      userName
    );
  }, [userName]);

  function addBill(newBill) {
    setBills((prev) => [...prev, newBill]);

    showToast(
      "Bill added successfully!",
      "success"
    );
  }

  function togglePaid(id, date = new Date()) {
    const bill = bills.find((item) => item.id === id);

    if (bill && !isPaidForMonth(bill, date)) {
      recordPayment(bill);
    }

    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id
          ? toggleBillMonth(bill, date)
          : bill
      )
    );

    showToast(
      "Bill status updated.",
      "info"
    );
  }

  function deleteBill(id) {
    setBills((prev) =>
      prev.filter((bill) => bill.id !== id)
    );

    showToast(
      "Bill deleted.",
      "error"
    );
  }

  function addIncomeEntry(values) {
    const errors = validateIncome(values);
    if (Object.keys(errors).length) return { errors };
    const entry = normalizeIncomeEntry(values, { userId: cloud.session?.user?.id || null });
    setIncomeEntries((previous) => [...previous, entry]);
    showToast("Income added.", "success");
    return { entry };
  }

  function updateIncomeEntry(id, values) {
    const existing = incomeEntries.find((entry) => entry.id === id);
    if (!existing) return { errors: { entry: "Income entry was not found." } };
    const errors = validateIncome(values);
    if (Object.keys(errors).length) return { errors };
    const entry = normalizeIncomeEntry(values, { id, userId: cloud.session?.user?.id || existing.userId || null, createdAt: existing.createdAt });
    setIncomeEntries((previous) => previous.map((item) => item.id === id ? entry : item));
    showToast("Income updated.", "success");
    return { entry };
  }

  function deleteIncomeEntry(id) {
    setIncomeEntries((previous) => previous.filter((entry) => entry.id !== id));
    showToast("Income deleted.", "info");
  }

  const trackedMonthlyIncome = incomeSummary(incomeEntries).monthIncome;
  const effectiveMonthlyIncome = resolveMonthlyIncome(monthlyIncome, incomeEntries, incomeMode);

  return {
    bills,
    setBills,

    monthlyIncome,
    setMonthlyIncome,
    incomeEntries,
    incomeMode,
    setIncomeMode,
    trackedMonthlyIncome,
    effectiveMonthlyIncome,
    addIncomeEntry,
    updateIncomeEntry,
    deleteIncomeEntry,

    userName,
    setUserName,

    addBill,
    togglePaid,
    deleteBill,
  };
}
