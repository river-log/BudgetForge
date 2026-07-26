# Apple App Privacy inventory

This inventory reflects version 2.8.0. “Collected” means transmitted off device,
not merely stored locally. No category is used for tracking.

| Category | Collected | Linked | Purpose and evidence |
|---|---:|---:|---|
| Contact Info — Email | Optional, when signed in | Yes | App Functionality and Developer Communications for Supabase Auth/magic links |
| Financial Info — Other Financial Info | Optional, when cloud sync is enabled | Yes | App Functionality; `budgetforge_sync.data` contains user-entered workspace fields |
| User Content | Optional, when cloud sync is enabled | Yes | App Functionality; profile name and user-authored bill/goal/debt labels |
| Identifiers — User ID | Optional, when signed in | Yes | App Functionality; Supabase Auth ID owns the sync row |
| Diagnostics | No app collection implemented | No | No crash/diagnostic SDK |
| Usage Data / App Interactions | No | No | No analytics SDK or event endpoint |
| Purchases | No | No | No commerce or IAP |
| Precise/Coarse Location | No | No | No location API or permission |
| Contacts | No | No | No contacts API or permission |
| Search/Browsing History | No | No | No collection path |
| Sensitive Info | No separate category identified | No | Entered financial data is classified above |

Guest workspace data and backups that never leave the device are not classified
as collected. User-directed export shares a file to a destination selected by
the user and is not developer collection.

Supabase may process network metadata such as IP addresses in infrastructure
logs. Retention and exact App Privacy treatment require confirmation against
the production Supabase project settings and current Supabase documentation
before submission. Capacitor plugins add no analytics or tracking.

