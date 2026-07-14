import { Menu } from "lucide-react";

function MobileHeader({ onMenuClick }) {
  return (
    <header className="mobile-header">
      <div className="header-left">
        <button
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={30} />
        </button>
      </div>

      <div className="header-center">
        <div className="header-logo">
          B
        </div>

        <h1>BudgetForge</h1>
      </div>

      <div className="header-right" />
    </header>
  );
}

export default MobileHeader;