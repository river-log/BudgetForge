import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { APP_VERSION } from "../config/version";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo-area">
          <div className="logo-circle">
            B
          </div>

          <div>
            <h1 className="logo">
              BudgetForge
            </h1>

            <small>
              Personal Finance OS
            </small>
          </div>
        </div>

        <nav>
          <NavLink to="/" end className="nav-item">
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/bills" className="nav-item">
            <CreditCard size={20} />
            Bills
          </NavLink>

          <NavLink to="/budget" className="nav-item">
            <Wallet size={20} />
            Budget
          </NavLink>

          <NavLink to="/savings" className="nav-item">
            <PiggyBank size={20} />
            Savings
          </NavLink>

          <NavLink to="/debt" className="nav-item">
            <Landmark size={20} />
            Debt
          </NavLink>

          <NavLink to="/reports" className="nav-item">
            <BarChart3 size={20} />
            Reports
          </NavLink>

          <NavLink to="/settings" className="nav-item">
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>
      </div>

      <small className="version">
        BudgetForge OS v{APP_VERSION}
      </small>
    </aside>
  );
}

export default Sidebar;