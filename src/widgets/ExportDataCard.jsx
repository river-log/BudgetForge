import { CloudUpload, Download } from "lucide-react";
import { downloadBackup } from "../utils/backup";
import { exportBackup } from "../native/backupTransfer";

function ExportDataCard() {
  async function exportToCloud() {
    const result = await exportBackup();
    if (result === "downloaded") alert("Your backup was downloaded. Upload it to your preferred cloud drive.");
  }

  return (
    <div className="widget settings-card">
      <CloudUpload size={28} aria-hidden="true" />
      <h2>Export backup</h2>
      <p className="text-muted">
        Export bills, income, profile, budgets, savings, debts, histories, and supported preferences. Authentication and device-only settings are excluded.
      </p>
      <p className="text-muted">Cloud sync is not a substitute for keeping an offline backup.</p>
      <button style={{ marginTop: "20px" }} onClick={exportToCloud}>
        <CloudUpload size={18} aria-hidden="true" />
        Export to cloud
      </button>
      <button
        className="secondary-button"
        style={{ marginTop: "12px", marginLeft: "10px" }}
        onClick={() => downloadBackup()}
      >
        <Download size={18} aria-hidden="true" />
        Download
      </button>
    </div>
  );
}

export default ExportDataCard;
