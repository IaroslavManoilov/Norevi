import { Card } from "@/components/ui/card";
import Link from "next/link";
import { requireOnboarded } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n/translations";
import { formatDateRu, formatMoney } from "@/lib/formatters";
import { getTransactions } from "@/lib/db/queries";

function isPaymentEntry(title: string, note: string) {
  const t = title.toLowerCase();
  const n = note.toLowerCase();
  if (t.startsWith("оплата:") || t.startsWith("payment:") || t.startsWith("plata:")) return true;
  if (n.includes("norevi") || n.includes("оплачено") || n.includes("paid via") || n.includes("platita")) return true;
  return false;
}

export default async function PaymentsHistoryPage() {
  const { user, supabase, profile } = await requireOnboarded();
  const language = (profile?.language as "ru" | "en" | "ro") ?? "en";
  const t = getTranslations(language);
  const currency = profile?.currency ?? "MDL";

  const transactions = await getTransactions(supabase, user.id);
  const payments = transactions
    .filter((tx) => tx.type === "expense")
    .filter((tx) => isPaymentEntry(tx.title ?? "", tx.note ?? ""))
    .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));

  const total = payments.reduce((acc, tx) => acc + Number(tx.amount), 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">{t.paymentsHistory.title}</h1>
            <p className="text-sm text-[var(--text-muted)]">{t.paymentsHistory.subtitle}</p>
          </div>
          <Link
            href="/payments/rules"
            className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)] dark:hover:bg-[var(--surface-dark-soft)]"
          >
            {t.paymentsHistory.manageRules}
          </Link>
        </div>
      </div>
      <Card>
        {payments.length ? (
          <div className="space-y-3">
            {payments.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{tx.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatDateRu(tx.transaction_date, language)}</p>
                  {tx.note ? <p className="text-xs text-[var(--text-muted)]">{tx.note}</p> : null}
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatMoney(Number(tx.amount), currency, language)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[var(--divider)] pt-3 text-xs text-[var(--text-muted)]">
              <span>{t.paymentsHistory.total}</span>
              <span className="text-sm font-semibold text-[var(--text)]">
                {formatMoney(total, currency, language)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">{t.paymentsHistory.empty}</p>
        )}
      </Card>
    </div>
  );
}
