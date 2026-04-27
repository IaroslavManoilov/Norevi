"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, CalendarClock, Bell, MessageSquare, Settings, Calculator, CalendarDays, ReceiptText, Brain } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/components/i18n/i18n-provider";

export function DesktopSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: t.nav.overview, icon: Home },
    { href: "/rhythm", label: t.nav.rhythm, icon: Brain },
    { href: "/finance", label: t.nav.finance, icon: Wallet },
    { href: "/bills", label: t.nav.bills, icon: CalendarClock },
    { href: "/reminders", label: t.nav.reminders, icon: Bell },
    { href: "/assistant", label: t.nav.assistant, icon: MessageSquare },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];
  const toolItems = [
    { href: "/finance/calculator", label: t.nav.calculator, icon: Calculator },
    { href: "/bills/calendar", label: t.nav.calendar, icon: CalendarDays },
    { href: "/payments", label: t.nav.paymentsHistory, icon: ReceiptText },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 border-r border-[var(--divider)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-3 py-5 backdrop-blur md:flex md:flex-col lg:w-[264px] lg:px-4 lg:py-6">
      <Link href="/dashboard" className="mb-7 inline-flex max-w-full">
        <BrandLockup
          compact
          titleClassName="text-[40px] leading-none lg:text-[44px]"
          subtitleClassName="text-[9px] tracking-[0.24em]"
          tagline={t.tagline}
        />
      </Link>
      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-[14px] px-3 text-sm font-medium",
                    active
                      ? "bg-[var(--brand-50)] text-[var(--brand-800)] shadow-[inset_0_0_0_1px_var(--brand-200)]"
                      : "text-[var(--text-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-[var(--divider)] pt-3">
        <p className="mb-2 px-2 text-xs font-medium tracking-wide text-[var(--text-muted)] uppercase">{t.nav.tools}</p>
        <ul className="space-y-1">
          {toolItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-[12px] px-3 text-sm font-medium",
                    active
                      ? "bg-[var(--brand-50)] text-[var(--brand-800)] shadow-[inset_0_0_0_1px_var(--brand-200)]"
                      : "text-[var(--text-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                  )}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
