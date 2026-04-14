# Norevi

Norevi — PWA помощник для спокойного управления финансами, платежами, напоминаниями и ежедневным ритмом жизни.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS
- UI-подход в стиле shadcn/ui (переиспользуемые UI-компоненты)
- Supabase Auth + Postgres + RLS
- React Hook Form + Zod
- Recharts
- OpenAI API (ассистент)
- PWA через `next-pwa`

## Структура проекта

- `app/` — роуты, layouts, API handlers
- `components/` — UI, layout, cards, forms, assistant, shared
- `features/` — auth/onboarding feature-компоненты
- `lib/` — auth/db/ai/utils/validation/formatters
- `actions/` — server actions
- `types/` — доменные типы
- `supabase/migrations` — SQL миграции
- `supabase/seed` — seed скрипты

## Переменные окружения

Скопируй `.env.example` в `.env.local` и заполни:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Где лежат бренд-ассеты

Положи файлы в `public/brand`:

- `logo-light.png`
- `logo-dark.png`
- `logo-mono.png`
- `mark-light.png`
- `mark-dark.png`
- `favicon.png`
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Supabase setup

1. Создай проект в Supabase.
2. Пропиши env переменные.
3. Выполни SQL из `supabase/migrations/20260408140000_init.sql` в SQL Editor.
4. Выполни `supabase/seed/seed.sql` для существующих пользователей.

## Миграции и seed

- Основная миграция: `supabase/migrations/20260408140000_init.sql`
- Seed: `supabase/seed/seed.sql`

Миграция создаёт:

- таблицы `profiles`, `categories`, `transactions`, `bills`, `reminders`, `ai_conversations`, `ai_messages`, `notifications`
- индексы
- триггеры `updated_at`
- RLS и политики на все CRUD операции
- автосоздание профиля и дефолтных категорий при регистрации

## Как работает AI помощник

- Endpoint: `POST /api/assistant`
- Сообщения/диалоги сохраняются в `ai_conversations` и `ai_messages`
- Ассистент использует реальные данные из Supabase через tool-слой (`lib/ai/tools.ts`)
- Поддерживает intents MVP:
  - лимит на сегодня
  - платежи недели
  - траты на еду за месяц
  - создание напоминания из текста
  - подписки
  - крупнейшие расходы месяца

## Нотификации и cron

- Endpoint: `POST /api/notifications/process`
- Готовит записи в `notifications` (queue-подход)
- Можно запускать по cron (Vercel Cron) для дальнейшей доставки push/email

## Deploy на Vercel

1. Подключи репозиторий в Vercel.
2. Добавь env переменные из `.env.local`.
3. При деплое включится PWA-конфиг.
4. Настрой cron на `/api/notifications/process` при необходимости.

## Ключевые маршруты

Public:

- `/`
- `/auth/sign-in`
- `/auth/sign-up`

Protected:

- `/dashboard`
- `/finance`
- `/finance/new`
- `/finance/[id]`
- `/bills`
- `/bills/new`
- `/bills/[id]`
- `/reminders`
- `/reminders/new`
- `/reminders/[id]`
- `/assistant`
- `/settings`
- `/onboarding`
