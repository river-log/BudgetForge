import { ArrowDown, ArrowRight, ArrowUp, CalendarDays, Lightbulb } from "lucide-react";
import { Card, EmptyState, Progress } from "../../ui";
import {
  calculateMonthComparison,
  calculateMonthlySummary,
  formatCurrency,
  generateMonthlyInsights,
  previousMonthKey,
} from "../../utils/monthlyInsights";

const unavailable = "Not available for this month";

export function MonthSelector({ months, value, onChange }) {
  return (
    <div className="month-selector">
      <label htmlFor="monthly-review-month">Review month</label>
      <select id="monthly-review-month" value={value} onChange={(event) => onChange(event.target.value)}>
        {months.map((month) => <option key={month.key} value={month.key}>{month.label}</option>)}
      </select>
    </div>
  );
}

function SummaryMetric({ label, value, hint }) {
  return <div className="monthly-summary__metric"><span>{label}</span><strong>{value === null ? "—" : formatCurrency(value)}</strong>{hint && <small>{hint}</small>}</div>;
}

export function MonthlySummaryGrid({ summary }) {
  return (
    <section aria-labelledby="monthly-summary-title">
      <div className="monthly-review__heading"><h2 id="monthly-summary-title">Monthly summary</h2><span>{summary.isCurrentMonth ? "Live current-month data" : "Recorded history"}</span></div>
      <div className="monthly-summary">
        <SummaryMetric label="Monthly income" value={summary.income} hint={summary.income === null ? unavailable : null} />
        <SummaryMetric label="Planned bills" value={summary.totalBills} hint={summary.totalBills === null ? unavailable : null} />
        <SummaryMetric label="Paid bills" value={summary.paidAmount} hint={summary.paidCount === null ? "Recorded payment total" : `${summary.paidCount} paid`} />
        <SummaryMetric label="Unpaid bills" value={summary.unpaidAmount} hint={summary.unpaidCount === null ? unavailable : `${summary.unpaidCount} unpaid`} />
        <SummaryMetric label="Income after bills" value={summary.remainingIncome} hint={summary.remainingIncome === null ? unavailable : null} />
        <SummaryMetric label="Savings balance" value={summary.savingsBalance} hint={summary.savingsBalance === null ? "No savings snapshot recorded" : "Balance snapshot, not monthly contributions"} />
      </div>
      {summary.budgetUtilization !== null && (
        <Card className="budget-utilization" padding="md">
          <Progress value={summary.budgetUtilization} max={100} label="Income assigned to bills and budget categories" showValue animated={false} />
        </Card>
      )}
    </section>
  );
}

export function ComparisonMetric({ comparison }) {
  const icons = { increase: ArrowUp, decrease: ArrowDown, same: ArrowRight };
  const Icon = icons[comparison.direction];
  const direction = comparison.direction === "same" ? "No change" : `${comparison.direction === "increase" ? "Increased" : "Decreased"} by ${formatCurrency(Math.abs(comparison.change))}`;
  const percentage = comparison.percentageChange === null
    ? "Percentage unavailable because the previous value was zero"
    : `${Math.abs(comparison.percentageChange).toFixed(1)}%`;

  return <Card className="comparison-metric" padding="md"><Icon size={20} aria-hidden="true" /><div><span>{comparison.label}</span><strong>{direction}</strong><small>{comparison.direction === "same" ? "0%" : percentage}</small></div></Card>;
}

export function InsightCard({ insight }) {
  return <Card className="insight-card" padding="md"><Lightbulb size={19} aria-hidden="true" /><p>{insight.text}</p></Card>;
}

export default function MonthlyReview({ selectedMonth, months, onMonthChange, bills, monthlyIncome, spendingHistory, savingsHistory, budgetCategories }) {
  const inputs = { bills, monthlyIncome, spendingHistory, savingsHistory, budgetCategories };
  const summary = calculateMonthlySummary({ selectedMonth, ...inputs });
  const previousKey = previousMonthKey(selectedMonth);
  const previousAvailable = months.some((month) => month.key === previousKey);
  const previous = previousAvailable ? calculateMonthlySummary({ selectedMonth: previousKey, ...inputs }) : null;
  const comparisons = [
    calculateMonthComparison(summary, previous, "paidAmount", "Paid bills"),
    calculateMonthComparison(summary, previous, "savingsBalance", "Savings balance"),
  ].filter(Boolean);
  const insights = generateMonthlyInsights(summary, previous);

  return (
    <section className="monthly-review" aria-labelledby="monthly-review-title">
      <div className="monthly-review__top">
        <div><span className="monthly-review__eyebrow"><CalendarDays size={17} aria-hidden="true" /> Monthly review</span><h2 id="monthly-review-title">A clear look at your month</h2><p>Based only on financial history recorded in BudgetForge.</p></div>
        <MonthSelector months={months} value={selectedMonth} onChange={onMonthChange} />
      </div>
      <MonthlySummaryGrid summary={summary} />
      <section aria-labelledby="comparison-title">
        <div className="monthly-review__heading"><h2 id="comparison-title">Compared with the previous month</h2></div>
        {comparisons.length ? <div className="comparison-grid">{comparisons.map((comparison) => <ComparisonMetric key={comparison.key} comparison={comparison} />)}</div> : <EmptyState title="Not enough history is available for this comparison." description="Comparisons appear after adjacent months contain recorded values." />}
      </section>
      <section aria-labelledby="insights-title">
        <div className="monthly-review__heading"><h2 id="insights-title">Financial insights</h2><span>Factual highlights</span></div>
        {insights.length ? <div className="insight-grid">{insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}</div> : <EmptyState title="No monthly insights yet" description="Mark bills paid or update savings to build your recorded history." />}
      </section>
    </section>
  );
}

