create table if not exists public.favorite_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  kind text not null default 'food',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, kind, title)
);

create index if not exists favorite_items_user_id_idx on public.favorite_items (user_id);
create index if not exists favorite_items_kind_idx on public.favorite_items (kind);

alter table public.favorite_items enable row level security;

create policy "favorite_items_select_own"
on public.favorite_items
for select
using (auth.uid() = user_id);

create policy "favorite_items_insert_own"
on public.favorite_items
for insert
with check (auth.uid() = user_id);

create policy "favorite_items_update_own"
on public.favorite_items
for update
using (auth.uid() = user_id);

create policy "favorite_items_delete_own"
on public.favorite_items
for delete
using (auth.uid() = user_id);

create trigger trigger_favorite_items_updated_at
before update on public.favorite_items
for each row execute function public.set_updated_at();
