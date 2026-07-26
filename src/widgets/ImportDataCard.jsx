import { useRef, useState } from "react";
import { CloudDownload, History } from "lucide-react";
import { Button, Modal } from "../ui";
import {
  getBackupPreview,
  getRecoveryBackup,
  restoreBackup,
  restoreRecoveryBackup,
} from "../utils/backup";
import useCloudSync from "../features/cloud/useCloudSync";
import { validateBackupFileSize } from "../native/backupTransfer";

function ImportDataCard() {
  const cloud = useCloudSync();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const recovery = getRecoveryBackup();

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      validateBackupFileSize(file);
    } catch (sizeError) {
      setError(sizeError.message);
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setPreview(getBackupPreview(JSON.parse(reader.result)));
      } catch (readError) {
        setError(readError instanceof SyntaxError ? "The selected file is not valid JSON." : readError.message);
      }
    };
    reader.onerror = () => setError("BudgetForge could not read the selected file.");
    reader.readAsText(file);
    event.target.value = "";
  }

  async function finishCloudRestore() {
    if (!cloud.session) return;
    const result = await cloud.syncNow();
    if (result.error) throw new Error(`The workspace was restored locally, but cloud sync could not finish: ${result.error.message}`);
  }

  async function applyRestore() {
    if (!preview) return;
    setRestoring(true);
    try {
      restoreBackup(preview.normalized);
      await finishCloudRestore();
      window.location.reload();
    } catch (restoreError) {
      setError(restoreError.message);
      setRestoring(false);
      setPreview(null);
    }
  }

  async function applyRecovery() {
    setRestoring(true);
    try {
      restoreRecoveryBackup();
      await finishCloudRestore();
      window.location.reload();
    } catch (restoreError) {
      setError(restoreError.message);
      setRestoring(false);
      setRecoveryOpen(false);
    }
  }

  return (
    <div className="widget settings-card">
      <CloudDownload size={28} aria-hidden="true" />
      <h2>Restore a backup</h2>
      <p className="text-muted">Preview a BudgetForge backup before replacing this workspace. A recovery copy is created automatically.</p>
      <input ref={inputRef} type="file" accept="application/json,.json" onChange={importData} className="sr-only" />
      <Button onClick={() => inputRef.current?.click()} leftIcon={<CloudDownload size={18} aria-hidden="true" />}>Choose backup</Button>
      {recovery && <Button variant="secondary" onClick={() => setRecoveryOpen(true)} leftIcon={<History size={18} aria-hidden="true" />}>Restore previous workspace</Button>}
      {error && <p className="cloud-message cloud-message--error" role="alert">{error}</p>}

      <Modal
        open={Boolean(preview)}
        onClose={() => !restoring && setPreview(null)}
        title="Review backup before restoring"
        description="Restoring replaces the current workspace. BudgetForge saves the current workspace as a local recovery copy first."
        footer={<><Button variant="secondary" onClick={() => setPreview(null)} disabled={restoring}>Cancel</Button><Button onClick={applyRestore} loading={restoring} data-autofocus>Restore backup</Button></>}
      >
        {preview && <div className="backup-preview" aria-label="Backup contents">
          <dl>
            <div><dt>Schema version</dt><dd>{preview.schemaVersion}</dd></div>
            <div><dt>Exported</dt><dd>{new Date(preview.exportedAt).toLocaleString("en-US")}</dd></div>
            <div><dt>Bills</dt><dd>{preview.bills}</dd></div>
            <div><dt>Savings goals</dt><dd>{preview.savingsGoals}</dd></div>
            <div><dt>Debts</dt><dd>{preview.debts}</dd></div>
            <div><dt>Budget categories</dt><dd>{preview.budgetCategories}</dd></div>
            <div><dt>History coverage</dt><dd>{preview.historyMonths.length ? `${preview.historyMonths[0]} through ${preview.historyMonths.at(-1)}` : "No recorded history"}</dd></div>
            <div><dt>Preferences</dt><dd>{preview.preferences.join(", ")}</dd></div>
          </dl>
          {preview.migratedLegacy && <p className="backup-preview__notice">This legacy backup will be safely migrated to schema version 2.</p>}
        </div>}
      </Modal>

      <Modal
        open={recoveryOpen}
        onClose={() => !restoring && setRecoveryOpen(false)}
        title="Restore previous workspace"
        description="This replaces the current workspace with the copy saved immediately before the latest successful import."
        footer={<><Button variant="secondary" onClick={() => setRecoveryOpen(false)} disabled={restoring}>Cancel</Button><Button onClick={applyRecovery} loading={restoring} data-autofocus>Restore recovery copy</Button></>}
      >
        {recovery && <p>Recovery copy created {new Date(recovery.exportedAt).toLocaleString("en-US")}.</p>}
      </Modal>
    </div>
  );
}

export default ImportDataCard;
