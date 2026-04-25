import { TopBar } from "@/components/layout/top-bar";
import { AssistantChat } from "@/components/assistant/assistant-chat";
import { Card } from "@/components/ui/card";
import { AssistantMobileAction } from "@/components/navigation/assistant-mobile-action";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";

export default async function AssistantPage() {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  const { data: conversation } = await supabase
    .from("ai_conversations")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let messages: { id: string; role: "user" | "assistant"; content: string }[] = [];

  if (conversation?.id) {
    const { data } = await supabase
      .from("ai_messages")
      .select("id, role, content")
      .eq("conversation_id", conversation.id)
      .in("role", ["user", "assistant"])
      .order("created_at", { ascending: true })
      .limit(30);

    messages = (data ?? []) as { id: string; role: "user" | "assistant"; content: string }[];
  }

  const userMessagesCount = messages.filter((m) => m.role === "user").length;
  const assistantMessagesCount = messages.filter((m) => m.role === "assistant").length;

  return (
    <div>
      <TopBar
        title={t.assistant.title}
        subtitle={t.assistant.subtitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Card className="min-h-[108px] sm:min-h-[124px]">
          <p className="text-sm text-[var(--text-soft)]">{t.assistant.activeDialog}</p>
          <p className="mt-2 text-2xl font-semibold">{conversation?.id ? t.common.yes : t.assistant.newDialog}</p>
        </Card>
        <Card className="min-h-[108px] sm:min-h-[124px]">
          <p className="text-sm text-[var(--text-soft)]">{t.assistant.yourMessages}</p>
          <p className="mt-2 text-2xl font-semibold [font-variant-numeric:tabular-nums]">{userMessagesCount}</p>
        </Card>
        <Card className="min-h-[108px] sm:min-h-[124px]">
          <p className="text-sm text-[var(--text-soft)]">{t.assistant.assistantReplies}</p>
          <p className="mt-2 text-2xl font-semibold [font-variant-numeric:tabular-nums]">{assistantMessagesCount}</p>
        </Card>
      </div>
      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
        <AssistantChat initialMessages={messages} conversationId={conversation?.id} />
      </div>
      <AssistantMobileAction label={t.assistant.send} />
    </div>
  );
}
