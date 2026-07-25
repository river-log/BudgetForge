import { useEffect, useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MobileDrawer from "./components/MobileDrawer";

import CommandPalette from "./features/commandPalette/commandPalette";
import "./features/commandPalette/commandPalette.css";

import { AppRouter } from "./router";

function App() {
  // Command Palette
  const [commandOpen, setCommandOpen] = useState(false);

  // Mobile Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen(true);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <MobileHeader
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="main-content">
        <AppRouter />
      </main>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />

    </div>
  );
}

export default App;
