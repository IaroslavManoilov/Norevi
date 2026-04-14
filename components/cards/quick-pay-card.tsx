"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { formatDateRu, formatMoney } from "@/lib/formatters";
import type { Bill } from "@/types/domain";

type PaymentRule = {
  id: string;
  pattern: string;
  category_id: string;
};

type QuickPayLabels = {
  title: string;
  hint: string;
  salaryPlaceholder: string;
  salaryCta: string;
  salarySuccess: string;
  salaryError: string;
  billsTitle: string;
  billsHint: string;
  billsEmpty: string;
  criticalLabel: string;
  overdueLabel: string;
  dueTodayLabel: string;
  overdueOnlyLabel: string;
  billPay: string;
  billPaying: string;
  billPaid: string;
  billPaidToday: string;
  billPaidLabel: string;
  payAll: string;
  payAllBusy: string;
  methodLabel: string;
  methodApple: string;
  methodCard: string;
  paidVia: string;
  reminderTitle: string;
  reminderBody: string;
  reminderToast: string;
  payInternet: string;
  payHousing: string;
  payCredit: string;
  payAllNoteTitle: string;
  payAllNoteBody: string;
  payAllNoteSaved: string;
  receiptTitle: string;
  receiptBody: string;
  receiptSaved: string;
  billPaymentTitle: string;
  billPaymentNote: string;
};

