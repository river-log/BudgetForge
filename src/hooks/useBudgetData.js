import { useEffect, useState } from "react";

import { recordPayment } from "../utils/history";
import {
  isPaidForMonth,
  toggleBillMonth,
} from "../utils/billPayments";

export default function useBudgetData(showToast) {
  // Bills
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("budgetforge-bills");
    return saved ? JSON.parse(saved) : [];
  });

  // Monthly Income
  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem("budgetforge-income");
    return saved ? Number(saved) : 4000;
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

    showToast?.(
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

    showToast?.(
      "Bill status updated.",
      "info"
    );
  }

  function deleteBill(id) {
    setBills((prev) =>
      prev.filter((bill) => bill.id !== id)
    );

    showToast?.(
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