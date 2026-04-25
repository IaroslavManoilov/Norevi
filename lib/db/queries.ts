import type { ServerSupabase } from "@/features/shared/server/supabase-types";
import { NO_DATA_KEY, UNCATEGORIZED_KEY } from "@/features/shared/domain/analytics-keys";
import { getProfile as getProfileRead } from "@/features/settings/server/profile-read-service";
import {
  getBalance as getBalanceRead,
  getCategories as getCategoriesRead,
  getExpenseAnalytics as getExpenseAnalyticsRead,
  getMonthlySummary as getMonthlySummaryRead,
  getTopExpenseCategories as getTopExpenseCategoriesRead,
  getTransactions as getTransactionsRead,
} from "@/features/finance/server/finance-read-service";
import {
  getBills as getBillsRead,
  getUpcomingBillsWithinMonth as getUpcomingBillsWithinMonthRead,
  recalculateBillStatuses as recalculateBillStatusesRead,
} from "@/features/bills/server/bills-read-service";
import { getReminders as getRemindersRead } from "@/features/reminders/server/reminders-read-service";
import { getNotes as getNotesRead } from "@/features/notes/server/notes-read-service";
import { getFavoriteItems as getFavoriteItemsRead } from "@/features/favorites/server/favorites-read-service";

export { NO_DATA_KEY, UNCATEGORIZED_KEY };

export async function getProfile(supabase: ServerSupabase, userId: string) {
  return getProfileRead(supabase, userId);
}

export async function getTransactions(supabase: ServerSupabase, userId: string) {
  return getTransactionsRead(supabase, userId);
}

export async function getBills(supabase: ServerSupabase, userId: string) {
  return getBillsRead(supabase, userId);
}

export async function getReminders(supabase: ServerSupabase, userId: string) {
  return getRemindersRead(supabase, userId);
}

export async function getNotes(supabase: ServerSupabase, userId: string) {
  return getNotesRead(supabase, userId);
}

export async function getFavoriteItems(supabase: ServerSupabase, userId: string, kind = "food") {
  return getFavoriteItemsRead(supabase, userId, kind);
}

export async function getCategories(supabase: ServerSupabase, userId: string) {
  return getCategoriesRead(supabase, userId);
}

export async function getMonthlySummary(supabase: ServerSupabase, userId: string, date = new Date()) {
  return getMonthlySummaryRead(supabase, userId, date);
}

export async function getBalance(supabase: ServerSupabase, userId: string) {
  return getBalanceRead(supabase, userId);
}

export async function getUpcomingBillsWithinMonth(supabase: ServerSupabase, userId: string, date = new Date()) {
  return getUpcomingBillsWithinMonthRead(supabase, userId, date);
}

export async function getTopExpenseCategories(supabase: ServerSupabase, userId: string, date = new Date()) {
  return getTopExpenseCategoriesRead(supabase, userId, date);
}

export async function recalculateBillStatuses(supabase: ServerSupabase, userId: string) {
  return recalculateBillStatusesRead(supabase, userId);
}

export async function getExpenseAnalytics(supabase: ServerSupabase, userId: string, date = new Date()) {
  return getExpenseAnalyticsRead(supabase, userId, date);
}
