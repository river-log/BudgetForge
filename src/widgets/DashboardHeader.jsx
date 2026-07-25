import { CalendarDays } from "lucide-react";
import { Logo } from "../components/branding";

function DashboardHeader({ userName }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__identity">
        <div className="dashboard-header__mark"><Logo variant="mark" theme="dark" size="sm" decorative /></div>
        <div>
          <h1>{greeting}{userName ? `, ${userName}` : ""}</h1>
          <p>Here’s where your finances stand today.</p>
        </div>
      </div>
      <div className="today"><CalendarDays size={16} aria-hidden="true" /><span>{today}</span></div>
    </header>
  );
}

export default DashboardHeader;
