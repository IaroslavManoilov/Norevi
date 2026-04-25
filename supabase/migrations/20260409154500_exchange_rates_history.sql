create table if not exists public.exchange_rates_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  base_currency text not null,
  rates jsonb not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists exchange_rates_history_user_id_idx on public.exchange_rates_history (user_id);
create index if not exists exchange_rates_history_created_at_idx on public.exchange_rates_history (created_at desc);

alter table public.exchange_rates_history enable row level security;

create policy "exchange_rates_history_select_own"
on public.exchange_rates_history
for select
using (auth.uid() = user_id);

create policy "exchange_rates_history_insert_own"
on public.exchange_rates_history
for insert
with check (auth.uid() = user_id);
