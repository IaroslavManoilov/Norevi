import { NextResponse } from "next/server";
import { addHours, formatISO } from "date-fns";
import { createAdminSupabaseClient } from "@/lib/db/supabase-admin";

export async function POST() {
  const supabase = createAdminSupabaseClient();

  const now = new Date();
  const soon = addHours(now, 24);

  const { data: bills } = await supabase
    .from("bills")
    .select("user_id, title, due_date")
    .neq("status", "paid")
    .gte("due_date", now.toISOString().slice(0, 10))
    .lte("due_date", soon.toISOString().slice(0, 10));

  const { data: reminders } = await supabase
    .from("reminders")
    .select("user_id, title, remind_at")
    .eq("status", "active")
    .gte("remind_at", now.toISOString())
    .lte("remind_at", formatISO(soon));

  const queue = [
    ...(bills ?? []).map((bill) => ({
      user_id: bill.user_id,
      type: "bill",
      title: `Bill: ${bill.title}`,
      body: `Due soon: ${bill.due_date}`,
      scheduled_for: new Date().toISOString(),
    })),
    ...(reminders ?? []).map((item) => ({
      user_id: item.user_id,
      type: "reminder",
      title: `Reminder: ${item.title}`,
      body: "Reminder fired",
      scheduled_for: new Date(item.remind_at).toISOString(),
    })),
  ];

  if (queue.length) {
    await supabase.from("notifications").insert(queue);
  }

  return NextResponse.json({ queued: queue.length, message: "Queue prepared. Endpoint ready for cron." });
}
