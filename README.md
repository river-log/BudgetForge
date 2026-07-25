# BudgetForge OS

BudgetForge is a responsive personal-finance workspace for bills, budgets, savings goals, debt payoff planning, reports, reminders, backups, and optional cloud sync.

Production: [budget-forge.com](https://budget-forge.com)

## Features

- Monthly bills, payment tracking, budget categories, and calendar reminders
- Savings goals, debt payoff guidance, financial reports, and history charts
- JSON backup export and restore
- Optional Supabase email-link accounts and multi-device cloud sync
- Responsive desktop and mobile navigation, keyboard command palette, onboarding, and accessible recovery states

## Stack

React 19, Vite, React Router, Recharts, Lucide, Supabase, Vitest, and React Testing Library.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Cloud sync is optional. Configure these public browser variables only when enabling it:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never add a Supabase service-role key to this app or commit `.env` files. Without configuration, BudgetForge remains a local-first workspace and the Cloud Sync card explains that setup is required.

## Commands

```bash
npm run lint
npm test -- --run
npm run build
```

## Cloud sync and privacy

Cloud sync uses Supabase email-link authentication. Financial data remains browser-local unless a user signs in; cloud records are protected by Supabase Row Level Security. Signing out clears user-owned local financial data to prevent shared-browser account crossover. Backups are portable JSON files—store them securely.

## Deployment

Netlify builds with `npm run build` and publishes `dist`. `public/_redirects` sends SPA routes to `index.html`, allowing direct navigation and refresh on nested routes. Set the same `VITE_*` variables in Netlify when cloud sync is enabled. Configure Supabase redirect URLs for `https://budget-forge.com` and local development.

## Screenshots

Existing product screenshots are available in [`assets/`](assets/). The social preview uses the Forge brand asset in [`public/branding/social-preview.svg`](public/branding/social-preview.svg).
