import { Card } from "@/components/ui/card";
import { TopBar } from "@/components/layout/top-bar";
import { BalanceCard } from "@/components/cards/balance-card";
import { SummaryMiniCard } from "@/components/cards/summary-mini-card";
import { DailyBudgetCard } from "@/components/cards/daily-budget-card";
import { UpcomingBillsCard } from "@/components/cards/upcoming-bills-card";
import { RemindersCard } from "@/components/cards/reminders-card";
import { QuickActionsCard } from "@/components/cards/quick-actions-card";
import { SpendingChartCard } from "@/components/charts/spending-chart-card";
import { CategoryBreakdownCard } from "@/components/charts/category-breakdown-card";
import { FlowInsightsCard, FlowPlanCard } from "@/components/cards/flow-insights-card";
import { FinanceCalculatorCard } from "@/components/cards/finance-calculator-card";
import { FinancialCalendarCard } from "@/components/cards/financial-calendar-card";
import { FoodPlanCard } from "@/components/cards/food-plan-card";
import { QuickPayCard } from "@/components/cards/quick-pay-card";
import { MobileAccordion } from "@/components/shared/mobile-accordion";
import { MobileQuickActions } from "@/components/navigation/mobile-quick-actions";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";
import {
  getExpenseAnalytics,
  getBalance,
  getMonthlySummary,
  getFavoriteItems,
  getNotes,
  getReminders,
  getTopExpenseCategories,
  getTransactions,
  getUpcomingBillsWithinMonth,
  recalculateBillStatuses,
} from "@/lib/db/queries";

