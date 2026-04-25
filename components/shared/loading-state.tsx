import { useI18n } from "@/components/i18n/i18n-provider";

export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n();
  const text = label ?? t.common.loading;
  return <div className="rounded-[16px] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-soft)]">{text}</div>;
}
