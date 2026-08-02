import { useCallback, useEffect, useState } from "react";
import { dismissInstall, isInstallDismissed, isIOS, isStandalone } from "../features/pwa/install";
import { isNativePlatform } from "../native/platform";

export default function useInstallPrompt(environment = globalThis) {
  const [installEvent, setInstallEvent] = useState(null);
  const [installed, setInstalled] = useState(() => isNativePlatform() || isStandalone(environment));
  const [dismissed, setDismissed] = useState(() => isInstallDismissed(environment.localStorage));
  const ios = isIOS(environment);

  useEffect(() => {
    function capturePrompt(event) {
      event.preventDefault();
      setInstallEvent(event);
    }
    function handleInstalled() {
      setInstalled(true);
      setInstallEvent(null);
    }
    environment.addEventListener?.("beforeinstallprompt", capturePrompt);
    environment.addEventListener?.("appinstalled", handleInstalled);
    return () => {
      environment.removeEventListener?.("beforeinstallprompt", capturePrompt);
      environment.removeEventListener?.("appinstalled", handleInstalled);
    };
  }, [environment]);

  const install = useCallback(async () => {
    if (!installEvent) return { outcome: "unavailable" };
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice?.outcome === "accepted") setInstalled(true);
    return choice;
  }, [installEvent]);

  const dismiss = useCallback(() => {
    dismissInstall(environment.localStorage);
    setDismissed(true);
  }, [environment]);

  return {
    installed,
    ios,
    dismissed,
    canPrompt: Boolean(installEvent) && !installed,
    install,
    dismiss,
  };
}
