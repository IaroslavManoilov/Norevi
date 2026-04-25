create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_date date not null,
  title text not null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_note_date_idx on public.notes (note_date);

alter table public.notes enable row level security;

create policy "notes_select_own"
on public.notes
for select
using (auth.uid() = user_id);

create policy "notes_insert_own"
on public.notes
for insert
with check (auth.uid() = user_id);

create policy "notes_update_own"
on public.notes
for update
using (auth.uid() = user_id);

create policy "notes_delete_own"
on public.notes
for delete
using (auth.uid() = user_id);

create trigger trigger_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();
