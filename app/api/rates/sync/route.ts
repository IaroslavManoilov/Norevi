import { NextResponse } from "next/server";
import { hasRouteError, requireRouteUser } from "@/features/shared/server/route-auth";
import { fetchRates, resolveBaseCurrency } from "@/lib/rates/fetch-rates";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;

  const { data: profile } = await auth.supabase.from("profiles").select("currency").eq("user_id", auth.userId).single();
  const { searchParams } = new URL(request.url);
  const base = resolveBaseCurrency(searchParams.get("base") ?? profile?.currency ?? "MDL");

  const payload = await fetchRates(base);

  await auth.supabase
    .from("profiles")
    .update({ exchange_rates: payload.rates })
    .eq("user_id", auth.userId);

  await auth.supabase.from("exchange_rates_history").insert({
    user_id: auth.userId,
    base_currency: base,
    rates: payload.rates,
    sources: payload.sources,
  });

  return NextResponse.json(payload);
}
