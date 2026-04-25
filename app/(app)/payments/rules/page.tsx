import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";
import { PaymentRulesPanel } from "@/components/payments/payment-rules-panel";

export default async function PaymentRulesPage() {
  const { profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">{t.paymentsHistory.rulesTitle}</h1>
        <p className="text-sm text-[var(--text-muted)]">{t.paymentsHistory.rulesHint}</p>
      </div>
      <PaymentRulesPanel
        labels={{
          title: t.paymentsHistory.rulesTitle,
          hint: t.paymentsHistory.rulesHint,
          pattern: t.paymentsHistory.rulePattern,
          category: t.paymentsHistory.ruleCategory,
          save: t.paymentsHistory.ruleSave,
          delete: t.paymentsHistory.ruleDelete,
          empty: t.paymentsHistory.rulesEmpty,
          addTitle: t.paymentsHistory.ruleAddTitle,
          addCta: t.paymentsHistory.ruleAddCta,
        }}
      />
    </div>
  );
}
