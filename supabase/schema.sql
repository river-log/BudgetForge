create table if not exists public.budgetforge_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.budgetforge_sync enable row level security;

create policy "Users manage only their own BudgetForge data"
on public.budgetforge_sync
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.budgetforge_sync;
