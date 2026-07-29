# Income Tracking

Income entries are normalized objects stored locally in
`budgetforge-income-entries-v1`. `budgetforge-income-mode-v1` selects the
Dashboard's tracked current-month total or the legacy `budgetforge-income`
manual estimate. Existing users default to manual mode, so the feature never
silently changes their dashboard.

All UI mutations flow through `useBudgetData`; components do not maintain
duplicate persisted arrays. Signed-in sync includes both versioned keys in the
existing account-isolated snapshot and mirrors normalized entries to
`income_entries`. RLS restricts every CRUD operation to `auth.uid() = user_id`.

Money remains numeric to match BudgetForge storage, but all derived operations
are centralized and rounded to cents after each calculation.

## Manual Supabase rollout

Review and apply the migration before deploying the client:

```powershell
supabase db push
supabase functions deploy delete-account
```

Alternatively, review
`supabase/migrations/202607280001_create_income_entries.sql` in the Supabase SQL
Editor. Verify policies with two test users before production. Do not expose a
service-role key to Vite.

The backup schema remains version 2. Older schema-v2 backups default to no
entries and manual mode. Income entries are financial information covered by
the existing Privacy Policy and store disclosure inventories. BudgetForge is a
recordkeeping tool and does not connect to bank accounts.
