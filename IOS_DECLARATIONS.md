# iOS declarations and privacy manifests

- Bundle ID: `com.budgetforge.app`; display name: BudgetForge.
- URL scheme: `com.budgetforge.app`, limited in app code to `/auth/callback`.
- Associated Domain: `applinks:budget-forge.com`; hosted AASA and Apple Team ID
  remain release prerequisites.
- ATS arbitrary loads are disabled.
- No background modes, queried URL schemes, document sharing, or
  privacy-sensitive usage-description strings are declared.
- No camera, microphone, contacts, location, notifications, or tracking
  capability is requested.

Capacitor and CapacitorCordova each supply an empty `PrivacyInfo.xcprivacy`
declaring no collection/tracking or required-reason API use. The installed
official plugins do not contain additional manifests in their packages. The app
contains no custom Swift required-reason API calls, so no speculative app
manifest or reason code was added. LocalStorage runs inside WebKit and native
backup file operations are implemented by Capacitor Filesystem; an Xcode
archive privacy report must confirm whether the resolved frameworks require
additional declarations. Do not invent reason codes.

App Store Connect must answer the standard export-compliance encryption
questions. BudgetForge uses platform HTTPS/TLS and does not implement custom
cryptography; confirm the applicable exemption in App Store Connect rather than
hard-coding an unsupported declaration.

