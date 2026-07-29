# Delete account Edge Function

Deploy with Supabase's normal server-managed `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` secrets. Never copy the
service-role key into Vite or a native build.

The function verifies the bearer token with `auth.getUser`, derives the user ID
only from that verified user, and deletes the Auth user. Request bodies are
ignored. The reviewed `income_entries` and `budgetforge_sync` foreign keys use
`ON DELETE CASCADE`, so application rows are removed by the same database
operation. Apply both schema migrations before deploying this function.

Required staging checks:

```bash
supabase functions serve delete-account
supabase functions deploy delete-account
```

Test valid, expired, missing, and another user's tokens against a non-production
project before deploying to production.
