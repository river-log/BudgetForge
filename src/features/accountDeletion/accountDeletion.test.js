import { describe, expect, it, vi } from "vitest";
import { canConfirmAccountDeletion, executeAccountDeletion } from "./accountDeletion";

describe("account deletion", () => {
  it("requires the exact phrase and rejects submission while busy", () => {
    expect(canConfirmAccountDeletion("delete")).toBe(false);
    expect(canConfirmAccountDeletion("DELETE")).toBe(true);
    expect(canConfirmAccountDeletion("DELETE", true)).toBe(false);
  });

  it("stops sync and clears local data only after server success", async () => {
    const order = [];
    const result = await executeAccountDeletion({
      stopSync: () => order.push("stop"),
      invoke: async () => { order.push("server"); return { error: null }; },
      clearLocal: () => order.push("clear"),
      endLocalSession: async () => order.push("session"),
      reload: () => order.push("reload"),
    });
    expect(result.error).toBeNull();
    expect(order).toEqual(["stop", "server", "clear", "session", "reload"]);
  });

  it("preserves local data and reports server failure", async () => {
    const clearLocal = vi.fn();
    const error = new Error("partial server failure");
    const result = await executeAccountDeletion({
      stopSync: vi.fn(),
      invoke: async () => ({ error }),
      clearLocal,
      endLocalSession: vi.fn(),
      reload: vi.fn(),
    });
    expect(result.error).toBe(error);
    expect(clearLocal).not.toHaveBeenCalled();
  });
});
