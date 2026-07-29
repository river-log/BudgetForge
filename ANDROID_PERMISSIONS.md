# Android permission audit

Configured SDK levels: compile 36, target 36, minimum 24.

The app manifest retains `android.permission.INTERNET` for Supabase
authentication, HTTPS cloud sync, and trusted external resources. The official
Capacitor Network plugin contributes `ACCESS_NETWORK_STATE` in the merged
manifest to report connectivity. Both are normal permissions with no runtime
prompt.

No storage, notification, camera, microphone, contacts, location, advertising
ID, foreground service, biometric, broad file access, or package-visibility
permission is declared. Backup import uses the system chooser/WebView file
input; export uses app cache plus the system share sheet.

Android operating-system backup is disabled because the WebView workspace may
contain locally stored financial information. Users retain control through
BudgetForge's explicit backup export and recovery workflow.

Cleartext traffic remains disabled, exported activity state is explicit, and
the FileProvider is non-exported. Run `gradlew.bat
processDebugMainManifest` and inspect the merged manifest after installing JDK
21 and Android SDK 36.

Android 16 considerations for BudgetForge include enforced edge-to-edge/safe
areas, large-screen/resizing behavior, predictive Back integration, and any
WebView behavior changes. Device testing must cover those items; no security
compatibility flags were weakened.

