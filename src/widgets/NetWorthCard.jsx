import { Scale } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "../ui";
import { formatInsightCurrency } from "../utils/financialInsights";
import { calculateNetWorth } from "../utils/reportCalculations";

function NetWorthCard({ savingsGoals, debts }) {
  const result = calculateNetWorth(savingsGoals, debts);
  const tone = result.netWorth > 0 ? "success" : result.netWorth < 0 ? "danger" : "default";
  return <Card className="report-card" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><Scale size={19} aria-hidden="true" /></span><div><CardTitle>Net worth</CardTitle><p className="bf-card__description">Recorded savings minus debt.</p></div></div><Badge variant={tone} size="sm">{result.status}</Badge></CardHeader><CardContent><strong className={`report-feature-value report-feature-value--${tone}`}>{formatInsightCurrency(result.netWorth)}</strong><dl className="report-inline-metrics"><div><dt>Savings</dt><dd>{formatInsightCurrency(result.totalSavings)}</dd></div><div><dt>Debt</dt><dd>{formatInsightCurrency(result.totalDebt)}</dd></div></dl></CardContent></Card>;
}
export default NetWorthCard;
