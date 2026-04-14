import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { transactionSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = transactionSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });

  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...payload.data, user_id: user.id, category_id: payload.data.category_id || null })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
