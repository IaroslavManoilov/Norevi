import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("exchange_rates_history")
    .select("id, base_currency, rates, sources, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(14);

  if (error) {
    return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  }
  return NextResponse.json({ data });
}
