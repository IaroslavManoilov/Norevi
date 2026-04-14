import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { paymentRuleSchema } from "@/lib/validations/schemas";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("payment_rules")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at");

  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = paymentRuleSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });

  const { data, error } = await supabase
    .from("payment_rules")
    .upsert({ ...payload.data, user_id: user.id }, { onConflict: "user_id,pattern" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
