import { Network } from "@capacitor/network";
import { isNativePlatform } from "./platform";

export async function getConnectionStatus() {
  if (isNativePlatform()) return Network.getStatus();
  return { connected: navigator.onLine, connectionType: navigator.onLine ? "unknown" : "none" };
}

export function watchConnectionStatus(listener) {
  if (isNativePlatform()) {
    let handle;
    Network.addListener("networkStatusChange", listener).then((nextHandle) => { handle = nextHandle; });
    return () => handle?.remove();
  }
  const online = () => listener({ connected: true, connectionType: "unknown" });
  const offline = () => listener({ connected: false, connectionType: "none" });
  window.addEventListener("online", online);
  window.addEventListener("offline", offline);
  return () => {
    window.removeEventListener("online", online);
    window.removeEventListener("offline", offline);
  };
}

