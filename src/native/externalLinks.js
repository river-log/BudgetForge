import { Browser } from "@capacitor/browser";
import { isNativePlatform } from "./platform";

const TRUSTED_HOSTS = new Set(["budget-forge.com", "www.budget-forge.com"]);

export function isTrustedExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && TRUSTED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export async function openExternalUrl(value) {
  if (!isTrustedExternalUrl(value)) throw new Error("BudgetForge blocked an untrusted external link.");
  if (isNativePlatform()) return Browser.open({ url: value });
  window.open(value, "_blank", "noopener,noreferrer");
}

