import { CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { formatInsightCurrency } from "../utils/financialInsights";
import { calculateFinancialSummary } from "../utils/reportCalculations";

function FinancialSummaryCard(props) {
  const summary = calculateFinancialSummary(props);
  const metrics = [
    ["Monthly income", summary.monthlyIncome], ["Total bills", summary.totalBills],
    ["Total savings", summary.totalSavings], ["Total debt", summary.totalDebt],
    ["Remaining monthly cash flow", summary.remainingCashFlow],
  ];
  return <Card className="report-card report-card--wide" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><CircleDollarSign size={19} aria-hidden="true" /></span><div><CardTitle>Financial summary</CardTitle><p className="bf-card__description">Current totals from your BudgetForge workspace.</p></div></div></CardHeader><CardContent><dl className="report-metric-grid">{metrics.map(([label, value]) => <div key={label} className={label === "Remaining monthly cash flow" && value < 0 ? "report-metric--negative" : ""}><dt>{label}</dt><dd>{formatInsightCurrency(value)}</dd></div>)}</dl><p className="report-card__note">Remaining cash flow is monthly income minus planned bills.</p></CardContent></Card>;
}
export default FinancialSummaryCard;
