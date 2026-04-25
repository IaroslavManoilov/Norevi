import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type ReminderPayload = {
  title: string;
  description?: string | null;
  remind_at: string;
  repeat_type: "none" | "daily" | "weekly" | "monthly";
  priority: "low" | "medium" | "high";
  status: "active" | "done" | "cancelled";
};

export async function createReminderWithNotification(
  supabase: ServerSupabase,
  userId: string,
  payload: ReminderPayload
) {
  const { data, error } = await supabase.from("reminders").insert({ ...payload, user_id: userId }).select("*").single();

  if (error || !data) {
    return { data: null, error };
  }

  await supabase.from("notifications").insert({
    user_id: userId,
    type: "reminder",
    title: data.title,
    body: data.description ?? "",
    scheduled_for: data.remind_at,
    status: "pending",
  });

  return { data, error: null };
}

export async function updateReminder(
  supabase: ServerSupabase,
  userId: string,
  id: string,
  payload: Partial<ReminderPayload>
) {
  return supabase.from("reminders").update(payload).eq("id", id).eq("user_id", userId).select("*").single();
}

export async function deleteReminder(supabase: ServerSupabase, userId: string, id: string) {
  return supabase.from("reminders").delete().eq("id", id).eq("user_id", userId);
}
