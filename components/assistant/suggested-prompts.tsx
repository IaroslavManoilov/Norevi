import { useI18n } from "@/components/i18n/i18n-provider";

export function SuggestedPrompts({ onSelect }: { onSelect: (value: string) => Promise<void> }) {
  const { t } = useI18n();
  const prompts = t.assistant.suggested;

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-[var(--text-soft)] transition hover:border-[var(--brand-200)] hover:bg-[var(--mint-100)] hover:text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)] dark:text-[var(--text-dark)] dark:hover:border-[var(--brand-700)] dark:hover:bg-[var(--brand-900)] dark:hover:text-white"
          type="button"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
