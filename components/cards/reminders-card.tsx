import Link from "next/link";
import type { Reminder } from "@/types/domain";
import { formatDateTimeRu } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/lib/i18n/translations";

export function RemindersCard({
  reminders,
  language = "en",
  labels,
}: {
  reminders: Reminder[];
  language?: "ru" | "en" | "ro";
  labels?: {
    title: string;
    hint: string;
    empty: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
  };
}) {
  const t = getTranslations(language);
  const resolved = labels ?? {
    title: t.dashboard.reminders,
    hint: t.dashboard.quickActionsHint,
    empty: t.reminders.emptyDescription,
    priorityLow: t.reminders.priorityLow,
    priorityMedium: t.reminders.priorityMedium,
    priorityHigh: t.reminders.priorityHigh,
  };
  const priorityLabel: Record<Reminder["priority"], string> = {
    low: resolved.priorityLow,
    medium: resolved.priorityMedium,
    high: resolved.priorityHigh,
  };
  return (
    <Card className="min-h-[190px]">
      <SectionHeader title={resolved.title} hint={resolved.hint} />
      {reminders.length ? (
        <ul className="space-y-2">
          {reminders.slice(0, 5).map((reminder) => (
            <li
              key={reminder.id}
              className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <Link href={`/reminders/${reminder.id}`} className="truncate text-base font-semibold text-[var(--text)]">
                  {reminder.title}
                </Link>
                <p className="text-xs text-[var(--text-muted)]">{formatDateTimeRu(reminder.remind_at, language)}</p>
              </div>
              <Badge tone={reminder.priority === "high" ? "danger" : reminder.priority === "medium" ? "warning" : "neutral"}>
                {priorityLabel[reminder.priority]}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">{resolved.empty}</p>
      )}
    </Card>
  );
}
