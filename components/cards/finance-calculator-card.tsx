"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, PiggyBank, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/formatters";
import { calculateFinancePlan } from "@/lib/utils/finance-tools";
import { SUPPORTED_CURRENCIES, convertCurrency, normalizeRates, resolveLocale, type CurrencyCode } from "@/lib/i18n/locale";
import { getTranslations, type Translations } from "@/lib/i18n/translations";

export function FinanceCalculatorCard({
  currency,
  language = "en",
  exchangeRates,
  labels,
  defaultIncome = 0,
  defaultExpenses = 0,
  showHeader = true,
}: {
  currency: string;
  language?: "ru" | "en" | "ro";
  exchangeRates?: Partial<Record<CurrencyCode, number>>;
  labels?: Translations["financeCalc"];
  defaultIncome?: number;
  defaultExpenses?: number;
  showHeader?: boolean;
}) {
  const baseCurrency = (currency as CurrencyCode) || "MDL";
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>(baseCurrency);
  const [ratesState, setRatesState] = useState<Record<CurrencyCode, number>>(normalizeRates(baseCurrency, exchangeRates));
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [history, setHistory] = useState<
    { created_at: string; rates: Record<CurrencyCode, number>; base_currency: CurrencyCode }[]
  >([]);

  useEffect(() => {
    setRatesState(normalizeRates(baseCurrency, exchangeRates));
    setDisplayCurrency(baseCurrency);
  }, [baseCurrency, exchangeRates]);

  useEffect(() => {
    const key = `norevi_rates_sync_at_${baseCurrency}`;
    const last = Number(localStorage.getItem(key) || 0);
    const shouldSync = Date.now() - last > 6 * 60 * 60 * 1000;
    if (!shouldSync) return;
    setRatesLoading(true);
    fetch(`/api/rates/sync?base=${baseCurrency}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rates) {
          setRatesState(normalizeRates(baseCurrency, data.rates));
          setRatesUpdatedAt(data.updatedAt || null);
          localStorage.setItem(key, String(Date.now()));
        }
      })
      .finally(() => setRatesLoading(false));
  }, [baseCurrency]);

  useEffect(() => {
    fetch("/api/rates/history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.data) return;
        const filtered = (data.data as typeof history).filter((item) => item.base_currency === baseCurrency);
        const nextHistory = filtered.length ? filtered : (data.data as typeof history);
        setHistory(nextHistory);
        const latest = nextHistory[0];
        if (latest?.rates) {
          setRatesState(normalizeRates(baseCurrency, latest.rates));
          setRatesUpdatedAt(latest.created_at ?? null);
        }
      })
      .catch(() => null);
  }, [baseCurrency]);
  const [income, setIncome] = useState<number>(Math.max(0, Number(defaultIncome) || 0));
  const [fixedExpenses, setFixedExpenses] = useState<number>(Math.max(0, Math.round(defaultExpenses * 0.6)));
  const [variableExpenses, setVariableExpenses] = useState<number>(Math.max(0, Math.round(defaultExpenses * 0.4)));
  const [reserve, setReserve] = useState<number>(0);
  const [foodDaily, setFoodDaily] = useState<number>(0);
  const [transportPassCost, setTransportPassCost] = useState<number>(700);
  const [transportPassMonths, setTransportPassMonths] = useState<number>(3);
  const rates = ratesState;

  useEffect(() => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const fallbackFood = 90;
    const derived = variableExpenses > 0 ? Math.max(0, Math.round(variableExpenses / Math.max(1, daysInMonth))) : fallbackFood;
    setFoodDaily((prev) => (prev > 0 ? prev : derived));
  }, [variableExpenses]);

  const result = useMemo(
    () =>
      calculateFinancePlan({
        income,
        fixedExpenses,
        variableExpenses,
        reserve,
      }),
    [income, fixedExpenses, variableExpenses, reserve]
  );

  const t = labels ?? getTranslations(language).financeCalc;

  const statusTone =
    result.status === "surplus"
      ? "text-[var(--success)]"
      : result.status === "balanced"
        ? "text-[var(--warning)]"
        : "text-[var(--danger)]";

  const statusText =
    result.status === "surplus" ? t.statusSurplus : result.status === "balanced" ? t.statusBalanced : t.statusDeficit;

  const display = {
    freeAmount: convertCurrency(result.freeAmount, baseCurrency, displayCurrency, rates),
    safeDailyLimit: convertCurrency(result.safeDailyLimit, baseCurrency, displayCurrency, rates),
    savingsPotential: convertCurrency(result.savingsPotential, baseCurrency, displayCurrency, rates),
    totalExpenses: convertCurrency(result.totalExpenses, baseCurrency, displayCurrency, rates),
  };

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const foodMonthly = Math.max(0, foodDaily) * daysInMonth;
  const transportMonthly =
    transportPassCost > 0 && transportPassMonths > 0 ? transportPassCost / transportPassMonths : 0;
  const canSpendMonth = Math.max(0, income - fixedExpenses - reserve);
  const otherMonthly = Math.max(0, canSpendMonth - foodMonthly - transportMonthly);

  return (
    <Card className="min-h-[250px]">
      {showHeader ? (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--brand-100)] text-[var(--brand-800)]">
            <Calculator size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-700)]">Norevi Flow</p>
            <h3 className="text-xl font-bold">{t.title}</h3>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              {t.currency}
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}
                className="h-9 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)]"
              >
                {SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            {t.currency}
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}
              className="h-9 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--text)]"
            >
              {SUPPORTED_CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-[var(--text-muted)]">{t.incomeMonth}</span>
          <Input type="number" min={0} value={income} onChange={(e) => setIncome(Number(e.target.value) || 0)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-[var(--text-muted)]">{t.fixedExpenses}</span>
          <Input type="number" min={0} value={fixedExpenses} onChange={(e) => setFixedExpenses(Number(e.target.value) || 0)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-[var(--text-muted)]">{t.variableExpenses}</span>
          <Input type="number" min={0} value={variableExpenses} onChange={(e) => setVariableExpenses(Number(e.target.value) || 0)} />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-[var(--text-muted)]">{t.reserve}</span>
          <Input type="number" min={0} value={reserve} onChange={(e) => setReserve(Number(e.target.value) || 0)} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-3 text-xs"
          onClick={() => {
            setIncome(Math.max(0, Number(defaultIncome) || 0));
            const fixed = Math.max(0, Math.round(defaultExpenses * 0.6));
            const variable = Math.max(0, Math.round(defaultExpenses * 0.4));
            setFixedExpenses(fixed);
            setVariableExpenses(variable);
            setReserve(0);
            const derived = variable > 0 ? Math.round(variable / Math.max(1, daysInMonth)) : 90;
            setFoodDaily(Math.max(0, derived));
            setTransportPassCost(700);
            setTransportPassMonths(3);
          }}
        >
          {t.resetActual}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-9 px-3 text-xs"
          onClick={() => {
            setIncome(0);
            setFixedExpenses(0);
            setVariableExpenses(0);
            setReserve(0);
            setFoodDaily(0);
            setTransportPassCost(0);
            setTransportPassMonths(3);
          }}
        >
          {t.clearAll}
        </Button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-[14px] border border-[var(--brand-200)] bg-[var(--brand-50)] p-3 text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)]">
          <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-soft)]">{t.freeAfter}</p>
          <p className="text-sm font-semibold">{formatMoney(display.freeAmount, displayCurrency, language)}</p>
        </div>
        <div className="rounded-[14px] border border-[var(--mint-200)] bg-[var(--mint-100)] p-3 text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)]">
          <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-soft)]">{t.safePerDay}</p>
          <p className="text-sm font-semibold">{formatMoney(display.safeDailyLimit, displayCurrency, language)}</p>
        </div>
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-[var(--text)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)]">
          <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-dark-soft)]">{t.savingsPotential}</p>
          <p className="text-sm font-semibold">{formatMoney(display.savingsPotential, displayCurrency, language)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <Wallet size={16} className="text-[var(--brand-700)]" />
        <span className={statusTone}>{statusText}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <PiggyBank size={14} />
        {t.totalExpenses}: {formatMoney(display.totalExpenses, displayCurrency, language)}
      </div>

      <div className="mt-5 rounded-[16px] border border-[var(--divider)] bg-[var(--surface-soft)] p-3 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{t.planTitle}</p>
            <p className="text-xs text-[var(--text-muted)]">{t.planHint}</p>
          </div>
          <div className="rounded-full bg-[var(--brand-100)] px-3 py-1 text-xs font-semibold text-[var(--brand-800)]">
            {t.canSpendMonth}: {formatMoney(convertCurrency(canSpendMonth, baseCurrency, displayCurrency, rates), displayCurrency, language)}
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs text-[var(--text-muted)]">{t.foodDaily}</span>
            <Input type="number" min={0} value={foodDaily} onChange={(e) => setFoodDaily(Number(e.target.value) || 0)} />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-[var(--text-muted)]">{t.transportPassCost}</span>
            <Input
              type="number"
              min={0}
              value={transportPassCost}
              onChange={(e) => setTransportPassCost(Number(e.target.value) || 0)}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-[var(--text-muted)]">{t.transportPassMonths}</span>
            <Input
              type="number"
              min={1}
              value={transportPassMonths}
              onChange={(e) => setTransportPassMonths(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs">
            <p className="text-[var(--text-muted)]">{t.foodMonthly}</p>
            <p className="text-sm font-semibold text-[var(--text)]">
              {formatMoney(convertCurrency(foodMonthly, baseCurrency, displayCurrency, rates), displayCurrency, language)}
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs">
            <p className="text-[var(--text-muted)]">{t.transportMonthly}</p>
            <p className="text-sm font-semibold text-[var(--text)]">
              {formatMoney(convertCurrency(transportMonthly, baseCurrency, displayCurrency, rates), displayCurrency, language)}
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs">
            <p className="text-[var(--text-muted)]">{t.otherMonthly}</p>
            <p className="text-sm font-semibold text-[var(--text)]">
              {formatMoney(convertCurrency(otherMonthly, baseCurrency, displayCurrency, rates), displayCurrency, language)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-[var(--divider)] bg-[var(--surface-soft)] p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--text)]">{t.rates}</p>
          <span className="text-xs text-[var(--text-muted)]">
            {(ratesLoading ? t.ratesUpdating : t.rateHint)} ({baseCurrency})
            {ratesUpdatedAt ? ` · ${new Date(ratesUpdatedAt).toLocaleString(resolveLocale(language))}` : ""}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SUPPORTED_CURRENCIES.map((code) => (
            <div key={code} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-xs">
              <p className="text-[var(--text-muted)]">{code}</p>
              <p className="text-sm font-semibold text-[var(--text)]">{rates[code].toFixed(4)}</p>
            </div>
          ))}
        </div>
        {history.length >= 2 ? (
          <div className="mt-3 text-xs text-[var(--text-muted)]">
            {t.trendLabel} {displayCurrency}: {(() => {
              const latest = history[0]?.rates?.[displayCurrency] ?? 0;
              const prev = history[1]?.rates?.[displayCurrency] ?? 0;
              if (!latest || !prev) return "—";
              const delta = ((latest - prev) / prev) * 100;
              const sign = delta >= 0 ? "+" : "";
              return `${sign}${delta.toFixed(2)}%`;
            })()}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
