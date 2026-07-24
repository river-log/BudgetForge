import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  BarChart3,
  CalendarDays,
  Settings,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function MobileDrawer({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={onClose}
      />

      <aside className="mobile-drawer">
        <div className="drawer-header">
          <h2>BudgetForge</h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <nav>
          <NavLink
            to="/"
            end
            className="nav-item"
            onClick={onClose}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/bills"
            className="nav-item"
            onClick={onClose}
          >
            <CreditCard size={20} />
            Bills
          </NavLink>

          <NavLink
            to="/budget"
            className="nav-item"
            onClick={onClose}
          >
            <Wallet size={20} />
            Budget
          </NavLink>

          <NavLink
            to="/calendar"
            className="nav-item"
            onClick={onClose}
          >
            <CalendarDays size={20} />
            Calendar
          </NavLink>

          <NavLink
            to="/savings"
            className="nav-item"
            onClick={onClose}
          >
            <PiggyBank size={20} />
            Savings
          </NavLink>

          <NavLink
            to="/debt"
            className="nav-item"
            onClick={onClose}
          >
            <Landmark size={20} />
            Debt
          </NavLink>

          <NavLink
            to="/reports"
            className="nav-item"
            onClick={onClose}
          >
            <BarChart3 size={20} />
            Reports
          </NavLink>

          <NavLink
            to="/settings"
            className="nav-item"
            onClick={onClose}
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default MobileDrawer;
