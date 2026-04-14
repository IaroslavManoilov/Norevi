"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { transactionSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/i18n-provider";

type TransactionValues = z.input<typeof transactionSchema>;

export function TransactionForm({
  categories,
  defaultValues,
  id,
}: {
  categories: { id: string; name: string; type: "income" | "expense" }[];
  defaultValues?: Partial<TransactionValues>;
  id?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useI18n();

  const form = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      title: "",
      note: "",
      category_id: null,
      transaction_date: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    const method = id ? "PATCH" : "POST";
    const url = id ? `/api/finance/${id}` : "/api/finance";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: null }));
      if (data.error === "validation_error") {
        setServerError(t.errors.validation.generic);
      } else {
        setServerError(t.errors.saveTransaction);
      }
      return;
    }

    router.push("/finance");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Select {...form.register("type")}>
        <option value="expense">{t.forms.typeExpense}</option>
        <option value="income">{t.forms.typeIncome}</option>
      </Select>
      <Input type="number" step="0.01" placeholder={t.forms.amount} {...form.register("amount", { valueAsNumber: true })} />
      <Input placeholder={t.forms.title} {...form.register("title")} />
      <Select {...form.register("category_id")}>
        <option value="">{t.forms.categoryNone}</option>
        {categories
          .filter((c) => c.type === type)
          .map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </Select>
      <Input type="date" {...form.register("transaction_date")} />
      <Textarea rows={3} placeholder={t.forms.note} {...form.register("note")} />
      {serverError ? <p className="text-sm text-[var(--danger)]">{serverError}</p> : null}
      <Button type="submit" className="w-full sm:w-auto">
        {id ? t.forms.save : t.forms.add}
      </Button>
    </form>
  );
}
