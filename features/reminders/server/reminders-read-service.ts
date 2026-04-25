import type { Reminder } from "@/types/domain";
import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export async function getReminders(supabase: ServerSupabase, userId: string) {
  const { data } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("remind_at", { ascending: true });
  return (data ?? []) as Reminder[];
}
