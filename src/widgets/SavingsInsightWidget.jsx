import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, Progress } from "../ui";
import { formatInsightCurrency, getClosestSavingsGoal } from "../utils/financialInsights";

function SavingsInsightWidget({ goals }) {
  const result = getClosestSavingsGoal(goals);
  return <Card className="widget smart-widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><PiggyBank size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Closest savings goal</CardTitle><p className="dashboard-widget__description">Your incomplete goal with the highest completion percentage.</p></div></div></CardHeader><CardContent>{result.allComplete ? <EmptyState className="dashboard-empty" icon={<PiggyBank aria-hidden="true" />} title="Every goal is complete" description="All recorded savings goals have reached their targets." /> : !result.goal ? <EmptyState className="dashboard-empty" icon={<PiggyBank aria-hidden="true" />} title="No savings goals yet" description="Add a savings goal to track progress here." /> : <><h3 className="smart-widget__name">{result.goal.name || "Unnamed goal"}</h3><Progress value={result.goal.percentage} max={100} color="success" label="Savings goal progress" showValue /><dl className="smart-metrics smart-metrics--two"><div><dt>Saved</dt><dd>{formatInsightCurrency(result.goal.saved)}</dd></div><div><dt>Target</dt><dd>{formatInsightCurrency(result.goal.target)}</dd></div></dl></>}</CardContent></Card>;
}
export default SavingsInsightWidget;
