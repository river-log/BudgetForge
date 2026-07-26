import LegalPage from "./LegalPage";

function PrivacyPage() {
  return <LegalPage title="Privacy Policy" intro="How BudgetForge handles information in its local-first financial workspace.">
    <section><h2>Information and storage</h2><p>You may enter a profile name, bills, income, budgets, savings goals, debts, payment status, reminder preferences, and financial history. This information stays in local device storage unless you choose email-link sign-in and optional cloud synchronization. Signed-in accounts provide an email address and receive a Supabase user identifier.</p></section>
    <section><h2>How information is used</h2><p>BudgetForge processes information to provide calculations, reminders, reports, backup and restore, authentication, account isolation, and optional multi-device synchronization. It does not connect to bank accounts and does not provide financial, legal, tax, or investment advice.</p></section>
    <section><h2>Service providers and sharing</h2><p>Supabase processes authentication and synchronized workspace data for signed-in users. User-initiated backup export may send a JSON file to a destination the user selects. BudgetForge does not sell personal information and includes no advertising, analytics, or tracking SDK.</p></section>
    <section><h2>Retention and deletion</h2><p>Local information remains until it is cleared by the user, browser, operating system, restore workflow, account isolation, or account deletion. Cloud information remains while the account exists. In-app account deletion removes the Auth account and synchronized row, then clears account-associated data on the current device. Previously exported backups remain wherever the user stored them.</p></section>
    <section><h2>Security</h2><p>BudgetForge uses transport encryption, row-level access controls, strict callback allowlists, and local account isolation. No system can guarantee absolute security; users should protect their device, email account, and exported backups.</p></section>
    <section><h2>Children, choices, and changes</h2><p>BudgetForge is not directed to children under 13. Users can remain in guest mode, decline cloud sync, export backups, sign out, or delete an account. Material policy changes will be reflected here with a revised effective date.</p></section>
  </LegalPage>;
}
export default PrivacyPage;
