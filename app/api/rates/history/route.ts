import { NextResponse } from "next/server";
import { hasRouteError, requireRouteUser } from "@/features/shared/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { data, error } = await auth.supabase
    .from("exchange_rates_history")
    .select("id, base_currency, rates, sources, created_at")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false })
    .limit(14);

  if (error) {
    return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  }
  return NextResponse.json({ data });
}
