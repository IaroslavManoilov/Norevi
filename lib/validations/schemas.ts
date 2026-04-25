import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2),
});

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive(),
  title: z.string().min(1),
  note: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  transaction_date: z.string().min(1),
});

export const billSchema = z.object({
  title: z.string().min(1),
  amount: z.coerce.number().positive(),
  due_date: z.string().min(1),
  repeat_type: z.enum(["none", "weekly", "monthly", "yearly"]),
  category: z.string().optional().nullable(),
  status: z.enum(["upcoming", "paid", "overdue"]),
  auto_renew: z.coerce.boolean().default(false),
  note: z.string().optional().nullable(),
});

export const reminderSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  remind_at: z.string().min(1),
  repeat_type: z.enum(["none", "daily", "weekly", "monthly"]),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["active", "done", "cancelled"]),
});

export const noteSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional().nullable(),
  note_date: z.string().min(1),
});

export const favoriteItemSchema = z.object({
  title: z.string().min(1),
  kind: z.string().min(1).default("food"),
});

export const foodPlanSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  planned_daily: z.coerce.number().nonnegative(),
  planned_monthly: z.coerce.number().nonnegative(),
  food_goal: z.coerce.number().nonnegative(),
});

export const categoryResolveSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["income", "expense"]),
});

export const paymentRuleSchema = z.object({
  pattern: z.string().min(1),
  category_id: z.string().uuid(),
});

export const settingsSchema = z.object({
  full_name: z.string().optional().nullable(),
  currency: z.string().min(3).max(6),
  language: z.enum(["ru", "en", "ro"]),
  timezone: z.string().min(3),
  theme: z.enum(["system", "light", "dark"]),
  monthly_budget_limit: z.coerce.number().nonnegative().nullable().optional(),
  exchange_rates: z
    .record(z.string(), z.coerce.number().nonnegative())
    .optional()
    .nullable(),
});

export const onboardingSchema = z.object({
  currency: z.string().min(3).max(6),
  language: z.enum(["ru", "en", "ro"]),
  monthly_budget_limit: z.coerce.number().nonnegative().nullable().optional(),
});
