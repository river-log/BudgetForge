import { CalendarClock } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";
import { formatInsightCurrency, getBillsDueSoon } from "../utils/financialInsights";
import { formatStoredDateSafely } from "../utils/storedDates";

function BillsDueSoonWidget({ bills, now }) {
  const timing = getBillsDueSoon(bills, now);
  const visible = timing.items.slice(0, 3);
  return <Card className="widget smart-widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><CalendarClock size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Bills due soon</CardTitle><p className="dashboard-widget__description"><strong>{timing.dueSoon.length}</strong> unpaid {timing.dueSoon.length === 1 ? "bill" : "bills"} due in the next 7 days.</p></div></div></CardHeader><CardContent>{visible.length === 0 ? <EmptyState className="dashboard-empty" icon={<CalendarClock aria-hidden="true" />} title="Nothing due soon" description="No unpaid bills are overdue or due within the next seven days." /> : <ul className="upcoming-list">{visible.map((bill) => <li className="upcoming-row" key={`${bill.id}-${bill.dueDate}`}><div><strong className="upcoming-row__name">{bill.name || "Unnamed bill"}</strong><span className="upcoming-row__date">Due {formatStoredDateSafely(bill.dueDate)}</span></div><div className="upcoming-row__details"><Badge variant={bill.overdue ? "danger" : "warning"} size="sm">{bill.overdue ? "Overdue" : bill.daysUntilDue === 0 ? "Due today" : `Due in ${bill.daysUntilDue} days`}</Badge><span className="upcoming-row__amount">{formatInsightCurrency(bill.amount)}</span></div></li>)}</ul>}</CardContent></Card>;
}
export default BillsDueSoonWidget;
