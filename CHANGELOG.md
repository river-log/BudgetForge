# Changelog

## Unreleased

- Added paycheck frequencies, separate recurring schedules, and clearly
  separated expected-income forecasts.
- Hardened bill filtering and reversible paid-history accounting.
- Preserved meaningful guest workspaces during cloud hydration and protected
  unsynced local edits from realtime replacement.
- Rejected zero-net and malformed paycheck values before persistence.
- Unified Savings dialogs with the accessible shared modal.
- Disabled Android operating-system backup for local financial data.
- Made recurring bill dates local-calendar safe and clarified planned-bill
  dashboard terminology.
- Added local-first Income Tracking with quick deposits, detailed paychecks,
  search/filter/history, Dashboard mode selection, Reports, backup support, and
  normalized Supabase persistence protected by RLS.

## 2.8.0 — 2026-07-26

- Added secure authenticated account deletion through a Supabase Edge Function.
- Added public Privacy, Terms, Support, and Account Deletion routes.
- Added store privacy, data safety, native declaration, reviewer, versioning,
  and beta-build preparation.
- Aligned Android and iOS beta metadata at version 2.8.0, build 1.
