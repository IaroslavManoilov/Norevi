import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { foodPlanSchema } from "@/lib/validations/schemas";

function resolveMonthDate(month?: string | null) {
  if (!month) return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return null;
  return new Date(year, monthIndex, 1);
}

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const monthParam = new URL(request.url).searchParams.get("month");
  const monthDate = resolveMonthDate(monthParam);
  if (!monthDate) return NextResponse.json({ error: "invalid_month" }, { status: 400 });

  const { data, error } = await supabase
    .from("food_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("month_date", monthDate.toISOString().slice(0, 10))
    .maybeSingle();

  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 200 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = foodPlanSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });

  const monthDate = resolveMonthDate(payload.data.month);
  if (!monthDate) return NextResponse.json({ error: "invalid_month" }, { status: 400 });

  const { data, error } = await supabase
    .from("food_plans")
    .upsert(
      {
        user_id: user.id,
        month_date: monthDate.toISOString().slice(0, 10),
        planned_daily: payload.data.planned_daily,
        planned_monthly: payload.data.planned_monthly,
        food_goal: payload.data.food_goal,
      },
      { onConflict: "user_id,month_date" }
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
