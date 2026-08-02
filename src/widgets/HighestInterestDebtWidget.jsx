import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";
import { formatInsightCurrency, formatPercent, getHighestInterestDebt } from "../utils/financialInsights";

function HighestInterestDebtWidget({ debts }) {
  const debt = getHighestInterestDebt(debts);
  return <Card className="widget smart-widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><TrendingUp size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Highest-interest debt</CardTitle><p className="dashboard-widget__description">Your active balance with the highest recorded APR.</p></div></div></CardHeader><CardContent>{!debt ? <EmptyState className="dashboard-empty" icon={<TrendingUp aria-hidden="true" />} title="No active debt" description="Add a debt balance to compare recorded interest rates." /> : <><h3 className="smart-widget__name">{debt.name || "Unnamed debt"}</h3><dl className="smart-metrics"><div><dt>Balance</dt><dd>{formatInsightCurrency(debt.balance)}</dd></div><div><dt>APR</dt><dd>{formatPercent(debt.apr)}</dd></div><div><dt>Minimum payment</dt><dd>{formatInsightCurrency(debt.minimum)}</dd></div></dl><p className="smart-widget__note">Under an avalanche strategy, this balance may deserve priority because it has your highest recorded APR.</p></>}</CardContent></Card>;
}
export default HighestInterestDebtWidget;
