import { Link } from "react-router-dom";

export const POLICY_EFFECTIVE_DATE = "July 26, 2026";
export const SUPPORT_EMAIL = "support@budget-forge.com";

function LegalPage({ title, intro, children, reviewNotice = false }) {
  return (
    <article className="workspace-page legal-page">
      <header className="workspace-header">
        <div><h1>{title}</h1><p>{intro}</p></div>
      </header>
      <p className="text-muted">Effective: {POLICY_EFFECTIVE_DATE}</p>
      {reviewNotice && <p><strong>Legal review notice:</strong> This document is prepared for product release review and has not been represented as attorney-approved.</p>}
      {children}
      <footer>
        <p>Questions: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
        <nav aria-label="Policy links"><Link to="/privacy">Privacy</Link>{" · "}<Link to="/terms">Terms</Link>{" · "}<Link to="/support">Support</Link>{" · "}<Link to="/account-deletion">Account deletion</Link></nav>
      </footer>
    </article>
  );
}

export default LegalPage;
