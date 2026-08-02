import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { formatInsightCurrency, formatPercent } from "../utils/financialInsights";
import { calculateDebtReport } from "../utils/reportCalculations";

function DebtProgressCard({ debts }) {
  const report = calculateDebtReport(debts);
  return <Card className="report-card" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><CreditCard size={19} aria-hidden="true" /></span><div><CardTitle>Debt report</CardTitle><p className="bf-card__description">Active balances and recorded minimums.</p></div></div></CardHeader><CardContent><strong className="report-feature-value">{formatInsightCurrency(report.totalDebt)}</strong><dl className="report-metric-list"><div><dt>Monthly minimum payments</dt><dd>{formatInsightCurrency(report.minimumPayments)}</dd></div><div><dt>Average APR</dt><dd>{formatPercent(report.averageApr)}</dd></div><div><dt>Highest APR account</dt><dd>{report.highestAprAccount ? `${report.highestAprAccount.name || "Unnamed debt"} · ${formatPercent(report.highestAprAccount.apr)}` : "No active debt"}</dd></div></dl></CardContent></Card>;
}
export default DebtProgressCard;
