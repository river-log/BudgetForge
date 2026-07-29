import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { Logo } from "../components/branding";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const BillsPage = lazy(() => import("../pages/BillsPage"));
const IncomePage = lazy(() => import("../pages/IncomePage"));
const BudgetPage = lazy(() => import("../pages/BudgetPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const SavingsPage = lazy(() => import("../pages/SavingsPage"));
const DebtPage = lazy(() => import("../pages/DebtPage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage"));
const TermsPage = lazy(() => import("../pages/TermsPage"));
const SupportPage = lazy(() => import("../pages/SupportPage"));
const AccountDeletionPage = lazy(() => import("../pages/AccountDeletionPage"));

function AppRouter() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
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
      <Route path="/income" element={<IncomePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/account-deletion" element={<AccountDeletionPage />} />
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function NotFoundPage() {
  return (
    <div className="workspace-page">
      <header className="workspace-header">
        <div>
          <h1>Page not found</h1>
          <p>The page you requested doesn’t exist. Use the navigation to return to your workspace.</p>
        </div>
      </header>
    </div>
  );
}

function RouteLoadingFallback() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <Logo variant="mark" theme="dark" size="lg" decorative />
      <Spinner size="md" label="Loading your financial workspace..." />
    </div>
  );
}

export default AppRouter;
