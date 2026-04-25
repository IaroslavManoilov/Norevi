create table if not exists public.smart_action_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action_id text not null,
  event_type text not null check (event_type in ('view','click','complete','dismiss')),
  variant text not null check (variant in ('A','B')),
  position smallint,
  score integer,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists smart_action_events_user_created_idx
  on public.smart_action_events (user_id, created_at desc);
create index if not exists smart_action_events_user_action_idx
  on public.smart_action_events (user_id, action_id);

alter table public.smart_action_events enable row level security;

create policy "smart_action_events_select_own"
on public.smart_action_events
for select
using (auth.uid() = user_id);

create policy "smart_action_events_insert_own"
on public.smart_action_events
for insert
with check (auth.uid() = user_id);

create policy "smart_action_events_update_own"
on public.smart_action_events
for update
using (auth.uid() = user_id);

create policy "smart_action_events_delete_own"
on public.smart_action_events
for delete
using (auth.uid() = user_id);
