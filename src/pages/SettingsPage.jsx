import ExportDataCard from "../widgets/ExportDataCard";
import ImportDataCard from "../widgets/ImportDataCard";

function SettingsPage() {
  return (
    <>
      <div className="dashboard-header">
        <h1>⚙ Settings</h1>

        <p className="text-muted">
          Manage your BudgetForge
          application settings and backups.
        </p>
      </div>

      <div
        className="widget-grid"
        style={{ marginTop: "24px" }}
      >
        <ExportDataCard />

        <ImportDataCard />
      </div>
    </>
  );
}

export default SettingsPage;