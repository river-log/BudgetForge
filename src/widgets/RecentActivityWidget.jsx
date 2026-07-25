import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";

function RecentActivityWidget() {
  return <Card className="widget" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><History size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Recent activity</CardTitle><p className="dashboard-widget__description">Your latest financial updates appear here.</p></div></div></CardHeader><CardContent><EmptyState className="dashboard-empty" icon={<History aria-hidden="true" />} title="No recent activity" description="New bill payments and savings updates will appear here." /></CardContent></Card>;
}

export default RecentActivityWidget;
