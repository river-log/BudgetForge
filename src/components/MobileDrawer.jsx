import { useEffect, useRef } from "react";
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
  BanknoteArrowDown,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { Logo } from "./branding";

function MobileDrawer({
  open,
  onClose,
  returnFocusRef,
}) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef?.current;
    const background = document.querySelectorAll(".sidebar, .mobile-header, .main-content");
    background.forEach((element) => element.setAttribute("inert", ""));
    document.body.style.overflow = "hidden";
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = drawerRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => drawerRef.current?.querySelector("button")?.focus());
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      background.forEach((element) => element.removeAttribute("inert"));
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside ref={drawerRef} className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Main navigation">
        <div className="drawer-header">
          <Logo theme="dark" size="sm" />

          <button onClick={onClose} aria-label="Close navigation">
            <X size={22} aria-hidden="true" />
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
          <NavLink to="/income" className="nav-item" onClick={onClose}>
            <BanknoteArrowDown size={20} />
            Income
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
