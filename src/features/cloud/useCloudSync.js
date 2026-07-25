import { useContext } from "react";
import CloudSyncContext from "./CloudSyncContext";

export default function useCloudSync() {
  const context = useContext(CloudSyncContext);

  if (!context) {
    throw new Error(
      "useCloudSync must be used inside CloudSyncProvider."
    );
  }

  return context;
}
