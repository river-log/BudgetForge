import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { canRegisterServiceWorker, registerServiceWorker } from "./serviceWorker";

describe("service worker strategy", () => {
  it("registers only in a secure supported environment", async () => {
    expect(canRegisterServiceWorker({ isSecureContext: false, navigator: {} })).toBe(false);
    const registration = { waiting: null, installing: null, addEventListener: vi.fn() };
    const environment = {
      isSecureContext: true,
      navigator: { serviceWorker: { controller: null, register: vi.fn().mockResolvedValue(registration) } },
      dispatchEvent: vi.fn(),
    };
    await registerServiceWorker(environment);
    expect(environment.navigator.serviceWorker.register).toHaveBeenCalledWith("/sw.js", { scope: "/" });
    expect(registration.addEventListener).toHaveBeenCalledWith("updatefound", expect.any(Function));
  });

  it("defines conservative navigation caching and API/auth exclusions", () => {
    const source = fs.readFileSync(path.resolve("public/sw.js"), "utf8");
    expect(source).toContain('request.method !== "GET"');
    expect(source).toContain('request.mode === "navigate"');
    expect(source).toContain("caches.match(SHELL_URL)");
    expect(source).toContain("caches.match(OFFLINE_URL)");
    expect(source).toContain("...BUILD_ASSETS");
    expect(source).toContain('".supabase.co"');
    expect(source).toContain('"access_token"');
    expect(source).toContain('key.startsWith("budgetforge-")');
  });
});

