import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { Button, Modal } from "../../ui";
import { dismissInstall, isInstallDismissed, isIOS, isStandalone } from "./install";
import { isNativePlatform } from "../../native/platform";

function InstallAppCard() {
  const [installEvent, setInstallEvent] = useState(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => isInstallDismissed());
  const standalone = isStandalone();
  const ios = isIOS();

  useEffect(() => {
    function capturePrompt(event) {
      event.preventDefault();
      setInstallEvent(event);
    }
    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
  }, []);

  if (isNativePlatform() || standalone || dismissed || (!installEvent && !ios)) return null;

  function dismiss() {
    dismissInstall();
    setDismissed(true);
    setInstructionsOpen(false);
  }

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallEvent(null);
      if (choice.outcome !== "accepted") dismiss();
      return;
    }
    setInstructionsOpen(true);
  }

  return (
    <div className="widget settings-card">
      <Download size={28} aria-hidden="true" />
      <h2>Install BudgetForge</h2>
      <p className="text-muted">Open BudgetForge from your home screen in a focused app window. Your existing local and cloud data behavior stays the same.</p>
      <Button onClick={install} leftIcon={<Download size={18} aria-hidden="true" />}>Install app</Button>
      <Button variant="secondary" onClick={dismiss}>Not now</Button>
      <Modal
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        title="Add BudgetForge to your Home Screen"
        description="In Safari, use the Share menu and choose Add to Home Screen."
        size="sm"
        footer={<><Button variant="secondary" onClick={dismiss}>Not now</Button><Button onClick={() => setInstructionsOpen(false)} data-autofocus>Done</Button></>}
      >
        <p className="install-instruction"><Share size={20} aria-hidden="true" /> Tap Share, scroll if needed, then select <strong>Add to Home Screen</strong>.</p>
      </Modal>
    </div>
  );
}

export default InstallAppCard;
