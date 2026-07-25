import ExportDataCard from "../widgets/ExportDataCard";
import ImportDataCard from "../widgets/ImportDataCard";
import CloudSyncCard from "../widgets/CloudSyncCard";

function SettingsPage() {
  return <div className="insights-page"><header className="insights-header"><div><h1>Settings</h1><p>Manage cloud sync, backups, and your BudgetForge workspace.</p></div></header><section className="settings-grid" aria-label="Application settings"><ExportDataCard /><ImportDataCard /><CloudSyncCard /></section></div>;
}
export default SettingsPage;
