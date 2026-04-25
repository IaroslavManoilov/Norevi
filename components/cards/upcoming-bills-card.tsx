import Link from "next/link";
import type { Bill } from "@/types/domain";
import { formatDateRu, formatMoney } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/lib/i18n/translations";

export function UpcomingBillsCard({
  bills,
  currency,
  language = "en",
  labels,
}: {
  bills: Bill[];
  currency: string;
  language?: "ru" | "en" | "ro";
  labels?: {
    title: string;
    hint: string;
    empty: string;
    statusUpcoming: string;
    statusPaid: string;
    statusOverdue: string;
    dueLabel: string;
  };
}) {
  const t = getTranslations(language);
  const resolved = labels ?? {
    title: t.dashboard.upcomingBills,
    hint: t.dashboard.quickActionsHint,
    empty: t.bills.emptyDescription,
    statusUpcoming: t.bills.upcoming,
    statusPaid: t.bills.paid,
    statusOverdue: t.bills.overdue,
    dueLabel: t.bills.dueLabel,
  };
  const statusLabel: Record<Bill["status"], string> = {
    upcoming: resolved.statusUpcoming,
    paid: resolved.statusPaid,
    overdue: resolved.statusOverdue,
  };
  return (
    <Card className="min-h-[190px]">
      <SectionHeader title={resolved.title} hint={resolved.hint} />
      {bills.length ? (
        <ul className="space-y-2">
          {bills.slice(0, 5).map((bill) => (
            <li
              key={bill.id}
              className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <Link href={`/bills/${bill.id}`} className="truncate text-base font-semibold text-[var(--text)]">
                  {bill.title}
                </Link>
                <p className="text-xs text-[var(--text-muted)]">
                  {resolved.dueLabel} {formatDateRu(bill.due_date, language)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={bill.status === "paid" ? "success" : bill.status === "overdue" ? "danger" : "neutral"}>
                  {statusLabel[bill.status]}
                </Badge>
                <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold [font-variant-numeric:tabular-nums]">
                  {formatMoney(Number(bill.amount), currency, language)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">{resolved.empty}</p>
      )}
    </Card>
  );
}
