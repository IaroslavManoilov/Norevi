import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { categoryResolveSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = categoryResolveSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });

  const name = payload.data.name.trim();
  const type = payload.data.type;

  const { data: existing } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .ilike("name", name)
    .eq("type", type)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ data: existing });
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name,
      type,
      is_default: false,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
