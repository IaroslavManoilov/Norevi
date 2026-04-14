import OpenAI from "openai";
import { addDays, endOfWeek, startOfWeek } from "date-fns";
import {
  createReminderFromText,
  getBillsForDateRange,
  getCurrentBalance,
  getDailySafeLimit,
  getMonthlyFoodSpend,
  getSpendingByCategoryForCurrentMonth,
  getTopExpenses,
} from "@/lib/ai/tools";
import { formatMoney, formatDateRu } from "@/lib/formatters";
import { getTranslations } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/i18n/locale";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

type Language = "ru" | "en" | "ro";

function hasAll(input: string, patterns: readonly (string | RegExp)[]) {
  return patterns.every((pattern) => (typeof pattern === "string" ? input.includes(pattern) : pattern.test(input)));
}

export async function runScopedAssistant(userId: string, text: string, currency = "MDL", language: Language = "ru") {
  const input = text.toLowerCase();
  const t = getTranslations(language);
  const locale = resolveLocale(language);

  const intent = {
    spendToday: {
      ru: [/сколько/, /потрат/, /сегодня/],
      en: [/how\s+much/, /spend/, /today/],
      ro: [/cat/, /cheltui/, /(azi|astazi)/],
    },
    billsWeek: {
      ru: [/платеж/, /недел/],
      en: [/bill/, /week/],
      ro: [/plati/, /saptaman/],
    },
    foodMonth: {
      ru: [/потрат/, /ед/, /месяц/],
      en: [/spend|spent/, /food/, /month/],
      ro: [/cheltui/, /(mancare|alimente)/, /luna/],
    },
    remind: {
      ru: [/напомни/],
      en: [/remind/],
      ro: [/amintest/],
    },
    subscriptions: {
      ru: [/подписк/],
      en: [/subscription/],
      ro: [/abonament/],
    },
    topExpenses: {
      ru: [/сам/, /больш/, /расход/],
      en: [/biggest|largest/, /expense/],
      ro: [/cele mai/, /cheltuiel/],
    },
  } as const;

  if (hasAll(input, intent.spendToday[language])) {
    const safe = await getDailySafeLimit(userId);
    return t.assistant.responses.safeSpend.replace("{amount}", formatMoney(safe.limit, currency, language));
  }

  if (hasAll(input, intent.billsWeek[language])) {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const bills = await getBillsForDateRange(userId, start, end);
    if (!bills.length) return t.assistant.responses.billsWeekEmpty;
    return bills
      .map((bill) => `${bill.title}: ${formatMoney(Number(bill.amount), currency, language)} · ${formatDateRu(bill.due_date, language)}`)
      .join("\n");
  }

  if (hasAll(input, intent.foodMonth[language])) {
    const total = await getMonthlyFoodSpend(userId);
    return t.assistant.responses.foodMonth.replace("{amount}", formatMoney(total, currency, language));
  }

  if (hasAll(input, intent.remind[language])) {
    const reminder = await createReminderFromText(userId, text, language);
    return t.assistant.responses.reminderCreated
      .replace("{title}", reminder.title)
      .replace("{date}", new Date(reminder.remind_at).toLocaleString(locale));
  }

  if (hasAll(input, intent.subscriptions[language])) {
    const start = new Date();
    const end = addDays(start, 90);
    const bills = await getBillsForDateRange(userId, start, end);
    const subscriptions = bills.filter((bill) => {
      const category = bill.category?.toLowerCase() ?? "";
      return /подпис|subscription|abonament/.test(category) || bill.repeat_type !== "none";
    });
    if (!subscriptions.length) return t.assistant.responses.subscriptionsEmpty;
    return subscriptions
      .map((bill) => `${bill.title}: ${formatMoney(Number(bill.amount), currency, language)} (${bill.repeat_type})`)
      .join("\n");
  }

  if (hasAll(input, intent.topExpenses[language])) {
    const items = await getTopExpenses(userId, 5);
    if (!items.length) return t.assistant.responses.topExpensesEmpty;
    return items
      .map((item) => `${item.title}: ${formatMoney(Number(item.amount), currency, language)} (${formatDateRu(item.transaction_date, language)})`)
      .join("\n");
  }

  const balance = await getCurrentBalance(userId);
  const categories = await getSpendingByCategoryForCurrentMonth(userId);

  if (!openai) {
    return t.assistant.responses.fallback.replace("{amount}", formatMoney(balance.balance, currency, language));
  }

  const context = {
    balance: balance.balance,
    categories,
    scope: t.assistant.responses.scope,
  };

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: t.assistant.responses.systemPrompt,
      },
      {
        role: "user",
        content: `Request: ${text}\nContext: ${JSON.stringify(context)}`,
      },
    ],
    max_output_tokens: 250,
  });

  return response.output_text || t.assistant.responses.notUnderstood;
}
