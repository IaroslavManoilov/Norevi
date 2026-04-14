export type Language = "ru" | "en" | "ro";

export type Translations = {
  appName: string;
  tagline: string;
  nav: {
    overview: string;
    finance: string;
    bills: string;
    reminders: string;
    assistant: string;
    settings: string;
    tools: string;
    calculator: string;
    calendar: string;
    paymentsHistory: string;
  };
  actions: {
    quickAction: string;
    signOut: string;
    save: string;
    back: string;
    next: string;
    finish: string;
    open: string;
    addExpense: string;
    addIncome: string;
    addBill: string;
    addReminder: string;
    theme: string;
  };
  common: {
    yes: string;
    no: string;
    loading: string;
    error: string;
    confirm: string;
    delete: string;
    deleteConfirm: string;
    deleteFailed: string;
    markPaid: string;
    markPaidFailed: string;
    markDone: string;
    markDoneFailed: string;
    noData: string;
    languageUpdated: string;
  };
  errors: {
    missingEnv: string;
    network: string;
    saveTransaction: string;
    saveBill: string;
    saveReminder: string;
    saveSettings: string;
    updateProfile: string;
    updateRates: string;
    onboarding: string;
    assistantResponse: string;
    assistantNetwork: string;
    emptyMessage: string;
    validation: {
      email: string;
      passwordMin: string;
      nameMin: string;
      amountPositive: string;
      titleRequired: string;
      dateRequired: string;
      dateTimeRequired: string;
      generic: string;
    };
  };
  auth: {
    signInTitle: string;
    signUpTitle: string;
    signInCta: string;
    signUpCta: string;
    name: string;
    email: string;
    password: string;
    envMissing: string;
    networkError: string;
  };
  landing: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  dashboard: {
      title: string;
      greetingMorning: string;
      greetingBack: string;
      balance: string;
      incomeMonth: string;
      expenseMonth: string;
      billsWeek: string;
      activeReminders: string;
      dailyLimit: string;
      dailyHintPositive: string;
    dailyHintCaution: string;
    dailyHintWarning: string;
    dailyHintNeutral: string;
    mustPayTitle: string;
    mustPayHint: string;
    mustPayEmpty: string;
    mustPayTotal: string;
    mustPayCriticalTitle: string;
    mustPayCategoriesTitle: string;
    mustPayCategoryFallback: string;
    mustPayOverdue: string;
    mustPayDueSoon: string;
    foodPlanTitle: string;
    foodPlanSubtitle: string;
    foodBudgetToday: string;
    foodAvgDaily: string;
    foodBudgetMonth: string;
    foodRemainingMonth: string;
    foodPlanAutoTitle: string;
    foodPlanAutoBudget: string;
    foodPlanAutoLow: string;
    foodPlanAutoMid: string;
    foodPlanAutoHigh: string;
    foodCategoriesTitle: string;
    foodCategoriesHome: string;
    foodCategoriesCafe: string;
    foodCategoriesDelivery: string;
    foodStableTitle: string;
    foodStableHint: string;
    foodStableEmpty: string;
    favoriteTitle: string;
    favoriteHint: string;
    favoritePlaceholder: string;
    favoriteAdd: string;
    favoriteRemove: string;
    weeklyReminderTitle: string;
    weeklyReminderDescription: string;
    weeklyReminderToast: string;
    foodManualTitle: string;
    foodManualHint: string;
    foodManualAdd: string;
    foodManualItem: string;
    foodManualPrice: string;
    foodManualTotal: string;
    foodSpendPlanTitle: string;
    foodSpendPlanHint: string;
    foodSpendPlanDaily: string;
    foodSpendPlanMonthly: string;
    foodSpendPlanList: string;
    foodSpendPlanRemaining: string;
    foodSpendPlanDays: string;
    foodSpendPlanReset: string;
    foodGoalTitle: string;
    foodGoalHint: string;
    foodGoalInput: string;
    foodGoalSpent: string;
    foodGoalRemaining: string;
    foodGoalProgress: string;
    quickPayTitle: string;
    quickPayHint: string;
    quickPaySalaryPlaceholder: string;
    quickPaySalaryCta: string;
    quickPaySalarySuccess: string;
    quickPaySalaryError: string;
    quickPayBillsTitle: string;
    quickPayBillsHint: string;
    quickPayBillsEmpty: string;
    quickPayCriticalLabel: string;
    quickPayOverdueLabel: string;
    quickPayDueTodayLabel: string;
    quickPayOverdueOnly: string;
    quickPayBillPay: string;
    quickPayBillPaying: string;
    quickPayBillPaid: string;
    quickPayBillPaidToday: string;
    quickPayBillPaidLabel: string;
    quickPayPayAll: string;
    quickPayPayAllBusy: string;
    quickPayMethodLabel: string;
    quickPayMethodApple: string;
    quickPayMethodCard: string;
    quickPayPaidVia: string;
    quickPayReminderTitle: string;
    quickPayReminderBody: string;
    quickPayReminderToast: string;
    quickPayPayInternet: string;
    quickPayPayHousing: string;
    quickPayPayCredit: string;
    quickPayPayAllNoteTitle: string;
    quickPayPayAllNoteBody: string;
    quickPayPayAllNoteSaved: string;
    quickPayReceiptTitle: string;
    quickPayReceiptBody: string;
    quickPayReceiptSaved: string;
    quickPayBillPaymentTitle: string;
    quickPayBillPaymentNote: string;
    foodIdeas: string;
    foodIdeaLow: string;
    foodIdeaMid: string;
    foodIdeaHigh: string;
    foodReminderTitle: string;
    foodReminderCta: string;
    foodReminderToast: string;
    foodPersonalTitle: string;
    mustPayIncome: string;
    mustPayExpenses: string;
    mustPayRemaining: string;
    savingsTitle: string;
    savingsGoalLabel: string;
    savingsInEur: string;
    savingsFeasible: string;
    savingsAfter: string;
    savingsFood: string;
    quickActions: string;
      quickActionsHint: string;
    flowMode: string;
    flowPlan: string;
    flowPlanDesc: string;
    flowDays: string;
    flowRecommendation: string;
    flowAnalytics: string;
    flowAnalyticsDesc: string;
    avgPerDay: string;
    trendMonth: string;
    flowScore: string;
    trendUnderControl: string;
    trendGrowing: string;
    topCategoryMonth: string;
    upcomingBills: string;
    reminders: string;
    spendingAnalytics: string;
    topCategories: string;
  };
  financeCalc: {
    title: string;
    subtitle: string;
    incomeMonth: string;
    fixedExpenses: string;
    variableExpenses: string;
    reserve: string;
    freeAfter: string;
    safePerDay: string;
    savingsPotential: string;
    statusSurplus: string;
    statusBalanced: string;
    statusDeficit: string;
    totalExpenses: string;
    currency: string;
    rates: string;
    rateHint: string;
    trendLabel: string;
    ratesUpdating: string;
    resetActual: string;
    clearAll: string;
    planTitle: string;
    planHint: string;
    foodDaily: string;
    transportPassCost: string;
    transportPassMonths: string;
    canSpendMonth: string;
    foodMonthly: string;
    transportMonthly: string;
    otherMonthly: string;
  };
  calendarPlanner: {
    title: string;
    hint: string;
    selectedDate: string;
    addReminder: string;
    reminderTitle: string;
    reminderTime: string;
    remindersForDate: string;
    emptyForDate: string;
    dayHasTasks: string;
    dayNoTasks: string;
    addNote: string;
    noteTitle: string;
    noteBody: string;
    notesForDate: string;
    emptyNotes: string;
  };
  paymentsHistory: {
    title: string;
    subtitle: string;
    empty: string;
    total: string;
    manageRules: string;
    rulesTitle: string;
    rulesHint: string;
    rulePattern: string;
    ruleCategory: string;
    ruleSave: string;
    ruleDelete: string;
    rulesEmpty: string;
    ruleAddTitle: string;
    ruleAddCta: string;
    search: string;
    filterAll: string;
    exportCsv: string;
    importCsv: string;
    importHint: string;
  };
  finance: {
    title: string;
    subtitle: string;
    addExpense: string;
    addIncome: string;
    openCalculator: string;
    editTitle: string;
    monthBalance: string;
    avgPerDay: string;
    filteredOps: string;
    incomeLabel: string;
    expenseLabel: string;
    topCategory: string;
    changeLabel: string;
    transactionType: string;
    categories: string;
    all: string;
    expenses: string;
    incomes: string;
    allCategories: string;
  };
  bills: {
    title: string;
    subtitle: string;
    addBill: string;
    openCalendar: string;
    calendarTitle: string;
    calendarSubtitle: string;
    editTitle: string;
    itemLabel: string;
    totalBills: string;
    needAttention: string;
    overdueLabel: string;
    sumByFilter: string;
    statusFilter: string;
    all: string;
    upcoming: string;
    overdue: string;
    paid: string;
    dueLabel: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  reminders: {
    title: string;
    subtitle: string;
    addReminder: string;
    editTitle: string;
    itemLabel: string;
    totalReminders: string;
    activeNow: string;
    highPriority: string;
    statusFilter: string;
    priorityFilter: string;
    all: string;
    active: string;
    done: string;
    cancelled: string;
    priorityAny: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    activeDialog: string;
    newDialog: string;
    yourMessages: string;
    assistantReplies: string;
    helperHint: string;
    placeholder: string;
    send: string;
    emptyHistory: string;
    suggested: string[];
    responses: {
      safeSpend: string;
      billsWeekEmpty: string;
      foodMonth: string;
      reminderCreated: string;
      defaultReminderTitle: string;
      defaultReminderDescription: string;
      subscriptionsEmpty: string;
      topExpensesEmpty: string;
      fallback: string;
      notUnderstood: string;
      systemPrompt: string;
      scope: string[];
      subscriptionsLabel: string;
    };
  };
  forms: {
    amount: string;
    title: string;
    note: string;
    categoryLabel: string;
    categoryNone: string;
    date: string;
    repeatNone: string;
    repeatDaily: string;
    repeatWeekly: string;
    repeatMonthly: string;
    repeatYearly: string;
    autoRenew: string;
    save: string;
    add: string;
    typeExpense: string;
    typeIncome: string;
    reminderTitle: string;
    reminderDesc: string;
    remindAt: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    statusActive: string;
    statusDone: string;
    statusCancelled: string;
  };
  settings: {
    title: string;
    name: string;
    currency: string;
    language: string;
    timezone: string;
    budgetLimit: string;
    exchangeRates: string;
    exchangeRatesHint: string;
    noExpenseCategories: string;
    noIncomeCategories: string;
  };
  onboarding: {
    welcomeTitle: string;
    welcomeText: string;
    chooseCurrency: string;
    chooseLanguage: string;
    budgetLimit: string;
    doneTitle: string;
    doneText: string;
    step: string;
    stepOf: string;
    limitPlaceholder: string;
  };
  currencies: {
    MDL: string;
    EUR: string;
    USD: string;
    RUB: string;
    RUP: string;
  };
  languages: {
    ru: string;
    en: string;
    ro: string;
  };
};

export const translations: Record<Language, Translations> = {
  ru: {
    appName: "Norevi",
    tagline: "умный ритм жизни",
    nav: {
      overview: "Обзор",
      finance: "Финансы",
      bills: "Платежи",
      reminders: "Напоминания",
      assistant: "Помощник",
      settings: "Настройки",
      tools: "Инструменты",
      calculator: "Калькулятор",
      calendar: "Календарь",
      paymentsHistory: "История оплат",
    },
    actions: {
      quickAction: "Быстрое действие",
      signOut: "Выйти",
      save: "Сохранить",
      back: "Назад",
      next: "Далее",
      finish: "Перейти в обзор",
      open: "Открыть",
      addExpense: "Добавить расход",
      addIncome: "Добавить доход",
      addBill: "Добавить платеж",
      addReminder: "Создать напоминание",
      theme: "Тема",
    },
    common: {
      yes: "Да",
      no: "Нет",
      loading: "Загрузка...",
      error: "Произошла ошибка",
      confirm: "Подтвердить",
      delete: "Удалить",
      deleteConfirm: "Удалить запись?",
      deleteFailed: "Не удалось удалить запись",
      markPaid: "Оплатить",
      markPaidFailed: "Не удалось отметить как оплаченный",
      markDone: "Выполнено",
      markDoneFailed: "Не удалось отметить как выполненное",
      noData: "Нет данных",
      languageUpdated: "Язык обновлён",
    },
    errors: {
      missingEnv: "Нужно заполнить NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local",
      network: "Ошибка сети. Проверь подключение к интернету.",
      saveTransaction: "Не удалось сохранить транзакцию",
      saveBill: "Не удалось сохранить платеж",
      saveReminder: "Не удалось сохранить напоминание",
      saveSettings: "Не удалось сохранить настройки",
      updateProfile: "Не удалось обновить профиль",
      updateRates: "Не удалось обновить курсы",
      onboarding: "Не удалось завершить onboarding",
      assistantResponse: "Не удалось получить ответ.",
      assistantNetwork: "Ошибка сети. Попробуй ещё раз.",
      emptyMessage: "Пустое сообщение",
      validation: {
        email: "Укажи корректный email",
        passwordMin: "Минимум 6 символов",
        nameMin: "Минимум 2 символа",
        amountPositive: "Сумма должна быть больше 0",
        titleRequired: "Название обязательно",
        dateRequired: "Дата обязательна",
        dateTimeRequired: "Дата и время обязательны",
        generic: "Проверь поля формы",
      },
    },
    auth: {
      signInTitle: "Вход",
      signUpTitle: "Регистрация",
      signInCta: "Войти",
      signUpCta: "Создать аккаунт",
      name: "Имя",
      email: "Email",
      password: "Пароль",
      envMissing: "Нужно заполнить NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local",
      networkError: "Ошибка сети к Supabase. Проверь NEXT_PUBLIC_SUPABASE_URL и интернет.",
    },
    landing: {
      title: "Спокойный контроль финансов, платежей и важных дел в одном месте.",
      subtitle:
        "Norevi снижает ментальную нагрузку: показывает безопасный лимит трат, напоминает о платежах и помогает планировать день без хаоса.",
      ctaPrimary: "Начать бесплатно",
      ctaSecondary: "Войти",
    },
    dashboard: {
      title: "Обзор",
      greetingMorning: "Доброе утро",
      greetingBack: "С возвращением",
      balance: "Баланс",
      incomeMonth: "Доходы за месяц",
      expenseMonth: "Расходы за месяц",
      billsWeek: "Платежи на 7 дней",
      activeReminders: "Активные напоминания",
      dailyLimit: "Сегодня можно потратить",
      dailyHintPositive: "Лимит выглядит комфортно.",
      dailyHintCaution: "Лимит близок к нулю, лучше аккуратнее.",
      dailyHintWarning: "Ты уже выше комфортного лимита.",
      dailyHintNeutral: "Пока недостаточно данных для точного прогноза.",
      mustPayTitle: "Что нужно оплатить",
      mustPayHint: "Ближайшие обязательные платежи",
      mustPayEmpty: "Добавь первый платеж, чтобы видеть план оплат.",
      mustPayTotal: "Всего к оплате",
      mustPayCriticalTitle: "Критичные платежи",
      mustPayCategoriesTitle: "По категориям",
      mustPayCategoryFallback: "Без категории",
      mustPayOverdue: "Просрочен",
      mustPayDueSoon: "Срок близко",
      foodPlanTitle: "Питание",
      foodPlanSubtitle: "Оценка на основе твоих данных",
      foodBudgetToday: "Можно на еду сегодня",
      foodAvgDaily: "Средний расход в день",
      foodBudgetMonth: "Бюджет на еду в месяц",
      foodRemainingMonth: "Остаток на еду в месяц",
      foodPlanAutoTitle: "План по бюджету",
      foodPlanAutoBudget: "Бюджет на сегодня:",
      foodPlanAutoLow: "Экономно: базовые продукты и лёгкие покупки.",
      foodPlanAutoMid: "Сбалансировано: крупы, овощи, белок и фрукты.",
      foodPlanAutoHigh: "Полный набор: можно взять на 2–3 дня.",
      foodCategoriesTitle: "По форматам",
      foodCategoriesHome: "Дом",
      foodCategoriesCafe: "Кафе",
      foodCategoriesDelivery: "Доставка",
      foodStableTitle: "Стабильные продукты недели",
      foodStableHint: "Часто повторяются в твоих покупках.",
      foodStableEmpty: "Пока нет стабильных продуктов.",
      favoriteTitle: "Постоянный список",
      favoriteHint: "Храни любимые продукты и управляемый список.",
      favoritePlaceholder: "Добавить продукт",
      favoriteAdd: "Добавить",
      favoriteRemove: "Удалить",
      weeklyReminderTitle: "Стабильные продукты недели",
      weeklyReminderDescription: "Не забудь купить на неделю:",
      weeklyReminderToast: "Напоминание о стабильных продуктах создано.",
      foodManualTitle: "Мой список покупок",
      foodManualHint: "Добавь, что хочешь купить и сколько это стоит.",
      foodManualAdd: "Добавить",
      foodManualItem: "Название",
      foodManualPrice: "Цена",
      foodManualTotal: "Итого",
      foodSpendPlanTitle: "План расходов",
      foodSpendPlanHint: "Введи, сколько хочешь тратить — мы покажем остаток.",
      foodSpendPlanDaily: "В день",
      foodSpendPlanMonthly: "В месяц",
      foodSpendPlanList: "Мой список",
      foodSpendPlanRemaining: "Останется на еду",
      foodSpendPlanDays: "Хватит на дней",
      foodSpendPlanReset: "Сбросить",
      foodGoalTitle: "Цель по еде",
      foodGoalHint: "Укажи лимит на месяц и следи за прогрессом.",
      foodGoalInput: "Цель на месяц",
      foodGoalSpent: "Потрачено",
      foodGoalRemaining: "Осталось до цели",
      foodGoalProgress: "Прогресс: {percent}%",
      quickPayTitle: "Зарплата пришла",
      quickPayHint: "Добавь доход и сразу обнови баланс.",
      quickPaySalaryPlaceholder: "Сумма",
      quickPaySalaryCta: "Зарплата пришла",
      quickPaySalarySuccess: "Доход добавлен.",
      quickPaySalaryError: "Не удалось сохранить доход.",
      quickPayBillsTitle: "Обязательные платежи",
      quickPayBillsHint: "Интернет, жильё, кредит.",
      quickPayBillsEmpty: "Платежей пока нет.",
      quickPayCriticalLabel: "Критично",
      quickPayOverdueLabel: "Просрочен",
      quickPayDueTodayLabel: "Сегодня",
      quickPayOverdueOnly: "Только просроченные",
      quickPayBillPay: "Оплатить",
      quickPayBillPaying: "Оплата...",
      quickPayBillPaid: "Платёж отмечен.",
      quickPayBillPaidToday: "Оплачено сегодня",
      quickPayBillPaidLabel: "Оплачено",
      quickPayPayAll: "Оплатить все",
      quickPayPayAllBusy: "Оплата...",
      quickPayMethodLabel: "Способ",
      quickPayMethodApple: "Apple Pay",
      quickPayMethodCard: "Карта",
      quickPayPaidVia: "Оплачено через {method}",
      quickPayReminderTitle: "Срочный платёж: {title}",
      quickPayReminderBody: "Нужно оплатить {title} на сумму {amount}.",
      quickPayReminderToast: "Напоминание создано: {title}",
      quickPayPayInternet: "Оплатить интернет",
      quickPayPayHousing: "Оплатить жильё",
      quickPayPayCredit: "Оплатить кредит",
      quickPayPayAllNoteTitle: "История оплат",
      quickPayPayAllNoteBody: "Оплачено платежей: {count}\n{items}",
      quickPayPayAllNoteSaved: "История оплат сохранена.",
      quickPayReceiptTitle: "Apple Pay чек: {title}",
      quickPayReceiptBody: "Оплачено: {title}\nСумма: {amount}",
      quickPayReceiptSaved: "Чек Apple Pay сохранён: {title}",
      quickPayBillPaymentTitle: "Оплата: {title}",
      quickPayBillPaymentNote: "Оплачено из Norevi",
      foodIdeas: "Идеи покупок",
      foodIdeaLow: "Чай, хлеб, молоко, яйца.",
      foodIdeaMid: "Овощи, курица, крупы, фрукты.",
      foodIdeaHigh: "Мясо/рыба, овощи, фрукты, продукты на 2–3 дня.",
      foodReminderTitle: "Купить чай",
      foodReminderCta: "Напомнить про чай завтра",
      foodReminderToast: "Напоминание на завтра создано.",
      foodPersonalTitle: "Персональные продукты",
      mustPayIncome: "Доход за месяц",
      mustPayExpenses: "Расходы за месяц",
      mustPayRemaining: "Останется после платежей",
      savingsTitle: "Накопления",
      savingsGoalLabel: "Хочу откладывать в месяц",
      savingsInEur: "≈ {amount}",
      savingsFeasible: "Можно откладывать до",
      savingsAfter: "Останется после накоплений",
      savingsFood: "Останется на еду",
      quickActions: "Быстрые действия",
      quickActionsHint: "Добавляй в один клик",
      flowMode: "Flow Mode",
      flowPlan: "Flow Plan",
      flowPlanDesc: "Персональный план по задачам и бюджету",
      flowDays: "Активных дней с расходами в этом месяце",
      flowRecommendation: "Рекомендация: запланируй 2 окна трат в день и добавь напоминание на ключевые платежи.",
      flowAnalytics: "Flow Analytics",
      flowAnalyticsDesc: "Аналитика расходов и привычек",
      avgPerDay: "Средний расход в день",
      trendMonth: "Тренд месяца",
      flowScore: "Flow Score",
      trendUnderControl: "Расходы под контролем",
      trendGrowing: "Рост расходов",
      topCategoryMonth: "Главная категория месяца",
      upcomingBills: "Ближайшие платежи",
      reminders: "Напоминания",
      spendingAnalytics: "Аналитика расходов",
      topCategories: "Топ категорий расходов",
    },
    financeCalc: {
      title: "Финансовый калькулятор",
      subtitle: "Планируй бюджет, дневной лимит и накопления",
      incomeMonth: "Доход за месяц",
      fixedExpenses: "Постоянные расходы",
      variableExpenses: "Переменные расходы",
      reserve: "Резерв/накопление",
      freeAfter: "Свободно после расходов",
      safePerDay: "Можно тратить в день",
      savingsPotential: "Потенциал накоплений",
      statusSurplus: "План устойчивый",
      statusBalanced: "В ноль",
      statusDeficit: "Дефицит бюджета",
      totalExpenses: "Расходы всего",
      currency: "Валюта",
      rates: "Курс валют",
      rateHint: "Укажи, сколько единиц валюты за 1 базовую",
      trendLabel: "Тренд",
      ratesUpdating: "Обновляем курсы...",
      resetActual: "Сбросить к данным месяца",
      clearAll: "Очистить все поля",
      planTitle: "План на месяц",
      planHint: "Собери логичный план: питание, транспорт и свободные траты.",
      foodDaily: "Еда в день",
      transportPassCost: "Проездной (стоимость)",
      transportPassMonths: "Период проездного (мес.)",
      canSpendMonth: "Можно потратить за месяц",
      foodMonthly: "Еда за месяц",
      transportMonthly: "Транспорт за месяц",
      otherMonthly: "Свободные траты",
    },
    calendarPlanner: {
      title: "Календарь напоминаний",
      hint: "Нажми на дату, чтобы запланировать напоминание.",
      selectedDate: "Выбранная дата",
      addReminder: "Создать напоминание",
      reminderTitle: "Название",
      reminderTime: "Время",
      remindersForDate: "Напоминания на дату",
      emptyForDate: "На эту дату напоминаний нет.",
      dayHasTasks: "На этот день есть задачи.",
      dayNoTasks: "На этот день задач нет.",
      addNote: "Создать заметку",
      noteTitle: "Заметка",
      noteBody: "Текст заметки",
      notesForDate: "Заметки на дату",
      emptyNotes: "На эту дату заметок нет.",
    },
    paymentsHistory: {
      title: "История оплат",
      subtitle: "Оплаты, сделанные через Norevi",
      empty: "Пока нет оплат.",
      total: "Всего оплачено",
      manageRules: "Управление шаблонами",
      rulesTitle: "Шаблоны категорий",
      rulesHint: "Norevi запоминает платёж и сам ставит категорию.",
      rulePattern: "Шаблон",
      ruleCategory: "Категория",
      ruleSave: "Сохранить",
      ruleDelete: "Удалить",
      rulesEmpty: "Шаблонов пока нет.",
      ruleAddTitle: "Добавить шаблон",
      ruleAddCta: "Добавить",
      search: "Поиск по платежам",
      filterAll: "Все категории",
      exportCsv: "Экспорт CSV",
      importCsv: "Импорт CSV",
      importHint: "Формат: date,title,amount,note,category",
    },
    finance: {
      title: "Финансы",
      subtitle: "Контроль доходов и расходов без перегруза",
      addExpense: "Добавить расход",
      addIncome: "Добавить доход",
      openCalculator: "Финкалькулятор",
      editTitle: "Редактировать операцию",
      monthBalance: "Баланс месяца",
      avgPerDay: "Средний расход в день",
      filteredOps: "Операции по фильтру",
      incomeLabel: "Доходы",
      expenseLabel: "Расходы",
      topCategory: "Топ категория",
      changeLabel: "Изменение",
      transactionType: "Тип операции",
      categories: "Категории",
      all: "Все",
      expenses: "Расходы",
      incomes: "Доходы",
      allCategories: "Все категории",
    },
    bills: {
      title: "Платежи",
      subtitle: "Следи за сроками и не пропускай обязательные списания",
      addBill: "Добавить платеж",
      openCalendar: "Финкалендарь",
      calendarTitle: "Финансовый календарь",
      calendarSubtitle: "Ближайшие платежи и напоминания в одном списке",
      editTitle: "Редактировать платеж",
      itemLabel: "Платеж",
      totalBills: "Всего платежей",
      needAttention: "Требуют внимания",
      overdueLabel: "Просрочены",
      sumByFilter: "Сумма по фильтру",
      statusFilter: "Статус",
      all: "Все",
      upcoming: "Скоро",
      overdue: "Просрочены",
      paid: "Оплачены",
      dueLabel: "до",
      emptyTitle: "Платежей пока нет",
      emptyDescription: "Создай первый платеж, чтобы видеть сроки.",
    },
    reminders: {
      title: "Напоминания",
      subtitle: "Личные задачи и важные дела в одном месте",
      addReminder: "Создать напоминание",
      editTitle: "Редактировать напоминание",
      itemLabel: "Напоминание",
      totalReminders: "Всего напоминаний",
      activeNow: "Активные сейчас",
      highPriority: "Высокий приоритет",
      statusFilter: "Статус",
      priorityFilter: "Приоритет",
      all: "Все",
      active: "Активные",
      done: "Выполненные",
      cancelled: "Отменённые",
      priorityAny: "Любой приоритет",
      priorityHigh: "Высокий",
      priorityMedium: "Средний",
      priorityLow: "Низкий",
      emptyTitle: "Пока нет напоминаний",
      emptyDescription: "Создай первое напоминание, чтобы держать день под контролем.",
    },
    assistant: {
      title: "Помощник",
      subtitle: "Короткие ответы по финансам, платежам и напоминаниям",
      activeDialog: "Активный диалог",
      newDialog: "Новый",
      yourMessages: "Твоих сообщений",
      assistantReplies: "Ответов помощника",
      helperHint: "Спроси про лимит, расходы, платежи или попроси создать напоминание.",
      placeholder: "Например: Сколько я могу потратить сегодня?",
      send: "Отправить",
      emptyHistory: "История пока пустая. Выбери подсказку выше или задай свой вопрос.",
      suggested: [
        "Сколько я могу потратить сегодня?",
        "Какие платежи у меня на этой неделе?",
        "Сколько я потратил на еду в этом месяце?",
        "Напомни завтра в 9:00 взять документы",
        "Покажи мои подписки",
        "Какие у меня самые большие расходы в этом месяце?",
      ],
      responses: {
        safeSpend: "Сегодня безопасно потратить около {amount}.",
        billsWeekEmpty: "На этой неделе платежей не найдено.",
        foodMonth: "На еду в этом месяце ушло {amount}.",
        reminderCreated: "Готово. Напоминание «{title}» создано на {date}.",
        defaultReminderTitle: "Напоминание",
        defaultReminderDescription: "Создано из чата помощника",
        subscriptionsEmpty: "Подписок пока не найдено.",
        topExpensesEmpty: "В этом месяце пока нет расходов для анализа.",
        fallback: "Сейчас могу помочь по финансам, платежам и напоминаниям. Баланс: {amount}.",
        notUnderstood: "Не смог сформировать ответ. Попробуй уточнить запрос.",
        systemPrompt:
          "Ты помощник Norevi. Отвечай кратко на русском, только в рамках финансов, платежей, напоминаний и планирования. Не выдумывай данные.",
        scope: ["финансы", "платежи", "напоминания", "планирование"],
        subscriptionsLabel: "Подписки",
      },
    },
    forms: {
      amount: "Сумма",
      title: "Название",
      note: "Заметка",
      categoryLabel: "Категория/метка",
      categoryNone: "Без категории",
      date: "Дата",
      repeatNone: "Без повтора",
      repeatDaily: "Ежедневно",
      repeatWeekly: "Еженедельно",
      repeatMonthly: "Ежемесячно",
      repeatYearly: "Ежегодно",
      autoRenew: "Авто-обновление",
      save: "Сохранить",
      add: "Добавить",
      typeExpense: "Расход",
      typeIncome: "Доход",
      reminderTitle: "Название",
      reminderDesc: "Описание",
      remindAt: "Дата и время",
      priorityLow: "Низкий",
      priorityMedium: "Средний",
      priorityHigh: "Высокий",
      statusActive: "Активно",
      statusDone: "Выполнено",
      statusCancelled: "Отменено",
    },
    settings: {
      title: "Настройки",
      name: "Имя",
      currency: "Базовая валюта",
      language: "Язык",
      timezone: "Часовой пояс",
      budgetLimit: "Лимит бюджета в месяц",
      exchangeRates: "Курсы валют",
      exchangeRatesHint: "Обновляется автоматически в фоне.",
      noExpenseCategories: "Нет категорий расходов",
      noIncomeCategories: "Нет категорий доходов",
    },
    onboarding: {
      welcomeTitle: "Добро пожаловать в Norevi",
      welcomeText: "Сделаем спокойную систему контроля жизни за пару шагов.",
      chooseCurrency: "Выбери валюту",
      chooseLanguage: "Выбери язык",
      budgetLimit: "Лимит бюджета в месяц",
      doneTitle: "Готово",
      doneText: "После завершения сможешь добавить первый платеж или напоминание в один клик.",
      step: "Шаг",
      stepOf: "из",
      limitPlaceholder: "Например, 15000",
    },
    currencies: {
      MDL: "Лей (MDL)",
      EUR: "Евро (EUR)",
      USD: "Доллар (USD)",
      RUB: "Рубль (RUB)",
      RUP: "Приднестровский рубль (RUP)",
    },
    languages: {
      ru: "Русский",
      en: "English",
      ro: "Romana",
    },
  },
  en: {
    appName: "Norevi",
    tagline: "smart life rhythm",
    nav: {
      overview: "Overview",
      finance: "Finance",
      bills: "Bills",
      reminders: "Reminders",
      assistant: "Assistant",
      settings: "Settings",
      tools: "Tools",
      calculator: "Calculator",
      calendar: "Calendar",
      paymentsHistory: "Payment history",
    },
    actions: {
      quickAction: "Quick action",
      signOut: "Sign out",
      save: "Save",
      back: "Back",
      next: "Next",
      finish: "Go to dashboard",
      open: "Open",
      addExpense: "Add expense",
      addIncome: "Add income",
      addBill: "Add bill",
      addReminder: "Create reminder",
      theme: "Theme",
    },
    common: {
      yes: "Yes",
      no: "No",
      loading: "Loading...",
      error: "Something went wrong",
      confirm: "Confirm",
      delete: "Delete",
      deleteConfirm: "Delete this record?",
      deleteFailed: "Failed to delete the record",
      markPaid: "Mark paid",
      markPaidFailed: "Failed to mark as paid",
      markDone: "Done",
      markDoneFailed: "Failed to mark as done",
      noData: "No data",
      languageUpdated: "Language updated",
    },
    errors: {
      missingEnv: "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
      network: "Network error. Check your internet connection.",
      saveTransaction: "Failed to save transaction",
      saveBill: "Failed to save bill",
      saveReminder: "Failed to save reminder",
      saveSettings: "Failed to save settings",
      updateProfile: "Failed to update profile",
      updateRates: "Failed to update rates",
      onboarding: "Failed to complete onboarding",
      assistantResponse: "Failed to get a response.",
      assistantNetwork: "Network error. Please try again.",
      emptyMessage: "Empty message",
      validation: {
        email: "Enter a valid email",
        passwordMin: "At least 6 characters",
        nameMin: "At least 2 characters",
        amountPositive: "Amount must be greater than 0",
        titleRequired: "Title is required",
        dateRequired: "Date is required",
        dateTimeRequired: "Date and time are required",
        generic: "Please check the form fields",
      },
    },
    auth: {
      signInTitle: "Sign in",
      signUpTitle: "Sign up",
      signInCta: "Sign in",
      signUpCta: "Create account",
      name: "Name",
      email: "Email",
      password: "Password",
      envMissing: "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
      networkError: "Supabase network error. Check NEXT_PUBLIC_SUPABASE_URL and your connection.",
    },
    landing: {
      title: "Calm control of finances, bills, and important tasks in one place.",
      subtitle:
        "Norevi reduces mental load: it shows a safe spending limit, reminds you about bills, and helps you plan the day without chaos.",
      ctaPrimary: "Get started free",
      ctaSecondary: "Sign in",
    },
    dashboard: {
      title: "Overview",
      greetingMorning: "Good morning",
      greetingBack: "Welcome back",
      balance: "Balance",
      incomeMonth: "Monthly income",
      expenseMonth: "Monthly expenses",
      billsWeek: "Bills for 7 days",
      activeReminders: "Active reminders",
      dailyLimit: "Safe to spend today",
      dailyHintPositive: "Limit looks comfortable.",
      dailyHintCaution: "Limit is close to zero, be careful.",
      dailyHintWarning: "You are above the comfortable limit.",
      dailyHintNeutral: "Not enough data for a precise forecast yet.",
      mustPayTitle: "What needs to be paid",
      mustPayHint: "Upcoming required bills",
      mustPayEmpty: "Add your first bill to see what needs paying.",
      mustPayTotal: "Total due",
      mustPayCriticalTitle: "Critical bills",
      mustPayCategoriesTitle: "By category",
      mustPayCategoryFallback: "Uncategorized",
      mustPayOverdue: "Overdue",
      mustPayDueSoon: "Due soon",
      foodPlanTitle: "Food plan",
      foodPlanSubtitle: "Estimated from your data",
      foodBudgetToday: "Food budget today",
      foodAvgDaily: "Average per day",
      foodBudgetMonth: "Monthly food budget",
      foodRemainingMonth: "Food remaining this month",
      foodPlanAutoTitle: "Budget plan",
      foodPlanAutoBudget: "Today’s budget:",
      foodPlanAutoLow: "Light mode: basic groceries and small items.",
      foodPlanAutoMid: "Balanced: grains, vegetables, protein, fruit.",
      foodPlanAutoHigh: "Full basket: enough for 2–3 days.",
      foodCategoriesTitle: "By format",
      foodCategoriesHome: "Home",
      foodCategoriesCafe: "Cafe",
      foodCategoriesDelivery: "Delivery",
      foodStableTitle: "Weekly staples",
      foodStableHint: "Frequently repeated in your purchases.",
      foodStableEmpty: "No stable items yet.",
      favoriteTitle: "Favorite list",
      favoriteHint: "Keep a permanent list of items you buy often.",
      favoritePlaceholder: "Add an item",
      favoriteAdd: "Add",
      favoriteRemove: "Remove",
      weeklyReminderTitle: "Weekly staples",
      weeklyReminderDescription: "Don't forget to buy this week:",
      weeklyReminderToast: "Weekly staples reminder created.",
      foodManualTitle: "My shopping list",
      foodManualHint: "Add what you want to buy and the price.",
      foodManualAdd: "Add",
      foodManualItem: "Item",
      foodManualPrice: "Price",
      foodManualTotal: "Total",
      foodSpendPlanTitle: "Spend plan",
      foodSpendPlanHint: "Enter what you plan to spend and we’ll show the remaining.",
      foodSpendPlanDaily: "Per day",
      foodSpendPlanMonthly: "Per month",
      foodSpendPlanList: "My list",
      foodSpendPlanRemaining: "Remaining for food",
      foodSpendPlanDays: "Days covered",
      foodSpendPlanReset: "Reset",
      foodGoalTitle: "Food goal",
      foodGoalHint: "Set a monthly target and track progress.",
      foodGoalInput: "Monthly goal",
      foodGoalSpent: "Spent",
      foodGoalRemaining: "Remaining to goal",
      foodGoalProgress: "Progress: {percent}%",
      quickPayTitle: "Salary received",
      quickPayHint: "Add income and instantly refresh your balance.",
      quickPaySalaryPlaceholder: "Amount",
      quickPaySalaryCta: "Salary received",
      quickPaySalarySuccess: "Income added.",
      quickPaySalaryError: "Could not save income.",
      quickPayBillsTitle: "Required bills",
      quickPayBillsHint: "Internet, rent, credit.",
      quickPayBillsEmpty: "No bills yet.",
      quickPayCriticalLabel: "Critical",
      quickPayOverdueLabel: "Overdue",
      quickPayDueTodayLabel: "Due today",
      quickPayOverdueOnly: "Overdue only",
      quickPayBillPay: "Pay",
      quickPayBillPaying: "Paying...",
      quickPayBillPaid: "Bill marked paid.",
      quickPayBillPaidToday: "Paid today",
      quickPayBillPaidLabel: "Paid",
      quickPayPayAll: "Pay all",
      quickPayPayAllBusy: "Paying...",
      quickPayMethodLabel: "Method",
      quickPayMethodApple: "Apple Pay",
      quickPayMethodCard: "Card",
      quickPayPaidVia: "Paid via {method}",
      quickPayReminderTitle: "Urgent bill: {title}",
      quickPayReminderBody: "Please pay {title} for {amount}.",
      quickPayReminderToast: "Reminder created: {title}",
      quickPayPayInternet: "Pay internet",
      quickPayPayHousing: "Pay rent",
      quickPayPayCredit: "Pay credit",
      quickPayPayAllNoteTitle: "Payment history",
      quickPayPayAllNoteBody: "Paid bills: {count}\n{items}",
      quickPayPayAllNoteSaved: "Payment history saved.",
      quickPayReceiptTitle: "Apple Pay receipt: {title}",
      quickPayReceiptBody: "Paid: {title}\nAmount: {amount}",
      quickPayReceiptSaved: "Apple Pay receipt saved: {title}",
      quickPayBillPaymentTitle: "Payment: {title}",
      quickPayBillPaymentNote: "Paid via Norevi",
      foodIdeas: "Shopping ideas",
      foodIdeaLow: "Tea, bread, milk, eggs.",
      foodIdeaMid: "Vegetables, chicken, grains, fruit.",
      foodIdeaHigh: "Meat/fish, vegetables, fruit, 2–3 days of groceries.",
      foodReminderTitle: "Buy tea",
      foodReminderCta: "Remind me to buy tea tomorrow",
      foodReminderToast: "Tomorrow reminder created.",
      foodPersonalTitle: "Personal products",
      mustPayIncome: "Monthly income",
      mustPayExpenses: "Monthly expenses",
      mustPayRemaining: "Remaining after bills",
      savingsTitle: "Savings",
      savingsGoalLabel: "I want to save per month",
      savingsInEur: "≈ {amount}",
      savingsFeasible: "You can save up to",
      savingsAfter: "Remaining after savings",
      savingsFood: "Left for food",
      quickActions: "Quick actions",
      quickActionsHint: "Add in one click",
      flowMode: "Flow Mode",
      flowPlan: "Flow Plan",
      flowPlanDesc: "Personal plan for tasks and budget",
      flowDays: "Active spending days this month",
      flowRecommendation: "Recommendation: plan 2 spending windows per day and add reminders for key bills.",
      flowAnalytics: "Flow Analytics",
      flowAnalyticsDesc: "Spending and habit insights",
      avgPerDay: "Average per day",
      trendMonth: "Monthly trend",
      flowScore: "Flow Score",
      trendUnderControl: "Spending under control",
      trendGrowing: "Spending increasing",
      topCategoryMonth: "Top category this month",
      upcomingBills: "Upcoming bills",
      reminders: "Reminders",
      spendingAnalytics: "Spending analytics",
      topCategories: "Top expense categories",
    },
    financeCalc: {
      title: "Finance calculator",
      subtitle: "Plan your budget, daily limit, and savings",
      incomeMonth: "Monthly income",
      fixedExpenses: "Fixed expenses",
      variableExpenses: "Variable expenses",
      reserve: "Reserve/savings",
      freeAfter: "Free after expenses",
      safePerDay: "Safe per day",
      savingsPotential: "Savings potential",
      statusSurplus: "Healthy plan",
      statusBalanced: "Break-even",
      statusDeficit: "Budget deficit",
      totalExpenses: "Total expenses",
      currency: "Currency",
      rates: "Exchange rates",
      rateHint: "Enter units per 1 base currency",
      trendLabel: "Trend",
      ratesUpdating: "Updating rates...",
      resetActual: "Reset to current data",
      clearAll: "Clear all fields",
      planTitle: "Monthly plan",
      planHint: "Build a logical plan: food, transport, and flexible spending.",
      foodDaily: "Food per day",
      transportPassCost: "Transit pass cost",
      transportPassMonths: "Pass period (months)",
      canSpendMonth: "Can spend this month",
      foodMonthly: "Food this month",
      transportMonthly: "Transport this month",
      otherMonthly: "Flexible spending",
    },
    calendarPlanner: {
      title: "Reminder calendar",
      hint: "Click a date to plan a reminder.",
      selectedDate: "Selected date",
      addReminder: "Create reminder",
      reminderTitle: "Title",
      reminderTime: "Time",
      remindersForDate: "Reminders for",
      emptyForDate: "No reminders for this date.",
      dayHasTasks: "You have tasks on this day.",
      dayNoTasks: "No tasks for this day.",
      addNote: "Create note",
      noteTitle: "Note title",
      noteBody: "Note text",
      notesForDate: "Notes for",
      emptyNotes: "No notes for this date.",
    },
    paymentsHistory: {
      title: "Payment history",
      subtitle: "Payments made through Norevi",
      empty: "No payments yet.",
      total: "Total paid",
      manageRules: "Manage rules",
      rulesTitle: "Category rules",
      rulesHint: "Norevi learns from payments and auto-assigns categories.",
      rulePattern: "Pattern",
      ruleCategory: "Category",
      ruleSave: "Save",
      ruleDelete: "Delete",
      rulesEmpty: "No rules yet.",
      ruleAddTitle: "Add rule",
      ruleAddCta: "Add",
      search: "Search payments",
      filterAll: "All categories",
      exportCsv: "Export CSV",
      importCsv: "Import CSV",
      importHint: "Format: date,title,amount,note,category",
    },
    finance: {
      title: "Finance",
      subtitle: "Control income and expenses without overload",
      addExpense: "Add expense",
      addIncome: "Add income",
      openCalculator: "Calculator",
      editTitle: "Edit transaction",
      monthBalance: "Monthly balance",
      avgPerDay: "Average per day",
      filteredOps: "Filtered operations",
      incomeLabel: "Income",
      expenseLabel: "Expenses",
      topCategory: "Top category",
      changeLabel: "Change",
      transactionType: "Transaction type",
      categories: "Categories",
      all: "All",
      expenses: "Expenses",
      incomes: "Income",
      allCategories: "All categories",
    },
    bills: {
      title: "Bills",
      subtitle: "Track due dates and avoid missing payments",
      addBill: "Add bill",
      openCalendar: "Finance calendar",
      calendarTitle: "Finance calendar",
      calendarSubtitle: "Upcoming bills and reminders in one list",
      editTitle: "Edit bill",
      itemLabel: "Bill",
      totalBills: "Total bills",
      needAttention: "Needs attention",
      overdueLabel: "Overdue",
      sumByFilter: "Sum by filter",
      statusFilter: "Status",
      all: "All",
      upcoming: "Upcoming",
      overdue: "Overdue",
      paid: "Paid",
      dueLabel: "due",
      emptyTitle: "No bills yet",
      emptyDescription: "Create your first bill to see due dates.",
    },
    reminders: {
      title: "Reminders",
      subtitle: "Personal tasks and important to-dos in one place",
      addReminder: "Create reminder",
      editTitle: "Edit reminder",
      itemLabel: "Reminder",
      totalReminders: "Total reminders",
      activeNow: "Active now",
      highPriority: "High priority",
      statusFilter: "Status",
      priorityFilter: "Priority",
      all: "All",
      active: "Active",
      done: "Done",
      cancelled: "Cancelled",
      priorityAny: "Any priority",
      priorityHigh: "High",
      priorityMedium: "Medium",
      priorityLow: "Low",
      emptyTitle: "No reminders yet",
      emptyDescription: "Create your first reminder to stay on track.",
    },
    assistant: {
      title: "Assistant",
      subtitle: "Short answers about finances, bills, and reminders",
      activeDialog: "Active dialog",
      newDialog: "New",
      yourMessages: "Your messages",
      assistantReplies: "Assistant replies",
      helperHint: "Ask about limits, spending, bills, or create a reminder.",
      placeholder: "Example: How much can I spend today?",
      send: "Send",
      emptyHistory: "History is empty. Pick a suggestion above or ask your own.",
      suggested: [
        "How much can I spend today?",
        "Which bills do I have this week?",
        "How much did I spend on food this month?",
        "Remind me tomorrow at 9:00 to take documents",
        "Show my subscriptions",
        "What are my biggest expenses this month?",
      ],
      responses: {
        safeSpend: "You can safely spend about {amount} today.",
        billsWeekEmpty: "No bills found for this week.",
        foodMonth: "You spent {amount} on food this month.",
        reminderCreated: "Done. Reminder “{title}” set for {date}.",
        defaultReminderTitle: "Reminder",
        defaultReminderDescription: "Created from assistant chat",
        subscriptionsEmpty: "No subscriptions found yet.",
        topExpensesEmpty: "No expenses to analyze this month yet.",
        fallback: "I can help with finances, bills, and reminders. Balance: {amount}.",
        notUnderstood: "I couldn't generate a response. Please clarify your request.",
        systemPrompt:
          "You are the Norevi assistant. Reply briefly in English, only within finances, bills, reminders, and planning. Do not invent data.",
        scope: ["finance", "bills", "reminders", "planning"],
        subscriptionsLabel: "Subscriptions",
      },
    },
    forms: {
      amount: "Amount",
      title: "Title",
      note: "Note",
      categoryLabel: "Category/label",
      categoryNone: "No category",
      date: "Date",
      repeatNone: "No repeat",
      repeatDaily: "Daily",
      repeatWeekly: "Weekly",
      repeatMonthly: "Monthly",
      repeatYearly: "Yearly",
      autoRenew: "Auto renew",
      save: "Save",
      add: "Add",
      typeExpense: "Expense",
      typeIncome: "Income",
      reminderTitle: "Title",
      reminderDesc: "Description",
      remindAt: "Date & time",
      priorityLow: "Low",
      priorityMedium: "Medium",
      priorityHigh: "High",
      statusActive: "Active",
      statusDone: "Done",
      statusCancelled: "Cancelled",
    },
    settings: {
      title: "Settings",
      name: "Name",
      currency: "Base currency",
      language: "Language",
      timezone: "Timezone",
      budgetLimit: "Monthly budget limit",
      exchangeRates: "Exchange rates",
      exchangeRatesHint: "Updates automatically in the background.",
      noExpenseCategories: "No expense categories",
      noIncomeCategories: "No income categories",
    },
    onboarding: {
      welcomeTitle: "Welcome to Norevi",
      welcomeText: "Let’s set a calm control system in a few steps.",
      chooseCurrency: "Choose currency",
      chooseLanguage: "Choose language",
      budgetLimit: "Monthly budget limit",
      doneTitle: "All set",
      doneText: "After finishing you can add your first bill or reminder in one click.",
      step: "Step",
      stepOf: "of",
      limitPlaceholder: "For example, 15000",
    },
    currencies: {
      MDL: "Leu (MDL)",
      EUR: "Euro (EUR)",
      USD: "Dollar (USD)",
      RUB: "Ruble (RUB)",
      RUP: "Transnistrian ruble (RUP)",
    },
    languages: {
      ru: "Russian",
      en: "English",
      ro: "Romanian",
    },
  },
  ro: {
    appName: "Norevi",
    tagline: "ritm inteligent al vietii",
    nav: {
      overview: "Prezentare",
      finance: "Finante",
      bills: "Plati",
      reminders: "Memento",
      assistant: "Asistent",
      settings: "Setari",
      tools: "Instrumente",
      calculator: "Calculator",
      calendar: "Calendar",
      paymentsHistory: "Istoric plati",
    },
    actions: {
      quickAction: "Actiune rapida",
      signOut: "Iesire",
      save: "Salveaza",
      back: "Inapoi",
      next: "Inainte",
      finish: "Mergi la dashboard",
      open: "Deschide",
      addExpense: "Adauga cheltuiala",
      addIncome: "Adauga venit",
      addBill: "Adauga plata",
      addReminder: "Creeaza memento",
      theme: "Tema",
    },
    common: {
      yes: "Da",
      no: "Nu",
      loading: "Se incarca...",
      error: "A aparut o eroare",
      confirm: "Confirma",
      delete: "Sterge",
      deleteConfirm: "Stergi aceasta inregistrare?",
      deleteFailed: "Nu s-a putut sterge inregistrarea",
      markPaid: "Marcheaza ca platit",
      markPaidFailed: "Nu s-a putut marca ca platit",
      markDone: "Finalizat",
      markDoneFailed: "Nu s-a putut marca ca finalizat",
      noData: "Fara date",
      languageUpdated: "Limba a fost actualizata",
    },
    errors: {
      missingEnv: "Seteaza NEXT_PUBLIC_SUPABASE_URL si NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
      network: "Eroare de retea. Verifica conexiunea.",
      saveTransaction: "Nu s-a putut salva operatiunea",
      saveBill: "Nu s-a putut salva plata",
      saveReminder: "Nu s-a putut salva memento-ul",
      saveSettings: "Nu s-au putut salva setarile",
      updateProfile: "Nu s-a putut actualiza profilul",
      updateRates: "Nu s-au putut actualiza cursurile",
      onboarding: "Nu s-a putut finaliza onboarding-ul",
      assistantResponse: "Nu s-a putut obtine raspunsul.",
      assistantNetwork: "Eroare de retea. Incearca din nou.",
      emptyMessage: "Mesaj gol",
      validation: {
        email: "Introdu un email valid",
        passwordMin: "Minim 6 caractere",
        nameMin: "Minim 2 caractere",
        amountPositive: "Suma trebuie sa fie mai mare ca 0",
        titleRequired: "Titlul este obligatoriu",
        dateRequired: "Data este obligatorie",
        dateTimeRequired: "Data si ora sunt obligatorii",
        generic: "Verifica campurile formularului",
      },
    },
    auth: {
      signInTitle: "Autentificare",
      signUpTitle: "Inregistrare",
      signInCta: "Autentificare",
      signUpCta: "Creeaza cont",
      name: "Nume",
      email: "Email",
      password: "Parola",
      envMissing: "Seteaza NEXT_PUBLIC_SUPABASE_URL si NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
      networkError: "Eroare de retea Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL si conexiunea.",
    },
    landing: {
      title: "Control calm al finantelor, platilor si lucrurilor importante intr-un singur loc.",
      subtitle:
        "Norevi reduce sarcina mentala: arata limita sigura de cheltuieli, iti aminteste de plati si te ajuta sa planifici ziua fara haos.",
      ctaPrimary: "Incepe gratuit",
      ctaSecondary: "Autentificare",
    },
    dashboard: {
      title: "Prezentare",
      greetingMorning: "Buna dimineata",
      greetingBack: "Bine ai revenit",
      balance: "Sold",
      incomeMonth: "Venituri lunare",
      expenseMonth: "Cheltuieli lunare",
      billsWeek: "Plati pentru 7 zile",
      activeReminders: "Memento active",
      dailyLimit: "Poti cheltui azi",
      dailyHintPositive: "Limita arata confortabil.",
      dailyHintCaution: "Limita este aproape de zero, fii atent.",
      dailyHintWarning: "Esti peste limita confortabila.",
      dailyHintNeutral: "Nu sunt suficiente date pentru un prognostic precis.",
      mustPayTitle: "Ce trebuie achitat",
      mustPayHint: "Plati obligatorii apropiate",
      mustPayEmpty: "Adauga prima plata ca sa vezi planul.",
      mustPayTotal: "Total de achitat",
      mustPayCriticalTitle: "Plati critice",
      mustPayCategoriesTitle: "Pe categorii",
      mustPayCategoryFallback: "Fara categorie",
      mustPayOverdue: "Restant",
      mustPayDueSoon: "Termen apropiat",
      foodPlanTitle: "Alimentatie",
      foodPlanSubtitle: "Estimare dupa datele tale",
      foodBudgetToday: "Buget pentru azi",
      foodAvgDaily: "Media pe zi",
      foodBudgetMonth: "Buget lunar pentru mancare",
      foodRemainingMonth: "Ramas pentru mancare luna aceasta",
      foodPlanAutoTitle: "Plan de buget",
      foodPlanAutoBudget: "Bugetul de azi:",
      foodPlanAutoLow: "Econom: produse de baza si cumparaturi mici.",
      foodPlanAutoMid: "Echilibrat: cereale, legume, proteine, fructe.",
      foodPlanAutoHigh: "Cos complet: suficient pentru 2–3 zile.",
      foodCategoriesTitle: "Pe format",
      foodCategoriesHome: "Acasa",
      foodCategoriesCafe: "Cafenea",
      foodCategoriesDelivery: "Livrare",
      foodStableTitle: "Produse stabile ale saptamanii",
      foodStableHint: "Apar frecvent in cumparaturile tale.",
      foodStableEmpty: "Nu exista produse stabile inca.",
      favoriteTitle: "Lista permanenta",
      favoriteHint: "Pastreaza produse preferate intr-un singur loc.",
      favoritePlaceholder: "Adauga produs",
      favoriteAdd: "Adauga",
      favoriteRemove: "Sterge",
      weeklyReminderTitle: "Produse stabile saptamanale",
      weeklyReminderDescription: "Nu uita sa cumperi in aceasta saptamana:",
      weeklyReminderToast: "Memento pentru produse stabile creat.",
      foodManualTitle: "Lista mea de cumparaturi",
      foodManualHint: "Adauga ce vrei sa cumperi si pretul.",
      foodManualAdd: "Adauga",
      foodManualItem: "Produs",
      foodManualPrice: "Pret",
      foodManualTotal: "Total",
      foodSpendPlanTitle: "Plan de cheltuieli",
      foodSpendPlanHint: "Introdu cat vrei sa cheltuiesti si vezi cat ramane.",
      foodSpendPlanDaily: "Pe zi",
      foodSpendPlanMonthly: "Pe luna",
      foodSpendPlanList: "Lista mea",
      foodSpendPlanRemaining: "Ramas pentru mancare",
      foodSpendPlanDays: "Zile acoperite",
      foodSpendPlanReset: "Reseteaza",
      foodGoalTitle: "Obiectiv pentru mancare",
      foodGoalHint: "Seteaza un prag lunar si urmareste progresul.",
      foodGoalInput: "Obiectiv lunar",
      foodGoalSpent: "Cheltuit",
      foodGoalRemaining: "Ramas pana la obiectiv",
      foodGoalProgress: "Progres: {percent}%",
      quickPayTitle: "Salariul a intrat",
      quickPayHint: "Adauga venitul si actualizeaza soldul imediat.",
      quickPaySalaryPlaceholder: "Suma",
      quickPaySalaryCta: "Salariul a intrat",
      quickPaySalarySuccess: "Venitul a fost adaugat.",
      quickPaySalaryError: "Nu s-a putut salva venitul.",
      quickPayBillsTitle: "Plati obligatorii",
      quickPayBillsHint: "Internet, chirie, credit.",
      quickPayBillsEmpty: "Nu exista plati.",
      quickPayCriticalLabel: "Critic",
      quickPayOverdueLabel: "Restant",
      quickPayDueTodayLabel: "Azi",
      quickPayOverdueOnly: "Doar restante",
      quickPayBillPay: "Plateste",
      quickPayBillPaying: "Se plateste...",
      quickPayBillPaid: "Plata a fost marcata.",
      quickPayBillPaidToday: "Platita azi",
      quickPayBillPaidLabel: "Platita",
      quickPayPayAll: "Plateste tot",
      quickPayPayAllBusy: "Se plateste...",
      quickPayMethodLabel: "Metoda",
      quickPayMethodApple: "Apple Pay",
      quickPayMethodCard: "Card",
      quickPayPaidVia: "Platita prin {method}",
      quickPayReminderTitle: "Plata urgenta: {title}",
      quickPayReminderBody: "Trebuie sa platesti {title} in suma {amount}.",
      quickPayReminderToast: "Memento creat: {title}",
      quickPayPayInternet: "Plateste internet",
      quickPayPayHousing: "Plateste chiria",
      quickPayPayCredit: "Plateste creditul",
      quickPayPayAllNoteTitle: "Istoric plati",
      quickPayPayAllNoteBody: "Plati achitate: {count}\n{items}",
      quickPayPayAllNoteSaved: "Istoricul platilor a fost salvat.",
      quickPayReceiptTitle: "Chitanta Apple Pay: {title}",
      quickPayReceiptBody: "Platit: {title}\nSuma: {amount}",
      quickPayReceiptSaved: "Chitanta Apple Pay salvata: {title}",
      quickPayBillPaymentTitle: "Plata: {title}",
      quickPayBillPaymentNote: "Platita prin Norevi",
      foodIdeas: "Idei de cumparaturi",
      foodIdeaLow: "Ceai, paine, lapte, oua.",
      foodIdeaMid: "Legume, pui, cereale, fructe.",
      foodIdeaHigh: "Carne/peste, legume, fructe, cumparaturi pentru 2–3 zile.",
      foodReminderTitle: "Cumpara ceai",
      foodReminderCta: "Amintește-mi de ceai mâine",
      foodReminderToast: "Memento pentru mâine creat.",
      foodPersonalTitle: "Produse personale",
      mustPayIncome: "Venit lunar",
      mustPayExpenses: "Cheltuieli lunare",
      mustPayRemaining: "Ramas dupa plati",
      savingsTitle: "Economii",
      savingsGoalLabel: "Vreau sa economisesc pe luna",
      savingsInEur: "≈ {amount}",
      savingsFeasible: "Poti economisi pana la",
      savingsAfter: "Ramas dupa economii",
      savingsFood: "Ramas pentru mancare",
      quickActions: "Actiuni rapide",
      quickActionsHint: "Adauga dintr-un click",
      flowMode: "Flow Mode",
      flowPlan: "Flow Plan",
      flowPlanDesc: "Plan personal pentru sarcini si buget",
      flowDays: "Zile active cu cheltuieli in aceasta luna",
      flowRecommendation: "Recomandare: planifica 2 ferestre de cheltuieli pe zi si adauga memento pentru plati cheie.",
      flowAnalytics: "Flow Analytics",
      flowAnalyticsDesc: "Analiza cheltuielilor si obiceiurilor",
      avgPerDay: "Media pe zi",
      trendMonth: "Trend lunar",
      flowScore: "Flow Score",
      trendUnderControl: "Cheltuieli sub control",
      trendGrowing: "Cheltuieli in crestere",
      topCategoryMonth: "Categoria principala a lunii",
      upcomingBills: "Plati apropiate",
      reminders: "Memento",
      spendingAnalytics: "Analiza cheltuielilor",
      topCategories: "Top categorii de cheltuieli",
    },
    financeCalc: {
      title: "Calculator financiar",
      subtitle: "Planifica bugetul, limita zilnica si economiile",
      incomeMonth: "Venit lunar",
      fixedExpenses: "Cheltuieli fixe",
      variableExpenses: "Cheltuieli variabile",
      reserve: "Rezerva/economii",
      freeAfter: "Ramas dupa cheltuieli",
      safePerDay: "Poti cheltui pe zi",
      savingsPotential: "Potential economisire",
      statusSurplus: "Plan stabil",
      statusBalanced: "Echilibrat",
      statusDeficit: "Deficit bugetar",
      totalExpenses: "Total cheltuieli",
      currency: "Valuta",
      rates: "Curs valutar",
      rateHint: "Introdu unitati pentru 1 baza",
      trendLabel: "Trend",
      ratesUpdating: "Se actualizeaza cursurile...",
      resetActual: "Reseteaza la datele lunii",
      clearAll: "Goleste toate campurile",
      planTitle: "Plan lunar",
      planHint: "Construieste un plan logic: mancare, transport, cheltuieli flexibile.",
      foodDaily: "Mancare pe zi",
      transportPassCost: "Abonament transport (cost)",
      transportPassMonths: "Perioada abonament (luni)",
      canSpendMonth: "Poti cheltui pe luna",
      foodMonthly: "Mancare pe luna",
      transportMonthly: "Transport pe luna",
      otherMonthly: "Cheltuieli flexibile",
    },
    calendarPlanner: {
      title: "Calendar memento",
      hint: "Apasa pe o data ca sa planifici un memento.",
      selectedDate: "Data selectata",
      addReminder: "Creeaza memento",
      reminderTitle: "Titlu",
      reminderTime: "Ora",
      remindersForDate: "Memento pentru",
      emptyForDate: "Nu exista memento pentru aceasta data.",
      dayHasTasks: "Ai sarcini in aceasta zi.",
      dayNoTasks: "Nu ai sarcini pentru aceasta zi.",
      addNote: "Creeaza nota",
      noteTitle: "Titlu nota",
      noteBody: "Text nota",
      notesForDate: "Note pentru",
      emptyNotes: "Nu exista note pentru aceasta data.",
    },
    paymentsHistory: {
      title: "Istoric plati",
      subtitle: "Plati efectuate prin Norevi",
      empty: "Nu exista plati.",
      total: "Total achitat",
      manageRules: "Gestionare sabloane",
      rulesTitle: "Sabloane de categorii",
      rulesHint: "Norevi invata si aplica automat categoria.",
      rulePattern: "Sablon",
      ruleCategory: "Categorie",
      ruleSave: "Salveaza",
      ruleDelete: "Sterge",
      rulesEmpty: "Nu exista sabloane.",
      ruleAddTitle: "Adauga sablon",
      ruleAddCta: "Adauga",
    },
    finance: {
      title: "Finante",
      subtitle: "Controlul veniturilor si cheltuielilor fara supraincarcare",
      addExpense: "Adauga cheltuiala",
      addIncome: "Adauga venit",
      openCalculator: "Calculator",
      editTitle: "Editeaza operatiunea",
      monthBalance: "Sold lunar",
      avgPerDay: "Media pe zi",
      filteredOps: "Operatii filtrate",
      incomeLabel: "Venituri",
      expenseLabel: "Cheltuieli",
      topCategory: "Categoria de top",
      changeLabel: "Schimbare",
      transactionType: "Tip operatiune",
      categories: "Categorii",
      all: "Toate",
      expenses: "Cheltuieli",
      incomes: "Venituri",
      allCategories: "Toate categoriile",
    },
    bills: {
      title: "Plati",
      subtitle: "Urmareste termenele si nu rata platile",
      addBill: "Adauga plata",
      openCalendar: "Calendar financiar",
      calendarTitle: "Calendar financiar",
      calendarSubtitle: "Plati si memento apropiate intr-o singura lista",
      editTitle: "Editeaza plata",
      itemLabel: "Plata",
      totalBills: "Total plati",
      needAttention: "Necesita atentie",
      overdueLabel: "Restante",
      sumByFilter: "Suma filtrata",
      statusFilter: "Status",
      all: "Toate",
      upcoming: "In curand",
      overdue: "Restante",
      paid: "Achitate",
      dueLabel: "pana la",
      emptyTitle: "Nu exista plati",
      emptyDescription: "Adauga prima plata pentru a vedea termenele.",
    },
    reminders: {
      title: "Memento",
      subtitle: "Sarcini personale si lucruri importante intr-un singur loc",
      addReminder: "Creeaza memento",
      editTitle: "Editeaza memento",
      itemLabel: "Memento",
      totalReminders: "Total memento",
      activeNow: "Active acum",
      highPriority: "Prioritate inalta",
      statusFilter: "Status",
      priorityFilter: "Prioritate",
      all: "Toate",
      active: "Active",
      done: "Finalizate",
      cancelled: "Anulate",
      priorityAny: "Orice prioritate",
      priorityHigh: "Inalta",
      priorityMedium: "Medie",
      priorityLow: "Scazuta",
      emptyTitle: "Nu exista memento-uri",
      emptyDescription: "Creeaza primul memento pentru a ramane organizat.",
    },
    assistant: {
      title: "Asistent",
      subtitle: "Raspunsuri scurte despre finante, plati si memento",
      activeDialog: "Dialog activ",
      newDialog: "Nou",
      yourMessages: "Mesajele tale",
      assistantReplies: "Raspunsuri asistent",
      helperHint: "Intreaba despre limite, cheltuieli, plati sau creeaza un memento.",
      placeholder: "Ex: Cat pot cheltui azi?",
      send: "Trimite",
      emptyHistory: "Istoric gol. Alege o sugestie sau scrie intrebarea ta.",
      suggested: [
        "Cat pot cheltui azi?",
        "Ce plati am saptamana aceasta?",
        "Cat am cheltuit pe mancare luna aceasta?",
        "Adu-mi aminte maine la 9:00 sa iau documentele",
        "Arata-mi abonamentele",
        "Care sunt cele mai mari cheltuieli luna aceasta?",
      ],
      responses: {
        safeSpend: "Poti cheltui in siguranta aproximativ {amount} azi.",
        billsWeekEmpty: "Nu am gasit plati pentru saptamana aceasta.",
        foodMonth: "Ai cheltuit {amount} pe mancare luna aceasta.",
        reminderCreated: "Gata. Memento-ul „{title}” este setat pentru {date}.",
        defaultReminderTitle: "Memento",
        defaultReminderDescription: "Creat din chatul asistentului",
        subscriptionsEmpty: "Nu am gasit abonamente inca.",
        topExpensesEmpty: "Nu exista cheltuieli de analizat luna aceasta.",
        fallback: "Pot ajuta cu finante, plati si memento. Sold: {amount}.",
        notUnderstood: "Nu am putut genera un raspuns. Te rog clarifica cererea.",
        systemPrompt:
          "Esti asistentul Norevi. Raspunde concis in romana, doar despre finante, plati, memento si planificare. Nu inventa date.",
        scope: ["finante", "plati", "memento", "planificare"],
        subscriptionsLabel: "Abonamente",
      },
    },
    forms: {
      amount: "Suma",
      title: "Titlu",
      note: "Nota",
      categoryLabel: "Categorie/eticheta",
      categoryNone: "Fara categorie",
      date: "Data",
      repeatNone: "Fara repetare",
      repeatDaily: "Zilnic",
      repeatWeekly: "Saptamanal",
      repeatMonthly: "Lunar",
      repeatYearly: "Anual",
      autoRenew: "Auto reinnoire",
      save: "Salveaza",
      add: "Adauga",
      typeExpense: "Cheltuiala",
      typeIncome: "Venit",
      reminderTitle: "Titlu",
      reminderDesc: "Descriere",
      remindAt: "Data si ora",
      priorityLow: "Scazuta",
      priorityMedium: "Medie",
      priorityHigh: "Inalta",
      statusActive: "Activ",
      statusDone: "Finalizat",
      statusCancelled: "Anulat",
    },
    settings: {
      title: "Setari",
      name: "Nume",
      currency: "Valuta de baza",
      language: "Limba",
      timezone: "Fus orar",
      budgetLimit: "Limita bugetara lunara",
      exchangeRates: "Cursuri valutare",
      exchangeRatesHint: "Se actualizeaza automat in fundal.",
      noExpenseCategories: "Nu exista categorii de cheltuieli",
      noIncomeCategories: "Nu exista categorii de venituri",
    },
    onboarding: {
      welcomeTitle: "Bun venit la Norevi",
      welcomeText: "Setam un sistem calm de control in cativa pasi.",
      chooseCurrency: "Alege valuta",
      chooseLanguage: "Alege limba",
      budgetLimit: "Limita bugetara lunara",
      doneTitle: "Gata",
      doneText: "Dupa finalizare poti adauga prima plata sau memento dintr-un click.",
      step: "Pas",
      stepOf: "din",
      limitPlaceholder: "De exemplu, 15000",
    },
    currencies: {
      MDL: "Leu (MDL)",
      EUR: "Euro (EUR)",
      USD: "Dolar (USD)",
      RUB: "Rubla (RUB)",
      RUP: "Rubla transnistreana (RUP)",
    },
    languages: {
      ru: "Rusa",
      en: "Engleza",
      ro: "Romana",
    },
  },
};

export function getTranslations(language?: string): Translations {
  if (language === "en" || language === "ro" || language === "ru") {
    return translations[language];
  }
  return translations.en;
}
