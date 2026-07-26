# Store reviewer notes

BudgetForge opens in meaningful guest/local mode. No account or reviewer
credential is required to evaluate bills, budgets, calendar, savings, debts,
reports, monthly insights, backup export/import, responsive navigation, or
offline local persistence.

For a review:

1. Complete or dismiss onboarding.
2. Add fictional bills, income, categories, savings goals, and debts manually.
3. Mark a bill paid and inspect Reports/Calendar.
4. Export a JSON backup; import it to review preview/recovery behavior.

Cloud Sync is the only sign-in-dependent feature. It uses an optional
passwordless email magic link and synchronizes the same workspace through
Supabase. No hardcoded account or authentication bypass exists. Account deletion
appears in Settings only while signed in and requires typing `DELETE`.

Known non-defects: guest data is device-local; native browser notifications are
unsupported; verified HTTPS auth links require signed builds and hosted domain
association; no bank connections, advice, subscriptions, push notifications,
analytics, or sample-data loader exists. A loader was intentionally omitted
because manual fictional data entry is short and avoids accidental sync.

