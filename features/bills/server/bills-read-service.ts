import { endOfMonth, format } from "date-fns";
import type { Bill } from "@/types/domain";
import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export async function getBills(supabase: ServerSupabase, userId: string) {
  const { data } = await supabase.from("bills").select("*").eq("user_id", userId).order("due_date");
  return (data ?? []) as Bill[];
}

export async function getUpcomingBillsWithinMonth(supabase: ServerSupabase, userId: string, date = new Date()) {
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

export async function getBillsForDateRange(supabase: ServerSupabase, userId: string, startDate: Date, endDate: Date) {
  const { data } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .gte("due_date", format(startDate, "yyyy-MM-dd"))
    .lte("due_date", format(endDate, "yyyy-MM-dd"))
    .order("due_date", { ascending: true });
  return (data ?? []) as Bill[];
}

export async function recalculateBillStatuses(supabase: ServerSupabase, userId: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  await supabase
    .from("bills")
    .update({ status: "overdue" })
    .eq("user_id", userId)
    .neq("status", "paid")
    .lt("due_date", today);
}
