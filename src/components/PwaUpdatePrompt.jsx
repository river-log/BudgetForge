import { RefreshCw } from "lucide-react";
import usePwaUpdate from "../hooks/usePwaUpdate";

function PwaUpdatePrompt() {
  const update = usePwaUpdate();
  if (!update.updateAvailable) return null;
  return <div className="connection-notice connection-notice--update" role="status">
    <RefreshCw size={18} aria-hidden="true" />
    <span>{update.deferredForEditing ? "Finish or cancel your form changes before updating." : "A new BudgetForge version is ready."}</span>
    <button type="button" onClick={update.updateNow}>Update Now</button>
  </div>;
}
export default PwaUpdatePrompt;
