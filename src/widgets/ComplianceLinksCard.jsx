import { ExternalLink, ShieldCheck } from "lucide-react";
import { openExternalUrl } from "../native/externalLinks";
import { complianceLinks } from "./complianceLinks";

function ComplianceLinksCard() {
  return (
    <div className="widget settings-card">
      <ShieldCheck size={28} aria-hidden="true" />
      <h2>Legal and support</h2>
      <p className="text-muted">Review BudgetForge policies or get help.</p>
      <div className="cloud-actions">
        {complianceLinks.map(([label, url]) => <button type="button" className="secondary-button" key={url} onClick={() => openExternalUrl(url)}>{label}<ExternalLink size={16} aria-hidden="true" /></button>)}
      </div>
    </div>
  );
}

export default ComplianceLinksCard;
