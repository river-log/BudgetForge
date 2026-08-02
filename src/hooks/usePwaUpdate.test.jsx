import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import usePwaUpdate, { formHasUnsavedInput } from "./usePwaUpdate";
import { PWA_UPDATE_EVENT } from "../pwa/serviceWorker";

describe("PWA update behavior", () => {
  it("detects unsaved form controls", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    form.appendChild(input);
    expect(formHasUnsavedInput(form)).toBe(false);
    input.value = "changed";
    expect(formHasUnsavedInput(form)).toBe(true);
  });

  it("announces and activates an update when no form edit is pending", () => {
    const environment = new EventTarget();
    const documentTarget = new EventTarget();
    const postMessage = vi.fn();
    Object.assign(environment, {
      document: documentTarget,
      navigator: { serviceWorker: { addEventListener: vi.fn() } },
      location: { reload: vi.fn() },
    });
    const registration = { waiting: { postMessage } };
    const { result } = renderHook(() => usePwaUpdate(environment));
    act(() => environment.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT, { detail: { registration } })));
    expect(result.current.updateAvailable).toBe(true);
    act(() => result.current.updateNow());
    expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  });
});
