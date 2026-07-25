import { useEffect, useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MobileDrawer from "./components/MobileDrawer";

import ToastContainer from "./features/toasts/ToastContainer";
import CommandPalette from "./features/commandPalette/commandPalette";
import "./features/commandPalette/commandPalette.css";

import { BudgetProvider } from "./context";
import { AppRouter } from "./router";

function App() {
  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Command Palette
  const [commandOpen, setCommandOpen] = useState(false);

  // Mobile Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function showToast(message, type = "info") {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((toast) => toast.id !== id)
      );
    }, 3000);
  }

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
    <BudgetProvider showToast={showToast}>
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
          <AppRouter showToast={showToast} />
        </main>

        <CommandPalette
          open={commandOpen}
          onClose={() => setCommandOpen(false)}
        />

        <ToastContainer toasts={toasts} />
      </div>
    </BudgetProvider>
  );
}

export default App;
