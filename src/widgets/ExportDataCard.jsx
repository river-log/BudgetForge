import { CloudUpload, Download } from "lucide-react";
import { backupFile, downloadBackup } from "../utils/backup";

function ExportDataCard() {
  async function exportToCloud() {
    const file = backupFile();

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "BudgetForge backup",
          text: "My BudgetForge backup",
          files: [file],
        });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    downloadBackup(file);
    alert("Your backup was downloaded. Upload it to your preferred cloud drive.");
  }

  return (
    <div className="widget settings-card">
      <CloudUpload size={28} aria-hidden="true" />
      <h2>Export backup</h2>
      <p className="text-muted">
        Send a complete backup to a cloud app, or download it to upload later.
      </p>
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
