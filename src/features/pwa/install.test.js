import { beforeEach, describe, expect, it } from "vitest";
import { INSTALL_DISMISS_DAYS, dismissInstall, isInstallDismissed, isIOS, isStandalone } from "./install";

describe("PWA installation eligibility", () => {
  beforeEach(() => localStorage.clear());

  it("detects browser and iOS standalone modes", () => {
    expect(isStandalone({ navigator: { standalone: true } })).toBe(true);
    expect(isStandalone({ navigator: {}, matchMedia: () => ({ matches: true }) })).toBe(true);
    expect(isStandalone({ navigator: {}, matchMedia: () => ({ matches: false }) })).toBe(false);
    expect(isIOS({ navigator: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS)" } })).toBe(true);
    expect(isIOS({ navigator: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)", maxTouchPoints: 5 } })).toBe(true);
    expect(isIOS({ navigator: { userAgent: "Mozilla/5.0 (Linux; Android 15)" } })).toBe(false);
  });

  it("suppresses a dismissed prompt for 30 days", () => {
    const now = Date.UTC(2026, 6, 26);
    dismissInstall(localStorage, now);
    expect(isInstallDismissed(localStorage, now + 10 * 86400000)).toBe(true);
    expect(isInstallDismissed(localStorage, now + INSTALL_DISMISS_DAYS * 86400000)).toBe(false);
  });
});
