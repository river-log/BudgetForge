# Capacitor setup

BudgetForge uses Capacitor 8 with app ID `com.budgetforge.app`, display name
`BudgetForge`, and Vite output from `dist`. The committed `android/` and `ios/`
projects contain intentional security, deep-link, and branded-asset changes.

## Requirements

- Node.js and `npm install`
- Android Studio with JDK 21 and Android SDK Platform 36 for Android work
- macOS with current Xcode for iOS work

```bash
npm run cap:sync
npm run cap:android
```

On macOS, `npm run cap:ios` opens the Xcode project. Production builds serve
bundled `dist` files, not a development-server URL.

Before release, configure signing and native version numbers, complete
`NATIVE_AUTH.md`, run all validation, synchronize Capacitor, and execute the
manual device matrix in `MOBILE_READINESS.md`. After sync, verify intentional
manifest, plist, entitlement, security-config, and branded-asset edits.

Use separately managed deployments of the same public `VITE_SUPABASE_*` values
for web development, web production, native development, and native production.
Never commit a live-reload `server.url`.
