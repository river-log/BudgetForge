import ExportDataCard from "../widgets/ExportDataCard";
import ImportDataCard from "../widgets/ImportDataCard";
import CloudSyncCard from "../widgets/CloudSyncCard";
import { InstallAppCard } from "../features/pwa";
import AccountDeletionCard from "../features/accountDeletion/AccountDeletionCard";
import ComplianceLinksCard from "../widgets/ComplianceLinksCard";

function SettingsPage() {
  return <div className="insights-page"><header className="insights-header"><div><h1>Settings</h1><p>Manage installation, cloud sync, backups, and your BudgetForge workspace.</p></div></header><section className="settings-grid" aria-label="Application settings"><InstallAppCard /><ExportDataCard /><ImportDataCard /><CloudSyncCard /><ComplianceLinksCard /><AccountDeletionCard /></section></div>;
}
export default SettingsPage;
