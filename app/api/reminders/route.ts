import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { reminderSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = reminderSchema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });

  const { data, error } = await supabase
    .from("reminders")
    .insert({ ...payload.data, user_id: user.id })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "reminder",
    title: data.title,
    body: data.description ?? "",
    scheduled_for: data.remind_at,
    status: "pending",
  });
  return NextResponse.json({ data });
}
