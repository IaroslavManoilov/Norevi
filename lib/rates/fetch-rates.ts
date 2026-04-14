import { SUPPORTED_CURRENCIES, type CurrencyCode, normalizeRates } from "@/lib/i18n/locale";

const APB_URL = "https://www.agroprombank.com/eshche/poleznoe/kursy-valyut/";
const CURS_URL = "https://www.curs.md/ru";
const MINFIN_URL = "https://index.minfin.com.ua/exchange/world/";

export type RatesPayload = {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  sources: {
    agroprombank?: string;
    curs?: string;
    minfin?: string;
  };
  updatedAt: string;
};

function toNumber(value: string | null) {
  if (!value) return null;
  return Number.parseFloat(value.replace(",", "."));
}

function extractApbOfficial(html: string) {
  const marker = "Официальные курсы валют";
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const slice = html.slice(start, start + 4000);
  const read = (code: CurrencyCode) => {
    const re = new RegExp(`${code}[\\s\\S]{0,140}?(\\d+[\\.,]\\d+)\\s+(\\d+[\\.,]\\d+)`, "i");
    const match = slice.match(re);
    if (!match) return null;
    return toNumber(match[2]);
  };
  const usd = read("USD");
  const eur = read("EUR");
  const mdl = read("MDL");
  const rub = read("RUB");
  if (!usd || !eur || !mdl || !rub) return null;
  return { usd, eur, mdl, rub };
}

function extractCursMdl(html: string) {
  const read = (code: "USD" | "EUR") => {
    const re = new RegExp(`${code}\\s+\\d+[\\.,]\\d+\\s+Лей\\s+(\\d+[\\.,]\\d+)`, "i");
    const match = html.match(re);
    return toNumber(match?.[1] ?? null);
  };
  const usd = read("USD");
  const eur = read("EUR");
  if (!usd && !eur) return null;
  return { usd, eur };
}

export async function fetchRates(base: CurrencyCode): Promise<RatesPayload> {
  const [apbRes, cursRes, minfinRes] = await Promise.allSettled([
    fetch(APB_URL, { cache: "no-store" }),
    fetch(CURS_URL, { cache: "no-store" }),
    fetch(MINFIN_URL, { cache: "no-store" }),
  ]);

  const apbHtml = apbRes.status === "fulfilled" ? await apbRes.value.text() : null;
  const cursHtml = cursRes.status === "fulfilled" ? await cursRes.value.text() : null;

  const apbOfficial = apbHtml ? extractApbOfficial(apbHtml) : null;
  const cursOfficial = cursHtml ? extractCursMdl(cursHtml) : null;

  const rates: Record<CurrencyCode, number> = normalizeRates(base, {});

  if (apbOfficial) {
    const mdlToRup = apbOfficial.mdl;
    rates.RUP = mdlToRup;
    rates.USD = mdlToRup / apbOfficial.usd;
    rates.EUR = mdlToRup / apbOfficial.eur;
    rates.RUB = mdlToRup / apbOfficial.rub;
    rates.MDL = 1;
  } else if (cursOfficial) {
    rates.MDL = 1;
    if (cursOfficial.usd) rates.USD = cursOfficial.usd;
    if (cursOfficial.eur) rates.EUR = cursOfficial.eur;
  }

  return {
    base,
    rates,
    sources: {
      agroprombank: apbOfficial ? APB_URL : undefined,
      curs: cursOfficial ? CURS_URL : undefined,
      minfin: minfinRes.status === "fulfilled" ? MINFIN_URL : undefined,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function resolveBaseCurrency(input?: string) {
  const code = (input || "MDL").toUpperCase();
  return (SUPPORTED_CURRENCIES.includes(code as CurrencyCode) ? code : "MDL") as CurrencyCode;
}
