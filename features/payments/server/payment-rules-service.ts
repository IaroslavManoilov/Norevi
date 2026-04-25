import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type PaymentRulePayload = {
  pattern: string;
  category_id: string;
};

export async function listPaymentRules(supabase: ServerSupabase, userId: string) {
  return supabase.from("payment_rules").select("*").eq("user_id", userId).order("created_at");
}

export async function upsertPaymentRule(supabase: ServerSupabase, userId: string, payload: PaymentRulePayload) {
  return supabase
    .from("payment_rules")
    .upsert({ ...payload, user_id: userId }, { onConflict: "user_id,pattern" })
    .select("*")
    .single();
}

export async function updatePaymentRule(
  supabase: ServerSupabase,
  userId: string,
  id: string,
  payload: PaymentRulePayload
) {
  return supabase.from("payment_rules").update(payload).eq("id", id).eq("user_id", userId).select("*").single();
}

export async function deletePaymentRule(supabase: ServerSupabase, userId: string, id: string) {
  return supabase.from("payment_rules").delete().eq("id", id).eq("user_id", userId);
}
