import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import type { Bill, FinanceSummary, Reminder, Transaction, FavoriteItem, Note } from "@/types/domain";

type SupabaseLike = Awaited<ReturnType<typeof import("@/lib/db/supabase-server").createServerSupabaseClient>>;

export const UNCATEGORIZED_KEY = "__uncategorized__";
export const NO_DATA_KEY = "__no_data__";

export async function getProfile(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
  return data;
}

export async function getTransactions(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase
    .from("transactions")
    .select("*, categories(name)")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });
  return (data ?? []) as (Transaction & { categories?: { name: string } | null })[];
}

export async function getBills(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase.from("bills").select("*").eq("user_id", userId).order("due_date");
  return (data ?? []) as Bill[];
}

export async function getReminders(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("remind_at", { ascending: true });
  return (data ?? []) as Reminder[];
}

export async function getNotes(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase.from("notes").select("*").eq("user_id", userId).order("note_date", { ascending: true });
  return (data ?? []) as Note[];
}

export async function getFavoriteItems(supabase: SupabaseLike, userId: string, kind = "food") {
  const { data } = await supabase
    .from("favorite_items")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", kind)
    .order("created_at", { ascending: true });
  return (data ?? []) as FavoriteItem[];
}

export async function getCategories(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase.from("categories").select("*").eq("user_id", userId).order("name");
  return data ?? [];
}

export async function getMonthlySummary(supabase: SupabaseLike, userId: string, date = new Date()): Promise<FinanceSummary> {
  const start = format(startOfMonth(date), "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");

  const { data } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId)
    .gte("transaction_date", start)
    .lte("transaction_date", end);

  const totals = (data ?? []).reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.income += Number(tx.amount);
      if (tx.type === "expense") acc.expense += Number(tx.amount);
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );

  totals.balance = totals.income - totals.expense;
  return totals;
}

export async function getBalance(supabase: SupabaseLike, userId: string) {
  const { data } = await supabase.from("transactions").select("type, amount").eq("user_id", userId);
  return (data ?? []).reduce((acc, item) => {
    if (item.type === "income") return acc + Number(item.amount);
    return acc - Number(item.amount);
  }, 0);
}

export async function getUpcomingBillsWithinMonth(supabase: SupabaseLike, userId: string, date = new Date()) {
  const today = format(date, "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");

  const { data } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "paid")
    .gte("due_date", today)
    .lte("due_date", end)
    .order("due_date", { ascending: true });

  return (data ?? []) as Bill[];
}

export async function getTopExpenseCategories(supabase: SupabaseLike, userId: string, date = new Date()) {
  const start = format(startOfMonth(date), "yyyy-MM-dd");
  const end = format(endOfMonth(date), "yyyy-MM-dd");
  const { data } = await supabase
    .from("transactions")
    .select("amount, category_id, categories(name)")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("transaction_date", start)
    .lte("transaction_date", end);

  const map = new Map<string, number>();
  (data ?? []).forEach((item) => {
    const raw = (item.categories as { name?: string } | null)?.name ?? "";
    const name = raw.trim() ? raw : UNCATEGORIZED_KEY;
    map.set(name, (map.get(name) ?? 0) + Number(item.amount));
  });

  return Array.from(map.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);
}

export async function recalculateBillStatuses(supabase: SupabaseLike, userId: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  await supabase
    .from("bills")
    .update({ status: "overdue" })
    .eq("user_id", userId)
    .neq("status", "paid")
    .lt("due_date", today);
}

export async function getExpenseAnalytics(supabase: SupabaseLike, userId: string, date = new Date()) {
  const currentStart = format(startOfMonth(date), "yyyy-MM-dd");
  const currentEnd = format(endOfMonth(date), "yyyy-MM-dd");
  const prevDate = subMonths(date, 1);
  const prevStart = format(startOfMonth(prevDate), "yyyy-MM-dd");
  const prevEnd = format(endOfMonth(prevDate), "yyyy-MM-dd");

  const [currentRes, prevRes, sixMonthsRes] = await Promise.all([
    supabase
      .from("transactions")
      .select("amount, transaction_date, categories(name)")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", currentStart)
      .lte("transaction_date", currentEnd),
    supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", prevStart)
      .lte("transaction_date", prevEnd),
    supabase
      .from("transactions")
      .select("amount, transaction_date")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", format(startOfMonth(subMonths(date, 5)), "yyyy-MM-dd"))
      .lte("transaction_date", currentEnd),
  ]);

  const currentItems = currentRes.data ?? [];
  const prevItems = prevRes.data ?? [];
  const sixMonthsItems = sixMonthsRes.data ?? [];

  const currentTotal = currentItems.reduce((acc, item) => acc + Number(item.amount), 0);
  const prevTotal = prevItems.reduce((acc, item) => acc + Number(item.amount), 0);
  const changePercent = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;

  const daysElapsed = Math.max(1, date.getDate());
  const avgPerDay = currentTotal / daysElapsed;

  const categoryMap = new Map<string, number>();
  currentItems.forEach((item) => {
    const raw = (item.categories as { name?: string } | null)?.name ?? "";
    const name = raw.trim() ? raw : UNCATEGORIZED_KEY;
    categoryMap.set(name, (categoryMap.get(name) ?? 0) + Number(item.amount));
  });
  const topCategory = Array.from(categoryMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)[0] ?? { name: NO_DATA_KEY, amount: 0 };

  const activeDays = new Set(currentItems.map((i) => i.transaction_date)).size;
  const focusScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, changePercent))));

  const trendMap = new Map<string, number>();
  sixMonthsItems.forEach((item) => {
    const month = String(item.transaction_date).slice(0, 7);
    trendMap.set(month, (trendMap.get(month) ?? 0) + Number(item.amount));
  });
  const monthlyTrend = Array.from(trendMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month: month.slice(5), amount }));

  return {
    currentTotal,
    prevTotal,
    changePercent,
    avgPerDay,
    topCategory,
    activeDays,
    focusScore,
    monthlyTrend,
  };
}
