# BudgetForge OS

**BudgetForge OS v21.0** is a modern personal-finance dashboard for planning bills, budgets, savings, debt payoff, and financial progress from one responsive workspace.

Built with React, Vite, Recharts, and optional Supabase cloud sync.

## Highlights

- **Bills and budget planning** — add bills, track monthly payment status, search and filter records, and see total due and budget utilization.
- **Calendar and reminders** — view recurring bill due dates, receive browser reminders, and use the upcoming-payment timeline.
- **Savings and debt management** — maintain savings goals and debt accounts, record payments, and compare snowball and avalanche payoff strategies.
- **Reports and trends** — review six months of spending and savings history plus current-month category trends.
- **Backup and restore** — export a portable JSON backup and restore it when moving devices or recovering data.
- **Optional cloud sync** — sign in using a secure email link to sync BudgetForge data across devices through Supabase.
- **Fast, accessible workspace** — responsive layout, keyboard command palette (`Ctrl`/`Cmd` + `K`), toast feedback, and a desktop-inspired interface.

## Screenshots

| Dashboard | Bills workspace |
| --- | --- |
| ![BudgetForge dashboard](assets/BudgetForge-Dashboard.png) | ![BudgetForge bills workspace](assets/BudgetForge-Bills-1.png) |

## Getting started

### Requirements

- Node.js 20 or newer
- npm

### Run locally

```bash
git clone https://github.com/river-log/BudgetForge.git
cd BudgetForge
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Run the code checks with:

```bash
npm run lint
```

## Optional cloud sync setup

BudgetForge works locally without an account. To enable accounts and multi-device sync:

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env`.
4. Add your project URL and anonymous key to `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Configure Supabase Auth email redirects for your deployed URL and local development URL.
6. Restart the development server, then use **Settings → Cloud sync** to send a secure sign-in link.

Never commit `.env`; it is intentionally ignored by Git.

## Data and privacy

Without cloud sync, BudgetForge stores data in the browser's local storage. Backup and restore lets you move that data with a JSON file. When cloud sync is enabled, the app uses Supabase authentication and row-level security so each signed-in user can access only their own sync record.

## Tech stack

- React 19 and React Router
- Vite
- Recharts
- Lucide React
- Supabase (optional authentication, storage, and realtime sync)
- Browser Local Storage and Notifications APIs

## Release notes

### v21.0 — Cloud sync and accounts

- Secure email-link sign-in with Supabase
- Automatic and on-demand multi-device cloud synchronization
- Financial reports, spending trends, and savings-growth charts
- Bill calendar, browser reminders, and payment timeline
- Debt snowball and avalanche payoff guidance
- Monthly bill-payment tracking

See [CHANGELOG.md](CHANGELOG.md) for the complete release history.

## Project status

BudgetForge OS is actively developed. The current release is **v21.0**.

## Author

Shane Edsall
