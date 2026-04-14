"use client";

import { useEffect } from "react";
import { normalizeRates, type CurrencyCode } from "@/lib/i18n/locale";

export function RatesAutoSync({ baseCurrency }: { baseCurrency: string }) {
  useEffect(() => {
    const base = (baseCurrency || "MDL").toUpperCase() as CurrencyCode;
    const key = `norevi_rates_sync_at_${base}`;
    const last = Number(localStorage.getItem(key) || 0);
    const shouldSync = Date.now() - last > 6 * 60 * 60 * 1000;
    if (!shouldSync) return;

    fetch(`/api/rates/sync?base=${base}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.rates) return;
        normalizeRates(base, data.rates as Record<CurrencyCode, number>);
        localStorage.setItem(key, String(Date.now()));
      })
      .catch(() => null);
  }, [baseCurrency]);

  return null;
}
