"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useI18n } from "@/components/i18n/i18n-provider";
import { SUPPORTED_CURRENCIES } from "@/lib/i18n/locale";

export function OnboardingWizard({
  defaults,
}: {
  defaults: { currency: string; language: string; monthly_budget_limit: number | null };
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState(defaults.currency || "MDL");
  const [language, setLanguage] = useState(defaults.language || "en");
  const [limit, setLimit] = useState(defaults.monthly_budget_limit ? String(defaults.monthly_budget_limit) : "");
  const [error, setError] = useState<string | null>(null);

  const total = 5;

  async function finish() {
    setError(null);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency,
        language,
        monthly_budget_limit: limit ? Number(limit) : null,
      }),
    });

    if (!res.ok) {
      setError(t.errors.onboarding);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <p className="text-xs text-[var(--text-muted)]">
        {t.onboarding.step} {step} {t.onboarding.stepOf} {total}
      </p>
      {step === 1 ? (
        <div className="mt-3">
          <h1 className="text-2xl font-bold">{t.onboarding.welcomeTitle}</h1>
          <p className="text-sm text-[var(--text-soft)]">{t.onboarding.welcomeText}</p>
        </div>
      ) : null}
      {step === 2 ? (
        <div className="mt-3 space-y-2">
          <h2 className="text-xl font-semibold">{t.onboarding.chooseCurrency}</h2>
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {t.currencies[code]}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
      {step === 3 ? (
        <div className="mt-3 space-y-2">
          <h2 className="text-xl font-semibold">{t.onboarding.chooseLanguage}</h2>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ru">{t.languages.ru}</option>
            <option value="en">{t.languages.en}</option>
            <option value="ro">{t.languages.ro}</option>
          </Select>
        </div>
      ) : null}
      {step === 4 ? (
        <div className="mt-3 space-y-2">
          <h2 className="text-xl font-semibold">{t.onboarding.budgetLimit}</h2>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder={t.onboarding.limitPlaceholder}
          />
        </div>
      ) : null}
      {step === 5 ? (
        <div className="mt-3">
          <h2 className="text-xl font-semibold">{t.onboarding.doneTitle}</h2>
          <p className="text-sm text-[var(--text-soft)]">{t.onboarding.doneText}</p>
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      <div className="mt-6 flex gap-2">
        {step > 1 ? (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            {t.actions.back}
          </Button>
        ) : null}
        {step < total ? (
          <Button onClick={() => setStep((s) => s + 1)}>{t.actions.next}</Button>
        ) : (
          <Button onClick={finish}>{t.actions.finish}</Button>
        )}
      </div>
    </div>
  );
}
