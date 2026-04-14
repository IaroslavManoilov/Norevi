create table if not exists public.food_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_date date not null,
  planned_daily numeric(12,2) not null default 0,
  planned_monthly numeric(12,2) not null default 0,
  food_goal numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month_date)
);

create index if not exists food_plans_user_id_idx on public.food_plans (user_id);
create index if not exists food_plans_month_idx on public.food_plans (month_date);

alter table public.food_plans enable row level security;

create policy "food_plans_select_own"
on public.food_plans
for select
using (auth.uid() = user_id);

create policy "food_plans_insert_own"
on public.food_plans
for insert
with check (auth.uid() = user_id);

create policy "food_plans_update_own"
on public.food_plans
for update
using (auth.uid() = user_id);

create policy "food_plans_delete_own"
on public.food_plans
for delete
using (auth.uid() = user_id);

create trigger trigger_food_plans_updated_at
before update on public.food_plans
for each row execute function public.set_updated_at();
