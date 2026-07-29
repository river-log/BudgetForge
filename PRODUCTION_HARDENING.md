# Production hardening notes

## Data integrity

- Paid bill history is adjusted in both directions without allowing negative
  aggregates.
- Detailed paychecks require a positive deposited net amount.
- Malformed legacy income dates and non-finite numbers are ignored safely.
- Recurring bill occurrences are constructed in local calendar time.

## Cloud conflict behavior

Meaningful guest data is preserved on first sign-in and uploaded instead of
being silently replaced by an existing remote snapshot. Realtime changes from
another device do not replace values edited since the last confirmed sync.

The snapshot model remains last-write-wins when two devices successfully upload
different changes at nearly the same time. BudgetForge does not provide a
record-level merge or conflict-resolution interface.

Paycheck schedules participate in the same conflict protection and remain
separate from actual received-income entries.

## Account deletion

The Edge Function verifies the bearer token and deletes the verified Auth user.
Application records are removed through reviewed `ON DELETE CASCADE` foreign
keys, avoiding deletion of financial rows before a failed Auth deletion.

## Manual QA

Review 320, 360, 390, 412, 768, 1024, 1280, and 1440 pixel layouts in light and
dark themes. Verify Android keyboard, back navigation, offline resume,
backup/restore, authentication callbacks, and deletion on an internal-test
device.
