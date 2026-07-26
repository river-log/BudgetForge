# Native privacy and security notes

BudgetForge remains local-first. Capacitor adds no analytics, ads, tracking,
bank access, contacts, camera, location, microphone, or notification permission.
Optional Supabase synchronization behaves as it does on the web.

Android cleartext traffic is disabled with a restrictive network configuration.
iOS disallows arbitrary App Transport Security loads. Remote WebView navigation
is not enabled. Native external navigation is centralized behind an HTTPS
BudgetForge-domain allowlist.

Backup export writes JSON temporarily to app cache, opens the system share
sheet, then removes the temporary file. Import uses the OS chooser through the
existing HTML input, enforces a 5 MB limit, validates and previews the backup,
and creates a recovery copy before replacement.

App-switcher screenshot masking is intentionally deferred pending a native
privacy-screen design and device validation. Store disclosures should cover
local financial data, optional cloud sync, user-initiated backup sharing, and
the absence of tracking.

Submission inventories are maintained in `APP_STORE_PRIVACY.md`,
`PLAY_DATA_SAFETY.md`, `ANDROID_PERMISSIONS.md`, and `IOS_DECLARATIONS.md`.
