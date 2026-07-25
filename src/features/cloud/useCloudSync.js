import { useContext } from "react";
import CloudSyncContext from "./CloudSyncContext";

export default function useCloudSync() {
  return useContext(CloudSyncContext);
}
