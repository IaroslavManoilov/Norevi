"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, CalendarClock, Bell, MessageSquare, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/components/i18n/i18n-provider";

export function MobileBottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: t.nav.overview, icon: Home },
    { href: "/finance", label: t.nav.finance, icon: Wallet },
    { href: "/bills", label: t.nav.bills, icon: CalendarClock },
    { href: "/reminders", label: t.nav.reminders, icon: Bell },
    { href: "/assistant", label: t.nav.assistant, icon: MessageSquare },
    { href: "/payments", label: t.nav.paymentsHistory, icon: ReceiptText },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--divider)] bg-[var(--surface)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur md:hidden">
      <ul className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[12px] px-2 py-2 text-[10px] transition",
                  active
                    ? "bg-[var(--surface-soft)] text-[var(--brand-700)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)]"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
