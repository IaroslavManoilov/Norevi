import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { runScopedAssistant } from "@/lib/ai/assistant";
import { getTranslations } from "@/lib/i18n/translations";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { message?: string; conversationId?: string };
  const message = body.message?.trim();
  const { data: profile } = await supabase.from("profiles").select("currency, language").eq("user_id", user.id).single();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  if (!message) return NextResponse.json({ error: t.errors.emptyMessage }, { status: 400 });

  let conversationId = body.conversationId;
  if (!conversationId) {
    const { data: conversation } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, title: t.assistant.newDialog })
      .select("id")
      .single();
    conversationId = conversation?.id;
  }

  await supabase.from("ai_messages").insert({ conversation_id: conversationId, role: "user", content: message });
  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

  const answer = await runScopedAssistant(user.id, message, profile?.currency ?? "MDL", language);

  const { data: assistantMessage, error } = await supabase
    .from("ai_messages")
    .insert({ conversation_id: conversationId, role: "assistant", content: answer })
    .select("id, role, content")
    .single();
  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversationId, message: assistantMessage });
}
