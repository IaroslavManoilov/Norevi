import { addMonths, addWeeks, addYears, format } from "date-fns";
import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type BillPayload = {
  title: string;
  amount: number;
  due_date: string;
  repeat_type: "none" | "weekly" | "monthly" | "yearly";
  category?: string | null;
  status: "upcoming" | "paid" | "overdue";
  auto_renew: boolean;
  note?: string | null;
};

export async function createBill(supabase: ServerSupabase, userId: string, payload: BillPayload) {
  return supabase.from("bills").insert({ ...payload, user_id: userId }).select("*").single();
}

export async function updateBillAndScheduleRecurrence(
  supabase: ServerSupabase,
  userId: string,
  id: string,
  payload: Partial<BillPayload>
) {
  const { data: currentBill } = await supabase.from("bills").select("*").eq("id", id).eq("user_id", userId).single();
  if (!currentBill) {
    return { data: null, error: { message: "Bill not found", code: "not_found" } };
  }

  const { data, error } = await supabase
    .from("bills")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    return { data: null, error };
  }

  const effectiveBill = { ...currentBill, ...data } as BillPayload & { due_date: string; status: string };
  const becamePaid = currentBill.status !== "paid" && effectiveBill.status === "paid";
  const isRecurring = effectiveBill.repeat_type !== "none" && effectiveBill.auto_renew;

  if (becamePaid && isRecurring) {
    const baseDate = new Date(effectiveBill.due_date);
    const nextDate =
      effectiveBill.repeat_type === "weekly"
        ? addWeeks(baseDate, 1)
        : effectiveBill.repeat_type === "monthly"
          ? addMonths(baseDate, 1)
          : addYears(baseDate, 1);

    await supabase.from("bills").insert({
      user_id: userId,
      title: effectiveBill.title,
      amount: effectiveBill.amount,
      due_date: format(nextDate, "yyyy-MM-dd"),
      repeat_type: effectiveBill.repeat_type,
      category: effectiveBill.category,
      status: "upcoming",
      auto_renew: effectiveBill.auto_renew,
      note: effectiveBill.note,
    });
  }

  return { data, error: null };
}

export async function deleteBill(supabase: ServerSupabase, userId: string, id: string) {
  return supabase.from("bills").delete().eq("id", id).eq("user_id", userId);
}
