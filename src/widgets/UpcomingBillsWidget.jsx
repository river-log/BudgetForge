import { CalendarClock } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";
import { isPaidForMonth } from "../utils/billPayments";
import { formatStoredDateSafely, parseStoredDate, recurringStoredDate } from "../utils/storedDates";

function billStatus(dueDate, now = new Date()) {
  const due = parseStoredDate(dueDate);
  if (!due) return { label: "Invalid date", variant: "danger" };
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.ceil((due - today) / 86400000);
  if (daysUntilDue < 0) return { label: "Overdue", variant: "danger" };
  if (daysUntilDue <= 7) return { label: "Due soon", variant: "warning" };
  return { label: "Upcoming", variant: "default" };
}

function UpcomingBillsWidget({ bills }) {
  const now = new Date();
  const upcoming = (Array.isArray(bills) ? bills : [])
    .filter((bill) => !isPaidForMonth(bill, now))
    .map((bill) => ({ ...bill, occurrenceDate: recurringStoredDate(bill.dueDate, now) }))
    .sort((a, b) => (parseStoredDate(a.occurrenceDate)?.getTime() ?? Number.MAX_SAFE_INTEGER) - (parseStoredDate(b.occurrenceDate)?.getTime() ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 5);
  return <Card className="widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><CalendarClock size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Upcoming bills</CardTitle><p className="dashboard-widget__description">Your next five unpaid bills.</p></div></div></CardHeader><CardContent>{upcoming.length === 0 ? <EmptyState className="dashboard-empty" icon={<CalendarClock aria-hidden="true" />} title="No upcoming bills" description="You have no unpaid bills due right now." /> : <ul className="upcoming-list">{upcoming.map((bill) => { const status = billStatus(bill.occurrenceDate, now); return <li className="upcoming-row" key={bill.id}><div><strong className="upcoming-row__name">{bill.name}</strong><span className="upcoming-row__date">Due {formatStoredDateSafely(bill.occurrenceDate)}</span></div><div className="upcoming-row__details"><Badge variant={status.variant} size="sm">{status.label}</Badge><span className="upcoming-row__amount">{Number(bill.amount || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div></li>; })}</ul>}</CardContent></Card>;
}

export default UpcomingBillsWidget;
