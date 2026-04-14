import { NextResponse } from "next/server";
import { addMonths, addWeeks, addYears, format } from "date-fns";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { billSchema } from "@/lib/validations/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = billSchema.partial().safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });

  const { data: currentBill } = await supabase.from("bills").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!currentBill) return NextResponse.json({ error: "Bill not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("bills")
    .update(payload.data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const effectiveBill = { ...currentBill, ...data };
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
      user_id: user.id,
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

  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("bills").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
