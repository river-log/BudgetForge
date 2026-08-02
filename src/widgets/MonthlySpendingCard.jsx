import { ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";
import { formatInsightCurrency } from "../utils/financialInsights";
import { calculateMonthlySpending } from "../utils/reportCalculations";

function MonthlySpendingCard({ bills }) {
  const report = calculateMonthlySpending(bills);
  return <Card className="report-card report-card--wide" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><ReceiptText size={19} aria-hidden="true" /></span><div><CardTitle>Monthly spending</CardTitle><p className="bf-card__description">Current-month status for recurring bills.</p></div></div></CardHeader><CardContent>{!Array.isArray(bills) || bills.length === 0 ? <EmptyState title="No bill data yet" description="Add bills to see paid, unpaid, largest-bill, and category totals." /> : <><dl className="report-metric-grid report-metric-grid--four"><div><dt>Paid bills</dt><dd>{formatInsightCurrency(report.totalPaidBills)}</dd><small>{report.paidCount} paid</small></div><div><dt>Unpaid bills</dt><dd>{formatInsightCurrency(report.totalUnpaidBills)}</dd><small>{report.unpaidCount} unpaid</small></div><div><dt>Largest bill</dt><dd>{report.largestBill?.name || "Unnamed bill"}</dd><small>{formatInsightCurrency(report.largestBill?.amount)}</small></div><div><dt>Categories</dt><dd>{report.categories.length}</dd><small>Planned bill categories</small></div></dl><div className="report-category-list" aria-label="Bills by category">{report.categories.map((category) => <div key={category.category}><span>{category.category}</span><strong>{formatInsightCurrency(category.total)}</strong></div>)}</div></>}</CardContent></Card>;
}
export default MonthlySpendingCard;
