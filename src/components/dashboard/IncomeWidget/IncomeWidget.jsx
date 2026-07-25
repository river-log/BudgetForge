import "./IncomeWidget.css";

import {
  Button,
  Card,
  Progress,
} from "../../../ui";

function IncomeWidget({
  income = 4000,
  expenses = 2350,
  onAddIncome,
}) {
  const remaining = income - expenses;
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="bf-income-widget">
      <div className="bf-income-widget__header">
        <h2 className="bf-income-widget__title">
          Monthly Budget
        </h2>

        <p className="bf-income-widget__subtitle">
          Track your income and spending.
        </p>
      </div>

      <div className="bf-income-widget__stats">
        <div className="bf-income-widget__row">
          <span>Income</span>
          <strong>{formatCurrency(income)}</strong>
        </div>

        <div className="bf-income-widget__row">
          <span>Expenses</span>
          <strong>{formatCurrency(expenses)}</strong>
        </div>

        <div className="bf-income-widget__row">
          <span>Remaining</span>
          <strong>{formatCurrency(remaining)}</strong>
        </div>
      </div>

      <Progress
        value={expenses}
        max={income}
        label="Budget Used"
        showValue
      />

      <div className="bf-income-widget__actions">
        <Button onClick={onAddIncome}>
          + Add Income
        </Button>
      </div>
    </Card>
  );
}

export default IncomeWidget;
