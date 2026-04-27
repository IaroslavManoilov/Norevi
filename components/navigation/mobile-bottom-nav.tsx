"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, CalendarClock, Bell, MessageSquare, Brain } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/components/i18n/i18n-provider";

export function MobileBottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: t.nav.overview, icon: Home },
    { href: "/rhythm", label: t.nav.rhythm, icon: Brain },
    { href: "/finance", label: t.nav.finance, icon: Wallet },
    { href: "/bills", label: t.nav.bills, icon: CalendarClock },
    { href: "/reminders", label: t.nav.reminders, icon: Bell },
    { href: "/assistant", label: t.nav.assistant, icon: MessageSquare },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 md:hidden">
      <ul className="glass-panel focus-ring-soft mx-auto grid max-w-[760px] grid-cols-6 gap-1 rounded-[20px] px-1 py-1.5">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-[12px] px-1 py-1.5 text-[9px] leading-none transition min-[390px]:px-2 min-[390px]:text-[10px]",
                  active
                    ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                )}
              >
                <Icon size={17} />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
