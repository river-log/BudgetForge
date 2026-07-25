import "./AppLayout.css";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

function AppLayout({ children }) {
  return (
    <div className="bf-app-layout">
      <aside className="bf-app-layout__sidebar">
        <Sidebar />
      </aside>

      <div className="bf-app-layout__main">
        <header className="bf-app-layout__topbar">
          <Topbar />
        </header>

        <main className="bf-app-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;