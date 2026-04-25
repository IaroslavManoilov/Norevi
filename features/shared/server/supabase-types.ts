import { createServerSupabaseClient } from "@/lib/db/supabase-server";

export type ServerSupabase = Awaited<ReturnType<typeof createServerSupabaseClient>>;
