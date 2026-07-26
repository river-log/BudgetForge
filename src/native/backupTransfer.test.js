import { describe, expect, it } from "vitest";
import { MAX_BACKUP_FILE_BYTES, validateBackupFileSize } from "./backupTransfer";

describe("validateBackupFileSize", () => {
  it("allows bounded files and rejects oversized imports", () => {
    expect(() => validateBackupFileSize({ size: MAX_BACKUP_FILE_BYTES })).not.toThrow();
    expect(() => validateBackupFileSize({ size: MAX_BACKUP_FILE_BYTES + 1 })).toThrow(/5 MB/);
  });
});
