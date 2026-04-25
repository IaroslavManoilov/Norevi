import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type TransactionPayload = {
  type: "income" | "expense";
  amount: number;
  title: string;
  note?: string | null;
  category_id?: string | null;
  transaction_date: string;
};

export async function createTransaction(supabase: ServerSupabase, userId: string, payload: TransactionPayload) {
  return supabase
    .from("transactions")
    .insert({ ...payload, user_id: userId, category_id: payload.category_id || null })
    .select("*")
    .single();
}

export async function updateTransaction(
  supabase: ServerSupabase,
  userId: string,
  id: string,
  payload: Partial<TransactionPayload>
) {
  const updateData = { ...payload } as Record<string, unknown>;
  if ("category_id" in payload) {
    updateData.category_id = payload.category_id || null;
  }

  return supabase
    .from("transactions")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
}

export async function deleteTransaction(supabase: ServerSupabase, userId: string, id: string) {
  return supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
}
