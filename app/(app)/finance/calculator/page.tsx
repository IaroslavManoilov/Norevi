import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/top-bar";
import { FinanceCalculatorCard } from "@/components/cards/finance-calculator-card";
import { ReminderCalendar } from "@/components/shared/reminder-calendar";
import { requireOnboarded } from "@/lib/auth/guards";
import { getMonthlySummary, getNotes, getReminders } from "@/lib/db/queries";
import { getTranslations } from "@/lib/i18n/translations";

export default async function FinanceCalculatorPage() {
  const { supabase, user, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const [summary, reminders, notes] = await Promise.all([
    getMonthlySummary(supabase, user.id),
    getReminders(supabase, user.id),
    getNotes(supabase, user.id),
  ]);

  return (
    <div>
      <TopBar
        title={t.financeCalc.title}
        subtitle={t.financeCalc.subtitle}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="mb-4">
        <Link href="/finance/new">
          <Button>{t.actions.addExpense}</Button>
        </Link>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <FinanceCalculatorCard
          currency={profile?.currency ?? "MDL"}
          language={language}
          exchangeRates={(profile as { exchange_rates?: Record<string, number> })?.exchange_rates ?? undefined}
          defaultIncome={summary.income}
          defaultExpenses={summary.expense}
        />
        <ReminderCalendar reminders={reminders} notes={notes} language={language} />
      </div>
    </div>
  );
}
