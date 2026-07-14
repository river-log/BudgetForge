import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Sidebar from "./components/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import BillsPage from "./pages/BillsPage";
import BudgetPage from "./pages/BudgetPage";
import SavingsPage from "./pages/SavingsPage";
import DebtPage from "./pages/DebtPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

import ToastContainer from "./features/toasts/ToastContainer";
import CommandPalette from "./features/commandPalette/CommandPalette";
import "./features/commandPalette/CommandPalette.css";

function App() {
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

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Command Palette
  const [commandOpen, setCommandOpen] = useState(false);

  // Save Bills
  useEffect(() => {
    localStorage.setItem(
      "budgetforge-bills",
      JSON.stringify(bills)
    );
  }, [bills]);

  // Save Income
  useEffect(() => {
    localStorage.setItem(
      "budgetforge-income",
      monthlyIncome
    );
  }, [monthlyIncome]);

  // Save User Name
  useEffect(() => {
    localStorage.setItem(
      "budgetforge-user",
      userName
    );
  }, [userName]);

  function showToast(message, type = "info") {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((toast) => toast.id !== id)
      );
    }, 3000);
  }

  function addBill(newBill) {
    setBills((prev) => [...prev, newBill]);
    showToast("Bill added successfully!", "success");
  }

  function togglePaid(id) {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id
          ? { ...bill, paid: !bill.paid }
          : bill
      )
    );

    showToast("Bill status updated.", "info");
  }

  function deleteBill(id) {
    setBills((prev) =>
      prev.filter((bill) => bill.id !== id)
    );

    showToast("Bill deleted.", "error");
  }

  useEffect(() => {
  function handleKeyDown(event) {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();
      setCommandOpen(true);
    }

    if (event.key === "Escape") {
      setCommandOpen(false);
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                bills={bills}
                monthlyIncome={monthlyIncome}
                setMonthlyIncome={setMonthlyIncome}
                userName={userName}
                setUserName={setUserName}
                showToast={showToast}
              />
            }
          />

          <Route
            path="/bills"
            element={
              <BillsPage
                bills={bills}
                addBill={addBill}
                togglePaid={togglePaid}
                deleteBill={deleteBill}
              />
            }
          />

          <Route
            path="/budget"
            element={
              <BudgetPage
                bills={bills}
                monthlyIncome={monthlyIncome}
              />
            }
          />

          <Route
            path="/savings"
            element={<SavingsPage />}
          />

          <Route
            path="/debt"
            element={<DebtPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Routes>
      </main>
      
<CommandPalette
  open={commandOpen}
  onClose={() => setCommandOpen(false)}
/>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;