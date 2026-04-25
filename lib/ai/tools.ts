import { addDays } from "date-fns";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import {
  getBalance,
  getMonthlySummary,
  getTopExpenseCategories,
  getTopExpensesForMonth,
  getMonthlyFoodSpend as getMonthlyFoodSpendRead,
} from "@/features/finance/server/finance-read-service";
import {
  getBillsForDateRange as getBillsForDateRangeRead,
  getUpcomingBillsWithinMonth,
} from "@/features/bills/server/bills-read-service";
import { calculateDailySafeLimit } from "@/lib/utils/budget";
import { reminderSchema } from "@/lib/validations/schemas";
import { getTranslations } from "@/lib/i18n/translations";

export async function getCurrentBalance(userId: string) {
  const supabase = await createServerSupabaseClient();
  const balance = await getBalance(supabase, userId);
  return { balance };
}

export async function getDailySafeLimit(userId: string) {
  const supabase = await createServerSupabaseClient();
  const balance = await getBalance(supabase, userId);
  const bills = await getUpcomingBillsWithinMonth(supabase, userId);
  const billsTotal = bills.reduce((acc, b) => acc + Number(b.amount), 0);
  const daily = calculateDailySafeLimit(balance, billsTotal);

  return {
    limit: daily.limit,
    daysLeft: daily.days,
    requiredBills: billsTotal,
    state: daily.state,
  };
}

export async function getBillsForDateRange(userId: string, startDate: Date, endDate: Date) {
  const supabase = await createServerSupabaseClient();
  return getBillsForDateRangeRead(supabase, userId, startDate, endDate);
}

export async function getSpendingByCategoryForCurrentMonth(userId: string) {
  const supabase = await createServerSupabaseClient();
  return getTopExpenseCategories(supabase, userId);
}

export async function getTopExpenses(userId: string, limit = 5) {
  const supabase = await createServerSupabaseClient();
  return getTopExpensesForMonth(supabase, userId, limit);
}

export async function getMonthlyFoodSpend(userId: string) {
  const supabase = await createServerSupabaseClient();
  return getMonthlyFoodSpendRead(supabase, userId);
}

export async function createReminderFromText(userId: string, text: string, language?: string) {
  const supabase = await createServerSupabaseClient();
  const lower = text.toLowerCase();
  const locale = language === "en" || language === "ro" || language === "ru" ? language : "ru";
  const t = getTranslations(locale);
  const isToday = /сегодня|today|azi|astazi/.test(lower);
  const isTomorrow = /завтра|tomorrow|maine/.test(lower);
  const targetDate = isToday ? new Date() : addDays(new Date(), isTomorrow ? 1 : 1);
  const hourMatch = lower.match(/(\d{1,2})[:.]?(\d{2})?/);
  const hour = hourMatch ? Number(hourMatch[1]) : 9;
  const minute = hourMatch?.[2] ? Number(hourMatch[2]) : 0;
  targetDate.setHours(hour, minute, 0, 0);

  const removePatterns = {
    ru: [/напомни/gi, /завтра/gi, /сегодня/gi, /в\s*\d{1,2}[:.]?\d{0,2}/gi],
    en: [/remind me/gi, /remind/gi, /tomorrow/gi, /today/gi, /at\s*\d{1,2}[:.]?\d{0,2}/gi],
    ro: [/aminteste[- ]?mi/gi, /aminteste/gi, /maine/gi, /azi/gi, /la\s*\d{1,2}[:.]?\d{0,2}/gi],
  } as const;

  let title = text;
  removePatterns[locale].forEach((pattern) => {
    title = title.replace(pattern, "");
  });
  title = title.replace(/\s+/g, " ").trim() || t.assistant.responses.defaultReminderTitle;

  const payload = reminderSchema.parse({
    title,
    description: t.assistant.responses.defaultReminderDescription,
    remind_at: targetDate.toISOString(),
    repeat_type: "none",
    priority: "medium",
    status: "active",
  });

  const { data, error } = await supabase
    .from("reminders")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getMonthSummary(userId: string) {
  const supabase = await createServerSupabaseClient();
  return getMonthlySummary(supabase, userId);
}
