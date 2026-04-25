import { NextResponse } from "next/server";
import { foodPlanSchema } from "@/lib/validations/schemas";
import { getFoodPlanByMonth, resolveMonthDate, upsertFoodPlan } from "@/features/food/server/food-plans-service";
import { hasRouteError, parseJsonWithSchema, requireRouteUser } from "@/features/shared/server/route-auth";

export async function GET(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const monthParam = new URL(request.url).searchParams.get("month");
  const monthDate = resolveMonthDate(monthParam);
  if (!monthDate) return NextResponse.json({ error: "invalid_month" }, { status: 400 });

  const { data, error } = await getFoodPlanByMonth(auth.supabase, auth.userId, monthDate);
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 200 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const payload = await parseJsonWithSchema(request, foodPlanSchema);
  if (hasRouteError(payload)) return payload.response;

  const { data, error } = await upsertFoodPlan(auth.supabase, auth.userId, payload.data);
  if (error) {
    const normalized = error as { message?: string; code?: string };
    const status = normalized?.code === "invalid_month" ? 400 : 400;
    return NextResponse.json({ error: normalized?.message ?? "request_failed" }, { status });
  }

  return NextResponse.json({ data });
}
