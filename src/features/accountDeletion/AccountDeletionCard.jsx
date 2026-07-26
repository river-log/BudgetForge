import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, Modal } from "../../ui";
import useCloudSync from "../cloud/useCloudSync";
import { ACCOUNT_DELETION_PHRASE, canConfirmAccountDeletion } from "./accountDeletion";

function AccountDeletionCard() {
  const cloud = useCloudSync();
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!cloud.session) return null;

  async function confirmDeletion() {
    if (!canConfirmAccountDeletion(phrase, busy)) return;
    setBusy(true);
    setError("");
    const result = await cloud.deleteAccount();
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
    }
  }

  function close() {
    if (busy) return;
    setOpen(false);
    setPhrase("");
    setError("");
  }

  return (
    <div className="widget settings-card">
      <Trash2 size={28} aria-hidden="true" />
      <h2>Delete account</h2>
      <p className="text-muted">Permanently delete your cloud account and its synchronized financial workspace.</p>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete account</Button>
      <Modal
        open={open}
        onClose={close}
        title="Permanently delete your account?"
        description="This cannot be undone."
        footer={<><Button variant="secondary" onClick={close} disabled={busy}>Cancel</Button><Button variant="danger" onClick={confirmDeletion} disabled={!canConfirmAccountDeletion(phrase, busy)} loading={busy}>Delete permanently</Button></>}
      >
        <p>Your Supabase account, synchronized bills, budgets, savings, debts, histories, and account-associated data on this device will be deleted.</p>
        <p>Backups you previously saved outside BudgetForge remain under your control. Device-only installation preferences may remain.</p>
        <label htmlFor="delete-account-confirmation">Type <strong>{ACCOUNT_DELETION_PHRASE}</strong> to confirm</label>
        <input id="delete-account-confirmation" value={phrase} onChange={(event) => setPhrase(event.target.value)} autoComplete="off" disabled={busy} />
        {error && <p className="cloud-message cloud-message--error" role="alert">{error}</p>}
      </Modal>
    </div>
  );
}

export default AccountDeletionCard;
