import { CircleCheck, CircleAlert, CreditCard, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";

function QuickStatsWidget({ bills }) {
  const paid = bills.filter((bill) => bill.paid).length;
  const unpaid = bills.length - paid;
  const overdue = bills.filter((bill) => !bill.paid && new Date(bill.dueDate) < new Date()).length;
  const stats = [{ label: "Total bills", value: bills.length, Icon: CreditCard }, { label: "Paid", value: paid, Icon: CircleCheck, tone: "success" }, { label: "Unpaid", value: unpaid, Icon: Circle }, { label: "Overdue", value: overdue, Icon: CircleAlert, tone: overdue > 0 ? "danger" : "" }];
  return <Card className="widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><CreditCard size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Bill snapshot</CardTitle><p className="dashboard-widget__description">A quick view of your bill status.</p></div></div></CardHeader><CardContent><div className="quick-stats">{stats.map(({ label, value, Icon, tone }) => <div className={`quick-stat ${tone ? `quick-stat--${tone}` : ""}`} key={label}><span className="quick-stat__label"><Icon size={14} aria-hidden="true" />{label}</span><strong className="quick-stat__value">{value}</strong></div>)}</div></CardContent></Card>;
}

export default QuickStatsWidget;
