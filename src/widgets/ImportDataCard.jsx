import { useRef } from "react";
import { CloudDownload } from "lucide-react";
import { restoreBackup } from "../utils/backup";

function ImportDataCard() {
  const inputRef = useRef(null);

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        restoreBackup(JSON.parse(reader.result));
        alert("Backup restored successfully. BudgetForge will now reload.");
        window.location.reload();
      } catch {
        alert("This is not a valid BudgetForge backup.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="widget settings-card">
      <CloudDownload size={28} aria-hidden="true" />
      <h2>Backup and restore</h2>
      <p className="text-muted">
        Choose a BudgetForge backup from Google Drive, OneDrive, Dropbox, or your device.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={importData}
        style={{ display: "none" }}
      />
      <button style={{ marginTop: "20px" }} onClick={() => inputRef.current?.click()}>
        <CloudDownload size={18} aria-hidden="true" />
        Choose backup
      </button>
    </div>
  );
}

export default ImportDataCard;
