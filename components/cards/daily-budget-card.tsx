"use client";

import { useMemo, useState } from "react";
import { formatDateRu, formatMoney } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { getTranslations } from "@/lib/i18n/translations";
import { Input } from "@/components/ui/input";
import { convertCurrency } from "@/lib/i18n/locale";
import type { Bill } from "@/types/domain";

export function DailyBudgetCard({
  limit,
  currency,
  state,
  bills,
  mode = "daily",
  monthlyIncome = 0,
  monthlyExpense = 0,
  exchangeRates,
  language = "en",
  label,
  hints,
  className,
}: {
  limit?: number;
  currency: string;
  state?: "positive" | "caution" | "warning" | "neutral";
  bills?: Bill[];
  mode?: "daily" | "bills";
  monthlyIncome?: number;
  monthlyExpense?: number;
  exchangeRates?: Record<string, number>;
  language?: "ru" | "en" | "ro";
  label?: string;
  hints?: Record<"positive" | "caution" | "warning" | "neutral", string>;
  className?: string;
}) {
  const t = getTranslations(language);
  const [savingsGoal, setSavingsGoal] = useState<number>(0);
  const eurValue = useMemo(() => {
    if (!exchangeRates) return null;
    try {
      return convertCurrency(savingsGoal, currency as "MDL", "EUR", exchangeRates as Record<string, number>);
    } catch {
      return null;
    }
  }, [savingsGoal, currency, exchangeRates]);
  const labelText = label ?? (mode === "bills" ? t.dashboard.mustPayTitle : t.dashboard.dailyLimit);
  const resolvedHints = hints ?? {
    positive: t.dashboard.dailyHintPositive,
    caution: t.dashboard.dailyHintCaution,
    warning: t.dashboard.dailyHintWarning,
    neutral: t.dashboard.dailyHintNeutral,
  };
  const tone =
    state === "positive"
      ? "text-[var(--success)]"
      : state === "caution"
        ? "text-[var(--warning)]"
        : state === "warning"
          ? "text-[var(--danger)]"
          : "text-[var(--text)]";

  if (mode === "bills") {
    const now = new Date();
    const nowTs = now.getTime();
    const soonTs = nowTs + 3 * 24 * 60 * 60 * 1000;
    const dueBills = (bills ?? [])
      .filter((bill) => bill.status !== "paid")
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    const overdueBills = dueBills.filter((bill) => new Date(bill.due_date).getTime() < nowTs);
    const dueSoonBills = dueBills.filter((bill) => {
      const ts = new Date(bill.due_date).getTime();
      return ts >= nowTs && ts <= soonTs;
    });
    const criticalBills = [...overdueBills, ...dueSoonBills.filter((bill) => !overdueBills.some((o) => o.id === bill.id))];
    const total = dueBills.reduce((acc, bill) => acc + Number(bill.amount), 0);
    const remainingAfterBills = monthlyIncome - monthlyExpense - total;
    const safeSavings = Math.max(0, remainingAfterBills);
    const remainingAfterSavings = remainingAfterBills - savingsGoal;
    const remainingForFood = Math.max(0, remainingAfterSavings);
    const categoryTotals = new Map<string, number>();
    dueBills.forEach((bill) => {
      const label = bill.category?.trim() ? bill.category.trim() : t.dashboard.mustPayCategoryFallback;
      categoryTotals.set(label, (categoryTotals.get(label) ?? 0) + Number(bill.amount));
    });
    const topCategories = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return (
      <Card className={cn("min-h-[260px] bg-[var(--surface)]", className)}>
        <p className="text-sm font-medium text-[var(--text-soft)]">{labelText}</p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">{t.dashboard.mustPayHint}</p>
        {dueBills.length ? (
          <>
            {criticalBills.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {t.dashboard.mustPayCriticalTitle}
                </p>
                <div className="mt-2 space-y-2">
                  {criticalBills.slice(0, 3).map((bill) => {
                    const isOverdue = new Date(bill.due_date).getTime() < nowTs;
                    return (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text)]">{bill.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{formatDateRu(bill.due_date, language)}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isOverdue ? "bg-[var(--danger)] text-white" : "bg-[var(--warning)] text-white"
                          }`}
                        >
                          {isOverdue ? t.dashboard.mustPayOverdue : t.dashboard.mustPayDueSoon}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {topCategories.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {t.dashboard.mustPayCategoriesTitle}
                </p>
                <div className="mt-2 space-y-2">
                  {topCategories.map(([name, amount]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
                    >
                      <p className="truncate text-sm font-semibold text-[var(--text)]">{name}</p>
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {formatMoney(amount, currency, language)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-4 space-y-2">
              {dueBills.slice(0, 4).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text)]">{bill.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDateRu(bill.due_date, language)}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {formatMoney(Number(bill.amount), currency, language)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{t.dashboard.mustPayTotal}</span>
              <span className="text-sm font-semibold text-[var(--text)]">{formatMoney(total, currency, language)}</span>
            </div>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{t.dashboard.mustPayIncome}</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatMoney(monthlyIncome, currency, language)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{t.dashboard.mustPayExpenses}</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatMoney(monthlyExpense, currency, language)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{t.dashboard.mustPayRemaining}</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatMoney(remainingAfterBills, currency, language)}
                </span>
              </div>
            </div>
            <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {t.dashboard.savingsTitle}
              </p>
              <label className="mt-2 block space-y-1">
                <span className="text-xs text-[var(--text-muted)]">{t.dashboard.savingsGoalLabel}</span>
                <Input
                  type="number"
                  min={0}
                  value={Number.isFinite(savingsGoal) ? savingsGoal : 0}
                  onChange={(event) => setSavingsGoal(Number(event.target.value || 0))}
                />
              </label>
              {eurValue !== null ? (
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {t.dashboard.savingsInEur.replace("{amount}", formatMoney(eurValue, "EUR", language))}
                </p>
              ) : null}
              <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
                <div className="flex items-center justify-between">
                  <span>{t.dashboard.savingsFeasible}</span>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {formatMoney(safeSavings, currency, language)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.dashboard.savingsAfter}</span>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {formatMoney(remainingAfterSavings, currency, language)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.dashboard.savingsFood}</span>
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {formatMoney(remainingForFood, currency, language)}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-[var(--text-muted)]">{t.dashboard.mustPayEmpty}</p>
        )}
      </Card>
    );
  }

  return (
    <Card className={cn("min-h-[260px] bg-[var(--surface)]", className)}>
      <p className="text-sm font-medium text-[var(--text-soft)]">{labelText}</p>
      <p
        className={`mt-3 text-[clamp(2rem,2.8vw,3.15rem)] leading-[1.02] font-semibold tracking-tight [font-variant-numeric:tabular-nums] ${tone}`}
      >
        {formatMoney(limit ?? 0, currency, language)}
      </p>
      <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
        {resolvedHints[state ?? "neutral"]}
      </p>
    </Card>
  );
}
