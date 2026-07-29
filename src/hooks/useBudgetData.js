import { useEffect, useState } from "react";

import { recordPayment, removePayment } from "../utils/history";
import { isRecordArray, safeReadJson, safeReadNumber } from "../utils/safeStorage";
import {
  isPaidForMonth,
  toggleBillMonth,
} from "../utils/billPayments";
import { useToast } from "../features/toasts";
import useCloudSync from "../features/cloud/useCloudSync";
import { INCOME_MODE_STORAGE_KEY, INCOME_STORAGE_KEY, PAYCHECK_SCHEDULES_STORAGE_KEY } from "../features/income/constants";
import { incomeSummary, normalizeIncomeEntry, resolveMonthlyIncome, validateIncome } from "../features/income/income";
import { nextExpectedPayDate, normalizePaycheckSchedule, validatePaycheckSchedule } from "../features/income/paycheckSchedules";

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
  const [paycheckSchedules, setPaycheckSchedules] = useState(() => safeReadJson(PAYCHECK_SCHEDULES_STORAGE_KEY, [], isRecordArray));

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
  useEffect(() => {
    localStorage.setItem(PAYCHECK_SCHEDULES_STORAGE_KEY, JSON.stringify(paycheckSchedules));
  }, [paycheckSchedules]);

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

    if (bill) {
      if (isPaidForMonth(bill, date)) removePayment(bill, date);
      else recordPayment(bill, date);
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

  function addPaycheckSchedule(values) {
    const errors = validatePaycheckSchedule(values);
    if (Object.keys(errors).length) return { errors };
    const schedule = normalizePaycheckSchedule(values, { userId: cloud.session?.user?.id || null });
    setPaycheckSchedules((previous) => [...previous, schedule]);
    showToast("Paycheck schedule added.", "success");
    return { schedule };
  }
  function updatePaycheckSchedule(id, values) {
    const existing = paycheckSchedules.find((schedule) => schedule.id === id);
    if (!existing) return { errors: { schedule: "Schedule was not found." } };
    const errors = validatePaycheckSchedule(values);
    if (Object.keys(errors).length) return { errors };
    const schedule = normalizePaycheckSchedule(values, { id, userId: cloud.session?.user?.id || existing.userId || null, createdAt: existing.createdAt });
    setPaycheckSchedules((previous) => previous.map((item) => item.id === id ? schedule : item));
    showToast("Paycheck schedule updated.", "success");
    return { schedule };
  }
  function togglePaycheckSchedule(id) {
    setPaycheckSchedules((previous) => previous.map((schedule) => schedule.id === id ? { ...schedule, isActive: !schedule.isActive, updatedAt: new Date().toISOString() } : schedule));
  }
  function deletePaycheckSchedule(id) {
    setPaycheckSchedules((previous) => previous.filter((schedule) => schedule.id !== id));
    showToast("Paycheck schedule deleted.", "info");
  }
  function advancePaycheckSchedule(id, receivedDate) {
    setPaycheckSchedules((previous) => previous.map((schedule) => schedule.id === id ? { ...schedule, nextExpectedPayDate: nextExpectedPayDate(schedule, receivedDate), isActive: schedule.payFrequency === "one-time" ? false : schedule.isActive, updatedAt: new Date().toISOString() } : schedule));
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
    paycheckSchedules,
    addPaycheckSchedule,
    updatePaycheckSchedule,
    togglePaycheckSchedule,
    deletePaycheckSchedule,
    advancePaycheckSchedule,

    userName,
    setUserName,

    addBill,
    togglePaid,
    deleteBill,
  };
}
