"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function MobileQuickActions({
  labels,
}: {
  labels: {
    expense: string;
    income: string;
    bill: string;
    reminder: string;
  };
}) {
  const actions = [
    { href: "/finance/new", label: labels.expense, icon: ArrowDownLeft },
    { href: "/finance/new?type=income", label: labels.income, icon: ArrowUpRight },
    { href: "/bills/new", label: labels.bill, icon: CalendarDays },
    { href: "/reminders/new", label: labels.reminder, icon: Bell },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+70px)] z-30 mx-auto flex w-full max-w-[560px] justify-center px-3 md:hidden">
      <div className="pointer-events-auto flex w-full items-center justify-between gap-2 rounded-[16px] border border-[var(--divider)] bg-[var(--surface)]/95 p-2 shadow-[var(--shadow-float)] backdrop-blur">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-2 py-2 text-[10px] font-semibold text-[var(--brand-700)]",
                "bg-[var(--surface-soft)] hover:bg-[var(--brand-100)]"
              )}
            >
              <Icon size={16} />
              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
