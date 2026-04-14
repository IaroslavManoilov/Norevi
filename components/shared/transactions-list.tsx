"use client";

import Link from "next/link";
import type { Transaction } from "@/types/domain";
import { formatMoney, formatDateRu } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useI18n } from "@/components/i18n/i18n-provider";

export function TransactionsList({
  transactions,
  currency,
}: {
  transactions: (Transaction & { categories?: { name: string } | null })[];
  currency: string;
}) {
  const { t, language } = useI18n();
  if (!transactions.length) {
    return <EmptyState title={t.finance.filteredOps} description={t.finance.subtitle} />;
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {transactions.map((tx) => (
          <article
            key={tx.id}
            className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/finance/${tx.id}`} className="font-semibold text-[var(--text)]">
                  {tx.title}
                </Link>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {tx.categories?.name ?? t.forms.categoryNone}
                </p>
              </div>
              <p
                className={`text-base font-semibold [font-variant-numeric:tabular-nums] ${
                  tx.type === "income" ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatMoney(Number(tx.amount), currency, language)}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{formatDateRu(tx.transaction_date, language)}</span>
              {tx.note ? <span className="truncate max-w-[55%]">{tx.note}</span> : null}
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              <Link href={`/finance/${tx.id}`}>
                <Button variant="secondary" className="h-9 px-3 text-xs">
                  {t.actions.open}
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden md:block space-y-3">
        {transactions.map((tx) => (
          <article
            key={tx.id}
            className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-200)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/finance/${tx.id}`} className="font-semibold text-[var(--text)]">
                  {tx.title}
                </Link>
                <p className="truncate text-sm text-[var(--text-soft)]">
                  {tx.categories?.name ?? t.forms.categoryNone} · {formatDateRu(tx.transaction_date, language)}
                </p>
                {tx.note ? <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{tx.note}</p> : null}
              </div>
              <p
                className={`text-lg font-semibold [font-variant-numeric:tabular-nums] ${
                  tx.type === "income" ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatMoney(Number(tx.amount), currency, language)}
              </p>
            </div>
            <div className="mt-3">
              <Link href={`/finance/${tx.id}`}>
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
