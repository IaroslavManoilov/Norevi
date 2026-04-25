import type { FavoriteItem } from "@/types/domain";
import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export async function getFavoriteItems(supabase: ServerSupabase, userId: string, kind = "food") {
  const { data } = await supabase
    .from("favorite_items")
    .select("*")
    .eq("user_id", userId)
    .eq("kind", kind)
    .order("created_at", { ascending: true });
  return (data ?? []) as FavoriteItem[];
}
