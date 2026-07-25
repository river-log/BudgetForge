import "./Topbar.css";

import { Input } from "../../../ui";

function Topbar({
  title = "Dashboard",
  user = "Shane",
}) {
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  }

  return (
    <header className="bf-topbar">
      <div className="bf-topbar__left">
        <h1 className="bf-topbar__title">
          {title}
        </h1>

        <p className="bf-topbar__greeting">
          {greeting}, {user}
        </p>
      </div>

      <div className="bf-topbar__right">
        <div className="bf-topbar__search">
          <Input
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        <button
          className="bf-topbar__icon-button"
          aria-label="Notifications"
        >
          🔔
        </button>

        <button
          className="bf-topbar__avatar"
          aria-label="User menu"
        >
          {user.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}

export default Topbar;