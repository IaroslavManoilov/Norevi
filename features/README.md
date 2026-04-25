# Norevi LifeSync Domain Map

This folder now follows bounded contexts for server logic and keeps UI features separate from data mutations.

## Contexts

- `features/finance/server`: Transaction writes plus finance read/analytics projections.
- `features/bills/server`: Bill lifecycle, recurring renewal, and bill read projections.
- `features/reminders/server`: Reminder writes + notification side effects and reminder reads.
- `features/settings/server`: Profile settings, onboarding completion, and profile read.
- `features/categories/server`: Category listing and resolve/create flow.
- `features/payments/server`: Payment rules read/write/delete operations.
- `features/favorites/server`: Favorite items read/write/delete operations.
- `features/notes/server`: Notes list/create operations and reads.
- `features/food/server`: Food plan month resolution and upsert/list operations.
- `features/smart-actions/server`: Smart action feedback events and preference scoring.
- `features/shared/server`: Shared API route auth and Supabase server types.
- `features/shared/domain`: Shared domain constants and semantic keys.

## API Layer Contract

`app/api/*` routes are now thin controllers:

1. Authenticate via `requireRouteUser`.
2. Validate input via `parseJsonWithSchema`.
3. Delegate business logic to `features/*/server`.
4. Return HTTP response mapping only.

This keeps route files stable while domain behavior evolves in one place.
