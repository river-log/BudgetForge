import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_NAMES = {
  "/": "Dashboard",
  "/bills": "Bills",
  "/budget": "Budget",
  "/calendar": "Calendar",
  "/savings": "Savings",
  "/debt": "Debt",
  "/reports": "Reports",
  "/settings": "Settings",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Use",
  "/support": "Support",
  "/account-deletion": "Account Deletion",
};

function RouteAnnouncer() {
  const { pathname } = useLocation();
  const routeName = ROUTE_NAMES[pathname] || "Page not found";

  useEffect(() => {
    document.title = `${routeName} | BudgetForge`;
    document.querySelector(".main-content")?.scrollTo?.({ top: 0, behavior: "auto" });
  }, [pathname, routeName]);

  return <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{routeName} page</div>;
}

export default RouteAnnouncer;
