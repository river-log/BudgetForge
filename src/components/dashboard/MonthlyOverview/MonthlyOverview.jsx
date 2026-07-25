import "./MonthlyOverview.css";

import { Card, Progress } from "../../../ui";

function MonthlyOverview({
  income = 4000,
  expenses = 2350,
  savings = 1150,
}) {
  const remaining = income - expenses;
  const percentUsed = Math.round((expenses / income) * 100);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="bf-monthly-overview">
      <div className="bf-monthly-overview__header">
        <h2 className="bf-monthly-overview__title">
          Monthly Overview
        </h2>

        <p className="bf-monthly-overview__subtitle">
          A snapshot of your financial progress this month.
        </p>
      </div>

      <div className="bf-monthly-overview__grid">
        <div className="bf-monthly-overview__stat">
          <span className="bf-monthly-overview__label">
            Income
          </span>

          <strong className="bf-monthly-overview__value">
            {formatCurrency(income)}
          </strong>
        </div>

        <div className="bf-monthly-overview__stat">
          <span className="bf-monthly-overview__label">
            Expenses
          </span>

          <strong className="bf-monthly-overview__value">
            {formatCurrency(expenses)}
          </strong>
        </div>

        <div className="bf-monthly-overview__stat">
          <span className="bf-monthly-overview__label">
            Savings
          </span>

          <strong className="bf-monthly-overview__value">
            {formatCurrency(savings)}
          </strong>
        </div>

        <div className="bf-monthly-overview__stat">
          <span className="bf-monthly-overview__label">
            Remaining
          </span>

          <strong className="bf-monthly-overview__value">
            {formatCurrency(remaining)}
          </strong>
        </div>
      </div>

      <Progress
        value={expenses}
        max={income}
        label="Monthly Budget Used"
        showValue
      />

      <div className="bf-monthly-overview__summary">
        <strong>{percentUsed}%</strong> of your monthly budget has
        been used so far.
      </div>
    </Card>
  );
}

export default MonthlyOverview;