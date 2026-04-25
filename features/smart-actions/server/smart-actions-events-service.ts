import type { ServerSupabase } from "@/features/shared/server/supabase-types";

export type SmartActionEventType = "view" | "click" | "complete" | "dismiss";

export async function logSmartActionEvent(
  supabase: ServerSupabase,
  userId: string,
  payload: {
    action_id: string;
    event_type: SmartActionEventType;
    variant: "A" | "B";
    position?: number | null;
    score?: number | null;
    meta?: Record<string, unknown> | null;
  }
) {
  const result = await supabase.from("smart_action_events").insert({
    user_id: userId,
    action_id: payload.action_id,
    event_type: payload.event_type,
    variant: payload.variant,
    position: payload.position ?? null,
    score: payload.score ?? null,
    meta: payload.meta ?? null,
  });
  const maybeCode = (result.error as { code?: string } | null)?.code;
  if (maybeCode === "42P01") {
    return { error: null };
  }
  return result;
}

export async function getSmartActionPreferenceScores(supabase: ServerSupabase, userId: string) {
  const { data, error } = await supabase
    .from("smart_action_events")
    .select("action_id,event_type")
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString());

  const maybeCode = (error as { code?: string } | null)?.code;
  if (maybeCode === "42P01") {
    return {};
  }

  const map = new Map<string, number>();
  (data ?? []).forEach((item) => {
    const delta =
      item.event_type === "complete" ? 4 : item.event_type === "click" ? 2 : item.event_type === "dismiss" ? -2 : 0;
    map.set(item.action_id, (map.get(item.action_id) ?? 0) + delta);
  });

  return Object.fromEntries(map.entries());
}

export async function getSmartActionVariantPerformance(supabase: ServerSupabase, userId: string) {
  const { data, error } = await supabase
    .from("smart_action_events")
    .select("variant,event_type")
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString());

  const maybeCode = (error as { code?: string } | null)?.code;
  if (maybeCode === "42P01" || !data) {
    return {
      A: { views: 0, clicks: 0, completes: 0, dismisses: 0, engagementScore: 0 },
      B: { views: 0, clicks: 0, completes: 0, dismisses: 0, engagementScore: 0 },
    };
  }

  const init = () => ({ views: 0, clicks: 0, completes: 0, dismisses: 0, engagementScore: 0 });
  const stats = { A: init(), B: init() };
  data.forEach((item) => {
    const bucket = stats[item.variant as "A" | "B"];
    if (!bucket) return;
    if (item.event_type === "view") bucket.views += 1;
    if (item.event_type === "click") bucket.clicks += 1;
    if (item.event_type === "complete") bucket.completes += 1;
    if (item.event_type === "dismiss") bucket.dismisses += 1;
  });

  (["A", "B"] as const).forEach((variant) => {
    const bucket = stats[variant];
    const views = Math.max(1, bucket.views);
    bucket.engagementScore = (bucket.clicks + bucket.completes * 2 - bucket.dismisses) / views;
  });

  return stats;
}
