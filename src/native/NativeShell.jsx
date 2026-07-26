import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { getBackAction } from "./backButton";
import { isNativePlatform, nativePlatform } from "./platform";

function NativeShell() {
  useEffect(() => {
    if (!isNativePlatform()) return undefined;
    let active = true;
    const handles = [];
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    StatusBar.setStyle({ style: dark ? Style.Light : Style.Dark }).catch(() => {});
    if (nativePlatform() === "android") StatusBar.setBackgroundColor({ color: dark ? "#0f172a" : "#f8fafc" }).catch(() => {});
    SplashScreen.hide().catch(() => {});

    CapacitorApp.addListener("backButton", () => {
      const hasOverlay = Boolean(document.querySelector('[role="dialog"], .mobile-drawer'));
      const action = getBackAction({ hasOverlay, pathname: window.location.pathname, historyLength: window.history.length });
      if (action === "close-overlay") window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      if (action === "history-back") window.history.back();
    }).then((handle) => active ? handles.push(handle) : handle.remove());

    return () => {
      active = false;
      handles.forEach((handle) => handle.remove());
    };
  }, []);
  return null;
}

export default NativeShell;
