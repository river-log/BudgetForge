# Security Notes — v2.3

## Temporary npm audit risk acceptance

This document records known findings from `npm audit`. It does **not** claim the audit is clean.

### React Router

- Current versions: `react-router-dom` 7.18.1 and transitive `react-router` 7.18.1.
- The high-severity advisory concerns React Server Components and server actions.
- BudgetForge is currently a client-only Vite SPA. It does not use RSC, SSR, route actions, server handlers, or server rendering.
- The vulnerable path is therefore not reachable in the current application architecture. The finding is accepted temporarily while the app remains client-only.
- A React Router v8.3+ migration is required before adding RSC, SSR, server actions, or related server-side routing features.
- Track this as a security follow-up; do not treat it as a resolved audit finding.

### ESLint dependency chain

- The `brace-expansion` denial-of-service advisory is development-only through ESLint and minimatch.
- It is not included in the production browser bundle.
- Run linting only against trusted repository input; do not expose linting as a service for untrusted paths or glob patterns.
- Monitor ESLint/minimatch upstream updates for an available fix.
