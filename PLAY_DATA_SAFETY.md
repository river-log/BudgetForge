# Google Play Data Safety inventory

| Data type | Collected/shared | Required | Purpose, retention, deletion, evidence |
|---|---|---|---|
| Email address | Collected by Supabase; not sold/shared beyond processor | Optional | Account management/magic link; retained with account; deletable in app |
| User ID | Collected by Supabase | Optional | Authentication and row ownership; retained with account; deletable |
| Financial info | Collected only for signed-in cloud sync | Optional | App functionality/multi-device sync; retained with account; deletable |
| User content | Collected only for signed-in cloud sync | Optional | User labels/profile; retained with account; deletable |
| Files/documents | Not developer-collected | Optional user action | Backup file goes only to user-selected destination |
| App interactions/usage | No | — | No analytics |
| Diagnostics/crash logs | No app collection implemented | — | No crash SDK |
| Device identifiers | A random app device ID is included in sync snapshots | Optional | Realtime conflict/source handling; retained in latest sync row; deletable |
| Location | No app collection | — | No location APIs; IP-derived location by infrastructure requires Supabase confirmation |

Supabase traffic uses HTTPS. Data is processed by Supabase as a service provider,
not sold or used for advertising. Account deletion is available at
`https://budget-forge.com/account-deletion`. No independent security review or
certification is claimed. Confirm production Supabase logging/retention and the
final Play Console definitions immediately before submission.

