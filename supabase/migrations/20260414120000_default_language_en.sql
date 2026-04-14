alter table public.profiles
  alter column language set default 'en';

update public.profiles
set language = 'en'
where language is null;
