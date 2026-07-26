# Account deletion architecture

Settings invokes authenticated Edge Function `delete-account`. The function
verifies the bearer token with Supabase Auth, ignores all body-supplied identity
values, derives `user.id`, deletes that user's `budgetforge_sync` row, then uses
the server-only service role to delete the Auth user.

Sync timers and realtime subscriptions stop before invocation. Local financial,
profile/preference, owner/device, restore recovery, quarantine, isolation, and
local session data clear only after server-confirmed success.

If cloud deletion fails, Auth deletion is not attempted. If Auth deletion fails
after cloud deletion, the response is a recoverable server error; the signed-in
user can retry idempotently. Local data remains available on failure. Deploy and
exercise the staging matrix in the function README before production.

Public instructions: `https://budget-forge.com/account-deletion`.
