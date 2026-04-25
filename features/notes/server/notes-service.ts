import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type NotePayload = {
  title: string;
  body?: string | null;
  note_date: string;
};

export async function listNotes(supabase: ServerSupabase, userId: string) {
  return supabase.from("notes").select("*").eq("user_id", userId).order("note_date", { ascending: true });
}

export async function createNote(supabase: ServerSupabase, userId: string, payload: NotePayload) {
  return supabase.from("notes").insert({ ...payload, user_id: userId }).select("*").single();
}
