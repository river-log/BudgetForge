import { Gauge } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from "../ui";
import { calculateFinancialHealth } from "../utils/financialInsights";

function FinancialHealthWidget({ bills, savingsGoals, debts, monthlyIncome }) {
  const health = calculateFinancialHealth({ bills, savingsGoals, debts, monthlyIncome });
  const color = health.score >= 70 ? "success" : health.score >= 50 ? "warning" : "danger";
  return <Card className="widget smart-widget dashboard-widget--wide" padding="lg">
    <CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><Gauge size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Financial health</CardTitle><p className="dashboard-widget__description">A deterministic snapshot based on your saved BudgetForge data.</p></div></div><Badge variant={color} size="sm">{health.status}</Badge></CardHeader>
    <CardContent><div className="health-score"><strong>{health.score}</strong><span>out of 100</span></div><Progress value={health.score} max={100} color={color} label="Financial health score" /><div className="health-factors"><p><strong>Strongest:</strong> {health.strongest.label} ({health.strongest.score}/100).</p><p><strong>Needs the most attention:</strong> {health.weakest.label} ({health.weakest.score}/100).</p></div></CardContent>
  </Card>;
}
export default FinancialHealthWidget;
