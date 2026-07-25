import { CalendarClock } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";

function billStatus(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.ceil((due - today) / 86400000);
  if (daysUntilDue < 0) return { label: "Overdue", variant: "danger" };
  if (daysUntilDue <= 7) return { label: "Due soon", variant: "warning" };
  return { label: "Upcoming", variant: "default" };
}

function UpcomingBillsWidget({ bills }) {
  const upcoming = [...bills].filter((bill) => !bill.paid).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  return <Card className="widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><CalendarClock size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Upcoming bills</CardTitle><p className="dashboard-widget__description">Your next five unpaid bills.</p></div></div></CardHeader><CardContent>{upcoming.length === 0 ? <EmptyState className="dashboard-empty" icon={<CalendarClock aria-hidden="true" />} title="No upcoming bills" description="You have no unpaid bills due right now." /> : <ul className="upcoming-list">{upcoming.map((bill) => { const status = billStatus(bill.dueDate); return <li className="upcoming-row" key={bill.id}><div><strong className="upcoming-row__name">{bill.name}</strong><span className="upcoming-row__date">Due {bill.dueDate}</span></div><div className="upcoming-row__details"><Badge variant={status.variant} size="sm">{status.label}</Badge><span className="upcoming-row__amount">${Number(bill.amount || 0).toLocaleString("en-US")}</span></div></li>; })}</ul>}</CardContent></Card>;
}

export default UpcomingBillsWidget;
