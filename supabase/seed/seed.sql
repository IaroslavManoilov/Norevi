-- Seed default categories for existing users
insert into public.profiles (user_id, full_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1))
from auth.users u
left join public.profiles p on p.user_id = u.id
where p.user_id is null;

select public.seed_default_categories_for_user(u.id)
from auth.users u;
