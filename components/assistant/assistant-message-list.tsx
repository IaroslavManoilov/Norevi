import { useI18n } from "@/components/i18n/i18n-provider";

export function AssistantMessageList({
  messages,
}: {
  messages: { id: string; role: "user" | "assistant"; content: string }[];
}) {
  const { t } = useI18n();
  if (!messages.length) {
    return (
      <div className="rounded-[16px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm text-[var(--text-muted)]">
        {t.assistant.emptyHistory}
      </div>
    );
  }

  return (
    <div className="max-h-[520px] space-y-3 overflow-y-auto rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.role === "assistant"
              ? "mr-10 rounded-[16px] border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--text)]"
              : "ml-10 rounded-[16px] bg-[var(--brand-700)] p-3 text-sm text-white"
          }
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}
