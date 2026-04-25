import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export function resolveMonthDate(month?: string | null) {
  if (!month) return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return null;
  return new Date(year, monthIndex, 1);
}

export async function getFoodPlanByMonth(supabase: ServerSupabase, userId: string, monthDate: Date) {
  return supabase
    .from("food_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("month_date", monthDate.toISOString().slice(0, 10))
    .maybeSingle();
}

export async function upsertFoodPlan(
  supabase: ServerSupabase,
  userId: string,
  payload: { month: string; planned_daily: number; planned_monthly: number; food_goal: number }
) {
  const monthDate = resolveMonthDate(payload.month);
  if (!monthDate) {
    return { data: null, error: { message: "invalid_month", code: "invalid_month" } };
  }

  return supabase
    .from("food_plans")
    .upsert(
      {
        user_id: userId,
        month_date: monthDate.toISOString().slice(0, 10),
        planned_daily: payload.planned_daily,
        planned_monthly: payload.planned_monthly,
        food_goal: payload.food_goal,
      },
      { onConflict: "user_id,month_date" }
    )
    .select("*")
    .single();
}
