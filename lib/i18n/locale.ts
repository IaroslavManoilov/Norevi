export const SUPPORTED_CURRENCIES = ["MDL", "EUR", "USD", "RUB", "RUP"] as const;
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  MDL: 1,
  EUR: 0.0496,
  USD: 0.058,
  RUB: 4.6349,
  RUP: 0.9344,
};

export function resolveLocale(language?: string) {
  if (language === "ru") return "ru-RU";
  if (language === "en") return "en-US";
  if (language === "ro") return "ro-RO";
  return "en-US";
}

export function normalizeRates(base: CurrencyCode, rates?: Partial<Record<CurrencyCode, number>>) {
  const merged = { ...DEFAULT_EXCHANGE_RATES, ...(rates ?? {}) };
  merged[base] = 1;
  return merged;
}

export function convertCurrency(
  amount: number,
  baseCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
  rates?: Partial<Record<CurrencyCode, number>>
) {
  const safeRates = normalizeRates(baseCurrency, rates);
  if (targetCurrency === baseCurrency) return amount;
  const rate = safeRates[targetCurrency] ?? 1;
  return amount * rate;
}
