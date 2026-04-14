"use server";

import { createServerSupabaseClient } from "@/lib/db/supabase-server";

const LANGUAGES = new Set(["ru", "en", "ro"]);

export async function updateLanguage(formData: FormData) {
  const language = String(formData.get("language") ?? "");
  if (!LANGUAGES.has(language)) return;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false };
  }

  await supabase.from("profiles").update({ language }).eq("user_id", user.id);
  return { ok: true };
}
