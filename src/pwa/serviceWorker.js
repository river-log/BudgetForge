import { isNativePlatform } from "../native/platform";

export const PWA_UPDATE_EVENT = "budgetforge:pwa-update";

export function canRegisterServiceWorker(environment = globalThis) {
  return !isNativePlatform() && Boolean(environment.isSecureContext && environment.navigator?.serviceWorker);
}

export async function registerServiceWorker(environment = globalThis) {
  if (!canRegisterServiceWorker(environment)) return null;
  const registration = await environment.navigator.serviceWorker.register("/sw.js", { scope: "/" });

  function announceUpdate(worker) {
    if (!worker) return;
    worker.addEventListener("statechange", () => {
      if (worker.state === "installed" && environment.navigator.serviceWorker.controller) {
        environment.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT, { detail: { registration } }));
      }
    });
  }

  if (registration.waiting && environment.navigator.serviceWorker.controller) {
    environment.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT, { detail: { registration } }));
  }
  registration.addEventListener("updatefound", () => announceUpdate(registration.installing));
  return registration;
}

export function activateServiceWorkerUpdate(registration) {
  registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
}
