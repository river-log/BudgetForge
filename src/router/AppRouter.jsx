import { Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import BillsPage from "../pages/BillsPage";
import BudgetPage from "../pages/BudgetPage";
import SavingsPage from "../pages/SavingsPage";
import DebtPage from "../pages/DebtPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import CalendarPage from "../pages/CalendarPage";

function AppRouter({ showToast }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage showToast={showToast} />
        }
      />

      <Route
        path="/bills"
        element={
          <BillsPage />
        }
      />

      <Route
        path="/budget"
        element={
          <BudgetPage />
        }
      />

      <Route
        path="/calendar"
        element={
          <CalendarPage />
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
        element={
          <ReportsPage />
        }
      />

      <Route
        path="/settings"
        element={<SettingsPage />}
      />
    </Routes>
  );
}

export default AppRouter;
