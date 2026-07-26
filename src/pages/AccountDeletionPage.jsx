import LegalPage, { SUPPORT_EMAIL } from "./LegalPage";

function AccountDeletionPage() {
  return <LegalPage title="Delete a BudgetForge Account" intro="Direct instructions for deleting your BudgetForge account and synchronized data.">
    <section><h2>Delete inside BudgetForge</h2><ol><li>Open Settings.</li><li>Choose Delete account.</li><li>Review what will be removed.</li><li>Type DELETE and confirm.</li></ol><p>The request deletes the authenticated Supabase account and synchronized financial row, then clears account-associated workspace, profile/preferences, restore recovery, and quarantined data from the current device.</p></section>
    <section><h2>If the app is unavailable</h2><p>Email <a href={`mailto:${SUPPORT_EMAIL}?subject=BudgetForge%20account%20deletion%20request`}>{SUPPORT_EMAIL}</a> from the address used for BudgetForge. State that you are requesting account deletion. Support will require reasonable verification that you control the account; do not send financial records, passwords, tokens, or magic links.</p></section>
    <section><h2>Timing and retained data</h2><p>In-app deletion is processed immediately when the service succeeds. Support requests are processed after identity verification as availability permits. BudgetForge does not intentionally retain the deleted Auth account or synchronized workspace. Backups previously exported to locations you selected, data on other offline devices, and infrastructure records that a processor must temporarily retain for security or legal obligations are not directly erased from this device.</p></section>
  </LegalPage>;
}
export default AccountDeletionPage;
