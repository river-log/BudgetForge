import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/cards.css";
import "./styles/forms.css";
import "./styles/dashboard.css";
import "./styles/pages.css";
import "./styles/animations.css";
import App from "./App.jsx";
import { CloudSyncProvider } from "./features/cloud/CloudSyncProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CloudSyncProvider>
        <App />
      </CloudSyncProvider>
    </BrowserRouter>
  </StrictMode>
);
