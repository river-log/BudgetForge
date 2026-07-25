# BudgetForge Release Checklist

See [SECURITY_NOTES.md](SECURITY_NOTES.md) for documented temporary npm-audit risk acceptance.

- [ ] `npm run lint`
- [ ] `npm test -- --run`
- [ ] `npm run build`
- [ ] Review desktop, tablet, mobile, light, and dark presentations
- [ ] Confirm first-run onboarding and returning-user launch
- [ ] Confirm Supabase email sign-in, safe sign-out isolation, cloud upload/download
- [ ] Confirm backup export/import and restore warning
- [ ] Refresh each nested route directly on Netlify
- [ ] Confirm Netlify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` when cloud is enabled
- [ ] Confirm favicon, manifest, social preview, HTTPS custom domain, and canonical URL
- [ ] Verify Supabase RLS policies with a non-owner account
- [ ] Confirm React Router remains client-only (no RSC, SSR, route actions, or server handlers)
