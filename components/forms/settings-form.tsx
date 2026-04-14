"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { settingsSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useI18n } from "@/components/i18n/i18n-provider";
import { SUPPORTED_CURRENCIES, type CurrencyCode, normalizeRates } from "@/lib/i18n/locale";

type SettingsValues = z.input<typeof settingsSchema>;

export function SettingsForm({ defaultValues }: { defaultValues: Partial<SettingsValues> }) {
  const { t } = useI18n();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      currency: "MDL",
      language: "en",
      timezone: "Europe/Chisinau",
      theme: "system",
      monthly_budget_limit: null,
      exchange_rates: {
        MDL: 1,
        EUR: 0.0496,
        USD: 0.058,
        RUB: 4.6349,
        RUP: 0.9344,
      },
      ...defaultValues,
    },
  });

  const baseCurrency = (form.watch("currency") || "MDL").toUpperCase() as CurrencyCode;
  useEffect(() => {
    const currentRates = normalizeRates(baseCurrency, form.getValues("exchange_rates") as Record<CurrencyCode, number>);
    SUPPORTED_CURRENCIES.forEach((code) => {
      form.setValue(`exchange_rates.${code}` as const, currentRates[code]);
    });
  }, [baseCurrency, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const normalizedValues = {
      ...values,
      monthly_budget_limit:
        typeof values.monthly_budget_limit === "number" && Number.isNaN(values.monthly_budget_limit)
          ? null
          : values.monthly_budget_limit,
    };
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedValues),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: null }));
      if (data.error === "validation_error") {
        setServerError(t.errors.validation.generic);
      } else {
        setServerError(t.errors.saveSettings);
      }
      return;
    }
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text-soft)]">{t.settings.name}</span>
          <Input placeholder={t.settings.name} {...form.register("full_name")} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text-soft)]">{t.settings.currency}</span>
          <Select {...form.register("currency")}>
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {t.currencies[code]}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text-soft)]">{t.settings.language}</span>
          <Select {...form.register("language")}>
            <option value="ru">{t.languages.ru}</option>
            <option value="en">{t.languages.en}</option>
            <option value="ro">{t.languages.ro}</option>
          </Select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text-soft)]">{t.settings.timezone}</span>
          <Input placeholder="Europe/Chisinau" {...form.register("timezone")} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-[var(--text-soft)]">{t.settings.budgetLimit}</span>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...form.register("monthly_budget_limit", { valueAsNumber: true })}
          />
        </label>
      </div>

      <div className="rounded-[16px] border border-[var(--divider)] bg-[var(--surface-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[var(--text)]">{t.settings.exchangeRates}</p>
          <span className="text-xs text-[var(--text-muted)]">{t.settings.exchangeRatesHint}</span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-5">
          {SUPPORTED_CURRENCIES.map((code) => (
            <label key={code} className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">{t.currencies[code]}</span>
              <Input
                type="number"
                step="0.0001"
                {...form.register(`exchange_rates.${code}` as const, { valueAsNumber: true })}
              />
            </label>
          ))}
        </div>
      </div>
      {serverError ? <p className="text-sm text-[var(--danger)]">{serverError}</p> : null}
      <Button type="submit" variant="primary">
        {t.actions.save}
      </Button>
    </form>
  );
}
