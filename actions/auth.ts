"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}
