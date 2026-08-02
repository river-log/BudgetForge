import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useInstallPrompt from "./useInstallPrompt";

describe("useInstallPrompt", () => {
  beforeEach(() => localStorage.clear());

  it("captures the browser prompt and records acceptance", async () => {
    const prompt = vi.fn();
    const event = new Event("beforeinstallprompt");
    Object.defineProperties(event, {
      prompt: { value: prompt },
      userChoice: { value: Promise.resolve({ outcome: "accepted" }) },
    });
    const { result } = renderHook(() => useInstallPrompt());
    act(() => window.dispatchEvent(event));
    expect(result.current.canPrompt).toBe(true);
    await act(() => result.current.install());
    expect(prompt).toHaveBeenCalledOnce();
    expect(result.current.installed).toBe(true);
    expect(result.current.canPrompt).toBe(false);
  });

  it("tracks dismissal without removing installation status", () => {
    const { result } = renderHook(() => useInstallPrompt());
    act(() => result.current.dismiss());
    expect(result.current.dismissed).toBe(true);
    expect(localStorage.getItem("budgetforge-install-dismissed-at-v1")).toBeTruthy();
  });
});
