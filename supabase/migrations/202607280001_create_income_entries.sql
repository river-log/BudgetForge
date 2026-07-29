create table if not exists public.income_entries (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_mode text not null check (entry_mode in ('quick', 'paycheck')),
  source_type text not null,
  source_name text not null check (length(trim(source_name)) > 0),
  amount numeric(14,2) not null check (amount > 0),
  date_received date not null,
  deposit_method text not null,
  notes text not null default '',
  employer text,
  pay_period_start date,
  pay_period_end date,
  hourly_rate numeric(14,2) check (hourly_rate >= 0),
  regular_hours numeric(10,2) check (regular_hours >= 0),
  overtime_hours numeric(10,2) check (overtime_hours >= 0),
  overtime_multiplier numeric(6,2) check (overtime_multiplier >= 0),
  gross_pay numeric(14,2) check (gross_pay >= 0),
  federal_tax numeric(14,2) check (federal_tax >= 0),
  state_tax numeric(14,2) check (state_tax >= 0),
  local_tax numeric(14,2) check (local_tax >= 0),
  social_security_tax numeric(14,2) check (social_security_tax >= 0),
  medicare_tax numeric(14,2) check (medicare_tax >= 0),
  health_insurance numeric(14,2) check (health_insurance >= 0),
  retirement_contribution numeric(14,2) check (retirement_contribution >= 0),
  other_deductions numeric(14,2) check (other_deductions >= 0),
  total_deductions numeric(14,2) check (total_deductions >= 0),
  net_pay numeric(14,2) check (net_pay >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (pay_period_end is null or pay_period_start is null or pay_period_end >= pay_period_start)
);
create index if not exists income_entries_user_date_idx on public.income_entries (user_id, date_received desc);
alter table public.income_entries enable row level security;
create policy "Income entries select own" on public.income_entries for select to authenticated using (auth.uid() = user_id);
create policy "Income entries insert own" on public.income_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "Income entries update own" on public.income_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Income entries delete own" on public.income_entries for delete to authenticated using (auth.uid() = user_id);
create or replace function public.set_income_entries_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists income_entries_set_updated_at on public.income_entries;
create trigger income_entries_set_updated_at before update on public.income_entries
for each row execute function public.set_income_entries_updated_at();
