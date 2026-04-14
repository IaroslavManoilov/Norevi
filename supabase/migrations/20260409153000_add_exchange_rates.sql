alter table public.profiles
add column if not exists exchange_rates jsonb;

update public.profiles
set exchange_rates = jsonb_build_object(
  'MDL', 1,
  'EUR', 0.0496,
  'USD', 0.058,
  'RUB', 4.6349,
  'RUP', 0.9344
)
where exchange_rates is null;
