"use client";

import { useEffect } from "react";
import { normalizeRates, type CurrencyCode } from "@/lib/i18n/locale";
import { STORAGE_KEYS, readStorageWithLegacy } from "@/lib/config/storage";

export function RatesAutoSync({ baseCurrency }: { baseCurrency: string }) {
  useEffect(() => {
    const base = (baseCurrency || "MDL").toUpperCase() as CurrencyCode;
    const key = STORAGE_KEYS.ratesSyncAt(base);
    const last = Number(readStorageWithLegacy(key, `norevi_rates_sync_at_${base}`) || 0);
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
