import { useEffect, useState } from "react";

import { recordPayment } from "../utils/history";
import { isRecordArray, safeReadJson, safeReadNumber } from "../utils/safeStorage";
import {
  isPaidForMonth,
  toggleBillMonth,
} from "../utils/billPayments";
import { useToast } from "../features/toasts";

export default function useBudgetData() {
  const { showToast } = useToast();
  // Bills
  const [bills, setBills] = useState(() => {
    return safeReadJson("budgetforge-bills", [], isRecordArray);
  });

  // Monthly Income
  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    return safeReadNumber("budgetforge-income", 4000);
  });

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

  return {
    bills,
    setBills,

    monthlyIncome,
    setMonthlyIncome,

    userName,
    setUserName,

    addBill,
    togglePaid,
    deleteBill,
  };
}
