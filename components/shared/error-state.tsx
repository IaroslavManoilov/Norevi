import { useI18n } from "@/components/i18n/i18n-provider";

export function ErrorState({ message }: { message?: string }) {
  const { t } = useI18n();
  const text = message ?? t.common.error;
  return (
    <div className="rounded-[16px] border border-[var(--danger)]/40 bg-[var(--surface)] p-4 text-sm text-[var(--danger)]">
      {text}
    </div>
  );
}
