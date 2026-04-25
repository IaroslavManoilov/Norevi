import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type FavoritePayload = {
  title: string;
  kind: string;
};

export async function listFavoriteItems(supabase: ServerSupabase, userId: string) {
  return supabase.from("favorite_items").select("*").eq("user_id", userId).order("created_at");
}

export async function upsertFavoriteItem(supabase: ServerSupabase, userId: string, payload: FavoritePayload) {
  return supabase
    .from("favorite_items")
    .upsert({ ...payload, user_id: userId }, { onConflict: "user_id,kind,title" })
    .select("*")
    .single();
}

export async function deleteFavoriteItem(supabase: ServerSupabase, userId: string, id: string) {
  return supabase.from("favorite_items").delete().eq("id", id).eq("user_id", userId);
}
