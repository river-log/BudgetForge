import { useEffect, useState } from "react";
import { getConnectionStatus, watchConnectionStatus } from "./connectivity";

export function useConnectivity() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    let active = true;
    const update = (status) => active && setOnline(status.connected);
    getConnectionStatus().then(update);
    const stop = watchConnectionStatus(update);
    return () => {
      active = false;
      stop();
    };
  }, []);
  return online;
}
