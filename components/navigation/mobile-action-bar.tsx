"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Calculator, CalendarDays, MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type IconName = "expense" | "income" | "calculator" | "plus" | "calendar" | "chat";

type MobileAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: IconName;
  tone?: "primary" | "secondary";
};

export function MobileActionBar({ actions }: { actions: MobileAction[] }) {
  const iconMap = {
    expense: ArrowDownLeft,
    income: ArrowUpRight,
    calculator: Calculator,
    plus: Plus,
    calendar: CalendarDays,
    chat: MessageCircle,
  } as const;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+70px)] z-30 mx-auto flex w-full max-w-[560px] justify-center px-3 md:hidden">
      <div className="pointer-events-auto flex w-full items-center justify-between gap-2 rounded-[16px] border border-[var(--divider)] bg-[var(--surface)]/95 p-2 shadow-[var(--shadow-float)] backdrop-blur">
        {actions.map((action) => {
          const Icon = action.icon ? iconMap[action.icon] : null;
          const className = cn(
            "flex flex-1 items-center justify-center gap-2 rounded-[12px] px-2 py-2 text-[11px] font-semibold",
            action.tone === "primary"
              ? "bg-[var(--brand-700)] text-white"
              : "bg-[var(--surface-soft)] text-[var(--brand-700)]"
          );
          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className={className}>
                {Icon ? <Icon size={16} /> : null}
                {action.label}
              </Link>
            );
          }
          return (
            <button key={action.label} type="button" onClick={action.onClick} className={className}>
              {Icon ? <Icon size={16} /> : null}
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
