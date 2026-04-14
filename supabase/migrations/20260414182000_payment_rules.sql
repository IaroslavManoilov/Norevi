create table if not exists public.payment_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pattern text not null,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, pattern)
);

create index if not exists payment_rules_user_id_idx on public.payment_rules (user_id);
create index if not exists payment_rules_pattern_idx on public.payment_rules (pattern);

alter table public.payment_rules enable row level security;

create policy "payment_rules_select_own"
on public.payment_rules
for select
using (auth.uid() = user_id);

create policy "payment_rules_insert_own"
on public.payment_rules
for insert
with check (auth.uid() = user_id);

create policy "payment_rules_update_own"
on public.payment_rules
for update
using (auth.uid() = user_id);

create policy "payment_rules_delete_own"
on public.payment_rules
for delete
using (auth.uid() = user_id);

create trigger trigger_payment_rules_updated_at
before update on public.payment_rules
for each row execute function public.set_updated_at();
