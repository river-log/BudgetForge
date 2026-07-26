import { isNativePlatform } from "./platform";

export const NATIVE_AUTH_CALLBACK = "com.budgetforge.app://auth/callback";
export const WEB_AUTH_CALLBACK = "https://budget-forge.com/auth/callback";

export function getAuthRedirectUrl() {
  return isNativePlatform() ? NATIVE_AUTH_CALLBACK : window.location.origin;
}

export function parseNativeAuthCallback(value) {
  try {
    const url = new URL(value);
    const custom = url.protocol === "com.budgetforge.app:" && url.hostname === "auth" && url.pathname === "/callback";
    const universal = url.protocol === "https:" && url.hostname === "budget-forge.com" && url.pathname === "/auth/callback";
    if (!custom && !universal) return null;
    const code = url.searchParams.get("code");
    return code ? { code } : { error: "The sign-in link is incomplete. Request a new link and try again." };
  } catch {
    return null;
  }
}
