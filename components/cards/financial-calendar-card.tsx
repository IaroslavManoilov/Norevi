import Link from "next/link";
import { CalendarDays, BellRing } from "lucide-react";
import type { Bill, Reminder, Note } from "@/types/domain";
import { Card } from "@/components/ui/card";
import { ReminderCalendar } from "@/components/shared/reminder-calendar";
import { formatDateRu, formatDateTimeRu } from "@/lib/formatters";
import { getTranslations } from "@/lib/i18n/translations";

type EventItem = {
  id: string;
  type: "bill" | "reminder";
  title: string;
  when: string;
  href: string;
};

export function FinancialCalendarCard({
  bills,
  reminders,
  notes = [],
  language = "en",
  variant = "calendar",
  showHeader = true,
}: {
  bills: Bill[];
  reminders: Reminder[];
  notes?: Note[];
  language?: "ru" | "en" | "ro";
  variant?: "calendar" | "list";
  showHeader?: boolean;
}) {
  const t = getTranslations(language);
  const headerHint = variant === "calendar" ? t.calendarPlanner.hint : t.bills.calendarSubtitle;
  const items: EventItem[] =
    variant === "list"
      ? [
          ...bills
            .filter((bill) => bill.status !== "paid")
            .map((bill) => ({
              id: bill.id,
              type: "bill" as const,
              title: bill.title,
              when: bill.due_date,
              href: `/bills/${bill.id}`,
            })),
          ...reminders
            .filter((reminder) => reminder.status === "active")
            .map((reminder) => ({
              id: reminder.id,
              type: "reminder" as const,
              title: reminder.title,
              when: reminder.remind_at,
              href: `/reminders/${reminder.id}`,
            })),
        ]
          .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
          .slice(0, 6)
      : [];

  return (
    <Card className="min-h-[250px]">
      {showHeader ? (
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--mint-100)] text-[var(--brand-800)]">
            <CalendarDays size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-700)]">Norevi Flow</p>
            <h3 className="text-xl font-bold">{t.calendarPlanner.title}</h3>
            <p className="text-sm text-[var(--text-muted)]">{headerHint}</p>
          </div>
        </div>
      ) : null}

      {variant === "calendar" ? (
        <ReminderCalendar
          reminders={reminders}
          notes={notes}
          language={language}
          showHeader={false}
          showHint={false}
          withCard={false}
        />
      ) : items.length ? (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2.5 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                    item.type === "bill"
                      ? "bg-[var(--brand-100)] text-[var(--brand-800)]"
                      : "bg-[var(--mint-100)] text-[var(--brand-800)]"
                  }`}
                >
                  {item.type === "bill" ? <CalendarDays size={14} /> : <BellRing size={14} />}
                </span>
                <div className="min-w-0">
                  <Link href={item.href} className="truncate text-sm font-semibold text-[var(--text)]">
                    {item.title}
                  </Link>
                  <p className="text-xs text-[var(--text-muted)]">
                    {item.type === "bill" ? formatDateRu(item.when, language) : formatDateTimeRu(item.when, language)}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-soft)] dark:bg-[var(--surface-dark)]">
                {item.type === "bill" ? t.bills.itemLabel : t.reminders.itemLabel}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">{t.bills.calendarSubtitle}</p>
      )}
    </Card>
  );
}
