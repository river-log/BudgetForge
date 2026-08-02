import { useEffect, useState } from "react";
import { CheckCircle2, Download, Share, WifiOff } from "lucide-react";
import { Badge, Button } from "../../ui";
import useInstallPrompt from "../../hooks/useInstallPrompt";
import { APP_VERSION } from "../../config/version";

function offlineStatus() {
  if (!("serviceWorker" in navigator)) return "Offline support unavailable in this browser";
  return navigator.serviceWorker.controller
    ? "Offline support active for previously loaded features"
    : "Offline support prepares after the first successful online load";
}

function InstallAppCard() {
  const installPrompt = useInstallPrompt();
  const [showIOSGuidance, setShowIOSGuidance] = useState(() => !installPrompt.dismissed);
  const [offline, setOffline] = useState(offlineStatus);

  useEffect(() => {
    function updateOfflineStatus() { setOffline(offlineStatus()); }
    navigator.serviceWorker?.addEventListener("controllerchange", updateOfflineStatus);
    return () => navigator.serviceWorker?.removeEventListener("controllerchange", updateOfflineStatus);
  }, []);

  async function install() {
    const choice = await installPrompt.install();
    if (choice?.outcome === "dismissed") installPrompt.dismiss();
  }

  const status = installPrompt.installed ? "Installed" : installPrompt.canPrompt ? "Ready to install" : installPrompt.ios ? "Manual installation" : "Browser-managed installation";
  const tone = installPrompt.installed ? "success" : installPrompt.canPrompt ? "info" : "default";

  return <div className="widget settings-card app-install-card">
    <div className="settings-card__heading"><Download size={28} aria-hidden="true" /><Badge variant={tone} size="sm">{status}</Badge></div>
    <h2>App Installation</h2>
    <p className="text-muted">Install BudgetForge for a focused standalone window while keeping the same local and optional cloud data behavior.</p>
    <dl className="app-install-status">
      <div><dt>Install status</dt><dd><CheckCircle2 size={16} aria-hidden="true" />{status}</dd></div>
      <div><dt>Offline readiness</dt><dd><WifiOff size={16} aria-hidden="true" />{offline}</dd></div>
      <div><dt>App version</dt><dd>v{APP_VERSION}</dd></div>
    </dl>
    {installPrompt.canPrompt && <div className="settings-actions"><Button onClick={install} leftIcon={<Download size={18} aria-hidden="true" />}>Install BudgetForge</Button><Button variant="secondary" onClick={installPrompt.dismiss}>Not now</Button></div>}
    {!installPrompt.installed && installPrompt.ios && showIOSGuidance && <div className="ios-install-guidance" role="note"><Share size={20} aria-hidden="true" /><div><strong>Install on iPhone or iPad</strong><p>Tap Share, then Add to Home Screen.</p><Button size="sm" variant="secondary" onClick={() => { installPrompt.dismiss(); setShowIOSGuidance(false); }}>Dismiss</Button></div></div>}
    {!installPrompt.installed && installPrompt.ios && !showIOSGuidance && <Button size="sm" variant="secondary" onClick={() => setShowIOSGuidance(true)}>Show iPhone/iPad instructions</Button>}
    {!installPrompt.installed && !installPrompt.canPrompt && !installPrompt.ios && <p className="app-install-help">If installation is available, use your browser’s app or install menu. Some browsers do not expose an in-page install button.</p>}
  </div>;
}
export default InstallAppCard;
