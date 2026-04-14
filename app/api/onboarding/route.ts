import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { onboardingSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = onboardingSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ ...payload.data, onboarding_completed: true })
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
