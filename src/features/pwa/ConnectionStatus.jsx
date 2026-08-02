import { useEffect, useState } from "react";
import { CloudOff } from "lucide-react";
import useCloudSync from "../cloud/useCloudSync";
import { getConnectionStatus, watchConnectionStatus } from "../../native/connectivity";
import PwaUpdatePrompt from "../../components/PwaUpdatePrompt";

function ConnectionStatus() {
  const cloud = useCloudSync();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    function handleStatus(status) {
      setOnline(status.connected);
      setAnnouncement(status.connected
        ? (cloud.session ? "Connection restored. Cloud sync will resume." : "Connection restored.")
        : "BudgetForge is offline.");
    }
    getConnectionStatus().then(handleStatus);
    const stopWatching = watchConnectionStatus(handleStatus);
    return () => {
      stopWatching();
    };
  }, [cloud.session]);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      {!online && <div className="connection-notice" role="status">
        <CloudOff size={18} aria-hidden="true" />
        <span><strong>BudgetForge is offline.</strong> Previously loaded features may remain available. Cloud and other network-only resources cannot load. Local Storage data remains on this device.{cloud.session ? " Cloud sync will resume after reconnection." : ""}</span>
      </div>}
      <PwaUpdatePrompt />
    </>
  );
}

export default ConnectionStatus;
