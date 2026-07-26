import { Menu } from "lucide-react";
import { Logo } from "./branding";

function MobileHeader({ onMenuClick, buttonRef }) {
  return (
    <header className="mobile-header">
      <div className="header-left">
        <button
          ref={buttonRef}
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={30} />
        </button>
      </div>

      <div className="header-center">
        <Logo theme="dark" size="sm" />
      </div>

      <div className="header-right" />
    </header>
  );
}

export default MobileHeader;
