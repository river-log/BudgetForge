import { useLocation } from "react-router-dom";
import AppErrorBoundary from "./AppErrorBoundary";

function RouteErrorBoundary({ children }) {
  const location = useLocation();

  return (
    <AppErrorBoundary resetKey={location.pathname}>
      {children}
    </AppErrorBoundary>
  );
}

export default RouteErrorBoundary;
