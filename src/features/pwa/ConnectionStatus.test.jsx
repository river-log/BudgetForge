import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import CloudSyncContext from "../cloud/CloudSyncContext";
import ConnectionStatus from "./ConnectionStatus";

function renderStatus(session = null) {
  return render(<CloudSyncContext.Provider value={{ session }}><ConnectionStatus /></CloudSyncContext.Provider>);
}

describe("connection status", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
  });

  it("shows guest-safe offline messaging and clears it online", () => {
    renderStatus();
    act(() => {
      Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByText(/Local Storage data remains on this device/)).toBeInTheDocument();
    act(() => {
      Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.queryByText(/Local Storage data remains on this device/)).not.toBeInTheDocument();
    expect(screen.getByText("Connection restored.")).toBeInTheDocument();
  });

  it("explains pending local changes for signed-in users", () => {
    renderStatus({ user: { id: "user-a" } });
    act(() => {
      Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByText(/Cloud sync will resume after reconnection/)).toBeInTheDocument();
  });
});

