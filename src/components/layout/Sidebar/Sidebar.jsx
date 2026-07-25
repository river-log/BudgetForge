import "./Sidebar.css";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "bills", label: "Bills", icon: "💳" },
  { id: "budget", label: "Budget", icon: "💰" },
  { id: "savings", label: "Savings", icon: "🎯" },
  { id: "debt", label: "Debt", icon: "📉" },
  { id: "reports", label: "Reports", icon: "📊" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function Sidebar() {
  return (
    <nav className="bf-sidebar">
      <div className="bf-sidebar__brand">
        <h1 className="bf-sidebar__logo">
          BudgetForge
        </h1>

        <p className="bf-sidebar__tagline">
          Build Better Financial Habits
        </p>
      </div>

      <ul className="bf-sidebar__nav">
        {navigation.map((item, index) => (
          <li key={item.id}>
            <button
              className={`bf-sidebar__link ${
                index === 0 ? "is-active" : ""
              }`}
            >
              <span className="bf-sidebar__icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;