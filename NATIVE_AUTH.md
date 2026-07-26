# Native authentication

Native email-link sign-in uses Supabase PKCE. Browser sign-in retains the
existing web flow. The app accepts only:

- `com.budgetforge.app://auth/callback`
- `https://budget-forge.com/auth/callback`

Callback parsing rejects other schemes, hosts, and paths, extracts only the
one-time code, and never logs links, codes, sessions, or tokens. Cold and warm
callbacks use the official Capacitor App plugin. Failures appear in Cloud Sync.

Add both URLs to the Supabase Authentication redirect allowlist. Keep the
production site URL at `https://budget-forge.com`; never ship a service-role key.

Verified HTTPS links additionally require deployment-owned files:

- Android: publish `/.well-known/assetlinks.json` for package
  `com.budgetforge.app` and the release certificate SHA-256 fingerprint.
- iOS: publish `/.well-known/apple-app-site-association` with the Apple Team ID,
  bundle ID, and `/auth/callback`.

Until signing identities and those files are configured, use the custom-scheme
callback. Test cold/warm launch, expired/reused links, cancellation, offline
callback, sign-out, and account isolation on physical devices.

Account deletion uses a separate authenticated Edge Function. Its service-role
secret exists only in Supabase's server environment; the client never supplies
a target user ID.
