import { Menu } from "lucide-react";

function MobileHeader({ onMenuClick }) {
  return (
    <header className="mobile-header">
      <button
        className="mobile-menu-button"
        onClick={onMenuClick}
      >
        <Menu size={28} />
      </button>

      <h2>BudgetForge</h2>
    </header>
  );
}

export default MobileHeader;