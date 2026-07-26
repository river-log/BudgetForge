import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { backupFile, downloadBackup } from "../utils/backup";
import { isNativePlatform } from "./platform";

export const MAX_BACKUP_FILE_BYTES = 5 * 1024 * 1024;

export function validateBackupFileSize(file) {
  if (Number(file?.size) > MAX_BACKUP_FILE_BYTES) {
    throw new Error("The selected backup is larger than the 5 MB safety limit.");
  }
}

export async function exportBackup() {
  const file = backupFile();
  if (!isNativePlatform()) {
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: "BudgetForge backup", text: "My BudgetForge backup", files: [file] });
        return "shared";
      } catch (error) {
        if (error.name === "AbortError") return "cancelled";
      }
    }
    downloadBackup(file);
    return "downloaded";
  }

  const path = file.name;
  await Filesystem.writeFile({
    path,
    data: await file.text(),
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
  });
  try {
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    await Share.share({ title: "BudgetForge backup", text: "My BudgetForge backup", url: uri, dialogTitle: "Save BudgetForge backup" });
    return "shared";
  } finally {
    await Filesystem.deleteFile({ path, directory: Directory.Cache }).catch(() => {});
  }
}