export function QuickPayCard({
  bills,
  currency,
  language,
  labels,
}: {
  bills: Bill[];
  currency: string;
  language: "ru" | "en" | "ro";
  labels: QuickPayLabels;
}) {
  const router = useRouter();
  const { show } = useToast();
  const [salaryAmount, setSalaryAmount] = useState<number>(0);
  const [savingSalary, setSavingSalary] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paidToday, setPaidToday] = useState<Set<string>>(new Set());
  const [paidMethod, setPaidMethod] = useState<Record<string, string>>({});
  const [payingAll, setPayingAll] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [paymentRules, setPaymentRules] = useState<PaymentRule[]>([]);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(`norevi_paid_today_${todayKey}`);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      setPaidToday(new Set(parsed));
    } catch {
      setPaidToday(new Set());
    }
  }, [todayKey]);

  useMemo(() => {
    fetch("/api/payment-rules")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) setPaymentRules(data.data as PaymentRule[]);
      })
      .catch(() => null);
  }, []);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(`norevi_paid_method_${todayKey}`);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Record<string, string>;
      setPaidMethod(parsed ?? {});
    } catch {
      setPaidMethod({});
    }
  }, [todayKey]);

  const dueBills = useMemo(() => {
    const filtered = bills.filter((bill) => bill.status !== "paid" || paidToday.has(bill.id));
    const sorted = filtered.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    if (!showOverdueOnly) return sorted.slice(0, 4);
    return sorted.filter((bill) => bill.due_date < todayKey).slice(0, 4);
  }, [bills, paidToday, showOverdueOnly, todayKey]);

  const payableBills = useMemo(() => {
    return bills.filter((bill) => bill.status !== "paid" && !paidToday.has(bill.id));
  }, [bills, paidToday]);

  const todayIso = todayKey;
  const criticalBills = useMemo(() => {
    return bills.filter((bill) => {
      if (bill.status === "paid") return false;
      if (paidToday.has(bill.id)) return false;
      return bill.due_date <= todayIso;
    });
  }, [bills, paidToday, todayIso]);

  const resolveCategoryLabel = (bill: Bill) => {
    if (bill.category && bill.category.trim()) return bill.category.trim();
    const name = bill.title.toLowerCase();
    if (name.includes("интернет") || name.includes("internet") || name.includes("wifi") || name.includes("wi-fi")) {
      return language === "ru" ? "Интернет" : language === "ro" ? "Internet" : "Internet";
    }
    if (
      name.includes("аренд") ||
      name.includes("жиль") ||
      name.includes("кварт") ||
      name.includes("rent") ||
      name.includes("chirie") ||
      name.includes("locuint")
    ) {
      return language === "ru" ? "Жильё" : language === "ro" ? "Locuinta" : "Housing";
    }
    if (name.includes("кредит") || name.includes("loan") || name.includes("credit") || name.includes("rata")) {
      return language === "ru" ? "Кредит" : language === "ro" ? "Credit" : "Credit";
    }
    return "";
  };

  const normalizePattern = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const extractPattern = (value: string) => {
    const base = normalizePattern(value);
    const tokens = base.split(" ").filter((token) => token.length >= 4);
    return tokens.slice(0, 2).join(" ") || base;
  };

  const matchRule = (value: string): PaymentRule | null => {
    const normalized = normalizePattern(value);
    let best: PaymentRule | null = null;
    paymentRules.forEach((rule) => {
      if (!rule.pattern) return;
      if (normalized.includes(rule.pattern)) {
        if (!best || rule.pattern.length > best.pattern.length) best = rule;
      }
    });
    return best;
  };

  useMemo(() => {
    if (typeof window === "undefined") return;
    if (!criticalBills.length) return;
    criticalBills.forEach((bill) => {
      const key = `norevi_critical_reminder_${bill.id}`;
      const stored = localStorage.getItem(key);
      if (stored && stored === bill.due_date) return;
      const reminderTitle = labels.reminderTitle.replace("{title}", bill.title);
      const reminderBody = labels.reminderBody
        .replace("{title}", bill.title)
        .replace("{amount}", formatMoney(Number(bill.amount), currency, language));
      const remindAt = new Date();
      const now = new Date();
      remindAt.setHours(9, 0, 0, 0);
      if (remindAt.getTime() < now.getTime()) {
        remindAt.setDate(remindAt.getDate() + 1);
      }
      fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reminderTitle,
          description: reminderBody,
          remind_at: remindAt.toISOString(),
          repeat_type: "none",
          priority: "low",
          status: "active",
        }),
      })
        .then((res) => {
          if (res.ok) {
            localStorage.setItem(key, bill.due_date);
            show(labels.reminderToast.replace("{title}", bill.title));
          }
        })
        .catch(() => null);
    });
  }, [criticalBills, todayKey, labels, currency, language, show]);

  const handleSalary = async () => {
    if (salaryAmount <= 0) return;
    setSavingSalary(true);
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "income",
          amount: salaryAmount,
          title: labels.title,
          note: "",
          category_id: null,
          transaction_date: new Date().toISOString().slice(0, 10),
        }),
      });
      if (res.ok) {
        show(labels.salarySuccess);
        setSalaryAmount(0);
        router.refresh();
      } else {
        show(labels.salaryError);
      }
    } finally {
      setSavingSalary(false);
    }
  };

  const payBill = async (bill: Bill, method: string) => {
    setPayingId(bill.id);
    try {
      const matchedRule = matchRule(bill.title);
      const categoryLabel = resolveCategoryLabel(bill);
      let categoryId: string | null = null;
      if (matchedRule?.category_id) {
        categoryId = matchedRule.category_id;
      } else if (categoryLabel) {
        const catRes = await fetch("/api/categories/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryLabel, type: "expense" }),
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          categoryId = catData?.data?.id ?? null;
        }
      }
      const billRes = await fetch(`/api/bills/${bill.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (!billRes.ok) {
        show(labels.salaryError);
        return;
      }
      const paymentTitle = labels.billPaymentTitle.replace("{title}", bill.title);
      await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "expense",
          amount: Number(bill.amount),
          title: paymentTitle,
          note: `${labels.billPaymentNote} ${labels.paidVia.replace("{method}", method)}`.trim(),
          category_id: categoryId,
          transaction_date: new Date().toISOString().slice(0, 10),
        }),
      });
      if (typeof window !== "undefined") {
        const nextSet = new Set(paidToday);
        nextSet.add(bill.id);
        setPaidToday(nextSet);
        localStorage.setItem(`norevi_paid_today_${todayKey}`, JSON.stringify(Array.from(nextSet)));
        const nextMethod = { ...paidMethod, [bill.id]: method };
        setPaidMethod(nextMethod);
        localStorage.setItem(`norevi_paid_method_${todayKey}`, JSON.stringify(nextMethod));
      }
      if (!matchedRule && categoryId) {
        const pattern = extractPattern(bill.title);
        if (pattern.length >= 4) {
          const ruleRes = await fetch("/api/payment-rules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pattern, category_id: categoryId }),
          });
          if (ruleRes.ok) {
            const data = await ruleRes.json();
            if (data?.data) {
              setPaymentRules((prev) => [...prev, data.data as PaymentRule]);
            }
          }
        }
      }
      if (method === "Apple Pay") {
        const receiptBody = labels.receiptBody
          .replace("{title}", bill.title)
          .replace("{amount}", formatMoney(Number(bill.amount), currency, language));
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: labels.receiptTitle.replace("{title}", bill.title),
            body: receiptBody,
            note_date: new Date().toISOString().slice(0, 10),
          }),
        });
        show(labels.receiptSaved.replace("{title}", bill.title));
      }
      show(labels.billPaid);
      router.refresh();
    } finally {
      setPayingId(null);
    }
  };

  const handlePay = async (bill: Bill) => {
    await payBill(bill, paymentMethod);
  };

  const handlePayAll = async () => {
    if (!payableBills.length) return;
    setPayingAll(true);
    try {
      const list = [...payableBills];
      for (const bill of payableBills) {
        await payBill(bill, paymentMethod);
      }
      const noteLines = list.map(
        (bill) => `• ${bill.title} — ${formatMoney(Number(bill.amount), currency, language)}`
      );
      const noteBody = labels.payAllNoteBody
        .replace("{count}", String(list.length))
        .replace("{items}", noteLines.join("\n"));
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: labels.payAllNoteTitle,
          body: noteBody,
          note_date: new Date().toISOString().slice(0, 10),
        }),
      });
      show(labels.payAllNoteSaved);
    } finally {
      setPayingAll(false);
    }
  };

  const findBillByCategory = (category: "internet" | "housing" | "credit") => {
    return payableBills.find((bill) => {
      const name = bill.title.toLowerCase();
      if (category === "internet") {
        return (
          name.includes("интернет") ||
          name.includes("internet") ||
          name.includes("wifi") ||
          name.includes("wi-fi")
        );
      }
      if (category === "housing") {
        return (
          name.includes("аренд") ||
          name.includes("жиль") ||
          name.includes("кварт") ||
          name.includes("rent") ||
          name.includes("chirie") ||
          name.includes("locuint")
        );
      }
      return name.includes("кредит") || name.includes("loan") || name.includes("credit") || name.includes("rata");
    });
  };

  const internetBill = findBillByCategory("internet");
  const housingBill = findBillByCategory("housing");
  const creditBill = findBillByCategory("credit");

  return (
    <Card className="min-h-0 sm:min-h-[260px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{labels.title}</p>
          <p className="text-xs text-[var(--text-muted)]">{labels.hint}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            type="number"
            min={0}
            value={Number.isFinite(salaryAmount) ? salaryAmount : 0}
            onChange={(event) => setSalaryAmount(Number(event.target.value || 0))}
            placeholder={labels.salaryPlaceholder}
            className="h-10 w-full sm:h-9 sm:w-32"
          />
          <div className="flex w-full gap-2 sm:w-auto">
            <Button type="button" className="h-10 flex-1 px-3 text-xs sm:h-9 sm:flex-none" onClick={handleSalary} disabled={savingSalary}>
              {labels.salaryCta}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-10 flex-1 px-3 text-xs sm:h-9 sm:flex-none"
              onClick={handlePayAll}
              disabled={payingAll || !payableBills.length}
            >
              {payingAll ? labels.payAllBusy : labels.payAll}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">{labels.billsTitle}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{labels.billsHint}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>{labels.methodLabel}</span>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="h-8 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text)] outline-none dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark)]"
          >
            <option value="Apple Pay">{labels.methodApple}</option>
            <option value={labels.methodCard}>{labels.methodCard}</option>
          </select>
          <button
            type="button"
            onClick={() => setShowOverdueOnly((prev) => !prev)}
            className={`sm:ml-auto rounded-full border px-3 py-1 text-[11px] font-semibold ${
              showOverdueOnly
                ? "border-[var(--brand-600)] text-[var(--brand-600)]"
                : "border-[var(--border)] text-[var(--text-muted)] dark:border-[var(--border-dark)]"
            }`}
          >
            {labels.overdueOnlyLabel}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={() => internetBill && handlePay(internetBill)}
            disabled={!internetBill || payingId === internetBill?.id}
          >
            {labels.payInternet}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={() => housingBill && handlePay(housingBill)}
            disabled={!housingBill || payingId === housingBill?.id}
          >
            {labels.payHousing}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={() => creditBill && handlePay(creditBill)}
            disabled={!creditBill || payingId === creditBill?.id}
          >
            {labels.payCredit}
          </Button>
        </div>
        {dueBills.length ? (
          <div className="mt-3 space-y-2">
            {dueBills.map((bill) => (
              (() => {
                const dueIso = bill.due_date;
                const isOverdue = dueIso < todayIso;
                const isToday = dueIso === todayIso;
                return (
              <div
                key={bill.id}
                className={`flex items-center justify-between rounded-[14px] border px-3 py-2 ${
                  isOverdue
                    ? "border-[var(--danger)]/40 bg-[var(--surface-soft)] dark:border-[var(--danger)]/40 dark:bg-[var(--surface-dark-soft)]"
                    : isToday
                      ? "border-[var(--warning)]/40 bg-[var(--surface-soft)] dark:border-[var(--warning)]/40 dark:bg-[var(--surface-dark-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] dark:border-[var(--border-dark)] dark:bg-[var(--surface-dark-soft)]"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{bill.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatDateRu(bill.due_date, language)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {isOverdue ? (
                      <span className="inline-flex rounded-full bg-[var(--danger)] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {labels.overdueLabel}
                      </span>
                    ) : isToday ? (
                      <span className="inline-flex rounded-full bg-[var(--warning)] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {labels.dueTodayLabel}
                      </span>
                    ) : null}
                    {paidToday.has(bill.id) ? (
                      <span className="inline-flex rounded-full bg-[var(--success)] px-2 py-0.5 text-[11px] font-semibold text-white">
                        {labels.billPaidToday}
                      </span>
                    ) : null}
                    {paidToday.has(bill.id) && paidMethod[bill.id] ? (
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {labels.paidVia.replace("{method}", paidMethod[bill.id])}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {formatMoney(Number(bill.amount), currency, language)}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2 text-xs"
                    onClick={() => handlePay(bill)}
                    disabled={payingId === bill.id || paidToday.has(bill.id)}
                  >
                    {paidToday.has(bill.id) ? labels.billPaidLabel : payingId === bill.id ? labels.billPaying : labels.billPay}
                  </Button>
                </div>
              </div>
                );
              })()
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--text-muted)]">{labels.billsEmpty}</p>
        )}
      </div>
    </Card>
  );
}
