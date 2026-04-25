import { remainingDaysInMonth } from "@/lib/dates/month";

export interface FinanceCalculatorInput {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  reserve: number;
}

export interface FinanceCalculatorResult {
  totalExpenses: number;
  freeAmount: number;
  safeDailyLimit: number;
  savingsPotential: number;
  status: "surplus" | "balanced" | "deficit";
}

function clean(value: number) {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 0;
  return Math.max(0, value);
}

export function calculateFinancePlan(input: FinanceCalculatorInput, daysLeft = remainingDaysInMonth(new Date())): FinanceCalculatorResult {
  const income = clean(input.income);
  const fixedExpenses = clean(input.fixedExpenses);
  const variableExpenses = clean(input.variableExpenses);
  const reserve = clean(input.reserve);
  const totalExpenses = fixedExpenses + variableExpenses;
  const freeAmount = income - totalExpenses;
  const projected = freeAmount - reserve;
  const safeDailyLimit = daysLeft > 0 ? projected / daysLeft : 0;

  const status = projected > 0 ? "surplus" : projected === 0 ? "balanced" : "deficit";

  return {
    totalExpenses,
    freeAmount,
    safeDailyLimit,
    savingsPotential: projected,
    status,
  };
}

