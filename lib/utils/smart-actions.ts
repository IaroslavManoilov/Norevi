export type DashboardLanguage = "ru" | "en" | "ro";
export type SmartActionsVariant = "A" | "B";

export type SmartActionMetric = {
  label: string;
  value: string;
};

export type SmartAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "danger" | "warning" | "success";
  score: number;
  personalizedScore: number;
  why: string;
  metrics: SmartActionMetric[];
};

type SmartActionsInput = {
  language: DashboardLanguage;
  variant: SmartActionsVariant;
  preferenceScores?: Record<string, number>;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  requiredBills: number;
  billsThisWeek: number;
  activeReminders: number;
  changePercent: number;
  foodSpentMonth: number;
  foodBudgetMonth: number;
};

const copy = {
  ru: {
    section: "Умные шаги",
    titleA: "Что лучше сделать сейчас",
    titleB: "Приоритетные действия",
    subtitleA: "Персональный план на основе вашего ритма расходов",
    subtitleB: "Вариант B: компактная подача и фокус на результате",
    openA: "Открыть",
    openB: "Сделать шаг",
    done: "Сделано",
    dismiss: "Не актуально",
    whyLabel: "Почему",
    fallbackTitle: "Режим под контролем",
    fallbackDesc: "Серьезных рисков не видно. Сохраняйте темп и проверьте план на неделю.",
    fallbackWhy: "Метрики стабильны, сильных перекосов нет.",
    fallbackHref: "/dashboard",
    cashGapTitle: "Закройте дефицит месяца",
    cashGapDesc: "Расходы выше доходов. Снизьте переменные траты и пересоберите лимит.",
    cashGapWhy: "Отрицательный денежный поток в текущем месяце.",
    cashGapHref: "/finance/calculator",
    billsTitle: "Приоритизируйте оплаты этой недели",
    billsDesc: "Платежей на неделе: {count}. Лучше закрыть критичные первыми через быстрые оплаты.",
    billsWhy: "Пики обязательных платежей создают риск кассового разрыва.",
    billsHref: "/payments",
    remindersTitle: "Разгрузите напоминания",
    remindersDesc: "Активных напоминаний много ({count}). Оставьте только приоритетные, чтобы не терять фокус.",
    remindersWhy: "Высокая когнитивная нагрузка ухудшает дисциплину действий.",
    remindersHref: "/reminders",
    trendTitle: "Стабилизируйте рост расходов",
    trendDesc: "Расходы выросли на {percent}%. Проверьте категории и уберите 1-2 лишние статьи.",
    trendWhy: "Нисходящий контроль по динамике расходов.",
    trendHref: "/finance",
    foodTitle: "Подтяните food-план",
    foodDesc: "Еда съедает бюджет быстрее плана. Обновите лимит дня и список покупок.",
    foodWhy: "Food-категория расходуется выше целевого темпа.",
    foodHref: "/dashboard#food",
    metrics: {
      delta: "Дельта",
      billsWeek: "Платежи/неделя",
      reminders: "Активные",
      trend: "Рост",
      foodLoad: "Food нагрузка",
      score: "Скор",
    },
  },
  en: {
    section: "Smart Actions",
    titleA: "What To Do Next",
    titleB: "Priority Actions",
    subtitleA: "A personal plan based on your spending rhythm",
    subtitleB: "Variant B: compact layout with outcome focus",
    openA: "Open",
    openB: "Take Action",
    done: "Done",
    dismiss: "Not relevant",
    whyLabel: "Why",
    fallbackTitle: "You are in control",
    fallbackDesc: "No critical risks detected. Keep the pace and review your weekly plan.",
    fallbackWhy: "Metrics are stable with no major imbalance.",
    fallbackHref: "/dashboard",
    cashGapTitle: "Close the monthly gap",
    cashGapDesc: "Expenses are higher than income. Cut variable costs and rebuild your limit.",
    cashGapWhy: "Current monthly cash flow is negative.",
    cashGapHref: "/finance/calculator",
    billsTitle: "Prioritize this week bills",
    billsDesc: "Bills due this week: {count}. Pay critical ones first via quick payments.",
    billsWhy: "Bill concentration increases short-term pressure.",
    billsHref: "/payments",
    remindersTitle: "Reduce reminder overload",
    remindersDesc: "Too many active reminders ({count}). Keep only high-priority ones.",
    remindersWhy: "High reminder load reduces action focus.",
    remindersHref: "/reminders",
    trendTitle: "Stabilize expense growth",
    trendDesc: "Spending grew by {percent}%. Review categories and cut 1-2 extra items.",
    trendWhy: "Expense trend indicates declining control.",
    trendHref: "/finance",
    foodTitle: "Tune your food plan",
    foodDesc: "Food spending is running fast. Update daily limit and grocery list.",
    foodWhy: "Food category is burning above target pace.",
    foodHref: "/dashboard#food",
    metrics: {
      delta: "Delta",
      billsWeek: "Bills/week",
      reminders: "Active",
      trend: "Growth",
      foodLoad: "Food load",
      score: "Score",
    },
  },
  ro: {
    section: "Actiuni Smart",
    titleA: "Ce E Bine Sa Faci Acum",
    titleB: "Actiuni Prioritare",
    subtitleA: "Plan personal pe baza ritmului tau de cheltuieli",
    subtitleB: "Varianta B: format compact orientat pe rezultat",
    openA: "Deschide",
    openB: "Actioneaza",
    done: "Rezolvat",
    dismiss: "Nu e relevant",
    whyLabel: "De ce",
    fallbackTitle: "Situatia e sub control",
    fallbackDesc: "Nu sunt riscuri critice. Pastreaza ritmul si verifica planul saptamanii.",
    fallbackWhy: "Indicatorii sunt stabili, fara dezechilibre majore.",
    fallbackHref: "/dashboard",
    cashGapTitle: "Acopera golul lunar",
    cashGapDesc: "Cheltuielile sunt peste venit. Redu costurile variabile si refa limita.",
    cashGapWhy: "Fluxul de numerar lunar este negativ.",
    cashGapHref: "/finance/calculator",
    billsTitle: "Prioritizeaza platile saptamanii",
    billsDesc: "Plati in aceasta saptamana: {count}. Inchide mai intai cele critice.",
    billsWhy: "Concentrarea platilor creste presiunea pe termen scurt.",
    billsHref: "/payments",
    remindersTitle: "Redu aglomerarea de memento",
    remindersDesc: "Prea multe memento active ({count}). Pastreaza doar cele prioritare.",
    remindersWhy: "Sarcina ridicata de memento reduce focusul.",
    remindersHref: "/reminders",
    trendTitle: "Stabilizeaza cresterea cheltuielilor",
    trendDesc: "Cheltuielile au crescut cu {percent}%. Revizuieste categoriile si taie 1-2 puncte.",
    trendWhy: "Trendul cheltuielilor indica scaderea controlului.",
    trendHref: "/finance",
    foodTitle: "Ajusteaza food-plan",
    foodDesc: "Bugetul pentru mancare se consuma prea repede. Actualizeaza limita zilnica.",
    foodWhy: "Categoria food depaseste ritmul tinta.",
    foodHref: "/dashboard#food",
    metrics: {
      delta: "Delta",
      billsWeek: "Plati/sapt",
      reminders: "Active",
      trend: "Crestere",
      foodLoad: "Incarcare food",
      score: "Scor",
    },
  },
} as const;

