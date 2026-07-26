import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import "./App.css";

import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MobileDrawer from "./components/MobileDrawer";

import CommandPalette from "./features/commandPalette/commandPalette";
import "./features/commandPalette/commandPalette.css";

import { AppRouter } from "./router";
import Onboarding from "./features/onboarding/Onboarding.jsx";
import { ConnectionStatus, RouteAnnouncer } from "./features/pwa";
import NativeShell from "./native/NativeShell";

function App() {
  const location = useLocation();
  const menuButtonRef = useRef(null);
  // Command Palette
  const [commandOpen, setCommandOpen] = useState(false);

  // Mobile Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuLocationKey, setMobileMenuLocationKey] = useState(null);

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
      <NativeShell />
      <Sidebar />

      <MobileHeader
        buttonRef={menuButtonRef}
        onMenuClick={() => { setCommandOpen(false); setMobileMenuLocationKey(location.key); setMobileMenuOpen(true); }}
      />

      <MobileDrawer
        open={mobileMenuOpen && mobileMenuLocationKey === location.key}
        onClose={() => setMobileMenuOpen(false)}
        returnFocusRef={menuButtonRef}
      />

      <main className="main-content">
        <ConnectionStatus />
        <RouteAnnouncer />
        <AppRouter />
      </main>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />

      <Onboarding />

    </div>
  );
}

export default App;
