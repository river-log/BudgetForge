import { useEffect, useState } from "react";
import { CloudOff, RefreshCw } from "lucide-react";
import useCloudSync from "../cloud/useCloudSync";
import { activateServiceWorkerUpdate, PWA_UPDATE_EVENT } from "../../pwa/serviceWorker";
import { getConnectionStatus, watchConnectionStatus } from "../../native/connectivity";

function ConnectionStatus() {
  const cloud = useCloudSync();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [announcement, setAnnouncement] = useState("");
  const [updateRegistration, setUpdateRegistration] = useState(null);

  useEffect(() => {
    function handleStatus(status) {
      setOnline(status.connected);
      setAnnouncement(status.connected
        ? (cloud.session ? "Connection restored. Cloud sync will resume." : "Connection restored.")
        : "BudgetForge is offline.");
    }
    function handleUpdate(event) {
      setUpdateRegistration(event.detail.registration);
    }
    getConnectionStatus().then(handleStatus);
    const stopWatching = watchConnectionStatus(handleStatus);
    window.addEventListener(PWA_UPDATE_EVENT, handleUpdate);
    return () => {
      stopWatching();
      window.removeEventListener(PWA_UPDATE_EVENT, handleUpdate);
    };
  }, [cloud.session]);

  function applyUpdate() {
    navigator.serviceWorker?.addEventListener("controllerchange", () => window.location.reload(), { once: true });
    activateServiceWorkerUpdate(updateRegistration);
  }

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      {!online && <div className="connection-notice" role="status">
        <CloudOff size={18} aria-hidden="true" />
        <span><strong>Offline.</strong> {cloud.session ? "Changes stay on this device until cloud sync resumes." : "Your local workspace remains available on this device."}</span>
      </div>}
      {updateRegistration && <div className="connection-notice connection-notice--update" role="status">
        <RefreshCw size={18} aria-hidden="true" />
        <span>A BudgetForge update is ready.</span>
        <button type="button" onClick={applyUpdate}>Reload</button>
      </div>}
    </>
  );
}

export default ConnectionStatus;
