# Paycheck schedules

Actual income entries represent money the user confirms was received. Paycheck
schedules are separate expected-date metadata and never count toward tracked
income, net cash flow, or savings rate.

- Weekly means every 7 calendar days.
- Every 2 Weeks means every 14 calendar days.
- Twice a Month means two configured calendar dates per month.
- Monthly supports a configured date or the last day of the month.
- Irregular and One-time do not generate recurring forecasts.

Month-end dates are clamped in local calendar time, including leap-year
February. Forecast amounts reuse the detailed-paycheck calculation and are
always labeled as estimates.

Local storage uses `budgetforge-paycheck-schedules-v1`. Signed-in workspaces
sync schedules through the existing snapshot and normalized
`paycheck_schedules` table. Backups include schedules; older backups default to
an empty schedule list. Imported ownership IDs are not trusted.

BudgetForge does not connect to payroll systems or bank accounts.

## Deployment

Review and apply migrations before deploying the client:

```bash
supabase db push
supabase functions deploy delete-account
```
