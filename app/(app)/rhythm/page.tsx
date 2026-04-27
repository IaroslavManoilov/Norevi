import { TopBar } from "@/components/layout/top-bar";
import { MobileAccordion } from "@/components/shared/mobile-accordion";
import { QuickActionsCard } from "@/components/cards/quick-actions-card";
import { SmartActionsCard } from "@/components/cards/smart-actions-card";
import { RhythmCoachCard } from "@/components/cards/rhythm-coach-card";
import { FinanceCalculatorCard } from "@/components/cards/finance-calculator-card";
import { FinancialCalendarCard } from "@/components/cards/financial-calendar-card";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";
import { buildRhythmPlan } from "@/lib/utils/rhythm";
import { getSmartActions, resolveSmartActionsVariant } from "@/lib/utils/smart-actions";
import {
  getSmartActionPreferenceScores,
  getSmartActionVariantPerformance,
} from "@/features/smart-actions/server/smart-actions-events-service";
import {
  getBalance,
  getExpenseAnalytics,
  getMonthlySummary,
  getNotes,
  getReminders,
  getUpcomingBillsWithinMonth,
  recalculateBillStatuses,
} from "@/lib/db/queries";

export default async function RhythmPage() {
  const { user, supabase, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  await recalculateBillStatuses(supabase, user.id);
  const [balance, summary, bills, reminders, notes, expenseAnalytics, smartPref, smartVariantPerf] = await Promise.all([
    getBalance(supabase, user.id),
    getMonthlySummary(supabase, user.id),
    getUpcomingBillsWithinMonth(supabase, user.id),
    getReminders(supabase, user.id),
    getNotes(supabase, user.id),
    getExpenseAnalytics(supabase, user.id),
    getSmartActionPreferenceScores(supabase, user.id),
    getSmartActionVariantPerformance(supabase, user.id),
  ]);

  const now = new Date();
  const nowTs = now.getTime();
  const weekTs = nowTs + 7 * 24 * 60 * 60 * 1000;
  const billsThisWeek = bills.filter((item) => {
    const due = new Date(item.due_date).getTime();
    return due >= nowTs && due <= weekTs;
  }).length;
  const activeReminders = reminders.filter((item) => item.status === "active").length;
  const requiredBills = bills.reduce((acc, item) => acc + Number(item.amount), 0);

  const smartVariant = resolveSmartActionsVariant(user.id, smartVariantPerf);
  const smartActions = getSmartActions({
    language,
    variant: smartVariant,
    preferenceScores: smartPref,
    balance,
    monthlyIncome: summary.income,
    monthlyExpense: summary.expense,
    requiredBills,
    billsThisWeek,
    activeReminders,
    changePercent: expenseAnalytics.changePercent,
    foodSpentMonth: 0,
    foodBudgetMonth: 1,
  });

  const rhythmPlan = buildRhythmPlan({
    language,
    balance,
    monthlyIncome: summary.income,
    monthlyExpense: summary.expense,
    bills,
    reminders,
    now,
  });

  return (
    <div>
      <TopBar
        title={t.nav.rhythm}
        subtitle={t.tagline}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <RhythmCoachCard language={language} score={rhythmPlan.score} focusText={rhythmPlan.focusText} tasks={rhythmPlan.tasks} />
        <QuickActionsCard
          title={t.dashboard.quickActions}
          hint={t.dashboard.quickActionsHint}
          labels={{
            expense: t.actions.addExpense,
            income: t.actions.addIncome,
            bill: t.actions.addBill,
            reminder: t.actions.addReminder,
            calculator: t.nav.calculator,
            calendar: t.nav.calendar,
          }}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MobileAccordion title={t.nav.calculator} subtitle={t.financeCalc.title} defaultOpen>
          <FinanceCalculatorCard
            currency={profile?.currency ?? "MDL"}
            language={language}
            exchangeRates={(profile as { exchange_rates?: Record<string, number> })?.exchange_rates ?? undefined}
            labels={t.financeCalc}
            defaultIncome={summary.income}
            defaultExpenses={summary.expense}
            showHeader={false}
          />
        </MobileAccordion>
        <MobileAccordion title={t.nav.calendar} subtitle={t.calendarPlanner.hint} defaultOpen>
          <FinancialCalendarCard
            bills={bills}
            reminders={reminders}
            notes={notes}
            language={language}
            variant="list"
            showHeader={false}
          />
        </MobileAccordion>
      </div>

      <div className="mt-4">
        <SmartActionsCard
          section={smartActions.section}
          title={smartActions.title}
          subtitle={smartActions.subtitle}
          actions={smartActions.actions}
          openLabel={smartActions.openLabel}
          doneLabel={smartActions.doneLabel}
          dismissLabel={smartActions.dismissLabel}
          whyLabel={smartActions.whyLabel}
          variant={smartVariant}
        />
      </div>
    </div>
  );
}
