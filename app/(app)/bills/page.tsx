import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { BillsList } from "@/components/shared/bills-list";
import { Card } from "@/components/ui/card";
import { requireOnboarded } from "@/lib/auth/guards";
import { getBills } from "@/lib/db/queries";
import { formatMoney } from "@/lib/formatters";
import { getTranslations } from "@/lib/i18n/translations";

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: "upcoming" | "paid" | "overdue" }>;
}) {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const params = await searchParams;
  const bills = await getBills(supabase, user.id);
  const currency = profile?.currency ?? "MDL";
  const selectedStatus = params.status ?? "all";

  const filtered =
    selectedStatus === "all" ? bills : bills.filter((bill) => bill.status === selectedStatus);

  const upcomingCount = bills.filter((bill) => bill.status === "upcoming").length;
  const overdueCount = bills.filter((bill) => bill.status === "overdue").length;
  const monthTotal = filtered.reduce((sum, bill) => sum + Number(bill.amount), 0);

  const chips = [
    { href: "/bills", label: t.bills.all, active: selectedStatus === "all" },
    { href: "/bills?status=upcoming", label: t.bills.upcoming, active: selectedStatus === "upcoming" },
    { href: "/bills?status=overdue", label: t.bills.overdue, active: selectedStatus === "overdue" },
    { href: "/bills?status=paid", label: t.bills.paid, active: selectedStatus === "paid" },
  ];

  return (
    <div>
      <TopBar
        title={t.bills.title}
        subtitle={t.bills.subtitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Link href="/bills/new">
          <Button>{t.bills.addBill}</Button>
        </Link>
        <Link href="/bills/calendar">
          <Button variant="ghost">{t.bills.openCalendar}</Button>
        </Link>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <Card className="min-h-[128px]">
          <p className="text-sm text-[var(--text-soft)]">{t.bills.totalBills}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">{bills.length}</p>
        </Card>
        <Card className="min-h-[128px]">
          <p className="text-sm text-[var(--text-soft)]">{t.bills.needAttention}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
            {upcomingCount + overdueCount}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{t.bills.overdueLabel}: {overdueCount}</p>
        </Card>
        <Card className="min-h-[128px]">
          <p className="text-sm text-[var(--text-soft)]">{t.bills.sumByFilter}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
            {formatMoney(monthTotal, currency, language)}
          </p>
        </Card>
      </div>

      <div className="md:hidden">
        <div className="sticky top-0 z-20 -mx-3 mb-3 border-b border-[var(--divider)] bg-[var(--bg)]/95 px-3 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
            {chips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className={`rounded-full border px-3 py-1.5 whitespace-nowrap transition ${
                  chip.active
                    ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)]"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden md:block mb-4 flex flex-wrap gap-2 text-sm">
        {chips.map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className={`rounded-full border px-3 py-1.5 transition ${
              chip.active
                ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] hover:border-[var(--brand-200)] hover:text-[var(--text)]"
            }`}
          >
            {chip.label}
          </Link>
        ))}
      </div>

      <BillsList bills={filtered} currency={currency} language={language} />
    </div>
  );
}
