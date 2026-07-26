# BudgetForge Mobile and PWA Readiness

## Current web and native capabilities

BudgetForge is an installable, root-scoped web app with production PNG and SVG
icons, an Apple touch icon, standalone display metadata, route shortcuts, safe
area support, connection status, and a conservative service worker.

Capacitor 8 packages the same local-first workspace for Android and iOS. Native
builds disable service workers and web install prompts, use native connectivity,
lifecycle, status-bar, splash, keyboard, backup-sharing, and deep-link
capabilities, and preserve BrowserRouter and all existing routes.

## Installation

- Chromium browsers expose the browser-managed install prompt when supported.
- iPhone and iPad Safari users receive accurate Share → Add to Home Screen
  instructions.
- Install controls appear only in Settings, are hidden in standalone mode, and
  remain dismissed for 30 days after “Not now.”
- BudgetForge does not claim App Store or Play Store availability.

## Offline behavior

After one successful online visit, the service worker keeps the HTML shell,
manifest, brand icons, and previously requested fingerprinted JS/CSS assets.
Navigation is network-first with the cached app shell as the offline fallback.
Immutable Vite assets are cache-first.

The service worker:

- handles only GET requests;
- does not cache Supabase hosts, auth/magic-link query URLs, non-GET mutations,
  backup downloads, imported files, realtime connections, or cloud payloads;
- deletes older BudgetForge caches during activation;
- waits for explicit user approval before activating an available update.

Offline use continues against the existing local workspace. For signed-in
users, the offline notice states that changes remain on the device until cloud
sync resumes. BudgetForge does not claim a cloud write succeeded while offline
and does not use background sync.

## Connection and update status

Online state is visually quiet. Offline state appears as a compact text-and-icon
notice with an accessible live announcement. Guest wording describes local-only
availability; signed-in wording describes pending cloud synchronization.

When a new service worker is installed, BudgetForge shows a compact update
notice. Activating it reloads only after the browser reports the new worker is
controlling the page.

## Mobile layout

- The viewport uses `viewport-fit=cover` without disabling zoom.
- Safe-area insets protect the mobile header, drawer, page content, dialogs,
  command palette, onboarding, and toast region.
- `dvh` is used with `vh` fallbacks for browser compatibility.
- Mobile inputs use at least 16px text to avoid iOS focus zoom.
- Drawers and dialogs remain independently scrollable with constrained dynamic
  heights when the keyboard is open.
- Common mobile controls have practical 44px touch targets.
- Destructive confirmation remains separated from safe actions.
- Reduced-motion rules remain in force.

## Navigation and accessibility

The mobile drawer closes after navigation, Back/Forward route changes invalidate
an open drawer, background scrolling is locked, focus is trapped, Escape closes
it, and focus returns to the menu button.

Route changes update the document title, reset the main workspace scroll
position intentionally, and are announced through a polite live region.
`NavLink` continues to expose the current route with `aria-current`.

## Routing and Netlify

BrowserRouter remains appropriate for the web deployment. `public/_redirects`
rewrites all routes to `index.html`, so direct nested-route refreshes work on
Netlify. The manifest, icons, service worker, and canonical metadata assume
deployment at the origin root.

## Capacitor behavior

Native Back closes dialogs and navigation overlays first, returns through route
history second, and stays safely at the root. Browser notifications are
reported unavailable in native builds; no native notification permission is
requested. See `CAPACITOR_SETUP.md`, `NATIVE_AUTH.md`, and
`NATIVE_PRIVACY_NOTES.md`.

## Performance

Route-level lazy loading remains intact. Reports and Recharts remain isolated
from the initial route until requested. The hand-written service worker and
install/connectivity code avoid a large PWA dependency. Icons are compact PNGs;
the optional future-native launch PNG is not referenced by the web app shell.

Repeated page-local storage reads and the large shared chart chunk remain
measured follow-up opportunities, but no premature chart removal or rendering
rewrite was made.

## Manual mobile QA

Run `npm run dev` manually and verify:

- 320×568, 360×800, 390×844, 430×932, 768×1024, and desktop;
- portrait and landscape;
- iPhone Safari and installed Home Screen mode;
- Android Chrome and installed PWA mode;
- desktop Chrome and Edge;
- fresh online load and nested-route refresh;
- install prompt, dismissal, 30-day suppression, and standalone launch;
- offline launch after a prior visit;
- going offline while editing and cloud sync after reconnect;
- guest and signed-in wording;
- magic-link authentication;
- import preview and recovery restore with the keyboard open;
- bill deletion, command palette, mobile drawer, and Reports charts;
- light/dark appearance, 200% zoom, high contrast, and reduced motion.
