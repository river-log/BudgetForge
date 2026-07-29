# Delete account Edge Function

Deploy with Supabase's normal server-managed `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` secrets. Never copy the
service-role key into Vite or a native build.

The function verifies the bearer token with `auth.getUser`, derives the user ID
only from that verified user, deletes owned `income_entries` and the
`budgetforge_sync` row, then deletes the Auth user. Request bodies are ignored.

If record deletion fails, Auth deletion is not attempted. If Auth deletion fails
after record deletion, the function returns `auth_delete_failed` and the user
can retry; the row is already absent and the retry remains idempotent.

Required staging checks:

```bash
supabase functions serve delete-account
supabase functions deploy delete-account
```

Test valid, expired, missing, and another user's tokens against a non-production
project before deploying to production.