function replace(template: string, value: Record<string, string>) {
  return Object.entries(value).reduce((acc, [key, val]) => acc.replace(`{${key}}`, val), template);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hashToVariant(seed: string): SmartActionsVariant {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % 2 === 0 ? "A" : "B";
}

export function assignSmartActionsVariant(userId: string): SmartActionsVariant {
  return hashToVariant(`smart-actions-${userId}`);
}

export function resolveSmartActionsVariant(
  userId: string,
  stats?: {
    A?: { views: number; engagementScore: number };
    B?: { views: number; engagementScore: number };
  }
): SmartActionsVariant {
  const fallback = assignSmartActionsVariant(userId);
  if (!stats?.A || !stats?.B) return fallback;
  if (stats.A.views < 3 || stats.B.views < 3) return fallback;
  if (stats.A.engagementScore === stats.B.engagementScore) return fallback;
  return stats.A.engagementScore > stats.B.engagementScore ? "A" : "B";
}

export function getSmartActions(input: SmartActionsInput): {
  section: string;
  title: string;
  subtitle: string;
  openLabel: string;
  doneLabel: string;
  dismissLabel: string;
  whyLabel: string;
  actions: SmartAction[];
} {
  const t = copy[input.language] ?? copy.en;
  const actions: SmartAction[] = [];
  const preference = input.preferenceScores ?? {};

  const cashDelta = input.monthlyIncome - input.monthlyExpense;
  const billsRatio = input.balance > 0 ? input.requiredBills / input.balance : 1;
  const foodRatio = input.foodBudgetMonth > 0 ? input.foodSpentMonth / input.foodBudgetMonth : 0;

  if (cashDelta < 0) {
    const base = 100;
    const personalizedScore = base + (preference["cash-gap"] ?? 0);
    actions.push({
      id: "cash-gap",
      title: t.cashGapTitle,
      description: t.cashGapDesc,
      href: t.cashGapHref,
      tone: "danger",
      score: base,
      personalizedScore,
      why: t.cashGapWhy,
      metrics: [
        { label: t.metrics.delta, value: `${Math.round(cashDelta)}` },
        { label: t.metrics.score, value: `${personalizedScore}` },
      ],
    });
  }

  if (input.billsThisWeek >= 2 || billsRatio > 0.4) {
    const base = 90;
    const personalizedScore = base + (preference["bills-week"] ?? 0);
    actions.push({
      id: "bills-week",
      title: t.billsTitle,
      description: replace(t.billsDesc, { count: String(input.billsThisWeek) }),
      href: t.billsHref,
      tone: "warning",
      score: base,
      personalizedScore,
      why: t.billsWhy,
      metrics: [
        { label: t.metrics.billsWeek, value: String(input.billsThisWeek) },
        { label: t.metrics.score, value: `${personalizedScore}` },
      ],
    });
  }

  if (input.activeReminders >= 7) {
    const base = 80;
    const personalizedScore = base + (preference["reminder-load"] ?? 0);
    actions.push({
      id: "reminder-load",
      title: t.remindersTitle,
      description: replace(t.remindersDesc, { count: String(input.activeReminders) }),
      href: t.remindersHref,
      tone: "warning",
      score: base,
      personalizedScore,
      why: t.remindersWhy,
      metrics: [
        { label: t.metrics.reminders, value: String(input.activeReminders) },
        { label: t.metrics.score, value: `${personalizedScore}` },
      ],
    });
  }

  if (input.changePercent >= 12) {
    const base = 85;
    const personalizedScore = base + (preference["spending-trend"] ?? 0);
    actions.push({
      id: "spending-trend",
      title: t.trendTitle,
      description: replace(t.trendDesc, { percent: input.changePercent.toFixed(1) }),
      href: t.trendHref,
      tone: "danger",
      score: base,
      personalizedScore,
      why: t.trendWhy,
      metrics: [
        { label: t.metrics.trend, value: `${input.changePercent.toFixed(1)}%` },
        { label: t.metrics.score, value: `${personalizedScore}` },
      ],
    });
  }

  if (foodRatio >= 0.85) {
    const base = 65;
    const personalizedScore = base + (preference["food-plan"] ?? 0);
    actions.push({
      id: "food-plan",
      title: t.foodTitle,
      description: t.foodDesc,
      href: t.foodHref,
      tone: "success",
      score: base,
      personalizedScore,
      why: t.foodWhy,
      metrics: [
        { label: t.metrics.foodLoad, value: `${Math.round(foodRatio * 100)}%` },
        { label: t.metrics.score, value: `${personalizedScore}` },
      ],
    });
  }

  if (!actions.length) {
    const base = 30;
    const personalizedScore = base + (preference.stable ?? 0);
    actions.push({
      id: "stable",
      title: t.fallbackTitle,
      description: t.fallbackDesc,
      href: t.fallbackHref,
      tone: "success",
      score: base,
      personalizedScore,
      why: t.fallbackWhy,
      metrics: [{ label: t.metrics.score, value: `${personalizedScore}` }],
    });
  }

  const rankKey = input.variant === "A" ? "score" : "personalizedScore";
  const ranked = actions
    .map((item) => ({
      ...item,
      personalizedScore: clamp(item.personalizedScore, 1, 200),
    }))
    .sort((a, b) => b[rankKey] - a[rankKey])
    .slice(0, 3);

  return {
    section: t.section,
    title: input.variant === "A" ? t.titleA : t.titleB,
    subtitle: input.variant === "A" ? t.subtitleA : t.subtitleB,
    openLabel: input.variant === "A" ? t.openA : t.openB,
    doneLabel: t.done,
    dismissLabel: t.dismiss,
    whyLabel: t.whyLabel,
    actions: ranked,
  };
}
