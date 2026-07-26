export function getBackAction({ hasOverlay, pathname, historyLength }) {
  if (hasOverlay) return "close-overlay";
  if (pathname !== "/" && historyLength > 1) return "history-back";
  return "stay";
}

