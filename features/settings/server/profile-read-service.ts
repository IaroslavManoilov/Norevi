import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export async function getProfile(supabase: ServerSupabase, userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
  return data;
}
