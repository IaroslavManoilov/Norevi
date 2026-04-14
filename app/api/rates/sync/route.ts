import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { fetchRates, resolveBaseCurrency } from "@/lib/rates/fetch-rates";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("currency").eq("user_id", user.id).single();
  const { searchParams } = new URL(request.url);
  const base = resolveBaseCurrency(searchParams.get("base") ?? profile?.currency ?? "MDL");

  const payload = await fetchRates(base);

  await supabase
    .from("profiles")
    .update({ exchange_rates: payload.rates })
    .eq("user_id", user.id);

  await supabase.from("exchange_rates_history").insert({
    user_id: user.id,
    base_currency: base,
    rates: payload.rates,
    sources: payload.sources,
  });

  return NextResponse.json(payload);
}
