export const INSTALL_DISMISSED_KEY = "budgetforge-install-dismissed-at-v1";
export const INSTALL_DISMISS_DAYS = 30;

export function isStandalone(environment = globalThis) {
  return Boolean(
    environment.navigator?.standalone
    || environment.matchMedia?.("(display-mode: standalone)")?.matches
  );
}

export function isIOS(environment = globalThis) {
  const agent = environment.navigator?.userAgent || "";
  const modernIPad = /Macintosh/.test(agent) && Number(environment.navigator?.maxTouchPoints) > 1;
  return (/iPad|iPhone|iPod/.test(agent) || modernIPad) && !environment.MSStream;
}

export function isInstallDismissed(storage = localStorage, now = Date.now()) {
  const dismissedAt = Number(storage.getItem(INSTALL_DISMISSED_KEY));
  return Number.isFinite(dismissedAt) && dismissedAt > 0 && now - dismissedAt < INSTALL_DISMISS_DAYS * 86400000;
}

export function dismissInstall(storage = localStorage, now = Date.now()) {
  storage.setItem(INSTALL_DISMISSED_KEY, String(now));
}
