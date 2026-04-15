import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { TransactionsList } from "@/components/shared/transactions-list";
import { Card } from "@/components/ui/card";
import { SpendingChartCard } from "@/components/charts/spending-chart-card";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTransactions, getCategories, getMonthlySummary, getExpenseAnalytics, NO_DATA_KEY, UNCATEGORIZED_KEY } from "@/lib/db/queries";
import { formatDateRu, formatMoney } from "@/lib/formatters";
import { getTranslations } from "@/lib/i18n/translations";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: "income" | "expense"; category?: string; period?: string }>;
}) {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const params = await searchParams;
  const currency = profile?.currency ?? "MDL";
  const selectedType = params.type ?? "all";
  const selectedCategory = params.category ?? "all";

  const [transactions, categories, summary, analytics] = await Promise.all([
    getTransactions(supabase, user.id),
    getCategories(supabase, user.id),
    getMonthlySummary(supabase, user.id),
    getExpenseAnalytics(supabase, user.id),
  ]);

  const filtered = transactions.filter((tx) => {
    if (params.type && tx.type !== params.type) return false;
    if (params.category && tx.category_id !== params.category) return false;
    return true;
  });
  const expenseCount = filtered.filter((tx) => tx.type === "expense").length;
  const incomeCount = filtered.filter((tx) => tx.type === "income").length;
  const latestDate = transactions[0]?.transaction_date ?? null;
  const latestDay = latestDate ? String(new Date(latestDate).getDate()).padStart(2, "0") : t.common.noData;
  const topCategoryLabel =
    analytics.topCategory.name === NO_DATA_KEY
      ? latestDay
      : analytics.topCategory.name === UNCATEGORIZED_KEY
        ? t.forms.categoryNone
        : analytics.topCategory.name;

  const typeChips = [
    { href: "/finance", label: t.finance.all, active: selectedType === "all" },
    { href: "/finance?type=expense", label: t.finance.expenses, active: selectedType === "expense" },
    { href: "/finance?type=income", label: t.finance.incomes, active: selectedType === "income" },
  ];

  return (
    <div>
      <TopBar
        title={t.finance.title}
        subtitle={t.finance.subtitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/finance/new">
          <Button>{t.finance.addExpense}</Button>
        </Link>
        <Link href="/finance/new?type=income">
          <Button variant="secondary">{t.finance.addIncome}</Button>
        </Link>
        <Link href="/finance/calculator">
          <Button variant="ghost">{t.finance.openCalculator}</Button>
        </Link>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="min-h-[132px]">
          <p className="text-sm text-[var(--text-soft)]">{t.finance.monthBalance}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
            {formatMoney(summary.balance, currency, language)}
          </p>
        </Card>
        <Card className="min-h-[132px]">
          <p className="text-sm text-[var(--text-soft)]">{t.finance.avgPerDay}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
            {formatMoney(analytics.avgPerDay, currency, language)}
          </p>
        </Card>
        <Card className="min-h-[132px]">
          <p className="text-sm text-[var(--text-soft)]">{t.finance.filteredOps}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight [font-variant-numeric:tabular-nums]">{filtered.length}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {t.finance.incomeLabel}: {incomeCount} · {t.finance.expenseLabel}: {expenseCount}
          </p>
        </Card>
        <Card className="min-h-[132px]">
          <p className="text-sm text-[var(--text-soft)]">{t.finance.topCategory}</p>
          <p className="mt-2 text-xl font-semibold tracking-tight">
            {topCategoryLabel} · {formatMoney(analytics.topCategory.amount, currency, language)}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {t.finance.changeLabel}: {analytics.changePercent.toFixed(1)}%
          </p>
        </Card>
      </div>

      <div className="mb-4">
        <SpendingChartCard data={analytics.monthlyTrend.map((x) => ({ date: x.month, amount: x.amount }))} />
      </div>

      <div className="md:hidden">
        <div className="sticky top-0 z-20 -mx-3 mb-3 border-b border-[var(--divider)] bg-[var(--bg)]/95 px-3 py-3 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
            {typeChips.map((chip) => (
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
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 text-sm">
            <Link
              href={selectedType === "all" ? "/finance" : `/finance?type=${selectedType}`}
              className={`rounded-full border px-3 py-1.5 whitespace-nowrap transition ${
                selectedCategory === "all"
                  ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                  : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)]"
              }`}
            >
              {t.finance.allCategories}
            </Link>
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/finance${selectedType === "all" ? "?" : `?type=${selectedType}&`}category=${c.id}`}
                className={`rounded-full border px-3 py-1.5 whitespace-nowrap transition ${
                  c.id === selectedCategory
                    ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="mb-3">
          <p className="mb-2 text-sm font-medium text-[var(--text-soft)]">{t.finance.transactionType}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            {typeChips.map((chip) => (
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
        </div>
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-[var(--text-soft)]">{t.finance.categories}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href={selectedType === "all" ? "/finance" : `/finance?type=${selectedType}`}
              className={`rounded-full border px-3 py-1.5 transition ${
                selectedCategory === "all"
                  ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                  : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] hover:border-[var(--brand-200)] hover:text-[var(--text)]"
              }`}
            >
              {t.finance.allCategories}
            </Link>
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/finance${selectedType === "all" ? "?" : `?type=${selectedType}&`}category=${c.id}`}
                className={`rounded-full border px-3 py-1.5 transition ${
                  c.id === selectedCategory
                    ? "border-[var(--brand-300)] bg-[var(--brand-50)] text-[var(--brand-900)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] hover:border-[var(--brand-200)] hover:text-[var(--text)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <TransactionsList transactions={filtered} currency={profile?.currency ?? "MDL"} />
    </div>
  );
}
