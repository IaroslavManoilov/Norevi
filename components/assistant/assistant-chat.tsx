"use client";

import { useState } from "react";
import { AssistantComposer } from "@/components/assistant/assistant-composer";
import { AssistantMessageList } from "@/components/assistant/assistant-message-list";
import { SuggestedPrompts } from "@/components/assistant/suggested-prompts";
import { useI18n } from "@/components/i18n/i18n-provider";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AssistantChat({
  initialMessages,
  conversationId,
}: {
  initialMessages: ChatMessage[];
  conversationId?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleSend = async (text: string) => {
    if (loading) return;
    setLoading(true);
    const userMessage = { id: crypto.randomUUID(), role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId: activeConversationId }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: t.errors.assistantResponse },
        ]);
        return;
      }

      const data = (await res.json()) as { conversationId?: string; message: ChatMessage };
      if (data.conversationId) {
        setActiveConversationId(data.conversationId);
      }
      setMessages((prev) => [...prev, { id: data.message.id, role: "assistant", content: data.message.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: t.errors.assistantNetwork },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--text-soft)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)]">
        {t.assistant.helperHint}
      </div>
      <SuggestedPrompts onSelect={handleSend} />
      <AssistantMessageList messages={messages} />
      <AssistantComposer onSend={handleSend} loading={loading} />
    </div>
  );
}
