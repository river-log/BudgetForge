import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./styles/variables.css";
import "./styles/workspace.css";
import "./styles/insights.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/cards.css";
import "./styles/forms.css";
import "./styles/dashboard.css";
import "./styles/pages.css";
import "./styles/animations.css";
import "./styles/mobile-pwa.css";
import App from "./App.jsx";
import { AppProviders } from "./providers";
import { registerServiceWorker } from "./pwa/serviceWorker";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);

window.addEventListener("load", () => {
  registerServiceWorker().catch((error) => {
    console.warn("BudgetForge could not register offline support.", error);
  });
});
