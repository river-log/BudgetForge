import { BrowserRouter } from "react-router-dom";
import { RouteErrorBoundary } from "../components/errors";
import { BudgetProvider } from "../context";
import { CloudSyncProvider } from "../features/cloud/CloudSyncProvider";
import { ToastProvider } from "../features/toasts";

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <CloudSyncProvider>
        <ToastProvider>
          <BudgetProvider>
            <RouteErrorBoundary>
              {children}
            </RouteErrorBoundary>
          </BudgetProvider>
        </ToastProvider>
      </CloudSyncProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
