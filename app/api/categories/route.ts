import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const type = new URL(request.url).searchParams.get("type");

  let query = supabase.from("categories").select("*").eq("user_id", user.id);
  if (type === "income" || type === "expense") {
    query = query.eq("type", type);
  }

  const { data, error } = await query.order("created_at");
  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 200 });
  return NextResponse.json({ data });
}
