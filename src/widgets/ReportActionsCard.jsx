import { Download, FileClock, Printer } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";
import { downloadBackup } from "../utils/backup";
import { createFinancialReport } from "../utils/reportCalculations";

function ReportActionsCard({ reportData }) {
  function exportReport() {
    const date = new Date().toISOString().slice(0, 10);
    const file = new File([JSON.stringify(createFinancialReport(reportData), null, 2)], `BudgetForge-Report-${date}.json`, { type: "application/json" });
    downloadBackup(file);
  }
  return <Card className="report-card report-actions-card" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><Download size={19} aria-hidden="true" /></span><div><CardTitle>Report actions</CardTitle><p className="bf-card__description">Save or print this calculated report.</p></div></div></CardHeader><CardContent><div className="report-actions"><Button leftIcon={<Download size={17} aria-hidden="true" />} onClick={exportReport}>Export report as JSON</Button><Button variant="secondary" leftIcon={<Printer size={17} aria-hidden="true" />} onClick={() => window.print()}>Print report</Button><Button variant="secondary" leftIcon={<FileClock size={17} aria-hidden="true" />} disabled>PDF export — Coming Soon</Button></div><p className="report-card__note">Report export is separate from the full Backup & Restore format.</p></CardContent></Card>;
}
export default ReportActionsCard;
