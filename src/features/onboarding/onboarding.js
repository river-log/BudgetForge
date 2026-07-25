import { CLOUD_STORAGE_KEYS } from "../cloud/cloudStorage";

export const ONBOARDING_KEY = "budgetforge-onboarding-complete";

export function shouldShowOnboarding() {
  if (localStorage.getItem(ONBOARDING_KEY)) return false;
  return CLOUD_STORAGE_KEYS.every((key) => localStorage.getItem(key) === null);
}

export function completeOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, "true");
}
