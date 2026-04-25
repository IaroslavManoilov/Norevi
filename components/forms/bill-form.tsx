"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { billSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/i18n-provider";

type BillValues = z.input<typeof billSchema>;

export function BillForm({ defaultValues, id }: { defaultValues?: Partial<BillValues>; id?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useI18n();
  const form = useForm<BillValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      title: "",
      amount: 0,
      due_date: new Date().toISOString().slice(0, 10),
      repeat_type: "none",
      category: "",
      status: "upcoming",
      auto_renew: false,
      note: "",
      ...defaultValues,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const res = await fetch(id ? `/api/bills/${id}` : "/api/bills", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: null }));
      if (data.error === "validation_error") {
        setServerError(t.errors.validation.generic);
      } else {
        setServerError(t.errors.saveBill);
      }
      return;
    }
    router.push("/bills");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder={t.forms.title} {...form.register("title")} />
      <Input type="number" step="0.01" placeholder={t.forms.amount} {...form.register("amount", { valueAsNumber: true })} />
      <Input type="date" {...form.register("due_date")} />
      <Select {...form.register("repeat_type")}>
        <option value="none">{t.forms.repeatNone}</option>
        <option value="weekly">{t.forms.repeatWeekly}</option>
        <option value="monthly">{t.forms.repeatMonthly}</option>
        <option value="yearly">{t.forms.repeatYearly}</option>
      </Select>
      <Select {...form.register("status")}>
        <option value="upcoming">{t.bills.upcoming}</option>
        <option value="paid">{t.bills.paid}</option>
        <option value="overdue">{t.bills.overdue}</option>
      </Select>
      <Input placeholder={t.forms.categoryLabel} {...form.register("category")} />
      <label className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
        <input type="checkbox" {...form.register("auto_renew")} /> {t.forms.autoRenew}
      </label>
      <Textarea rows={3} placeholder={t.forms.note} {...form.register("note")} />
      {serverError ? <p className="text-sm text-[var(--danger)]">{serverError}</p> : null}
      <Button type="submit" className="w-full sm:w-auto">
        {id ? t.forms.save : t.forms.add}
      </Button>
    </form>
  );
}
