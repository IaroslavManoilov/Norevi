# Supabase Ops

## Apply migrations

1. Install/login if needed:
   - `npx supabase login`
2. Link project once:
   - `npx supabase link --project-ref <your-project-ref>`
3. Push migrations:
   - `npm run db:push`

## Local reset

- `npm run db:reset`

This repository includes migration:
- `20260425120000_smart_action_events.sql`
which enables Smart Actions explainability/feedback/A-B analytics.
