"use client";

import Link from "next/link";
import type { Reminder } from "@/types/domain";
import { formatDateTimeRu } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickMarkReminderDoneButton } from "@/components/shared/quick-mark-reminder-done-button";
import { EmptyState } from "@/components/shared/empty-state";
import { useI18n } from "@/components/i18n/i18n-provider";

export function RemindersList({ reminders, language }: { reminders: Reminder[]; language?: "ru" | "en" | "ro" }) {
  const { t } = useI18n();
  if (!reminders.length) {
    return <EmptyState title={t.reminders.emptyTitle} description={t.reminders.emptyDescription} />;
  }

  const priorityLabel: Record<Reminder["priority"], string> = {
    low: t.reminders.priorityLow,
    medium: t.reminders.priorityMedium,
    high: t.reminders.priorityHigh,
  };

  const statusLabel: Record<Reminder["status"], string> = {
    active: t.reminders.active,
    done: t.reminders.done,
    cancelled: t.reminders.cancelled,
  };

  return (
    <>
      <div className="space-y-3 md:hidden">
        {reminders.map((reminder) => (
          <article
            key={reminder.id}
            className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/reminders/${reminder.id}`} className="font-semibold text-[var(--text)]">
                  {reminder.title}
                </Link>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {formatDateTimeRu(reminder.remind_at, language)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge tone={reminder.priority === "high" ? "danger" : reminder.priority === "medium" ? "warning" : "neutral"}>
                  {priorityLabel[reminder.priority]}
                </Badge>
                <Badge tone={reminder.status === "done" ? "success" : reminder.status === "cancelled" ? "danger" : "neutral"}>
                  {statusLabel[reminder.status]}
                </Badge>
              </div>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {reminder.status === "active" ? <QuickMarkReminderDoneButton reminderId={reminder.id} /> : null}
              <Link href={`/reminders/${reminder.id}`}>
                <Button variant="secondary" className="h-8 px-3 text-xs">
                  {t.actions.open}
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden md:block space-y-3">
        {reminders.map((reminder) => (
          <article
            key={reminder.id}
            className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-200)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/reminders/${reminder.id}`} className="font-semibold text-[var(--text)]">
                  {reminder.title}
                </Link>
                <p className="truncate text-sm text-[var(--text-soft)]">{formatDateTimeRu(reminder.remind_at, language)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={reminder.priority === "high" ? "danger" : reminder.priority === "medium" ? "warning" : "neutral"}>
                  {priorityLabel[reminder.priority]}
                </Badge>
                <Badge tone={reminder.status === "done" ? "success" : reminder.status === "cancelled" ? "danger" : "neutral"}>
                  {statusLabel[reminder.status]}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {reminder.status === "active" ? <QuickMarkReminderDoneButton reminderId={reminder.id} /> : null}
              <Link href={`/reminders/${reminder.id}`}>
                <Button variant="secondary" className="h-9">
                  {t.actions.open}
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