export default async function DashboardPage() {
  const { user, supabase, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  await recalculateBillStatuses(supabase, user.id);

  const [balance, summary, bills, reminders, notes, favorites, categories, transactions, expenseAnalytics] = await Promise.all([
    getBalance(supabase, user.id),
    getMonthlySummary(supabase, user.id),
    getUpcomingBillsWithinMonth(supabase, user.id),
    getReminders(supabase, user.id),
    getNotes(supabase, user.id),
    getFavoriteItems(supabase, user.id, "food"),
    getTopExpenseCategories(supabase, user.id),
    getTransactions(supabase, user.id),
    getExpenseAnalytics(supabase, user.id),
  ]);

  const nowTs = new Date().getTime();
  const weekTs = nowTs + 7 * 24 * 60 * 60 * 1000;
  const billsThisWeek = bills.filter((b) => {
    const due = new Date(b.due_date).getTime();
    return due >= nowTs && due <= weekTs;
  }).length;
  const activeRemindersCount = reminders.filter((r) => r.status === "active").length;

  const chartMap = new Map<string, number>();
  transactions
    .filter((tx) => tx.type === "expense")
    .slice(0, 14)
    .forEach((tx) => {
      chartMap.set(tx.transaction_date, (chartMap.get(tx.transaction_date) ?? 0) + Number(tx.amount));
    });
  const chartData = Array.from(chartMap.entries()).map(([date, amount]) => ({ date: date.slice(5), amount })).reverse();

  const greeting = new Date().getHours() < 12 ? t.dashboard.greetingMorning : t.dashboard.greetingBack;
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysPassed = today.getDate();
  const remainingDays = Math.max(1, daysInMonth - daysPassed + 1);
  const requiredBills = bills.reduce((acc, b) => acc + Number(b.amount), 0);
  const freeAfterBills = Math.max(0, balance - requiredBills);
  const monthlyBudget = profile?.monthly_budget_limit && Number(profile.monthly_budget_limit) > 0 ? Number(profile.monthly_budget_limit) : summary.income;

  const foodNames = ["еда", "food", "mancare", "mâncare", "alimentatie", "alimentare", "food & drinks"];
  const foodSpent = transactions
    .filter((tx) => {
      if (tx.type !== "expense") return false;
      const date = new Date(tx.transaction_date);
      if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) return false;
      const name = (tx.categories?.name ?? "").toString().toLowerCase();
      return foodNames.some((item) => name.includes(item));
    })
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const avgFoodDaily = foodSpent / Math.max(1, daysPassed);
  const fallbackFood = (freeAfterBills / remainingDays) * 0.35;
  const foodBudgetToday = Number.isFinite(avgFoodDaily) && avgFoodDaily > 0 ? avgFoodDaily : Math.max(0, fallbackFood);
  const foodBudgetMonth = Math.max(0, (monthlyBudget - requiredBills) * 0.35);
  const foodRemainingMonth = Math.max(0, foodBudgetMonth - foodSpent);

  const foodTitleMap = new Map<string, number>();
  const foodCategoryTotals = { home: 0, cafe: 0, delivery: 0 };
  const stableTitleMap = new Map<string, { amount: number; count: number }>();
  const stableStart = new Date(today);
  stableStart.setDate(today.getDate() - 56);
  transactions.forEach((tx) => {
    if (tx.type !== "expense") return;
    const name = (tx.categories?.name ?? "").toString().toLowerCase();
    const title = (tx.title || "").toString().toLowerCase();
    const note = (tx.note || "").toString().toLowerCase();
    const text = `${name} ${title} ${note}`;
    const date = new Date(tx.transaction_date);
    if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) return;
    if (!foodNames.some((item) => text.includes(item))) return;
    const cleanTitle = (tx.title || "").trim();
    if (cleanTitle) {
      foodTitleMap.set(cleanTitle, (foodTitleMap.get(cleanTitle) ?? 0) + Number(tx.amount));
    }

    if (
      text.includes("каф") ||
      text.includes("cafe") ||
      text.includes("coffee") ||
      text.includes("cafenea") ||
      text.includes("restaurant") ||
      text.includes("pizza") ||
      text.includes("mcd") ||
      text.includes("kfc") ||
      text.includes("bar")
    ) {
      foodCategoryTotals.cafe += Number(tx.amount);
    } else if (
      text.includes("достав") ||
      text.includes("delivery") ||
      text.includes("livrare") ||
      text.includes("glovo") ||
      text.includes("bolt") ||
      text.includes("wolt") ||
      text.includes("yandex")
    ) {
      foodCategoryTotals.delivery += Number(tx.amount);
    } else {
      foodCategoryTotals.home += Number(tx.amount);
    }
  });

  transactions.forEach((tx) => {
    if (tx.type !== "expense") return;
    const name = (tx.categories?.name ?? "").toString().toLowerCase();
    const title = (tx.title || "").toString().toLowerCase();
    const note = (tx.note || "").toString().toLowerCase();
    const text = `${name} ${title} ${note}`;
    if (!foodNames.some((item) => text.includes(item))) return;
    const date = new Date(tx.transaction_date);
    if (date < stableStart) return;
    const cleanTitle = (tx.title || "").trim();
    if (!cleanTitle) return;
    const current = stableTitleMap.get(cleanTitle) ?? { amount: 0, count: 0 };
    stableTitleMap.set(cleanTitle, { amount: current.amount + Number(tx.amount), count: current.count + 1 });
  });

  const stableItems = Array.from(stableTitleMap.entries())
    .sort((a, b) => b[1].count - a[1].count || b[1].amount - a[1].amount)
    .map(([title]) => title)
    .slice(0, 6);
  const personalItems = Array.from(foodTitleMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([title]) => title)
    .slice(0, 6);

  return (
    <div>
      <TopBar
        title={t.dashboard.title}
        subtitle={`${greeting}${profile?.full_name ? `, ${profile.full_name}` : ""}`}
        quickActionLabel={t.actions.quickAction}
        signOutLabel={t.actions.signOut}
        language={language}
      />
      <div className="md:hidden">
        <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2">
          <div className="min-w-[240px] snap-start">
            <BalanceCard balance={balance} currency={profile?.currency ?? "MDL"} language={language} label={t.dashboard.balance} />
          </div>
          <div className="min-w-[220px] snap-start">
            <SummaryMiniCard
              title={t.dashboard.incomeMonth}
              value={summary.income}
              currency={profile?.currency ?? "MDL"}
              language={language}
            />
          </div>
          <div className="min-w-[220px] snap-start">
            <SummaryMiniCard
              title={t.dashboard.expenseMonth}
              value={summary.expense}
              currency={profile?.currency ?? "MDL"}
              language={language}
            />
          </div>
          <div className="min-w-[220px] snap-start">
            <Card className="min-h-[148px]">
              <p className="text-sm font-medium text-[var(--text-soft)]">{t.dashboard.billsWeek}</p>
              <p className="mt-3 text-[clamp(1.65rem,2.1vw,2.3rem)] leading-[1.05] font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
                {billsThisWeek}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {t.dashboard.activeReminders}: {activeRemindersCount}
              </p>
            </Card>
          </div>
        </div>
      </div>
      <div className="hidden md:grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <BalanceCard balance={balance} currency={profile?.currency ?? "MDL"} language={language} label={t.dashboard.balance} />
        <SummaryMiniCard
          title={t.dashboard.incomeMonth}
          value={summary.income}
          currency={profile?.currency ?? "MDL"}
          language={language}
        />
        <SummaryMiniCard
          title={t.dashboard.expenseMonth}
          value={summary.expense}
          currency={profile?.currency ?? "MDL"}
          language={language}
        />
        <Card className="min-h-[148px]">
          <p className="text-sm font-medium text-[var(--text-soft)]">{t.dashboard.billsWeek}</p>
          <p className="mt-3 text-[clamp(1.65rem,2.1vw,2.3rem)] leading-[1.05] font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
            {billsThisWeek}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {t.dashboard.activeReminders}: {activeRemindersCount}
          </p>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MobileAccordion title={t.dashboard.quickPayTitle} subtitle={t.dashboard.quickPayHint} defaultOpen>
          <QuickPayCard
            bills={bills}
            currency={profile?.currency ?? "MDL"}
            language={language}
            labels={{
              title: t.dashboard.quickPayTitle,
              hint: t.dashboard.quickPayHint,
              salaryPlaceholder: t.dashboard.quickPaySalaryPlaceholder,
              salaryCta: t.dashboard.quickPaySalaryCta,
              salarySuccess: t.dashboard.quickPaySalarySuccess,
              salaryError: t.dashboard.quickPaySalaryError,
              billsTitle: t.dashboard.quickPayBillsTitle,
              billsHint: t.dashboard.quickPayBillsHint,
              billsEmpty: t.dashboard.quickPayBillsEmpty,
              criticalLabel: t.dashboard.quickPayCriticalLabel,
              overdueLabel: t.dashboard.quickPayOverdueLabel,
              dueTodayLabel: t.dashboard.quickPayDueTodayLabel,
              overdueOnlyLabel: t.dashboard.quickPayOverdueOnly,
              billPay: t.dashboard.quickPayBillPay,
              billPaying: t.dashboard.quickPayBillPaying,
              billPaid: t.dashboard.quickPayBillPaid,
              billPaidToday: t.dashboard.quickPayBillPaidToday,
              billPaidLabel: t.dashboard.quickPayBillPaidLabel,
              payAll: t.dashboard.quickPayPayAll,
              payAllBusy: t.dashboard.quickPayPayAllBusy,
              methodLabel: t.dashboard.quickPayMethodLabel,
              methodApple: t.dashboard.quickPayMethodApple,
              methodCard: t.dashboard.quickPayMethodCard,
              paidVia: t.dashboard.quickPayPaidVia,
              reminderTitle: t.dashboard.quickPayReminderTitle,
              reminderBody: t.dashboard.quickPayReminderBody,
              reminderToast: t.dashboard.quickPayReminderToast,
              payInternet: t.dashboard.quickPayPayInternet,
              payHousing: t.dashboard.quickPayPayHousing,
              payCredit: t.dashboard.quickPayPayCredit,
              payAllNoteTitle: t.dashboard.quickPayPayAllNoteTitle,
              payAllNoteBody: t.dashboard.quickPayPayAllNoteBody,
              payAllNoteSaved: t.dashboard.quickPayPayAllNoteSaved,
              receiptTitle: t.dashboard.quickPayReceiptTitle,
              receiptBody: t.dashboard.quickPayReceiptBody,
              receiptSaved: t.dashboard.quickPayReceiptSaved,
              billPaymentTitle: t.dashboard.quickPayBillPaymentTitle,
              billPaymentNote: t.dashboard.quickPayBillPaymentNote,
            }}
          />
        </MobileAccordion>
        <MobileAccordion title={t.dashboard.dailyLimit} subtitle={t.dashboard.mustPayHint}>
          <DailyBudgetCard
            mode="bills"
            bills={bills}
            currency={profile?.currency ?? "MDL"}
            language={language}
            monthlyIncome={summary.income}
            monthlyExpense={summary.expense}
            exchangeRates={(profile as { exchange_rates?: Record<string, number> })?.exchange_rates ?? undefined}
          />
        </MobileAccordion>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
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
        <FlowPlanCard
          activeDays={expenseAnalytics.activeDays}
          labels={{
            section: t.dashboard.flowMode,
            title: t.dashboard.flowPlan,
            subtitle: t.dashboard.flowPlanDesc,
            activeDays: t.dashboard.flowDays,
            recommendation: t.dashboard.flowRecommendation,
          }}
        />
      </div>
      <div className="mt-4">
        <MobileAccordion
          title={t.dashboard.flowAnalytics}
          subtitle={t.dashboard.flowAnalyticsDesc}
          defaultOpen
        >
          <FlowInsightsCard
            currency={profile?.currency ?? "MDL"}
            language={language}
            avgPerDay={expenseAnalytics.avgPerDay}
            changePercent={expenseAnalytics.changePercent}
            topCategoryName={expenseAnalytics.topCategory.name}
            topCategoryAmount={expenseAnalytics.topCategory.amount}
            focusScore={expenseAnalytics.focusScore}
            labels={{
              section: t.dashboard.flowMode,
              title: t.dashboard.flowAnalytics,
              subtitle: t.dashboard.flowAnalyticsDesc,
              avgPerDay: t.dashboard.avgPerDay,
              trendMonth: t.dashboard.trendMonth,
              flowScore: t.dashboard.flowScore,
              trendUnderControl: t.dashboard.trendUnderControl,
              trendGrowing: t.dashboard.trendGrowing,
              topCategory: t.dashboard.topCategoryMonth,
              open: t.actions.open,
            }}
          />
        </MobileAccordion>
      </div>
      <div className="mt-4">
        <MobileAccordion title={t.dashboard.foodPlanTitle} subtitle={t.dashboard.foodPlanSubtitle}>
          <FoodPlanCard
            foodBudgetToday={foodBudgetToday}
            avgFoodDaily={avgFoodDaily || 0}
            foodBudgetMonth={foodBudgetMonth}
            foodRemainingMonth={foodRemainingMonth}
            foodSpentMonth={foodSpent}
            currency={profile?.currency ?? "MDL"}
            language={language}
            personalItems={personalItems}
            favoriteItems={favorites.map((item) => ({ id: item.id, title: item.title }))}
            stableItems={stableItems}
            categories={foodCategoryTotals}
            showHeader={false}
            labels={{
              title: t.dashboard.foodPlanTitle,
              subtitle: t.dashboard.foodPlanSubtitle,
              budgetToday: t.dashboard.foodBudgetToday,
              avgDaily: t.dashboard.foodAvgDaily,
              budgetMonth: t.dashboard.foodBudgetMonth,
              remainingMonth: t.dashboard.foodRemainingMonth,
              planTitle: t.dashboard.foodPlanAutoTitle,
              planBudget: t.dashboard.foodPlanAutoBudget,
              planLow: t.dashboard.foodPlanAutoLow,
              planMid: t.dashboard.foodPlanAutoMid,
              planHigh: t.dashboard.foodPlanAutoHigh,
              categoriesTitle: t.dashboard.foodCategoriesTitle,
              categoriesHome: t.dashboard.foodCategoriesHome,
              categoriesCafe: t.dashboard.foodCategoriesCafe,
              categoriesDelivery: t.dashboard.foodCategoriesDelivery,
              stableTitle: t.dashboard.foodStableTitle,
              stableHint: t.dashboard.foodStableHint,
              stableEmpty: t.dashboard.foodStableEmpty,
              favoriteTitle: t.dashboard.favoriteTitle,
              favoriteHint: t.dashboard.favoriteHint,
              favoritePlaceholder: t.dashboard.favoritePlaceholder,
              favoriteAdd: t.dashboard.favoriteAdd,
              favoriteRemove: t.dashboard.favoriteRemove,
              weeklyReminderTitle: t.dashboard.weeklyReminderTitle,
              weeklyReminderDescription: t.dashboard.weeklyReminderDescription,
              weeklyReminderToast: t.dashboard.weeklyReminderToast,
              manualTitle: t.dashboard.foodManualTitle,
              manualHint: t.dashboard.foodManualHint,
              manualAdd: t.dashboard.foodManualAdd,
              manualItem: t.dashboard.foodManualItem,
              manualPrice: t.dashboard.foodManualPrice,
              manualTotal: t.dashboard.foodManualTotal,
              spendPlanTitle: t.dashboard.foodSpendPlanTitle,
              spendPlanHint: t.dashboard.foodSpendPlanHint,
              spendPlanDaily: t.dashboard.foodSpendPlanDaily,
              spendPlanMonthly: t.dashboard.foodSpendPlanMonthly,
              spendPlanList: t.dashboard.foodSpendPlanList,
              spendPlanRemaining: t.dashboard.foodSpendPlanRemaining,
              spendPlanDays: t.dashboard.foodSpendPlanDays,
              spendPlanReset: t.dashboard.foodSpendPlanReset,
              goalTitle: t.dashboard.foodGoalTitle,
              goalHint: t.dashboard.foodGoalHint,
              goalInput: t.dashboard.foodGoalInput,
              goalSpent: t.dashboard.foodGoalSpent,
              goalRemaining: t.dashboard.foodGoalRemaining,
              goalProgress: t.dashboard.foodGoalProgress,
              ideas: t.dashboard.foodIdeas,
              ideaLow: t.dashboard.foodIdeaLow,
              ideaMid: t.dashboard.foodIdeaMid,
              ideaHigh: t.dashboard.foodIdeaHigh,
              reminderTitle: t.dashboard.foodReminderTitle,
              reminderCta: t.dashboard.foodReminderCta,
              reminderToast: t.dashboard.foodReminderToast,
              personalTitle: t.dashboard.foodPersonalTitle,
            }}
          />
        </MobileAccordion>
      </div>
      <div className="mt-4">
        <MobileAccordion title={t.nav.calculator} subtitle={t.financeCalc.title}>
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
      </div>
      <div className="mt-4">
        <MobileAccordion title={t.nav.calendar} subtitle={t.calendarPlanner.hint}>
          <FinancialCalendarCard
            bills={bills}
            reminders={reminders}
            notes={notes}
            language={language}
            variant="calendar"
            showHeader={false}
          />
        </MobileAccordion>
      </div>
      <div className="mt-4">
        <MobileAccordion title={t.dashboard.upcomingBills} subtitle={t.dashboard.quickActionsHint}>
          <UpcomingBillsCard
            bills={bills}
            currency={profile?.currency ?? "MDL"}
            language={language}
            labels={{
              title: t.dashboard.upcomingBills,
              hint: t.dashboard.quickActionsHint,
              empty: t.bills.emptyDescription,
              statusUpcoming: t.bills.upcoming,
              statusPaid: t.bills.paid,
              statusOverdue: t.bills.overdue,
              dueLabel: t.bills.dueLabel,
            }}
          />
        </MobileAccordion>
      </div>
      <div className="mt-4">
        <MobileAccordion title={t.dashboard.reminders} subtitle={t.dashboard.quickActionsHint}>
          <RemindersCard
            reminders={reminders.filter((r) => r.status === "active")}
            language={language}
            labels={{
              title: t.dashboard.reminders,
              hint: t.dashboard.quickActionsHint,
              empty: t.reminders.emptyDescription,
              priorityLow: t.reminders.priorityLow,
              priorityMedium: t.reminders.priorityMedium,
              priorityHigh: t.reminders.priorityHigh,
            }}
          />
        </MobileAccordion>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2 md:grid-cols-2">
        <MobileAccordion title={t.dashboard.spendingAnalytics} defaultOpen>
          <SpendingChartCard data={chartData} />
        </MobileAccordion>
        <MobileAccordion title={t.dashboard.topCategories}>
          <CategoryBreakdownCard data={categories} />
        </MobileAccordion>
      </div>
      <MobileQuickActions
        labels={{
          expense: t.actions.addExpense,
          income: t.actions.addIncome,
          bill: t.actions.addBill,
          reminder: t.actions.addReminder,
        }}
      />
    </div>
  );
}
