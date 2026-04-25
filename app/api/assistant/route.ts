import { NextResponse } from "next/server";
import { runScopedAssistant } from "@/lib/ai/assistant";
import { getTranslations } from "@/lib/i18n/translations";
import { hasRouteError, requireRouteUser } from "@/features/shared/server/route-auth";

export async function POST(request: Request) {
  const auth = await requireRouteUser();
  if (hasRouteError(auth)) return auth.response;
  const supabase = auth.supabase;
  const body = (await request.json()) as { message?: string; conversationId?: string };
  const message = body.message?.trim();
  const { data: profile } = await supabase.from("profiles").select("currency, language").eq("user_id", auth.userId).single();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  if (!message) return NextResponse.json({ error: t.errors.emptyMessage }, { status: 400 });

  let conversationId = body.conversationId;
  if (!conversationId) {
    const { data: conversation } = await supabase
      .from("ai_conversations")
      .insert({ user_id: auth.userId, title: t.assistant.newDialog })
      .select("id")
      .single();
    conversationId = conversation?.id;
  }

  await supabase.from("ai_messages").insert({ conversation_id: conversationId, role: "user", content: message });
  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

  const answer = await runScopedAssistant(auth.userId, message, profile?.currency ?? "MDL", language);

  const { data: assistantMessage, error } = await supabase
    .from("ai_messages")
    .insert({ conversation_id: conversationId, role: "assistant", content: answer })
    .select("id, role, content")
    .single();
  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversationId, message: assistantMessage });
}
