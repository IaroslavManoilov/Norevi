import { resolveLocale } from "@/lib/i18n/locale";

export function formatMoney(value: number, currency = "MDL", localeOrLanguage = "ru-RU") {
  const locale = resolveLocale(localeOrLanguage);
  const safeValue = Number.isFinite(value) ? value : 0;
  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(safeValue);
    return formatted.replace(new RegExp(`\\s${currency}\\s*$`, "i"), `\u00A0${currency.toUpperCase()}`);
  } catch {
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
    }).format(safeValue);
    return `${formatted}\u00A0${currency.toUpperCase()}`;
  }
}

export function formatDateRu(value: string | Date, localeOrLanguage = "ru-RU") {
  const locale = resolveLocale(localeOrLanguage);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTimeRu(value: string | Date, localeOrLanguage = "ru-RU") {
  const locale = resolveLocale(localeOrLanguage);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
