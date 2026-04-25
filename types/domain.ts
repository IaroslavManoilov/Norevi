export type ThemePreference = "system" | "light" | "dark";
export type Language = "ru" | "en" | "ro";
export type TransactionType = "income" | "expense";
export type BillRepeat = "none" | "weekly" | "monthly" | "yearly";
export type BillStatus = "upcoming" | "paid" | "overdue";
export type ReminderRepeat = "none" | "daily" | "weekly" | "monthly";
export type ReminderPriority = "low" | "medium" | "high";
export type ReminderStatus = "active" | "done" | "cancelled";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  currency: string;
  language: Language;
  timezone: string;
  monthly_income_goal: number | null;
  monthly_budget_limit: number | null;
  exchange_rates?: Record<string, number> | null;
  theme: ThemePreference;
  onboarding_completed: boolean;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  title: string;
  note: string | null;
  transaction_date: string;
  created_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  due_date: string;
  repeat_type: BillRepeat;
  category: string | null;
  status: BillStatus;
  auto_renew: boolean;
  note: string | null;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  remind_at: string;
  repeat_type: ReminderRepeat;
  priority: ReminderPriority;
  status: ReminderStatus;
}

export interface Note {
  id: string;
  user_id: string;
  note_date: string;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
}

export interface FavoriteItem {
  id: string;
  user_id: string;
  title: string;
  kind: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceSummary {
  income: number;
  expense: number;
  balance: number;
}
