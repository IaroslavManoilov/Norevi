import type { Bill, Reminder } from "@/types/domain";

export type RhythmLanguage = "ru" | "en" | "ro";

export type RhythmTaskKind = "bill" | "reminder" | "finance" | "focus";

export type RhythmTask = {
  id: string;
  kind: RhythmTaskKind;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  href: string;
  suggestReminderAt: string;
};

export type RhythmPlan = {
  score: number;
  focusText: string;
  tasks: RhythmTask[];
  stats: {
    overdueBills: number;
    dueSoonBills: number;
    activeReminders: number;
    todayTasks: number;
  };
};

type BuildRhythmInput = {
  language: RhythmLanguage;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  bills: Bill[];
  reminders: Reminder[];
  now?: Date;
};

const copy = {
  ru: {
    focusStrong: "Ритм под контролем. Двигайся по плану без перегруза.",
    focusMedium: "Ритм нестабильный. Закрой приоритеты, чтобы снизить стресс.",
    focusWeak: "Ритм перегружен. Сфокусируйся на критичных задачах сегодня.",
    dueTodayPrefix: "Сегодня",
    overdueBillTitle: "Просрочен платеж",
    overdueBillDesc: "Оплати в первую очередь, чтобы не накапливать штрафы.",
    dueSoonBillTitle: "Платеж скоро",
    dueSoonBillDesc: "Подготовь оплату заранее, чтобы не забыть.",
    reminderSoonTitle: "Скорое напоминание",
    reminderSoonDesc: "Закрой задачу по плану дня.",
    cashGapTitle: "Проверь месячный баланс",
    cashGapDesc: "Расходы выше доходов. Пересобери лимиты в калькуляторе.",
    focusCleanupTitle: "Очисти перегруженный список",
    focusCleanupDesc: "Слишком много активных напоминаний. Оставь только важное.",
  },
  en: {
    focusStrong: "Rhythm is under control. Follow your plan without overload.",
    focusMedium: "Rhythm is unstable. Close priorities to reduce stress.",
    focusWeak: "Rhythm is overloaded. Focus on critical tasks today.",
    dueTodayPrefix: "Today",
    overdueBillTitle: "Overdue bill",
    overdueBillDesc: "Pay first to avoid extra penalties.",
    dueSoonBillTitle: "Bill due soon",
    dueSoonBillDesc: "Prepare payment in advance so you do not miss it.",
    reminderSoonTitle: "Upcoming reminder",
    reminderSoonDesc: "Complete it within your daily flow.",
    cashGapTitle: "Review monthly balance",
    cashGapDesc: "Expenses are above income. Rebuild limits in calculator.",
    focusCleanupTitle: "Reduce overloaded queue",
    focusCleanupDesc: "Too many active reminders. Keep only high-impact ones.",
  },
  ro: {
    focusStrong: "Ritmul este sub control. Continua fara supraincarcare.",
    focusMedium: "Ritmul este instabil. Inchide prioritatile pentru mai putin stres.",
    focusWeak: "Ritmul este supraincarcat. Concentreaza-te pe critic azi.",
    dueTodayPrefix: "Astazi",
    overdueBillTitle: "Plata intarziata",
    overdueBillDesc: "Plateste intai ca sa eviti penalitati.",
    dueSoonBillTitle: "Plata urmeaza",
    dueSoonBillDesc: "Pregateste plata din timp ca sa nu o ratezi.",
    reminderSoonTitle: "Memento apropiat",
    reminderSoonDesc: "Rezolva in ritmul zilei.",
    cashGapTitle: "Verifica balanta lunara",
    cashGapDesc: "Cheltuielile depasesc veniturile. Refa limitele in calculator.",
    focusCleanupTitle: "Curata lista supraincarcata",
    focusCleanupDesc: "Prea multe memento active. Pastreaza doar ce conteaza.",
  },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function addMinutes(isoDate: string, minutes: number) {
  const date = new Date(isoDate);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function isWithinHours(isoDate: string, now: Date, hours: number) {
  const delta = new Date(isoDate).getTime() - now.getTime();
  return delta >= 0 && delta <= hours * 60 * 60 * 1000;
}

export function buildRhythmPlan(input: BuildRhythmInput): RhythmPlan {
  const now = input.now ?? new Date();
  const t = copy[input.language] ?? copy.en;

  const activeReminders = input.reminders.filter((item) => item.status === "active");
  const overdueBills = input.bills.filter(
    (bill) => bill.status !== "paid" && new Date(bill.due_date).getTime() < now.getTime()
  );
  const dueSoonBills = input.bills.filter(
    (bill) =>
      bill.status !== "paid" &&
      new Date(bill.due_date).getTime() >= now.getTime() &&
      isWithinHours(bill.due_date, now, 72)
  );
  const reminderSoon = activeReminders.filter((item) => isWithinHours(item.remind_at, now, 24));

  const monthlyDelta = input.monthlyIncome - input.monthlyExpense;
  const incomeBase = Math.max(1, input.monthlyIncome);
  const monthlyStress = monthlyDelta >= 0 ? 0 : Math.abs(monthlyDelta) / incomeBase;

  let score = 100;
  score -= overdueBills.length * 15;
  score -= dueSoonBills.length * 6;
  score -= Math.min(18, reminderSoon.length * 4);
  score -= Math.min(22, Math.round(monthlyStress * 35));
  score -= activeReminders.length > 8 ? 7 : 0;
  score = clamp(score, 10, 100);

  const tasks: RhythmTask[] = [];

  overdueBills.slice(0, 3).forEach((bill) => {
    tasks.push({
      id: `overdue-${bill.id}`,
      kind: "bill",
      title: `${t.overdueBillTitle}: ${bill.title}`,
      description: t.overdueBillDesc,
      priority: "high",
      href: `/bills/${bill.id}`,
      suggestReminderAt: addMinutes(now.toISOString(), 20),
    });
  });

  dueSoonBills.slice(0, 3).forEach((bill) => {
    tasks.push({
      id: `due-soon-${bill.id}`,
      kind: "bill",
      title: `${t.dueSoonBillTitle}: ${bill.title}`,
      description: t.dueSoonBillDesc,
      priority: "medium",
      href: `/bills/${bill.id}`,
      suggestReminderAt: addMinutes(now.toISOString(), 40),
    });
  });

  reminderSoon.slice(0, 2).forEach((item) => {
    tasks.push({
      id: `reminder-${item.id}`,
      kind: "reminder",
      title: `${t.reminderSoonTitle}: ${item.title}`,
      description: t.reminderSoonDesc,
      priority: item.priority === "high" ? "high" : "medium",
      href: `/reminders/${item.id}`,
      suggestReminderAt: addMinutes(now.toISOString(), 15),
    });
  });

  if (monthlyDelta < 0 || input.balance < 0) {
    tasks.push({
      id: "finance-recovery",
      kind: "finance",
      title: t.cashGapTitle,
      description: t.cashGapDesc,
      priority: "high",
      href: "/finance/calculator",
      suggestReminderAt: addMinutes(now.toISOString(), 25),
    });
  }

  if (activeReminders.length > 8) {
    tasks.push({
      id: "focus-cleanup",
      kind: "focus",
      title: t.focusCleanupTitle,
      description: t.focusCleanupDesc,
      priority: "medium",
      href: "/reminders",
      suggestReminderAt: addMinutes(now.toISOString(), 50),
    });
  }

  const sorted = tasks
    .sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 } as const;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    })
    .slice(0, 6);

  const focusText = score >= 75 ? t.focusStrong : score >= 45 ? t.focusMedium : t.focusWeak;

  return {
    score,
    focusText,
    tasks: sorted,
    stats: {
      overdueBills: overdueBills.length,
      dueSoonBills: dueSoonBills.length,
      activeReminders: activeReminders.length,
      todayTasks: sorted.length,
    },
  };
}
