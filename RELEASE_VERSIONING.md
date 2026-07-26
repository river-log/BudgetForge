# Release versioning

Version 2.8.0 beta build 1 is represented in:

- `package.json` and `src/config/version.js`: 2.8.0
- Android `versionName`: 2.8.0; `versionCode`: 1
- iOS `MARKETING_VERSION`: 2.8.0; `CURRENT_PROJECT_VERSION`: 1

Marketing versions identify product releases. Android versionCode and iOS build
number must increase for every uploaded artifact and must never be reused.
Before a build, update both native build integers together, verify the four
locations above, update CHANGELOG, run validation/sync, and inspect generated
native metadata. Native build numbers remain explicit because Gradle and Xcode
require their own project values; this document is the release-control checklist.

