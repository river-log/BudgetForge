import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { getSuggestedNextAction } from "../utils/financialInsights";

function NextActionWidget({ bills, debts, savingsGoals }) {
  const action = getSuggestedNextAction({ bills, debts, savingsGoals });
  return <Card className="widget smart-widget dashboard-widget--wide next-action" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><Sparkles size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Suggested next action</CardTitle><p className="dashboard-widget__description">Rule-based guidance from your current records.</p></div></div></CardHeader><CardContent><div className="next-action__content"><div><h3>{action.title}</h3><p>{action.description}</p><small>BudgetForge provides organizational guidance, not professional financial advice.</small></div><Link className="next-action__link" to={action.route}>Review <ArrowRight size={16} aria-hidden="true" /></Link></div></CardContent></Card>;
}
export default NextActionWidget;
