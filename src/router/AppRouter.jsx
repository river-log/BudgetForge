import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../ui/Spinner";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const BillsPage = lazy(() => import("../pages/BillsPage"));
const BudgetPage = lazy(() => import("../pages/BudgetPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const SavingsPage = lazy(() => import("../pages/SavingsPage"));
const DebtPage = lazy(() => import("../pages/DebtPage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

function AppRouter() {
  return (
    <Suspense fallback={<Spinner size="lg" centered label="Loading page..." />}>
      <Routes>
      <Route
        path="/"
        element={
          <DashboardPage />
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
    </Suspense>
  );
}

export default AppRouter;
