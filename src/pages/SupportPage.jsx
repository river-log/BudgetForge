import { Link } from "react-router-dom";
import LegalPage, { SUPPORT_EMAIL } from "./LegalPage";

function SupportPage() {
  return <LegalPage title="BudgetForge Support" intro="Help with account access, synchronization, backups, and app use.">
    <section><h2>Contact</h2><p>Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Include the platform, app version shown in Settings or release documentation, and a description without passwords, magic links, tokens, or sensitive financial details. Responses are handled as availability permits; no guaranteed response time is promised.</p></section>
    <section><h2>Account and magic links</h2><p>Confirm the address is correct, check spam, open only the newest link on the device containing BudgetForge, and request another link if it expired. Guest mode remains available without sign-in.</p></section>
    <section><h2>Cloud sync</h2><p>Check the in-app connection notice and confirm the same account is used on each device. Offline edits remain local until connectivity returns. Sign-out clears account-owned data from that device.</p></section>
    <section><h2>Backup and restore</h2><p>Create a JSON backup in Settings and store it securely. Restore previews the file and creates a local recovery copy before replacement. Files above 5 MB or outside the supported schema are rejected.</p></section>
    <section><h2>Deletion and limitations</h2><p><Link to="/account-deletion">Review account-deletion instructions</Link>. BudgetForge is not a bank, emergency financial service, or source of professional advice. Native verified links depend on production domain association and signed builds.</p></section>
  </LegalPage>;
}
export default SupportPage;
