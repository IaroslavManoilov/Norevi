import Link from "next/link";
import { Brain, CalendarClock, MessageSquare, ReceiptText, Sparkles, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/top-bar";
import { MobileAccordion } from "@/components/shared/mobile-accordion";
import { QuickActionsCard } from "@/components/cards/quick-actions-card";
import { RhythmCoachCard } from "@/components/cards/rhythm-coach-card";
import { PushCenterCard } from "@/components/cards/push-center-card";
import { FinanceCalculatorCard } from "@/components/cards/finance-calculator-card";
import { FinancialCalendarCard } from "@/components/cards/financial-calendar-card";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";
import { buildRhythmPlan } from "@/lib/utils/rhythm";
import {
  getBalance,
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
  const [balance, summary, bills, reminders, notes] = await Promise.all([
    getBalance(supabase, user.id),
    getMonthlySummary(supabase, user.id),
    getUpcomingBillsWithinMonth(supabase, user.id),
    getReminders(supabase, user.id),
    getNotes(supabase, user.id),
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
  const overdueCount = bills.filter((item) => item.status === "overdue").length;
  const dueSoonCount = bills.filter((item) => {
    const due = new Date(item.due_date).getTime();
    return item.status !== "paid" && due >= nowTs && due <= nowTs + 3 * 24 * 60 * 60 * 1000;
  }).length;
  const monthlyDelta = summary.income - summary.expense;

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

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="relative overflow-hidden border-[var(--brand-200)] bg-[linear-gradient(145deg,var(--brand-50),var(--surface))]">
          <div className="pointer-events-none absolute -top-12 right-[-32px] h-44 w-44 rounded-full bg-[var(--brand-300)]/22 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-700)]">
              <Sparkles size={16} />
              LifeSync Intelligence
            </div>
            <h2 className="mt-2 text-[clamp(1.45rem,2.8vw,2.2rem)] leading-tight font-bold text-[var(--text)]">
              {language === "ru"
                ? "Один поток для дня: финансы, платежи, календарь, пуши и помощник"
                : language === "ro"
                  ? "Un singur flux zilnic: finante, plati, calendar, push si asistent"
                  : "One daily flow: finance, bills, calendar, push, and assistant"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--text-soft)]">
              {rhythmPlan.focusText}
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[14px] border border-[var(--brand-200)] bg-[var(--surface)] px-3 py-2">
                <p className="text-[11px] text-[var(--text-muted)]">Rhythm score</p>
                <p className="text-xl font-bold text-[var(--brand-800)]">{rhythmPlan.score}</p>
              </div>
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <p className="text-[11px] text-[var(--text-muted)]">{t.bills.overdue}</p>
                <p className="text-xl font-bold">{overdueCount}</p>
              </div>
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <p className="text-[11px] text-[var(--text-muted)]">{t.dashboard.billsWeek}</p>
                <p className="text-xl font-bold">{billsThisWeek}</p>
              </div>
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
                <p className="text-[11px] text-[var(--text-muted)]">{t.dashboard.activeReminders}</p>
                <p className="text-xl font-bold">{activeReminders}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/assistant">
                <Button className="h-10 gap-1.5">
                  <MessageSquare size={14} />
                  {t.nav.assistant}
                </Button>
              </Link>
              <Link href="/payments">
                <Button variant="secondary" className="h-10 gap-1.5">
                  <ReceiptText size={14} />
                  {t.nav.paymentsHistory}
                </Button>
              </Link>
              <Link href="/bills/calendar">
                <Button variant="ghost" className="h-10 gap-1.5">
                  <CalendarClock size={14} />
                  {t.nav.calendar}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {language === "ru" ? "Финансовый пульс" : language === "ro" ? "Puls financiar" : "Finance pulse"}
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-[12px] bg-[var(--surface-soft)] px-3 py-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-soft)]">
                <Wallet size={14} />
                {t.dashboard.incomeMonth}
              </div>
              <span className="text-sm font-semibold">{Math.round(summary.income)}</span>
            </div>
            <div className="flex items-center justify-between rounded-[12px] bg-[var(--surface-soft)] px-3 py-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-soft)]">
                <Brain size={14} />
                {t.dashboard.expenseMonth}
              </div>
              <span className="text-sm font-semibold">{Math.round(summary.expense)}</span>
            </div>
            <div className="flex items-center justify-between rounded-[12px] bg-[var(--surface-soft)] px-3 py-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-soft)]">
                <CalendarClock size={14} />
                {language === "ru" ? "К оплате" : language === "ro" ? "De plata" : "To pay"}
              </div>
              <span className="text-sm font-semibold">{Math.round(requiredBills)}</span>
            </div>
            <div className="flex items-center justify-between rounded-[12px] bg-[var(--surface-soft)] px-3 py-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-soft)]">
                <Sparkles size={14} />
                {language === "ru" ? "Дельта месяца" : language === "ro" ? "Delta lunii" : "Monthly delta"}
              </div>
              <span className={`text-sm font-semibold ${monthlyDelta >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                {monthlyDelta >= 0 ? "+" : ""}{Math.round(monthlyDelta)}
              </span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-center">
              <p className="text-[10px] text-[var(--text-muted)]">{language === "ru" ? "Скоро" : language === "ro" ? "Curand" : "Due soon"}</p>
              <p className="text-base font-semibold">{dueSoonCount}</p>
            </div>
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-center">
              <p className="text-[10px] text-[var(--text-muted)]">{language === "ru" ? "Задач сегодня" : language === "ro" ? "Taskuri azi" : "Today tasks"}</p>
              <p className="text-base font-semibold">{rhythmPlan.stats.todayTasks}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
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

      <div className="mt-4">
        <PushCenterCard bills={bills} reminders={reminders} language={language} />
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

    </div>
  );
}
