# BudgetForge Backup Schema

BudgetForge exports JSON using schema version `2`.

```json
{
  "application": "BudgetForge",
  "schemaVersion": 2,
  "exportedAt": "2026-07-26T12:00:00.000Z",
  "presentFields": [],
  "data": {}
}
```

`presentFields` records which workspace values existed in storage when the
backup was created, distinguishing an absent value from an intentionally empty
collection. `data` always contains normalized defaults so a restore is
deterministic.

## Exported fields

- `bills`: recurring bill records, including their IDs, amount, due date,
  category, current paid flag, and recorded `paidMonths`.
- `income`: current non-negative monthly income.
- `userName`: local profile/display name.
- `budgetCategories`: category IDs, names, and planned amounts.
- `savingsGoals`: goal IDs, names, targets, and current saved balances.
- `savingsHistory`: monthly savings-balance snapshots keyed by `YYYY-MM`.
- `debts`: debt IDs, names, balances, APR values, and minimum payments.
- `debtStrategy`: `snowball` or `avalanche`.
- `spendingHistory`: monthly paid-bill totals and category totals keyed by
  `YYYY-MM`.
- `reminderDays`: one of the supported reminder windows: 0, 1, 3, 7, or 14.

## Intentionally excluded

Backups never include Supabase sessions or authentication data, device IDs,
cloud-owner metadata, onboarding state, restore recovery copies, quarantined
invalid values, environment secrets, or transient route/modal/toast/command
state.

## Compatibility and safety

Legacy BudgetForge `19.0` backups are migrated in memory before validation.
Future unsupported schema versions are rejected. The entire normalized payload
is validated before storage is changed. A restore first keeps the current
workspace in `budgetforge-restore-recovery-v1`, verifies every write, and rolls
back all keys if any write fails.
