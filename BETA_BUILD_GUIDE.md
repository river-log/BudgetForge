# Beta build guide

## Android

Install JDK 21 and Android Studio SDK Platform/API 36 plus current API 36 build
tools. Set `JAVA_HOME` and `ANDROID_HOME`, then run:

```powershell
java -version
sdkmanager --list_installed
cd android
.\gradlew.bat --version
.\gradlew.bat tasks
.\gradlew.bat assembleDebug
.\gradlew.bat bundleRelease
```

For local release signing, create a private upload keystore outside source
control and an ignored `android/keystore.properties` containing `storeFile`,
`storePassword`, `keyAlias`, and `keyPassword`. Do not commit it. The Gradle
release build uses it only when present. Minification remains disabled for the
first beta to reduce WebView/plugin regression risk. A generated AAB is not
store-ready until signing, Play inspection, runtime QA, and declarations pass.

## iOS

On macOS with a current Xcode, open `ios/App/App.xcodeproj`, select an Apple
Developer team with automatic signing, verify bundle ID/version/build and
Associated Domains, then Product → Archive. Review Organizer validation,
privacy-manifest and export-compliance warnings before choosing Distribute App
for TestFlight. Do not create or commit certificates/profiles here.

No development/live-reload `server.url` belongs in `capacitor.config.json`.
Production uses bundled `dist`. See `.env.example`, `NATIVE_AUTH.md`, and
`CAPACITOR_SETUP.md` before either beta.

