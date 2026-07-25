import "./DashboardHeader.css";

import { Button } from "../../../ui";

function DashboardHeader({
  user = "Shane",
  month = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }),
  onAddBill,
  onAddIncome,
}) {
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  }

  return (
    <section className="bf-dashboard-header">
      <div className="bf-dashboard-header__content">
        <p className="bf-dashboard-header__greeting">
          {greeting}, {user}
        </p>

        <h1 className="bf-dashboard-header__title">
          Financial Dashboard
        </h1>

        <p className="bf-dashboard-header__subtitle">
          Here's your financial overview for{" "}
          <strong>{month}</strong>.
        </p>
      </div>

      <div className="bf-dashboard-header__actions">
        <Button
          variant="secondary"
          onClick={onAddIncome}
        >
          + Add Income
        </Button>

        <Button
          onClick={onAddBill}
        >
          + Add Bill
        </Button>
      </div>
    </section>
  );
}

export default DashboardHeader;