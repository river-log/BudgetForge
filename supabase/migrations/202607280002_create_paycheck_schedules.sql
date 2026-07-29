create table if not exists public.paycheck_schedules (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  employer text not null check (length(trim(employer)) > 0),
  source_name text not null,
  pay_frequency text not null check (pay_frequency in ('weekly','biweekly','semimonthly','monthly','irregular','one-time')),
  preferred_weekday smallint check (preferred_weekday between 0 and 6),
  anchor_date date,
  semimonthly_pattern text check (semimonthly_pattern is null or semimonthly_pattern in ('first-fifteenth','fifteenth-last','custom')),
  semimonthly_day_one smallint check (semimonthly_day_one between 1 and 31),
  semimonthly_day_two smallint check (semimonthly_day_two between 1 and 31),
  monthly_day smallint check (monthly_day between 1 and 31),
  use_last_day_of_month boolean not null default false,
  default_hourly_rate numeric(14,2) check (default_hourly_rate >= 0),
  default_regular_hours numeric(10,2) check (default_regular_hours >= 0),
  default_overtime_hours numeric(10,2) check (default_overtime_hours >= 0),
  default_overtime_multiplier numeric(6,2) check (default_overtime_multiplier >= 0),
  default_gross_pay numeric(14,2) check (default_gross_pay >= 0),
  default_deductions numeric(14,2) check (default_deductions >= 0),
  default_deposit_method text,
  next_expected_pay_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (semimonthly_day_one is null or semimonthly_day_two is null or semimonthly_day_one <> semimonthly_day_two)
);
create index if not exists paycheck_schedules_user_idx on public.paycheck_schedules(user_id);
create index if not exists paycheck_schedules_next_idx on public.paycheck_schedules(user_id, next_expected_pay_date) where is_active;
alter table public.paycheck_schedules enable row level security;
create policy "Paycheck schedules select own" on public.paycheck_schedules for select to authenticated using (auth.uid() = user_id);
create policy "Paycheck schedules insert own" on public.paycheck_schedules for insert to authenticated with check (auth.uid() = user_id);
create policy "Paycheck schedules update own" on public.paycheck_schedules for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Paycheck schedules delete own" on public.paycheck_schedules for delete to authenticated using (auth.uid() = user_id);
alter table public.income_entries add column if not exists pay_frequency text check (pay_frequency is null or pay_frequency in ('weekly','biweekly','semimonthly','monthly','irregular','one-time'));
alter table public.income_entries add column if not exists schedule_id uuid references public.paycheck_schedules(id) on delete set null;
