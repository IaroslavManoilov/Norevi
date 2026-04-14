"use client";

import Link from "next/link";
import type { Bill } from "@/types/domain";
import { formatMoney, formatDateRu } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickMarkBillPaidButton } from "@/components/shared/quick-mark-bill-paid-button";
import { EmptyState } from "@/components/shared/empty-state";
import { useI18n } from "@/components/i18n/i18n-provider";

export function BillsList({ bills, currency, language }: { bills: Bill[]; currency: string; language?: "ru" | "en" | "ro" }) {
  const { t } = useI18n();
  if (!bills.length) {
    return <EmptyState title={t.bills.emptyTitle} description={t.bills.emptyDescription} />;
  }

  const statusLabel: Record<Bill["status"], string> = {
    upcoming: t.bills.upcoming,
    paid: t.bills.paid,
    overdue: t.bills.overdue,
  };

  return (
    <>
      <div className="space-y-3 md:hidden">
        {bills.map((bill) => (
          <article
            key={bill.id}
            className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/bills/${bill.id}`} className="font-semibold text-[var(--text)]">
                  {bill.title}
                </Link>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{formatDateRu(bill.due_date, language)}</p>
              </div>
              <Badge tone={bill.status === "paid" ? "success" : bill.status === "overdue" ? "danger" : "neutral"}>
                {statusLabel[bill.status]}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-base font-semibold [font-variant-numeric:tabular-nums]">
                {formatMoney(Number(bill.amount), currency, language)}
              </p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {bill.status !== "paid" ? <QuickMarkBillPaidButton billId={bill.id} /> : null}
              <Link href={`/bills/${bill.id}`}>
                <Button variant="secondary" className="h-9 px-3 text-xs">
                  {t.actions.open}
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden md:block space-y-3">
        {bills.map((bill) => (
          <article
            key={bill.id}
            className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-200)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/bills/${bill.id}`} className="font-semibold text-[var(--text)]">
                  {bill.title}
                </Link>
                <p className="truncate text-sm text-[var(--text-soft)]">{formatDateRu(bill.due_date, language)}</p>
              </div>
              <Badge tone={bill.status === "paid" ? "success" : bill.status === "overdue" ? "danger" : "neutral"}>
                {statusLabel[bill.status]}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-semibold [font-variant-numeric:tabular-nums]">
                {formatMoney(Number(bill.amount), currency, language)}
              </p>
              <div className="flex gap-2">
                {bill.status !== "paid" ? <QuickMarkBillPaidButton billId={bill.id} /> : null}
                <Link href={`/bills/${bill.id}`}>
                  <Button variant="secondary" className="h-9">
                    {t.actions.open}
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
