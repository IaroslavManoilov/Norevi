import type { Note } from "@/types/domain";
import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export async function getNotes(supabase: ServerSupabase, userId: string) {
  const { data } = await supabase.from("notes").select("*").eq("user_id", userId).order("note_date", { ascending: true });
  return (data ?? []) as Note[];
}
