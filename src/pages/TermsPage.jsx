import LegalPage from "./LegalPage";

function TermsPage() {
  return <LegalPage title="Terms of Use" intro="Terms governing use of the BudgetForge application." reviewNotice>
    <section><h2>Eligibility and acceptable use</h2><p>You must be legally able to agree to these terms. Do not misuse the service, attempt unauthorized access, interfere with other users, upload unlawful content, or reverse engineer protected service components except where law permits.</p></section>
    <section><h2>Your data and account</h2><p>You are responsible for the accuracy of information you enter, access to your email account and devices, and maintaining appropriate independent backups. Do not enter information you lack permission to process.</p></section>
    <section><h2>No professional advice or outcomes</h2><p>BudgetForge is an organizational tool, not a bank or financial adviser. It provides no financial, legal, tax, or investment advice and does not guarantee savings, debt repayment, or other financial outcomes.</p></section>
    <section><h2>Availability and changes</h2><p>Features may change, become unavailable, or contain errors. Access may be limited to protect users, comply with law, or address misuse. Accounts may be terminated for material prohibited use, subject to applicable law.</p></section>
    <section><h2>Intellectual property and responsibility</h2><p>BudgetForge and its original branding and software are protected by applicable intellectual-property laws. To the extent permitted by law, the service is provided without guarantees beyond those that cannot legally be excluded, and liability is limited to direct losses reasonably attributable to the product.</p></section>
  </LegalPage>;
}
export default TermsPage;
