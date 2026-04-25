import type { ServerSupabase } from "@/features/shared/server/supabase-types";

type SettingsPayload = {
  full_name?: string | null;
  currency?: string;
  language?: "ru" | "en" | "ro";
  timezone?: string;
  theme?: "system" | "light" | "dark";
  monthly_budget_limit?: number | null;
  exchange_rates?: Record<string, number> | null;
};

type OnboardingPayload = {
  currency: string;
  language: "ru" | "en" | "ro";
  monthly_budget_limit?: number | null;
};

export async function updateSettings(supabase: ServerSupabase, userId: string, payload: SettingsPayload) {
  return supabase.from("profiles").update(payload).eq("user_id", userId).select("*").single();
}

export async function completeOnboarding(supabase: ServerSupabase, userId: string, payload: OnboardingPayload) {
  return supabase.from("profiles").update({ ...payload, onboarding_completed: true }).eq("user_id", userId);
}
