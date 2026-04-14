import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function requireOnboarded() {
  if (!hasSupabaseEnv()) redirect("/auth/sign-in?setup=supabase");
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return { supabase, user, profile };
}

export async function requireAuthOnly() {
  if (!hasSupabaseEnv()) redirect("/auth/sign-in?setup=supabase");
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();

  return { supabase, user, profile };
}
