import { PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Progress } from "../ui";
import { formatInsightCurrency } from "../utils/financialInsights";
import { calculateSavingsReport } from "../utils/reportCalculations";

function SavingsProgressCard({ goals }) {
  const report = calculateSavingsReport(goals);
  return <Card className="report-card" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><PiggyBank size={19} aria-hidden="true" /></span><div><CardTitle>Savings progress</CardTitle><p className="bf-card__description">Progress across all recorded goals.</p></div></div></CardHeader><CardContent><strong className="report-feature-value">{formatInsightCurrency(report.totalSaved)}</strong><Progress value={report.averageCompletion} max={100} color="success" label="Average goal completion" showValue animated={false} /><dl className="report-inline-metrics"><div><dt>Goals</dt><dd>{report.goalCount}</dd></div><div><dt>Completed</dt><dd>{report.completedGoals}</dd></div></dl></CardContent></Card>;
}
export default SavingsProgressCard;
