import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Bell, Wallet, Calculator, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTranslations } from "@/lib/i18n/translations";

export function QuickActionsCard({
  title,
  hint,
  labels,
  language = "en",
}: {
  title?: string;
  hint?: string;
  labels?: {
    expense: string;
    income: string;
    bill: string;
    reminder: string;
    calculator: string;
    calendar: string;
  };
  language?: "ru" | "en" | "ro";
}) {
  const t = getTranslations(language);
  const resolvedLabels = labels ?? {
    expense: t.actions.addExpense,
    income: t.actions.addIncome,
    bill: t.actions.addBill,
    reminder: t.actions.addReminder,
    calculator: t.nav.calculator,
    calendar: t.nav.calendar,
  };
  const resolvedTitle = title ?? t.dashboard.quickActions;
  const resolvedHint = hint ?? t.dashboard.quickActionsHint;
  const items = [
    { href: "/finance/new", label: resolvedLabels.expense, icon: ArrowDownLeft, accentInDark: true },
    { href: "/finance/new?type=income", label: resolvedLabels.income, icon: ArrowUpRight, accentInDark: false },
    { href: "/bills/new", label: resolvedLabels.bill, icon: Wallet, accentInDark: false },
    { href: "/reminders/new", label: resolvedLabels.reminder, icon: Bell, accentInDark: false },
    { href: "/finance/calculator", label: resolvedLabels.calculator, icon: Calculator, accentInDark: false },
    { href: "/bills/calendar", label: resolvedLabels.calendar, icon: CalendarDays, accentInDark: false },
  ];

  return (
    <Card className="min-h-0 sm:min-h-[320px]">
      <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <p className="text-2xl leading-tight font-bold tracking-tight text-[var(--text)] sm:text-[32px]">
          {resolvedTitle}
        </p>
        <span className="text-sm text-[var(--text-muted)]">{resolvedHint}</span>
      </div>
      <div className="space-y-2 sm:space-y-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-[14px] border px-3 py-2.5 transition sm:rounded-[16px] sm:px-4 sm:py-3",
                "border-[var(--brand-600)] bg-[var(--brand-700)] text-white hover:border-[var(--brand-700)] hover:bg-[var(--brand-800)]",
                item.accentInDark
                  ? "dark:border-[var(--brand-700)] dark:bg-[var(--brand-700)] dark:text-white dark:hover:bg-[var(--brand-800)]"
                  : "dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)] dark:hover:border-[var(--brand-700)] dark:hover:bg-[var(--brand-900)]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-8 w-8 items-center justify-center rounded-full transition sm:h-9 sm:w-9",
                  "bg-white/15 text-white group-hover:bg-white/25",
                  item.accentInDark
                    ? "dark:bg-white/15 dark:text-white dark:group-hover:bg-white/20"
                    : "dark:bg-[var(--surface-dark)] dark:text-[var(--brand-200)]",
                ].join(" ")}
              >
                <Icon size={16} />
              </span>
              <span
                className={[
                  "text-sm leading-none font-semibold tracking-tight text-white sm:text-lg",
                  item.accentInDark ? "dark:text-white" : "dark:text-[var(--text-dark)]",
                ].join(" ")}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
