import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export async function listCategories(supabase: ServerSupabase, userId: string, type?: "income" | "expense") {
  let query = supabase.from("categories").select("*").eq("user_id", userId);
  if (type) {
    query = query.eq("type", type);
  }
  return query.order("created_at");
}

export async function resolveOrCreateCategory(
  supabase: ServerSupabase,
  userId: string,
  input: { name: string; type: "income" | "expense" }
) {
  const name = input.name.trim();
  const { data: existing } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .ilike("name", name)
    .eq("type", input.type)
    .maybeSingle();

  if (existing) {
    return { data: existing, error: null };
  }

  return supabase
    .from("categories")
    .insert({
      user_id: userId,
      name,
      type: input.type,
      is_default: false,
    })
    .select("*")
    .single();
}
